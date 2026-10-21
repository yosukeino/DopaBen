"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Zap,
  Trophy,
  BookOpen,
  Sword,
  Shield,
  Play,
  Lock,
  ChevronRight,
  Flame,
  ArrowRight,
  GraduationCap,
  Volume2,
  VolumeX,
  Compass,
  Star,
  Info,
  X,
  Heart,
  Crown,
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
  title: string;
  club: string;
  heroRole: string;
  status: "playable" | "coming_soon";
  href?: string;
  side: "left" | "right";
  colors: {
    primary: string;
    secondary: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    glow: string;
    bgGradient: string;
    shadow: string;
  };
  questCount: string;
  description: string;
  battleStyle: string;
  specialMove: string;
  lore: string;
}

const STAGES: StageInfo[] = [
  {
    id: "stage-english",
    stageNumber: "STAGE 01",
    subject: "英語",
    codeName: "DopaEng",
    title: "万能勇者の英単語",
    club: "学園生徒会・勇者部",
    heroRole: "学園の万能勇者 (大ボス戦リーダー)",
    status: "playable",
    href: "/english",
    side: "left",
    colors: {
      primary: "#FACC15",
      secondary: "#10B981",
      border: "#FACC15",
      badgeBg: "bg-[#10B981]/20",
      badgeText: "text-[#10B981]",
      glow: "rgba(250, 204, 21, 0.25)",
      bgGradient: "from-[#1E293B] via-[#0F172A] to-[#0B0D12]",
      shadow: "shadow-p5-yellow",
    },
    questCount: "英検4級・ターゲット1800・英検1級",
    description: "四択英単語バトルでLXPを獲得し、五角形ステータスを覚醒させろ！",
    battleStyle: "聖ペンカリバー・単語スラッシュ",
    specialMove: "【英単語エクスカリバー】 覚醒した語彙の光刃で敵を一刀両断する！",
    lore: "学園の平和を守る生徒会直属の勇者部。ドラクエの勇者のようにあらゆる状況に対応できる万能キャラクター。全教科の仲間を率いて大ボスに立ち向かう運命を背負う。",
  },
  {
    id: "stage-social",
    stageNumber: "STAGE 02",
    subject: "社会",
    codeName: "DopaSoc",
    title: "熱闘！社会科ベースボール",
    club: "学園野球部",
    heroRole: "強打のスラッガー (物理強撃特化)",
    status: "playable",
    href: "/social",
    side: "right",
    colors: {
      primary: "#EF4444",
      secondary: "#F97316",
      border: "#EF4444",
      badgeBg: "bg-[#EF4444]/20",
      badgeText: "text-[#EF4444]",
      glow: "rgba(239, 68, 68, 0.25)",
      bgGradient: "from-[#1E293B] via-[#1A121E] to-[#0B0D12]",
      shadow: "shadow-p5-red",
    },
    questCount: "中学社会(歴史・地理・公民) 全1,331問",
    description: "一問一答でスタジアム熱狂！バット・グローブを着せ替えてホームランを狙え！",
    battleStyle: "フルスイング歴史弾・公民レーザービーム",
    specialMove: "【超時空満塁ホームラン】 歴史のうねりを打球に乗せて場外へ叩き込む！",
    lore: "全員野球部員！甲子園と大ボス討伐を同時に目指す熱血集団。歴史・地理・公民の知識を筋力とスイングスピードに変換して超強力な打撃を放つ。",
  },
  {
    id: "stage-math",
    stageNumber: "STAGE 03",
    subject: "数学",
    codeName: "DopaMath",
    title: "電脳パズルと幾何学迷宮",
    club: "電脳パズル部",
    heroRole: "電脳の計算魔導士 (魔法・解析特化)",
    status: "coming_soon",
    side: "left",
    colors: {
      primary: "#06B6D4",
      secondary: "#8B5CF6",
      border: "#06B6D4",
      badgeBg: "bg-[#06B6D4]/20",
      badgeText: "text-[#06B6D4]",
      glow: "rgba(6, 182, 212, 0.25)",
      bgGradient: "from-[#102A38] via-[#0E1A29] to-[#0B0D12]",
      shadow: "shadow-[0_6px_0_#0891B2]",
    },
    questCount: "計算・一次方程式・幾何・確率パズル",
    description: "スピード暗算パズルバトル！数式コンボを繋げて幾何結界を展開せよ！",
    battleStyle: "素数ブレイク・フラクタルブラスト",
    specialMove: "【虚数結界インフィニティ】 敵の行動時間をゼロ除算して完全拘束する！",
    lore: "学園の電脳棟に籠もる頭脳明晰なパズル集団。戦場を格子座標として捉え、最短の計算式で敵の弱点を割り出して魔導バーストを叩き込む。",
  },
  {
    id: "stage-science",
    stageNumber: "STAGE 04",
    subject: "理科",
    codeName: "DopaSci",
    title: "錬金実験室と元素の試練",
    club: "錬金実験部",
    heroRole: "天才フラスコ調合師 (支援・状態異常特化)",
    status: "coming_soon",
    side: "right",
    colors: {
      primary: "#10B981",
      secondary: "#14B8A6",
      border: "#10B981",
      badgeBg: "bg-[#10B981]/20",
      badgeText: "text-[#10B981]",
      glow: "rgba(16, 185, 129, 0.25)",
      bgGradient: "from-[#0F291E] via-[#0A1F17] to-[#0B0D12]",
      shadow: "shadow-[0_6px_0_#059669]",
    },
    questCount: "物理・化学・生物・地学の実験クイズ",
    description: "フラスコと元素記号を調合してモンスターにぶつけろ！実験型サイエンスバトル。",
    battleStyle: "元素バースト・アシッドポーション投擲",
    specialMove: "【超新星ケミカルリアクション】 全元素を臨界調合して大爆発を巻き起こす！",
    lore: "理科準備室を改造した秘密工房で日夜実験を続けるアルケミスト部。化学反応や物理法則を自在に応用し、味方の支援や敵の弱体化を一手に担う。",
  },
  {
    id: "stage-japanese",
    stageNumber: "STAGE 05",
    subject: "国語",
    codeName: "DopaJap",
    title: "言霊文芸と四字熟語一閃",
    club: "言霊文芸部",
    heroRole: "言霊サムライ (精神力・連続撃特化)",
    status: "coming_soon",
    side: "left",
    colors: {
      primary: "#EC4899",
      secondary: "#E11D48",
      border: "#EC4899",
      badgeBg: "bg-[#EC4899]/20",
      badgeText: "text-[#EC4899]",
      glow: "rgba(236, 72, 153, 0.25)",
      bgGradient: "from-[#2A0F1E] via-[#1D0C17] to-[#0B0D12]",
      shadow: "shadow-[0_6px_0_#BE185D]",
    },
    questCount: "四字熟語・古文単語・現代文読解",
    description: "筆を構えて言霊を紡げ！四字熟語チェインと漢字抜刀術で敵を討ち払え！",
    battleStyle: "言霊抜刀術・万葉奥義「春暁」",
    specialMove: "【百人一首・言霊千本桜】 紡いだ美しき言葉の桜吹雪で連続撃を放つ！",
    lore: "伝統的な詰襟学ランや和風制服を纏う孤高の文芸サムライ。言霊の力を宿した萬年筆の刃で、敵の悪気や迷いを鮮やかに切り裂く。",
  },
];

export default function DopaBenPortalPage() {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [filter, setFilter] = useState<"all" | "playable" | "coming_soon">("all");
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

  const filteredStages = STAGES.filter((stage) => {
    if (filter === "playable") return stage.status === "playable";
    if (filter === "coming_soon") return stage.status === "coming_soon";
    return true;
  });

  return (
    <div className="min-h-screen w-full bg-[#0B0D12] bg-halftone text-white flex flex-col items-center justify-start p-3 sm:p-6 select-none relative overflow-x-hidden">
      {/* 背景の浮遊パーティクル装飾（sunbousai.jp 風） */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <motion.div
          animate={{ y: [0, -25, 0], x: [0, 15, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-12 left-6 text-2xl text-[#FACC15]/25"
        >
          ✦
        </motion.div>
        <motion.div
          animate={{ y: [0, 30, 0], x: [0, -20, 0], rotate: [0, -20, 0] }}
          transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-44 right-8 text-3xl text-[#EF4444]/25"
        >
          ⚾
        </motion.div>
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, 20, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-32 left-10 text-2xl text-[#06B6D4]/25"
        >
          📐
        </motion.div>
        <motion.div
          animate={{ y: [0, 25, 0], x: [0, -15, 0] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute bottom-48 right-12 text-2xl text-[#10B981]/25"
        >
          🧪
        </motion.div>
        <motion.div
          animate={{ y: [0, -30, 0], rotate: [0, 360] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 text-4xl text-[#EC4899]/15"
        >
          ★
        </motion.div>
      </div>

      <div className="w-full max-w-5xl z-10 space-y-6">
        {/* ========================================================================= */}
        {/* 1. 中央ヒーローヘッダー (ドパベン公式白背景ロゴ ＋ スローガン)               */}
        {/* ========================================================================= */}
        <header className="relative flex flex-col items-center text-center">
          {/* 上部学園ポータルバッジ */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#131720] border border-[#FACC15] shadow-md mb-2.5"
          >
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[10px] font-black tracking-widest text-[#FACC15] uppercase">
              DopaBen Academy Portal // 全五大教科 集結編
            </span>
          </motion.div>

          {/* 白背景の賑やかなドパベンロゴ（メインフォーカス） */}
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.55, type: "spring", damping: 14 }}
            className="relative max-w-md w-full rounded-2xl border-3 border-white shadow-[0_12px_40px_rgba(0,0,0,0.9)] bg-white overflow-hidden p-2 group"
          >
            <img
              src="/dopaben-hero.jpg"
              alt="ドパベン - 新感覚学園学習バトルRPG"
              className="w-full h-auto object-contain rounded-xl select-none transition group-hover:scale-[1.02] duration-300"
            />
            {/* 角のコミックスタンプ風バッジ */}
            <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-[#EF4444] text-white font-black text-[9px] shadow-sm rotate-[-3deg] border border-white">
              STAGE SELECT
            </div>
          </motion.div>

          {/* スローガン・コンセプトキャッチ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-center max-w-lg"
          >
            <h1 className="text-sm sm:text-base font-black text-white tracking-wide">
              各教科のキャラクターを育成し、５人のちからで学園の大ボスを討伐せよ！
            </h1>
            <p className="text-[11px] text-[#94A3B8] font-medium mt-1">
              英語・社会が即時プレイ可能！数学・理科・国語も順次開講予定！
            </p>
          </motion.div>

          {/* プレイヤー総合ステータス（中央配置バー） */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mt-4 w-full max-w-md bg-[#131720]/90 backdrop-blur-sm border-2 border-white p-3 rounded-2xl shadow-p5-yellow flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#0B0D12] border border-[#FACC15] flex items-center justify-center shrink-0 shadow-inner">
                <GraduationCap className="w-5 h-5 text-[#FACC15]" />
              </div>
              <div className="text-left">
                <div className="text-[9px] text-[#94A3B8] font-bold">学園生ステータス</div>
                <div className="text-xs font-black text-white">
                  {profile ? `${profile.name} (Lv.${profile.level})` : "ドパベン学園 生徒"}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[9px] text-[#94A3B8] font-bold">総ストックLXP</div>
              <div className="text-xs font-black text-[#FACC15] flex items-center justify-end gap-1">
                <Zap className="w-3.5 h-3.5 fill-[#FACC15]" />
                <span>{(profile?.exp ?? 0).toLocaleString()} LXP</span>
              </div>
            </div>
          </motion.div>

          {/* フィルター切り替えタブ */}
          <div className="mt-4 flex items-center gap-1.5 p-1 rounded-xl bg-[#131720] border border-[#334155]">
            <button
              onClick={() => {
                soundEngine.playTap();
                setFilter("all");
              }}
              className={`px-3 py-1 rounded-lg text-xs font-black transition ${
                filter === "all"
                  ? "bg-[#FACC15] text-black shadow-sm"
                  : "text-[#94A3B8] hover:text-white"
              }`}
            >
              全5教科 (5)
            </button>
            <button
              onClick={() => {
                soundEngine.playTap();
                setFilter("playable");
              }}
              className={`px-3 py-1 rounded-lg text-xs font-black transition ${
                filter === "playable"
                  ? "bg-[#10B981] text-white shadow-sm"
                  : "text-[#94A3B8] hover:text-white"
              }`}
            >
              遊べる教科 (2)
            </button>
            <button
              onClick={() => {
                soundEngine.playTap();
                setFilter("coming_soon");
              }}
              className={`px-3 py-1 rounded-lg text-xs font-black transition ${
                filter === "coming_soon"
                  ? "bg-[#8B5CF6] text-white shadow-sm"
                  : "text-[#94A3B8] hover:text-white"
              }`}
            >
              準備中 (3)
            </button>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* 2. ステージ一覧（左右からのダイナミック出現アニメーション）                     */}
        {/* ========================================================================= */}
        <div className="space-y-4 max-w-2xl mx-auto">
          {filteredStages.map((stage, idx) => {
            const isLeft = stage.side === "left";
            const isPlayable = stage.status === "playable";

            return (
              <motion.div
                key={stage.id}
                initial={{
                  x: isLeft ? -90 : 90,
                  opacity: 0,
                  scale: 0.95,
                }}
                animate={{
                  x: 0,
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.15 + idx * 0.1,
                  type: "spring",
                  stiffness: 90,
                  damping: 14,
                }}
                whileHover={{ scale: 1.015 }}
                className="relative"
              >
                {/* 左右どちらから現れたかを示す方向リボンバッジ */}
                <div
                  className={`absolute -top-2.5 ${
                    isLeft ? "left-4" : "right-4"
                  } z-20 px-2 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider flex items-center gap-1 shadow-md bg-[#0B0D12]`}
                  style={{
                    borderColor: stage.colors.border,
                    color: stage.colors.primary,
                  }}
                >
                  <span>{isLeft ? "◀ LEFT ENTRANCE" : "RIGHT ENTRANCE ▶"}</span>
                  <span className="font-mono">[{stage.stageNumber}]</span>
                </div>

                {/* カード本体 (PlayableはLink、Coming Soonはモーダル発火ボタン) */}
                {isPlayable ? (
                  <Link
                    href={stage.href || "#"}
                    onClick={() => soundEngine.playTap()}
                    className={`group block relative bg-gradient-to-br ${stage.colors.bgGradient} border-3 border-white hover:border-[${stage.colors.border}] p-4 rounded-2xl shadow-xl active:scale-[0.99] transition overflow-hidden`}
                    style={{
                      boxShadow: `0 8px 24px ${stage.colors.glow}`,
                    }}
                  >
                    {/* 背景装飾 */}
                    <div
                      className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-2xl group-hover:scale-125 transition opacity-30"
                      style={{ backgroundColor: stage.colors.primary }}
                    />

                    <div className="relative z-10 flex items-start gap-4">
                      {/* キャラクター描画エリア */}
                      <div
                        className="w-20 h-20 sm:w-22 sm:h-22 rounded-xl bg-[#07090E] border-2 p-1 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition overflow-hidden"
                        style={{ borderColor: stage.colors.border }}
                      >
                        {stage.id === "stage-english" && (
                          <PixelCharacter
                            gender={profile?.gender ?? "boy"}
                            stage={profile?.level ?? 1}
                            size={72}
                            mood="idle"
                            showAura={false}
                            animateFrames={true}
                          />
                        )}
                        {stage.id === "stage-social" && (
                          <BaseballCharacter
                            gender="boy"
                            pose="stance"
                            size={74}
                            teamColor="#EF4444"
                            level={3}
                            batTier={2}
                            animate={true}
                            showAura={false}
                          />
                        )}
                      </div>

                      {/* ステージ詳細情報 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-black border ${stage.colors.badgeBg} ${stage.colors.badgeText}`}
                          >
                            稼働中 PLAYABLE
                          </span>
                          <span className="text-[10px] font-black text-white/80">
                            {stage.club}
                          </span>
                        </div>

                        <h2
                          className="text-base sm:text-lg font-black italic tracking-wide transition group-hover:translate-x-0.5"
                          style={{ color: "white" }}
                        >
                          <span style={{ color: stage.colors.primary }}>
                            {stage.codeName}
                          </span>{" "}
                          <span className="text-sm font-bold text-white/90">
                            {stage.title}
                          </span>
                        </h2>

                        <p className="text-[11px] text-[#94A3B8] line-clamp-1 mt-0.5">
                          {stage.questCount}
                        </p>
                        <p className="text-[11px] text-[#CBD5E1] line-clamp-1 mt-0.5 font-medium">
                          {stage.description}
                        </p>

                        <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/10">
                          <span
                            className="text-[10px] font-black flex items-center gap-1"
                            style={{ color: stage.colors.primary }}
                          >
                            <span>⚔️</span>
                            <span>{stage.heroRole}</span>
                          </span>
                          <span
                            className="px-3 py-1 rounded-xl font-black text-xs flex items-center gap-1 shadow-md transition group-hover:scale-105"
                            style={{
                              backgroundColor: stage.colors.primary,
                              color: "#000000",
                            }}
                          >
                            <span>出撃する</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
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
                    className={`group cursor-pointer block relative bg-gradient-to-br ${stage.colors.bgGradient} border-2 border-white/40 hover:border-white p-4 rounded-2xl shadow-lg active:scale-[0.99] transition overflow-hidden`}
                  >
                    <div className="relative z-10 flex items-start gap-4">
                      {/* キャラクター描画エリア (Coming Soonキャラクター) */}
                      <div
                        className="w-20 h-20 sm:w-22 sm:h-22 rounded-xl bg-[#07090E]/80 border-2 p-1 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition overflow-hidden"
                        style={{ borderColor: stage.colors.border }}
                      >
                        {stage.id === "stage-math" && (
                          <PixelCharacter
                            gender="boy"
                            stage={3}
                            size={72}
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
                            size={72}
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
                            size={72}
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

                      {/* ステージ詳細情報 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[9px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            開発中 COMING SOON
                          </span>
                          <span className="text-[10px] font-black text-white/60">
                            {stage.club}
                          </span>
                        </div>

                        <h2 className="text-base sm:text-lg font-black italic tracking-wide text-white/90">
                          <span style={{ color: stage.colors.primary }}>
                            {stage.codeName}
                          </span>{" "}
                          <span className="text-sm font-bold text-white/80">
                            {stage.title}
                          </span>
                        </h2>

                        <p className="text-[11px] text-[#94A3B8] line-clamp-1 mt-0.5">
                          {stage.questCount}
                        </p>
                        <p className="text-[11px] text-[#CBD5E1]/80 line-clamp-1 mt-0.5 font-medium">
                          {stage.description}
                        </p>

                        <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/10">
                          <span className="text-[10px] text-white/60 font-bold flex items-center gap-1">
                            <span>🔮</span>
                            <span>{stage.heroRole}</span>
                          </span>
                          <span className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-xs flex items-center gap-1 transition">
                            <Info className="w-3.5 h-3.5" />
                            <span>詳細を見る</span>
                          </span>
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
        {/* 3. クライマックス：学園大ボス討伐戦（全5教科の勇者集結）                    */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          onClick={() => {
            soundEngine.playTap();
            setShowBossModal(true);
          }}
          className="cursor-pointer max-w-2xl mx-auto relative rounded-3xl bg-gradient-to-r from-[#180A0A] via-[#2A0E1A] to-[#180A0A] border-3 border-[#EF4444] p-5 shadow-[0_10px_35px_rgba(239,68,68,0.35)] active:scale-[0.99] transition overflow-hidden group"
        >
          {/* ボス戦の背景エフェクト */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-600/20 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4">
            {/* ボスシルエット＆5教科オーブ */}
            <div className="w-20 h-20 rounded-2xl bg-[#0B0D12] border-2 border-[#EF4444] flex flex-col items-center justify-center shrink-0 shadow-inner relative">
              <Flame className="w-8 h-8 text-[#EF4444] animate-bounce" />
              <span className="text-[8px] font-black text-[#FACC15] uppercase">
                FINAL RAID
              </span>

              {/* 5色オーブ装飾 */}
              <div className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-[#FACC15] border border-white" />
              <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-[#EF4444] border border-white" />
              <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full bg-[#06B6D4] border border-white" />
              <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rounded-full bg-[#10B981] border border-white" />
              <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#EC4899] border border-white" />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-base sm:text-lg font-black text-white italic">
                  学園大ボス討伐戦 // RAID BATTLE
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-[#EF4444] text-white">
                  LAST STAGE
                </span>
              </div>

              <p className="text-xs text-[#CBD5E1] mt-1">
                英語 × 社会 × 数学 × 理科 × 国語 = 【五大学力バースト】
              </p>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">
                全教科で育てたキャラクターたちが全員参戦！合体技で大ボスを打ち破れ！
              </p>
            </div>

            <div className="shrink-0">
              <span className="px-3 py-1.5 rounded-xl bg-[#EF4444] group-hover:bg-[#F87171] text-white font-black text-xs flex items-center gap-1 shadow-md transition">
                <span>討伐計画を見る</span>
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* 4. モーダル：準備中ステージ詳細プレビュー (数学・理科・国語)                   */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedStageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-[#131720] border-3 border-white rounded-3xl p-5 shadow-2xl overflow-hidden text-white"
            >
              {/* 閉じるボタン */}
              <button
                onClick={() => {
                  soundEngine.playTap();
                  setSelectedStageModal(null);
                }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-5 h-5" />
              </button>

              {/* ヘッダー情報 */}
              <div className="flex items-center gap-3">
                <div
                  className="w-16 h-16 rounded-2xl bg-[#0B0D12] border-2 p-1 flex items-center justify-center shrink-0"
                  style={{ borderColor: selectedStageModal.colors.border }}
                >
                  {selectedStageModal.id === "stage-math" && (
                    <PixelCharacter
                      gender="boy"
                      stage={3}
                      size={58}
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
                      size={58}
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
                      size={58}
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
                    <span className="text-[10px] font-mono text-[#94A3B8]">
                      {selectedStageModal.stageNumber}
                    </span>
                    <span
                      className="text-xs font-black"
                      style={{ color: selectedStageModal.colors.primary }}
                    >
                      {selectedStageModal.club}
                    </span>
                  </div>
                  <h3 className="text-lg font-black italic">
                    {selectedStageModal.codeName}
                  </h3>
                  <p className="text-xs text-[#CBD5E1]">
                    {selectedStageModal.title}
                  </p>
                </div>
              </div>

              {/* 詳細情報ボックス */}
              <div className="mt-4 space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-[#0B0D12] border border-white/10 space-y-1">
                  <div className="text-[10px] font-black text-[#94A3B8] uppercase">
                    キャラクター設定・役割
                  </div>
                  <div className="font-bold text-white">
                    {selectedStageModal.heroRole}
                  </div>
                  <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                    {selectedStageModal.lore}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#0B0D12] border border-white/10 space-y-1">
                  <div className="text-[10px] font-black text-[#FACC15] uppercase">
                    必殺スキル // SPECIAL MOVE
                  </div>
                  <div className="font-bold text-white">
                    {selectedStageModal.specialMove}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0B0D12] border border-white/10 space-y-1">
                  <div className="text-[10px] font-black text-[#10B981] uppercase">
                    予定ゲームシステム
                  </div>
                  <div className="text-[11px] text-[#CBD5E1]">
                    {selectedStageModal.description}
                  </div>
                </div>
              </div>

              {/* 開発応援ボタン */}
              <div className="mt-5 flex items-center justify-between gap-3">
                <button
                  onClick={handleCheer}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#FACC15] to-[#F59E0B] text-black font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition"
                >
                  <Heart className="w-4 h-4 fill-black" />
                  <span>この教科の開発を応援する！ ({cheerCount})</span>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-gradient-to-b from-[#1C0E14] to-[#0E0609] border-3 border-[#EF4444] rounded-3xl p-5 shadow-[0_15px_50px_rgba(239,68,68,0.4)] overflow-hidden text-white"
            >
              <button
                onClick={() => {
                  soundEngine.playTap();
                  setShowBossModal(false);
                }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EF4444]/20 border border-[#EF4444] text-[#EF4444] text-[10px] font-black">
                  <Flame className="w-3.5 h-3.5" />
                  <span>FUTURE BIG RAID // 超大型アップデート構想</span>
                </div>
                <h3 className="text-xl font-black italic text-white">
                  学園大ボス討伐戦 〜五英雄の絆〜
                </h3>
                <p className="text-xs text-[#CBD5E1] max-w-sm mx-auto">
                  英語・社会・数学・理科・国語。育て上げたすべてのキャラクターを率いて、学園を混沌に陥れる巨悪に立ち向かえ！
                </p>
              </div>

              {/* 5英雄の編成スロット */}
              <div className="mt-4 grid grid-cols-5 gap-1.5 text-center">
                <div className="p-2 rounded-xl bg-[#0B0D12] border border-[#FACC15]">
                  <div className="text-lg">⚔️</div>
                  <div className="text-[9px] font-black text-[#FACC15]">英語</div>
                  <div className="text-[7px] text-[#94A3B8]">万能リーダー</div>
                </div>
                <div className="p-2 rounded-xl bg-[#0B0D12] border border-[#EF4444]">
                  <div className="text-lg">⚾</div>
                  <div className="text-[9px] font-black text-[#EF4444]">社会</div>
                  <div className="text-[7px] text-[#94A3B8]">物理スラッガー</div>
                </div>
                <div className="p-2 rounded-xl bg-[#0B0D12] border border-[#06B6D4]">
                  <div className="text-lg">📐</div>
                  <div className="text-[9px] font-black text-[#06B6D4]">数学</div>
                  <div className="text-[7px] text-[#94A3B8]">電脳魔導士</div>
                </div>
                <div className="p-2 rounded-xl bg-[#0B0D12] border border-[#10B981]">
                  <div className="text-lg">🧪</div>
                  <div className="text-[9px] font-black text-[#10B981]">理科</div>
                  <div className="text-[7px] text-[#94A3B8]">調合アシスト</div>
                </div>
                <div className="p-2 rounded-xl bg-[#0B0D12] border border-[#EC4899]">
                  <div className="text-lg">📜</div>
                  <div className="text-[9px] font-black text-[#EC4899]">国語</div>
                  <div className="text-[7px] text-[#94A3B8]">言霊サムライ</div>
                </div>
              </div>

              {/* ボス戦ルール構想 */}
              <div className="mt-4 p-3 rounded-2xl bg-[#070406] border border-[#EF4444]/40 space-y-1.5 text-xs">
                <div className="font-black text-[#FACC15] flex items-center gap-1">
                  <span>★</span>
                  <span>五角形ステータスと連携コンボ</span>
                </div>
                <p className="text-[11px] text-[#CBD5E1] leading-relaxed">
                  各教科で注入した「五角形ステータス」や「LXP強化値」がそのままボス戦の総合戦闘力に反映されます。5人のスキルを順番に発動してゲージを溜め、超合体必殺技を発動しましょう！
                </p>
              </div>

              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => {
                    handleCheer();
                    setShowBossModal(false);
                  }}
                  className="px-6 py-2 rounded-xl bg-[#EF4444] hover:bg-[#F87171] text-white font-black text-xs shadow-md transition"
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
