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
} from "lucide-react";
import {
  BaseballPlayerProfile,
  BaseballStats,
  BAT_EQUIPMENTS,
  BatTier,
  calculateOverallRank,
  getStatUpgradeCost,
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

const STAT_CONFIG: {
  key: keyof BaseballStats;
  label: string;
  icon: any;
  color: string;
  desc: string;
}[] = [
  { key: "meet", label: "ミート", icon: Eye, color: "#38BDF8", desc: "4択の確実性・正解判定の寛容度" },
  { key: "power", label: "パワー", icon: Swords, color: "#EF4444", desc: "超特大ホームラン・長打発生率" },
  { key: "speed", label: "走力", icon: Footprints, color: "#10B981", desc: "ランナー高速進塁・追加点力" },
  { key: "focus", label: "集中力", icon: Flame, color: "#F59E0B", desc: "フィーバー突入率・コンボ継続力" },
  { key: "clutch", label: "勝負強さ", icon: Sparkles, color: "#A855F7", desc: "走者満塁・得点圏でのボーナス倍率" },
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
  const nextRank = PLAYER_RANKS.find((r) => r.level === player.level + 1);
  const overall = calculateOverallRank(player.stats);

  // ステータス強化処理
  const handleUpgradeStat = (statKey: keyof BaseballStats) => {
    const currentVal = player.stats[statKey];
    if (currentVal >= 99) return;

    const cost = getStatUpgradeCost(currentVal);
    if (player.exp < cost) {
      soundEngine.playStrike();
      return;
    }

    soundEngine.playBatCrack();
    const newStats = {
      ...player.stats,
      [statKey]: currentVal + 1,
    };

    onUpdatePlayer({
      ...player,
      exp: player.exp - cost,
      stats: newStats,
    });
  };

  // バット装備切り替え
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm select-none">
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
                  Locker Room & Player Training
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

          {/* 2. 選手プレビュー ＆ 総合ランク */}
          <div className="py-3 flex items-center justify-between bg-gradient-to-r from-[#1E293B] to-[#111827] border border-[#334155] rounded-2xl p-3 my-2.5 shrink-0">
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
                  <span>所持ストック:</span>
                  <span className="text-[#FACC15] font-black flex items-center">
                    <Zap className="w-3 h-3 fill-[#FACC15]" />
                    <span>{player.exp.toLocaleString()} LXP</span>
                  </span>
                </div>
              </div>
            </div>

            {/* 総合評価ランクバッジ */}
            <div className="text-right">
              <span className="text-[9px] font-bold text-[#94A3B8] block">総合評価</span>
              <div
                style={{ color: overall.color }}
                className="text-2xl font-black italic tracking-wider leading-none"
              >
                {overall.rank}
              </div>
              <span className="text-[9px] text-[#64748B]">Avg.{overall.average}</span>
            </div>
          </div>

          {/* 3. タブ切り替え（能力強化 / 装備バット） */}
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
              ⚾ 選手能力アップ
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

          {/* 4. タブコンテンツ (スクロール可能) */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
            {activeTab === "stats" && (
              <div className="space-y-2">
                {STAT_CONFIG.map((cfg) => {
                  const val = player.stats[cfg.key];
                  const cost = getStatUpgradeCost(val);
                  const canUpgrade = player.exp >= cost && val < 99;
                  const Icon = cfg.icon;

                  return (
                    <div
                      key={cfg.key}
                      className="bg-[#1E293B]/80 border border-[#334155] rounded-xl p-2.5 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div
                          style={{ backgroundColor: `${cfg.color}20`, color: cfg.color }}
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border border-current/30"
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-black text-white">{cfg.label}</span>
                            <span className="font-black text-sm" style={{ color: cfg.color }}>
                              {val} <span className="text-[10px] text-[#64748B]">/ 99</span>
                            </span>
                          </div>

                          {/* プログレスバー */}
                          <div className="w-full h-1.5 bg-[#0B0D12] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(val / 99) * 100}%` }}
                              style={{ backgroundColor: cfg.color }}
                              className="h-full rounded-full"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 強化ボタン */}
                      <button
                        onClick={() => handleUpgradeStat(cfg.key)}
                        disabled={!canUpgrade}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 shrink-0 transition active:scale-95 ${
                          canUpgrade
                            ? "bg-[#FACC15] hover:bg-[#FFE600] text-black shadow-sm"
                            : "bg-[#334155] text-[#64748B] cursor-not-allowed"
                        }`}
                      >
                        <Zap className="w-3 h-3 fill-current" />
                        <span>+{cost}</span>
                      </button>
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
