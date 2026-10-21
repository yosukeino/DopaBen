"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  Flame,
  Zap,
  RotateCcw,
  Sparkles,
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import {
  GeneratedSocialQuestion,
  evaluateAtBat,
  BattingOutcome,
} from "@/lib/socialQuestionEngine";
import { SocialQuestion, SUBJECT_META } from "@/lib/socialData";
import { soundEngine } from "@/lib/soundEngine";
import { BaseballCharacter, BaseballPose } from "./BaseballCharacter";
import { BaseballPlayerProfile } from "@/lib/baseballGrowthEngine";

export interface GameSummary {
  mode: "game9" | "quick" | "endless" | "review";
  totalQuestions: number;
  hits: number;
  homeruns: number;
  doubles: number;
  singles: number;
  strikeouts: number;
  runs: number;
  maxCombo: number;
  earnedLxp: number;
  questionLogs: {
    question: SocialQuestion;
    userChoice: string;
    isCorrect: boolean;
    outcome: BattingOutcome;
  }[];
}

interface SocialBaseballGameProps {
  deck: GeneratedSocialQuestion[];
  mode: "game9" | "quick" | "endless" | "review";
  player: BaseballPlayerProfile;
  onFinishGame: (summary: GameSummary) => void;
  onAbort: () => void;
}

export const SocialBaseballGame: React.FC<SocialBaseballGameProps> = ({
  deck,
  mode,
  player,
  onFinishGame,
  onAbort,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 野球ステータス
  const [inning, setInning] = useState(1);
  const [outs, setOuts] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [runs, setRuns] = useState(0);
  const [bases, setBases] = useState<[boolean, boolean, boolean]>([false, false, false]);

  // 成績集計
  const [hits, setHits] = useState(0);
  const [homeruns, setHomeruns] = useState(0);
  const [doubles, setDoubles] = useState(0);
  const [singles, setSingles] = useState(0);
  const [strikeouts, setStrikeouts] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [totalEarnedLxp, setTotalEarnedLxp] = useState(0);

  // 画面演出ステート
  const [pose, setPose] = useState<BaseballPose>("stance");
  const [pitching, setPitching] = useState(false);
  const [ballFlying, setBallFlying] = useState(false);
  const [isFever, setIsFever] = useState(false);
  const [showFeverCutin, setShowFeverCutin] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [hitBanner, setHitBanner] = useState<{
    show: boolean;
    title: string;
    sub: string;
    outcome: BattingOutcome;
  }>({
    show: false,
    title: "",
    sub: "",
    outcome: "SINGLE",
  });

  // 設問状態
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  const questionLogsRef = useRef<GameSummary["questionLogs"]>([]);
  const currentItem = deck[currentIndex];

  const isBasesLoaded = bases[0] && bases[1] && bases[2];

  // 設問開始時のリセット
  useEffect(() => {
    setSelectedChoiceId(null);
    setIsAnswered(false);
    setPose("stance");
    setHitBanner({ show: false, title: "", sub: "", outcome: "SINGLE" });

    // ピッチャーの投球
    setPitching(true);
    const timer = setTimeout(() => {
      setPitching(false);
      setQuestionStartTime(Date.now());
    }, 380);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  // 回答処理
  const handleSelectChoice = (choiceId: string, isCorrect: boolean, choiceText: string) => {
    if (isAnswered || !currentItem) return;

    setIsAnswered(true);
    setSelectedChoiceId(choiceId);
    const responseTime = Date.now() - questionStartTime;

    // 選手のステータス補正
    // ミート力が高いほど即答時間の許容範囲が拡大
    const meetBonus = (player.stats.meet - 15) * 15; // 最大+1260ms
    const adjustedResponseTime = Math.max(200, responseTime - meetBonus);

    const evaluation = evaluateAtBat(isCorrect, adjustedResponseTime, combo, bases);

    // ログ記録
    questionLogsRef.current.push({
      question: currentItem.question,
      userChoice: choiceText,
      isCorrect,
      outcome: evaluation.outcome,
    });

    if (isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);

      // フィーバー突入チェック (3連打で発動)
      let currentFever = isFever;
      if (newCombo >= 3 && !isFever) {
        setIsFever(true);
        currentFever = true;
        setShowFeverCutin(true);
        soundEngine.playBatCrack();
        setTimeout(() => setShowFeverCutin(false), 1200);
      }

      // フィーバー＆勝負強さのボーナス倍率
      let multiplier = currentFever ? 2.0 : 1.0;
      if (isBasesLoaded) multiplier += (player.stats.clutch / 100);

      const finalLxp = Math.round(evaluation.lxpGained * multiplier);
      setTotalEarnedLxp((prev) => prev + finalLxp);
      setRuns((prev) => prev + evaluation.runsScored);
      setBases(evaluation.newBases);
      setStrikes(0);

      // 成績加算
      setHits((prev) => prev + 1);
      if (evaluation.outcome === "HOMERUN") {
        setHomeruns((prev) => prev + 1);
        setPose("homerun");
        soundEngine.playHomerun();

        // 強烈な画面揺れエフェクト
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);

        confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.6 },
          colors: [player.teamColor, "#FACC15", "#38BDF8", "#FFFFFF"],
        });
      } else if (evaluation.outcome === "DOUBLE") {
        setDoubles((prev) => prev + 1);
        setPose("swing");
        soundEngine.playBatCrack();
      } else {
        setSingles((prev) => prev + 1);
        setPose("swing");
        soundEngine.playHit();
      }

      setBallFlying(true);
      setTimeout(() => setBallFlying(false), 800);

      setHitBanner({
        show: true,
        title: evaluation.title,
        sub: evaluation.comment,
        outcome: evaluation.outcome,
      });

      // 自動で次の打席へ進む
      setTimeout(() => {
        advanceNextAtBat(false);
      }, evaluation.outcome === "HOMERUN" ? 2000 : 1400);
    } else {
      // 不正解処理
      setCombo(0);
      setIsFever(false); // フィーバー終了
      setPose("miss");
      soundEngine.playStrike();

      const newStrikes = strikes + 1;
      let isNewOut = false;

      if (newStrikes >= 2 || mode !== "endless") {
        isNewOut = true;
        setStrikes(0);
        setOuts((prev) => prev + 1);
        setStrikeouts((prev) => prev + 1);
        soundEngine.playOut();
      } else {
        setStrikes(newStrikes);
      }

      setHitBanner({
        show: true,
        title: isNewOut ? "空振り三振！アウト！" : "ストライク！",
        sub: `正解: 「${currentItem.question.answer}」`,
        outcome: "OUT",
      });
    }
  };

  const advanceNextAtBat = (forceNext: boolean = false) => {
    const nextIndex = currentIndex + 1;
    let isGameOver = false;

    if (mode === "game9") {
      if (nextIndex >= 9 || nextIndex >= deck.length) {
        isGameOver = true;
      } else {
        setInning(nextIndex + 1);
      }
    } else if (mode === "quick") {
      if (nextIndex >= deck.length) isGameOver = true;
    } else if (mode === "endless") {
      if (outs >= 3 || nextIndex >= deck.length) isGameOver = true;
    } else {
      if (nextIndex >= deck.length) isGameOver = true;
    }

    if (isGameOver) {
      soundEngine.playStageVictory();
      onFinishGame({
        mode,
        totalQuestions: questionLogsRef.current.length,
        hits,
        homeruns,
        doubles,
        singles,
        strikeouts,
        runs,
        maxCombo,
        earnedLxp: totalEarnedLxp,
        questionLogs: questionLogsRef.current,
      });
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  const meta = SUBJECT_META[currentItem.question.subject];

  return (
    <div
      className={`w-full max-w-md mx-auto space-y-3 pb-8 select-none transition-transform duration-75 ${
        isShaking ? "translate-y-1.5 rotate-[0.8deg] scale-[1.02]" : ""
      }`}
    >
      {/* 熱闘FEVERカットイン演出 */}
      <AnimatePresence>
        {showFeverCutin && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: "0%", opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ type: "spring", damping: 18 }}
            className="fixed inset-x-0 top-1/3 z-50 py-3 bg-gradient-to-r from-[#EF4444] via-[#F59E0B] to-[#EF4444] text-white text-center shadow-2xl border-y-4 border-white pointer-events-none"
          >
            <div className="flex items-center justify-center gap-2 text-2xl sm:text-3xl font-black italic tracking-wider">
              <span>🔥</span>
              <span>熱闘FEVER ZONE 突入！！</span>
              <span>⚡</span>
            </div>
            <div className="text-xs font-black text-black tracking-widest mt-0.5">
              LXP 2倍 ＆ 豪快長打フィーバー！
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. ヘッダーナビゲーション ＆ ステータス */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={onAbort}
          className="px-2.5 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#334155] border border-[#475569] text-[#94A3B8] hover:text-white text-xs font-bold flex items-center gap-1 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>中断</span>
        </button>

        <div className="flex items-center gap-2">
          {/* フィーバーバッジ */}
          {isFever && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#EF4444] to-[#F59E0B] text-white text-xs font-black shadow-lg border border-white"
            >
              <Flame className="w-3.5 h-3.5 fill-white" />
              <span>FEVER ×2.0</span>
            </motion.div>
          )}

          {combo > 1 && !isFever && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#EF4444] to-[#F59E0B] text-white text-[11px] font-black animate-pulse">
              <Flame className="w-3.5 h-3.5 fill-white" />
              <span>{combo} 連打！</span>
            </div>
          )}

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#111827] border border-[#334155] text-xs font-black text-[#FACC15]">
            <Zap className="w-3.5 h-3.5 fill-[#FACC15]" />
            <span>+{totalEarnedLxp}</span>
          </div>
        </div>
      </div>

      {/* 2. 電光掲示板・スコアボード */}
      <div
        className={`border-2 rounded-2xl p-3 shadow-md transition ${
          isFever
            ? "bg-gradient-to-r from-[#2A0D12] via-[#090D16] to-[#2A0D12] border-[#EF4444] shadow-p5-red"
            : "bg-[#090D16] border-[#334155]"
        }`}
      >
        <div className="grid grid-cols-4 items-center text-center divide-x divide-[#1E293B]">
          {/* 回 / 打席 */}
          <div className="px-1">
            <span className="text-[9px] font-bold text-[#94A3B8] block">打席 / 回</span>
            <span className="text-sm font-black text-white">
              {mode === "game9" ? `${inning}回裏` : `${currentIndex + 1} / ${deck.length}`}
            </span>
          </div>

          {/* 得点 */}
          <div className="px-1">
            <span className="text-[9px] font-bold text-[#FACC15] block">得点</span>
            <span className="text-lg font-black text-[#FACC15] tracking-wider leading-none">
              {runs}
            </span>
          </div>

          {/* ランナー状況 */}
          <div className="px-1 flex flex-col items-center justify-center">
            <span className="text-[9px] font-bold text-[#94A3B8] block mb-0.5">
              {isBasesLoaded ? "満塁チャンス" : "ランナー"}
            </span>
            <div className="relative w-7 h-7 flex items-center justify-center">
              <div
                className={`absolute top-0 w-2.5 h-2.5 rotate-45 border ${
                  bases[1] ? "bg-[#EF4444] border-white shadow-sm" : "bg-[#1E293B] border-[#475569]"
                }`}
              />
              <div
                className={`absolute left-0 w-2.5 h-2.5 rotate-45 border ${
                  bases[2] ? "bg-[#EF4444] border-white shadow-sm" : "bg-[#1E293B] border-[#475569]"
                }`}
              />
              <div
                className={`absolute right-0 w-2.5 h-2.5 rotate-45 border ${
                  bases[0] ? "bg-[#EF4444] border-white shadow-sm" : "bg-[#1E293B] border-[#475569]"
                }`}
              />
              <div className="absolute bottom-0 w-2 h-2 rotate-45 bg-[#94A3B8] opacity-50" />
            </div>
          </div>

          {/* カウント (S-O) */}
          <div className="px-1 text-[10px] space-y-0.5 text-left font-black pl-3">
            <div className="flex items-center gap-1">
              <span className="text-[#FACC15] w-2.5">S</span>
              <div className="flex gap-1">
                <span className={`w-2 h-2 rounded-full ${strikes >= 1 ? "bg-[#FACC15]" : "bg-[#334155]"}`} />
                <span className={`w-2 h-2 rounded-full ${strikes >= 2 ? "bg-[#FACC15]" : "bg-[#334155]"}`} />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[#EF4444] w-2.5">O</span>
              <div className="flex gap-1">
                <span className={`w-2 h-2 rounded-full ${outs >= 1 ? "bg-[#EF4444]" : "bg-[#334155]"}`} />
                <span className={`w-2 h-2 rounded-full ${outs >= 2 ? "bg-[#EF4444]" : "bg-[#334155]"}`} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 甲子園グラウンド ＆ 打席スタジアム */}
      <div
        className={`relative w-full h-44 rounded-2xl border-2 overflow-hidden shadow-inner flex flex-col justify-between p-3 transition-colors duration-500 ${
          isFever
            ? "bg-gradient-to-b from-[#7F1D1D] via-[#450A0A] to-[#1E1B4B] border-[#EF4444]"
            : "bg-gradient-to-b from-[#134E4A] via-[#064E3B] to-[#14532D] border-[#10B981]/50"
        }`}
      >
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[repeating-linear-gradient(45deg,#000_0px,#000_20px,transparent_20px,transparent_40px)]" />

        {/* 外野フェンス＆帯 */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm border border-white/20">
            <span className="text-sm">{meta.icon}</span>
            <span className="text-[11px] font-black text-white">{meta.name}</span>
            <span className="text-[10px] text-[#94A3B8]">
              {currentItem.question.stage === 2 ? "★発展" : "標準"}
            </span>
          </div>

          <div className="px-2 py-0.5 rounded text-[10px] font-black bg-black/50 text-[#CBD5E1] border border-white/10 truncate max-w-[200px]">
            {currentItem.question.chapter}
          </div>
        </div>

        {/* ピッチャー投球とボール演出 */}
        <div className="relative z-10 flex items-center justify-center">
          {pitching && (
            <motion.div
              initial={{ scale: 0.3, y: -20, opacity: 0 }}
              animate={{ scale: 1.2, y: 30, opacity: 1 }}
              transition={{ duration: 0.38, ease: "easeIn" }}
              className="text-2xl drop-shadow-lg"
            >
              ⚾
            </motion.div>
          )}

          {ballFlying && (
            <motion.div
              initial={{ scale: 1, x: 0, y: 20 }}
              animate={{
                scale: [1, 2.2, 0.3],
                x: [0, 90, 180],
                y: [20, -90, -160],
              }}
              transition={{ duration: 0.8 }}
              className="text-3xl drop-shadow-2xl absolute"
            >
              ⚾💨
            </motion.div>
          )}
        </div>

        {/* バッターボックス＆選手アバター */}
        <div className="relative z-10 flex items-end justify-between px-4">
          <div className="flex items-end gap-2">
            <BaseballCharacter
              gender={player.gender}
              pose={pose}
              size={96}
              teamColor={player.teamColor}
              level={player.level}
              batTier={player.selectedBatTier}
              animate={true}
              showAura={true}
            />
            <div className="mb-2 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-black text-white border border-white/10">
              第{currentIndex + 1}打席
            </div>
          </div>

          {/* 打撃結果のトースト */}
          <AnimatePresence>
            {hitBanner.show && (
              <motion.div
                initial={{ scale: 0.6, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className={`p-2.5 rounded-xl border-2 text-center shadow-2xl max-w-[190px] ${
                  hitBanner.outcome === "HOMERUN"
                    ? "bg-gradient-to-r from-[#EF4444] to-[#F59E0B] border-white text-white"
                    : hitBanner.outcome === "OUT"
                    ? "bg-[#1E293B] border-[#EF4444] text-[#F87171]"
                    : "bg-[#0F172A] border-[#38BDF8] text-white"
                }`}
              >
                <div className="text-xs font-black tracking-wide leading-tight">
                  {hitBanner.title}
                </div>
                <div className="text-[10px] opacity-90 line-clamp-1 mt-0.5 font-bold">
                  {hitBanner.sub}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 4. 出題問題カード */}
      <div className="bg-[#111827] border-2 border-white/80 p-4 rounded-2xl shadow-p5-red space-y-2 relative overflow-hidden">
        <div className="flex items-center justify-between text-[11px] text-[#94A3B8] font-bold">
          <span className="flex items-center gap-1 text-[#FACC15]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{currentItem.question.section || currentItem.question.chapter}</span>
          </span>
          <span>問 {currentItem.question.number}</span>
        </div>

        <div className="text-sm font-black text-white leading-relaxed min-h-[52px]">
          {currentItem.question.question}
        </div>

        {currentItem.question.supplement && (
          <div className="text-[11px] text-[#94A3B8] bg-[#090D16] p-2 rounded-lg border border-[#262D3D] flex items-start gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
            <span>ヒント・解説: {currentItem.question.supplement}</span>
          </div>
        )}
      </div>

      {/* 5. 4択バッティングボタン */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {currentItem.choices.map((choice, idx) => {
          const isSelected = selectedChoiceId === choice.id;
          let btnStyle = "bg-[#1E293B] hover:bg-[#334155] border-[#475569] text-white";

          if (isAnswered) {
            if (choice.isCorrect) {
              btnStyle = "bg-[#10B981] border-white text-slate-950 font-black shadow-lg scale-[1.02]";
            } else if (isSelected && !choice.isCorrect) {
              btnStyle = "bg-[#EF4444] border-white text-white font-black opacity-80";
            } else {
              btnStyle = "bg-[#0F172A] border-[#262D3D] text-[#64748B] opacity-40";
            }
          }

          return (
            <motion.button
              key={choice.id}
              whileTap={!isAnswered ? { scale: 0.97 } : {}}
              onClick={() => handleSelectChoice(choice.id, choice.isCorrect, choice.text)}
              disabled={isAnswered}
              className={`p-3 rounded-xl border-2 flex items-center justify-between text-left transition ${btnStyle}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-6 h-6 rounded-lg bg-black/30 border border-white/20 flex items-center justify-center text-xs font-black shrink-0">
                  {idx + 1}
                </span>
                <span className="text-xs font-black truncate">{choice.text}</span>
              </div>

              {isAnswered && choice.isCorrect && (
                <CheckCircle2 className="w-4 h-4 text-slate-950 shrink-0" />
              )}
              {isAnswered && isSelected && !choice.isCorrect && (
                <XCircle className="w-4 h-4 text-white shrink-0" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* 6. 不正解時の解説・「次へ進む」ボタン */}
      {isAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#090D16] border border-[#334155] p-3 rounded-xl flex items-center justify-between gap-3 shadow-md"
        >
          <div className="min-w-0 flex-1">
            <div className="text-[10px] text-[#94A3B8] font-bold">正解の用語</div>
            <div className="text-sm font-black text-[#FACC15] flex items-center gap-1.5">
              <span>{currentItem.question.answer}</span>
              {currentItem.question.answer_kana && (
                <span className="text-[10px] text-[#CBD5E1] font-normal">
                  ({currentItem.question.answer_kana})
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => advanceNextAtBat(true)}
            className="px-4 py-2 rounded-xl bg-[#FACC15] hover:bg-[#FFE600] text-black font-black text-xs flex items-center gap-1 shadow-sm active:scale-95 transition shrink-0"
          >
            <span>次の打席へ</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
};
