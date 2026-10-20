"use client";

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
   */
  private playFmTone(
    freq: number,
    modRatio: number,
    modDepth: number,
    duration: number,
    startTime: number,
    volume: number = 0.1
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
      modulator.stop(startTime + duration + 0.02);
      carrier.stop(startTime + duration + 0.02);
    } catch {
      // ignore audio errors
    }
  }

  /**
   * 【案A: PC-98風クリスタル・タップ】澄んだ硬質ガラスのようなUIタップ音
   */
  public playTap() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // C7 (2093Hz) + ratio 2.0 による極短ディケイのクリスタル・キータップ
    this.playFmTone(2093, 2.0, 950, 0.055, now, 0.12);
  }

  /**
   * 【案A: PC-98風クリスタルベル・アルペジオ】正解コンボ音（コンボ数で倍音・ピッチが上昇）
   */
  public playWeakHit(combo: number = 1, isRevenge: boolean = false) {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // コンボが繋がるほどピッチが上がり、倍音の煌めきが深まる
    const baseBoost = Math.min(combo * 32, 320);

    const notes = isRevenge
      // リベンジ正解時: 5重のDX7クリスタルチャイムによる華麗な祝祭和音
      ? [
          { f: 1046.5, t: 0, d: 0.18, depth: 2200 },
          { f: 1318.5, t: 0.035, d: 0.18, depth: 2500 },
          { f: 1567.98, t: 0.07, d: 0.22, depth: 2800 },
          { f: 2093.0, t: 0.105, d: 0.28, depth: 3200 },
          { f: 2637.0, t: 0.14, d: 0.35, depth: 3600 },
        ]
      // 通常正解時: 澄んだ透明感あふれる3重FMクリスタルベル
      : [
          { f: 880 + baseBoost, t: 0, d: 0.14, depth: 1400 },
          { f: 1108.73 + baseBoost, t: 0.035, d: 0.16, depth: 1700 },
          { f: 1318.51 + baseBoost, t: 0.07, d: 0.22, depth: 2000 },
        ];

    notes.forEach((n) => {
      this.playFmTone(
        n.f,
        3.5, // DX7系クリスタルベル倍音比率
        n.depth,
        n.d,
        now + n.t,
        isRevenge ? 0.09 : 0.075
      );
    });
  }

  /**
   * 【案A: PC-98風FMメタリック・クラベス】ミス時・倍返しロック警告音
   */
  public playBountyLock() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // 非整数倍音 (ratio 1.414) による耳障りのない硬質で上品なメタリック・アタック
    this.playFmTone(440, 1.414, 700, 0.07, now, 0.08);
    this.playFmTone(330, 1.414, 550, 0.09, now + 0.05, 0.07);
  }

  /**
   * 【案A: PC-98/FM TOWNS風 FMシンセ・グリッサンド】出撃・BATTLE START音
   */
  public playAllOutIntro() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // 疾走感あふれる6重FMシンセ・チャイムの駆け上がり
    const arpeggio = [
      { f: 523.25, t: 0, d: 0.12 },
      { f: 659.25, t: 0.038, d: 0.14 },
      { f: 783.99, t: 0.076, d: 0.16 },
      { f: 1046.5, t: 0.114, d: 0.20 },
      { f: 1318.5, t: 0.152, d: 0.24 },
      { f: 1567.98, t: 0.19, d: 0.35 },
    ];

    arpeggio.forEach((n) => {
      this.playFmTone(n.f, 2.0, 1300, n.d, now + n.t, 0.085);
    });
  }

  /**
   * 【案A: DX7名機風 クリスタルベル・ファンファーレ】レベルアップ・進化ファンファーレ
   */
  public playEvolutionFanfare() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // YAMAHA DX7のグロッケン＆FMエレピを彷彿とさせる祝祭アルペジオ
    const melody = [
      { f: 523.25, t: 0, d: 0.16, r: 2.0, depth: 1400 },
      { f: 659.25, t: 0.09, d: 0.16, r: 2.0, depth: 1500 },
      { f: 783.99, t: 0.18, d: 0.18, r: 2.0, depth: 1600 },
      { f: 1046.5, t: 0.27, d: 0.28, r: 3.5, depth: 2200 },
      { f: 987.77, t: 0.48, d: 0.14, r: 2.0, depth: 1600 },
      { f: 1046.5, t: 0.58, d: 0.55, r: 3.5, depth: 2800 },
    ];

    melody.forEach((n) => {
      this.playFmTone(n.f, n.r, n.depth, n.d, now + n.t, 0.11);
    });
  }
}

export const soundEngine = new SoundEngine();
