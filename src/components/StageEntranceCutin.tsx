"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Zap, Swords, Flame, Sparkles, Shield, ArrowRight } from "lucide-react";
import { PlayerProfile } from "@/lib/types";
import { PixelCharacter } from "@/components/PixelCharacter";
import { BaseballCharacter } from "@/components/BaseballCharacter";
import { CoachCharacter } from "@/components/CoachCharacter";

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
  const isEnglish = stage.id === "stage-english";
  const isSocial = stage.id === "stage-social";

  useEffect(() => {
    // タイムライン制御 (+0.4秒延長して合計2.25秒の重厚な儀式演出)
    // 0.00s: スラッシュ＆アラート展開
    // 0.35s: キャラクター（男女ペア / 野球部＆鬼コーチ）カットイン
    const t1 = setTimeout(() => {
      setPhase("hero");
    }, 350);

    // 1.20s: 破裂＆ENGAGE / MISSION START !! 発動
    const t2 = setTimeout(() => {
      setPhase("engage");
      try {
        confetti({
          particleCount: 65,
          spread: 85,
          origin: { y: 0.5 },
          colors: isSocial
            ? ["#EF4444", "#F97316", "#FACC15", "#FFFFFF"]
            : ["#FACC15", "#38BDF8", "#FFFFFF", "#10B981"],
        });
      } catch {}
    }, 1200);

    // 1.85s: ハイパースペース・ホワイトアウト突入
    const t3 = setTimeout(() => {
      setPhase("warp");
    }, 1850);

    // 2.25s: 完了コールバック（各ステージメニューへ遷移）
    const t4 = setTimeout(() => {
      onComplete();
    }, 2250);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [stage, isSocial, onComplete]);

  // 背景画像URLの決定
  const bgImage = isEnglish
    ? "/bg-cutin-english.jpg"
    : isSocial
    ? "/bg-cutin-social.jpg"
    : null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black select-none flex items-center justify-center">
      {/* 1. 背景：生成された美麗イラスト ＆ 空間エフェクト */}
      <div className="absolute inset-0 overflow-hidden">
        {bgImage ? (
          <motion.div
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: [1.08, 1.02], opacity: 1 }}
            transition={{ duration: 2.2, ease: "easeOut" }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${bgImage}')` }}
          >
            {/* イラスト上の雰囲気ブースト・カラーオーバーレイ */}
            <div
              className={`absolute inset-0 ${
                isSocial
                  ? "bg-gradient-to-t from-[#450A0A]/90 via-[#0B0D12]/50 to-[#991B1B]/40"
                  : "bg-gradient-to-t from-[#0B0D12]/85 via-[#0B0D12]/40 to-[#0284C7]/30"
              }`}
            />
          </motion.div>
        ) : (
          <div className="absolute inset-0 bg-[#07090E]" />
        )}

        {/* 放射状スピード集中線 */}
        <div
          className="absolute inset-0 opacity-30 mix-blend-screen pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at center, transparent 30%, rgba(255,255,255,0.4) 100%),
              repeating-conic-gradient(from 0deg, transparent 0deg 4deg, rgba(255,255,255,0.15) 4deg 8deg)`,
          }}
        />

        {/* 英語：舞い散る桜の花びらパーティクル */}
        {isEnglish && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 18 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * 400 - 100,
                  y: -40,
                  rotate: Math.random() * 360,
                  opacity: 0,
                }}
                animate={{
                  x: `+=${Math.random() * 200 + 100}`,
                  y: 800,
                  rotate: `+=${Math.random() * 720}`,
                  opacity: [0, 0.9, 0],
                }}
                transition={{
                  duration: Math.random() * 2 + 1.8,
                  delay: Math.random() * 0.8,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
                className="absolute w-3.5 h-3.5 bg-gradient-to-br from-pink-300 to-rose-400 rounded-full rounded-tr-none opacity-80 shadow-[0_0_8px_rgba(244,114,182,0.8)]"
                style={{ left: `${(i * 6) % 100}%` }}
              />
            ))}
          </div>
        )}

        {/* 社会：燃え盛る火の粉パーティクル */}
        {isSocial && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 22 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: (i * 5) % 100 + "%",
                  y: 700,
                  opacity: 0,
                  scale: Math.random() * 0.8 + 0.4,
                }}
                animate={{
                  x: `+=${Math.random() * 80 - 40}px`,
                  y: -50,
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.2, 0.2],
                }}
                transition={{
                  duration: Math.random() * 1.5 + 1.2,
                  delay: Math.random() * 0.6,
                  ease: "easeOut",
                  repeat: Infinity,
                }}
                className="absolute w-3 h-3 rounded-full bg-gradient-to-tr from-red-600 via-orange-400 to-yellow-300 shadow-[0_0_12px_#F97316]"
              />
            ))}
          </div>
        )}
      </div>

      {/* 2. 上下の警戒警報ストライプ（左右逆方向に高速ループ） */}
      <div className="absolute top-0 inset-x-0 h-9 sm:h-11 bg-slate-950/95 backdrop-blur-md border-b-2 border-white flex items-center overflow-hidden z-20 shadow-xl">
        <motion.div
          animate={{ x: [0, -400] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
          className={`whitespace-nowrap flex items-center gap-6 text-[10px] sm:text-xs font-black tracking-widest ${
            isSocial ? "text-[#EF4444]" : "text-[#FACC15]"
          }`}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full animate-ping ${isSocial ? "bg-red-500" : "bg-amber-400"}`} />
              <span>
                {isSocial
                  ? `STAGE 02 // DOPA-SOC // 全員野球部 // 気合い入れて打席に立て！！ //`
                  : `STAGE 01 // DOPA-ENG // 万能勇者 // 覚醒せよ英語の翼 //`}
              </span>
            </span>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-9 sm:h-11 bg-slate-950/95 backdrop-blur-md border-t-2 border-white flex items-center overflow-hidden z-20 shadow-xl">
        <motion.div
          animate={{ x: [-400, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
          className={`whitespace-nowrap flex items-center gap-6 text-[10px] sm:text-xs font-black tracking-widest ${
            isSocial ? "text-[#F97316]" : "text-[#38BDF8]"
          }`}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full animate-ping ${isSocial ? "bg-orange-500" : "bg-cyan-400"}`} />
              <span>
                {isSocial
                  ? `HOT-BLOODED BASEBALL // 1331問完全制覇 // 超時空満塁ホームラン //`
                  : `HIGH DOPAMINE ENGLISH // 英検4級 ＆ ターゲット1800 // MISSION START //`}
              </span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* 3. 画面を斜めに一刀両断する特大スラッシュバナー（ペルソナ5調） */}
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="absolute inset-x-0 h-80 sm:h-88 -skew-y-6 flex items-center justify-center z-10 overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.95)]"
        style={{
          background: isSocial
            ? "linear-gradient(135deg, rgba(239,68,68,0.95) 0%, rgba(26,11,15,0.95) 45%, rgba(11,13,18,0.98) 100%)"
            : "linear-gradient(135deg, rgba(250,204,21,0.95) 0%, rgba(19,23,32,0.95) 45%, rgba(11,13,18,0.98) 100%)",
          borderTop: "3px solid #FFFFFF",
          borderBottom: "3px solid #FFFFFF",
        }}
      >
        {/* バナー内を駆け抜ける光速グリントシャイン */}
        <span className="pointer-events-none absolute inset-0 w-36 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 animate-glint-sweep" />

        {/* 4. メイン演出コンテンツ（キャラクター ＆ 名乗り ＆ 特大タイポグラフィ） */}
        <div className="skew-y-6 w-full max-w-xl px-4 flex flex-col items-center justify-center text-center relative z-20">
          {/* 上段：ステージナンバー ＆ 教科コードネーム */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="flex items-center gap-2 mb-2"
          >
            <span className={`px-3 py-0.5 rounded-full font-black text-xs sm:text-sm tracking-wider shadow-[2px_2px_0_#000] -skew-x-12 ${
              isSocial ? "bg-red-500 text-white" : "bg-white text-slate-950"
            }`}>
              STAGE {stage.stageNumber}
            </span>
            <span className={`text-xs sm:text-sm font-black tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${
              isSocial ? "text-orange-400" : "text-amber-300"
            }`}>
              {stage.codeName} // {stage.roleBadge}
            </span>
          </motion.div>

          {/* 中段：キャラクターたち（英語: 男子高生 ＆ 女子高生 / 社会: 野球少年 ＆ 鬼コーチ） */}
          <div className="relative flex items-center justify-center my-1 w-full max-w-md h-36 sm:h-40">
            {/* キャラ背後の巨大な回転リング光背 */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className={`absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full border-2 border-dashed pointer-events-none ${
                isSocial ? "border-red-400/40" : "border-amber-400/40"
              }`}
            />
            <div
              className={`absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full blur-2xl pointer-events-none animate-pulse ${
                isSocial
                  ? "bg-gradient-to-tr from-red-600/40 to-orange-500/40"
                  : "bg-gradient-to-tr from-amber-400/35 to-cyan-400/35"
              }`}
            />

            {/* 👑 英語：男子高生 ＆ 女子高生のクロス登場！ */}
            {isEnglish && (
              <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-6 drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)]">
                {/* 男子高生（左からスライドイン） */}
                <motion.div
                  initial={{ x: -80, scale: 0.4, opacity: 0 }}
                  animate={{ x: 0, scale: 1.15, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 14 }}
                  className="flex flex-col items-center"
                >
                  <PixelCharacter
                    gender="boy"
                    stage={profile?.level ?? 1}
                    size={110}
                    mood="attack"
                    showAura={true}
                    animateFrames={true}
                  />
                  <span className="text-[10px] font-black bg-blue-600/80 text-white px-2 py-0.2 rounded-full -mt-2 border border-blue-400 shadow">
                    勇者（男子）
                  </span>
                </motion.div>

                {/* VS / ＆ アイコン */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                  transition={{ delay: 0.35, duration: 0.3 }}
                  className="w-8 h-8 rounded-full bg-amber-400 border-2 border-white text-slate-950 font-black text-xs flex items-center justify-center shadow-lg -mt-3"
                >
                  ⚡️
                </motion.div>

                {/* 女子高生（右からスライドイン） */}
                <motion.div
                  initial={{ x: 80, scale: 0.4, opacity: 0 }}
                  animate={{ x: 0, scale: 1.15, opacity: 1 }}
                  transition={{ delay: 0.22, type: "spring", stiffness: 260, damping: 14 }}
                  className="flex flex-col items-center"
                >
                  <PixelCharacter
                    gender="girl"
                    stage={profile?.level ?? 1}
                    size={110}
                    mood="attack"
                    showAura={true}
                    animateFrames={true}
                  />
                  <span className="text-[10px] font-black bg-pink-600/80 text-white px-2 py-0.2 rounded-full -mt-2 border border-pink-400 shadow">
                    勇者（女子）
                  </span>
                </motion.div>
              </div>
            )}

            {/* ⚾ 社会：野球少年 ＆ 鬼コーチの熱血出撃！ */}
            {isSocial && (
              <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-6 drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)]">
                {/* 鬼コーチ（左からドカンと登場） */}
                <motion.div
                  initial={{ x: -80, scale: 0.4, opacity: 0 }}
                  animate={{ x: 0, scale: 1.15, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 14 }}
                  className="flex flex-col items-center"
                >
                  <CoachCharacter pose="ready" size={105} animate={true} />
                  <span className="text-[10px] font-black bg-red-700 text-white px-2 py-0.2 rounded-full -mt-1 border border-red-400 shadow">
                    熱血鬼コーチ
                  </span>
                </motion.div>

                {/* 炎アイコン */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.4, 1] }}
                  transition={{ delay: 0.35, duration: 0.3 }}
                  className="w-8 h-8 rounded-full bg-red-500 border-2 border-white text-white font-black text-xs flex items-center justify-center shadow-lg -mt-3 animate-pulse"
                >
                  🔥
                </motion.div>

                {/* 野球少年（右から気迫の打席構え） */}
                <motion.div
                  initial={{ x: 80, scale: 0.4, opacity: 0 }}
                  animate={{ x: 0, scale: 1.2, opacity: 1 }}
                  transition={{ delay: 0.22, type: "spring", stiffness: 260, damping: 14 }}
                  className="flex flex-col items-center"
                >
                  <BaseballCharacter
                    gender="boy"
                    pose="stance"
                    size={110}
                    teamColor="#EF4444"
                    level={3}
                    batTier={2}
                    animate={true}
                    showAura={true}
                  />
                  <span className="text-[10px] font-black bg-orange-600 text-white px-2 py-0.2 rounded-full -mt-2 border border-orange-400 shadow">
                    熱血打線 4番
                  </span>
                </motion.div>
              </div>
            )}
          </div>

          {/* 下段：必殺技名 ＆ 名乗り */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.35 }}
            className="space-y-1 mt-1"
          >
            <div className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] flex items-center justify-center gap-2">
              <Flame className={`w-5 h-5 ${isSocial ? "text-red-500 fill-red-500" : "text-amber-400 fill-amber-400"} animate-bounce`} />
              <span>{stage.subject}編 覚醒出撃！</span>
              <Flame className={`w-5 h-5 ${isSocial ? "text-red-500 fill-red-500" : "text-amber-400 fill-amber-400"} animate-bounce`} />
            </div>

            <div className="inline-block px-3 py-1 rounded-xl bg-black/85 border border-white/40 backdrop-blur-sm shadow-md">
              <span className={`text-xs sm:text-sm font-black ${isSocial ? "text-red-400" : "text-amber-300"}`}>
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
            initial={{ scale: 2.4, opacity: 0 }}
            animate={{ scale: [2.4, 1, 1.05], opacity: 1 }}
            exit={{ scale: 3.2, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
          >
            <div
              className={`px-7 py-3 sm:px-12 sm:py-4 border-4 border-white font-black text-2xl sm:text-4xl tracking-widest uppercase -skew-x-12 shadow-[0_0_60px_rgba(0,0,0,0.9),6px_6px_0_#000000] ${
                isSocial
                  ? "bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 text-white shadow-red-500/80"
                  : "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 shadow-amber-400/80"
              }`}
            >
              {isSocial ? "PLAY BALL !!" : "MISSION START !!"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. ラスト：ホワイトアウト・ハイパースペース突入 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "warp" ? 1 : 0 }}
        transition={{ duration: 0.38, ease: "easeInOut" }}
        className="absolute inset-0 bg-white z-40 pointer-events-none flex items-center justify-center"
      >
        <div
          className={`w-full h-1 scale-x-100 animate-ping ${
            isSocial ? "bg-red-500" : "bg-amber-400"
          }`}
        />
      </motion.div>
    </div>
  );
};
