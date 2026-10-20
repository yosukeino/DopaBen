"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Trophy, Flame, Swords, Terminal, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { CharacterGender, FiveStats, PlayerProfile } from "@/lib/types";
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
  onFocusInjectStat?: (statKey: keyof FiveStats) => void;
  onInjectSingleStat: (statKey: keyof FiveStats) => void;
  getStatUpgradeLxpCost: (currentVal: number) => number;
  onOpenSkillModal: () => void;
  onClose: () => void;
  onToggleGender?: (gender: CharacterGender) => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
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
  onFocusInjectStat,
  onInjectSingleStat,
  getStatUpgradeLxpCost,
  onOpenSkillModal,
  onClose,
  onToggleGender,
  isMuted,
  onToggleMute,
}) => {
  // 各ステータスに「今全振りしたら何ポイント伸ばせるか」を計算
  const calculateFocusPoints = (statKey: keyof FiveStats) => {
    let tempVal = profile.stats[statKey];
    let remaining = profile.exp;
    let pts = 0;
    while (pts < 30 && tempVal < 100) {
      const cost = getStatUpgradeLxpCost(tempVal);
      if (cost <= 0 || remaining < cost) break;
      remaining -= cost;
      tempVal += 1;
      pts += 1;
    }
    return pts;
  };
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
        <div className="bg-[#131720] px-3.5 py-2 flex items-center justify-between border-b-2 border-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="bg-[#FACC15] text-[#0B0D12] font-black text-xs px-2.5 py-0.5 -skew-x-12 border border-[#0B0D12]">
              STATUS
            </span>
            <span className="font-black text-xs sm:text-sm text-white tracking-wide">
              ステータス＆育成
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* 男子 / 女子 切替トグル */}
            {onToggleGender && (
              <div className="flex border border-white/50 p-0.5 bg-[#0B0D12] rounded">
                <button
                  type="button"
                  onClick={() => onToggleGender("boy")}
                  className={`px-2 py-0.5 text-[10px] font-black rounded transition ${
                    profile.gender === "boy"
                      ? "bg-[#FACC15] text-[#0B0D12]"
                      : "text-[#94A3B8] hover:text-white"
                  }`}
                >
                  男子
                </button>
                <button
                  type="button"
                  onClick={() => onToggleGender("girl")}
                  className={`px-2 py-0.5 text-[10px] font-black rounded transition ${
                    profile.gender === "girl"
                      ? "bg-[#F43F5E] text-white shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                      : "text-[#94A3B8] hover:text-white"
                  }`}
                >
                  女子
                </button>
              </div>
            )}

            {/* 音声ON/OFF */}
            {onToggleMute && (
              <button
                type="button"
                onClick={onToggleMute}
                className="p-1 border border-white/40 bg-[#0B0D12] rounded text-white hover:border-[#FACC15] transition"
                title="音声ON/OFF"
              >
                {isMuted ? (
                  <VolumeX className="w-3.5 h-3.5 text-[#EF4444]" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-[#FACC15]" />
                )}
              </button>
            )}

            <button
              onClick={() => {
                soundEngine.playTap();
                onClose();
              }}
              className="p-1 hover:bg-white/10 text-white transition rounded ml-1"
              title="閉じる"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
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

          {/* 3. LXP注入育成パネル（ボス戦用ステータス） */}
          <div className="bg-[#0B0D12] border border-[#262D3D] p-3 space-y-3">
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
              <div>
                <span className="text-xs font-black text-white flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-[#FACC15] fill-[#FACC15]" />
                  五角形ステータス注入育成
                </span>
                <span className="text-[10px] text-[#94A3B8] font-bold block mt-0.5">
                  ⚔️ 後に実装される「大ボス戦」で直接使う能力値です
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#94A3B8] block">所持LXP</span>
                <span className="text-xs font-black text-[#FACC15]">
                  {profile.exp.toLocaleString()} LXP
                </span>
              </div>
            </div>

            {/* ① 平均的に注入するボタン */}
            <button
              type="button"
              disabled={affordableStatPoints <= 0}
              onClick={onBatchInjectLxp}
              className={`w-full py-2.5 px-3 text-xs font-black border -skew-x-6 flex items-center justify-center gap-1.5 transition ${
                affordableStatPoints > 0
                  ? "cursor-pointer bg-[#FACC15] hover:brightness-110 text-[#0B0D12] border-white shadow-[3px_3px_0_#10B981] active:scale-95"
                  : "cursor-not-allowed bg-[#131720] text-[#94A3B8] border-[#262D3D]"
              }`}
            >
              <Zap className="w-4 h-4 shrink-0" />
              {affordableStatPoints > 0 ? (
                <span>⚖️ 平均的にLXPを注入する（+{affordableStatPoints} PT 分配）</span>
              ) : (
                <span>バトルでLXPを貯めると注入できます</span>
              )}
            </button>

            {/* ② 特定のちからに全振りセクション */}
            <div className="space-y-1.5 pt-1 border-t border-[#1E293B]">
              <span className="text-[10px] font-black text-[#CBD5E1] block">
                ⚡ 特定のちからにLXPを全振り注入:
              </span>
              <div className="grid grid-cols-5 gap-1.5">
                {(
                  [
                    { key: "vocab", label: "語彙", icon: "📖" },
                    { key: "speed", label: "瞬発", icon: "⚡" },
                    { key: "grammar", label: "構築", icon: "🛡️" },
                    { key: "listening", label: "聴覚", icon: "🎧" },
                    { key: "guts", label: "度胸", icon: "🔥" },
                  ] as { key: keyof FiveStats; label: string; icon: string }[]
                ).map(({ key, label, icon }) => {
                  const val = profile.stats[key];
                  const focusPts = calculateFocusPoints(key);
                  const canFocus = focusPts > 0 && val < 100;

                  return (
                    <button
                      key={key}
                      type="button"
                      disabled={!canFocus}
                      onClick={() => onFocusInjectStat?.(key)}
                      className={`py-2 px-1 text-center border rounded transition flex flex-col items-center justify-between min-h-[58px] ${
                        canFocus
                          ? "cursor-pointer bg-[#131720] hover:bg-[#FACC15] hover:text-[#0B0D12] text-white border-[#FACC15] active:scale-95 shadow-sm"
                          : "cursor-not-allowed bg-[#0F172A]/40 text-[#64748B] border-[#1E293B]"
                      }`}
                    >
                      <div className="text-[10px] font-black leading-tight flex items-center gap-0.5">
                        <span>{icon}</span>
                        <span>{label}</span>
                      </div>
                      <div className="text-[11px] font-black text-[#10B981] my-0.5">
                        {val}
                      </div>
                      <div className="text-[9px] font-black px-1 rounded bg-[#030712]/60 text-[#FACC15]">
                        {val >= 100 ? "MAX" : canFocus ? `+${focusPts}全振` : "残LXP少"}
                      </div>
                    </button>
                  );
                })}
              </div>
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
