"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  Flame,
  Zap,
  Sparkles,
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import {
  GeneratedSocialQuestion,
  evaluateAtBatAdvanced,
  BattingOutcome,
  AtBatResult,
  generateSocialQuizDeck,
  QuizDeckOptions,
} from "@/lib/socialQuestionEngine";
import { SocialQuestion, SUBJECT_META } from "@/lib/socialData";
import { soundEngine } from "@/lib/soundEngine";
import { BaseballCharacter, BaseballPose } from "./BaseballCharacter";
import { CoachCharacter, CoachPose } from "./CoachCharacter";
import {
  BaseballPlayerProfile,
  KnockProgressDelta,
} from "@/lib/baseballGrowthEngine";

export interface GameSummary {
  mode: "knock" | "game9" | "quick" | "endless" | "review";
  totalQuestions: number;
  hits: number;
  homeruns: number;
  doubles: number;
  singles: number;
  strikeouts: number;
  runs: number;
  maxCombo: number;
  earnedLxp: number;
  geoCatches: number;
  historyCatches: number;
  civicsCatches: number;
  questionLogs: {
    question: SocialQuestion;
    userChoice: string;
    isCorrect: boolean;
    outcome: BattingOutcome;
  }[];
}

interface SocialBaseballGameProps {
  initialDeck: GeneratedSocialQuestion[];
  deckOptions: QuizDeckOptions;
  player: BaseballPlayerProfile;
  onFinishGame: (summary: GameSummary) => void;
  onAbort: (delta?: KnockProgressDelta) => void;
}

const COACH_QUOTES = [
  "いくぞぉぉ！！声出していけー！！",
  "足動かせ！ボールの正面に入れ！！",
  "ナイスキャッチ！その調子だ！！",
  "まだまだ！ここからが本当の練習だ！！",
  "グラブを立てろ！気合入れろぉ！！",
];

const KNOCK_TYPES = [
  { name: "強襲ノック", speed: "150km/h", color: "#EF4444" },
  { name: "鋭いゴロ", speed: "142km/h", color: "#38BDF8" },
  { name: "大飛球ノック", speed: "135km/h", color: "#FACC15" },
  { name: "ライナーノック", speed: "146km/h", color: "#A855F7" },
];

export const SocialBaseballGame: React.FC<SocialBaseballGameProps> = ({
  initialDeck,
  deckOptions,
  player,
  onFinishGame,
  onAbort,
}) => {
  const [deck, setDeck] = useState<GeneratedSocialQuestion[]>(initialDeck);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 10本ごとの継続確認モーダル
  const [showContinueModal, setShowContinueModal] = useState(false);
  // 中断確認モーダル
  const [showAbortModal, setShowAbortModal] = useState(false);

  // 捕球ステータス
  const [hits, setHits] = useState(0);
  const [homeruns, setHomeruns] = useState(0);
  const [doubles, setDoubles] = useState(0);
  const [singles, setSingles] = useState(0);
  const [strikeouts, setStrikeouts] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [totalEarnedLxp, setTotalEarnedLxp] = useState(0);

  // 分野別捕球数
  const [geoCatches, setGeoCatches] = useState(0);
  const [historyCatches, setHistoryCatches] = useState(0);
  const [civicsCatches, setCivicsCatches] = useState(0);

  // アニメーション状態
  const [playerPose, setPlayerPose] = useState<BaseballPose>("stance");
  const [coachPose, setCoachPose] = useState<CoachPose>("ready");
  const [ballFlying, setBallFlying] = useState(false);
  const [currentKnock, setCurrentKnock] = useState(KNOCK_TYPES[0]);
  const [coachQuote, setCoachQuote] = useState(COACH_QUOTES[0]);
  const [isFever, setIsFever] = useState(false);
  const [showFeverCutin, setShowFeverCutin] = useState(false);
  const [isFlash, setIsFlash] = useState(false);

  const [catchResult, setCatchResult] = useState<{
    text: string;
    sub: string;
    isSuper: boolean;
  } | null>(null);

  // 設問状態
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  const questionLogsRef = useRef<GameSummary["questionLogs"]>([]);
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasSavedRef = useRef(false);

  const currentItem = deck[currentIndex];

  // 現在のセッション成果デルタを生成
  const getCurrentDelta = (): KnockProgressDelta => ({
    totalQuestions: questionLogsRef.current.length,
    hits,
    maxCombo,
    earnedLxp: totalEarnedLxp,
    geoCatches,
    historyCatches,
    civicsCatches,
  });

  // アンマウント時の安全装置（ブラウザバック等で閉じられても保存）
  useEffect(() => {
    return () => {
      if (!hasSavedRef.current && questionLogsRef.current.length > 0) {
        hasSavedRef.current = true;
        onAbort({
          totalQuestions: questionLogsRef.current.length,
          hits,
          maxCombo,
          earnedLxp: totalEarnedLxp,
          geoCatches,
          historyCatches,
          civicsCatches,
        });
      }
    };
  }, [hits, maxCombo, totalEarnedLxp, geoCatches, historyCatches, civicsCatches, onAbort]);

  // ★ 該当科目のステータスに応じた誤答消去
  const eliminatedChoiceIds = useMemo(() => {
    if (!currentItem) return new Set<string>();
    const subj = currentItem.question.subject;
    const statVal =
      subj === "地理" ? player.stats.geo : subj === "歴史" ? player.stats.history : player.stats.civics;

    if (statVal < 35) return new Set<string>();
    const distractors = currentItem.choices.filter((c) => !c.isCorrect);
    const countToEliminate = statVal >= 70 ? 2 : 1;
    const toEliminate = distractors.slice(0, countToEliminate).map((c) => c.id);
    return new Set(toEliminate);
  }, [currentItem, player.stats]);

  // 設問開始時のリセット
  useEffect(() => {
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);

    setSelectedChoiceId(null);
    setIsAnswered(false);
    setPlayerPose("stance");
    setCoachPose("ready");
    setCatchResult(null);

    // コーチのノック準備
    const randomKnock = KNOCK_TYPES[Math.floor(Math.random() * KNOCK_TYPES.length)];
    const randomQuote = COACH_QUOTES[Math.floor(Math.random() * COACH_QUOTES.length)];
    setCurrentKnock(randomKnock);
    setCoachQuote(randomQuote);

    // コーチがノックを打つアニメーション
    setCoachPose("swing");
    setBallFlying(true);
    const timer = setTimeout(() => {
      setCoachPose("ready");
      setBallFlying(false);
      setQuestionStartTime(Date.now());
    }, 300);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  // 回答処理
  const handleSelectChoice = (choiceId: string, isCorrect: boolean, choiceText: string) => {
    if (isAnswered || !currentItem || eliminatedChoiceIds.has(choiceId) || showContinueModal) return;

    setIsAnswered(true);
    setSelectedChoiceId(choiceId);
    const responseTime = Date.now() - questionStartTime;

    const evaluation = evaluateAtBatAdvanced({
      isCorrect,
      responseTimeMs: responseTime,
      currentCombo: combo,
      currentBases: [false, false, false],
      subject: currentItem.question.subject,
      stats: player.stats,
      isFever,
    });

    questionLogsRef.current.push({
      question: currentItem.question,
      userChoice: choiceText,
      isCorrect,
      outcome: evaluation.outcome,
    });

    if (isCorrect) {
      // 閃光
      setIsFlash(true);
      setTimeout(() => setIsFlash(false), 60);

      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);

      // 分野別カウント
      const subj = currentItem.question.subject;
      if (subj === "地理") setGeoCatches((prev) => prev + 1);
      else if (subj === "歴史") setHistoryCatches((prev) => prev + 1);
      else if (subj === "公民") setCivicsCatches((prev) => prev + 1);

      // フィーバー判定
      if (newCombo >= 3 && !isFever) {
        setIsFever(true);
        setShowFeverCutin(true);
        setTimeout(() => setShowFeverCutin(false), 1000);
      }

      setTotalEarnedLxp((prev) => prev + evaluation.lxpGained);
      setHits((prev) => prev + 1);

      // ★ DX7風の心地よい正解サウンド（グラブ捕球パシッ＋クリスタルベル）！
      soundEngine.playKnockCatch(newCombo);

      const isSuper = evaluation.outcome === "HOMERUN";
      if (isSuper) {
        setHomeruns((prev) => prev + 1);
        setPlayerPose("catch");
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.4 },
          colors: [player.teamColor, "#FACC15", "#38BDF8", "#FFFFFF"],
        });
      } else {
        setSingles((prev) => prev + 1);
        setPlayerPose("catch");
      }

      setCatchResult({
        text: isSuper ? "スーパーファインプレー！✨" : "ナイスキャッチ！👏",
        sub: `+${evaluation.lxpGained} LXP`,
        isSuper,
      });

      // テンポよく次へ
      autoAdvanceTimerRef.current = setTimeout(() => {
        advanceNextKnock(false);
      }, isSuper ? 1000 : 700);
    } else {
      // 不正解処理（後逸・トンネル）
      setCombo(0);
      setIsFever(false);
      setPlayerPose("miss");
      soundEngine.playKnockMiss();

      setStrikeouts((prev) => prev + 1);
      setCatchResult({
        text: "ボール後逸！トンネル！💦",
        sub: `正解: 「${currentItem.question.answer}」`,
        isSuper: false,
      });

      // ミス時も1.3秒で自動送り（タップで即次へ）
      autoAdvanceTimerRef.current = setTimeout(() => {
        advanceNextKnock(false);
      }, 1300);
    }
  };

  const advanceNextKnock = (forceNext: boolean = false) => {
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);

    const nextIndex = currentIndex + 1;

    // 10本ごとの継続プロンプト
    if (nextIndex % 10 === 0 && nextIndex > 0) {
      soundEngine.playWeakHit(5, true);
      setShowContinueModal(true);
      return;
    }

    if (nextIndex >= deck.length) {
      addMoreKnocks(10);
      return;
    }

    setCurrentIndex(nextIndex);
  };

  const addMoreKnocks = (count: number) => {
    soundEngine.playTransition();
    const moreQuestions = generateSocialQuizDeck({
      ...deckOptions,
      limit: count,
    });
    setDeck((prev) => [...prev, ...moreQuestions]);
    setShowContinueModal(false);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleEndKnockSession = () => {
    hasSavedRef.current = true;
    setShowContinueModal(false);
    soundEngine.playStageVictory();
    onFinishGame({
      mode: "knock",
      totalQuestions: questionLogsRef.current.length,
      hits,
      homeruns,
      doubles,
      singles,
      strikeouts,
      runs: 0,
      maxCombo,
      earnedLxp: totalEarnedLxp,
      geoCatches,
      historyCatches,
      civicsCatches,
      questionLogs: questionLogsRef.current,
    });
  };

  const handleAbortClick = () => {
    soundEngine.playTap();
    if (questionLogsRef.current.length === 0) {
      hasSavedRef.current = true;
      onAbort();
    } else {
      setShowAbortModal(true);
    }
  };

  const handleConfirmAbort = () => {
    hasSavedRef.current = true;
    setShowAbortModal(false);
    soundEngine.playStageVictory();
    onAbort(getCurrentDelta());
  };

  const meta = SUBJECT_META[currentItem.question.subject];

  return (
    <div
      onClick={() => {
        if (isAnswered && !showContinueModal && playerPose === "miss") {
          advanceNextKnock(true);
        }
      }}
      className="w-full max-w-md mx-auto space-y-3 pb-8 select-none relative"
    >
      {/* 閃光エフェクト */}
      {isFlash && (
        <div className="fixed inset-0 z-50 bg-white/60 pointer-events-none transition-opacity" />
      )}

      {/* FEVERカットイン */}
      <AnimatePresence>
        {showFeverCutin && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: "0%", opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ type: "spring", damping: 18 }}
            className="fixed inset-x-0 top-1/4 z-50 py-2.5 bg-gradient-to-r from-[#EF4444] via-[#F59E0B] to-[#EF4444] text-white text-center shadow-2xl border-y-2 border-white pointer-events-none"
          >
            <div className="text-xl sm:text-2xl font-black italic tracking-wider">
              🔥 熱闘FEVER 突入！ LXP 2倍！！ 🔥
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 10本区切りの継続確認モーダル */}
      <AnimatePresence>
        {showContinueModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              className="w-full max-w-sm bg-gradient-to-b from-[#1E293B] via-[#0F172A] to-[#0B0D12] border-4 border-[#FACC15] rounded-3xl p-5 shadow-2xl space-y-4 text-center text-white"
            >
              <div className="text-4xl">🧢🔥</div>

              <div>
                <span className="text-[10px] font-black tracking-widest text-[#EF4444] uppercase block">
                  KNOCK {questionLogsRef.current.length} 本完了！
                </span>
                <h3 className="text-xl font-black italic text-[#FACC15] tracking-wide">
                  鬼コーチ「まだまだ行けるだろ！！」
                </h3>
                <p className="text-xs text-[#CBD5E1] mt-1">
                  息が上がってんじゃねえぞ！ここからが本当の特訓だ！
                </p>
              </div>

              <div className="bg-[#090D16] border border-[#334155] rounded-xl p-2.5 grid grid-cols-3 gap-1 text-center text-xs">
                <div>
                  <span className="text-[9px] text-[#94A3B8] block">捕球(正解)</span>
                  <span className="font-black text-white">{hits}本</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#38BDF8] block">MAXコンボ</span>
                  <span className="font-black text-[#38BDF8]">{maxCombo}連</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#FACC15] block">獲得LXP</span>
                  <span className="font-black text-[#FACC15]">+{totalEarnedLxp}</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={() => addMoreKnocks(10)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#EF4444] to-[#F97316] hover:brightness-110 text-white font-black text-xs shadow-lg active:scale-95 transition flex items-center justify-center gap-1.5"
                >
                  <Flame className="w-4 h-4 fill-white" />
                  <span>コーチ！あと10本お願いします！</span>
                </button>

                <button
                  onClick={() => addMoreKnocks(30)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#FACC15] hover:brightness-110 text-slate-950 font-black text-xs shadow-md active:scale-95 transition flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>ノッてきた！あと30本打ち込んでください！</span>
                </button>

                <button
                  onClick={() => addMoreKnocks(100)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:brightness-110 text-white font-black text-xs shadow-md active:scale-95 transition flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 fill-white" />
                  <span>限界突破！！あと100本千本ノック！！</span>
                </button>

                <button
                  onClick={handleEndKnockSession}
                  className="w-full py-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-[#475569] text-[#94A3B8] hover:text-white font-bold text-xs active:scale-95 transition"
                >
                  今日はここまでにします（結果発表へ）
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 中断確認モーダル */}
      <AnimatePresence>
        {showAbortModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              className="w-full max-w-sm bg-gradient-to-b from-[#1E293B] via-[#0F172A] to-[#0B0D12] border-2 border-[#38BDF8] rounded-3xl p-5 shadow-2xl space-y-4 text-center text-white"
            >
              <div className="text-3xl">⚾💾</div>

              <div>
                <h3 className="text-lg font-black text-[#38BDF8] tracking-wide">
                  特訓を中断しますか？
                </h3>
                <p className="text-xs text-[#94A3B8] mt-1">
                  ここまでのノック本数や正解数、獲得LXPは<span className="text-[#FACC15] font-bold">すべて保存</span>されます！
                </p>
              </div>

              <div className="bg-[#090D16] border border-[#334155] rounded-xl p-2.5 grid grid-cols-3 gap-1 text-center text-xs">
                <div>
                  <span className="text-[9px] text-[#94A3B8] block">ノック本数</span>
                  <span className="font-black text-white">{questionLogsRef.current.length}本</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#10B981] block">捕球(正解)</span>
                  <span className="font-black text-[#10B981]">{hits}本</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#FACC15] block">獲得LXP</span>
                  <span className="font-black text-[#FACC15]">+{totalEarnedLxp}</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={handleConfirmAbort}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#0284C7] hover:brightness-110 text-slate-950 font-black text-xs shadow-md active:scale-95 transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>記録を保存してロビーへ戻る</span>
                </button>

                <button
                  onClick={() => setShowAbortModal(false)}
                  className="w-full py-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-[#475569] text-[#CBD5E1] hover:text-white font-bold text-xs active:scale-95 transition"
                >
                  特訓を続ける
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 1. ヘッダーナビゲーション ＆ ステータス */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={handleAbortClick}
          className="px-2.5 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#334155] border border-[#475569] text-[#94A3B8] hover:text-white text-xs font-bold flex items-center gap-1 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>中断</span>
        </button>

        <div className="flex items-center gap-2">
          {combo > 1 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#EF4444] to-[#F59E0B] text-white text-xs font-black animate-pulse shadow-sm">
              <Flame className="w-3.5 h-3.5 fill-white" />
              <span>{combo} 連続捕球！</span>
            </div>
          )}

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#111827] border border-[#334155] text-xs font-black text-[#FACC15]">
            <Zap className="w-3.5 h-3.5 fill-[#FACC15]" />
            <span>+{totalEarnedLxp}</span>
          </div>
        </div>
      </div>

      {/* 2. ★ スリム化されたグラフィック領域 (h-28)
             左：ノックを打つコーチ、右：グラブで受けるプレイヤー */}
      <div className="relative w-full h-28 bg-gradient-to-r from-[#14532D] via-[#064E3B] to-[#14532D] rounded-2xl border-2 border-[#10B981]/50 overflow-hidden shadow-inner flex items-center justify-between px-5">
        {/* 背景の芝生 */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[repeating-linear-gradient(45deg,#000_0px,#000_15px,transparent_15px,transparent_30px)]" />

        {/* 左側：ノックを打つ鬼コーチ */}
        <div className="relative z-10 flex flex-col items-center">
          <CoachCharacter
            pose={coachPose}
            size={68}
            animate={true}
          />
          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-black/60 text-[#EF4444] border border-[#EF4444]/40 mt-[-4px]">
            鬼コーチ
          </span>
        </div>

        {/* 中央：ノック球の飛翔アニメーション ＆ ノック表示 */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-2">
          {/* ボールのアニメーション（左から右へ飛ぶ！） */}
          <div className="relative w-full h-6 flex items-center justify-center">
            {ballFlying && (
              <motion.div
                initial={{ x: -60, y: -8, scale: 0.6 }}
                animate={{ x: 60, y: 0, scale: 1.2 }}
                transition={{ duration: 0.28, ease: "easeIn" }}
                className="text-xl drop-shadow absolute"
              >
                ⚾💨
              </motion.div>
            )}
          </div>

          <div className="text-[10px] font-black text-[#CBD5E1] bg-black/60 px-2 py-0.5 rounded-full border border-white/10 flex items-center gap-1.5">
            <span className="text-[#FACC15]">第 {currentIndex + 1} 本</span>
            <span>{currentKnock.name}</span>
          </div>
        </div>

        {/* 右側：ノックを受けるプレイヤー（グラブ守備ポーズ） */}
        <div className="relative z-10 flex flex-col items-center">
          <BaseballCharacter
            gender={player.gender}
            pose={playerPose}
            size={68}
            teamColor={player.teamColor}
            level={player.level}
            batTier={player.selectedBatTier}
            isFielding={true}
            animate={true}
            showAura={true}
          />
          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-black/60 text-[#38BDF8] border border-[#38BDF8]/40 mt-[-4px]">
            {player.name}
          </span>
        </div>

        {/* 捕球結果ポップアップ */}
        <AnimatePresence>
          {catchResult && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 6 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`absolute inset-x-8 top-3 z-30 p-2 rounded-xl border-2 text-center shadow-2xl backdrop-blur-md ${
                playerPose === "miss"
                  ? "bg-[#1E293B] border-[#EF4444] text-[#F87171]"
                  : "bg-gradient-to-r from-[#10B981] to-[#059669] border-white text-white"
              }`}
            >
              <div className="text-xs font-black">{catchResult.text}</div>
              <div className="text-[10px] opacity-90 font-bold">{catchResult.sub}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. ★ 広くなった問題文カード（視認性抜群） */}
      <div className="bg-[#111827] border-2 border-white/80 p-5 rounded-3xl shadow-p5-red space-y-2.5 relative overflow-hidden">
        <div className="flex items-center justify-between text-xs text-[#94A3B8] font-bold">
          <span className="flex items-center gap-1 text-[#FACC15]">
            <BookOpen className="w-4 h-4" />
            <span>{currentItem.question.section || currentItem.question.chapter}</span>
          </span>
          <span className="px-2 py-0.5 rounded bg-black/40 text-[10px] text-[#CBD5E1]">
            問 {currentItem.question.number}
          </span>
        </div>

        {/* 大きく読みやすい問題文フォント */}
        <div className="text-base sm:text-lg font-black text-white leading-relaxed min-h-[64px]">
          {currentItem.question.question}
        </div>

        {currentItem.question.supplement && (
          <div className="text-xs text-[#94A3B8] bg-[#090D16] p-2.5 rounded-xl border border-[#262D3D] flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
            <span>解説ヒント: {currentItem.question.supplement}</span>
          </div>
        )}
      </div>

      {/* 4. ★ 広くて押しやすい4択選択肢ボタン */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {currentItem.choices.map((choice, idx) => {
          const isSelected = selectedChoiceId === choice.id;
          const isEliminated = eliminatedChoiceIds.has(choice.id);

          let btnStyle = "bg-[#1E293B] hover:bg-[#334155] border-[#475569] text-white";

          if (isEliminated) {
            btnStyle =
              "bg-[#090D16] border-[#1E293B] text-[#475569] line-through opacity-25 cursor-not-allowed scale-[0.98]";
          } else if (isAnswered) {
            if (choice.isCorrect) {
              btnStyle =
                "bg-[#10B981] border-white text-slate-950 font-black shadow-lg scale-[1.02]";
            } else if (isSelected && !choice.isCorrect) {
              btnStyle = "bg-[#EF4444] border-white text-white font-black opacity-80";
            } else {
              btnStyle = "bg-[#0F172A] border-[#262D3D] text-[#64748B] opacity-40";
            }
          }

          return (
            <motion.button
              key={choice.id}
              whileTap={!isAnswered && !isEliminated ? { scale: 0.98 } : {}}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectChoice(choice.id, choice.isCorrect, choice.text);
              }}
              disabled={isAnswered || isEliminated || showContinueModal}
              className={`p-3.5 sm:p-4 rounded-2xl border-2 flex items-center justify-between text-left transition ${btnStyle}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-7 h-7 rounded-xl bg-black/30 border border-white/20 flex items-center justify-center text-xs font-black shrink-0">
                  {idx + 1}
                </span>
                <span className="text-sm sm:text-base font-black truncate">{choice.text}</span>
              </div>

              {isEliminated && (
                <span className="text-[10px] font-black text-[#64748B] px-1.5 py-0.5 rounded bg-black/30">
                  ⚡能力消去
                </span>
              )}
              {isAnswered && choice.isCorrect && (
                <CheckCircle2 className="w-5 h-5 text-slate-950 shrink-0" />
              )}
              {isAnswered && isSelected && !choice.isCorrect && (
                <XCircle className="w-5 h-5 text-white shrink-0" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* 5. 不正解時の超速リカバー案内 */}
      {isAnswered && playerPose === "miss" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#090D16] border border-[#334155] p-3 rounded-2xl flex items-center justify-between gap-3 shadow-md"
        >
          <div className="min-w-0 flex-1">
            <div className="text-[10px] text-[#94A3B8] font-bold">正解用語</div>
            <div className="text-sm sm:text-base font-black text-[#FACC15] flex items-center gap-1.5">
              <span>{currentItem.question.answer}</span>
              {currentItem.question.answer_kana && (
                <span className="text-xs text-[#CBD5E1] font-normal">
                  ({currentItem.question.answer_kana})
                </span>
              )}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              advanceNextKnock(true);
            }}
            className="px-4 py-2 rounded-xl bg-[#FACC15] hover:bg-[#FFE600] text-black font-black text-xs flex items-center gap-1 shadow-sm active:scale-95 transition shrink-0"
          >
            <span>次のノックへ (タップ)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
};
