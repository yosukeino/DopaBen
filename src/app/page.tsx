"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Flame,
  Sparkles,
  Terminal,
  Volume2,
  VolumeX,
  Zap,
  Trophy,
  ChevronRight,
  Skull,
  Database,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import {
  CharacterGender,
  FiveStats,
  GeneratedQuestion,
  GradeLevel,
  PlayerProfile,
  SkillHackId,
  WordMasteryRecord,
} from "@/lib/types";
import { EVOLUTION_STAGES, SKILL_HACKS } from "@/lib/vocabData";
import { EIKEN1_TRACK_STAGES } from "@/lib/eiken1Data";
import { TARGET1800_STAGES } from "@/lib/target1800Data";
import { generateBattleDeck } from "@/lib/questionGenerator";
import {
  getActiveVocabPool,
  loadVocabPoolFromSupabase,
  syncAllLocalDataToSupabase,
} from "@/lib/vocabRepository";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
import { soundEngine } from "@/lib/soundEngine";
import { PixelCharacter } from "@/components/PixelCharacter";
import { StarRadarChart } from "@/components/StarRadarChart";
import { BattleResultSummary, BattleScreen } from "@/components/BattleScreen";
import { SkillHackModal } from "@/components/SkillHackModal";
import { VocabCodexModal } from "@/components/VocabCodexModal";

const STORAGE_KEY = "dopaben_player_profile_v1";

interface TwinkleParticle {
  id: number;
  symbol: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  color: string;
  size: string;
  delay: string;
  dur: string;
  tx: string;
  ty: string;
}

// ロゴ周辺でキラキラ弾ける『ドパベン』トゥインクル粒子（✦・★・⚡・🍀）
const LOGO_TWINKLE_PARTICLES: TwinkleParticle[] = [
  {
    id: 1,
    symbol: "✦",
    top: "-4px",
    left: "8%",
    color: "text-[#FACC15] drop-shadow-[0_0_8px_rgba(250,204,21,0.95)]",
    size: "text-base",
    delay: "0s",
    dur: "2.0s",
    tx: "-8px",
    ty: "-10px",
  },
  {
    id: 2,
    symbol: "★",
    top: "-8px",
    left: "43%",
    color: "text-[#EF4444] drop-shadow-[0_0_10px_rgba(239,68,68,1)]",
    size: "text-sm",
    delay: "0.35s",
    dur: "1.8s",
    tx: "5px",
    ty: "-12px",
  },
  {
    id: 3,
    symbol: "✦",
    top: "2px",
    right: "10%",
    color: "text-[#10B981] drop-shadow-[0_0_9px_rgba(16,185,129,0.95)]",
    size: "text-base",
    delay: "0.7s",
    dur: "2.2s",
    tx: "10px",
    ty: "-8px",
  },
  {
    id: 4,
    symbol: "⚡",
    top: "32%",
    left: "1%",
    color: "text-[#FACC15] drop-shadow-[0_0_8px_rgba(250,204,21,0.95)]",
    size: "text-xs",
    delay: "1.1s",
    dur: "1.9s",
    tx: "-10px",
    ty: "-2px",
  },
  {
    id: 5,
    symbol: "✦",
    top: "38%",
    right: "1%",
    color: "text-white drop-shadow-[0_0_9px_rgba(255,255,255,1)]",
    size: "text-sm",
    delay: "0.5s",
    dur: "2.3s",
    tx: "11px",
    ty: "4px",
  },
  {
    id: 6,
    symbol: "★",
    bottom: "0px",
    left: "18%",
    color: "text-[#10B981] drop-shadow-[0_0_8px_rgba(16,185,129,0.95)]",
    size: "text-xs",
    delay: "1.4s",
    dur: "2.1s",
    tx: "-6px",
    ty: "9px",
  },
  {
    id: 7,
    symbol: "✦",
    bottom: "-4px",
    left: "54%",
    color: "text-[#FACC15] drop-shadow-[0_0_10px_rgba(250,204,21,1)]",
    size: "text-base",
    delay: "0.2s",
    dur: "2.4s",
    tx: "4px",
    ty: "10px",
  },
  {
    id: 8,
    symbol: "🍀",
    bottom: "2px",
    right: "14%",
    color: "drop-shadow-[0_0_8px_rgba(16,185,129,0.9)]",
    size: "text-xs",
    delay: "0.9s",
    dur: "2.5s",
    tx: "8px",
    ty: "8px",
  },
];

// 出撃ボタン（BATTLE START）周辺で舞うトゥインクル・スパークル粒子
const CTA_TWINKLE_PARTICLES: TwinkleParticle[] = [
  {
    id: 101,
    symbol: "✦",
    top: "-12px",
    left: "10%",
    color: "text-[#EF4444] drop-shadow-[0_0_8px_rgba(239,68,68,0.95)]",
    size: "text-sm sm:text-base",
    delay: "0s",
    dur: "2.1s",
    tx: "-8px",
    ty: "-10px",
  },
  {
    id: 102,
    symbol: "✦",
    top: "-15px",
    left: "38%",
    color: "text-[#10B981] drop-shadow-[0_0_9px_rgba(16,185,129,1)]",
    size: "text-base sm:text-lg",
    delay: "0.4s",
    dur: "1.9s",
    tx: "6px",
    ty: "-13px",
  },
  {
    id: 103,
    symbol: "★",
    top: "-11px",
    right: "12%",
    color: "text-[#FACC15] drop-shadow-[0_0_8px_rgba(250,204,21,0.95)]",
    size: "text-sm sm:text-base",
    delay: "0.8s",
    dur: "2.3s",
    tx: "10px",
    ty: "-8px",
  },
  {
    id: 104,
    symbol: "✦",
    top: "35%",
    left: "-10px",
    color: "text-[#FACC15] drop-shadow-[0_0_7px_rgba(250,204,21,0.9)]",
    size: "text-xs sm:text-sm",
    delay: "1.1s",
    dur: "2.0s",
    tx: "-11px",
    ty: "0px",
  },
  {
    id: 105,
    symbol: "✦",
    top: "40%",
    right: "-10px",
    color: "text-[#10B981] drop-shadow-[0_0_8px_rgba(16,185,129,0.95)]",
    size: "text-sm sm:text-base",
    delay: "0.6s",
    dur: "2.4s",
    tx: "11px",
    ty: "4px",
  },
  {
    id: 106,
    symbol: "✦",
    bottom: "-11px",
    left: "18%",
    color: "text-[#EF4444] drop-shadow-[0_0_7px_rgba(239,68,68,0.9)]",
    size: "text-xs sm:text-sm",
    delay: "1.3s",
    dur: "2.2s",
    tx: "-6px",
    ty: "10px",
  },
  {
    id: 107,
    symbol: "★",
    bottom: "-14px",
    left: "52%",
    color: "text-white drop-shadow-[0_0_10px_rgba(255,255,255,1)]",
    size: "text-sm sm:text-base",
    delay: "0.2s",
    dur: "2.5s",
    tx: "4px",
    ty: "11px",
  },
  {
    id: 108,
    symbol: "✦",
    bottom: "-12px",
    right: "16%",
    color: "text-[#FACC15] drop-shadow-[0_0_8px_rgba(250,204,21,0.95)]",
    size: "text-sm",
    delay: "1.5s",
    dur: "2.0s",
    tx: "8px",
    ty: "10px",
  },
];

const DEFAULT_PROFILE: PlayerProfile = {
  name: "DOPA-HERO",
  gender: "boy",
  level: 1,
  exp: 0,
  totalBattles: 0,
  totalWordsCleared: 0,
  totalRevengeJackpots: 0,
  maxCombo: 0,
  stats: {
    vocab: 18,
    speed: 16,
    grammar: 15,
    listening: 15,
    guts: 20,
  },
  activeSkillHacks: [],
  wordMastery: {},
};

/**
 * 累計約20時間（約750バトル / 7,500問）で最高峰「語彙神」へ到達する本格育成EXP曲線
 */
export const LEVEL_REQUIRED_EXP: Record<number, number> = {
  1: 2000,    // Lv.1 -> Lv.2 (約5バトル / 約8分) 初回進化の達成感
  2: 6000,    // Lv.2 -> Lv.3 (約15バトル / 約25分) BOUNTY OVERDRIVE (3.5倍) 解放
  3: 13500,   // Lv.3 -> Lv.4 (約30バトル / 約50分) PHANTOM EYE (2択ハック) 解放
  4: 25000,   // Lv.4 -> Lv.5 (約50バトル / 約1時間20分)
  5: 65000,   // Lv.5 -> Lv.6 (約75バトル / 約2時間 ※HARDCORE 2倍EXP解放)
  6: 100000,  // Lv.6 -> Lv.7 (約110バトル / 約3時間)
  7: 160000,  // Lv.7 -> Lv.8 (約120バトル / 約3.5時間 ※OVERCLOCK 1.5倍×2倍=3倍EXP解放)
  8: 210000,  // Lv.8 -> Lv.9 (約150バトル / 約4時間)
  9: 270000,  // Lv.9 -> Lv.10 (約200バトル / 約5.5時間) 最終形態「語彙神」到達！
};

function getRequiredExpForLevel(level: number): number {
  return LEVEL_REQUIRED_EXP[level] || 300000;
}

export default function DopaBenApp() {
  const [profile, setProfile] = useState<PlayerProfile>(DEFAULT_PROFILE);
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>("ターゲット1800");
  const [selectedEikenTrack, setSelectedEikenTrack] = useState<number>(0); // 0 = Unit 01 全96語, 1〜8 = Track 001〜008
  const [selectedTargetStage, setSelectedTargetStage] = useState<number>(1); // 1〜18 = Target 1800 全18ステージ
  const [targetStageTab, setTargetStageTab] = useState<"level10" | "summary">("level10");
  const [screen, setScreen] = useState<"home" | "battle" | "result">("home");
  const [battleDeck, setBattleDeck] = useState<GeneratedQuestion[]>([]);
  const [lastResult, setLastResult] = useState<{
    summary: BattleResultSummary;
    previousLevel: number;
    newLevel: number;
    newlyUnlockedSkills: string[];
  } | null>(null);

  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isCodexModalOpen, setIsCodexModalOpen] = useState(false);
  const [codexCategory, setCodexCategory] = useState<"ターゲット1800" | "英検1級">("ターゲット1800");
  const [isMuted, setIsMuted] = useState(false);
  const [slashTransition, setSlashTransition] = useState(false);
  const [dbSource, setDbSource] = useState<"supabase" | "local">("local");
  const [dbTotalWords, setDbTotalWords] = useState<number>(1917);
  const [isSyncingDb, setIsSyncingDb] = useState<boolean>(false);
  const [dbSyncNotice, setDbSyncNotice] = useState<string | null>(null);
  const [radarBounceKey, setRadarBounceKey] = useState<number>(0);
  const [includeListening, setIncludeListening] = useState<boolean>(true);

  // ローカルストレージから復元 ＆ Supabaseから問題プールを取得 ＆ 過去のService Workerキャッシュを自動解除
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => {
          for (const reg of registrations) {
            reg.unregister();
          }
        })
        .catch(() => {});
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setProfile({ ...DEFAULT_PROFILE, ...parsed });
      }
    } catch {
      // ignore storage errors
    }

    loadVocabPoolFromSupabase()
      .then((pool) => {
        setDbSource(pool.source);
        setDbTotalWords(pool.totalCount);
      })
      .catch(() => {});
  }, []);

  const handleSyncToSupabase = async () => {
    soundEngine.playTap();
    setIsSyncingDb(true);
    setDbSyncNotice(null);
    const res = await syncAllLocalDataToSupabase();
    setIsSyncingDb(false);
    setDbSyncNotice(res.message);
    if (res.ok) {
      const pool = await loadVocabPoolFromSupabase();
      setDbSource(pool.source);
      setDbTotalWords(pool.totalCount);
    }
  };

  const saveProfile = (next: PlayerProfile) => {
    setProfile(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const triggerSlashTransition = (callback: () => void) => {
    setSlashTransition(true);
    setTimeout(() => {
      callback();
    }, 220);
    setTimeout(() => {
      setSlashTransition(false);
    }, 520);
  };

  const handleStartBattle = (
    overrideTrack?: number,
    onlyWeakWords: boolean = false,
    overrideCategory?: "ターゲット1800" | "英検1級"
  ) => {
    soundEngine.playAllOutIntro();
    const useHardcore =
      profile.level >= 5 &&
      profile.activeSkillHacks.includes("hardcore_challenge");
    const activeGrade =
      overrideCategory !== undefined
        ? overrideCategory
        : overrideTrack !== undefined
        ? "英検1級"
        : selectedGrade;
    const targetTrack =
      overrideTrack !== undefined
        ? overrideTrack
        : activeGrade === "ターゲット1800"
        ? selectedTargetStage
        : selectedEikenTrack;
    if (overrideTrack !== undefined) {
      setSelectedGrade(activeGrade);
      if (activeGrade === "ターゲット1800") {
        setSelectedTargetStage(overrideTrack);
        setTargetStageTab(overrideTrack <= 10 ? "level10" : "summary");
      } else {
        setSelectedEikenTrack(overrideTrack);
      }
    }

    const deck = generateBattleDeck(
      activeGrade,
      useHardcore,
      targetTrack,
      profile.wordMastery,
      onlyWeakWords,
      includeListening
    );

    setIsCodexModalOpen(false);
    triggerSlashTransition(() => {
      setBattleDeck(deck);
      setScreen("battle");
    });
  };

  const handleCompleteBattle = (summary: BattleResultSummary) => {
    const prevLevel = profile.level;
    let currentLv = profile.level;
    let currentExp = profile.exp + summary.earnedExp;

    while (currentLv < 10 && currentExp >= getRequiredExpForLevel(currentLv)) {
      currentExp -= getRequiredExpForLevel(currentLv);
      currentLv += 1;
    }

    const newlyUnlocked = SKILL_HACKS.filter(
      (s) => s.unlockLevel > prevLevel && s.unlockLevel <= currentLv
    );
    const updatedActiveSkills = Array.from(
      new Set([
        ...profile.activeSkillHacks,
        ...newlyUnlocked.map((s) => s.id),
      ])
    );

    const updatedStats: FiveStats = {
      vocab: Math.min(100, profile.stats.vocab + (summary.statGains.vocab || 0)),
      speed: Math.min(100, profile.stats.speed + (summary.statGains.speed || 0)),
      grammar: Math.min(
        100,
        profile.stats.grammar + (summary.statGains.grammar || 0)
      ),
      listening: Math.min(
        100,
        profile.stats.listening + (summary.statGains.listening || 0)
      ),
      guts: Math.min(100, profile.stats.guts + (summary.statGains.guts || 0)),
    };

    // 今回のバトルで出題された各単語の習熟度（cleared / missed）を保存
    const updatedMastery: Record<string, WordMasteryRecord> = {
      ...(profile.wordMastery || {}),
    };
    const now = Date.now();
    for (const [wordId, delta] of Object.entries(summary.masteryDeltas || {})) {
      const prev = updatedMastery[wordId] || {
        cleared: 0,
        missed: 0,
        lastPlayedAt: 0,
      };
      updatedMastery[wordId] = {
        cleared: prev.cleared + delta.cleared,
        missed: prev.missed + delta.missed,
        lastPlayedAt: now,
      };
    }

    const nextProfile: PlayerProfile = {
      ...profile,
      level: currentLv,
      exp: currentExp,
      totalBattles: profile.totalBattles + 1,
      totalWordsCleared: profile.totalWordsCleared + summary.wordsCleared,
      totalRevengeJackpots:
        profile.totalRevengeJackpots + summary.revengeCount,
      maxCombo: Math.max(profile.maxCombo, summary.maxCombo),
      stats: updatedStats,
      activeSkillHacks: updatedActiveSkills,
      wordMastery: updatedMastery,
    };

    saveProfile(nextProfile);
    setLastResult({
      summary,
      previousLevel: prevLevel,
      newLevel: currentLv,
      newlyUnlockedSkills: newlyUnlocked.map((s) => s.name),
    });

    triggerSlashTransition(() => {
      setScreen("result");
      setRadarBounceKey((k) => k + 1);
      // スラッシュ演出が開けた瞬間にもう一度0.5秒ド派手バーストを発火させて確実に見せる
      setTimeout(() => {
        setRadarBounceKey((k) => k + 1);
      }, 260);
      soundEngine.playEvolutionFanfare();
      try {
        confetti({
          particleCount: currentLv > prevLevel ? 110 : 55,
          spread: 75,
          origin: { y: 0.6 },
          colors: ["#FACC15", "#10B981", "#EF4444", "#FFFFFF"],
        });
      } catch {
        // ignore confetti error
      }
    });
  };

  const handleToggleGender = (gender: CharacterGender) => {
    soundEngine.playTap();
    saveProfile({ ...profile, gender });
  };

  const handleToggleSkill = (skillId: SkillHackId) => {
    const exists = profile.activeSkillHacks.includes(skillId);
    const nextSkills = exists
      ? profile.activeSkillHacks.filter((id) => id !== skillId)
      : [...profile.activeSkillHacks, skillId];
    saveProfile({ ...profile, activeSkillHacks: nextSkills });
  };

  const handleInstantLevelChange = (newLevel: number) => {
    const clamped = Math.max(1, Math.min(10, newLevel));
    const autoUnlockedSkills = SKILL_HACKS.filter(
      (s) => s.unlockLevel <= clamped
    ).map((s) => s.id);
    saveProfile({
      ...profile,
      level: clamped,
      exp: 0,
      activeSkillHacks: autoUnlockedSkills,
    });
  };

  const currentStageInfo =
    EVOLUTION_STAGES[Math.min(10, Math.max(1, profile.level)) - 1];
  const reqExp = getRequiredExpForLevel(profile.level);
  const expPercent =
    profile.level >= 10
      ? 100
      : Math.min(100, Math.round((profile.exp / reqExp) * 100));
  const isHardcoreActive =
    profile.level >= 5 &&
    profile.activeSkillHacks.includes("hardcore_challenge");

  return (
    <div className="min-h-screen bg-[#0B0D12] text-white relative overflow-x-clip touch-pan-y">
      {/* 斜めスラッシュ画面遷移エフェクト */}
      <AnimatePresence>
        {slashTransition && (
          <motion.div
            initial={{ x: "-120%", skewX: -18 }}
            animate={{ x: "0%", skewX: -18 }}
            exit={{ x: "120%", skewX: -18 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-[#FACC15] border-x-8 border-white flex items-center justify-center pointer-events-none"
          >
            <div className="bg-[#0B0D12] text-[#FACC15] font-black text-3xl px-8 py-3 -skew-x-12 border-4 border-white shadow-[6px_6px_0_#10B981] tracking-widest">
              DOPABEN // OVERDRIVE
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === 1. バトル画面 === */}
      {screen === "battle" && (
        <BattleScreen
          initialDeck={battleDeck}
          profile={profile}
          onCompleteBattle={handleCompleteBattle}
          onAbort={() =>
            triggerSlashTransition(() => {
              setScreen("home");
            })
          }
        />
      )}

      {/* === 2. リザルト＆10段階進化画面 === */}
      {screen === "result" && lastResult && (
        <div className="min-h-screen w-full max-w-md mx-auto flex flex-col justify-between bg-[#0B0D12] bg-halftone p-4">
          <div className="space-y-4">
            <motion.div
              initial={{ scale: 0.85, rotate: -3 }}
              animate={{ scale: 1, rotate: -1 }}
              className="bg-[#10B981] border-2 border-white p-3.5 text-center shadow-p5-yellow clip-p5-banner"
            >
              <div className="text-xs font-black text-[#0B0D12] tracking-widest">
                MISSION ACCOMPLISHED // 脳汁リザルト
              </div>
              <h1 className="text-3xl font-black italic tracking-tight text-white drop-shadow-[2px_2px_0_#0B0D12]">
                +{lastResult.summary.earnedExp} EXP GET!!
              </h1>
            </motion.div>

            <div className="bg-[#131720] border-2 border-white p-4 shadow-p5-yellow relative">
              {lastResult.newLevel > lastResult.previousLevel ? (
                <div className="text-center space-y-2">
                  <span className="inline-block bg-[#FACC15] text-[#0B0D12] font-black text-xs px-3 py-1 -skew-x-12 animate-bounce">
                    🎉 EVOLUTION!! 第{lastResult.previousLevel}段階 ➔ 第
                    {lastResult.newLevel}段階へ進化！！
                  </span>
                  <div className="flex justify-center py-1">
                    <PixelCharacter
                      gender={profile.gender}
                      stage={profile.level}
                      size={128}
                      mood="evolve"
                    />
                  </div>
                  <div className="font-black text-lg text-[#FACC15]">
                    {profile.gender === "boy"
                      ? currentStageInfo.titleBoy
                      : currentStageInfo.titleGirl}
                  </div>
                  <p className="text-xs text-[#94A3B8]">
                    {currentStageInfo.unlockMessage}
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <PixelCharacter
                    gender={profile.gender}
                    stage={profile.level}
                    size={96}
                    mood="happy"
                  />
                  <div className="flex-1 space-y-1.5">
                    <div className="text-xs font-black text-[#FACC15]">
                      Lv.{profile.level} //{" "}
                      {profile.gender === "boy"
                        ? currentStageInfo.titleBoy
                        : currentStageInfo.titleGirl}
                    </div>
                    <div className="w-full h-3 bg-[#0B0D12] border border-white -skew-x-12 p-0.5">
                      <div
                        className="h-full bg-[#FACC15]"
                        style={{ width: `${expPercent}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-[#94A3B8] font-bold">
                      次のドット絵進化まで: あと{" "}
                      <span className="text-white font-black">
                        {Math.max(0, reqExp - profile.exp)} EXP
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {lastResult.newlyUnlockedSkills.length > 0 && (
                <div className="mt-3 bg-[#0B0D12] border-2 border-[#10B981] p-3 space-y-1">
                  <div className="text-xs font-black text-[#10B981] flex items-center gap-1">
                    <Terminal className="w-4 h-4" />
                    特権スキルハック解禁！！
                  </div>
                  {lastResult.newlyUnlockedSkills.map((name) => (
                    <div key={name} className="text-sm font-black text-white">
                      🔓 {name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-[#131720] border-2 border-[#262D3D] p-3 flex flex-col items-center">
              <div className="text-xs font-black text-[#10B981] mb-1">
                ♪♪ PARAMETER GROWTH // 五角形ステータス成長 ♪♪
              </div>
              <StarRadarChart
                stats={profile.stats}
                recentGains={lastResult.summary.statGains}
                triggerKey={radarBounceKey}
                variant="result"
              />
              <button
                type="button"
                onClick={() => {
                  soundEngine.playTap();
                  setRadarBounceKey((k) => k + 1);
                }}
                className="mt-1 text-[10px] font-black text-[#FACC15] hover:text-white bg-[#0B0D12] border border-[#262D3D] hover:border-[#FACC15] px-3 py-1 -skew-x-6 flex items-center gap-1 active:scale-95 transition"
              >
                <span>✨ 0.5秒ド派手成長バーストをもう一度再生</span>
              </button>
              <div className="grid grid-cols-3 gap-2 w-full mt-2 text-center">
                <div className="bg-[#0B0D12] border border-[#262D3D] p-2">
                  <div className="text-[10px] text-[#94A3B8] font-bold">
                    最大チェイン
                  </div>
                  <div className="text-base font-black text-white">
                    {lastResult.summary.maxCombo} COMBO
                  </div>
                </div>
                <div className="bg-[#0B0D12] border border-[#262D3D] p-2">
                  <div className="text-[10px] text-[#94A3B8] font-bold">
                    倍返し撃破
                  </div>
                  <div className="text-base font-black text-[#FACC15]">
                    {lastResult.summary.revengeCount} 回
                  </div>
                </div>
                <div className="bg-[#0B0D12] border border-[#262D3D] p-2">
                  <div className="text-[10px] text-[#94A3B8] font-bold">
                    撃破問題数
                  </div>
                  <div className="text-base font-black text-[#10B981]">
                    {lastResult.summary.wordsCleared} 問
                  </div>
                </div>
              </div>
            </div>

            {/* 📝 今回の出撃ワード戦績（タップで発音再生＆復習） */}
            {lastResult.summary.wordLogs &&
              lastResult.summary.wordLogs.length > 0 && (
                <div className="bg-[#131720] border-2 border-[#262D3D] p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs font-black">
                    <span className="text-white flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-[#FACC15]" />
                      今回の出撃ワード振り返り（タップで発音）
                    </span>
                    <span className="text-[10px] text-[#94A3B8]">
                      全{lastResult.summary.wordLogs.length}語
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-52 overflow-y-auto pr-0.5">
                    {lastResult.summary.wordLogs.map((log) => (
                      <div
                        key={log.wordId}
                        onClick={() =>
                          soundEngine.speakEnglish(log.english, 1.0)
                        }
                        className="cursor-pointer bg-[#0B0D12] hover:border-[#FACC15] border border-[#262D3D] p-2 flex items-center justify-between gap-2 transition"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`text-[10px] font-black px-1.5 py-0.5 ${
                                log.result === "perfect"
                                  ? "bg-[#10B981] text-[#0B0D12]"
                                  : log.result === "revenge"
                                  ? "bg-[#FACC15] text-[#0B0D12]"
                                  : "bg-[#EF4444] text-white"
                              }`}
                            >
                              {log.result === "perfect"
                                ? "⚡ 一発撃破"
                                : log.result === "revenge"
                                ? "🔥 倍返し成功"
                                : "🛡️ 要復習"}
                            </span>
                            <span className="text-sm font-black text-white">
                              {log.english}
                            </span>
                            <span className="text-[10px] text-[#94A3B8] font-bold">
                              {log.phonetic}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-[#FACC15] truncate mt-0.5">
                            ＝ {log.japanese}
                          </div>
                        </div>

                        <div className="bg-[#131720] text-[#FACC15] p-1.5 border border-[#262D3D] shrink-0">
                          <Volume2 className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>

          <div className="space-y-2.5 pt-3">
            <button
              onClick={() => handleStartBattle()}
              className="w-full py-4 bg-[#EF4444] hover:brightness-110 text-white font-black text-lg border-2 border-white clip-p5-btn shadow-p5-yellow flex items-center justify-center gap-2 active:scale-95 transition"
            >
              <Flame className="w-5 h-5 fill-[#FACC15] text-[#FACC15]" />
              もう1戦突入する！（1 MORE BATTLE）
            </button>
            <button
              onClick={() =>
                triggerSlashTransition(() => {
                  setScreen("home");
                })
              }
              className="w-full py-3 bg-[#131720] hover:bg-[#1E2534] text-white font-black text-sm border border-[#262D3D]"
            >
              アジト（拠点）へ戻る
            </button>
          </div>
        </div>
      )}

      {/* === 3. ホーム拠点（アジト）画面 === */}
      {screen === "home" && (
        <div className="min-h-screen w-full max-w-md mx-auto flex flex-col justify-between bg-[#0B0D12] bg-halftone p-3.5 space-y-3 touch-pan-y">
          {/* トップヒーローヘッダー：完全透過『ドパベン』ロゴ ＋ Twinkle Effect粒子 */}
          <header className="relative pt-1 pb-2 border-b-2 border-[#262D3D] touch-pan-y">
            {/* 上部ユーティリティバー */}
            <div className="flex items-center justify-between mb-1.5 relative z-20">
              <div className="flex items-center gap-1.5 pointer-events-none select-none">
                <span className="bg-[#FACC15] text-[#0B0D12] text-[10px] font-black px-2 py-0.5 -skew-x-12 border border-white">
                  DOPAMINE × STUDY
                </span>
                <span className="text-[10px] font-black text-white tracking-wider">
                  脳汁育成イングリッシュ
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="flex bg-[#131720] border border-[#262D3D] p-0.5">
                  <button
                    onClick={() => handleToggleGender("boy")}
                    className={`px-2.5 py-1 text-[11px] font-black transition ${
                      profile.gender === "boy"
                        ? "bg-[#FACC15] text-[#0B0D12]"
                        : "text-[#94A3B8] hover:text-white"
                    }`}
                  >
                    男子
                  </button>
                  <button
                    onClick={() => handleToggleGender("girl")}
                    className={`px-2.5 py-1 text-[11px] font-black transition ${
                      profile.gender === "girl"
                        ? "bg-[#FACC15] text-[#0B0D12]"
                        : "text-[#94A3B8] hover:text-white"
                    }`}
                  >
                    女子
                  </button>
                </div>

                <button
                  onClick={() => {
                    const nextMute = !isMuted;
                    setIsMuted(nextMute);
                    soundEngine.setMuted(nextMute);
                  }}
                  className="p-1.5 bg-[#131720] border border-[#262D3D] text-white hover:border-[#FACC15] transition"
                  title="音声ON/OFF"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-[#EF4444]" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-[#FACC15]" />
                  )}
                </button>
              </div>
            </div>

            {/* 完全透過ロゴ ＋ 呼吸ネオンオーラ ＋ Twinkle Sparkle エフェクト */}
            <div className="relative flex justify-center items-center py-1 my-0 pointer-events-none select-none">
              {/* 1. 呼吸するネオンオーラ */}
              <div
                className="pointer-events-none absolute inset-x-8 inset-y-0.5 rounded-full bg-gradient-to-r from-[#EF4444]/30 via-[#FACC15]/25 to-[#10B981]/30 animate-dopa-aura"
              />

              {/* 2. パラパラと可愛く弾ける Twinkle Sparkles (✦ / ★ / ⚡ / 🍀) */}
              <div className="pointer-events-none absolute inset-0 overflow-visible z-20">
                {LOGO_TWINKLE_PARTICLES.map((p) => (
                  <span
                    key={p.id}
                    className={`absolute animate-twinkle font-black select-none pointer-events-none ${p.color} ${p.size}`}
                    style={{
                      top: p.top,
                      bottom: p.bottom,
                      left: p.left,
                      right: p.right,
                      animationDelay: p.delay,
                      ["--tw-dur" as string]: p.dur,
                      ["--tw-x" as string]: p.tx,
                      ["--tw-y" as string]: p.ty,
                    }}
                  >
                    {p.symbol}
                  </span>
                ))}
              </div>

              {/* 3. 完全透過済みの『ドパベン』ロゴ本体（スマホのファーストビューに合わせて最適化） */}
              <img
                src="/dopaben-logo.png"
                alt="ドパベン"
                draggable={false}
                className="w-full max-w-[240px] sm:max-w-[290px] h-auto object-contain relative z-10 animate-logo-float drop-shadow-[0_0_2px_rgba(255,255,255,0.45)] drop-shadow-[0_6px_18px_rgba(250,204,21,0.4)] select-none pointer-events-none"
              />
            </div>
          </header>

          {/* メイン育成キャラクター・ステージカード（「スキル設定」ボタン以外の全領域をスワイプ可に設定） */}
          <section className="bg-[#131720] border-2 border-white p-3 shadow-p5-yellow relative overflow-hidden touch-pan-y select-none">
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-[#FACC15]/10 rotate-12 pointer-events-none" />

            <div className="flex items-center justify-between mb-2 relative z-10 pointer-events-none">
              <span className="bg-[#FACC15] text-[#0B0D12] font-black text-[11px] px-2.5 py-0.5 -skew-x-12 border border-[#0B0D12]">
                {currentStageInfo.subtitle}
              </span>
              <span className="text-[11px] font-black text-[#94A3B8] flex items-center gap-0.5">
                10段階進化・育成ステータス
              </span>
            </div>

            <div className="flex items-center gap-3 relative z-10 pointer-events-none">
              <div className="bg-[#0B0D12] border-2 border-white p-1 shrink-0 shadow-[3px_3px_0_#FACC15]">
                <PixelCharacter
                  gender={profile.gender}
                  stage={profile.level}
                  size={88}
                  mood="idle"
                />
              </div>

              <div className="flex-1 space-y-1.5">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl sm:text-2xl font-black italic text-[#FACC15] drop-shadow-[2px_2px_0_#0B0D12]">
                      Lv.{profile.level}
                    </span>
                    <span className="text-xs font-bold text-[#94A3B8]">
                      / 10段階進化
                    </span>
                  </div>
                  <h2 className="font-black text-sm sm:text-base text-white leading-snug mt-0.5">
                    {profile.gender === "boy"
                      ? currentStageInfo.titleBoy
                      : currentStageInfo.titleGirl}
                  </h2>
                </div>

                <p className="text-[10px] sm:text-[11px] text-[#94A3B8] leading-relaxed line-clamp-2">
                  {currentStageInfo.unlockMessage}
                </p>

                <div className="space-y-0.5">
                  <div className="flex justify-between text-[10px] font-black">
                    <span className="text-[#94A3B8]">NEXT EVOLUTION</span>
                    <span className="text-[#FACC15]">
                      {profile.level >= 10
                        ? "MAX LEVEL"
                        : `${profile.exp} / ${reqExp} EXP`}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#0B0D12] border border-white -skew-x-12 p-0.5">
                    <motion.div
                      className="h-full bg-[#FACC15]"
                      animate={{ width: `${expPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-[#262D3D] flex items-center justify-between gap-2 relative z-10">
              <div className="flex items-center gap-1.5 flex-wrap pointer-events-none">
                <span className="text-[10px] font-black text-[#94A3B8] flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-[#FACC15]" /> 発動スキル:
                </span>
                {profile.activeSkillHacks.filter((id) => {
                  const def = SKILL_HACKS.find((s) => s.id === id);
                  return def && profile.level >= def.unlockLevel;
                }).length === 0 ? (
                  <span className="text-[11px] text-[#94A3B8] font-bold">
                    Lv.2で最初の特権スキル解禁！
                  </span>
                ) : (
                  SKILL_HACKS.filter(
                    (s) =>
                      profile.level >= s.unlockLevel &&
                      profile.activeSkillHacks.includes(s.id)
                  ).map((s) => (
                    <span
                      key={s.id}
                      className="bg-[#0B0D12] border border-[#FACC15] text-[#FACC15] text-[10px] font-black px-2 py-0.5 -skew-x-6"
                    >
                      {s.badge}: {s.name.split("（")[0]}
                    </span>
                  ))
                )}
              </div>

              <button
                onClick={() => {
                  soundEngine.playTap();
                  setIsSkillModalOpen(true);
                }}
                className="pointer-events-auto touch-manipulation cursor-pointer bg-[#0B0D12] hover:bg-[#FACC15] hover:text-[#0B0D12] text-[#FACC15] border border-[#FACC15] px-2.5 py-1 text-[11px] font-black shrink-0 transition"
              >
                スキル設定
              </button>
            </div>
          </section>

          {/* 五角形ステータス＆戦績サマリー（スワイプ操作を邪魔しない touch-pan-y 対応） */}
          <section className="grid grid-cols-12 gap-2 sm:gap-2.5 items-center bg-[#131720] border-2 border-[#262D3D] p-2 sm:p-2.5 touch-pan-y select-none relative">
            <div className="col-span-7 flex flex-col items-center justify-center touch-pan-y pointer-events-none">
              <StarRadarChart
                stats={profile.stats}
                triggerKey={radarBounceKey}
              />
              <button
                onClick={() => {
                  soundEngine.playTap();
                  setRadarBounceKey((k) => k + 1);
                }}
                className="pointer-events-auto touch-manipulation cursor-pointer mt-0.5 text-[9px] font-black text-[#FACC15] hover:text-white bg-[#0B0D12] border border-[#262D3D] hover:border-[#FACC15] px-2 py-0.5 -skew-x-6 flex items-center gap-1 active:scale-95 transition"
                title="もう一度ボヨヨ〜ンと跳ねさせる"
              >
                <span>⚡ ボヨヨ〜ン再跳ね</span>
              </button>
            </div>
            <div className="col-span-5 space-y-1.5 sm:space-y-2 pr-1 touch-pan-y pointer-events-none">
              <div className="bg-[#0B0D12] border-l-4 border-[#10B981] p-1.5 sm:p-2">
                <div className="text-[9px] sm:text-[10px] text-[#94A3B8] font-bold">
                  総撃破単語数
                </div>
                <div className="text-sm sm:text-base font-black text-[#10B981]">
                  {profile.totalWordsCleared} WORDS
                </div>
              </div>
              <div className="bg-[#0B0D12] border-l-4 border-[#FACC15] p-1.5 sm:p-2">
                <div className="text-[9px] sm:text-[10px] text-[#94A3B8] font-bold">
                  倍返し(REVENGE)成功
                </div>
                <div className="text-sm sm:text-base font-black text-[#FACC15]">
                  {profile.totalRevengeJackpots} JACKPOTS
                </div>
              </div>
              <div className="bg-[#0B0D12] border-l-4 border-white p-1.5 sm:p-2">
                <div className="text-[9px] sm:text-[10px] text-[#94A3B8] font-bold">
                  最高コンボ記録
                </div>
                <div className="text-sm sm:text-base font-black text-white">
                  {profile.maxCombo} CHAIN
                </div>
              </div>
            </div>
          </section>

          {/* スムーズスクロール誘導ボタン */}
          <div className="flex justify-center -my-1">
            <button
              onClick={() => {
                soundEngine.playTap();
                const el = document.getElementById("stage-select-section");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="bg-[#131720] hover:bg-[#FACC15] hover:text-[#0B0D12] border border-[#262D3D] hover:border-white text-[#94A3B8] px-3.5 py-1 text-[11px] font-black -skew-x-6 flex items-center gap-1.5 transition active:scale-95"
            >
              <span>▼ 出撃ステージ選択・BATTLE START へ</span>
            </button>
          </div>

          {/* 出撃ステージセレクト（中学英単語ステージ ＆ 英検1級ステージ） */}
          <section id="stage-select-section" className="space-y-2.5 pt-1 pb-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-black text-white flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-[#FACC15] shrink-0" />
                {includeListening
                  ? "出撃ステージ選択（全4形式：英日/日英/リスニング/文脈穴埋め）"
                  : "出撃ステージ選択（3形式：英日/日英/文脈穴埋め・音声なし）"}
              </span>

              {profile.level >= 5 ? (
                <button
                  onClick={() => {
                    soundEngine.playTap();
                    handleToggleSkill("hardcore_challenge");
                  }}
                  className={`px-2.5 py-1 text-[11px] font-black border -skew-x-6 flex items-center gap-1 shrink-0 transition ${
                    isHardcoreActive
                      ? "bg-[#FACC15] text-[#0B0D12] border-white"
                      : "bg-[#131720] text-[#94A3B8] border-[#262D3D] hover:border-[#FACC15]"
                  }`}
                >
                  <Skull className="w-3.5 h-3.5" />
                  激ムズ: {isHardcoreActive ? "ON (EXP×2)" : "OFF"}
                </button>
              ) : (
                <button
                  onClick={() => {
                    soundEngine.playTap();
                    setIsSkillModalOpen(true);
                  }}
                  className="text-[11px] font-bold text-[#94A3B8] hover:text-[#FACC15] shrink-0 transition"
                >
                  🔒 Lv.5で『激ムズ』解禁
                </button>
              )}
            </div>

            {/* Supabase DB ステータス＆ワンクリック同期バー */}
            <div className="flex items-center justify-between bg-[#131720] border border-[#262D3D] px-2.5 py-1.5 text-[10px]">
              <div className="flex items-center gap-1.5 font-black">
                <Database
                  className={`w-3.5 h-3.5 ${
                    dbSource === "supabase"
                      ? "text-[#10B981]"
                      : "text-[#FACC15]"
                  }`}
                />
                <span
                  className={
                    dbSource === "supabase"
                      ? "text-[#10B981]"
                      : "text-[#94A3B8]"
                  }
                >
                  {dbSource === "supabase"
                    ? `SUPABASE DB 接続中 (${dbTotalWords}問)`
                    : `内蔵DB稼働中 (${dbTotalWords}問 / Supabase対応済)`}
                </span>
              </div>

              {isSupabaseConfigured && (
                <button
                  onClick={handleSyncToSupabase}
                  disabled={isSyncingDb}
                  className="bg-[#0B0D12] hover:bg-[#FACC15] hover:text-[#0B0D12] text-white border border-[#262D3D] px-2 py-0.5 font-black transition disabled:opacity-50"
                >
                  {isSyncingDb ? "同期中..." : "🔄 DBへ一括同期"}
                </button>
              )}
            </div>

            {dbSyncNotice && (
              <div className="text-[10px] font-bold text-[#10B981] bg-[#131720] border border-[#10B981]/60 px-2.5 py-1">
                {dbSyncNotice}
              </div>
            )}

            {/* 🎯 中学英単語ステージ【ターゲット1800】（10分割 ＆ まとめステージ全18ステージ） */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  soundEngine.playTap();
                  setSelectedGrade("ターゲット1800");
                }}
                className={`w-full py-2.5 px-3 font-black text-left border-2 -skew-x-6 transition flex items-center justify-between ${
                  selectedGrade === "ターゲット1800"
                    ? "bg-[#FACC15] text-[#0B0D12] border-white shadow-[4px_4px_0_#10B981]"
                    : "bg-[#131720] text-[#94A3B8] border-[#262D3D] hover:border-[#FACC15] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 border ${
                      selectedGrade === "ターゲット1800"
                        ? "bg-[#0B0D12] text-[#FACC15] border-[#0B0D12]"
                        : "bg-[#0B0D12] text-[#94A3B8] border-[#262D3D]"
                    }`}
                  >
                    {selectedGrade === "ターゲット1800"
                      ? "● 選択中"
                      : "MAIN 18 STAGES"}
                  </span>
                  <span className="text-sm tracking-tight">
                    🎯 中学英単語ステージ【ターゲット1800】
                  </span>
                </div>
                <span
                  className={`text-[11px] font-black ${
                    selectedGrade === "ターゲット1800"
                      ? "text-[#0B0D12]"
                      : "text-[#94A3B8]"
                  }`}
                >
                  全1,800語
                </span>
              </button>

              {selectedGrade === "ターゲット1800" && (
                <div className="bg-[#131720] border-2 border-[#FACC15] p-2.5 space-y-2">
                  {/* 上部ガイド＆1,800語図鑑ボタン */}
                  <div className="flex items-center justify-between text-[10px] font-black">
                    <span className="text-[#94A3B8]">
                      🎯 全18ステージ選択（黄色＝現在の出撃ステージ）
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playTap();
                        setCodexCategory("ターゲット1800");
                        setIsCodexModalOpen(true);
                      }}
                      className="bg-[#0B0D12] hover:bg-[#FACC15] hover:text-[#0B0D12] text-white border border-white px-2 py-0.5 flex items-center gap-1 transition"
                    >
                      <BookOpen className="w-3 h-3 text-[#FACC15]" />
                      1,800語図鑑・制覇率
                    </button>
                  </div>

                  {/* タブ切り替え：10分割ステージ vs まとめステージ（黄色＝選択中） */}
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playTap();
                        setTargetStageTab("level10");
                        if (selectedTargetStage > 10) {
                          setSelectedTargetStage(1);
                        }
                      }}
                      className={`py-1.5 px-2 text-[11px] font-black border transition ${
                        targetStageTab === "level10"
                          ? "bg-[#FACC15] text-[#0B0D12] border-white"
                          : "bg-[#0B0D12] text-[#94A3B8] border-[#262D3D] hover:border-[#FACC15] hover:text-white"
                      }`}
                    >
                      ⚡ 10分割ステージ (Lv.01〜10)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playTap();
                        setTargetStageTab("summary");
                        if (selectedTargetStage <= 10) {
                          setSelectedTargetStage(11);
                        }
                      }}
                      className={`py-1.5 px-2 text-[11px] font-black border transition ${
                        targetStageTab === "summary"
                          ? "bg-[#FACC15] text-[#0B0D12] border-white"
                          : "bg-[#0B0D12] text-[#94A3B8] border-[#262D3D] hover:border-[#FACC15] hover:text-white"
                      }`}
                    >
                      👑 まとめ＆FINAL (2Lv・5Lv・全)
                    </button>
                  </div>

                  {/* 現在選択中のステージ詳細バナー */}
                  {(() => {
                    const activeStage =
                      TARGET1800_STAGES.find(
                        (s) => s.unitNumber === selectedTargetStage
                      ) || TARGET1800_STAGES[0];
                    const poolWords = getActiveVocabPool().target1800Words;
                    const stageWords = poolWords.filter((w) =>
                      activeStage.levels.includes(w.track || 1)
                    );
                    const masteredCount = stageWords.filter(
                      (w) => (profile.wordMastery?.[w.id]?.cleared || 0) > 0
                    ).length;
                    return (
                      <div className="bg-[#0B0D12] border border-[#262D3D] px-2.5 py-1.5 flex items-center justify-between text-[11px]">
                        <div>
                          <span className="font-black text-[#FACC15]">
                            {activeStage.title}
                          </span>
                          <span className="text-[#94A3B8] ml-1.5 text-[10px] font-bold">
                            {activeStage.subLabel}
                          </span>
                        </div>
                        <span className="font-black text-[#10B981] shrink-0">
                          制覇 {masteredCount}/{stageWords.length}語
                        </span>
                      </div>
                    );
                  })()}

                  {/* ステージ一覧グリッド（すべて選択中＝黄色 #FACC15、制覇バー＝エメラルド #10B981 に完全統一） */}
                  {targetStageTab === "level10" ? (
                    <div className="grid grid-cols-5 gap-1.5">
                      {TARGET1800_STAGES.filter((s) => s.group === "level10").map(
                        (s) => {
                          const isSelected = selectedTargetStage === s.unitNumber;
                          const poolWords = getActiveVocabPool().target1800Words;
                          const stageWords = poolWords.filter((w) =>
                            s.levels.includes(w.track || 1)
                          );
                          const masteredCount = stageWords.filter(
                            (w) => (profile.wordMastery?.[w.id]?.cleared || 0) > 0
                          ).length;
                          const totalInStage = stageWords.length || 180;
                          const isComplete =
                            totalInStage > 0 && masteredCount >= totalInStage;

                          return (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => {
                                soundEngine.playTap();
                                setSelectedTargetStage(s.unitNumber);
                              }}
                              className={`py-1.5 px-1 text-center border transition relative overflow-hidden ${
                                isSelected
                                  ? "bg-[#FACC15] text-[#0B0D12] border-white font-black"
                                  : "bg-[#0B0D12] text-[#94A3B8] border-[#262D3D] hover:border-[#FACC15] hover:text-white font-bold"
                              }`}
                            >
                              <div className="text-[11px] leading-tight flex items-center justify-center gap-0.5">
                                {isComplete && (
                                  <CheckCircle2
                                    className={`w-2.5 h-2.5 shrink-0 ${
                                      isSelected
                                        ? "text-[#0B0D12]"
                                        : "text-[#10B981]"
                                    }`}
                                  />
                                )}
                                <span
                                  className={
                                    isSelected ? "text-[#0B0D12]" : "text-white"
                                  }
                                >
                                  {s.label}
                                </span>
                              </div>
                              <div
                                className={`text-[9px] leading-tight ${
                                  isSelected
                                    ? "text-[#0B0D12]/80 font-black"
                                    : "text-[#94A3B8]"
                                }`}
                              >
                                {s.rangeLabel}
                              </div>
                              <div
                                className={`w-full h-1 mt-1 ${
                                  isSelected ? "bg-[#0B0D12]/25" : "bg-[#131720]"
                                }`}
                              >
                                <div
                                  className="h-full bg-[#10B981] transition-all"
                                  style={{
                                    width: `${Math.min(
                                      100,
                                      Math.round(
                                        (masteredCount /
                                          Math.max(1, totalInStage)) *
                                          100
                                      )
                                    )}%`,
                                  }}
                                />
                              </div>
                            </button>
                          );
                        }
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {/* 2レベルごとまとめ（5ステージ） */}
                      <div className="text-[10px] font-black text-[#94A3B8]">
                        🔥 2レベルまとめステージ（原作LEVEL 1〜5 単位）
                      </div>
                      <div className="grid grid-cols-5 gap-1.5">
                        {TARGET1800_STAGES.filter((s) => s.group === "sum2").map(
                          (s) => {
                            const isSelected =
                              selectedTargetStage === s.unitNumber;
                            const poolWords =
                              getActiveVocabPool().target1800Words;
                            const stageWords = poolWords.filter((w) =>
                              s.levels.includes(w.track || 1)
                            );
                            const masteredCount = stageWords.filter(
                              (w) =>
                                (profile.wordMastery?.[w.id]?.cleared || 0) > 0
                            ).length;
                            const totalInStage = stageWords.length || 360;

                            return (
                              <button
                                key={s.id}
                                type="button"
                                onClick={() => {
                                  soundEngine.playTap();
                                  setSelectedTargetStage(s.unitNumber);
                                }}
                                className={`py-1.5 px-1 text-center border transition ${
                                  isSelected
                                    ? "bg-[#FACC15] text-[#0B0D12] border-white font-black"
                                    : "bg-[#0B0D12] text-white border-[#262D3D] hover:border-[#FACC15] font-bold"
                                }`}
                              >
                                <div className="text-[10px] leading-tight">
                                  {s.label.replace("まとめ ", "")}
                                </div>
                                <div
                                  className={`text-[9px] ${
                                    isSelected
                                      ? "text-[#0B0D12]/80 font-black"
                                      : "text-[#10B981]"
                                  }`}
                                >
                                  {masteredCount}/{totalInStage}
                                </div>
                              </button>
                            );
                          }
                        )}
                      </div>

                      {/* 5レベルごとまとめ（2ステージ）＆ FINAL（全1,800語） */}
                      <div className="text-[10px] font-black text-[#94A3B8] pt-0.5">
                        👑 5レベル総まとめ ＆ FINAL全1,800語ステージ
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {TARGET1800_STAGES.filter(
                          (s) => s.group === "sum5" || s.group === "final"
                        ).map((s) => {
                          const isSelected =
                            selectedTargetStage === s.unitNumber;
                          const poolWords =
                            getActiveVocabPool().target1800Words;
                          const stageWords = poolWords.filter((w) =>
                            s.levels.includes(w.track || 1)
                          );
                          const masteredCount = stageWords.filter(
                            (w) =>
                              (profile.wordMastery?.[w.id]?.cleared || 0) > 0
                          ).length;
                          const totalInStage = stageWords.length || 900;

                          return (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => {
                                soundEngine.playTap();
                                setSelectedTargetStage(s.unitNumber);
                              }}
                              className={`py-1.5 px-1.5 text-center border transition ${
                                isSelected
                                  ? "bg-[#FACC15] text-[#0B0D12] border-white font-black"
                                  : "bg-[#0B0D12] text-white border-[#262D3D] hover:border-[#FACC15] font-bold"
                              }`}
                            >
                              <div className="text-[10px] leading-tight">
                                {s.label}
                              </div>
                              <div
                                className={`text-[9px] ${
                                  isSelected
                                    ? "text-[#0B0D12]/80 font-black"
                                    : "text-[#10B981]"
                                }`}
                              >
                                {s.rangeLabel} ({masteredCount}/{totalInStage})
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 👑 専用：英検1級単語ステージ（Unit 01: 0001〜0096） */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  soundEngine.playTap();
                  setSelectedGrade("英検1級");
                }}
                className={`w-full py-2.5 px-3 font-black text-left border-2 -skew-x-6 transition flex items-center justify-between ${
                  selectedGrade === "英検1級"
                    ? "bg-[#FACC15] text-[#0B0D12] border-white shadow-[4px_4px_0_#10B981]"
                    : "bg-[#131720] text-[#94A3B8] border-[#262D3D] hover:border-[#FACC15] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 border ${
                      selectedGrade === "英検1級"
                        ? "bg-[#0B0D12] text-[#FACC15] border-[#0B0D12]"
                        : "bg-[#0B0D12] text-[#94A3B8] border-[#262D3D]"
                    }`}
                  >
                    {selectedGrade === "英検1級"
                      ? "● 選択中"
                      : "SPECIAL STAGE"}
                  </span>
                  <span className="text-sm tracking-tight">
                    👑 英検1級 単語ステージ【Unit 01】
                  </span>
                </div>
                <span
                  className={`text-[11px] font-black ${
                    selectedGrade === "英検1級"
                      ? "text-[#0B0D12]"
                      : "text-[#94A3B8]"
                  }`}
                >
                  全96語
                </span>
              </button>

              {/* 英検1級 選択時：Track 001〜008 レンジ切り替えパネル ＆ 制覇率表示 */}
              {selectedGrade === "英検1級" && (
                <div className="bg-[#131720] border-2 border-[#FACC15] p-2.5 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-black">
                    <span className="text-[#94A3B8]">
                      🎯 トラック選択（黄色＝現在の出撃トラック）
                    </span>
                    <button
                      onClick={() => {
                        soundEngine.playTap();
                        setCodexCategory("英検1級");
                        setIsCodexModalOpen(true);
                      }}
                      className="bg-[#0B0D12] hover:bg-[#FACC15] hover:text-[#0B0D12] text-white border border-white px-2 py-0.5 flex items-center gap-1 transition"
                    >
                      <BookOpen className="w-3 h-3 text-[#FACC15]" />
                      96語図鑑・制覇率
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    {EIKEN1_TRACK_STAGES.map((t) => {
                      const isSelected = selectedEikenTrack === t.trackNumber;
                      const poolWords = getActiveVocabPool().eiken1Words;
                      const trackWords =
                        t.trackNumber === 0
                          ? poolWords
                          : poolWords.filter((w) => w.track === t.trackNumber);
                      const masteredCount = trackWords.filter(
                        (w) => (profile.wordMastery?.[w.id]?.cleared || 0) > 0
                      ).length;
                      const totalInTrack = trackWords.length || 12;
                      const isComplete =
                        totalInTrack > 0 && masteredCount >= totalInTrack;

                      return (
                        <button
                          key={t.id}
                          onClick={() => {
                            soundEngine.playTap();
                            setSelectedEikenTrack(t.trackNumber);
                          }}
                          className={`py-1.5 px-1.5 text-center border transition relative overflow-hidden ${
                            t.trackNumber === 0 ? "col-span-3" : ""
                          } ${
                            isSelected
                              ? "bg-[#FACC15] text-[#0B0D12] border-white font-black"
                              : "bg-[#0B0D12] text-white border-[#262D3D] hover:border-[#FACC15] font-bold"
                          }`}
                        >
                          <div className="text-[11px] leading-tight flex items-center justify-center gap-1">
                            {isComplete && (
                              <CheckCircle2
                                className={`w-3 h-3 shrink-0 ${
                                  isSelected
                                    ? "text-[#0B0D12]"
                                    : "text-[#10B981]"
                                }`}
                              />
                            )}
                            <span>{t.label}</span>
                            <span
                              className={
                                isSelected
                                  ? "text-[#0B0D12]/80 text-[10px]"
                                  : "text-[#10B981] text-[10px]"
                              }
                            >
                              ({masteredCount}/{totalInTrack})
                            </span>
                          </div>
                          {/* トラック制覇ミニバー */}
                          <div
                            className={`w-full h-1 mt-1 ${
                              isSelected ? "bg-[#0B0D12]/25" : "bg-[#131720]"
                            }`}
                          >
                            <div
                              className="h-full bg-[#10B981] transition-all"
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.round(
                                    (masteredCount /
                                      Math.max(1, totalInTrack)) *
                                      100
                                  )
                                )}%`,
                              }}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 🎧 リスニング問題（音声のみ ➔ 日本語4択）アリ / ナシ 切り替えバー */}
            <div className="bg-[#131720] border-2 border-[#262D3D] p-2.5 flex items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="text-xs font-black text-white flex items-center gap-1.5">
                  {includeListening ? (
                    <Volume2 className="w-4 h-4 text-[#FACC15] shrink-0" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-[#94A3B8] shrink-0" />
                  )}
                  <span>🎧 リスニング問題（音声のみ）</span>
                </div>
                <div className="text-[10px] font-bold text-[#94A3B8]">
                  {includeListening
                    ? "音声のみで意味を当てる問題を含めます（全4形式）"
                    : "音を出せない環境向け：リスニング問題を除外します"}
                </div>
              </div>

              <div className="flex bg-[#0B0D12] border border-[#262D3D] p-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTap();
                    setIncludeListening(true);
                  }}
                  className={`px-3 py-1.5 text-xs font-black transition flex items-center gap-1 ${
                    includeListening
                      ? "bg-[#FACC15] text-[#0B0D12]"
                      : "text-[#94A3B8] hover:text-white"
                  }`}
                >
                  🔊 アリ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTap();
                    setIncludeListening(false);
                  }}
                  className={`px-3 py-1.5 text-xs font-black transition flex items-center gap-1 ${
                    !includeListening
                      ? "bg-[#FACC15] text-[#0B0D12]"
                      : "text-[#94A3B8] hover:text-white"
                  }`}
                >
                  🔇 ナシ
                </button>
              </div>
            </div>

            {/* Twinkle Sparkles & Breathing Aura 付き BATTLE START ボタン */}
            <div className="relative w-full pt-1">
              {/* 1. 背後の呼吸ネオンオーラ */}
              <div
                className="pointer-events-none absolute -inset-1 bg-gradient-to-r from-[#EF4444]/40 via-[#FACC15]/35 to-[#EF4444]/40 animate-dopa-aura"
              />

              {/* 2. パラパラと舞う Twinkle Sparkles (✦ / ★) */}
              <div className="pointer-events-none absolute inset-0 overflow-visible z-20">
                {CTA_TWINKLE_PARTICLES.map((p) => (
                  <span
                    key={p.id}
                    className={`absolute animate-twinkle font-black select-none pointer-events-none ${p.color} ${p.size}`}
                    style={{
                      top: p.top,
                      bottom: p.bottom,
                      left: p.left,
                      right: p.right,
                      animationDelay: p.delay,
                      ["--tw-dur" as string]: p.dur,
                      ["--tw-x" as string]: p.tx,
                      ["--tw-y" as string]: p.ty,
                    }}
                  >
                    {p.symbol}
                  </span>
                ))}
              </div>

              {/* 3. 出撃ボタン本体 ＋ 斜め光沢スイープ (animate-glint-sweep) */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => handleStartBattle()}
                className="w-full py-4 bg-[#EF4444] hover:brightness-110 text-white font-black text-xl tracking-wider border-2 border-white clip-p5-btn shadow-p5-yellow flex items-center justify-center gap-2.5 relative overflow-hidden group transition z-10"
              >
                {/* 斜めに走る光沢グレア */}
                <span className="pointer-events-none absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/45 to-transparent animate-glint-sweep" />

                <Zap className="w-6 h-6 fill-[#FACC15] text-[#FACC15] group-hover:scale-125 transition relative z-10" />
                <span className="relative z-10">BATTLE START // 出撃する</span>
                <Sparkles className="w-5 h-5 text-[#FACC15] relative z-10" />
              </motion.button>
            </div>
          </section>
        </div>
      )}

      {/* 特権スキルハック＆10段階ドット絵進化図鑑モーダル */}
      {isSkillModalOpen && (
        <SkillHackModal
          profile={profile}
          onToggleSkill={handleToggleSkill}
          onInstantLevelChange={handleInstantLevelChange}
          onClose={() => setIsSkillModalOpen(false)}
        />
      )}

      {/* 📖 中学英単語1,800語 ＆ 英検1級 Unit 01 全96語 図鑑＆制覇状況モーダル */}
      {isCodexModalOpen && (
        <VocabCodexModal
          category={codexCategory}
          wordMastery={profile.wordMastery || {}}
          initialTrack={
            codexCategory === "ターゲット1800"
              ? selectedTargetStage
              : selectedEikenTrack
          }
          onSelectTrackAndStart={(trackNum, onlyWeak, cat) =>
            handleStartBattle(trackNum, onlyWeak, cat)
          }
          onClose={() => setIsCodexModalOpen(false)}
        />
      )}
    </div>
  );
}
