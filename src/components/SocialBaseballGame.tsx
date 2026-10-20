"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  Flame,
  Zap,
  Trophy,
  Volume2,
  VolumeX,
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
import { SocialQuestion, SUBJECT_META, SocialSubject } from "@/lib/socialData";
import { soundEngine } from "@/lib/soundEngine";
import { BaseballCharacter, BaseballPose } from "./BaseballCharacter";

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
  gender: "boy" | "girl";
  teamColor: string;
  onFinishGame: (summary: GameSummary) => void;
  onAbort: () => void;
}

export const SocialBaseballGame: React.FC<SocialBaseballGameProps> = ({
  deck,
  mode,
  gender,
  teamColor,
  onFinishGame,
  onAbort,
}) => {
  // 進行インデックス
  const [currentIndex, setCurrentIndex] = useState(0);

  // 野球ステータス
  const [inning, setInning] = useState(1);
  const [outs, setOuts] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [runs, setRuns] = useState(0);
  const [bases, setBases] = useState<[boolean, boolean, boolean]>([false, false, false]); // [1B, 2B, 3B]

  // 成績集計
  const [hits, setHits] = useState(0);
  const [homeruns, setHomeruns] = useState(0);
  const [doubles, setDoubles] = useState(0);
  const [singles, setSingles] = useState(0);
  const [strikeouts, setStrikeouts] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [totalEarnedLxp, setTotalEarnedLxp] = useState(0);

  // 打席アニメーション状態
  const [pose, setPose] = useState<BaseballPose>("stance");
  const [pitching, setPitching] = useState(false);
  const [ballFlying, setBallFlying] = useState(false);
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
  const [showExplanation, setShowExplanation] = useState(false);

  // ログ追跡
  const questionLogsRef = useRef<GameSummary["questionLogs"]>([]);

  const currentItem = deck[currentIndex];

  // 設問開始時のリセット
  useEffect(() => {
    setSelectedChoiceId(null);
    setIsAnswered(false);
    setShowExplanation(false);
    setPose("stance");
    setHitBanner({ show: false, title: "", sub: "", outcome: "SINGLE" });

    // ピッチャーの投球アニメーション
    setPitching(true);
    const timer = setTimeout(() => {
      setPitching(false);
      setQuestionStartTime(Date.now());
    }, 400);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  // 回答処理
  const handleSelectChoice = (choiceId: string, isCorrect: boolean, choiceText: string) => {
    if (isAnswered || !currentItem) return;

    setIsAnswered(true);
    setSelectedChoiceId(choiceId);
    const responseTime = Date.now() - questionStartTime;

    const evaluation = evaluateAtBat(isCorrect, responseTime, combo, bases);

    // ログ記録
    questionLogsRef.current.push({
      question: currentItem.question,
      userChoice: choiceText,
      isCorrect,
      outcome: evaluation.outcome,
    });

    if (isCorrect) {
      // 成功処理
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);

      setTotalEarnedLxp((prev) => prev + evaluation.lxpGained);
      setRuns((prev) => prev + evaluation.runsScored);
      setBases(evaluation.newBases);
      setStrikes(0);

      // 成績加算
      setHits((prev) => prev + 1);
      if (evaluation.outcome === "HOMERUN") {
        setHomeruns((prev) => prev + 1);
        setPose("homerun");
        soundEngine.playHomerun();
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#EF4444", "#FACC15", "#38BDF8", "#FFFFFF"],
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

      // 自動で次の打席へ進む（解説がある場合は読める余韻を持たせる）
      setTimeout(() => {
        advanceNextAtBat(false);
      }, evaluation.outcome === "HOMERUN" ? 2200 : 1600);
    } else {
      // 不正解処理
      setCombo(0);
      setPose("miss");
      soundEngine.playStrike();

      const newStrikes = strikes + 1;
      let isNewOut = false;

      if (newStrikes >= 2 || mode !== "endless") {
        // 2ストライクで三振アウト（またはサクサク進行のため1ミスでアウト）
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

      // 不正解時は解説をしっかり確認できるように自動遷移を長め、または「次へ」ボタンを提示
      setShowExplanation(true);
    }
  };

  // 次の打席へ進む処理
  const advanceNextAtBat = (forceNext: boolean = false) => {
    // 試合終了判定
    const nextIndex = currentIndex + 1;

    // ゲームセット判定
    let isGameOver = false;

    if (mode === "game9") {
      // 9イニング制：各イニング1打席（全9打席）または3アウト制
      if (nextIndex >= 9 || nextIndex >= deck.length) {
        isGameOver = true;
      } else {
        setInning(nextIndex + 1);
      }
    } else if (mode === "quick") {
      // 10問クイック
      if (nextIndex >= deck.length) {
        isGameOver = true;
      }
    } else if (mode === "endless") {
      // 3アウトでゲームセット
      if (outs >= 3 || nextIndex >= deck.length) {
        isGameOver = true;
      }
    } else {
      if (nextIndex >= deck.length) {
        isGameOver = true;
      }
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
    <div className="w-full max-w-md mx-auto space-y-3 pb-8 select-none">
      {/* 1. ヘッダーナビゲーション ＆ 中止ボタン */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={onAbort}
          className="px-2.5 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#334155] border border-[#475569] text-[#94A3B8] hover:text-white text-xs font-bold flex items-center gap-1 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>中断して戻る</span>
        </button>

        <div className="flex items-center gap-2">
          {combo > 1 && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#EF4444] to-[#F59E0B] text-white text-[11px] font-black animate-pulse shadow-sm">
              <Flame className="w-3.5 h-3.5 fill-white" />
              <span>{combo} 連打！</span>
            </div>
          )}

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#111827] border border-[#334155] text-xs font-black text-[#FACC15]">
            <Zap className="w-3.5 h-3.5 fill-[#FACC15]" />
            <span>+{totalEarnedLxp} LXP</span>
          </div>
        </div>
      </div>

      {/* 2. 電光掲示板・スコアボード */}
      <div className="bg-[#090D16] border-2 border-[#334155] rounded-2xl p-3 shadow-md">
        <div className="grid grid-cols-4 items-center text-center divide-x divide-[#1E293B]">
          {/* イニング / 打席数 */}
          <div className="px-1">
            <span className="text-[9px] font-bold text-[#94A3B8] block">打席 / 回</span>
            <span className="text-sm font-black text-white">
              {mode === "game9" ? `${inning}回裏` : `${currentIndex + 1} / ${deck.length}`}
            </span>
          </div>

          {/* 得点 (RUNS) */}
          <div className="px-1">
            <span className="text-[9px] font-bold text-[#FACC15] block">得点 (RUNS)</span>
            <span className="text-lg font-black text-[#FACC15] tracking-wider leading-none">
              {runs}
            </span>
          </div>

          {/* ランナー塁状況 */}
          <div className="px-1 flex flex-col items-center justify-center">
            <span className="text-[9px] font-bold text-[#94A3B8] block mb-0.5">ランナー</span>
            <div className="relative w-7 h-7 flex items-center justify-center">
              {/* 2塁 (上) */}
              <div
                className={`absolute top-0 w-2.5 h-2.5 rotate-45 border ${
                  bases[1] ? "bg-[#EF4444] border-white shadow-sm" : "bg-[#1E293B] border-[#475569]"
                }`}
              />
              {/* 3塁 (左) */}
              <div
                className={`absolute left-0 w-2.5 h-2.5 rotate-45 border ${
                  bases[2] ? "bg-[#EF4444] border-white shadow-sm" : "bg-[#1E293B] border-[#475569]"
                }`}
              />
              {/* 1塁 (右) */}
              <div
                className={`absolute right-0 w-2.5 h-2.5 rotate-45 border ${
                  bases[0] ? "bg-[#EF4444] border-white shadow-sm" : "bg-[#1E293B] border-[#475569]"
                }`}
              />
              {/* 本塁 (下) */}
              <div className="absolute bottom-0 w-2 h-2 rotate-45 bg-[#94A3B8] opacity-50" />
            </div>
          </div>

          {/* カウント (B-S-O) */}
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
      <div className="relative w-full h-44 bg-gradient-to-b from-[#134E4A] via-[#064E3B] to-[#14532D] rounded-2xl border-2 border-[#10B981]/50 overflow-hidden shadow-inner flex flex-col justify-between p-3">
        {/* 背景の芝生ストライプ装飾 */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[repeating-linear-gradient(45deg,#000_0px,#000_20px,transparent_20px,transparent_40px)]" />

        {/* 外野フェンス＆スコアボード風帯 */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm border border-white/20">
            <span className="text-sm">{meta.icon}</span>
            <span className="text-[11px] font-black text-white">{meta.name}</span>
            <span className="text-[10px] text-[#94A3B8]">
              {currentItem.question.stage === 2 ? "★発展" : "標準"}
            </span>
          </div>

          <div className="px-2 py-0.5 rounded text-[10px] font-black bg-black/50 text-[#CBD5E1] border border-white/10">
            {currentItem.question.chapter}
          </div>
        </div>

        {/* ピッチャーマウンドとボール投球演出 */}
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
                scale: [1, 2, 0.4],
                x: [0, 80, 160],
                y: [20, -80, -140],
              }}
              transition={{ duration: 0.8 }}
              className="text-3xl drop-shadow-2xl absolute"
            >
              ⚾💨
            </motion.div>
          )}
        </div>

        {/* バッターボックス＆キャラクター */}
        <div className="relative z-10 flex items-end justify-between px-4">
          {/* 打者キャラクター */}
          <div className="flex items-end gap-2">
            <BaseballCharacter
              gender={gender}
              pose={pose}
              size={96}
              teamColor={teamColor}
              animate={true}
            />
            <div className="mb-2 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-black text-white border border-white/10">
              第{currentIndex + 1}打席
            </div>
          </div>

          {/* 打撃結果のポップアップトースト */}
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

        {/* 問題文 */}
        <div className="text-sm font-black text-white leading-relaxed min-h-[52px]">
          {currentItem.question.question}
        </div>

        {/* 補足ヒント（存在する場合） */}
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
