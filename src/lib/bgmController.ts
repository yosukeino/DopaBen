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
  BASE_VOLUME: 0.25,

  /** フィルター切り替え時のスウィープ時間（秒）：約 0.25〜0.35秒 */
  SWEEP_DURATION_SEC: 0.3,

  /** フェードイン・フェードアウト時間（秒） */
  FADE_DURATION_SEC: 0.4,

  /**
   * 3段階のローパスフィルター・ステータス定義
   * 優先度: menu > reading > normal
   */
  STATES: {
    /** 1. 通常プレイ時（フィルターなし） */
    normal: {
      cutoffHz: 20000,
      q: 0.7,
    },
    /** 2. 英文が表示されている・流れている時（高域のアタック感を少し丸める） */
    reading: {
      cutoffHz: 2200,
      q: 1.2,
    },
    /** 3. メニュー画面を開いている時（水中や別室のようなしっかりこもったローパス感） */
    menu: {
      cutoffHz: 450,
      q: 3.5,
    },
  },
} as const;

export type BgmFilterState = keyof typeof BGM_FILTER_CONSTANTS.STATES;

/**
 * 状態優先度定義 (数値が大きいほど優先: menu > reading > normal)
 */
const STATE_PRIORITY: Record<BgmFilterState, number> = {
  normal: 1,
  reading: 2,
  menu: 3,
};

/**
 * Web Audio API（BiquadFilterNode）を使用したBGM管理コントローラー
 * - 単一音源のシームレスなループ再生
 * - 状態優先度（menu > reading > normal）に基づくリアルタイム・ローパスフィルター制御
 * - AudioParam.exponentialRampToValueAtTime() によるプツ音のない滑らかなスウィープ
 * - ブラウザ Autoplay ポリシー対策（初回ユーザー操作時の AudioContext.resume() 自動実行）
 */
class BgmController {
  private ctx: AudioContext | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private gainNode: GainNode | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;
  private audioBuffer: AudioBuffer | null = null;

  private isFetching: boolean = false;
  private shouldBePlaying: boolean = false;
  private isPlaying: boolean = false;
  private muted: boolean = false;

  /**
   * 状態管理用のアクティブソース集合
   * 例: 英文表示中にメニューを開いた場合、menuSources と readingSources の両方が保持され、
   * 優先度ルール (menu > reading > normal) によって menu が適用される。
   * メニューを閉じると menuSources が空になり、自動的に reading に復帰する。
   */
  private menuSources: Set<string> = new Set();
  private readingSources: Set<string> = new Set();
  private currentAppliedState: BgmFilterState = "normal";
  private stateListeners: Set<(state: BgmFilterState) => void> = new Set();

  private unlockHandlerBound: (() => void) | null = null;

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

    this.unlockHandlerBound = unlock;
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
   */
  public async preload(): Promise<AudioBuffer | null> {
    if (typeof window === "undefined") return null;
    if (this.audioBuffer) return this.audioBuffer;
    if (this.isFetching) return null;

    this.isFetching = true;
    try {
      const res = await fetch(BGM_FILTER_CONSTANTS.AUDIO_SRC);
      if (!res.ok) return null;
      const arrayBuf = await res.arrayBuffer();
      const ctx = this.ensureAudioGraph();
      if (!ctx) return null;
      const decoded = await ctx.decodeAudioData(arrayBuf.slice(0));
      this.audioBuffer = decoded;
      return decoded;
    } catch (err) {
      console.warn("Failed to load English BGM:", err);
      return null;
    } finally {
      this.isFetching = false;
    }
  }

  /**
   * BGMのループ再生を開始する（既に再生中ならそのまま継続し、途切れさせない）
   */
  public async start() {
    this.shouldBePlaying = true;
    if (this.isPlaying) {
      // 既に流れている場合は現在の状態に応じたフィルターを再適用するのみ
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

      // 既存のソースがあれば安全に破棄
      this.stopSourceNodeOnly();

      const source = ctx.createBufferSource();
      source.buffer = this.audioBuffer;
      source.loop = true;
      source.connect(this.filterNode);

      // 音量を滑らかにフェードイン
      const now = ctx.currentTime;
      const targetVol = this.muted ? 0.0001 : BGM_FILTER_CONSTANTS.BASE_VOLUME;
      this.gainNode.gain.cancelScheduledValues(now);
      this.gainNode.gain.setValueAtTime(0.0001, now);
      this.gainNode.gain.exponentialRampToValueAtTime(
        Math.max(0.0001, targetVol),
        now + BGM_FILTER_CONSTANTS.FADE_DURATION_SEC
      );

      source.start(0);
      this.sourceNode = source;
      this.isPlaying = true;

      // 現在の実効フィルター状態を適用
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
   * BGMを停止する（英語ステージからトップ画面へ抜ける時などに呼ぶ）
   */
  public stop() {
    this.shouldBePlaying = false;
    this.menuSources.clear();
    this.readingSources.clear();
    this.currentAppliedState = "normal";
    this.stopSourceNodeOnly();
  }

  /**
   * 優先度（menu > reading > normal）に従って現在適用すべき状態を解決する
   */
  private resolveEffectiveState(): BgmFilterState {
    if (this.menuSources.size > 0) {
      return "menu";
    }
    if (this.readingSources.size > 0) {
      return "reading";
    }
    return "normal";
  }

  /**
   * 3つのモード（'normal' | 'reading' | 'menu'）を直接切り替えるメソッド
   * - 優先度（menu > reading > normal）を保持したまま滑らかに遷移します
   */
  public setBgmState(state: BgmFilterState) {
    if (state === "menu") {
      this.menuSources.add("direct");
    } else if (state === "reading") {
      this.menuSources.delete("direct");
      this.readingSources.add("direct");
    } else {
      // 'normal'
      this.menuSources.delete("direct");
      this.readingSources.delete("direct");
    }
    this.applyResolvedFilterState();
  }

  /**
   * メニュー開閉イベント用の状態更新メソッド
   * - 例: 英文表示中にメニューを開くと `menu` (450Hz) になり、メニューを閉じると元の `reading` (2200Hz) に自動で戻る
   */
  public setMenuState(isOpen: boolean, sourceId: string = "menu_modal") {
    if (isOpen) {
      this.menuSources.add(sourceId);
    } else {
      this.menuSources.delete(sourceId);
    }
    this.applyResolvedFilterState();
  }

  /**
   * 英文表示・英語音声再生イベント用の状態更新メソッド
   * - 複数のソース（例: 'battle_sentence' と 'tts_voice'）が重なっても安全に管理される
   */
  public setReadingState(isReading: boolean, sourceId: string = "english_reading") {
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

      // スケジュール済みの変更をキャンセルし、現在の実際の値をアンカーしてプツ音（不連続ジャンプ）を防ぐ
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
        // 約 0.30秒（0.25〜0.35秒）かけて滑らかに指数スウィープ
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
      // Fallback: setTargetAtTime
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
   * フィルター状態変化の購読（UI表示やデバッグ確認用）
   */
  public onStateChange(listener: (state: BgmFilterState) => void): () => void {
    this.stateListeners.add(listener);
    listener(this.currentAppliedState);
    return () => {
      this.stateListeners.delete(listener);
    };
  }

  /**
   * ミュート設定の切り替え（滑らかに音量を絞る/戻す）
   */
  public setMuted(mute: boolean) {
    this.muted = mute;
    if (!this.ctx || !this.gainNode) return;

    const now = this.ctx.currentTime;
    const target = mute ? 0.0001 : BGM_FILTER_CONSTANTS.BASE_VOLUME;
    try {
      this.gainNode.gain.cancelScheduledValues(now);
      this.gainNode.gain.setValueAtTime(Math.max(0.0001, this.gainNode.gain.value), now);
      this.gainNode.gain.exponentialRampToValueAtTime(target, now + 0.2);
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
