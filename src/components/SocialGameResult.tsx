"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Trophy,
  Flame,
  Zap,
  RotateCcw,
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  PackageOpen,
  Sparkles,
  Compass,
  Hourglass,
  Scale,
} from "lucide-react";
import { GameSummary } from "./SocialBaseballGame";
import { SUBJECT_META } from "@/lib/socialData";
import { soundEngine } from "@/lib/soundEngine";

interface SocialGameResultProps {
  summary: GameSummary;
  onPlayAgain: (reviewOnly?: boolean) => void;
  onBackToLobby: () => void;
}

export const SocialGameResult: React.FC<SocialGameResultProps> = ({
  summary,
  onPlayAgain,
  onBackToLobby,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [displayedLxp, setDisplayedLxp] = useState(0);
  const [isBoxOpened, setIsBoxOpened] = useState(false);

  const battingAverage =
    summary.totalQuestions > 0
      ? (summary.hits / summary.totalQuestions).toFixed(3).replace(/^0/, "")
      : ".000";

  const missedLogs = summary.questionLogs.filter((log) => !log.isCorrect);

  const handleOpenChest = () => {
    if (isBoxOpened) return;
    setIsBoxOpened(true);
    soundEngine.playBatCrack();
    soundEngine.playEvolutionFanfare();

    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.5 },
      colors: ["#FACC15", "#EF4444", "#38BDF8", "#FFFFFF", "#10B981"],
    });

    const start = performance.now();
    const duration = 1100;
    const target = summary.earnedLxp;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const current = Math.floor(target * progress);
      setDisplayedLxp(current);
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (missedLogs.length > 0) {
      try {
        const stored = localStorage.getItem("dopasoc_weak_question_ids");
        const existingIds: number[] = stored ? JSON.parse(stored) : [];
        const newIds = Array.from(
          new Set([...existingIds, ...missedLogs.map((l) => l.question.id)])
        );
        localStorage.setItem("dopasoc_weak_question_ids", JSON.stringify(newIds));
      } catch {
        // ignore
      }
    }
  }, [summary]);

  return (
    <div className="w-full max-w-md mx-auto space-y-4 pb-10 select-none">
      {/* 1. タイトル＆ヒーローバナー */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-[#1E293B] via-[#1C0D12] to-[#0B0D12] border-2 border-white p-5 rounded-3xl shadow-p5-red text-center space-y-3 relative overflow-hidden"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EF4444]/20 border border-[#EF4444]/40 text-[#EF4444] text-xs font-black">
          <Trophy className="w-3.5 h-3.5" />
          <span>無限ノック特訓完了！</span>
        </div>

        <div>
          <div className="text-3xl font-black italic text-white tracking-wide">
            全{summary.totalQuestions}本 完遂！
          </div>
          <div className="text-xs text-[#CBD5E1] mt-0.5">
            鬼コーチの猛ノックを耐え抜いた！
          </div>
        </div>

        {/* 甲子園ゴールド宝箱タップ開封演出 */}
        {!isBoxOpened ? (
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenChest}
            className="cursor-pointer bg-gradient-to-r from-[#B45309] via-[#F59E0B] to-[#FACC15] p-4 rounded-2xl border-2 border-white shadow-2xl flex flex-col items-center justify-center space-y-1.5 group"
          >
            <motion.div
              animate={{ rotate: [-3, 3, -3], scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="text-4xl drop-shadow-lg"
            >
              🎁
            </motion.div>
            <span className="text-xs font-black text-slate-950 flex items-center gap-1 group-hover:scale-105 transition">
              <Sparkles className="w-4 h-4 text-black" />
              <span>タップして特訓報酬を開封！</span>
            </span>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#090D16] border border-[#FACC15] p-3 rounded-2xl flex items-center justify-between shadow-lg"
          >
            <span className="text-xs text-[#94A3B8] font-bold">獲得ストックLXP:</span>
            <span className="text-2xl font-black text-[#FACC15] flex items-center gap-1">
              <Zap className="w-5 h-5 fill-[#FACC15]" />
              <span>+{displayedLxp.toLocaleString()} LXP</span>
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* 2. ノック成果スタッツ（トータルノック本数、正解数、最高連続正解数） */}
      <div className="bg-[#0F172A] border-2 border-[#334155] p-4 rounded-2xl space-y-3 shadow-md">
        <h3 className="text-xs font-black text-white flex items-center gap-1.5">
          <span>⚾</span>
          <span>今回のノック捕球スタッツ (KNOCK RECORD)</span>
        </h3>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-[#1E293B] p-2.5 rounded-xl border border-[#334155]">
            <span className="text-[10px] text-[#94A3B8] font-bold block">ノック本数</span>
            <span className="text-xl font-black text-white">{summary.totalQuestions}本</span>
          </div>

          <div className="bg-[#1E293B] p-2.5 rounded-xl border border-[#334155]">
            <span className="text-[10px] text-[#10B981] font-bold block">ナイス捕球(正解)</span>
            <span className="text-xl font-black text-[#10B981]">{summary.hits}本</span>
          </div>

          <div className="bg-[#1E293B] p-2.5 rounded-xl border border-[#334155]">
            <span className="text-[10px] text-[#38BDF8] font-bold block">最高連続捕球</span>
            <span className="text-xl font-black text-[#38BDF8]">{summary.maxCombo}連</span>
          </div>
        </div>

        {/* 3大分野別の獲得捕球数 */}
        <div className="pt-2 border-t border-[#334155] grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-[#083344]/50 border border-[#06B6D4]/40 p-2 rounded-xl">
            <span className="text-[10px] text-[#38BDF8] font-bold flex items-center justify-center gap-1">
              <Compass className="w-3 h-3" />
              <span>地理捕球</span>
            </span>
            <span className="text-base font-black text-white">+{summary.geoCatches}</span>
          </div>

          <div className="bg-[#451A03]/50 border border-[#F59E0B]/40 p-2 rounded-xl">
            <span className="text-[10px] text-[#FBBF24] font-bold flex items-center justify-center gap-1">
              <Hourglass className="w-3 h-3" />
              <span>歴史捕球</span>
            </span>
            <span className="text-base font-black text-white">+{summary.historyCatches}</span>
          </div>

          <div className="bg-[#064E3B]/50 border border-[#10B981]/40 p-2 rounded-xl">
            <span className="text-[10px] text-[#34D399] font-bold flex items-center justify-center gap-1">
              <Scale className="w-3 h-3" />
              <span>公民捕球</span>
            </span>
            <span className="text-base font-black text-white">+{summary.civicsCatches}</span>
          </div>
        </div>
      </div>

      {/* 3. 全打席振り返りリスト */}
      <div className="bg-[#0F172A] border-2 border-[#334155] p-4 rounded-2xl space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-white flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#FACC15]" />
            <span>全ノックの一問一答プレイバック ({summary.questionLogs.length}問)</span>
          </h3>
          <span className="text-[10px] text-[#94A3B8]">タップで解説表示</span>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {summary.questionLogs.map((log, idx) => {
            const isExpanded = expandedIndex === idx;
            const meta = SUBJECT_META[log.question.subject];

            return (
              <div
                key={idx}
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className={`p-3 rounded-xl border transition cursor-pointer ${
                  log.isCorrect
                    ? "bg-[#1E293B]/70 border-[#334155] hover:border-[#10B981]/50"
                    : "bg-[#2D151B]/80 border-[#EF4444]/40 hover:border-[#EF4444]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-black shrink-0 ${
                        log.isCorrect ? "bg-[#10B981]/20 text-[#10B981]" : "bg-[#EF4444]/20 text-[#EF4444]"
                      }`}
                    >
                      {log.isCorrect ? "○" : "×"}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-[#94A3B8] font-bold shrink-0">
                      {meta.name}
                    </span>
                    <span className="text-xs font-bold text-white truncate">
                      {log.question.answer}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <span
                      className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                        log.outcome === "HOMERUN"
                          ? "bg-[#EF4444] text-white"
                          : log.outcome === "DOUBLE"
                          ? "bg-[#F59E0B] text-black"
                          : log.outcome === "SINGLE"
                          ? "bg-[#38BDF8] text-black"
                          : "bg-[#475569] text-white"
                      }`}
                    >
                      {log.outcome}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-[#94A3B8]" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2 pt-2 border-t border-[#334155] space-y-1.5 text-xs"
                  >
                    <div className="text-[#CBD5E1] text-[11px] leading-relaxed">
                      <span className="font-bold text-white">問題: </span>
                      {log.question.question}
                    </div>

                    <div className="text-[11px] text-[#FACC15] font-bold">
                      正解: {log.question.answer}
                      {log.question.answer_kana && ` (${log.question.answer_kana})`}
                    </div>

                    {log.question.supplement && (
                      <div className="text-[10px] text-[#94A3B8] bg-black/40 p-2 rounded-lg border border-white/5">
                        💡 補足: {log.question.supplement}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. アクションボタン */}
      <div className="space-y-2 pt-2">
        {missedLogs.length > 0 && (
          <button
            onClick={() => onPlayAgain(true)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#EF4444] to-[#DC2626] hover:brightness-110 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>ミスした{missedLogs.length}問を重点特訓（リベンジ打席）</span>
          </button>
        )}

        <button
          onClick={() => onPlayAgain(false)}
          className="w-full py-3 rounded-xl bg-[#FACC15] hover:bg-[#FFE600] text-black font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition"
        >
          <RotateCcw className="w-4 h-4" />
          <span>もう一度ノック特訓を受ける</span>
        </button>

        <button
          onClick={onBackToLobby}
          className="w-full py-2.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-[#475569] text-[#94A3B8] hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>グラウンド（メニュー）へ戻る</span>
        </button>
      </div>
    </div>
  );
};
