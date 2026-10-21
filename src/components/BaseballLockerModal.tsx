"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Zap,
  Trophy,
  Flame,
  Sparkles,
  ArrowUpRight,
  Shield,
  Swords,
  Footprints,
  Eye,
  CheckCircle2,
  Lock,
  Compass,
  Hourglass,
  Scale,
} from "lucide-react";
import {
  BaseballPlayerProfile,
  SocialTriStats,
  BAT_EQUIPMENTS,
  BatTier,
  calculateOverallRank,
  PLAYER_RANKS,
} from "@/lib/baseballGrowthEngine";
import { BaseballCharacter } from "./BaseballCharacter";
import { soundEngine } from "@/lib/soundEngine";

interface BaseballLockerModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: BaseballPlayerProfile;
  onUpdatePlayer: (updated: BaseballPlayerProfile) => void;
}

const TRI_STAT_CONFIG: {
  key: keyof SocialTriStats;
  label: string;
  subLabel: string;
  icon: any;
  color: string;
  gradient: string;
  desc: string;
}[] = [
  {
    key: "geo",
    label: "地理力",
    subLabel: "GEOGRAPHY",
    icon: Compass,
    color: "#06B6D4",
    gradient: "from-[#083344] to-[#0E7490]/30",
    desc: "世界・日本の気候・地形・産業への理解。地理のノックを捕球するほど成長！",
  },
  {
    key: "history",
    label: "歴史力",
    subLabel: "HISTORY",
    icon: Hourglass,
    color: "#F59E0B",
    gradient: "from-[#451A03] to-[#B45309]/30",
    desc: "古代から現代までの流れ・重要人物。歴史のノックを捕球するほど成長！",
  },
  {
    key: "civics",
    label: "公民力",
    subLabel: "CIVICS",
    icon: Scale,
    color: "#10B981",
    gradient: "from-[#064E3B] to-[#059669]/30",
    desc: "憲法・三権分立・経済・国際社会。公民のノックを捕球するほど成長！",
  },
];

export const BaseballLockerModal: React.FC<BaseballLockerModalProps> = ({
  isOpen,
  onClose,
  player,
  onUpdatePlayer,
}) => {
  const [activeTab, setActiveTab] = useState<"stats" | "gear">("stats");

  if (!isOpen) return null;

  const currentRank = PLAYER_RANKS.find((r) => r.level === player.level) || PLAYER_RANKS[0];
  const overall = calculateOverallRank(player.stats);

  const handleSelectBat = (tier: BatTier) => {
    const bat = BAT_EQUIPMENTS.find((b) => b.tier === tier);
    if (!bat || player.level < bat.unlockLevel) return;

    soundEngine.playBatCrack();
    onUpdatePlayer({
      ...player,
      selectedBatTier: tier,
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm select-none">
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 16 }}
          className="relative w-full max-w-md bg-[#0F172A] border-2 border-white rounded-3xl p-4 sm:p-5 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* 背景装飾 */}
          <div className="absolute -top-16 -right-16 w-44 h-44 bg-[#EF4444]/15 rounded-full blur-3xl pointer-events-none" />

          {/* 1. モーダルヘッダー */}
          <div className="flex items-center justify-between pb-3 border-b border-[#334155] shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏟️</span>
              <div>
                <span className="text-[10px] font-black tracking-widest text-[#EF4444] uppercase block">
                  Locker Room & Player Stats
                </span>
                <h2 className="text-base font-black italic text-white">
                  学園野球部 ロッカールーム
                </h2>
              </div>
            </div>

            <button
              onClick={() => {
                soundEngine.playTap();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-[#1E293B] hover:bg-[#334155] border border-[#475569] flex items-center justify-center text-[#94A3B8] hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 2. 選手プレビュー ＆ トータルノック記録 */}
          <div className="py-3 bg-gradient-to-r from-[#1E293B] to-[#111827] border border-[#334155] rounded-2xl p-3 my-2.5 shrink-0 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl bg-[#090D16] border border-[#475569] flex items-center justify-center relative shrink-0">
                  <BaseballCharacter
                    gender={player.gender}
                    pose="stance"
                    size={58}
                    teamColor={player.teamColor}
                    level={player.level}
                    batTier={player.selectedBatTier}
                    animate={true}
                    showAura={true}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[9px] font-black bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40">
                      Lv.{player.level} {currentRank.badge}
                    </span>
                    <span className="text-xs font-black text-white">
                      {currentRank.title}
                    </span>
                  </div>

                  <div className="text-[10px] text-[#94A3B8] mt-1 flex items-center gap-1">
                    <span>所持LXP:</span>
                    <span className="text-[#FACC15] font-black flex items-center">
                      <Zap className="w-3 h-3 fill-[#FACC15]" />
                      <span>{player.exp.toLocaleString()} LXP</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* 総合評価ランクバッジ */}
              <div className="text-right">
                <span className="text-[9px] font-bold text-[#94A3B8] block">総合社会ランク</span>
                <div
                  style={{ color: overall.color }}
                  className="text-2xl font-black italic tracking-wider leading-none"
                >
                  {overall.rank}
                </div>
                <span className="text-[9px] text-[#64748B]">平均 {overall.average}</span>
              </div>
            </div>

            {/* トータルノック記録スタッツバー */}
            <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-[#334155]/60 text-center text-xs">
              <div className="bg-[#090D16] p-1.5 rounded-lg border border-[#262D3D]">
                <span className="text-[9px] text-[#94A3B8] block">トータルノック</span>
                <span className="font-black text-white">{player.career.totalKnocks} 本</span>
              </div>
              <div className="bg-[#090D16] p-1.5 rounded-lg border border-[#262D3D]">
                <span className="text-[9px] text-[#10B981] block">ナイス捕球(正解)</span>
                <span className="font-black text-[#10B981]">{player.career.totalCatches} 本</span>
              </div>
              <div className="bg-[#090D16] p-1.5 rounded-lg border border-[#262D3D]">
                <span className="text-[9px] text-[#38BDF8] block">最高連続捕球</span>
                <span className="font-black text-[#38BDF8]">{player.career.maxCombo} 連</span>
              </div>
            </div>
          </div>

          {/* 3. タブ切り替え（3大ステータス / バット装備） */}
          <div className="flex items-center gap-2 mb-2 shrink-0">
            <button
              onClick={() => {
                soundEngine.playTap();
                setActiveTab("stats");
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-black transition ${
                activeTab === "stats"
                  ? "bg-[#EF4444] text-white shadow-md"
                  : "bg-[#1E293B] text-[#94A3B8] hover:text-white"
              }`}
            >
              🌏 3大ステータス（地理・歴史・公民）
            </button>
            <button
              onClick={() => {
                soundEngine.playTap();
                setActiveTab("gear");
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-black transition ${
                activeTab === "gear"
                  ? "bg-[#EF4444] text-white shadow-md"
                  : "bg-[#1E293B] text-[#94A3B8] hover:text-white"
              }`}
            >
              🏏 バット装備着せ替え
            </button>
          </div>

          {/* 4. タブコンテンツ */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
            {activeTab === "stats" && (
              <div className="space-y-2.5">
                {TRI_STAT_CONFIG.map((cfg) => {
                  const val = player.stats[cfg.key];
                  const Icon = cfg.icon;
                  const catches =
                    cfg.key === "geo"
                      ? player.career.geoCatches
                      : cfg.key === "history"
                      ? player.career.historyCatches
                      : player.career.civicsCatches;

                  return (
                    <div
                      key={cfg.key}
                      className="bg-gradient-to-r from-[#1E293B] to-[#111827] border border-[#334155] rounded-2xl p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            style={{ backgroundColor: `${cfg.color}20`, color: cfg.color }}
                            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border border-current/30"
                          >
                            <Icon className="w-4 h-4" />
                          </div>

                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-black text-sm text-white">{cfg.label}</span>
                              <span
                                style={{ color: cfg.color }}
                                className="text-[10px] font-bold uppercase tracking-wider"
                              >
                                {cfg.subLabel}
                              </span>
                            </div>
                            <span className="text-[10px] text-[#94A3B8]">
                              通算正解: {catches} 問
                            </span>
                          </div>
                        </div>

                        {/* ステータス値 */}
                        <div className="text-right">
                          <span
                            className="text-xl font-black italic tracking-wide"
                            style={{ color: cfg.color }}
                          >
                            {val}
                          </span>
                          <span className="text-[10px] text-[#64748B]"> / 99</span>
                        </div>
                      </div>

                      {/* プログレスゲージ */}
                      <div className="w-full h-2 bg-[#090D16] rounded-full overflow-hidden p-0.5 border border-[#334155]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(val / 99) * 100}%` }}
                          style={{ backgroundColor: cfg.color }}
                          className="h-full rounded-full"
                        />
                      </div>

                      <div className="text-[10px] text-[#94A3B8] leading-relaxed">
                        {cfg.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === "gear" && (
              <div className="space-y-2">
                {BAT_EQUIPMENTS.map((bat) => {
                  const isUnlocked = player.level >= bat.unlockLevel;
                  const isEquipped = player.selectedBatTier === bat.tier;

                  return (
                    <div
                      key={bat.tier}
                      onClick={() => isUnlocked && handleSelectBat(bat.tier)}
                      className={`p-3 rounded-2xl border-2 transition ${
                        isEquipped
                          ? "bg-gradient-to-r from-[#1E293B] to-[#111827] border-[#FACC15] shadow-md"
                          : isUnlocked
                          ? "bg-[#1E293B]/70 border-[#334155] hover:border-white cursor-pointer"
                          : "bg-[#090D16]/80 border-[#262D3D] opacity-60 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div
                            style={{ backgroundColor: bat.color }}
                            className="w-4 h-9 rounded-sm shadow-sm rotate-45 border border-white/20"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black text-white">
                                {bat.name}
                              </span>
                              <span
                                style={{ color: bat.color }}
                                className="text-[9px] font-black px-1.5 py-0.5 rounded bg-black/40 border border-current/30"
                              >
                                {bat.badge}
                              </span>
                            </div>
                            <div className="text-[10px] text-[#94A3B8] mt-0.5">
                              {bat.description}
                            </div>
                          </div>
                        </div>

                        <div>
                          {isEquipped ? (
                            <span className="px-2 py-1 rounded-lg bg-[#FACC15] text-black text-[10px] font-black flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>装備中</span>
                            </span>
                          ) : isUnlocked ? (
                            <span className="px-2 py-1 rounded-lg bg-[#334155] hover:bg-[#475569] text-white text-[10px] font-bold">
                              装備する
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-lg bg-black/40 text-[#64748B] text-[10px] font-bold flex items-center gap-1">
                              <Lock className="w-3 h-3" />
                              <span>Lv.{bat.unlockLevel}で解放</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
