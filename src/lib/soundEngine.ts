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

  private normalizeKey(text: string, isSlow: boolean = false): string {
    const base = text.trim().replace(/\s+/g, " ").toLowerCase();
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
    const clean = text.trim();
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
   * P5風の鋭いボタンタップ／スラッシュ音
   */
  public playTap() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(1280, now + 0.055);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.065);
    } catch {
      // ignore
    }
  }

  /**
   * WEAK! → 1 MORE! 正解コンボ音（発音音声を邪魔しないよう音量を最適化）
   */
  public playWeakHit(combo: number = 1, isRevenge: boolean = false) {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const baseBoost = Math.min(combo * 28, 320);
      const notes = isRevenge
        ? [523.25, 659.25, 783.99, 1046.5, 1318.5]
        : [
            440 + baseBoost,
            554.37 + baseBoost,
            659.25 + baseBoost,
            880 + baseBoost,
          ];

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = isRevenge ? "sawtooth" : "square";
        const startTime = now + idx * 0.04;
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(isRevenge ? 0.08 : 0.06, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.13);
      });
    } catch {
      // ignore
    }
  }

  /**
   * ミス時：「ターゲットロック（倍返しチャンス発生！）」音（発音音声を邪魔しないよう音量を最適化）
   */
  public playBountyLock() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      [330, 440].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        const t = now + idx * 0.075;
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.linearRampToValueAtTime(freq * 1.15, t + 0.06);

        gain.gain.setValueAtTime(0.07, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.075);
      });
    } catch {
      // ignore
    }
  }

  /**
   * HOLD UP! → 総攻撃 (ALL-OUT ATTACK) 突入サイレン＆スラッシュ音
   */
  public playAllOutIntro() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const chords = [392.0, 493.88, 587.33, 783.99, 987.77];
      chords.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        const start = now + i * 0.055;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.11, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.36);
      });
    } catch {
      // ignore
    }
  }

  /**
   * レベルアップ＆ドット絵進化ファンファーレ
   */
  public playEvolutionFanfare() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const melody = [
        { f: 523.25, t: 0, d: 0.12 },
        { f: 659.25, t: 0.1, d: 0.12 },
        { f: 783.99, t: 0.2, d: 0.12 },
        { f: 1046.5, t: 0.3, d: 0.25 },
        { f: 987.77, t: 0.52, d: 0.12 },
        { f: 1046.5, t: 0.64, d: 0.45 },
      ];

      melody.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(n.f, now + n.t);
        gain.gain.setValueAtTime(0.12, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + n.d + 0.02);
      });
    } catch {
      // ignore
    }
  }
}

export const soundEngine = new SoundEngine();
