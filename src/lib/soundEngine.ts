"use client";

import { bgmController } from "./bgmController";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private speakingListeners: Set<(isSpeaking: boolean, text: string) => void> =
    new Set();
  private currentText: string = "";
  private isCurrentlySpeaking: boolean = false;

  // ★ Google TTS 単一ナチュラル音声のオンメモリキャッシュ
  private audioBufferCache: Map<string, AudioBuffer> = new Map();
  private rawMp3Cache: Map<string, ArrayBuffer> = new Map();
  private pendingFetches: Map<string, Promise<AudioBuffer | null>> = new Map();
  private activeSourceNode: AudioBufferSourceNode | null = null;
  private speechRequestId: number = 0;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * スマホ（iOS Safari / Chrome）のオーディオ制限をユーザータップ時に確実にアンロックする
   */
  public unlockAudio() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    } catch {
      // ignore
    }
  }

  /**
   * 熟語表記に含まれる記号（[~], [to do], (back), ... 等）を音声読み上げ用に自然化する
   */
  private sanitizeForTts(text: string): string {
    return text
      .replace(/\[.*?\]/g, "")
      .replace(/[()]/g, "")
      .replace(/[~〜…]{1,3}/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  private normalizeKey(text: string, isSlow: boolean = false): string {
    const base = this.sanitizeForTts(text).toLowerCase();
    return isSlow ? `${base}__slow` : base;
  }

  /**
   * 指定した英単語・英文のMP3を `/api/tts` (Google TTS) から取得し、Web Audio API の AudioBuffer にデコードしてメモリキャッシュする
   * - 100% Google TTS の自然な単一ボイスのみを使用（機械音声への混在を完全防止）
   */
  private async fetchAndDecodeTts(
    text: string,
    isSlow: boolean = false
  ): Promise<AudioBuffer | null> {
    const clean = this.sanitizeForTts(text);
    if (!clean || typeof window === "undefined") return null;

    const key = this.normalizeKey(clean, isSlow);
    const cached = this.audioBufferCache.get(key);
    if (cached) return cached;

    const existingPromise = this.pendingFetches.get(key);
    if (existingPromise) return existingPromise;

    const promise = (async (): Promise<AudioBuffer | null> => {
      try {
        let arrayBuffer = this.rawMp3Cache.get(key) || null;

        if (!arrayBuffer) {
          const url = `/api/tts?q=${encodeURIComponent(clean)}${
            isSlow ? "&slow=1" : ""
          }`;
          for (let attempt = 0; attempt < 2; attempt++) {
            try {
              const res = await fetch(url);
              if (res.ok) {
                const buf = await res.arrayBuffer();
                if (buf.byteLength > 100) {
                  arrayBuffer = buf;
                  this.rawMp3Cache.set(key, buf);
                  break;
                }
              }
            } catch {
              // retry once
            }
            await new Promise((r) => setTimeout(r, 60));
          }
        }

        if (!arrayBuffer) return null;

        const ctx = this.getContext();
        if (!ctx) return null;

        // decodeAudioData でメモリ上の AudioBuffer に変換（slice(0)で元バッファを保護）
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
        this.audioBufferCache.set(key, audioBuffer);
        return audioBuffer;
      } catch {
        return null;
      } finally {
        this.pendingFetches.delete(key);
      }
    })();

    this.pendingFetches.set(key, promise);
    return promise;
  }

  /**
   * バトル開始時に、出題される約12語分の Google TTS 音声を出題順（1問目最優先）でプリロードする
   * - 同時リクエスト数を制御（最大3並列）することで、1問目を最速で完了させつつ Google TTS のレート制限を確実に回避
   */
  public preloadTexts(texts: string[]) {
    if (typeof window === "undefined") return;
    this.unlockAudio();

    const uniqueTexts = Array.from(
      new Set(
        texts
          .map((t) => (t || "").trim())
          .filter((t) => t.length > 0 && t.length <= 240)
      )
    );

    if (uniqueTexts.length === 0) return;

    // 1問目・2問目を最優先で即座にプリロード開始し、残りを3並列キューで順次プリロード
    const queue = [...uniqueTexts];
    const concurrency = 3;

    const worker = async () => {
      while (queue.length > 0) {
        const nextText = queue.shift();
        if (!nextText) break;
        await this.fetchAndDecodeTts(nextText, false);
      }
    };

    for (let i = 0; i < Math.min(concurrency, uniqueTexts.length); i++) {
      void worker();
    }
  }

  public setMuted(mute: boolean) {
    this.muted = mute;
    bgmController.setMuted(mute);
    if (mute) {
      this.stopSpeech();
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public isSpeaking(): boolean {
    return this.isCurrentlySpeaking;
  }

  public getCurrentSpeakingText(): boolean | string {
    return this.currentText;
  }

  public onSpeakingChange(
    listener: (isSpeaking: boolean, text: string) => void
  ): () => void {
    this.speakingListeners.add(listener);
    listener(this.isCurrentlySpeaking, this.currentText);
    return () => {
      this.speakingListeners.delete(listener);
    };
  }

  private notifySpeaking(speaking: boolean, text: string) {
    this.isCurrentlySpeaking = speaking;
    this.currentText = speaking ? text : "";
    // 英語音声（TTS）が流れている間は BGM を reading ローパスフィルターへ滑らかに移行
    bgmController.setReadingState(speaking, "tts_speaking");
    this.speakingListeners.forEach((fn) => {
      try {
        fn(speaking, this.currentText);
      } catch {
        // ignore listener errors
      }
    });
  }

  /**
   * 発話を安全に停止する
   */
  public stopSpeech() {
    this.speechRequestId += 1;

    if (this.activeSourceNode) {
      try {
        this.activeSourceNode.onended = null;
        this.activeSourceNode.stop();
        this.activeSourceNode.disconnect();
      } catch {
        // ignore
      }
      this.activeSourceNode = null;
    }

    this.notifySpeaking(false, "");
  }

  /**
   * AudioBuffer を Web Audio API で再生する
   * - playbackRate は常に 1.0（原音ピッチ）を維持し、ピッチ変化による機械的な声割れを100%防止
   */
  private playDecodedBuffer(
    buffer: AudioBuffer,
    text: string,
    reqId: number,
    callbacks?: { onStart?: () => void; onEnd?: () => void }
  ): boolean {
    const ctx = this.getContext();
    if (!ctx || reqId !== this.speechRequestId) {
      callbacks?.onEnd?.();
      return false;
    }

    try {
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      // ★ ピッチ（声の高さ・質）が機械的に歪むのを防ぐため、常に 1.0 (自然な原音) で再生
      source.playbackRate.value = 1.0;

      const gainNode = ctx.createGain();
      gainNode.gain.value = 1.25;

      source.connect(gainNode);
      gainNode.connect(ctx.destination);

      this.activeSourceNode = source;
      this.notifySpeaking(true, text);
      callbacks?.onStart?.();

      source.onended = () => {
        if (this.activeSourceNode === source) {
          this.activeSourceNode = null;
        }
        if (reqId === this.speechRequestId) {
          this.notifySpeaking(false, "");
        }
        callbacks?.onEnd?.();
      };

      source.start(0);
      return true;
    } catch {
      this.activeSourceNode = null;
      this.notifySpeaking(false, "");
      return false;
    }
  }

  /**
   * 英語音声再生（100% Google TTS ナチュラル音声に統一）
   * - rate < 0.85（0.7xスローボタン等）の時は Google TTS ネイティブのゆっくり発音 (slow=1) を取得して原音ピッチで再生
   * - ブラウザ内蔵の機械的な speechSynthesis や低音質辞書音声は一切混ぜない
   */
  public speakEnglish(
    text: string,
    rate: number = 1.0,
    callbacks?: { onStart?: () => void; onEnd?: () => void }
  ) {
    const clean = (text || "").trim();
    if (this.muted || typeof window === "undefined" || !clean) {
      callbacks?.onEnd?.();
      return;
    }

    this.stopSpeech();
    const myReqId = this.speechRequestId;
    const isSlow = rate < 0.85;

    // 1. すでにプリロードキャッシュにある場合は、同期処理のままラグ0秒で即再生
    const key = this.normalizeKey(clean, isSlow);
    const cachedBuffer = this.audioBufferCache.get(key);
    if (cachedBuffer) {
      this.playDecodedBuffer(cachedBuffer, clean, myReqId, callbacks);
      return;
    }

    // 2. キャッシュにない場合は `/api/tts` (Google TTS) から取得＆デコードして再生
    void this.fetchAndDecodeTts(clean, isSlow).then((buffer) => {
      if (myReqId !== this.speechRequestId || this.muted) {
        callbacks?.onEnd?.();
        return;
      }

      if (buffer) {
        this.playDecodedBuffer(buffer, clean, myReqId, callbacks);
      } else {
        this.notifySpeaking(false, "");
        callbacks?.onEnd?.();
      }
    });
  }

  /**
   * 2オペレータFM合成エンジン（Carrier × Modulator）
   * - YAMAHA DX7 / PC-9801 (YM2608/OPNA) の澄んだクリスタルベル・金属倍音をWeb Audio APIでリアルタイム合成
   * @param freq キャリア周波数 (Hz)
   * @param modRatio モジュレータ比率 (キャリアに対する周波数倍率。例: 2.0=オクターブ, 3.5=クリスタルベル倍音)
   * @param modDepth モジュレーション深度 (変調指数の初期ゲイン)
   * @param duration 持続時間 (秒)
   * @param startTime 開始時刻 (ctx.currentTime 基準)
   * @param volume 出力音量 (0.0〜1.0)
   * @param endFreq 終了時キャリア周波数 (Hz。周波数スウィープ・ピッチベンド用)
   */
  private playFmTone(
    freq: number,
    modRatio: number,
    modDepth: number,
    duration: number,
    startTime: number,
    volume: number = 0.1,
    endFreq?: number
  ) {
    const ctx = this.getContext();
    if (!ctx || this.muted) return;

    try {
      const carrier = ctx.createOscillator();
      const modulator = ctx.createOscillator();
      const modGain = ctx.createGain();
      const masterGain = ctx.createGain();

      carrier.type = "sine";
      modulator.type = "sine";

      carrier.frequency.setValueAtTime(freq, startTime);
      modulator.frequency.setValueAtTime(freq * modRatio, startTime);

      if (endFreq && endFreq !== freq) {
        carrier.frequency.exponentialRampToValueAtTime(
          Math.max(20, endFreq),
          startTime + duration
        );
        modulator.frequency.exponentialRampToValueAtTime(
          Math.max(20, endFreq * modRatio),
          startTime + duration
        );
      }

      // モジュレータのエンベロープ（アタック時に金属的な鋭いFM倍音を生み、指数関数的にサイン波の余韻へと減衰）
      modGain.gain.setValueAtTime(modDepth, startTime);
      modGain.gain.exponentialRampToValueAtTime(
        Math.max(1, modDepth * 0.01),
        startTime + duration * 0.65
      );
      modGain.gain.linearRampToValueAtTime(0, startTime + duration);

      // キャリア（音量）のエンベロープ
      masterGain.gain.setValueAtTime(volume, startTime);
      masterGain.gain.exponentialRampToValueAtTime(
        0.0001,
        startTime + duration
      );

      // FM変調ルーティング: Modulator -> ModGain -> Carrier.frequency
      modulator.connect(modGain);
      modGain.connect(carrier.frequency);

      // マスター出力: Carrier -> MasterGain -> Destination
      carrier.connect(masterGain);
      masterGain.connect(ctx.destination);

      modulator.start(startTime);
      carrier.start(startTime);
      modulator.stop(startTime + duration + 0.03);
      carrier.stop(startTime + duration + 0.03);
    } catch {
      // ignore audio errors
    }
  }

  // =========================================================================
  // ★ Argon Modern Electro-Pop × 8-bit Pixel Hybrid Synthesizer Primitives
  // BGM "Shibuya Rush" の調性（F# Major / D#m7 / C#add9 黒鍵ペンタトニック）に完全同期
  // =========================================================================

  /**
   * 1. モダン・ウォーム・プラック（Future Bass / 渋谷系エレピ＆クリスタルマレット＋微細8bit倍音）
   * - Triangle + デチューン Sawtooth をローパス・エンベロープに通し、丸みと透明感のある現代的な打鍵音を生成
   * - pixelLayer=true の場合、帯域制限された極小の矩形波（8bitチップ感）を隠し味としてブレンド
   */
  private playModernPluck(
    freq: number,
    startTime: number,
    duration: number = 0.22,
    volume: number = 0.14,
    options?: {
      pixelLayer?: boolean;
      pitchBendTo?: number;
      brightness?: number;
    }
  ) {
    const ctx = this.getContext();
    if (!ctx || this.muted) return;

    try {
      const t0 = Math.max(ctx.currentTime, startTime);
      const brightness = options?.brightness ?? 6.0;

      // メインボディ (Triangle) + リッチ倍音 (Detuned Sawtooth)
      const oscMain = ctx.createOscillator();
      const oscWarm = ctx.createOscillator();
      oscMain.type = "triangle";
      oscWarm.type = "sawtooth";
      oscWarm.detune.setValueAtTime(7, t0); // +7 cents で立体的なコーラス感

      oscMain.frequency.setValueAtTime(freq, t0);
      oscWarm.frequency.setValueAtTime(freq, t0);

      if (options?.pitchBendTo && options.pitchBendTo !== freq) {
        oscMain.frequency.exponentialRampToValueAtTime(
          Math.max(20, options.pitchBendTo),
          t0 + duration * 0.75
        );
        oscWarm.frequency.exponentialRampToValueAtTime(
          Math.max(20, options.pitchBendTo),
          t0 + duration * 0.75
        );
      }

      // モダン・ローパス・プラックフィルター（アタック時にキラッと開き、滑らかに丸まる）
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      const startCutoff = Math.min(18000, Math.max(800, freq * brightness));
      const endCutoff = Math.max(280, freq * 1.15);
      filter.frequency.setValueAtTime(startCutoff, t0);
      filter.frequency.exponentialRampToValueAtTime(
        endCutoff,
        t0 + Math.min(0.14, duration * 0.65)
      );
      filter.Q.setValueAtTime(1.4, t0);

      const gainMain = ctx.createGain();
      const gainWarm = ctx.createGain();
      const masterGain = ctx.createGain();

      gainMain.gain.setValueAtTime(0.75, t0);
      gainWarm.gain.setValueAtTime(0.28, t0);

      // クリックノイズを防ぐ2msソフトアタック ＋ 滑らかなディケイ
      masterGain.gain.setValueAtTime(0.0001, t0);
      masterGain.gain.linearRampToValueAtTime(volume, t0 + 0.003);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

      oscMain.connect(gainMain);
      oscWarm.connect(gainWarm);
      gainMain.connect(filter);
      gainWarm.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      oscMain.start(t0);
      oscWarm.start(t0);
      oscMain.stop(t0 + duration + 0.02);
      oscWarm.stop(t0 + duration + 0.02);

      // ドット絵のゲーム感を残す、耳に優しいモダン8bitチップ・レイヤー
      if (options?.pixelLayer) {
        const oscPixel = ctx.createOscillator();
        const pixelFilter = ctx.createBiquadFilter();
        const pixelGain = ctx.createGain();

        oscPixel.type = "square";
        oscPixel.frequency.setValueAtTime(freq * 2.0, t0); // 1オクターブ上のキラキラ装飾
        pixelFilter.type = "bandpass";
        pixelFilter.frequency.setValueAtTime(Math.min(5500, freq * 2.2), t0);
        pixelFilter.Q.setValueAtTime(1.8, t0);

        const pixDur = Math.min(0.085, duration * 0.5);
        pixelGain.gain.setValueAtTime(0.0001, t0);
        pixelGain.gain.linearRampToValueAtTime(volume * 0.16, t0 + 0.002);
        pixelGain.gain.exponentialRampToValueAtTime(0.0001, t0 + pixDur);

        oscPixel.connect(pixelFilter);
        pixelFilter.connect(pixelGain);
        pixelGain.connect(ctx.destination);

        oscPixel.start(t0);
        oscPixel.stop(t0 + pixDur + 0.01);
      }
    } catch {
      // ignore
    }
  }

  /**
   * 2. Future Bass / 渋谷系エレクトロポップ・スーパーコードパッド（フィルター・スウェル付き）
   */
  private playFutureChord(
    freqs: number[],
    startTime: number,
    duration: number = 0.55,
    volumePerNote: number = 0.045,
    swellPeakSec: number = 0.08
  ) {
    const ctx = this.getContext();
    if (!ctx || this.muted) return;

    try {
      const t0 = Math.max(ctx.currentTime, startTime);
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      // Future Bass 特有の「フワッ・キラッ」と開くフィルターエンベロープ
      filter.frequency.setValueAtTime(750, t0);
      filter.frequency.exponentialRampToValueAtTime(6400, t0 + swellPeakSec);
      filter.frequency.exponentialRampToValueAtTime(1400, t0 + duration);
      filter.Q.setValueAtTime(1.6, t0);

      const chordGain = ctx.createGain();
      chordGain.gain.setValueAtTime(0.0001, t0);
      chordGain.gain.linearRampToValueAtTime(1.0, t0 + 0.012);
      chordGain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

      filter.connect(chordGain);
      chordGain.connect(ctx.destination);

      freqs.forEach((f, idx) => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc1.type = "sawtooth";
        osc2.type = "triangle";
        osc1.detune.setValueAtTime(idx % 2 === 0 ? -8 : 8, t0);
        osc2.detune.setValueAtTime(idx % 2 === 0 ? 6 : -6, t0);

        osc1.frequency.setValueAtTime(f, t0);
        osc2.frequency.setValueAtTime(f, t0);

        noteGain.gain.setValueAtTime(volumePerNote, t0);
        osc1.connect(noteGain);
        osc2.connect(noteGain);
        noteGain.connect(filter);

        osc1.start(t0);
        osc2.start(t0);
        osc1.stop(t0 + duration + 0.02);
        osc2.stop(t0 + duration + 0.02);
      });
    } catch {
      // ignore
    }
  }

  /**
   * 3. 8-bit ピクセル・クリスタル・スパークル（ドット絵の世界観を彩る現代風チップアルペジオ粒）
   */
  private playPixelSparkle(
    freq: number,
    startTime: number,
    duration: number = 0.09,
    volume: number = 0.065
  ) {
    const ctx = this.getContext();
    if (!ctx || this.muted) return;

    try {
      const t0 = Math.max(ctx.currentTime, startTime);
      const oscSq = ctx.createOscillator();
      const oscSine = ctx.createOscillator();
      oscSq.type = "square";
      oscSine.type = "sine";

      oscSq.frequency.setValueAtTime(freq, t0);
      oscSine.frequency.setValueAtTime(freq * 2.0, t0);

      // 耳に刺さらないようローパスで角を丸める
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(Math.min(7200, freq * 3.2), t0);
      filter.Q.setValueAtTime(1.0, t0);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.linearRampToValueAtTime(volume, t0 + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

      oscSq.connect(filter);
      oscSine.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      oscSq.start(t0);
      oscSine.start(t0);
      oscSq.stop(t0 + duration + 0.015);
      oscSine.stop(t0 + duration + 0.015);
    } catch {
      // ignore
    }
  }

  /**
   * 4. シルキー・エア・スワイプ（現代UIらしい滑らかな風切りトランジション・ノイズ）
   */
  private playSilkySwipe(
    startFreq: number,
    endFreq: number,
    startTime: number,
    duration: number = 0.12,
    volume: number = 0.08
  ) {
    const ctx = this.getContext();
    if (!ctx || this.muted) return;

    try {
      const t0 = Math.max(ctx.currentTime, startTime);
      const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * duration));
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(Math.max(80, startFreq), t0);
      filter.frequency.exponentialRampToValueAtTime(
        Math.max(80, endFreq),
        t0 + duration
      );
      filter.Q.setValueAtTime(2.4, t0);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.linearRampToValueAtTime(volume, t0 + duration * 0.25);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(t0);
      noise.stop(t0 + duration + 0.01);
    } catch {
      // ignore
    }
  }

  /**
   * 5. タイト・モダン・ポップキック（F#キーのサブベースに調和するソフトなパンチ）
   */
  private playModernKick(startTime: number, volume: number = 0.2) {
    const ctx = this.getContext();
    if (!ctx || this.muted) return;

    try {
      const t0 = Math.max(ctx.currentTime, startTime);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      // F#3 (185Hz) -> F#1 (46.25Hz)
      osc.type = "sine";
      osc.frequency.setValueAtTime(185.0, t0);
      osc.frequency.exponentialRampToValueAtTime(46.25, t0 + 0.11);

      gain.gain.setValueAtTime(volume, t0);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t0);
      osc.stop(t0 + 0.15);
    } catch {
      // ignore
    }
  }

  /**
   * 【UIタップ音】BGM（F# Major）に調和するソフト・クリスタル＆ウッド・プラック
   */
  public playTap() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // F#6 (1479.98Hz) の丸みのあるプラック ＋ C#7 (2217.46Hz) の極短シマー
    this.playModernPluck(1479.98, now, 0.055, 0.1, { brightness: 4.5 });
    this.playPixelSparkle(2217.46, now + 0.006, 0.035, 0.03);
  }

  /**
   * ①【ステージ選択時のスタートサウンド】
   * - BGM "Shibuya Rush" (F# Major / C#add9) と完璧にハモる Future Bass コードスタブ ＆ 8bitピクセル・グリッサンド！
   */
  public playStageStart() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. タイトなモダン・キックパンチ ＆ シルキーな上昇エア・スウィッシュ
    this.playModernKick(now, 0.22);
    this.playSilkySwipe(350, 4800, now, 0.26, 0.09);

    // 2. Future Bass F#maj9 コード・スウェル (F#4, A#4, C#5, F5, G#5)
    this.playFutureChord(
      [369.99, 466.16, 554.37, 698.46, 830.61],
      now + 0.02,
      0.52,
      0.048,
      0.09
    );

    // 3. ドット絵の勇者が飛び出す 8bit×Modern Crystal ペンタトニック・アルペジオ
    const arp = [
      { f: 554.37, t: 0.0 },   // C#5
      { f: 622.25, t: 0.032 }, // D#5
      { f: 739.99, t: 0.064 }, // F#5
      { f: 830.61, t: 0.096 }, // G#5
      { f: 932.33, t: 0.128 }, // A#5
      { f: 1108.73, t: 0.16 }, // C#6
      { f: 1479.98, t: 0.195 }, // F#6 (Top Note)
    ];

    arp.forEach((n, idx) => {
      const isTop = idx === arp.length - 1;
      this.playModernPluck(n.f, now + n.t, isTop ? 0.42 : 0.16, isTop ? 0.13 : 0.085, {
        pixelLayer: true,
        brightness: 6.5,
      });
    });

    // トップノートのキラキラ・ディレイエコー余韻 (F#6 -> C#7)
    this.playPixelSparkle(2217.46, now + 0.25, 0.22, 0.055);
    this.playModernPluck(1479.98, now + 0.29, 0.3, 0.05, { brightness: 4.0 });
  }

  /**
   * 総攻撃・バトルスタート共通イントロ（playStageStartへ統合）
   */
  public playAllOutIntro() {
    this.playStageStart();
  }

  /**
   * ②【問題に正解した時のサウンド】
   * - BGMのキー（F# Major ペンタトニック）に完全ロックオン！
   * - コンボが繋がるごとに不協和音にならず、F# Major スケール上のボイシングが音楽的にステップアップ！
   * - Modern Pluck (エレピ/マレット) ＋ Crystal Bell ＋ 8bit Pixel Grace Note のハイブリッド
   */
  public playWeakHit(combo: number = 1, isRevenge: boolean = false) {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (isRevenge) {
      // ★ リベンジ（倍返し）正解時：ゴージャスな F#maj9 Future Chord ＆ 煌めくクリスタル・アルペジオ！
      this.playModernKick(now, 0.18);
      this.playSilkySwipe(600, 5200, now, 0.2, 0.07);
      this.playFutureChord(
        [369.99, 554.37, 698.46, 830.61, 932.33, 1108.73],
        now + 0.015,
        0.55,
        0.045,
        0.07
      );

      const revNotes = [
        { f: 739.99, t: 0.0 },   // F#5
        { f: 932.33, t: 0.035 }, // A#5
        { f: 1108.73, t: 0.07 }, // C#6
        { f: 1396.91, t: 0.105 }, // F6 (maj7)
        { f: 1479.98, t: 0.14 }, // F#6
        { f: 1864.66, t: 0.175 }, // A#6
        { f: 2217.46, t: 0.21 }, // C#7
      ];

      revNotes.forEach((n, i) => {
        const isLast = i === revNotes.length - 1;
        this.playModernPluck(n.f, now + n.t, isLast ? 0.45 : 0.22, 0.12, {
          pixelLayer: true,
          brightness: 7.0,
        });
      });
      // ディレイ・スパークル余韻
      this.playPixelSparkle(2959.96, now + 0.27, 0.25, 0.055); // F#7
      return;
    }

    // ★ 通常正解時：コンボ数に応じて F# Major スケール上で美しくボイシングが上昇する5段階テーブル
    const comboVoicings: number[][] = [
      // Stage 1 (Combo 1): F# add9 (F#5 -> A#5 -> C#6 -> F#6)
      [739.99, 932.33, 1108.73, 1479.98],
      // Stage 2 (Combo 2): G#m7 / C#9 (G#5 -> B5/C#6 -> D#6 -> G#6)
      [830.61, 1108.73, 1244.51, 1661.22],
      // Stage 3 (Combo 3): A#m7 / F#maj7 (A#5 -> C#6 -> F6 -> A#6)
      [932.33, 1108.73, 1396.91, 1864.66],
      // Stage 4 (Combo 4): C# add9 (C#6 -> F6 -> G#6 -> C#7)
      [1108.73, 1396.91, 1661.22, 2217.46],
      // Stage 5+ (Combo 5+): F#maj9 High Sparkle (C#6 -> F6 -> F#6 -> A#6 -> C#7)
      [1108.73, 1396.91, 1479.98, 1864.66, 2217.46],
    ];

    const stageIdx = Math.min(Math.max(0, combo - 1), comboVoicings.length - 1);
    const notes = comboVoicings[stageIdx];

    // 心地よいソフト・サブアタック
    this.playModernPluck(notes[0] * 0.5, now, 0.16, 0.07, { brightness: 3.0 });

    notes.forEach((f, idx) => {
      const tOffset = idx * 0.036;
      const isTop = idx === notes.length - 1;
      const dur = isTop ? 0.34 : 0.18;
      this.playModernPluck(f, now + tOffset, dur, isTop ? 0.135 : 0.105, {
        pixelLayer: idx >= notes.length - 2,
        brightness: 6.2,
      });
    });

    // トップノートの心地よいエコー（ディレイ）余韻と8bitスパークル粒
    const topFreq = notes[notes.length - 1];
    const topTime = (notes.length - 1) * 0.036;
    this.playPixelSparkle(topFreq * 1.5, now + topTime + 0.03, 0.16, 0.045);
    this.playModernPluck(topFreq, now + topTime + 0.095, 0.22, 0.048, {
      brightness: 3.5,
    });
  }

  /**
   * ④【次の問題に進む時のサウンド】
   * - カードが軽やかに切り替わる「シュッ・コロン♪」（シルキー・エアスワイプ ＋ F#ペンタトニックの2連水滴プラック）
   */
  public playTransition() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // 1. 軽やかなシルキー・カードスワイプ風切り音 (650Hz -> 3400Hz)
    this.playSilkySwipe(650, 3400, now, 0.095, 0.065);

    // 2. BGMに溶け込む2連ソフト水滴プラック: C#6 (1108.73Hz) -> F#6 (1479.98Hz)
    this.playModernPluck(1108.73, now + 0.01, 0.11, 0.09, {
      brightness: 4.5,
    });
    this.playModernPluck(1479.98, now + 0.048, 0.16, 0.11, {
      pixelLayer: true,
      brightness: 5.2,
    });
  }

  /**
   * ③【問題に不正解した時のサウンド】
   * - 昔の耳障りなブザー音を排し、ローパスが効いたクールで都会的なエレクトリック・ローズ／ミュートプラックの2連下降音（「トコン…」）
   * - BGMのキー（D#m7 / F#）に調和し、ミスしてもストレスなく次へ向かえるモダンな質感
   */
  public playBountyLock() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1音目: A#4 (466.16Hz) + D#4 (311.13Hz) わずかにピッチダウンする丸いミュートプラック
    this.playModernPluck(466.16, now, 0.12, 0.12, {
      pitchBendTo: 448.0,
      brightness: 2.8,
      pixelLayer: true,
    });
    this.playModernPluck(311.13, now, 0.12, 0.09, {
      brightness: 2.2,
    });

    // 2音目 (+0.075s): F#4 (369.99Hz) + B3 (246.94Hz) 温かく落ち着いたローパス余韻
    this.playModernPluck(369.99, now + 0.075, 0.22, 0.13, {
      pitchBendTo: 352.0,
      brightness: 2.4,
      pixelLayer: true,
    });
    this.playModernPluck(246.94, now + 0.075, 0.24, 0.1, {
      brightness: 2.0,
    });
  }

  /**
   * 【明るく元気いっぱい！ポップ学園出撃ジングル（約2.5秒）】
   * - 任天堂ゲームや学園アニメのような、最高に明るく弾ける快活ファンファーレ！
   * - ポップマリンバ ＆ キラキラ星チャイム ＆ 元気なブラスホーン ＆ 軽快なドラム
   * - 0.0s: ピロリンッ！ ポンッ！（元気な呼び出し）
   * - 0.4s: タカタカ〜ン♪（明るくスキップするようなマリンバ＆ブラスメロディ）
   * - 1.35s: タラララーン！ ジャン♪（晴れやかなキメファンファーレ ＆ キラキラ星）
   */
  public playStageEntrance(stageId: string = "stage-english") {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const isSocial = stageId === "stage-social";

    // -------------------------------------------------------------
    // Helper: 明るく軽快なポップドラム
    // -------------------------------------------------------------
    const playPopKick = (t: number) => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(140, now + t);
        osc.frequency.exponentialRampToValueAtTime(45, now + t + 0.12);
        gain.gain.setValueAtTime(0.3, now + t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + t);
        osc.stop(now + t + 0.15);
      } catch {}
    };

    const playPopSnare = (t: number) => {
      try {
        const bufferSize = ctx.sampleRate * 0.14;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = "highpass";
        filter.frequency.setValueAtTime(1200, now + t);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.14, now + t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.14);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(now + t);
        noise.stop(now + t + 0.14);
      } catch {}
    };

    // -------------------------------------------------------------
    // Helper: ポップマリンバ / 木琴（ポコポコ弾ける温かい音）
    // -------------------------------------------------------------
    const playMarimba = (freq: number, t: number, dur: number = 0.18, vol: number = 0.16) => {
      // 比 1:4、短く減衰するパーカッシブなトーン
      this.playFmTone(freq, 4.0, 800, dur, now + t, vol);
    };

    // -------------------------------------------------------------
    // Helper: キラキラ星チャイム（明るく澄んだベル音）
    // -------------------------------------------------------------
    const playSparkleChime = (freq: number, t: number, dur: number = 0.5, vol: number = 0.12) => {
      this.playFmTone(freq, 3.5, 1200, dur, now + t, vol);
    };

    // -------------------------------------------------------------
    // Helper: 元気なポップブラス（明るいホーン）
    // -------------------------------------------------------------
    const playPopBrass = (freq: number, t: number, dur: number = 0.28, vol: number = 0.15) => {
      this.playFmTone(freq, 1.0, 1600, dur, now + t, vol);
    };

    // =============================================================
    // 【Part 1: 0.0s 〜 0.35s】 ピロリンッ！ ポンッ！（元気な呼び出し）
    // =============================================================
    playPopKick(0.0);
    playSparkleChime(1046.50, 0.0, 0.35); // C6
    playSparkleChime(1318.51, 0.08, 0.35); // E6
    playSparkleChime(1567.98, 0.16, 0.45); // G6
    playMarimba(523.25, 0.08, 0.15); // C5
    playMarimba(659.25, 0.16, 0.15); // E5
    playMarimba(783.99, 0.24, 0.20); // G5

    // =============================================================
    // 【Part 2: 0.4s 〜 1.25s】 タカタカ〜ン♪（弾むマリンバ＆元気なブラス）
    // =============================================================
    playPopKick(0.42);
    playPopSnare(0.85);

    // 弾むマリンバ・アルペジオ（ド・ミ・ソ・ラ・高ド）
    const marimbaRiff = [
      { f: 523.25, t: 0.42 }, // C5
      { f: 659.25, t: 0.52 }, // E5
      { f: 783.99, t: 0.62 }, // G5
      { f: 880.00, t: 0.72 }, // A5
      { f: 1046.50, t: 0.85 }, // C6
      { f: 1174.66, t: 0.98 }, // D6
      { f: 1318.51, t: 1.10 }, // E6
    ];
    marimbaRiff.forEach((n) => {
      playMarimba(n.f, n.t, 0.18, 0.14);
      playSparkleChime(n.f * 1.5, n.t, 0.25, 0.06);
    });

    // 明るい元気なブラスハーモニー（0.55s〜）
    playPopBrass(523.25, 0.55, 0.22); // C5
    playPopBrass(659.25, 0.55, 0.22); // E5
    playPopBrass(587.33, 0.75, 0.22); // D5
    playPopBrass(698.46, 0.75, 0.22); // F5
    playPopBrass(659.25, 0.95, 0.25); // E5
    playPopBrass(783.99, 0.95, 0.25); // G5

    // =============================================================
    // 【Part 3: 1.35s 〜 2.1s】 タラララーン！ ジャン♪（晴れやかファンファーレ＆紙吹雪）
    // =============================================================
    playPopKick(1.35);
    playPopSnare(1.35);

    if (isSocial) {
      // 社会：金属バット快音
      setTimeout(() => {
        this.playBatCrack();
      }, 1350);
    }

    // 元気なキメフレーズ 1 (1.35s: Fコード)
    [349.23, 440.00, 523.25, 698.46].forEach((f) => {
      playPopBrass(f, 1.35, 0.18, 0.13);
    });

    // 元気なキメフレーズ 2 (1.52s: Gコード)
    [392.00, 493.88, 587.33, 783.99].forEach((f) => {
      playPopBrass(f, 1.52, 0.18, 0.14);
    });

    // 晴れやかな大ファンファーレ！ (1.70s〜2.4s: 輝く高音Cメジャーコード！)
    playPopKick(1.70);
    const victoryChord = [261.63, 523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
    victoryChord.forEach((f) => {
      playPopBrass(f, 1.70, 0.75, 0.12);
      playSparkleChime(f, 1.70, 0.85, 0.08);
    });

    // =============================================================
    // 【Part 4: 2.1s 〜 2.5s】 キラキラ星シャワーの余韻
    // =============================================================
    const sparkleShower = [
      { f: 1567.98, t: 2.05 }, // G6
      { f: 1760.00, t: 2.15 }, // A6
      { f: 2093.00, t: 2.25 }, // C7
    ];
    sparkleShower.forEach((s) => {
      playSparkleChime(s.f, s.t, 0.45, 0.09);
    });
  }

  /**
   * ⑤【ステージクリアでのサウンド】
   * - BGM "Shibuya Rush" (F# Major / D#m7 / C#add9) と完璧に一体化する
   *   Future Bass × 渋谷系エレクトロポップ × 8-bit ピクセルの祝祭クリアアンセム（約1.8秒）！
   */
  public playStageVictory() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // -------------------------------------------------------------
    // Part 1 (0.0s 〜 0.40s): 都会的で華やかなピックアップ・プラックアルペジオ (F#ペンタトニック)
    // -------------------------------------------------------------
    this.playModernKick(now, 0.22);
    this.playSilkySwipe(400, 4200, now, 0.35, 0.08);

    const pickupNotes = [
      { f: 554.37, t: 0.0 },   // C#5
      { f: 622.25, t: 0.065 }, // D#5
      { f: 739.99, t: 0.13 },  // F#5
      { f: 830.61, t: 0.195 }, // G#5
      { f: 932.33, t: 0.26 },  // A#5
      { f: 1108.73, t: 0.325 }, // C#6
    ];

    pickupNotes.forEach((n) => {
      this.playModernPluck(n.f, now + n.t, 0.22, 0.11, {
        pixelLayer: true,
        brightness: 6.5,
      });
    });

    // -------------------------------------------------------------
    // Part 2 (0.40s 〜 0.72s): 渋谷系グルーヴィー・シンコペーション・コードステップ
    // Step A (0.40s): Bmaj9 (B3, D#4, F#4, A#4, C#5, D#6)
    // Step B (0.56s): C#add9 (C#4, F4, G#4, C#5, D#5, F6)
    // -------------------------------------------------------------
    this.playModernKick(now + 0.40, 0.2);
    this.playFutureChord(
      [246.94, 311.13, 369.99, 466.16, 554.37],
      now + 0.40,
      0.24,
      0.042,
      0.04
    );
    this.playModernPluck(1244.51, now + 0.40, 0.22, 0.125, {
      pixelLayer: true,
      brightness: 7.0,
    }); // D#6

    this.playModernKick(now + 0.56, 0.2);
    this.playFutureChord(
      [277.18, 349.23, 415.30, 554.37, 622.25],
      now + 0.56,
      0.24,
      0.045,
      0.04
    );
    this.playModernPluck(1396.91, now + 0.56, 0.22, 0.13, {
      pixelLayer: true,
      brightness: 7.0,
    }); // F6

    // -------------------------------------------------------------
    // Part 3 (0.74s 〜 1.85s): クライマックス F#maj9 Future Bass Super Chord ＆ ピクセル・シャワー余韻！
    // -------------------------------------------------------------
    const climaxT = now + 0.74;
    this.playModernKick(climaxT, 0.26);
    this.playSilkySwipe(800, 6400, climaxT, 0.45, 0.09);

    // 温かく広がる F#maj9 スーパーコード (F#3, C#4, F#4, A#4, C#5, F5, G#5, C#6)
    this.playFutureChord(
      [185.00, 277.18, 369.99, 466.16, 554.37, 698.46, 830.61, 1108.73],
      climaxT,
      1.15,
      0.042,
      0.11
    );

    // トップメロディ解決音: F#6 (1479.98Hz) + ハーモニー A#5 (932.33Hz)
    this.playModernPluck(1479.98, climaxT, 0.95, 0.15, {
      pixelLayer: true,
      brightness: 7.5,
    });
    this.playModernPluck(932.33, climaxT, 0.85, 0.1, {
      brightness: 5.5,
    });

    // ドット絵の祝祭感を彩るキラキラ 8bit×Crystal スパークル・アルペジオシャワー (0.82s 〜 1.65s)
    const celebrationSparkles = [
      { f: 1108.73, t: 0.84 }, // C#6
      { f: 1396.91, t: 0.91 }, // F6
      { f: 1479.98, t: 0.98 }, // F#6
      { f: 1661.22, t: 1.05 }, // G#6
      { f: 1864.66, t: 1.12 }, // A#6
      { f: 2217.46, t: 1.20 }, // C#7
      { f: 2959.96, t: 1.30 }, // F#7
    ];

    celebrationSparkles.forEach((s, idx) => {
      const isLast = idx === celebrationSparkles.length - 1;
      this.playPixelSparkle(s.f, now + s.t, isLast ? 0.42 : 0.16, isLast ? 0.065 : 0.05);
      if (idx % 2 === 0 || isLast) {
        this.playModernPluck(s.f * 0.5, now + s.t, 0.3, 0.065, {
          brightness: 5.0,
        });
      }
    });
  }

  /**
   * レベルアップ・進化ファンファーレ（playStageVictoryと同一のモダン祝祭サウンド）
   */
  public playEvolutionFanfare() {
    this.playStageVictory();
  }

  // =========================================================================
  // ★ DopaSoc 熱闘！社会科ベースボール専用サウンドエフェクト
  // =========================================================================

  /**
   * 金属バット特有の爽快な「カキィィン！」打球音
   */
  public playBatCrack() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // 芯で捉えたインパクトの重低音 (180Hz)
    this.playFmTone(180, 0.5, 400, 0.08, now, 0.22, 60);
    // 金属バットの澄んだ高域共鳴 (2200Hz, ratio 2.76)
    this.playFmTone(2200, 2.76, 2500, 0.35, now, 0.25, 1800);
    // キーンと伸びる倍音余韻 (3500Hz)
    this.playFmTone(3500, 1.414, 1800, 0.45, now + 0.01, 0.18);
  }

  /**
   * クリーンヒット「パコーン！」
   */
  public playHit() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // 快音
    this.playFmTone(600, 1.5, 800, 0.12, now, 0.18, 900);
    this.playFmTone(1400, 2.0, 1200, 0.18, now + 0.01, 0.14);
  }

  /**
   * 特大ホームラン！快音＋スタジアム・オルガンファンファーレ
   */
  public playHomerun() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // 1. 強烈なカキーン音
    this.playBatCrack();

    // 2. スタジアム名物「チャージ！」風オルガンフレーズ (ド・ミ・ソ・ド・ソ・ド！)
    const fanfare = [
      { f: 523.25, t: 0.12, d: 0.1 },  // C5
      { f: 659.25, t: 0.22, d: 0.1 },  // E5
      { f: 783.99, t: 0.32, d: 0.1 },  // G5
      { f: 1046.5, t: 0.42, d: 0.22 }, // C6
      { f: 783.99, t: 0.58, d: 0.1 },  // G5
      { f: 1046.5, t: 0.68, d: 0.45 }, // C6 (ロングトーン)
    ];

    fanfare.forEach((n) => {
      this.playFmTone(n.f, 2.0, 1600, n.d, now + n.t, 0.15);
      this.playFmTone(n.f * 1.5, 3.5, 2000, n.d * 0.8, now + n.t, 0.08);
    });
  }

  /**
   * 空振り・ストライク（バットの風切り音＋ミットのバシッ音）
   */
  public playStrike() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // 風切りスイング音 (低域スウィープ)
    this.playFmTone(320, 0.8, 300, 0.1, now, 0.15, 80);
    // キャッチャーミット補球音
    this.playFmTone(140, 1.2, 500, 0.12, now + 0.06, 0.2, 50);
  }

  /**
   * アウト判定音
   */
  public playOut() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // 下降する2連トーン
    this.playFmTone(440, 1.414, 600, 0.14, now, 0.12, 330);
    this.playFmTone(330, 1.414, 500, 0.22, now + 0.12, 0.14, 220);
  }

  /**
   * プレイボールのサイレン／ホイッスル
   */
  public playPlayBall() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // サイレン上昇
    this.playFmTone(440, 2.0, 900, 0.4, now, 0.14, 880);
    this.playFmTone(880, 2.0, 1200, 0.35, now + 0.35, 0.16);
  }

  /**
   * スタジアムの地鳴りのような大歓声・どよめき（ホワイトノイズ＋バンドパスフィルタ）
   */
  public playCrowdCheer(isHuge: boolean = false) {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const duration = isHuge ? 1.6 : 0.9;
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // ホワイトノイズ生成
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // 観客の熱気を感じるバンドパスフィルタ (800Hz〜1500Hz)
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(1400, now + duration * 0.25);
      filter.frequency.exponentialRampToValueAtTime(650, now + duration);
      filter.Q.value = 1.6;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.005, now);
      gain.gain.linearRampToValueAtTime(isHuge ? 0.22 : 0.13, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + duration);
    } catch {
      // ignore
    }
  }

  /**
   * 【ノック捕球専用】グラブ捕球アタック音 ＋ 極上DX7風クリスタルチャイム
   * - カキーンという打球音ではなく、グラブに「バシィッ！」と収まる快音とDX7正解チャイム
   */
  public playKnockCatch(combo: number = 1) {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // 1. グラブ捕球の小気味よい「パシッ！」という革アタック音
    this.playFmTone(580, 1.414, 800, 0.05, now, 0.16, 120);

    // 2. 今まで通りの心地よいDX7風クリスタルチャイム（ピロリロリン！✨）
    this.playWeakHit(combo, combo >= 5);
  }

  /**
   * 【ノック後逸・エラー】トンネルしたときの残念音
   */
  public playKnockMiss() {
    this.playStrike();
  }
}

export const soundEngine = new SoundEngine();
