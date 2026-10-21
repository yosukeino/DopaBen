"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Zap, Swords, Flame, Sparkles, Shield, ArrowRight } from "lucide-react";
import { PlayerProfile } from "@/lib/types";
import { PixelCharacter } from "@/components/PixelCharacter";
import { BaseballCharacter } from "@/components/BaseballCharacter";

export interface StageEntranceData {
  id: string;
  stageNumber: string;
  subject: string;
  codeName: string;
  roleBadge: string;
  tagline: string;
  href: string;
  colors: {
    accent: string;
    btnBg: string;
    btnText: string;
  };
  characterType: "hero" | "baseball" | "math" | "science" | "japanese";
  detailLore: string;
  specialMove: string;
}

interface StageEntranceCutinProps {
  stage: StageEntranceData;
  profile: PlayerProfile | null;
  onComplete: () => void;
}

export const StageEntranceCutin: React.FC<StageEntranceCutinProps> = ({
  stage,
  profile,
  onComplete,
}) => {
  const [phase, setPhase] = useState<"slash" | "hero" | "engage" | "warp">("slash");

  useEffect(() => {
    // タイムライン制御
    // 0.0s: スラッシュ＆アラート展開
    // 0.35s: キャラクター＆必殺技カットイン
    const t1 = setTimeout(() => {
      setPhase("hero");
    }, 350);

    // 0.9s: 破裂＆ENGAGE !! 発動
    const t2 = setTimeout(() => {
      setPhase("engage");
      try {
        confetti({
          particleCount: 50,
          spread: 80,
          origin: { y: 0.5 },
          colors: [stage.colors.accent, "#FFFFFF", "#FACC15", "#10B981"],
        });
      } catch {}
    }, 900);

    // 1.5s: ハイパースペース・ホワイトアウト突入
    const t3 = setTimeout(() => {
      setPhase("warp");
    }, 1500);

    // 1.85s: 完了コールバック（ルーター遷移）
    const t4 = setTimeout(() => {
      onComplete();
    }, 1850);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [stage, onComplete]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black select-none flex items-center justify-center">
      {/* 1. 背景：ダークサイバー空間 ＆ 放射状スピードライン */}
      <div className="absolute inset-0 bg-[#07090E]">
        {/* 放射状スピード線 */}
        <div
          className="absolute inset-0 opacity-25 mix-blend-screen animate-pulse pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at center, transparent 35%, rgba(255,255,255,0.4) 100%),
              repeating-conic-gradient(from 0deg, transparent 0deg 4deg, rgba(255,255,255,0.12) 4deg 8deg)`,
          }}
        />
        {/* 背景の巨大グリッド */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `linear-gradient(${stage.colors.accent} 1px, transparent 1px), linear-gradient(90deg, ${stage.colors.accent} 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* 2. 上下の警戒警報ストライプ（左右逆方向に高速ループ） */}
      <div className="absolute top-0 inset-x-0 h-9 sm:h-11 bg-slate-950 border-b-2 border-white flex items-center overflow-hidden z-20 shadow-lg">
        <motion.div
          animate={{ x: [0, -400] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
          className="whitespace-nowrap flex items-center gap-6 text-[10px] sm:text-xs font-black tracking-widest text-[#FACC15]"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>WARNING // SYSTEM ENGAGING // STAGE {stage.stageNumber} // {stage.codeName} READY</span>
            </span>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-9 sm:h-11 bg-slate-950 border-t-2 border-white flex items-center overflow-hidden z-20 shadow-lg">
        <motion.div
          animate={{ x: [-400, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
          className="whitespace-nowrap flex items-center gap-6 text-[10px] sm:text-xs font-black tracking-widest text-[#38BDF8]"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>DOPABEN PROTOCOL // MISSION START // HIGH DOPAMINE LEARNING //</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* 3. 画面を斜めに一刀両断する特大スラッシュバナー（ペルソナ5調） */}
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="absolute inset-x-0 h-72 sm:h-80 -skew-y-6 flex items-center justify-center z-10 overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)]"
        style={{
          background: `linear-gradient(135deg, ${stage.colors.accent} 0%, #0F172A 45%, #020617 100%)`,
          borderTop: "3px solid #FFFFFF",
          borderBottom: "3px solid #FFFFFF",
        }}
      >
        {/* バナー内を駆け抜ける光速グリントシャイン */}
        <span className="pointer-events-none absolute inset-0 w-32 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 animate-glint-sweep" />

        {/* 4. メイン演出コンテンツ（キャラクター ＆ 名乗り ＆ 特大タイポグラフィ） */}
        <div className="skew-y-6 w-full max-w-lg px-4 flex flex-col items-center justify-center text-center relative z-20">
          {/* 上段：ステージナンバー ＆ 教科コードネーム */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="flex items-center gap-2 mb-2"
          >
            <span className="px-3 py-0.5 rounded-full bg-white text-slate-950 font-black text-xs sm:text-sm tracking-wider shadow-[2px_2px_0_#000] -skew-x-12">
              STAGE {stage.stageNumber}
            </span>
            <span className="text-xs sm:text-sm font-black tracking-widest text-amber-300 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {stage.codeName} // {stage.roleBadge}
            </span>
          </motion.div>

          {/* 中段：キャラクター ＆ アクション */}
          <div className="relative flex items-center justify-center my-1">
            {/* キャラ背後の巨大な回転リング光背 */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute w-40 h-40 sm:w-48 sm:h-48 rounded-full border-2 border-dashed border-white/40 pointer-events-none"
            />
            <div className="absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-amber-400/30 to-rose-500/30 blur-2xl pointer-events-none animate-pulse" />

            {/* キャラ本体（ズーム＆ドロップイン） */}
            <motion.div
              initial={{ scale: 0.2, rotate: -15, opacity: 0 }}
              animate={{ scale: 1.15, rotate: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 14 }}
              className="relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
            >
              {stage.id === "stage-english" && (
                <PixelCharacter
                  gender={profile?.gender ?? "boy"}
                  stage={profile?.level ?? 1}
                  size={120}
                  mood="attack"
                  showAura={true}
                  animateFrames={true}
                />
              )}
              {stage.id === "stage-social" && (
                <BaseballCharacter
                  gender="boy"
                  pose="stance"
                  size={120}
                  teamColor="#EF4444"
                  level={3}
                  batTier={2}
                  animate={true}
                  showAura={true}
                />
              )}
              {stage.id !== "stage-english" && stage.id !== "stage-social" && (
                <div className="w-24 h-24 rounded-2xl bg-white/10 border-2 border-white flex items-center justify-center text-4xl">
                  ⚔️
                </div>
              )}
            </motion.div>
          </div>

          {/* 下段：必殺技名 ＆ 名乗り */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.35 }}
            className="space-y-1 mt-1"
          >
            <div className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] flex items-center justify-center gap-2">
              <Flame className="w-5 h-5 text-amber-400 fill-amber-400 animate-bounce" />
              <span>{stage.subject}編 覚醒出撃！</span>
              <Flame className="w-5 h-5 text-amber-400 fill-amber-400 animate-bounce" />
            </div>

            <div className="inline-block px-3 py-1 rounded-xl bg-black/75 border border-amber-400/60 backdrop-blur-sm shadow-md">
              <span className="text-xs sm:text-sm font-black text-amber-300">
                {stage.specialMove.split(" ")[0]}
              </span>
              <span className="text-[11px] font-bold text-slate-200 ml-1.5 hidden sm:inline">
                {stage.specialMove.split(" ").slice(1).join(" ")}
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* 5. クライマックス：MISSION START 爆発バナー */}
      <AnimatePresence>
        {phase === "engage" && (
          <motion.div
            initial={{ scale: 2.2, opacity: 0 }}
            animate={{ scale: [2.2, 1, 1.05], opacity: 1 }}
            exit={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
          >
            <div className="px-6 py-2.5 sm:px-10 sm:py-3.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 border-4 border-white font-black text-2xl sm:text-4xl tracking-widest uppercase -skew-x-12 shadow-[0_0_50px_rgba(250,204,21,0.9),6px_6px_0_#000000]">
              MISSION START !!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. ラスト：ホワイトアウト・ハイパースペース突入 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "warp" ? 1 : 0 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="absolute inset-0 bg-white z-40 pointer-events-none flex items-center justify-center"
      >
        <div className="w-full h-1 bg-amber-400 scale-x-100 animate-ping" />
      </motion.div>
    </div>
  );
};
