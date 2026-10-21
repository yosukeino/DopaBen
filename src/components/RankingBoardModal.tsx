"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Trophy,
  Medal,
  Clock,
  Flame,
  Sparkles,
  RefreshCw,
  Swords,
  Crown,
} from "lucide-react";
import {
  fetchTopRankings,
  getLastRankingOnlineStatus,
  getOrCreatePlayerUuid,
  getSavedPlayerName,
  normalizePlayerName,
  RankingRecord,
} from "@/lib/rankingService";
import { soundEngine } from "@/lib/soundEngine";

interface RankingBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartRankingBattle: () => void;
  course?: string;
  subject?: string;
}

export const RankingBoardModal: React.FC<RankingBoardModalProps> = ({
  isOpen,
  onClose,
  onStartRankingBattle,
  course = "eiken4",
  subject = "english",
}) => {
  const [rankings, setRankings] = useState<RankingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [userUuid, setUserUuid] = useState("");
  const [savedName, setSavedName] = useState("");

  const loadData = async () => {
    setIsLoading(true);
    const list = await fetchTopRankings(course, 50, subject);
    setRankings(list);
    setIsOnline(getLastRankingOnlineStatus());
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      setUserUuid(getOrCreatePlayerUuid());
      setSavedName(getSavedPlayerName());
      loadData();
    }
  }, [isOpen, course]);

  if (!isOpen) return null;

  // 自分の最高記録を見つける
  const myNormName = normalizePlayerName(savedName);
  const myRecordIndex = rankings.findIndex(
    (r) =>
      (userUuid && r.playerUuid === userUuid) ||
      (myNormName && normalizePlayerName(r.playerName) === myNormName)
  );
  const myRecord = myRecordIndex >= 0 ? rankings[myRecordIndex] : null;
  const myRank = myRecordIndex >= 0 ? myRecordIndex + 1 : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="relative w-full max-w-lg max-h-[92vh] flex flex-col bg-slate-900/95 border-2 border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden text-slate-100"
        >
          {/* ヘッダー */}
          <div className="px-5 py-3.5 border-b border-slate-800 bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-500/20 border border-amber-400/40 rounded-xl text-amber-400 shadow-[0_0_12px_rgba(250,204,21,0.3)]">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h2 className="text-base sm:text-lg font-black tracking-wide text-white">
                    全国ランキングバトル
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    英検4級 全20問
                  </span>
                  {isOnline ? (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      全国DB同期中
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                      端末ローカル集計
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400">
                  正解数 ＆ クリアスピードで競うスピードアタック！
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={loadData}
                disabled={isLoading}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-amber-300 transition"
                title="更新"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
                title="閉じる"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 自分の自己ベスト表示カード */}
          <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800/90 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[10px] font-bold text-slate-400 shrink-0">
                あなたの最高記録:
              </span>
              {myRecord ? (
                <div className="flex items-center gap-2 truncate">
                  <span className="font-black text-amber-400">
                    第 {myRank} 位
                  </span>
                  <span className="text-slate-300 truncate">
                    {myRecord.playerName}
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {myRecord.score}/{myRecord.totalQuestions}問
                  </span>
                  <span className="font-mono text-cyan-300 text-[11px]">
                    {(myRecord.timeMs / 1000).toFixed(1)}s
                  </span>
                </div>
              ) : (
                <span className="text-slate-400 italic text-[11px]">
                  まだ記録がありません。挑戦してみよう！
                </span>
              )}
            </div>

            <button
              onClick={() => {
                soundEngine.playTap();
                onClose();
                onStartRankingBattle();
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-[11px] shrink-0 flex items-center gap-1 shadow-md shadow-amber-500/20 active:scale-95 transition"
            >
              <Swords className="w-3.5 h-3.5" />
              <span>挑戦する</span>
            </button>
          </div>

          {/* ランキング一覧 */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
            {isLoading ? (
              <div className="py-16 text-center space-y-2">
                <RefreshCw className="w-6 h-6 text-amber-400 animate-spin mx-auto" />
                <p className="text-xs text-slate-400 font-bold">
                  ランキングを集計中...
                </p>
              </div>
            ) : rankings.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <Trophy className="w-12 h-12 text-slate-600 mx-auto opacity-50" />
                <p className="text-sm font-bold text-slate-300">
                  まだランキング記録がありません！
                </p>
                <p className="text-xs text-slate-500">
                  あなたが最初の挑戦者になって1位を記録しよう！
                </p>
                <button
                  onClick={() => {
                    soundEngine.playTap();
                    onClose();
                    onStartRankingBattle();
                  }}
                  className="mt-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs inline-flex items-center gap-1.5 shadow-lg active:scale-95 transition"
                >
                  <Swords className="w-4 h-4" />
                  <span>ランキングバトルを開始 (全20問)</span>
                </button>
              </div>
            ) : (
              rankings.map((rec, idx) => {
                const rank = idx + 1;
                const isMe =
                  (userUuid && rec.playerUuid === userUuid) ||
                  (myNormName && normalizePlayerName(rec.playerName) === myNormName);

                // メダルスタイル
                let rankBadge: React.ReactNode = (
                  <span className="font-mono text-xs font-black text-slate-400 w-6 text-center">
                    {rank}
                  </span>
                );
                let rowBg = "bg-slate-800/60 border-slate-700/70";

                if (rank === 1) {
                  rankBadge = (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-300 to-amber-500 text-slate-950 flex items-center justify-center font-black text-sm shadow-[0_0_10px_rgba(250,204,21,0.5)] border border-amber-200">
                      🥇
                    </div>
                  );
                  rowBg = "bg-gradient-to-r from-amber-950/70 via-slate-800/80 to-amber-950/50 border-amber-500/60 shadow-md ring-1 ring-amber-400/40";
                } else if (rank === 2) {
                  rankBadge = (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-slate-200 to-slate-400 text-slate-950 flex items-center justify-center font-black text-sm border border-slate-100">
                      🥈
                    </div>
                  );
                  rowBg = "bg-gradient-to-r from-slate-800/90 to-slate-800/60 border-slate-400/50";
                } else if (rank === 3) {
                  rankBadge = (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-600 to-amber-800 text-white flex items-center justify-center font-black text-sm border border-amber-400">
                      🥉
                    </div>
                  );
                  rowBg = "bg-gradient-to-r from-amber-950/40 to-slate-800/60 border-amber-700/50";
                }

                if (isMe) {
                  rowBg += " ring-2 ring-emerald-400 border-emerald-400";
                }

                return (
                  <div
                    key={rec.id || idx}
                    className={`p-2.5 sm:p-3 rounded-2xl border transition flex items-center justify-between gap-2.5 ${rowBg}`}
                  >
                    {/* 順位 ＆ プレイヤー名 */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="shrink-0 flex items-center justify-center">
                        {rankBadge}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-xs sm:text-sm text-white truncate">
                            {rec.playerName}
                          </span>
                          {isMe && (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-emerald-500 text-slate-950 shrink-0">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                          <span className="flex items-center gap-0.5 text-amber-300 font-bold">
                            <Flame className="w-2.5 h-2.5 text-amber-400" />
                            {rec.maxCombo} Combo
                          </span>
                          <span>•</span>
                          <span>{rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : ""}</span>
                        </div>
                      </div>
                    </div>

                    {/* 正解数 ＆ タイム ＆ スコア */}
                    <div className="text-right shrink-0 space-y-0.5">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-mono font-black text-xs sm:text-sm text-emerald-400">
                          {rec.score}/{rec.totalQuestions}
                          <span className="text-[10px] text-emerald-500/80 font-normal ml-0.5">問</span>
                        </span>
                        <span className="font-mono text-xs sm:text-sm text-cyan-300 font-bold flex items-center gap-0.5">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          {(rec.timeMs / 1000).toFixed(1)}s
                        </span>
                      </div>
                      <div className="font-mono text-[10px] text-slate-400 font-bold">
                        {rec.gamePoints.toLocaleString()} PT
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* フッター */}
          <div className="px-4 py-3 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between gap-2">
            <span className="text-[10px] text-slate-400 hidden sm:inline">
              全20問の正解数＆最速タイムでランキングに挑戦！
            </span>
            <button
              onClick={() => {
                soundEngine.playTap();
                onClose();
                onStartRankingBattle();
              }}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/25 active:scale-95 transition"
            >
              <Swords className="w-4 h-4" />
              <span>ランキングバトルに挑戦 (全20問)</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
