"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Trophy,
  Swords,
  Clock,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import {
  getRankingCooldownStatus,
  getSavedPlayerName,
  resetRankingCooldown,
  savePlayerName,
} from "@/lib/rankingService";
import { soundEngine } from "@/lib/soundEngine";

interface RankingEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartBattle: (playerName: string) => void;
  onOpenLeaderboard: () => void;
}

export const RankingEntryModal: React.FC<RankingEntryModalProps> = ({
  isOpen,
  onClose,
  onStartBattle,
  onOpenLeaderboard,
}) => {
  const [playerName, setPlayerName] = useState("");
  const [cooldown, setCooldown] = useState<{
    canPlay: boolean;
    remainingHours: number;
    remainingMinutes: number;
  }>({ canPlay: true, remainingHours: 0, remainingMinutes: 0 });

  const refreshCooldown = () => {
    const status = getRankingCooldownStatus();
    setCooldown({
      canPlay: status.canPlay,
      remainingHours: status.remainingHours,
      remainingMinutes: status.remainingMinutes,
    });
  };

  useEffect(() => {
    if (isOpen) {
      setPlayerName(getSavedPlayerName());
      refreshCooldown();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStart = () => {
    const trimmed = playerName.trim();
    if (!trimmed) {
      alert("ランキングに刻む名前を入力してください！");
      return;
    }
    if (!cooldown.canPlay) {
      alert(
        `ランキングバトルは24時間に1回のみ挑戦可能です！\n次回挑戦まで: あと ${cooldown.remainingHours}時間${cooldown.remainingMinutes}分`
      );
      return;
    }
    savePlayerName(trimmed);
    onClose();
    onStartBattle(trimmed);
  };

  const handleResetCooldown = () => {
    resetRankingCooldown();
    refreshCooldown();
    soundEngine.playTap();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="relative w-full max-w-md bg-slate-900/98 border-2 border-amber-500/60 rounded-3xl shadow-2xl overflow-hidden text-slate-100"
        >
          {/* ヘッダー */}
          <div className="px-5 py-3.5 border-b border-slate-800 bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-500/20 border border-amber-400/40 rounded-xl text-amber-400">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black tracking-wide text-white">
                  ランキングバトル 出撃エントリー
                </h2>
                <p className="text-[10px] text-amber-300/80 font-bold">
                  英検4級 全700語 対象・全20問
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
              title="閉じる"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 sm:p-5 space-y-4">
            {/* 24時間ルール警告バナー */}
            <div className="p-3 bg-amber-950/50 border border-amber-500/40 rounded-2xl flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <div className="font-black text-amber-300">
                  ⚠️ 24時間に1回のみ挑戦可能！
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  本番の緊張感を味わうため、ランキングバトルの挑戦は1日1回に制限されています。集中して全問正解＆最速タイムを目指そう！
                </p>
              </div>
            </div>

            {/* クールダウン状態判定 */}
            {!cooldown.canPlay ? (
              <div className="p-4 bg-slate-950/80 border-2 border-red-500/40 rounded-2xl text-center space-y-2.5">
                <div className="flex items-center justify-center gap-1.5 text-xs font-black text-red-400">
                  <Clock className="w-4 h-4" />
                  <span>本日の挑戦は終了しています</span>
                </div>
                <div className="text-xl font-black font-mono text-white">
                  次回挑戦まで:{" "}
                  <span className="text-amber-400">
                    {cooldown.remainingHours}時間{cooldown.remainingMinutes}分
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  通常ステージで特訓して、次回の挑戦に備えよう！
                </p>
                <div className="pt-1 flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenLeaderboard();
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-bold text-xs transition"
                  >
                    🏆 現在のランキングを見る
                  </button>
                  {/* テスト用リセット */}
                  <button
                    onClick={handleResetCooldown}
                    className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-[10px] border border-slate-800 transition flex items-center gap-1"
                    title="開発・テスト用：24時間制限を即時リセット"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>リセット(テスト用)</span>
                  </button>
                </div>
              </div>
            ) : (
              /* 名前入力フォーム */
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-black text-slate-200 block mb-1.5">
                    ランキングに登録する名前 / ニックネーム
                  </label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleStart();
                    }}
                    placeholder="例: たろう / Yosuke / 英語マスター"
                    maxLength={15}
                    autoFocus
                    className="w-full bg-slate-950 border-2 border-amber-400/60 px-3.5 py-2.5 rounded-xl text-base font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    ※アカウント登録・パスワード不要。この名前でランキングボードに掲載されます。
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>出題形式: 全20問 (4択・スピードアタック)</span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenLeaderboard();
                    }}
                    className="text-amber-400 hover:underline font-bold text-[11px]"
                  >
                    順位表を確認する ➔
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* フッターアクション */}
          <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
            >
              キャンセル
            </button>

            {cooldown.canPlay ? (
              <button
                onClick={handleStart}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/25 active:scale-95 transition"
              >
                <Swords className="w-4 h-4" />
                <span>この名前で出撃する (全20問)</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onOpenLeaderboard();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition"
              >
                <Trophy className="w-4 h-4" />
                <span>ランキングを見る</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
