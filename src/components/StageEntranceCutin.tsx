"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Flame, Sparkles, Swords, Zap } from "lucide-react";
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
  const router = useRouter();
  const [phase, setPhase] = useState<"opening" | "engage" | "warp">("opening");
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const isEnglish = stage.id === "stage-english";
  const isSocial = stage.id === "stage-social";

  // 軽量化されたWebP背景画像URL
  const bgImage = isEnglish
    ? "/bg-cutin-english.webp"
    : isSocial
    ? "/bg-cutin-social.webp"
    : null;

  useEffect(() => {
    // 演出中に遷移先ページのチャンクを確実に先読み（遅延ゼロ遷移）
    if (stage.href) {
      try {
        router.prefetch(stage.href);
      } catch {}
    }

    // 確実なタイムライン実行 (計2.65秒の出撃ジングルと完全同期)
    // 0.0s〜: 背景 ＆ キャラクター即時登場（不発ゼロ保証）
    // 1.35s〜: クライマックスキメ (MISSION START / PLAY BALL 炸裂 ＆ 紙吹雪)
    const t1 = setTimeout(() => {
      setPhase("engage");
      try {
        confetti({
          particleCount: 75,
          spread: 90,
          origin: { y: 0.5 },
          colors: isSocial
            ? ["#EF4444", "#F97316", "#FACC15", "#FFFFFF"]
            : ["#FACC15", "#38BDF8", "#FFFFFF", "#EC4899"],
        });
      } catch {}
    }, 1350);

    // 2.40s〜: 突入直前の短い閃光フラッシュ（真っ白で長時間止まるのを防止）
    const t2 = setTimeout(() => {
      setPhase("warp");
    }, 2400);

    // 2.65s: 各ステージメニューへ遷移
    const t3 = setTimeout(() => {
      onCompleteRef.current();
    }, 2650);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isSocial]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black select-none flex items-center justify-center">
      {/* ========================================================================= */}
      {/* 1. 背景イラスト：全画面フルスクリーン表示                                     */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 overflow-hidden">
        {bgImage && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[2600ms] scale-105"
            style={{ backgroundImage: `url('${bgImage}')` }}
          >
            {/* イラストを活かす薄いコントラストグラデーション */}
            <div
              className={`absolute inset-0 ${
                isSocial
                  ? "bg-gradient-to-t from-black/85 via-black/20 to-black/70"
                  : "bg-gradient-to-t from-black/85 via-black/20 to-black/70"
              }`}
            />
          </div>
        )}

        {/* 放射状スピード集中線 */}
        <div
          className="absolute inset-0 opacity-30 mix-blend-screen pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at center, transparent 35%, rgba(255,255,255,0.4) 100%),
              repeating-conic-gradient(from 0deg, transparent 0deg 4deg, rgba(255,255,255,0.18) 4deg 8deg)`,
          }}
        />

        {/* 英語：桜吹雪パーティクル */}
        {isEnglish && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 24 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * 400 - 100,
                  y: -50,
                  rotate: Math.random() * 360,
                }}
                animate={{
                  x: `+=${Math.random() * 250 + 80}`,
                  y: 900,
                  rotate: `+=${Math.random() * 720}`,
                }}
                transition={{
                  duration: Math.random() * 1.8 + 1.6,
                  delay: Math.random() * 0.8,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
                className="absolute w-4 h-4 bg-gradient-to-br from-pink-200 via-rose-300 to-pink-400 rounded-full rounded-tr-none shadow-[0_0_10px_rgba(244,114,182,0.9)] opacity-90"
                style={{ left: `${(i * 4.5) % 100}%` }}
              />
            ))}
          </div>
        )}

        {/* 社会：燃え盛る火の粉パーティクル */}
        {isSocial && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 26 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: (i * 4) % 100 + "%",
                  y: 750,
                  scale: Math.random() * 0.8 + 0.5,
                }}
                animate={{
                  x: `+=${Math.random() * 100 - 50}px`,
                  y: -60,
                  scale: [0.6, 1.3, 0.2],
                }}
                transition={{
                  duration: Math.random() * 1.4 + 1.2,
                  delay: Math.random() * 0.5,
                  ease: "easeOut",
                  repeat: Infinity,
                }}
                className="absolute w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-red-600 via-orange-400 to-yellow-300 shadow-[0_0_14px_#F97316] opacity-90"
              />
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. 上下のサイバーアラートストライプ                                           */}
      {/* ========================================================================= */}
      <div className="absolute top-0 inset-x-0 h-10 sm:h-12 bg-black/85 backdrop-blur-md border-b-2 border-white flex items-center overflow-hidden z-20 shadow-2xl">
        <motion.div
          animate={{ x: [0, -450] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
          className={`whitespace-nowrap flex items-center gap-6 text-[11px] sm:text-xs font-black tracking-widest ${
            isSocial ? "text-[#EF4444]" : "text-[#FACC15]"
          }`}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full animate-ping ${isSocial ? "bg-red-500" : "bg-amber-400"}`} />
              <span>
                {isSocial
                  ? `STAGE 02 // DOPA-SOC // 全員野球部 // 気合い入れて打席に立て！！ //`
                  : `STAGE 01 // DOPA-ENG // 万能勇者 // 覚醒せよ英語の翼 //`}
              </span>
            </span>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-10 sm:h-12 bg-black/85 backdrop-blur-md border-t-2 border-white flex items-center overflow-hidden z-20 shadow-2xl">
        <motion.div
          animate={{ x: [-450, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
          className={`whitespace-nowrap flex items-center gap-6 text-[11px] sm:text-xs font-black tracking-widest ${
            isSocial ? "text-[#F97316]" : "text-[#38BDF8]"
          }`}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full animate-ping ${isSocial ? "bg-orange-500" : "bg-cyan-400"}`} />
              <span>
                {isSocial
                  ? `HOT-BLOODED BASEBALL // 1331問完全制覇 // 超時空満塁ホームラン //`
                  : `HIGH DOPAMINE ENGLISH // 英検4級 ＆ ターゲット1800 // MISSION START //`}
              </span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* 3. キャラクター ＆ 必殺技（確実に100%表示されるソリッドDOM構造）                */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full max-w-xl px-4 flex flex-col items-center justify-center text-center">
        {/* 上部バッジ：ステージ名 */}
        <div className="flex items-center gap-2 mb-2 animate-bounce">
          <span className={`px-3.5 py-1 rounded-full font-black text-xs sm:text-sm tracking-wider shadow-[3px_3px_0_#000] -skew-x-12 border-2 border-white ${
            isSocial ? "bg-red-600 text-white" : "bg-amber-400 text-slate-950"
          }`}>
            STAGE {stage.stageNumber}
          </span>
          <span className="text-sm sm:text-base font-black tracking-widest text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] uppercase">
            {stage.subject}編 // {stage.roleBadge}
          </span>
        </div>

        {/* 中央：ドット絵キャラクターのクロス登場（背景画像の上にクッキリ浮かび上がる） */}
        <div className="relative flex items-center justify-center my-2 w-full max-w-md h-36 sm:h-40">
          {/* 回転する光輪エフェクト */}
          <div
            className={`absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full border-2 border-dashed animate-spin pointer-events-none ${
              isSocial ? "border-red-400/50" : "border-amber-400/50"
            }`}
            style={{ animationDuration: "12s" }}
          />
          <div
            className={`absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full blur-2xl pointer-events-none animate-pulse ${
              isSocial
                ? "bg-gradient-to-tr from-red-600/40 to-orange-500/40"
                : "bg-gradient-to-tr from-amber-400/40 to-cyan-400/40"
            }`}
          />

          {/* 👑 英語：男子高生 ＆ 女子高生のクロス登場！ */}
          {isEnglish && (
            <div className="relative z-10 flex items-center justify-center gap-3 sm:gap-6 drop-shadow-[0_12px_24px_rgba(0,0,0,0.95)]">
              {/* 男子高生（左） */}
              <div className="flex flex-col items-center transform transition duration-500 scale-110">
                <div className="p-1.5 rounded-2xl bg-black/60 backdrop-blur-md border-2 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.8)]">
                  <PixelCharacter
                    gender="boy"
                    stage={profile?.level ?? 1}
                    size={96}
                    mood="attack"
                    showAura={true}
                    animateFrames={true}
                  />
                </div>
                <span className="text-[10px] font-black bg-blue-600 text-white px-2.5 py-0.5 rounded-full -mt-2 border border-white shadow-md">
                  英語勇者（男子）
                </span>
              </div>

              {/* 中央の電撃アイコン */}
              <div className="w-8 h-8 rounded-full bg-amber-400 border-2 border-white text-slate-950 font-black text-sm flex items-center justify-center shadow-[0_0_15px_#FACC15] -mt-3 shrink-0 animate-pulse">
                ⚡️
              </div>

              {/* 女子高生（右） */}
              <div className="flex flex-col items-center transform transition duration-500 scale-110">
                <div className="p-1.5 rounded-2xl bg-black/60 backdrop-blur-md border-2 border-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.8)]">
                  <PixelCharacter
                    gender="girl"
                    stage={profile?.level ?? 1}
                    size={96}
                    mood="attack"
                    showAura={true}
                    animateFrames={true}
                  />
                </div>
                <span className="text-[10px] font-black bg-pink-600 text-white px-2.5 py-0.5 rounded-full -mt-2 border border-white shadow-md">
                  英語勇者（女子）
                </span>
              </div>
            </div>
          )}

          {/* ⚾ 社会：野球少年 ＆ 鬼コーチの熱血出撃！ */}
          {isSocial && (
            <div className="relative z-10 flex items-center justify-center gap-3 sm:gap-6 drop-shadow-[0_12px_24px_rgba(0,0,0,0.95)]">
              {/* 鬼コーチ（左） */}
              <div className="flex flex-col items-center transform transition duration-500 scale-110">
                <div className="p-1.5 rounded-2xl bg-black/60 backdrop-blur-md border-2 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]">
                  <CoachCharacter pose="ready" size={96} animate={true} />
                </div>
                <span className="text-[10px] font-black bg-red-700 text-white px-2.5 py-0.5 rounded-full -mt-2 border border-white shadow-md">
                  熱血鬼コーチ
                </span>
              </div>

              {/* 中央の炎アイコン */}
              <div className="w-8 h-8 rounded-full bg-red-600 border-2 border-white text-white font-black text-sm flex items-center justify-center shadow-[0_0_18px_#EF4444] -mt-3 shrink-0 animate-pulse">
                🔥
              </div>

              {/* 野球少年（右） */}
              <div className="flex flex-col items-center transform transition duration-500 scale-110">
                <div className="p-1.5 rounded-2xl bg-black/60 backdrop-blur-md border-2 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.8)]">
                  <BaseballCharacter
                    gender="boy"
                    pose="stance"
                    size={96}
                    teamColor="#EF4444"
                    level={3}
                    batTier={2}
                    animate={true}
                    showAura={true}
                  />
                </div>
                <span className="text-[10px] font-black bg-orange-600 text-white px-2.5 py-0.5 rounded-full -mt-2 border border-white shadow-md">
                  熱血打線 4番
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 必殺技コールバナー */}
        <div className="space-y-1.5 mt-2">
          <div className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] flex items-center justify-center gap-2">
            <Flame className={`w-5 h-5 ${isSocial ? "text-red-500 fill-red-500" : "text-amber-400 fill-amber-400"} animate-bounce`} />
            <span>{stage.subject}編 覚醒出撃！</span>
            <Flame className={`w-5 h-5 ${isSocial ? "text-red-500 fill-red-500" : "text-amber-400 fill-amber-400"} animate-bounce`} />
          </div>

          <div className="inline-block px-4 py-1.5 rounded-2xl bg-black/85 border-2 border-white/60 backdrop-blur-md shadow-2xl">
            <span className={`text-xs sm:text-sm font-black ${isSocial ? "text-red-400" : "text-amber-300"}`}>
              {stage.specialMove.split(" ")[0]}
            </span>
            <span className="text-[11px] font-bold text-slate-200 ml-2 hidden sm:inline">
              {stage.specialMove.split(" ").slice(1).join(" ")}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. クライマックス：MISSION START / PLAY BALL 炸裂エンブレム                   */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {phase === "engage" && (
          <motion.div
            initial={{ scale: 2.5, opacity: 0 }}
            animate={{ scale: [2.5, 1, 1.05], opacity: 1 }}
            exit={{ scale: 3.2, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none px-4"
          >
            <div
              className={`px-8 py-3.5 sm:px-14 sm:py-5 border-4 border-white font-black text-3xl sm:text-5xl tracking-widest uppercase -skew-x-12 shadow-[0_0_80px_rgba(0,0,0,0.95),8px_8px_0_#000000] ${
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

      {/* ========================================================================= */}
      {/* 5. ラスト：ホワイトアウト・ハイパースペース突入                                */}
      {/* ========================================================================= */}
      <div
        className={`absolute inset-0 bg-white z-40 pointer-events-none flex items-center justify-center transition-opacity duration-400 ${
          phase === "warp" ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className={`w-full h-1.5 scale-x-100 animate-ping ${
            isSocial ? "bg-red-500" : "bg-amber-400"
          }`}
        />
      </div>
    </div>
  );
};
