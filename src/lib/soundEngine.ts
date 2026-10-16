"use client";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(mute: boolean) {
    this.muted = mute;
    if (mute && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  /**
   * Duolingo式のネイティブ英語音声再生 (Web Speech API)
   */
  public speakEnglish(text: string, rate: number = 1.0) {
    if (this.muted || typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "en-US";
      utter.rate = rate;
      utter.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice =
        voices.find((v) => v.lang === "en-US" && (v.name.includes("Samantha") || v.name.includes("Google") || v.name.includes("Natural"))) ||
        voices.find((v) => v.lang.startsWith("en-US")) ||
        voices.find((v) => v.lang.startsWith("en"));

      if (preferredVoice) {
        utter.voice = preferredVoice;
      }
      window.speechSynthesis.speak(utter);
    } catch {
      // Ignore speech synthesis errors on restricted environments
    }
  }

  /**
   * P5風の鋭いボタンタップ／スラッシュ音
   */
  public playTap() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

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
  }

  /**
   * WEAK! → 1 MORE! 正解コンボ音（コンボ数に応じてピッチが上昇し脳汁を誘発）
   */
  public playWeakHit(combo: number = 1, isRevenge: boolean = false) {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const baseBoost = Math.min(combo * 28, 320);
    const notes = isRevenge
      ? [523.25, 659.25, 783.99, 1046.5, 1318.5] // ドミソドミ（倍返しジャックポット！）
      : [440 + baseBoost, 554.37 + baseBoost, 659.25 + baseBoost, 880 + baseBoost];

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
  }

  /**
   * ミス時：「ペナルティ感」ではなく「ターゲットロック（倍返しチャンス発生！）」のワクワク音
   */
  public playBountyLock() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // 2連ロックオン電子音
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
  }

  /**
   * HOLD UP! → 総攻撃 (ALL-OUT ATTACK) 突入サイレン＆スラッシュ音
   */
  public playAllOutIntro() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

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
  }

  /**
   * レベルアップ＆ドット絵進化ファンファーレ
   */
  public playEvolutionFanfare() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

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
  }
}

export const soundEngine = new SoundEngine();
