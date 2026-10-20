"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Trophy, Flame, Swords, Terminal, RotateCcw } from "lucide-react";
import { FiveStats, PlayerProfile } from "@/lib/types";
import { PixelCharacter } from "./PixelCharacter";
import { StarRadarChart } from "./StarRadarChart";
import { SKILL_HACKS } from "@/lib/vocabData";
import { soundEngine } from "@/lib/soundEngine";
import { getCharacterEvolutionTitle } from "@/lib/characterPartsEngine";

interface StatusModalProps {
  profile: PlayerProfile;
  totalLxp: number;
  currentStageInfo: {
    titleBoy: string;
    titleGirl: string;
    subtitle: string;
    unlockMessage: string;
  };
  radarBounceKey: number;
  onRadarBounce: () => void;
  recentInjectedGains?: Partial<FiveStats>;
  injectionNotice: string | null;
  affordableStatPoints: number;
  onBatchInjectLxp: () => void;
  onInjectSingleStat: (statKey: keyof FiveStats) => void;
  getStatUpgradeLxpCost: (currentVal: number) => number;
  onOpenSkillModal: () => void;
  onClose: () => void;
}

export const StatusModal: React.FC<StatusModalProps> = ({
  profile,
  totalLxp,
  currentStageInfo,
  radarBounceKey,
  onRadarBounce,
  recentInjectedGains,
  injectionNotice,
  affordableStatPoints,
  onBatchInjectLxp,
  onInjectSingleStat,
  getStatUpgradeLxpCost,
  onOpenSkillModal,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#0B0D12]/90 backdrop-blur-sm flex items-center justify-center p-3 select-none">
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="w-full max-w-md max-h-[90vh] bg-[#131720] border-2 border-white shadow-p5-yellow flex flex-col overflow-hidden"
      >
        {/* モーダルヘッダー */}
        <div className="bg-[#131720] px-3.5 py-2.5 flex items-center justify-between border-b-2 border-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="bg-[#FACC15] text-[#0B0D12] font-black text-xs px-2.5 py-0.5 -skew-x-12 border border-[#0B0D12]">
              STATUS
            </span>
            <span className="font-black text-sm text-white tracking-wide">
              ステータス＆育成
            </span>
          </div>

          <button
            onClick={() => {
              soundEngine.playTap();
              onClose();
            }}
            className="p-1 hover:bg-white/10 text-white transition rounded"
            title="閉じる"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* モーダルコンテンツ（スクロール可能） */}
        <div className="p-3.5 space-y-3.5 overflow-y-auto">
          {/* 1. キャラクター概要バナー */}
          <div className="bg-[#0B0D12] border-2 border-white p-3 flex items-center gap-3 relative overflow-hidden shadow-[3px_3px_0_#FACC15]">
            <div className="bg-[#131720] border border-white p-1 shrink-0">
              <PixelCharacter
                gender={profile.gender}
                stage={profile.level}
                stats={profile.stats}
                loadout={profile.characterLoadout}
                size={68}
                mood="happy"
                animateFrames={true}
              />
            </div>

            <div className="flex-1 min-w-0">
              {(() => {
                const evo = getCharacterEvolutionTitle(
                  profile.gender,
                  profile.level,
                  profile.stats,
                  profile.characterLoadout
                );
                return (
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black italic text-[#FACC15]">
                        Lv.{profile.level}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40">
                        {evo.branchBadge}
                      </span>
                      <span className="text-xs font-bold text-white truncate">
                        {evo.title}
                      </span>
                    </div>
                  </div>
                );
              })()}
              <div className="text-[10px] text-[#94A3B8] font-bold line-clamp-1 mt-0.5">
                {currentStageInfo.unlockMessage}
              </div>

              <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-[#262D3D] text-[11px] font-black">
                <span className="text-[#94A3B8]">
                  累積: <span className="text-white">{totalLxp.toLocaleString()} LXP</span>
                </span>
                <span className="text-[#FACC15]">
                  所持: {profile.exp.toLocaleString()} LXP
                </span>
              </div>
            </div>
          </div>

          {/* 2. レーダーチャート ＆ 3大戦績 */}
          <div className="bg-[#0B0D12] border border-[#262D3D] p-3 space-y-3">
            <div className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-7 flex flex-col items-center justify-center">
                <StarRadarChart
                  stats={profile.stats}
                  recentGains={recentInjectedGains || undefined}
                  variant={recentInjectedGains ? "result" : "home"}
                  triggerKey={radarBounceKey}
                />
                <button
                  onClick={() => {
                    soundEngine.playTap();
                    onRadarBounce();
                  }}
                  className="mt-1 text-[9px] font-black text-[#FACC15] hover:text-white bg-[#131720] border border-[#262D3D] hover:border-[#FACC15] px-2 py-0.5 -skew-x-6 flex items-center gap-1 active:scale-95 transition"
                >
                  <RotateCcw className="w-2.5 h-2.5" /> チャート再アニメーション
                </button>
              </div>

              <div className="col-span-5 space-y-1.5">
                <div className="bg-[#131720] border-l-4 border-[#10B981] p-1.5">
                  <div className="text-[9px] text-[#94A3B8] font-bold flex items-center gap-1">
                    <Trophy className="w-2.5 h-2.5 text-[#10B981]" /> 総撃破数
                  </div>
                  <div className="text-sm font-black text-[#10B981]">
                    {profile.totalWordsCleared}語
                  </div>
                </div>

                <div className="bg-[#131720] border-l-4 border-[#FACC15] p-1.5">
                  <div className="text-[9px] text-[#94A3B8] font-bold flex items-center gap-1">
                    <Flame className="w-2.5 h-2.5 text-[#FACC15]" /> 倍返し成功
                  </div>
                  <div className="text-sm font-black text-[#FACC15]">
                    {profile.totalRevengeJackpots}回
                  </div>
                </div>

                <div className="bg-[#131720] border-l-4 border-white p-1.5">
                  <div className="text-[9px] text-[#94A3B8] font-bold flex items-center gap-1">
                    <Swords className="w-2.5 h-2.5 text-white" /> 最高コンボ
                  </div>
                  <div className="text-sm font-black text-white">
                    {profile.maxCombo} CHAIN
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. LXP注入育成パネル */}
          <div className="bg-[#0B0D12] border border-[#262D3D] p-3 space-y-2.5">
            <AnimatePresence>
              {injectionNotice && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-[#131720] border-2 border-[#10B981] px-2.5 py-1 text-[11px] font-black text-[#10B981]"
                >
                  {injectionNotice}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-[#FACC15] fill-[#FACC15]" />
                五角形ステータス強化
              </span>
              <span className="text-[11px] font-black text-[#FACC15]">
                所持: {profile.exp.toLocaleString()} LXP
              </span>
            </div>

            {/* 一括注入ボタン */}
            <button
              type="button"
              disabled={affordableStatPoints <= 0}
              onClick={onBatchInjectLxp}
              className={`w-full py-2 px-3 text-xs font-black border -skew-x-6 flex items-center justify-center gap-1.5 transition ${
                affordableStatPoints > 0
                  ? "cursor-pointer bg-[#FACC15] hover:brightness-110 text-[#0B0D12] border-white shadow-[3px_3px_0_#10B981] active:scale-95"
                  : "cursor-not-allowed bg-[#131720] text-[#94A3B8] border-[#262D3D]"
              }`}
            >
              <Zap className="w-4 h-4 shrink-0" />
              {affordableStatPoints > 0 ? (
                <span>⚡ LXPを一括注入！（+{affordableStatPoints} PT 上昇）</span>
              ) : (
                <span>バトルでLXPを貯めると注入できます</span>
              )}
            </button>

            {/* 個別注入ボタン群 */}
            <div className="grid grid-cols-5 gap-1">
              {(
                [
                  { key: "vocab", label: "語彙" },
                  { key: "speed", label: "瞬発" },
                  { key: "grammar", label: "構築" },
                  { key: "listening", label: "聴覚" },
                  { key: "guts", label: "度胸" },
                ] as { key: keyof FiveStats; label: string }[]
              ).map(({ key, label }) => {
                const val = profile.stats[key];
                const cost = getStatUpgradeLxpCost(val);
                const canAfford = val < 100 && cost > 0 && profile.exp >= cost;
                return (
                  <button
                    key={key}
                    type="button"
                    disabled={!canAfford}
                    onClick={() => onInjectSingleStat(key)}
                    className={`py-1 px-1 text-center border transition ${
                      canAfford
                        ? "cursor-pointer bg-[#131720] hover:bg-[#FACC15] hover:text-[#0B0D12] text-white border-[#FACC15] active:scale-95"
                        : "cursor-not-allowed bg-[#131720]/50 text-[#94A3B8]/60 border-[#262D3D]"
                    }`}
                  >
                    <div className="text-[10px] font-black leading-tight">
                      {label} <span className="text-[#10B981]">{val}</span>
                    </div>
                    <div className="text-[9px] font-bold leading-tight mt-0.5">
                      {val >= 100 ? "MAX" : `+1 (${cost})`}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. 発動スキル ＆ スキル設定 */}
          <div className="bg-[#0B0D12] border border-[#262D3D] p-3 flex items-center justify-between gap-2">
            <div className="space-y-1">
              <span className="text-[11px] font-black text-white flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-[#FACC15]" /> 発動スキル
              </span>
              <div className="flex items-center gap-1 flex-wrap">
                {profile.activeSkillHacks.filter((id) => {
                  const def = SKILL_HACKS.find((s) => s.id === id);
                  return (
                    def &&
                    profile.level >= def.unlockLevel &&
                    (profile.unlockedSkillHacks || []).includes(id)
                  );
                }).length === 0 ? (
                  <span className="text-[10px] text-[#94A3B8]">
                    未装備（スキル設定から装備可能）
                  </span>
                ) : (
                  SKILL_HACKS.filter(
                    (s) =>
                      profile.level >= s.unlockLevel &&
                      (profile.unlockedSkillHacks || []).includes(s.id) &&
                      profile.activeSkillHacks.includes(s.id)
                  ).map((s) => (
                    <span
                      key={s.id}
                      className="bg-[#131720] border border-[#FACC15] text-[#FACC15] text-[10px] font-black px-1.5 py-0.5"
                    >
                      {s.badge}
                    </span>
                  ))
                )}
              </div>
            </div>

            <button
              onClick={() => {
                soundEngine.playTap();
                onClose();
                onOpenSkillModal();
              }}
              className="bg-[#FACC15] text-[#0B0D12] hover:brightness-110 font-black text-xs px-3 py-1.5 -skew-x-6 border border-white shrink-0 active:scale-95 transition"
            >
              スキル設定
            </button>
          </div>
        </div>

        {/* モーダルフッター */}
        <div className="bg-[#131720] px-3.5 py-2.5 border-t-2 border-white flex justify-end shrink-0">
          <button
            onClick={() => {
              soundEngine.playTap();
              onClose();
            }}
            className="w-full py-2 bg-[#131720] hover:bg-white hover:text-[#0B0D12] text-white border border-white font-black text-xs transition active:scale-95"
          >
            閉じる
          </button>
        </div>
      </motion.div>
    </div>
  );
};
