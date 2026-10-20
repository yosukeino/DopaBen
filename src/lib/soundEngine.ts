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
   * 【案A改: DX7風 華麗なクリスタルチャイム】正解コンボ音（より派手＆きらびやかに強化！）
   */
  public playWeakHit(combo: number = 1, isRevenge: boolean = false) {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // コンボが繋がるほどピッチが上がり、倍音の煌めきが深まる
    const baseBoost = Math.min(combo * 36, 360);

    if (isRevenge) {
      // リベンジ正解時: 金属アタック ＋ 6重のDX7クリスタルチャイムによる超ゴージャスな祝祭和音
      // アタックのメタリック・スパーク
      this.playFmTone(1760, 1.414, 3200, 0.06, now, 0.15, 3520);

      const notes = [
        { f: 1046.5, t: 0.015, d: 0.28, depth: 2600 }, // C6
        { f: 1318.5, t: 0.05, d: 0.30, depth: 3000 },  // E6
        { f: 1567.98, t: 0.085, d: 0.32, depth: 3400 }, // G6
        { f: 2093.0, t: 0.12, d: 0.38, depth: 3800 },  // C7
        { f: 2637.0, t: 0.155, d: 0.45, depth: 4200 }, // E7
        { f: 3135.96, t: 0.19, d: 0.55, depth: 4600 }, // G7
      ];

      notes.forEach((n) => {
        this.playFmTone(n.f, 3.5, n.depth, n.d, now + n.t, 0.14);
      });
    } else {
      // 通常正解時: 澄んだ透明感あふれる4重FMクリスタルベル ＋ 高音シマー（ピロリロリン！✨）
      const baseF = 880 + baseBoost;
      const notes = [
        { f: baseF, t: 0, d: 0.20, depth: 1800 },
        { f: baseF * 1.25, t: 0.038, d: 0.22, depth: 2200 }, // 長3度
        { f: baseF * 1.5, t: 0.076, d: 0.26, depth: 2500 },  // 完全5度
        { f: baseF * 2.0, t: 0.114, d: 0.36, depth: 3000 },  // オクターブ上
      ];

      notes.forEach((n) => {
        this.playFmTone(n.f, 3.5, n.depth, n.d, now + n.t, 0.14);
      });

      // 最高音のクリスタルシマー（余韻にきらめきを付加）
      this.playFmTone(baseF * 3.0, 2.0, 1500, 0.28, now + 0.114, 0.07);
    }
  }

  /**
   * 【案A: PC-98/FM TOWNS風 サイバートランジション音】次の問題へ進む（スライド・突入）時の爽快サウンド！
   */
  public playTransition() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // 1. 周波数が一瞬で駆け抜けるFMスウィープ（450Hz → 1650Hz / シュインッ！）
    this.playFmTone(450, 2.0, 1800, 0.13, now, 0.13, 1650);
    // 2. 高域のクリスタル・未来感ベル（2400Hz）がアクセントで煌めく
    this.playFmTone(2400, 3.5, 2200, 0.15, now + 0.04, 0.11);
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
   * 【案A改: YAMAHA FM音源黄金期風 王道ビクトリー・ファンファーレ】ステージクリア＆進化ファンファーレ
   * - ペルソナ風のメロディを完全排除！
   * - 従来の2.5倍以上の長さ（約1.6秒）で、80〜90年代の日本の名作ゲームを彷彿とさせる最高に明るく爽快な祝祭メロディー！
   * - FMベース ＋ ブラス調リード ＋ クリスタルベル重音の豪華アンサンブル
   */
  public playStageVictory() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // パート1: 駆け上がりファンファーレ (レ・ファ#・ラ・高レ)
    const introNotes = [
      { f: 587.33, t: 0.0, d: 0.18, r: 2.0, depth: 1600, vol: 0.13 },  // D5
      { f: 739.99, t: 0.09, d: 0.18, r: 2.0, depth: 1700, vol: 0.13 }, // F#5
      { f: 880.0, t: 0.18, d: 0.18, r: 2.0, depth: 1800, vol: 0.14 },  // A5
      { f: 1174.66, t: 0.27, d: 0.24, r: 3.5, depth: 2400, vol: 0.15 }, // D6
    ];

    // パート2: 展開 (高ミ・高ファ#)
    const midNotes = [
      { f: 1318.51, t: 0.44, d: 0.18, r: 2.0, depth: 2000, vol: 0.14 }, // E6
      { f: 1479.98, t: 0.54, d: 0.26, r: 2.0, depth: 2200, vol: 0.15 }, // F#6
    ];

    // パート3: クライマックス・ゴールデンコード（高ラ ＋ 高ファ# ＋ Dベース ＋ きらめくDX7ベル余韻！）
    const climaxTime = 0.72;
    const climaxDuration = 0.95;

    // ベース音 (D4: 293.66Hz) で重厚な支え
    this.playFmTone(293.66, 1.0, 900, climaxDuration, now + climaxTime, 0.13);

    // 主旋律: 最高音の A6 (1760Hz)
    this.playFmTone(1760.0, 3.5, 3200, climaxDuration, now + climaxTime, 0.17);

    // ハーモニー: F#6 (1479.98Hz)
    this.playFmTone(1479.98, 2.0, 2600, climaxDuration, now + climaxTime, 0.14);

    // オクターブ上のスパークル・チャイム (A7: 3520Hz)
    this.playFmTone(3520.0, 3.5, 2800, climaxDuration * 0.75, now + climaxTime + 0.04, 0.08);

    introNotes.forEach((n) => {
      this.playFmTone(n.f, n.r, n.depth, n.d, now + n.t, n.vol);
    });

    midNotes.forEach((n) => {
      this.playFmTone(n.f, n.r, n.depth, n.d, now + n.t, n.vol);
    });
  }

  /**
   * レベルアップ・進化ファンファーレ（playStageVictoryと同一の明るい祝祭サウンド）
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
}

export const soundEngine = new SoundEngine();
