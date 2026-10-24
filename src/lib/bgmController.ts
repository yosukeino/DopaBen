"use client";

/**
 * ============================================================================
 * 英語ステージ BGM ＆ 動的ローパスフィルター設定（微調整用定数オブジェクト）
 * ============================================================================
 * 後から耳で聴いて微調整できるよう、各状態の周波数(Hz)、Q値(レゾナンス)、
 * スウィープ時間(秒)、音量をこの先頭オブジェクトにまとめて定義しています。
 */
export const BGM_FILTER_CONSTANTS = {
  /** BGM音源ファイルのパス（フィルターなしの通常版1ファイルのみを使用） */
  AUDIO_SRC: "/audio/bgm-english.mp3",

  /** BGMの基本音量 (0.0 〜 1.0) */
  BASE_VOLUME: 0.26,

  /**
   * フィルター切り替え時のトランジション（スウィープ）時間（秒）
   * 従来の半分（0.15秒）で素早く滑らかに切り替わる設定
   */
  SWEEP_DURATION_SEC: 0.15,

  /** 初回再生時のフェードイン時間（秒） */
  FADE_DURATION_SEC: 0.2,

  /**
   * 3段階のローパスフィルター・ステータス定義
   * 優先度: reading (英文読み上げ時) > battle (バトル中) > normal (カットイン＆メインメニュー)
   */
  STATES: {
    /** 1. カットイン ＆ メインメニュー時（Cutoffなし・クリアな原音） */
    normal: {
      cutoffHz: 20000,
      q: 0.7,
    },
    /** 2. バトル突入時（ほんの少しだけLo-fi気味にEQ調整） */
    battle: {
      cutoffHz: 3400,
      q: 0.9,
    },
    /** 3. 英文・英語読み上げ時（最も強くフィルターを適用し、発音をくっきり際立たせる） */
    reading: {
      cutoffHz: 450,
      q: 3.5,
    },
  },
} as const;

export type BgmFilterState = keyof typeof BGM_FILTER_CONSTANTS.STATES;

/**
 * 状態優先度定義 (数値が大きいほど優先: reading > battle > normal)
 */
const STATE_PRIORITY: Record<BgmFilterState, number> = {
  normal: 1,
  battle: 2,
  reading: 3,
};

/**
 * Web Audio API（BiquadFilterNode）を使用したBGM管理コントローラー
 * - 単一音源のシームレスなループ再生（カットイン〜メインメニュー〜バトルまで途切れず再生）
 * - 状態優先度（reading > battle > normal）に基づくリアルタイム・ローパスフィルター制御
 * - AudioParam.exponentialRampToValueAtTime() によるプツ音のない滑らかかつ素早いスウィープ（0.15秒）
 * - ブラウザ Autoplay ポリシー対策（初回ユーザー操作時の AudioContext.resume() 自動実行）
 */
class BgmController {
  private ctx: AudioContext | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private gainNode: GainNode | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;
  private audioBuffer: AudioBuffer | null = null;
  private loopStartSec: number = 0;
  private loopEndSec: number = 0;

  private isFetching: boolean = false;
  private fetchPromise: Promise<AudioBuffer | null> | null = null;
  private shouldBePlaying: boolean = false;
  private isPlaying: boolean = false;
  private muted: boolean = false;

  /**
   * 状態管理用のアクティブソース集合
   * 優先度ルール: reading (読み上げ中) > battle (バトル中) > normal (カットイン・メインメニュー)
   */
  private readingSources: Set<string> = new Set();
  private battleSources: Set<string> = new Set();
  private currentAppliedState: BgmFilterState = "normal";
  private stateListeners: Set<(state: BgmFilterState) => void> = new Set();

  constructor() {
    if (typeof window !== "undefined") {
      this.setupAutoplayUnlock();
    }
  }

  /**
   * ブラウザの Autoplay ポリシー対策：
   * ユーザーの初回クリック／タップ／キー操作時に AudioContext.resume() を確実に実行する
   */
  private setupAutoplayUnlock() {
    const unlock = () => {
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
      if (this.shouldBePlaying && !this.isPlaying && !this.muted) {
        void this.startPlaybackInternal();
      }
    };

    window.addEventListener("pointerdown", unlock, { passive: true });
    window.addEventListener("touchstart", unlock, { passive: true });
    window.addEventListener("keydown", unlock, { passive: true });
    window.addEventListener("click", unlock, { passive: true });
  }

  /**
   * AudioContext とノードグラフ（Source -> BiquadFilter(lowpass) -> Gain -> Destination）の初期化
   */
  private ensureAudioGraph(): AudioContext | null {
    if (typeof window === "undefined") return null;

    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }

    if (!this.filterNode && this.ctx) {
      const initialPreset = BGM_FILTER_CONSTANTS.STATES[this.currentAppliedState];
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(initialPreset.cutoffHz, this.ctx.currentTime);
      filter.Q.setValueAtTime(initialPreset.q, this.ctx.currentTime);
      this.filterNode = filter;
    }

    if (!this.gainNode && this.ctx && this.filterNode) {
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(
        this.muted ? 0.0001 : BGM_FILTER_CONSTANTS.BASE_VOLUME,
        this.ctx.currentTime
      );
      this.filterNode.connect(gain);
      gain.connect(this.ctx.destination);
      this.gainNode = gain;
    }

    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  /**
   * BGM音源ファイルをフェッチ＆デコードしてメモリにキャッシュ
   * トップ画面マウント時に呼んでおくことで、カットイン突入時に0秒で再生開始できる
   */
  public async preload(): Promise<AudioBuffer | null> {
    if (typeof window === "undefined") return null;
    if (this.audioBuffer) return this.audioBuffer;
    if (this.fetchPromise) return this.fetchPromise;

    this.isFetching = true;
    this.fetchPromise = (async () => {
      try {
        const res = await fetch(BGM_FILTER_CONSTANTS.AUDIO_SRC);
        if (!res.ok) return null;
        const arrayBuf = await res.arrayBuffer();
        const ctx = this.ensureAudioGraph();
        if (!ctx) return null;
        const decoded = await ctx.decodeAudioData(arrayBuf.slice(0));
        this.audioBuffer = decoded;
        this.detectGaplessLoopPoints(decoded);
        return decoded;
      } catch (err) {
        console.warn("Failed to load English BGM:", err);
        return null;
      } finally {
        this.isFetching = false;
        this.fetchPromise = null;
      }
    })();

    return this.fetchPromise;
  }

  /**
   * ブラウザのMP3デコーダが先頭・末尾に付加する微細なエンコーダ遅延（無音パディング）を検出し、
   * 1サンプルの隙間もない完全なシームレスループ区間（loopStart / loopEnd）を算出する
   */
  private detectGaplessLoopPoints(buffer: AudioBuffer) {
    const sr = buffer.sampleRate;
    const len = buffer.length;
    const ch0 = buffer.getChannelData(0);
    const ch1 = buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : ch0;
    const threshold = 0.0005;

    let startSample = 0;
    const maxScan = Math.min(len, Math.floor(sr * 0.1)); // 先頭最大100msをスキャン
    for (let i = 0; i < maxScan; i++) {
      if (Math.abs(ch0[i]) > threshold || Math.abs(ch1[i]) > threshold) {
        startSample = i;
        break;
      }
    }

    let endSample = len;
    const minScan = Math.max(startSample, len - Math.floor(sr * 0.1)); // 末尾最大100msをスキャン
    for (let i = len - 1; i >= minScan; i--) {
      if (Math.abs(ch0[i]) > threshold || Math.abs(ch1[i]) > threshold) {
        endSample = i + 1;
        break;
      }
    }

    this.loopStartSec = startSample / sr;
    this.loopEndSec = endSample / sr;
  }

  /**
   * BGMのループ再生を開始する（カットインから既に流れている場合は途切れずそのまま継続！）
   */
  public async start() {
    this.shouldBePlaying = true;
    const ctx = this.ensureAudioGraph();
    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    if (this.isPlaying) {
      this.applyResolvedFilterState();
      return;
    }
    await this.startPlaybackInternal();
  }

  private async startPlaybackInternal() {
    if (!this.shouldBePlaying || this.isPlaying) return;

    const ctx = this.ensureAudioGraph();
    if (!ctx) return;

    if (!this.audioBuffer) {
      const buf = await this.preload();
      if (!buf || !this.shouldBePlaying || this.isPlaying) return;
    }

    if (!this.audioBuffer || !this.filterNode || !this.gainNode) return;

    try {
      if (ctx.state === "suspended") {
        await ctx.resume().catch(() => {});
      }

      this.stopSourceNodeOnly();

      const source = ctx.createBufferSource();
      source.buffer = this.audioBuffer;
      source.loop = true;
      if (this.loopEndSec > this.loopStartSec) {
        source.loopStart = this.loopStartSec;
        source.loopEnd = this.loopEndSec;
      }
      source.connect(this.filterNode);

      const now = ctx.currentTime;
      const targetVol = this.muted ? 0.0001 : BGM_FILTER_CONSTANTS.BASE_VOLUME;
      this.gainNode.gain.cancelScheduledValues(now);
      this.gainNode.gain.setValueAtTime(0.0001, now);
      this.gainNode.gain.exponentialRampToValueAtTime(
        Math.max(0.0001, targetVol),
        now + BGM_FILTER_CONSTANTS.FADE_DURATION_SEC
      );

      source.start(0, this.loopStartSec);
      this.sourceNode = source;
      this.isPlaying = true;

      this.applyResolvedFilterState(true);
    } catch (err) {
      console.warn("BGM startPlaybackInternal waiting for user gesture:", err);
    }
  }

  private stopSourceNodeOnly() {
    if (this.sourceNode) {
      try {
        this.sourceNode.onended = null;
        this.sourceNode.stop();
        this.sourceNode.disconnect();
      } catch {
        // ignore
      }
      this.sourceNode = null;
    }
    this.isPlaying = false;
  }

  /**
   * BGMを停止する（英語ステージからトップ画面へ戻った時などに呼ぶ）
   */
  public stop() {
    this.shouldBePlaying = false;
    this.readingSources.clear();
    this.battleSources.clear();
    this.currentAppliedState = "normal";
    this.stopSourceNodeOnly();
  }

  /**
   * 優先度（reading > battle > normal）に従って現在適用すべき状態を解決する
   */
  private resolveEffectiveState(): BgmFilterState {
    if (this.readingSources.size > 0) {
      return "reading";
    }
    if (this.battleSources.size > 0) {
      return "battle";
    }
    return "normal";
  }

  /**
   * 3つのモード（'normal' | 'battle' | 'reading'）を直接切り替えるメソッド
   */
  public setBgmState(state: BgmFilterState) {
    if (state === "reading") {
      this.readingSources.add("direct");
    } else if (state === "battle") {
      this.readingSources.delete("direct");
      this.battleSources.add("direct");
    } else {
      // 'normal'
      this.readingSources.delete("direct");
      this.battleSources.delete("direct");
    }
    this.applyResolvedFilterState();
  }

  /**
   * バトル画面の開始・終了イベント用の状態更新メソッド
   * - バトル中は `battle` (ほんの少しだけLo-fi: 3400Hz / Q: 0.9) がベース状態になる
   */
  public setBattleState(isInBattle: boolean, sourceId: string = "battle_screen") {
    if (isInBattle) {
      this.battleSources.add(sourceId);
    } else {
      this.battleSources.delete(sourceId);
    }
    this.applyResolvedFilterState();
  }

  /**
   * 英文・英語音声読み上げ時の状態更新メソッド
   * - 読み上げ中は最優先で `reading` (最も強いフィルター: 450Hz / Q: 3.5) が適用され、
   *   読み上げが終わるとバトル中なら `battle`、メインメニューなら `normal` に自動で戻る
   */
  public setReadingState(isReading: boolean, sourceId: string = "tts_speaking") {
    if (isReading) {
      this.readingSources.add(sourceId);
    } else {
      this.readingSources.delete(sourceId);
    }
    this.applyResolvedFilterState();
  }

  /**
   * 解決されたフィルター状態を BiquadFilterNode に滑らかにスウィープ適用する
   */
  private applyResolvedFilterState(immediate: boolean = false) {
    const nextState = this.resolveEffectiveState();
    const prevState = this.currentAppliedState;
    this.currentAppliedState = nextState;

    if (prevState !== nextState) {
      this.stateListeners.forEach((fn) => {
        try {
          fn(nextState);
        } catch {
          // ignore
        }
      });
    }

    if (!this.ctx || !this.filterNode) return;

    const preset = BGM_FILTER_CONSTANTS.STATES[nextState];
    const now = this.ctx.currentTime;
    const sweepSec = BGM_FILTER_CONSTANTS.SWEEP_DURATION_SEC;

    try {
      const freqParam = this.filterNode.frequency;
      const qParam = this.filterNode.Q;

      // スケジュール済みの変更をキャンセルし、現在値をアンカーしてプツ音（不連続ジャンプ）を防ぐ
      freqParam.cancelScheduledValues(now);
      qParam.cancelScheduledValues(now);

      const currentFreq = Math.max(20, freqParam.value || preset.cutoffHz);
      const currentQ = Math.max(0.01, qParam.value || preset.q);

      freqParam.setValueAtTime(currentFreq, now);
      qParam.setValueAtTime(currentQ, now);

      if (immediate) {
        freqParam.setValueAtTime(preset.cutoffHz, now);
        qParam.setValueAtTime(preset.q, now);
      } else {
        // 0.15秒かけて素早く滑らかに指数スウィープ
        freqParam.exponentialRampToValueAtTime(
          Math.max(20, preset.cutoffHz),
          now + sweepSec
        );
        qParam.exponentialRampToValueAtTime(
          Math.max(0.01, preset.q),
          now + sweepSec
        );
      }
    } catch {
      try {
        const timeConstant = sweepSec / 3;
        this.filterNode.frequency.setTargetAtTime(preset.cutoffHz, now, timeConstant);
        this.filterNode.Q.setTargetAtTime(preset.q, now, timeConstant);
      } catch {
        // ignore
      }
    }
  }

  /**
   * 現在適用されているフィルター状態を取得
   */
  public getCurrentState(): BgmFilterState {
    return this.currentAppliedState;
  }

  /**
   * 状態優先度の比較ヘルパー
   */
  public getStatePriority(state: BgmFilterState): number {
    return STATE_PRIORITY[state];
  }

  /**
   * フィルター状態変化の購読
   */
  public onStateChange(listener: (state: BgmFilterState) => void): () => void {
    this.stateListeners.add(listener);
    listener(this.currentAppliedState);
    return () => {
      this.stateListeners.delete(listener);
    };
  }

  /**
   * ミュート設定の切り替え
   */
  public setMuted(mute: boolean) {
    this.muted = mute;
    if (!this.ctx || !this.gainNode) return;

    const now = this.ctx.currentTime;
    const target = mute ? 0.0001 : BGM_FILTER_CONSTANTS.BASE_VOLUME;
    try {
      this.gainNode.gain.cancelScheduledValues(now);
      this.gainNode.gain.setValueAtTime(Math.max(0.0001, this.gainNode.gain.value), now);
      this.gainNode.gain.exponentialRampToValueAtTime(target, now + 0.15);
    } catch {
      this.gainNode.gain.value = mute ? 0 : BGM_FILTER_CONSTANTS.BASE_VOLUME;
    }

    if (!mute && this.shouldBePlaying && !this.isPlaying) {
      void this.startPlaybackInternal();
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }
}

export const bgmController = new BgmController();
