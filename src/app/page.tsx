"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Zap,
  ArrowRight,
  GraduationCap,
  ChevronRight,
  Flame,
  X,
  Heart,
  Lock,
} from "lucide-react";
import { PlayerProfile } from "@/lib/types";
import { PixelCharacter } from "@/components/PixelCharacter";
import { BaseballCharacter } from "@/components/BaseballCharacter";
import { soundEngine } from "@/lib/soundEngine";

const STORAGE_KEY = "dopaben_player_profile_v1";

interface StageInfo {
  id: string;
  stageNumber: string;
  subject: string;
  codeName: string;
  tagline: string;
  status: "playable" | "coming_soon";
  href?: string;
  side: "left" | "right";
  colors: {
    accent: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    btnBg: string;
    btnText: string;
    lightBg: string;
  };
  characterType: "hero" | "baseball" | "math" | "science" | "japanese";
  detailLore: string;
  specialMove: string;
}

const STAGES: StageInfo[] = [
  {
    id: "stage-english",
    stageNumber: "01",
    subject: "英語",
    codeName: "DopaEng",
    tagline: "英検4級・ターゲット1800",
    status: "playable",
    href: "/english",
    side: "left",
    colors: {
      accent: "#EAB308",
      border: "#CA8A04",
      badgeBg: "bg-emerald-100",
      badgeText: "text-emerald-700",
      btnBg: "bg-[#FACC15] hover:bg-[#EAB308]",
      btnText: "text-slate-950",
      lightBg: "bg-amber-50/50",
    },
    characterType: "hero",
    detailLore: "学園の万能勇者！四択英単語バトルでLXPを獲得し、五角形ステータスを覚醒させろ！",
    specialMove: "【英単語エクスカリバー】 覚醒した語彙の光刃で敵を一刀両断する！",
  },
  {
    id: "stage-social",
    stageNumber: "02",
    subject: "社会",
    codeName: "DopaSoc",
    tagline: "熱闘！歴史・地理・公民",
    status: "playable",
    href: "/social",
    side: "right",
    colors: {
      accent: "#EF4444",
      border: "#DC2626",
      badgeBg: "bg-emerald-100",
      badgeText: "text-emerald-700",
      btnBg: "bg-[#EF4444] hover:bg-[#DC2626]",
      btnText: "text-white",
      lightBg: "bg-red-50/50",
    },
    characterType: "baseball",
    detailLore: "全員野球部！一問一答で打席に立ち、ホームランを連発して敵を打ち砕け！",
    specialMove: "【超時空満塁ホームラン】 歴史のうねりを打球に乗せて場外へ叩き込む！",
  },
  {
    id: "stage-math",
    stageNumber: "03",
    subject: "数学",
    codeName: "DopaMath",
    tagline: "電脳暗算パズル",
    status: "coming_soon",
    side: "left",
    colors: {
      accent: "#0284C7",
      border: "#0369A1",
      badgeBg: "bg-sky-100",
      badgeText: "text-sky-700",
      btnBg: "bg-slate-100 hover:bg-slate-200",
      btnText: "text-slate-700",
      lightBg: "bg-sky-50/50",
    },
    characterType: "math",
    detailLore: "電脳パズル部！数式コンボと幾何結界で戦うスピード計算バトル。",
    specialMove: "【虚数結界インフィニティ】 敵の行動時間をゼロ除算して完全拘束する！",
  },
  {
    id: "stage-science",
    stageNumber: "04",
    subject: "理科",
    codeName: "DopaSci",
    tagline: "元素調合サイエンス",
    status: "coming_soon",
    side: "right",
    colors: {
      accent: "#059669",
      border: "#047857",
      badgeBg: "bg-emerald-100",
      badgeText: "text-emerald-700",
      btnBg: "bg-slate-100 hover:bg-slate-200",
      btnText: "text-slate-700",
      lightBg: "bg-emerald-50/50",
    },
    characterType: "science",
    detailLore: "錬金実験部！元素フラスコを調合してモンスターにぶつける実験バトル。",
    specialMove: "【超新星ケミカルリアクション】 全元素を臨界調合して大爆発を巻き起こす！",
  },
  {
    id: "stage-japanese",
    stageNumber: "05",
    subject: "国語",
    codeName: "DopaJap",
    tagline: "言霊四字熟語一閃",
    status: "coming_soon",
    side: "left",
    colors: {
      accent: "#E11D48",
      border: "#BE185D",
      badgeBg: "bg-rose-100",
      badgeText: "text-rose-700",
      btnBg: "bg-slate-100 hover:bg-slate-200",
      btnText: "text-slate-700",
      lightBg: "bg-rose-50/50",
    },
    characterType: "japanese",
    detailLore: "言霊文芸部！筆を構えて四字熟語チェインを紡ぎ、言霊抜刀術で切り裂け！",
    specialMove: "【百人一首・言霊千本桜】 紡いだ言葉の桜吹雪で華麗な連続撃を放つ！",
  },
];

export default function DopaBenPortalPage() {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [selectedStageModal, setSelectedStageModal] = useState<StageInfo | null>(null);
  const [showBossModal, setShowBossModal] = useState<boolean>(false);
  const [cheerCount, setCheerCount] = useState<number>(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setProfile(JSON.parse(raw));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleCheer = () => {
    soundEngine.playEvolutionFanfare();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
    });
    setCheerCount((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFBFD] text-slate-900 flex flex-col items-center justify-start p-3 sm:p-6 select-none relative overflow-x-hidden">
      {/* 背景の軽やかな浮遊デコレーション（sunbousai.jp 風・白背景用） */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <motion.div
          animate={{ y: [0, -18, 0], x: [0, 10, 0], rotate: [0, 12, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-16 left-6 text-2xl text-amber-300 opacity-60"
        >
          ✦
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], x: [0, -12, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-36 right-8 text-2xl text-red-300 opacity-50"
        >
          ⚾
        </motion.div>
        <motion.div
          animate={{ y: [0, -16, 0], x: [0, 12, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-40 left-10 text-2xl text-sky-300 opacity-50"
        >
          📐
        </motion.div>
        <motion.div
          animate={{ y: [0, 18, 0], x: [0, -10, 0] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute bottom-56 right-10 text-2xl text-emerald-300 opacity-50"
        >
          🧪
        </motion.div>
        <motion.div
          animate={{ y: [0, -22, 0], rotate: [0, 360] }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 text-3xl text-pink-300 opacity-40"
        >
          ★
        </motion.div>
      </div>

      <div className="w-full max-w-xl z-10 space-y-4">
        {/* ========================================================================= */}
        {/* 1. 中央ヒーローロゴ（白背景画像・シンプル配置）                                */}
        {/* ========================================================================= */}
        <header className="flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring", damping: 14 }}
            className="w-full max-w-md flex justify-center py-2"
          >
            <img
              src="/dopaben-hero.jpg"
              alt="ドパベン"
              className="w-full h-auto object-contain select-none"
            />
          </motion.div>

          {/* プレイヤー総合ステータスバー */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-3 w-full bg-white border-2 border-slate-900 p-2.5 rounded-2xl shadow-[3px_3px_0px_#0F172A] flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
                <GraduationCap className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-left">
                <div className="text-[9px] text-slate-500 font-bold">学園生</div>
                <div className="text-xs font-black text-slate-900">
                  {profile ? `${profile.name} (Lv.${profile.level})` : "生徒"}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[9px] text-slate-500 font-bold">ストックLXP</div>
              <div className="text-xs font-black text-amber-600 flex items-center justify-end gap-1">
                <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{(profile?.exp ?? 0).toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        </header>

        {/* ========================================================================= */}
        {/* 2. ステージ選択（左右からスライドインするカード群）                          */}
        {/* ========================================================================= */}
        <div className="space-y-3">
          {STAGES.map((stage, idx) => {
            const isLeft = stage.side === "left";
            const isPlayable = stage.status === "playable";

            return (
              <motion.div
                key={stage.id}
                initial={{
                  x: isLeft ? -70 : 70,
                  opacity: 0,
                  scale: 0.96,
                }}
                animate={{
                  x: 0,
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.1 + idx * 0.08,
                  type: "spring",
                  stiffness: 100,
                  damping: 14,
                }}
                whileHover={{ scale: 1.01 }}
              >
                {isPlayable ? (
                  <Link
                    href={stage.href || "#"}
                    onClick={() => soundEngine.playTap()}
                    className="group block relative bg-white border-2 border-slate-900 hover:border-slate-950 p-3 rounded-2xl shadow-[4px_4px_0px_#0F172A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#0F172A] transition overflow-hidden"
                  >
                    <div className="flex items-center gap-3.5">
                      {/* キャラクターアバター */}
                      <div className="w-16 h-16 rounded-xl bg-slate-50 border-2 border-slate-900 p-0.5 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition overflow-hidden">
                        {stage.id === "stage-english" && (
                          <PixelCharacter
                            gender={profile?.gender ?? "boy"}
                            stage={profile?.level ?? 1}
                            size={60}
                            mood="idle"
                            showAura={false}
                            animateFrames={true}
                          />
                        )}
                        {stage.id === "stage-social" && (
                          <BaseballCharacter
                            gender="boy"
                            pose="stance"
                            size={62}
                            teamColor="#EF4444"
                            level={3}
                            batTier={2}
                            animate={true}
                            showAura={false}
                          />
                        )}
                      </div>

                      {/* 教科タイトルと概要 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[10px] font-mono font-black text-slate-400">
                            {stage.codeName}
                          </span>
                          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-700 border border-emerald-300">
                            PLAY
                          </span>
                        </div>
                        <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                          {stage.subject}
                        </h2>
                        <p className="text-[11px] text-slate-500 font-bold truncate">
                          {stage.tagline}
                        </p>
                      </div>

                      {/* 出撃ボタン */}
                      <div className="shrink-0">
                        <div
                          className={`px-3.5 py-1.5 rounded-xl border-2 border-slate-900 ${stage.colors.btnBg} ${stage.colors.btnText} font-black text-xs flex items-center gap-1 shadow-[2px_2px_0px_#0F172A] group-hover:scale-105 transition`}
                        >
                          <span>あそぶ</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div
                    onClick={() => {
                      soundEngine.playTap();
                      setSelectedStageModal(stage);
                    }}
                    className="cursor-pointer block relative bg-white/90 hover:bg-white border-2 border-slate-300 hover:border-slate-900 p-3 rounded-2xl shadow-[3px_3px_0px_#CBD5E1] hover:shadow-[3px_3px_0px_#0F172A] active:translate-x-[2px] active:translate-y-[2px] transition overflow-hidden group"
                  >
                    <div className="flex items-center gap-3.5">
                      {/* キャラクターアバター (準備中) */}
                      <div className="w-16 h-16 rounded-xl bg-slate-50 border-2 border-slate-300 group-hover:border-slate-900 p-0.5 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition overflow-hidden opacity-90">
                        {stage.id === "stage-math" && (
                          <PixelCharacter
                            gender="boy"
                            stage={3}
                            size={60}
                            mood="idle"
                            showAura={false}
                            animateFrames={true}
                            loadout={{
                              hairId: "bh_02",
                              uniformId: "uni_02",
                              auraLevel: 3,
                              forcedBranch: "speed",
                            }}
                          />
                        )}
                        {stage.id === "stage-science" && (
                          <PixelCharacter
                            gender="girl"
                            stage={3}
                            size={60}
                            mood="idle"
                            showAura={false}
                            animateFrames={true}
                            loadout={{
                              hairId: "gh_08",
                              uniformId: "uni_08",
                              auraLevel: 3,
                              forcedBranch: "vocab",
                            }}
                          />
                        )}
                        {stage.id === "stage-japanese" && (
                          <PixelCharacter
                            gender="boy"
                            stage={3}
                            size={60}
                            mood="idle"
                            showAura={false}
                            animateFrames={true}
                            loadout={{
                              hairId: "bh_04",
                              uniformId: "uni_03",
                              auraLevel: 3,
                              forcedBranch: "guts",
                            }}
                          />
                        )}
                      </div>

                      {/* 教科タイトルと概要 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[10px] font-mono font-black text-slate-400">
                            {stage.codeName}
                          </span>
                          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-slate-100 text-slate-500 border border-slate-200 flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5" />
                            準備中
                          </span>
                        </div>
                        <h2 className="text-base sm:text-lg font-black text-slate-700 group-hover:text-slate-900 tracking-tight leading-tight">
                          {stage.subject}
                        </h2>
                        <p className="text-[11px] text-slate-400 font-medium truncate">
                          {stage.tagline}
                        </p>
                      </div>

                      {/* 詳細ボタン */}
                      <div className="shrink-0">
                        <div className="px-3 py-1.5 rounded-xl border border-slate-300 group-hover:border-slate-900 bg-slate-100 group-hover:bg-slate-200 text-slate-600 group-hover:text-slate-900 font-bold text-xs flex items-center gap-0.5 transition">
                          <span>詳細</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* 3. 学園大ボス討伐戦バナー                                                    */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.55 }}
          onClick={() => {
            soundEngine.playTap();
            setShowBossModal(true);
          }}
          className="cursor-pointer w-full bg-gradient-to-r from-red-50 via-amber-50 to-pink-50 border-2 border-slate-900 p-3.5 rounded-2xl shadow-[4px_4px_0px_#0F172A] hover:shadow-[5px_5px_0px_#0F172A] active:translate-x-[2px] active:translate-y-[2px] transition group"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-red-500 border-2 border-slate-900 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#0F172A]">
              <Flame className="w-6 h-6 text-white animate-bounce" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-slate-900">
                  学園大ボス討伐戦
                </span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-red-100 text-red-600 border border-red-300">
                  FINAL RAID
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium truncate mt-0.5">
                全5教科の仲間を集結させて大ボスを討伐せよ！
              </p>
            </div>

            <div className="shrink-0">
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* 4. モーダル：準備中ステージ詳細プレビュー (白背景ポップスタイル)                 */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedStageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              className="relative w-full max-w-sm bg-white border-3 border-slate-900 rounded-3xl p-5 shadow-[6px_6px_0px_#0F172A] overflow-hidden text-slate-900"
            >
              {/* 閉じるボタン */}
              <button
                onClick={() => {
                  soundEngine.playTap();
                  setSelectedStageModal(null);
                }}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>

              {/* ヘッダー情報 */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border-2 border-slate-900 p-0.5 flex items-center justify-center shrink-0">
                  {selectedStageModal.id === "stage-math" && (
                    <PixelCharacter
                      gender="boy"
                      stage={3}
                      size={52}
                      mood="idle"
                      showAura={false}
                      animateFrames={true}
                      loadout={{
                        hairId: "bh_02",
                        uniformId: "uni_02",
                        auraLevel: 3,
                        forcedBranch: "speed",
                      }}
                    />
                  )}
                  {selectedStageModal.id === "stage-science" && (
                    <PixelCharacter
                      gender="girl"
                      stage={3}
                      size={52}
                      mood="idle"
                      showAura={false}
                      animateFrames={true}
                      loadout={{
                        hairId: "gh_08",
                        uniformId: "uni_08",
                        auraLevel: 3,
                        forcedBranch: "vocab",
                      }}
                    />
                  )}
                  {selectedStageModal.id === "stage-japanese" && (
                    <PixelCharacter
                      gender="boy"
                      stage={3}
                      size={52}
                      mood="idle"
                      showAura={false}
                      animateFrames={true}
                      loadout={{
                        hairId: "bh_04",
                        uniformId: "uni_03",
                        auraLevel: 3,
                        forcedBranch: "guts",
                      }}
                    />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {selectedStageModal.codeName}
                    </span>
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                      開発準備中
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900">
                    {selectedStageModal.subject}
                  </h3>
                </div>
              </div>

              {/* 詳細ボックス */}
              <div className="mt-3.5 space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-500">ゲーム概要</div>
                  <div className="text-xs text-slate-800 font-medium mt-0.5">
                    {selectedStageModal.detailLore}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="text-[10px] font-black text-amber-700">必殺技</div>
                  <div className="text-xs text-amber-900 font-bold mt-0.5">
                    {selectedStageModal.specialMove}
                  </div>
                </div>
              </div>

              {/* 開発応援ボタン */}
              <div className="mt-4">
                <button
                  onClick={handleCheer}
                  className="w-full py-2.5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-slate-950 font-black text-xs border-2 border-slate-900 shadow-[3px_3px_0px_#0F172A] active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center gap-1.5 transition"
                >
                  <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  <span>開発を応援する！ ({cheerCount})</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 5. モーダル：学園大ボス討伐戦プレビュー                                       */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showBossModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              className="relative w-full max-w-sm bg-white border-3 border-slate-900 rounded-3xl p-5 shadow-[6px_6px_0px_#0F172A] overflow-hidden text-slate-900 text-center"
            >
              <button
                onClick={() => {
                  soundEngine.playTap();
                  setShowBossModal(false);
                }}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 border border-red-300 text-red-600 text-[10px] font-black mb-2">
                <Flame className="w-3.5 h-3.5" />
                <span>大型レイドバトル構想</span>
              </div>

              <h3 className="text-lg font-black text-slate-900">
                学園大ボス討伐戦
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                英語・社会・数学・理科・国語の全キャラクターを結集！五角形ステータスを持ち寄り、超合体攻撃を叩き込め！
              </p>

              {/* 5英雄の編成アイコン */}
              <div className="mt-3.5 grid grid-cols-5 gap-1 text-center">
                <div className="p-1.5 rounded-xl bg-amber-50 border border-amber-300">
                  <div className="text-base">⚔️</div>
                  <div className="text-[9px] font-black text-amber-700">英語</div>
                </div>
                <div className="p-1.5 rounded-xl bg-red-50 border border-red-300">
                  <div className="text-base">⚾</div>
                  <div className="text-[9px] font-black text-red-700">社会</div>
                </div>
                <div className="p-1.5 rounded-xl bg-sky-50 border border-sky-300">
                  <div className="text-base">📐</div>
                  <div className="text-[9px] font-black text-sky-700">数学</div>
                </div>
                <div className="p-1.5 rounded-xl bg-emerald-50 border border-emerald-300">
                  <div className="text-base">🧪</div>
                  <div className="text-[9px] font-black text-emerald-700">理科</div>
                </div>
                <div className="p-1.5 rounded-xl bg-rose-50 border border-rose-300">
                  <div className="text-base">📜</div>
                  <div className="text-[9px] font-black text-rose-700">国語</div>
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => {
                    handleCheer();
                    setShowBossModal(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-black text-xs border-2 border-slate-900 shadow-[3px_3px_0px_#0F172A] active:translate-x-[1px] active:translate-y-[1px] transition"
                >
                  期待して待つ！
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
