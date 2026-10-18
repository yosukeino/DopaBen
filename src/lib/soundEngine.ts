"use client";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private cachedVoices: SpeechSynthesisVoice[] = [];
  // ガベージコレクションによる音声の途中切断を防止するための永続参照Set（フォールバック用）
  private activeUtterances: Set<SpeechSynthesisUtterance> = new Set();
  private speakingListeners: Set<(isSpeaking: boolean, text: string) => void> =
    new Set();
  private currentText: string = "";
  private isCurrentlySpeaking: boolean = false;

  // ★ オンデマンド Google TTS + Web Audio API プリロードキャッシュ
  private audioBufferCache: Map<string, AudioBuffer> = new Map();
  private pendingFetches: Map<string, Promise<AudioBuffer | null>> = new Map();
  private activeSourceNode: AudioBufferSourceNode | null = null;
  private speechRequestId: number = 0;

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.initVoices();
      if (typeof window.speechSynthesis.onvoiceschanged !== "undefined") {
        window.speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
      (
        window as unknown as {
          __dopabenUtterances: Set<SpeechSynthesisUtterance>;
        }
      ).__dopabenUtterances = this.activeUtterances;
    }
  }

  private initVoices() {
    try {
      this.cachedVoices = window.speechSynthesis.getVoices();
    } catch {
      this.cachedVoices = [];
    }
  }

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
      // 無音の極小バッファを1フレーム再生してiOSのWeb Audioロックを完全解除
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    } catch {
      // ignore
    }
  }

  private normalizeKey(text: string): string {
    return text.trim().replace(/\s+/g, " ").toLowerCase();
  }

  /**
   * 指定した英単語・英文のMP3を `/api/tts` (Google TTS) から取得し、Web Audio API の AudioBuffer にデコードしてメモリキャッシュする
   */
  private async fetchAndDecodeTts(text: string): Promise<AudioBuffer | null> {
    const clean = text.trim();
    if (!clean || typeof window === "undefined") return null;

    const key = this.normalizeKey(clean);
    const cached = this.audioBufferCache.get(key);
    if (cached) return cached;

    const existingPromise = this.pendingFetches.get(key);
    if (existingPromise) return existingPromise;

    const promise = (async (): Promise<AudioBuffer | null> => {
      try {
        const res = await fetch(`/api/tts?q=${encodeURIComponent(clean)}`);
        if (!res.ok) return null;

        const arrayBuffer = await res.arrayBuffer();
        if (arrayBuffer.byteLength < 100) return null;

        const ctx = this.getContext();
        if (!ctx) return null;

        // decodeAudioData でメモリ上の AudioBuffer に変換
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
   * バトル開始時などに、出題される約12語分の音声データを一括でバックグラウンド先読み（プリロード）する
   * - 12語合計でも約80〜120KB程度のため一瞬で完了し、バトル中の発音がラグ0秒＆100%確実になる
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

    uniqueTexts.forEach((t) => {
      void this.fetchAndDecodeTts(t);
    });
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

  public getCurrentSpeakingText(): string {
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

    // 1. Web Audio API の再生中バッファノードを即停止
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

    // 2. フォールバック用の Web Speech API も発話中であれば停止
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        this.activeUtterances.clear();
        if (
          window.speechSynthesis.speaking ||
          window.speechSynthesis.pending
        ) {
          window.speechSynthesis.cancel();
        }
      } catch {
        // ignore
      }
    }

    this.notifySpeaking(false, "");
  }

  /**
   * AudioBuffer を Web Audio API で即座に再生する（効果音と同じ経路のためブラウザの無音バグが一切発生しない）
   */
  private playDecodedBuffer(
    buffer: AudioBuffer,
    text: string,
    rate: number,
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
      source.playbackRate.value = Math.max(0.5, Math.min(2.0, rate));

      const gainNode = ctx.createGain();
      gainNode.gain.value = 1.25; // 明瞭で聞き取りやすい音量

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
   * 英語音声再生（Google TTS プリロードキャッシュ ＋ Web Audio API 再生）
   * - プリロード済みの単語は 0ms で即座に Web Audio API から再生
   * - 未プリロードの単語・例文もオンデマンドで取得＆メモリキャッシュして再生
   * - 完全オフライン時のみ Web Speech API へ自動フォールバック
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

    // 既存の再生を停止し、新しいリクエストIDを発行
    this.stopSpeech();
    const myReqId = this.speechRequestId;

    // 1. すでにプリロードキャッシュにある場合は、同期処理のままラグ0秒で即再生！
    const key = this.normalizeKey(clean);
    const cachedBuffer = this.audioBufferCache.get(key);
    if (cachedBuffer) {
      const ok = this.playDecodedBuffer(
        cachedBuffer,
        clean,
        rate,
        myReqId,
        callbacks
      );
      if (ok) return;
    }

    // 2. キャッシュにない場合は `/api/tts` から取得＆デコードして再生
    void this.fetchAndDecodeTts(clean).then((buffer) => {
      if (myReqId !== this.speechRequestId || this.muted) {
        callbacks?.onEnd?.();
        return;
      }

      if (buffer) {
        const ok = this.playDecodedBuffer(
          buffer,
          clean,
          rate,
          myReqId,
          callbacks
        );
        if (ok) return;
      }

      // 3. 万が一オフライン等で Google TTS が取得できなかった場合のみ Web Speech API で同期フォールバック
      this.speakFallbackWebSpeech(clean, rate, myReqId, callbacks);
    });
  }

  /**
   * オフライン時用の Web Speech API フォールバック（不要な setTimeout や cancel 競合を除去した安定版）
   */
  private speakFallbackWebSpeech(
    text: string,
    rate: number,
    reqId: number,
    callbacks?: { onStart?: () => void; onEnd?: () => void }
  ) {
    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window) ||
      reqId !== this.speechRequestId
    ) {
      callbacks?.onEnd?.();
      return;
    }

    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "en-US";
      utter.rate = rate;
      utter.pitch = 1.0;

      const voices =
        this.cachedVoices.length > 0
          ? this.cachedVoices
          : window.speechSynthesis.getVoices();
      const preferredVoice =
        voices.find(
          (v) =>
            v.lang === "en-US" &&
            (v.name.includes("Samantha") ||
              v.name.includes("Google") ||
              v.name.includes("Natural") ||
              v.name.includes("Siri") ||
              v.name.includes("Ava") ||
              v.name.includes("Allison"))
        ) ||
        voices.find((v) => v.lang === "en-US") ||
        voices.find((v) => v.lang.startsWith("en"));

      if (preferredVoice) {
        utter.voice = preferredVoice;
      }

      this.activeUtterances.add(utter);

      utter.onstart = () => {
        if (reqId === this.speechRequestId) {
          this.notifySpeaking(true, text);
        }
        callbacks?.onStart?.();
      };

      utter.onend = () => {
        this.activeUtterances.delete(utter);
        if (reqId === this.speechRequestId) {
          this.notifySpeaking(false, "");
        }
        callbacks?.onEnd?.();
      };

      utter.onerror = () => {
        this.activeUtterances.delete(utter);
        if (reqId === this.speechRequestId) {
          this.notifySpeaking(false, "");
        }
        callbacks?.onEnd?.();
      };

      window.speechSynthesis.speak(utter);
    } catch {
      this.notifySpeaking(false, "");
      callbacks?.onEnd?.();
    }
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

      gain.gain.setValueAtTime(0.16, now);
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
   * WEAK! → 1 MORE! 正解コンボ音（コンボ数に応じてピッチが上昇し脳汁を誘発）
   */
  public playWeakHit(combo: number = 1, isRevenge: boolean = false) {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const baseBoost = Math.min(combo * 28, 320);
      const notes = isRevenge
        ? [523.25, 659.25, 783.99, 1046.5, 1318.5] // ドミソドミ（倍返しジャックポット！）
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
        const startTime = now + idx * 0.045;
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(isRevenge ? 0.14 : 0.11, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.16);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.17);
      });
    } catch {
      // ignore
    }
  }

  /**
   * ミス時：「ペナルティ感」ではなく「ターゲットロック（倍返しチャンス発生！）」のワクワク音
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
        const t = now + idx * 0.09;
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.linearRampToValueAtTime(freq * 1.15, t + 0.07);

        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.085);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.09);
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
        gain.gain.setValueAtTime(0.13, start);
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
        gain.gain.setValueAtTime(0.14, now + n.t);
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
