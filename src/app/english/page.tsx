"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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
  Play,
  Headphones,
  Swords,
  Home,
  ArrowLeft,
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
import {
  EVOLUTION_STAGES,
  LEVEL_CUMULATIVE_LXP,
  SKILL_HACKS,
  getStatUpgradeLxpCost,
} from "@/lib/vocabData";
import { EIKEN1_TRACK_STAGES } from "@/lib/eiken1Data";
import { EIKEN4_STAGES } from "@/lib/eiken4Data";
import { TARGET1800_STAGES } from "@/lib/target1800Data";
import { generateBattleDeck, generateRankingDeck } from "@/lib/questionGenerator";
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
import { StatusModal } from "@/components/StatusModal";
import { CodexCategory, VocabCodexModal } from "@/components/VocabCodexModal";
import { CharacterCustomizeModal } from "@/components/CharacterCustomizeModal";
import { RankingBoardModal } from "@/components/RankingBoardModal";
import { RankingEntryModal } from "@/components/RankingEntryModal";
import {
  getSavedPlayerName,
  RankingRecord,
  recordRankingPlayed,
  savePlayerName,
  submitRankingScore,
} from "@/lib/rankingService";
import {
  BOY_HAIR_DEFS,
  getCharacterEvolutionTitle,
  GIRL_HAIR_DEFS,
  UNIFORM_DEFS,
} from "@/lib/characterPartsEngine";

const STORAGE_KEY = "dopaben_player_profile_v1";

/**
 * LXPなどの数値をパラパラと小気味よくカウントアップ表示する軽量コンポーネント
 */
function CountUpNumber({
  value,
  duration = 900,
}: {
  value: number;
  duration?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (value <= 0) {
      setDisplayValue(0);
      return;
    }
    const startTime = performance.now();
    let animId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * value));

      if (progress < 1) {
        animId = requestAnimationFrame(tick);
      }
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [value, duration]);

  return <>{displayValue.toLocaleString()}</>;
}

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

// スタートカード内の再生マーク（Play）アイコン周辺でパラパラと弾け舞うトゥインクル粒子
const PLAY_ICON_TWINKLE_PARTICLES: TwinkleParticle[] = [
  {
    id: 201,
    symbol: "✦",
    top: "-8px",
    left: "-8px",
    color: "text-[#FACC15] drop-shadow-[0_0_8px_rgba(250,204,21,1)]",
    size: "text-xs",
    delay: "0s",
    dur: "1.8s",
    tx: "-8px",
    ty: "-8px",
  },
  {
    id: 202,
    symbol: "★",
    top: "-10px",
    right: "-8px",
    color: "text-[#EC4899] drop-shadow-[0_0_8px_rgba(236,72,153,1)]",
    size: "text-xs",
    delay: "0.4s",
    dur: "2.1s",
    tx: "8px",
    ty: "-8px",
  },
  {
    id: 203,
    symbol: "✦",
    bottom: "-6px",
    left: "-8px",
    color: "text-[#06B6D4] drop-shadow-[0_0_8px_rgba(6,182,212,1)]",
    size: "text-xs",
    delay: "0.8s",
    dur: "1.9s",
    tx: "-8px",
    ty: "8px",
  },
  {
    id: 204,
    symbol: "✦",
    bottom: "-8px",
    right: "-6px",
    color: "text-[#10B981] drop-shadow-[0_0_8px_rgba(16,185,129,1)]",
    size: "text-xs",
    delay: "1.2s",
    dur: "2.3s",
    tx: "8px",
    ty: "8px",
  },
  {
    id: 205,
    symbol: "⚡",
    top: "-14px",
    left: "32%",
    color: "text-[#FACC15] drop-shadow-[0_0_10px_rgba(250,204,21,1)]",
    size: "text-[11px]",
    delay: "0.6s",
    dur: "2.0s",
    tx: "0px",
    ty: "-10px",
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
  totalLxp: 0,
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
  unlockedSkillHacks: [],
  activeSkillHacks: [],
  wordMastery: {},
};

/**
 * 次のレベル（Lv.2〜Lv.10）への昇格に必要な【累積LXP】を取得
 */
function getRequiredCumulativeLxpForNextLevel(currentLevel: number): number {
  const nextLv = Math.min(10, currentLevel + 1);
  return LEVEL_CUMULATIVE_LXP[nextLv] ?? 851500;
}

export default function DopaBenApp() {
  const [profile, setProfile] = useState<PlayerProfile>(DEFAULT_PROFILE);
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>("英検4級");
  const [selectedEiken4Stage, setSelectedEiken4Stage] = useState<number>(1); // 1〜16 = 英検4級 全16ステージ
  const [eiken4StageTab, setEiken4StageTab] = useState<"stage12" | "summary">("stage12");
  const [selectedEikenTrack, setSelectedEikenTrack] = useState<number>(0); // 0 = Unit 01 全96語, 1〜8 = Track 001〜008
  const [selectedTargetStage, setSelectedTargetStage] = useState<number>(1); // 1〜18 = Target 1800 全18ステージ
  const [targetStageTab, setTargetStageTab] = useState<"level10" | "summary">("level10");
  const [screen, setScreen] = useState<"home" | "battle" | "result">("home");
  const [battleDeck, setBattleDeck] = useState<GeneratedQuestion[]>([]);
  const [lastResult, setLastResult] = useState<{
    summary: BattleResultSummary;
    previousLxp: number;
    newLxp: number;
    previousTotalLxp: number;
    newTotalLxp: number;
  } | null>(null);

  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [isCodexModalOpen, setIsCodexModalOpen] = useState(false);
  const [codexCategory, setCodexCategory] = useState<CodexCategory>("英検4級");
  const [lastPlayed, setLastPlayed] = useState<{ grade: GradeLevel; stage: number }>({
    grade: "英検4級",
    stage: 1,
  });
  const [isMuted, setIsMuted] = useState(false);
  const [slashTransition, setSlashTransition] = useState(false);
  const [dbSource, setDbSource] = useState<"supabase" | "local">("local");
  const [dbTotalWords, setDbTotalWords] = useState<number>(2617);
  const [isSyncingDb, setIsSyncingDb] = useState<boolean>(false);
  const [dbSyncNotice, setDbSyncNotice] = useState<string | null>(null);
  const [radarBounceKey, setRadarBounceKey] = useState<number>(0);
  const [recentInjectedGains, setRecentInjectedGains] = useState<
    Partial<FiveStats> | undefined
  >(undefined);
  const [injectionNotice, setInjectionNotice] = useState<string | null>(null);
  const [includeListening, setIncludeListening] = useState<boolean>(true);

  // ランキングバトル用ステート
  const [isRankingBattle, setIsRankingBattle] = useState(false);
  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);
  const [isRankingEntryModalOpen, setIsRankingEntryModalOpen] = useState(false);
  const [rankingPlayerName, setRankingPlayerName] = useState(() => getSavedPlayerName());
  const [rankingSubmittedRecord, setRankingSubmittedRecord] = useState<RankingRecord | null>(null);
  const [isSubmittingScore, setIsSubmittingScore] = useState(false);

  // ローカルストレージから復元 ＆ 旧セーブデータのマイグレーション ＆ Supabaseから問題プールを取得
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
        const migratedTotalLxp =
          typeof parsed.totalLxp === "number"
            ? parsed.totalLxp
            : (LEVEL_CUMULATIVE_LXP[parsed.level || 1] || 0) +
              (parsed.exp || 0);
        const migratedUnlockedSkills = Array.isArray(parsed.unlockedSkillHacks)
          ? parsed.unlockedSkillHacks
          : Array.isArray(parsed.activeSkillHacks)
          ? parsed.activeSkillHacks
          : [];
        setProfile({
          ...DEFAULT_PROFILE,
          ...parsed,
          totalLxp: migratedTotalLxp,
          unlockedSkillHacks: migratedUnlockedSkills,
        });
      }
    } catch {
      // ignore storage errors
    }

    try {
      const rawLast = localStorage.getItem("dopaben_last_played");
      if (rawLast) {
        const parsedLast = JSON.parse(rawLast);
        if (parsedLast?.grade && parsedLast?.stage) {
          setLastPlayed(parsedLast);
          setSelectedGrade(parsedLast.grade);
          if (parsedLast.grade === "英検4級") {
            setSelectedEiken4Stage(parsedLast.stage);
          } else if (parsedLast.grade === "ターゲット1800") {
            setSelectedTargetStage(parsedLast.stage);
          }
        }
      }
    } catch {}

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

  const getActiveBattleStageInfo = () => {
    if (selectedGrade === "英検4級") {
      const activeStage =
        EIKEN4_STAGES.find((s) => s.unitNumber === selectedEiken4Stage) ||
        EIKEN4_STAGES[0];
      const poolWords = getActiveVocabPool().eiken4Words;
      const stageWords = poolWords.filter((w) =>
        activeStage.levels.includes(w.track || 1)
      );
      const masteredCount = stageWords.filter(
        (w) => (profile.wordMastery?.[w.id]?.cleared || 0) > 0
      ).length;
      return {
        grade: "英検4級" as GradeLevel,
        stage: activeStage.unitNumber,
        label: `英検４級 ${activeStage.label}`,
        sub: `${activeStage.subLabel}`,
        progress: `制覇 ${masteredCount}/${stageWords.length}語`,
      };
    } else {
      const activeStage =
        TARGET1800_STAGES.find((s) => s.unitNumber === selectedTargetStage) ||
        TARGET1800_STAGES[0];
      const poolWords = getActiveVocabPool().target1800Words;
      const stageWords = poolWords.filter((w) =>
        activeStage.levels.includes(w.track || 1)
      );
      const masteredCount = stageWords.filter(
        (w) => (profile.wordMastery?.[w.id]?.cleared || 0) > 0
      ).length;
      return {
        grade: "ターゲット1800" as GradeLevel,
        stage: activeStage.unitNumber,
        label: `中学英単語1800 ${activeStage.label}`,
        sub: `${activeStage.subLabel}`,
        progress: `制覇 ${masteredCount}/${stageWords.length}語`,
      };
    }
  };

  const handleStartBattle = (
    overrideTrack?: number,
    onlyWeakWords: boolean = false,
    overrideCategory?: CodexCategory
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
        : activeGrade === "英検4級"
        ? selectedEiken4Stage
        : activeGrade === "ターゲット1800"
        ? selectedTargetStage
        : selectedEikenTrack;
    if (overrideTrack !== undefined) {
      setSelectedGrade(activeGrade);
      if (activeGrade === "英検4級") {
        setSelectedEiken4Stage(overrideTrack);
        setEiken4StageTab(overrideTrack <= 12 ? "stage12" : "summary");
      } else if (activeGrade === "ターゲット1800") {
        setSelectedTargetStage(overrideTrack);
        setTargetStageTab(overrideTrack <= 10 ? "level10" : "summary");
      } else {
        setSelectedEikenTrack(overrideTrack);
      }
    }

    // 次回の「続きから」用に直前のステージを記録
    const nextLastPlayed = { grade: activeGrade, stage: targetTrack };
    setLastPlayed(nextLastPlayed);
    try {
      localStorage.setItem("dopaben_last_played", JSON.stringify(nextLastPlayed));
    } catch {}

    const deck = generateBattleDeck(
      activeGrade,
      useHardcore,
      targetTrack,
      profile.wordMastery,
      onlyWeakWords,
      includeListening
    );

    // ★ バトル開始ボタンを押した瞬間に AudioContext をアンロックし、出題される約12語分の Google TTS 音声（単語＋例文）を出題順にプリロード！
    const preloadList: string[] = [];
    deck.forEach((q) => {
      if (q.audioText) preloadList.push(q.audioText);
      if (q.word?.english) preloadList.push(q.word.english);
      if (q.word?.exampleSentenceEn) preloadList.push(q.word.exampleSentenceEn);
    });
    soundEngine.preloadTexts(preloadList);

    setIsCodexModalOpen(false);
    setIsRankingBattle(false);
    setRecentInjectedGains(undefined);
    setInjectionNotice(null);
    triggerSlashTransition(() => {
      setBattleDeck(deck);
      setScreen("battle");
    });
  };

  /**
   * 🏆 全国ランキングバトル開始（英検4級 全20問）
   * 出撃前に入力されたプレイヤー名を記録し、24時間クールダウンをセットして出撃
   */
  const handleStartRankingBattle = (playerName: string) => {
    soundEngine.playStageVictory();
    const finalName = playerName.trim() || "勇者";
    savePlayerName(finalName);
    recordRankingPlayed();
    setRankingPlayerName(finalName);

    const deck = generateRankingDeck(20, includeListening);

    const preloadList: string[] = [];
    deck.forEach((q) => {
      if (q.audioText) preloadList.push(q.audioText);
      if (q.word?.english) preloadList.push(q.word.english);
      if (q.word?.exampleSentenceEn) preloadList.push(q.word.exampleSentenceEn);
    });
    soundEngine.preloadTexts(preloadList);

    setIsRankingBattle(true);
    setRankingSubmittedRecord(null);
    setIsRankingModalOpen(false);
    setIsRankingEntryModalOpen(false);
    setRecentInjectedGains(undefined);
    setInjectionNotice(null);

    triggerSlashTransition(() => {
      setBattleDeck(deck);
      setScreen("battle");
    });
  };

  /**
   * ランキングスコアを手動送信（自動送信失敗時などのフォールバック）
   */
  const handleSubmitRankingScore = async () => {
    if (!lastResult?.summary.rankingStats) return;
    const name = rankingPlayerName.trim() || getSavedPlayerName() || "勇者";
    setIsSubmittingScore(true);
    soundEngine.playTap();

    const stats = lastResult.summary.rankingStats;
    const res = await submitRankingScore({
      playerName: name,
      score: stats.score,
      totalQuestions: stats.totalQuestions,
      timeMs: stats.timeMs,
      gamePoints: stats.gamePoints,
      maxCombo: stats.maxCombo,
      course: "eiken4",
      subject: "english",
    });

    setIsSubmittingScore(false);
    if (res.success && res.record) {
      soundEngine.playStageVictory();
      setRankingSubmittedRecord(res.record);
    }
  };

  /**
   * バトル終了時：
   * 即時自動レベルアップやステータス自動加算は行わず、
   * 「所持LXP（消費可能ストック）」と「累積LXP（総学習経験値）」に目に見える形で貯める！
   */
  const handleCompleteBattle = (summary: BattleResultSummary) => {
    const prevLxp = profile.exp;
    const prevTotalLxp = profile.totalLxp ?? profile.exp;
    const nextLxp = prevLxp + summary.earnedExp;
    const nextTotalLxp = prevTotalLxp + summary.earnedExp;

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
      exp: nextLxp,
      totalLxp: nextTotalLxp,
      totalBattles: profile.totalBattles + 1,
      totalWordsCleared: profile.totalWordsCleared + summary.wordsCleared,
      totalRevengeJackpots:
        profile.totalRevengeJackpots + summary.revengeCount,
      maxCombo: Math.max(profile.maxCombo, summary.maxCombo),
      wordMastery: updatedMastery,
    };

    saveProfile(nextProfile);
    setLastResult({
      summary,
      previousLxp: prevLxp,
      newLxp: nextLxp,
      previousTotalLxp: prevTotalLxp,
      newTotalLxp: nextTotalLxp,
    });

    // ランキングバトルの場合、事前に入力されたプレイヤー名で自動スコア登録！
    if (isRankingBattle && summary.rankingStats) {
      const name = rankingPlayerName.trim() || getSavedPlayerName() || "勇者";
      setIsSubmittingScore(true);
      submitRankingScore({
        playerName: name,
        score: summary.rankingStats.score,
        totalQuestions: summary.rankingStats.totalQuestions,
        timeMs: summary.rankingStats.timeMs,
        gamePoints: summary.rankingStats.gamePoints,
        maxCombo: summary.rankingStats.maxCombo,
        course: "eiken4",
        subject: "english",
      }).then((res) => {
        setIsSubmittingScore(false);
        if (res.success && res.record) {
          setRankingSubmittedRecord(res.record);
        }
      });
    }

    triggerSlashTransition(() => {
      setScreen("result");
      soundEngine.playStageVictory();
      try {
        confetti({
          particleCount: 65,
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

  /**
   * 累積LXPが次のレベル条件に達した時、拠点（トップページ）で進化を発動する
   */
  const handleTriggerLevelEvolution = () => {
    const totalLxp = profile.totalLxp ?? profile.exp;
    if (profile.level >= 10) return;
    const reqTotal = getRequiredCumulativeLxpForNextLevel(profile.level);
    if (totalLxp < reqTotal) return;

    const nextLevel = profile.level + 1;
    const stageInfo = EVOLUTION_STAGES[nextLevel - 1];
    const newlyUnlockableSkill = SKILL_HACKS.find(
      (s) => s.unlockLevel === nextLevel
    );

    saveProfile({
      ...profile,
      level: nextLevel,
    });

    soundEngine.playEvolutionFanfare();
    setInjectionNotice(
      newlyUnlockableSkill
        ? `🎉 Lv.${nextLevel}『${
            profile.gender === "boy" ? stageInfo.titleBoy : stageInfo.titleGirl
          }』へ進化！新スキル『${newlyUnlockableSkill.name}』の習得権が解禁されました！`
        : `🎉 Lv.${nextLevel}『${
            profile.gender === "boy" ? stageInfo.titleBoy : stageInfo.titleGirl
          }』へ進化しました！！`
    );

    try {
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.45 },
        colors: ["#FACC15", "#10B981", "#EF4444", "#FFFFFF"],
      });
    } catch {
      // ignore
    }
  };

  /**
   * 拠点（トップページ）で所持LXPを消費し、指定した五角形ステータスを +1 強化する
   */
  const handleInjectSingleStat = (statKey: keyof FiveStats) => {
    const currentVal = profile.stats[statKey];
    if (currentVal >= 100) return;
    const cost = getStatUpgradeLxpCost(currentVal);
    if (profile.exp < cost) return;

    const nextStats: FiveStats = {
      ...profile.stats,
      [statKey]: Math.min(100, currentVal + 1),
    };
    const nextExp = profile.exp - cost;

    saveProfile({
      ...profile,
      exp: nextExp,
      stats: nextStats,
    });

    const statLabelMap: Record<keyof FiveStats, string> = {
      vocab: "語彙",
      speed: "瞬発",
      grammar: "構築",
      listening: "聴覚",
      guts: "度胸",
    };

    setRecentInjectedGains((prev) => ({
      ...prev,
      [statKey]: (prev?.[statKey] || 0) + 1,
    }));
    setRadarBounceKey((k) => k + 1);
    setInjectionNotice(
      `⚡ ${cost.toLocaleString()} LXP を注入！【${statLabelMap[statKey]}】が ${
        currentVal + 1
      } に成長！`
    );
    soundEngine.playWeakHit(3, false);
  };

  /**
   * 拠点（トップページ）で貯まった所持LXPを一括注入し、五角形ステータスをまとめて急成長させる
   */
  const handleBatchInjectLxp = () => {
    let remainingLxp = profile.exp;
    const tempStats: FiveStats = { ...profile.stats };
    const gains: Partial<FiveStats> = {};
    let totalPointsAdded = 0;
    let totalSpent = 0;

    const keys: (keyof FiveStats)[] = [
      "vocab",
      "speed",
      "grammar",
      "listening",
      "guts",
    ];

    // 1回の注入で最大25ポイントまで、最も低いステータスから優先的にバランスよく引き上げる
    while (totalPointsAdded < 25) {
      const upgradeable = keys
        .filter((k) => tempStats[k] < 100)
        .map((k) => ({
          key: k,
          val: tempStats[k],
          cost: getStatUpgradeLxpCost(tempStats[k]),
        }))
        .filter((item) => item.cost > 0 && remainingLxp >= item.cost)
        .sort((a, b) => a.val - b.val || a.cost - b.cost);

      if (upgradeable.length === 0) break;

      const target = upgradeable[0];
      remainingLxp -= target.cost;
      totalSpent += target.cost;
      tempStats[target.key] += 1;
      gains[target.key] = (gains[target.key] || 0) + 1;
      totalPointsAdded += 1;
    }

    if (totalPointsAdded === 0) return;

    saveProfile({
      ...profile,
      exp: remainingLxp,
      stats: tempStats,
    });

    setRecentInjectedGains(gains);
    setRadarBounceKey((k) => k + 1);
    setInjectionNotice(
      `⚡ ${totalSpent.toLocaleString()} LXP を一括注入！！五角形ステータスが計 +${totalPointsAdded} PT 急成長！！`
    );
    soundEngine.playEvolutionFanfare();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.55 },
        colors: ["#FACC15", "#10B981", "#EF4444", "#FFFFFF"],
      });
    } catch {
      // ignore
    }
  };

  /**
   * 特定のちから（語彙・瞬発・構築・聴覚・度胸）に所持LXPを全振り注入する
   */
  const handleFocusInjectStat = (statKey: keyof FiveStats) => {
    let remainingLxp = profile.exp;
    const tempStats: FiveStats = { ...profile.stats };
    let pointsAdded = 0;
    let totalSpent = 0;

    const statLabelMap: Record<keyof FiveStats, string> = {
      vocab: "語彙力",
      speed: "瞬発力",
      grammar: "構築力",
      listening: "聴覚力",
      guts: "度胸",
    };

    while (pointsAdded < 30 && tempStats[statKey] < 100) {
      const cost = getStatUpgradeLxpCost(tempStats[statKey]);
      if (cost <= 0 || remainingLxp < cost) break;
      remainingLxp -= cost;
      totalSpent += cost;
      tempStats[statKey] += 1;
      pointsAdded += 1;
    }

    if (pointsAdded === 0) return;

    saveProfile({
      ...profile,
      exp: remainingLxp,
      stats: tempStats,
    });

    setRecentInjectedGains({ [statKey]: pointsAdded });
    setRadarBounceKey((k) => k + 1);
    setInjectionNotice(
      `🔥 ${totalSpent.toLocaleString()} LXP を全振り注入！【${statLabelMap[statKey]}】が +${pointsAdded} PT (${tempStats[statKey]}) へ急上昇！`
    );
    soundEngine.playEvolutionFanfare();
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.55 },
        colors: ["#FACC15", "#EF4444", "#FFFFFF"],
      });
    } catch {
      // ignore
    }
  };

  /**
   * 所持LXPを消費して特権スキルを習得する
   */
  const handleUnlockSkill = (skillId: SkillHackId, cost: number) => {
    if (profile.exp < cost) return;
    const unlocked = profile.unlockedSkillHacks || [];
    if (unlocked.includes(skillId)) return;

    const nextUnlocked = [...unlocked, skillId];
    const nextActive = Array.from(new Set([...profile.activeSkillHacks, skillId]));
    const skillDef = SKILL_HACKS.find((s) => s.id === skillId);

    saveProfile({
      ...profile,
      exp: profile.exp - cost,
      unlockedSkillHacks: nextUnlocked,
      activeSkillHacks: nextActive,
    });

    if (skillDef) {
      setInjectionNotice(
        `🔓 ${cost.toLocaleString()} LXP を消費して特権スキル『${skillDef.name}』を習得＆ONにしました！`
      );
    }
  };

  const handleToggleSkill = (skillId: SkillHackId) => {
    const unlocked = profile.unlockedSkillHacks || [];
    if (!unlocked.includes(skillId)) return;
    const exists = profile.activeSkillHacks.includes(skillId);
    const nextSkills = exists
      ? profile.activeSkillHacks.filter((id) => id !== skillId)
      : [...profile.activeSkillHacks, skillId];
    saveProfile({ ...profile, activeSkillHacks: nextSkills });
  };

  const handleInstantLevelChange = (newLevel: number) => {
    const clamped = Math.max(1, Math.min(10, newLevel));
    const minTotalLxp = LEVEL_CUMULATIVE_LXP[clamped] || 0;
    const autoUnlockedSkills = SKILL_HACKS.filter(
      (s) => s.unlockLevel <= clamped
    ).map((s) => s.id);
    saveProfile({
      ...profile,
      level: clamped,
      exp: clamped === 1 ? 0 : profile.exp,
      totalLxp: clamped === 1 ? 0 : Math.max(profile.totalLxp || 0, minTotalLxp),
      unlockedSkillHacks: autoUnlockedSkills,
      activeSkillHacks: autoUnlockedSkills,
    });
  };

  const handleAddTestLxp = (amount: number) => {
    saveProfile({
      ...profile,
      exp: profile.exp + amount,
      totalLxp: (profile.totalLxp ?? profile.exp) + amount,
    });
  };

  const currentStageInfo =
    EVOLUTION_STAGES[Math.min(10, Math.max(1, profile.level)) - 1];
  const totalLxp = profile.totalLxp ?? profile.exp;
  const currentLevelBaseLxp = LEVEL_CUMULATIVE_LXP[profile.level] || 0;
  const nextLevelTargetLxp = getRequiredCumulativeLxpForNextLevel(profile.level);
  const levelSpanLxp = Math.max(1, nextLevelTargetLxp - currentLevelBaseLxp);
  const levelProgressLxp = Math.max(0, totalLxp - currentLevelBaseLxp);
  const cumulativeLxpPercent =
    profile.level >= 10
      ? 100
      : Math.min(100, Math.round((levelProgressLxp / levelSpanLxp) * 100));
  const canEvolveLevel =
    profile.level < 10 && totalLxp >= nextLevelTargetLxp;

  // 現在の所持LXPで五角形ステータスを何ポイント強化できるか試算
  const affordableStatPoints = (() => {
    let rem = profile.exp;
    const temp = { ...profile.stats };
    let pts = 0;
    const keys: (keyof FiveStats)[] = [
      "vocab",
      "speed",
      "grammar",
      "listening",
      "guts",
    ];
    while (pts < 25) {
      const avail = keys
        .filter((k) => temp[k] < 100)
        .map((k) => ({ key: k, val: temp[k], cost: getStatUpgradeLxpCost(temp[k]) }))
        .filter((x) => x.cost > 0 && rem >= x.cost)
        .sort((a, b) => a.val - b.val || a.cost - b.cost);
      if (avail.length === 0) break;
      rem -= avail[0].cost;
      temp[avail[0].key] += 1;
      pts += 1;
    }
    return pts;
  })();

  const isHardcoreUnlocked = (profile.unlockedSkillHacks || []).includes(
    "hardcore_challenge"
  );
  const isHardcoreActive =
    profile.level >= 5 &&
    isHardcoreUnlocked &&
    profile.activeSkillHacks.includes("hardcore_challenge");

  const isGirl = profile.gender === "girl";

  return (
    <div
      className={`min-h-screen text-white relative overflow-x-clip touch-pan-y transition-colors duration-300 ${
        isGirl ? "bg-[#13091B] bg-halftone-girl" : "bg-[#0B0D12] bg-halftone"
      }`}
    >
      {/* 斜めスラッシュ画面遷移エフェクト */}
      <AnimatePresence>
        {slashTransition && (
          <motion.div
            initial={{ x: "-120%", skewX: -18 }}
            animate={{ x: "0%", skewX: -18 }}
            exit={{ x: "120%", skewX: -18 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={`fixed inset-0 z-50 border-x-8 border-white flex items-center justify-center pointer-events-none ${
              isGirl ? "bg-[#F43F5E]" : "bg-[#FACC15]"
            }`}
          >
            <div className={`font-black text-3xl px-8 py-3 -skew-x-12 border-4 border-white tracking-widest ${
              isGirl
                ? "bg-[#13091B] text-[#FB7185] shadow-[6px_6px_0_#2DD4BF]"
                : "bg-[#0B0D12] text-[#FACC15] shadow-[6px_6px_0_#10B981]"
            }`}>
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
          isRankingBattle={isRankingBattle}
          onAbort={() =>
            triggerSlashTransition(() => {
              setScreen("home");
            })
          }
        />
      )}

      {/* === 2. リザルト画面（LXP獲得＆ストック演出） === */}
      {screen === "result" && lastResult && (
        <div className={`min-h-screen w-full max-w-md mx-auto flex flex-col justify-between p-4 ${
          isGirl ? "bg-[#13091B] bg-halftone-girl" : "bg-[#0B0D12] bg-halftone"
        }`}>
          <div className="space-y-4">
            <motion.div
              initial={{ scale: 0.85, rotate: -3 }}
              animate={{ scale: 1, rotate: -1 }}
              className={`border-2 border-white p-3.5 text-center ${
                isGirl
                  ? "bg-[#F43F5E] shadow-[4px_4px_0_#2DD4BF]"
                  : "bg-[#10B981] shadow-p5-yellow clip-p5-banner"
              }`}
            >
              <div className="text-xs font-black text-[#0B0D12] tracking-widest">
                LEARNING EXPERIENCE HARVEST // 学習経験値ストック完了
              </div>
              <h1 className="text-3xl font-black italic tracking-tight text-white drop-shadow-[2px_2px_0_#0B0D12]">
                +{lastResult.summary.earnedExp.toLocaleString()} LXP GET!!
              </h1>
            </motion.div>

            {/* 所持LXP（消費可能ストック）＆ 累積LXP（総学習量）カード */}
            <div className={`border-2 border-white p-4 space-y-3 ${
              isGirl
                ? "bg-[#1D1229] shadow-[4px_4px_0_#F43F5E]"
                : "bg-[#131720] shadow-p5-yellow"
            }`}>
              <div className="flex items-center gap-3.5">
                <div className="bg-[#0B0D12] border-2 border-[#FACC15] p-1 shrink-0">
                  <PixelCharacter
                    gender={profile.gender}
                    stage={profile.level}
                    stats={profile.stats}
                    loadout={profile.characterLoadout}
                    size={84}
                    mood="happy"
                  />
                </div>

                <div className="flex-1 space-y-2">
                  {/* 所持LXPストック */}
                  <div className="bg-[#0B0D12] border border-[#FACC15] p-2">
                    <div className="flex items-center justify-between text-[10px] font-black text-[#94A3B8]">
                      <span>💰 所持LXP（ステータス・スキル注入用）</span>
                      <span className="text-[#10B981]">
                        +{lastResult.summary.earnedExp.toLocaleString()} LXP
                      </span>
                    </div>
                    <div className="text-xl font-black text-[#FACC15] tracking-tight mt-0.5">
                      {profile.exp.toLocaleString()}{" "}
                      <span className="text-xs text-white">LXP ストック中</span>
                    </div>
                  </div>

                  {/* 累積LXP＆次レベルへの進行度 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-black">
                      <span className="text-[#94A3B8]">
                        📈 累積LXP: {totalLxp.toLocaleString()} LXP
                      </span>
                      <span className="text-[#10B981]">
                        {profile.level >= 10
                          ? "MAX Lv.10"
                          : canEvolveLevel
                          ? `🎉 Lv.${profile.level + 1} 進化可能！`
                          : `次Lvまで あと${Math.max(
                              0,
                              nextLevelTargetLxp - totalLxp
                            ).toLocaleString()} LXP`}
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-[#0B0D12] border border-white -skew-x-12 p-0.5">
                      <motion.div
                        className="h-full bg-[#10B981]"
                        initial={{ width: 0 }}
                        animate={{ width: `${cumulativeLxpPercent}%` }}
                        transition={{ duration: 0.45 }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 拠点でのLXP注入・進化の案内バナー */}
              {(canEvolveLevel || affordableStatPoints > 0) && (
                <div className="bg-[#0B0D12] border-2 border-[#FACC15] p-2.5 flex items-center justify-between gap-2">
                  <div className="text-xs font-black text-[#FACC15] leading-snug">
                    {canEvolveLevel
                      ? `🎉 累積LXP達成！拠点で Lv.${
                          profile.level + 1
                        } へ進化＆新スキル枠を解放できます！`
                      : `⚡ 貯まった所持LXPで五角形ステータスを +${affordableStatPoints} PT 注入強化できます！`}
                  </div>
                </div>
              )}

              {/* バトル戦績ミニサマリー */}
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
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

            {/* 🏆 ランキングバトル結果＆名前登録セクション */}
            {lastResult.summary.rankingStats && (
              <div className="bg-gradient-to-b from-amber-950/80 to-slate-900 border-2 border-amber-400 p-4 space-y-3.5 shadow-xl rounded-2xl">
                <div className="flex items-center justify-between border-b border-amber-500/40 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🏆</span>
                    <div>
                      <div className="font-black text-sm text-white">
                        全国ランキングバトル 結果
                      </div>
                      <div className="text-[10px] text-amber-300 font-bold">
                        英検4級 全20問 スピードアタック
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950">
                    FINISH!
                  </span>
                </div>

                {/* スコア概要 */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-950/80 border border-amber-500/30 p-2 rounded-xl">
                    <div className="text-[10px] text-slate-400 font-bold">正解数</div>
                    <div className="text-lg font-black text-emerald-400 font-mono">
                      {lastResult.summary.rankingStats.score}/{lastResult.summary.rankingStats.totalQuestions}
                    </div>
                  </div>
                  <div className="bg-slate-950/80 border border-amber-500/30 p-2 rounded-xl">
                    <div className="text-[10px] text-slate-400 font-bold">クリアタイム</div>
                    <div className="text-lg font-black text-cyan-300 font-mono">
                      {(lastResult.summary.rankingStats.timeMs / 1000).toFixed(2)}s
                    </div>
                  </div>
                  <div className="bg-slate-950/80 border border-amber-500/30 p-2 rounded-xl">
                    <div className="text-[10px] text-slate-400 font-bold">総合スコア</div>
                    <div className="text-lg font-black text-amber-400 font-mono">
                      {lastResult.summary.rankingStats.gamePoints.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* ランキング登録状況表示 */}
                {isSubmittingScore ? (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/40 rounded-xl space-y-1.5 text-center animate-pulse">
                    <div className="text-xs font-black text-amber-300 flex items-center justify-center gap-1.5">
                      <span>🚀</span>
                      <span>「{rankingPlayerName}」のスコアを集計＆ランキング登録中...</span>
                    </div>
                  </div>
                ) : rankingSubmittedRecord ? (
                  <div className="p-3 bg-emerald-950/70 border border-emerald-400/80 rounded-xl space-y-2 text-center">
                    <div className="text-xs font-black text-emerald-300 flex items-center justify-center gap-1.5">
                      <span>🎉</span>
                      <span>「{rankingSubmittedRecord.playerName}」で全国ランキング登録完了！</span>
                    </div>
                    <button
                      onClick={() => setIsRankingModalOpen(true)}
                      className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md inline-flex items-center gap-1.5 active:scale-95 transition"
                    >
                      <Trophy className="w-3.5 h-3.5" />
                      <span>全国ランキング一覧を見る</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-200 block">
                        ランキング登録名
                      </label>
                      <button
                        onClick={() => setIsRankingModalOpen(true)}
                        className="text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <Trophy className="w-3 h-3" />
                        <span>ランキングを見る</span>
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={rankingPlayerName}
                        onChange={(e) => setRankingPlayerName(e.target.value)}
                        placeholder="名前（例: たろう / 勇者）"
                        maxLength={15}
                        className="flex-1 bg-slate-950 border border-amber-400/60 px-3 py-2 rounded-xl text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                      <button
                        onClick={handleSubmitRankingScore}
                        disabled={isSubmittingScore}
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md active:scale-95 transition shrink-0 flex items-center gap-1.5"
                      >
                        {isSubmittingScore ? "送信中..." : "ランキング送信 🚀"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

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
              onClick={() =>
                triggerSlashTransition(() => {
                  setScreen("home");
                })
              }
              className="w-full py-3.5 bg-[#FACC15] hover:brightness-110 text-[#0B0D12] font-black text-base border-2 border-white -skew-x-6 shadow-[4px_4px_0_#10B981] flex items-center justify-center gap-2 active:scale-95 transition"
            >
              <Zap className="w-5 h-5 fill-[#0B0D12]" />
              拠点（トップページ）でLXPを注入・強化する
            </button>
            {lastResult.summary.rankingStats ? (
              <button
                onClick={() => {
                  soundEngine.playTap();
                  setIsRankingEntryModalOpen(true);
                }}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-base border-2 border-white -skew-x-6 shadow-[4px_4px_0_#FACC15] flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <Trophy className="w-5 h-5 fill-slate-950" />
                ランキングバトル状況を確認 (24H制限)
              </button>
            ) : (
              <button
                onClick={() => handleStartBattle()}
                className="w-full py-3.5 bg-[#EF4444] hover:brightness-110 text-white font-black text-base border-2 border-white clip-p5-btn shadow-p5-yellow flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <Flame className="w-5 h-5 fill-[#FACC15] text-[#FACC15]" />
                このままもう1戦突入してLXPを貯める！
              </button>
            )}
          </div>
        </div>
      )}

      {/* === 3. ホーム拠点（アジト）画面（大迫力キャラクター ＆ 洗練ワンビュー） === */}
      {screen === "home" && (() => {
        const stageBattleInfo = getActiveBattleStageInfo();
        const isResume =
          selectedGrade === lastPlayed.grade &&
          (selectedGrade === "英検4級"
            ? selectedEiken4Stage === lastPlayed.stage
            : selectedTargetStage === lastPlayed.stage);

        return (
          <div
            className={`min-h-screen w-full max-w-md mx-auto flex flex-col justify-start p-3 sm:p-4 space-y-3 touch-pan-y transition-colors duration-300 select-none ${
              isGirl
                ? "bg-[#13091B] bg-halftone-girl"
                : "bg-[#0B0D12] bg-halftone"
            }`}
          >
            {/* 0. DopaBen メインポータルへ戻るナビゲーションバー */}
            <div className="flex items-center justify-between pb-1">
              <Link
                href="/"
                className="px-2.5 py-1 rounded-lg bg-[#1E293B] hover:bg-[#334155] border border-[#475569] text-[#94A3B8] hover:text-white text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>教科選択へ戻る</span>
              </Link>

              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#FACC15]/20 text-[#FACC15] border border-[#FACC15]/40">
                  英語編 DopaEng
                </span>
              </div>
            </div>

            {/* 1. 大迫力キャラクターカード（画面の約20%・育成の主役！タップでステータス画面） */}
            <div
              onClick={() => {
                soundEngine.playTap();
                setIsStatusModalOpen(true);
              }}
              className={`border-2 border-white p-3.5 cursor-pointer active:scale-[0.99] transition relative overflow-hidden select-none group ${
                isGirl
                  ? "bg-gradient-to-br from-[#1D1229] via-[#2A173B] to-[#13091B] shadow-[4px_4px_0_#F43F5E] hover:border-[#FB7185]"
                  : "bg-gradient-to-br from-[#131720] via-[#1a202c] to-[#0B0D12] shadow-p5-yellow hover:border-[#FACC15]"
              }`}
            >
              {/* 背景の幾何学スライス装飾 */}
              <div className={`absolute -top-8 -right-8 w-28 h-28 rotate-45 pointer-events-none ${
                isGirl ? "bg-[#F43F5E]/10" : "bg-[#FACC15]/10"
              }`} />

              <div className="flex items-center gap-3.5 relative z-10">
                {/* 大迫力ピクセルキャラクター（size 96）＋ 呼吸オーラ */}
                <div className={`relative border-2 border-white p-1.5 shrink-0 group-hover:scale-105 transition ${
                  isGirl
                    ? "bg-[#13091B] shadow-[4px_4px_0_#F43F5E]"
                    : "bg-[#0B0D12] shadow-[4px_4px_0_#FACC15]"
                }`}>
                  <div className={`pointer-events-none absolute -inset-1 rounded animate-dopa-aura ${
                    isGirl
                      ? "bg-gradient-to-r from-[#F43F5E]/30 to-[#2DD4BF]/30"
                      : "bg-gradient-to-r from-[#FACC15]/30 to-[#10B981]/30"
                  }`} />

                  <PixelCharacter
                    gender={profile.gender}
                    stage={profile.level}
                    stats={profile.stats}
                    loadout={profile.characterLoadout}
                    size={96}
                    mood={canEvolveLevel ? "happy" : "idle"}
                    animateFrames={true}
                  />
                </div>

                {/* 右側：Lv.X(アニメーション付き)、称号、累積LXP、NEXT EVOLUTIONハイテクゲージ */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      {/* アニメーションでゴールドまたはローズに輝く Lv.X */}
                      <span className={`text-3xl sm:text-4xl font-black italic tracking-tight ${
                        isGirl
                          ? "text-[#FB7185] animate-level-badge-girl"
                          : "text-[#FACC15] animate-level-badge"
                      }`}>
                        Lv.{profile.level}
                      </span>

                      {/* 大型の目立つ「着せ替え・図鑑」ボタン */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          soundEngine.playTap();
                          setIsCustomizeModalOpen(true);
                        }}
                        className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl active:scale-95 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg transition duration-200 border ${
                          isGirl
                            ? "bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-400 hover:to-rose-400 text-white shadow-pink-500/35 border-pink-300/50"
                            : "bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 shadow-amber-400/40 border-yellow-200/60"
                        }`}
                      >
                        <span className="text-base sm:text-lg">🎨</span>
                        <span>着せ替え・図鑑</span>
                      </button>
                    </div>

                    {/* 称号表示（意味不明なDopaEng勇者バッジは撤廃し、称号をスッキリ強調） */}
                    {(() => {
                      const evo = getCharacterEvolutionTitle(
                        profile.gender,
                        profile.level,
                        profile.stats,
                        profile.characterLoadout
                      );
                      return (
                        <div className="flex items-center justify-between gap-1.5 mt-1.5 flex-wrap">
                          <span className="text-sm sm:text-base font-black text-white truncate drop-shadow-md tracking-wide">
                            {evo.title}
                          </span>
                          <span className="text-[11px] text-[#94A3B8] font-bold">
                            累積: <span className="text-white font-black"><CountUpNumber value={totalLxp} /></span> LXP
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* 立体的＆派手なアーケード風 NEXT EVOLUTION ゲージ */}
                  <div className={`p-2.5 rounded-xl border space-y-2 shadow-xl ${
                    isGirl
                      ? "bg-gradient-to-b from-[#1c0d27]/95 to-[#12081a]/95 border-[#542d75]/80 shadow-[0_4px_16px_rgba(244,63,94,0.15)]"
                      : "bg-gradient-to-b from-[#131b28]/95 to-[#0b1018]/95 border-[#2c3d59]/80 shadow-[0_4px_16px_rgba(250,204,21,0.15)]"
                  }`}>
                    {/* ゲージヘッダー */}
                    <div className="flex justify-between items-center text-[10px] sm:text-xs font-black">
                      <span className="flex items-center gap-1.5 tracking-wider">
                        <Zap className={`w-3.5 h-3.5 ${isGirl ? "text-[#FB7185] fill-[#FB7185]" : "text-[#FACC15] fill-[#FACC15]"} animate-pulse`} />
                        <span className="text-slate-300">NEXT EVOLUTION</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] sm:text-xs shadow-inner ${
                        canEvolveLevel
                          ? isGirl
                            ? "bg-[#2DD4BF] text-slate-950 font-black animate-bounce"
                            : "bg-[#10B981] text-slate-950 font-black animate-bounce"
                          : isGirl
                          ? "bg-pink-950/80 text-pink-300 border border-pink-700/50"
                          : "bg-amber-950/80 text-amber-300 border border-amber-700/50"
                      }`}>
                        {profile.level >= 10
                          ? "MAX LEVEL"
                          : canEvolveLevel
                          ? "🎉 進化可能！"
                          : `${Math.min(100, Math.round(cumulativeLxpPercent))}%`}
                      </span>
                    </div>

                    {/* 立体クリスタルシリンダー・エネルギーゲージ（3Dハイライト・セグメント目盛り付き） */}
                    <div className="relative w-full">
                      <div className="relative w-full h-5 sm:h-6 rounded-lg bg-slate-950 border-2 border-slate-700/90 shadow-[inset_0_3px_6px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.15)] overflow-hidden p-0.5">
                        {/* 背景のハイテク目盛りスリット（10%刻み） */}
                        <div className="absolute inset-0 flex justify-between pointer-events-none px-1 z-10 opacity-30">
                          {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="w-[1px] h-full bg-white/60" />
                          ))}
                        </div>

                        {/* 充填されるエネルギーバー本体 */}
                        <motion.div
                          className={`h-full relative rounded-md overflow-hidden ${
                            canEvolveLevel
                              ? isGirl
                                ? "bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 shadow-[0_0_16px_rgba(45,212,191,0.95)]"
                                : "bg-gradient-to-r from-emerald-400 via-green-300 to-amber-300 shadow-[0_0_16px_rgba(16,185,129,0.95)]"
                              : isGirl
                              ? "bg-gradient-to-r from-[#F43F5E] via-[#D946EF] to-[#06B6D4] shadow-[0_0_14px_rgba(244,63,94,0.7)]"
                              : "bg-gradient-to-r from-[#059669] via-[#0284C7] to-[#FACC15] shadow-[0_0_14px_rgba(250,204,21,0.7)]"
                          }`}
                          initial={{ width: "0%" }}
                          animate={{ width: `${cumulativeLxpPercent}%` }}
                          transition={{ duration: 1.1, ease: "easeOut" }}
                        >
                          {/* 3Dガラスシリンダー反射光（上部40%に白いハイライトグロスを走らせる） */}
                          <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-white/60 via-white/15 to-transparent pointer-events-none" />
                          {/* 下部シャドウ */}
                          <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

                          {/* 先端のエネルギーパルスヘッド */}
                          <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-white shadow-[0_0_8px_#ffffff] rounded-r-md pointer-events-none animate-pulse" />

                          {/* 内部を駆け抜ける光沢シマー */}
                          <span className="pointer-events-none absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-white/80 to-transparent animate-gauge-glint" />
                        </motion.div>
                      </div>

                      {/* ゲージ直下の進行数値テキスト */}
                      <div className="flex justify-between items-center text-[9px] sm:text-[10px] text-slate-400 font-bold mt-1 px-0.5">
                        <span>Lv.{profile.level}</span>
                        <span className="font-mono text-slate-300">
                          {profile.level >= 10 ? (
                            "限界突破中"
                          ) : (
                            <>
                              <CountUpNumber value={totalLxp} /> / {nextLevelTargetLxp.toLocaleString()} LXP
                            </>
                          )}
                        </span>
                        <span>{profile.level >= 10 ? "MAX" : `Lv.${profile.level + 1}`}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {canEvolveLevel && (
                <div className="mt-2.5 pt-2 border-t border-white/25">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTriggerLevelEvolution();
                    }}
                    className={`w-full py-1.5 px-3 hover:brightness-110 text-white font-black text-xs border-2 border-white -skew-x-6 flex items-center justify-center gap-1.5 shadow-[3px_3px_0_#0B0D12] animate-pulse active:scale-95 transition ${
                      isGirl ? "bg-[#F43F5E]" : "bg-[#10B981]"
                    }`}
                  >
                    <Sparkles className="w-4 h-4 fill-white" />
                    <span>🎉 累積LXP達成！タップして Lv.{profile.level + 1} へ進化する！</span>
                  </button>
                </div>
              )}
            </div>

            {/* 3. ステージ選択（「英検４級」 vs 「中学英単語1800」） */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* 英検４級 タブ（選択時はゴールド・グレースイープ ＆ ネオン呼吸） */}
              <button
                type="button"
                onClick={() => {
                  soundEngine.playTap();
                  setSelectedGrade("英検4級");
                }}
                className={`relative overflow-hidden py-2.5 px-3 font-black text-center border-2 -skew-x-6 transition flex items-center justify-center gap-2 ${
                  selectedGrade === "英検4級"
                    ? isGirl
                      ? "bg-[#F43F5E] text-white border-white shadow-[4px_4px_0_#2DD4BF] animate-pulse-glow-rose -translate-y-0.5"
                      : "bg-[#FACC15] text-[#0B0D12] border-white shadow-[4px_4px_0_#10B981] animate-pulse-glow-yellow -translate-y-0.5"
                    : isGirl
                    ? "bg-[#1D1229] text-[#C4B5FD] border-[#3D2752] hover:border-[#F43F5E] hover:text-white"
                    : "bg-[#131720] text-[#94A3B8] border-[#262D3D] hover:border-[#FACC15] hover:text-white"
                }`}
              >
                {selectedGrade === "英検4級" && (
                  <span className="pointer-events-none absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-glint-sweep" />
                )}
                <BookOpen className="w-4 h-4 shrink-0 relative z-10" />
                <span className="text-xs sm:text-sm tracking-wide relative z-10">英検４級</span>
                {selectedGrade === "英検4級" && (
                  <span className={`text-[10px] font-black relative z-10 animate-ping ${isGirl ? "text-white" : "text-[#0B0D12]"}`}>✦</span>
                )}
              </button>

              {/* 中学英単語1800 タブ（選択時はゴールド・グレースイープ ＆ ネオン呼吸） */}
              <button
                type="button"
                onClick={() => {
                  soundEngine.playTap();
                  setSelectedGrade("ターゲット1800");
                }}
                className={`relative overflow-hidden py-2.5 px-3 font-black text-center border-2 -skew-x-6 transition flex items-center justify-center gap-2 ${
                  selectedGrade === "ターゲット1800"
                    ? isGirl
                      ? "bg-[#F43F5E] text-white border-white shadow-[4px_4px_0_#2DD4BF] animate-pulse-glow-rose -translate-y-0.5"
                      : "bg-[#FACC15] text-[#0B0D12] border-white shadow-[4px_4px_0_#10B981] animate-pulse-glow-yellow -translate-y-0.5"
                    : isGirl
                    ? "bg-[#1D1229] text-[#C4B5FD] border-[#3D2752] hover:border-[#F43F5E] hover:text-white"
                    : "bg-[#131720] text-[#94A3B8] border-[#262D3D] hover:border-[#FACC15] hover:text-white"
                }`}
              >
                {selectedGrade === "ターゲット1800" && (
                  <span className="pointer-events-none absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-glint-sweep" />
                )}
                <Trophy className="w-4 h-4 shrink-0 relative z-10" />
                <span className="text-xs sm:text-sm tracking-wide relative z-10">中学英単語1800</span>
                {selectedGrade === "ターゲット1800" && (
                  <span className={`text-[10px] font-black relative z-10 animate-ping ${isGirl ? "text-white" : "text-[#0B0D12]"}`}>✦</span>
                )}
              </button>
            </div>

            {/* 4. リスニング問題 ON/OFF（「出撃」カードの直上に移動 ＆ 音波エフェクトで目立たせる！） */}
            <div className={`border-2 p-2 flex items-center justify-between transition-colors ${
              includeListening
                ? isGirl
                  ? "bg-[#1D1229] border-[#F43F5E] shadow-[0_0_12px_rgba(244,63,94,0.35)]"
                  : "bg-[#131720] border-[#FACC15] shadow-[0_0_12px_rgba(250,204,21,0.35)]"
                : isGirl
                ? "bg-[#1D1229]/80 border-[#3D2752]"
                : "bg-[#131720]/80 border-[#262D3D]"
            }`}>
              <div className="flex items-center gap-2">
                <div className={`p-1 border ${
                  includeListening
                    ? isGirl
                      ? "bg-[#F43F5E] text-white border-white animate-audio-wave shadow-[0_0_8px_#F43F5E]"
                      : "bg-[#FACC15] text-[#0B0D12] border-white animate-audio-wave shadow-[0_0_8px_#FACC15]"
                    : isGirl
                    ? "bg-[#13091B] text-[#94A3B8] border-[#3D2752]"
                    : "bg-[#0B0D12] text-[#94A3B8] border-[#262D3D]"
                }`}>
                  <Headphones className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-white">リスニング問題</span>
                    {includeListening && (
                      <span className={`text-[8px] font-black px-1 py-0.2 -skew-x-6 ${
                        isGirl ? "bg-[#F43F5E] text-white" : "bg-[#FACC15] text-[#0B0D12]"
                      }`}>
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="text-[9px] text-[#94A3B8] font-bold">
                    {includeListening ? "全4形式（音声リスニング含む）" : "音声なし（3形式）"}
                  </div>
                </div>
              </div>

              <div className={`flex border p-0.5 shrink-0 ${
                isGirl ? "bg-[#13091B] border-[#3D2752]" : "bg-[#0B0D12] border-[#262D3D]"
              }`}>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTap();
                    setIncludeListening(true);
                  }}
                  className={`px-3 py-1 text-[11px] font-black transition flex items-center gap-1 ${
                    includeListening
                      ? isGirl
                        ? "bg-[#F43F5E] text-white shadow-[0_0_10px_rgba(244,63,94,0.6)]"
                        : "bg-[#FACC15] text-[#0B0D12] shadow-[0_0_10px_rgba(250,204,21,0.6)]"
                      : "text-[#94A3B8] hover:text-white"
                  }`}
                >
                  <Volume2 className="w-3 h-3" />
                  <span>ON</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTap();
                    setIncludeListening(false);
                  }}
                  className={`px-3 py-1 text-[11px] font-black transition flex items-center gap-1 ${
                    !includeListening
                      ? isGirl
                        ? "bg-[#F43F5E] text-white"
                        : "bg-[#FACC15] text-[#0B0D12]"
                      : "text-[#94A3B8] hover:text-white"
                  }`}
                >
                  <VolumeX className="w-3 h-3" />
                  <span>OFF</span>
                </button>
              </div>
            </div>

            {/* 5. 正式なメインスタートボタン（他の黒い情報カードとは形状・色を完全差別化した特大3D立体出撃CTA） */}
            <div className="relative pt-1 pb-2">
              {/* 背後で激しく拍動する高輝度ネオングローオーラ */}
              <div
                className={`pointer-events-none absolute inset-x-2 -inset-y-1 blur-xl opacity-60 transition ${
                  isGirl
                    ? "bg-gradient-to-r from-[#F43F5E] via-[#FB7185] to-[#EC4899] animate-pulse"
                    : "bg-gradient-to-r from-[#FACC15] via-[#F59E0B] to-[#EF4444] animate-pulse"
                }`}
              />

              {/* 上部サイバーHUDインジケータ（選択中ミッションの明示） */}
              <div className="flex items-center justify-between px-2 mb-1.5 relative z-10">
                <div className="flex items-center gap-1.5 text-[11px] font-black">
                  <span className={`w-2 h-2 rounded-full animate-ping ${isGirl ? "bg-[#FB7185]" : "bg-[#10B981]"}`} />
                  <span className={isGirl ? "text-[#FB7185]" : "text-[#FACC15]"}>MISSION READY</span>
                  <span className="text-slate-500 font-normal">/</span>
                  <span className="text-white truncate max-w-[190px] drop-shadow-sm font-bold">
                    {stageBattleInfo.label}
                  </span>
                </div>
                <div className="text-[10px] font-black text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded-full border border-slate-700/80">
                  進捗: {stageBattleInfo.progress}
                </div>
              </div>

              {/* 特大3D立体アーケードプッシュボタン本体（平行四辺形スラッシュ -skew-x-6 ＆ 物理的押し込み厚み） */}
              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => {
                  soundEngine.playTap();
                  handleStartBattle(stageBattleInfo.stage, false, stageBattleInfo.grade as CodexCategory);
                }}
                className={`w-full relative group overflow-hidden border-2 border-white -skew-x-6 transition-all duration-150 select-none cursor-pointer ${
                  isGirl
                    ? "bg-gradient-to-r from-[#FDA4AF] via-[#FB7185] to-[#F43F5E] text-white shadow-[0_7px_0_#881337,0_14px_24px_rgba(244,63,94,0.45)] active:translate-y-1.5 active:shadow-[0_1px_0_#881337]"
                    : "bg-gradient-to-r from-[#FEF08A] via-[#FACC15] to-[#EAB308] text-[#0B0D12] shadow-[0_7px_0_#92400E,0_14px_24px_rgba(250,204,21,0.5)] active:translate-y-1.5 active:shadow-[0_1px_0_#92400E]"
                }`}
              >
                {/* 表面を斜めに光速で駆け抜けるシャインエフェクト */}
                <span className="pointer-events-none absolute -inset-y-4 -inset-x-12 w-20 bg-gradient-to-r from-transparent via-white/70 to-transparent skew-x-12 animate-glint-sweep" />

                {/* ボタン内コンテンツ（skewを打ち消して真っ直ぐ見やすく表示） */}
                <div className="skew-x-6 px-4 py-3 sm:py-3.5 flex items-center justify-between gap-3 relative z-10">
                  {/* 左：特大立体プレイアイコンバッジ */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-12 h-12 sm:w-13 sm:h-13 rounded-xl border-2 border-white flex items-center justify-center shrink-0 shadow-[2px_2px_0_#0B0D12] relative ${
                      isGirl
                        ? "bg-[#13091B] text-[#FB7185]"
                        : "bg-[#0B0D12] text-[#FACC15]"
                    }`}>
                      {isResume ? (
                        <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current ml-0.5 animate-pulse" />
                      ) : (
                        <Swords className="w-6 h-6 sm:w-7 sm:h-7 animate-bounce" />
                      )}
                    </div>

                    {/* 中央：圧倒的メインアクションテキスト */}
                    <div className="text-left min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-black px-1.5 py-0.2 rounded ${
                          isGirl
                            ? "bg-[#881337] text-pink-100"
                            : "bg-[#78350F] text-amber-100"
                        }`}>
                          {isResume ? "続きから" : "出撃"}
                        </span>
                        <span className="text-[11px] font-bold opacity-85 truncate">
                          {stageBattleInfo.sub || stageBattleInfo.label}
                        </span>
                      </div>
                      <div className="text-base sm:text-lg font-black tracking-wide flex items-center gap-1 mt-0.5 drop-shadow-sm leading-tight">
                        <span>{isResume ? "続きから出撃する！" : "クエスト出撃！"}</span>
                        <span className="text-xs sm:text-sm">BATTLE START</span>
                      </div>
                    </div>
                  </div>

                  {/* 右：躍動するアクションアロー矢印 */}
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border-2 border-white flex items-center justify-center shrink-0 shadow-[2px_2px_0_#0B0D12] group-hover:translate-x-1 transition-transform ${
                    isGirl
                      ? "bg-[#881337] text-white"
                      : "bg-[#0B0D12] text-[#FACC15]"
                  }`}>
                    <ChevronRight className="w-6 h-6 stroke-[3]" />
                  </div>
                </div>
              </motion.button>
            </div>

            {/* 🏆 全国ランキングバトル カード（英検4級 全20問スピードアタック） */}
            <div className={`border-2 p-3 relative overflow-hidden transition ${
              isGirl
                ? "bg-gradient-to-r from-[#1D1229] via-[#2A133A] to-[#1D1229] border-[#F43F5E]/60 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                : "bg-gradient-to-r from-[#131720] via-[#1a2335] to-[#131720] border-[#FACC15]/60 shadow-[0_0_15px_rgba(250,204,21,0.2)]"
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-black text-lg sm:text-xl shrink-0 shadow-md ${
                    isGirl
                      ? "bg-gradient-to-br from-[#F43F5E] to-[#DB2777] text-white shadow-pink-500/30"
                      : "bg-gradient-to-br from-[#FACC15] to-[#EAB308] text-slate-950 shadow-amber-400/30"
                  }`}>
                    🏆
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-black text-xs sm:text-sm text-white">
                        全国ランキングバトル
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                        英検4級 全20問
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
                        24時間に1回
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">
                      全700問からランダム20問の最速スピードアタック！
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playTap();
                      setIsRankingModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500 hover:text-slate-950 text-amber-300 border border-amber-500/40 font-black text-xs flex items-center gap-1 shadow-sm active:scale-95 transition"
                    title="全国ランキング一覧を見る"
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>ランキングを見る</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playTap();
                      setIsRankingEntryModalOpen(true);
                    }}
                    className={`px-3.5 py-1.5 rounded-lg font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition ${
                      isGirl
                        ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-pink-500/30"
                        : "bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-amber-400/30"
                    }`}
                  >
                    <Swords className="w-3.5 h-3.5" />
                    <span>挑戦する</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 6. 選択中ステージのユニット一覧＆図鑑 */}
            <div className={`border-2 p-2.5 space-y-2 ${
              isGirl ? "bg-[#1D1229] border-[#3D2752]" : "bg-[#131720] border-[#262D3D]"
            }`}>
              {/* ユニットヘッダー */}
              <div className="flex items-center justify-between text-[11px] font-black">
                <span className="text-white flex items-center gap-1.5">
                  <span className={`animate-ping ${isGirl ? "text-[#FB7185]" : "text-[#FACC15]"}`}>●</span>
                  <span>{selectedGrade === "英検4級" ? "ステージ選択" : "レベル選択"}</span>
                </span>
                <div className="flex items-center gap-1.5">
                  {selectedGrade === "英検4級" && (
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playTap();
                        setIsRankingModalOpen(true);
                      }}
                      className="px-2 py-0.5 flex items-center gap-1 transition rounded border bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500 hover:text-slate-950"
                      title="全国ランキングを見る"
                    >
                      <Trophy className="w-3 h-3 text-amber-400" />
                      <span>ランキングを見る</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playTap();
                      setCodexCategory(selectedGrade === "英検4級" ? "英検4級" : "ターゲット1800");
                      setIsCodexModalOpen(true);
                    }}
                    className={`px-2 py-0.5 flex items-center gap-1 transition border ${
                      isGirl
                        ? "text-[#FB7185] hover:text-white bg-[#13091B] border-[#3D2752] hover:border-[#FB7185]"
                        : "text-[#FACC15] hover:text-white bg-[#0B0D12] border-[#262D3D] hover:border-[#FACC15]"
                    }`}
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>図鑑・制覇率</span>
                  </button>
                </div>
              </div>

              {/* 英検4級ステージグリッド（選択中のカードは拡大鼓動＆オーラ！） */}
              {selectedGrade === "英検4級" && (
                <div className="grid grid-cols-4 gap-1.5">
                  {EIKEN4_STAGES.filter((s) => s.group === "stage12").map((s) => {
                    const isSelected = selectedEiken4Stage === s.unitNumber;
                    const poolWords = getActiveVocabPool().eiken4Words;
                    const stageWords = poolWords.filter((w) =>
                      s.levels.includes(w.track || 1)
                    );
                    const masteredCount = stageWords.filter(
                      (w) => (profile.wordMastery?.[w.id]?.cleared || 0) > 0
                    ).length;
                    const totalInStage = stageWords.length || 58;
                    const isComplete = totalInStage > 0 && masteredCount >= totalInStage;

                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          soundEngine.playTap();
                          setSelectedEiken4Stage(s.unitNumber);
                        }}
                        className={`py-1.5 px-1 text-center border-2 transition relative ${
                          isSelected
                            ? isGirl
                              ? "bg-[#F43F5E] text-white border-white font-black z-20 animate-stage-selected-girl"
                              : "bg-[#FACC15] text-[#0B0D12] border-white font-black z-20 animate-stage-selected"
                            : isGirl
                            ? "bg-[#13091B] text-[#C4B5FD] border-[#3D2752] hover:border-[#F43F5E] hover:text-white font-bold"
                            : "bg-[#0B0D12] text-[#94A3B8] border-[#262D3D] hover:border-[#FACC15] hover:text-white font-bold"
                        }`}
                      >
                        <div className="text-[11px] leading-tight flex items-center justify-center gap-0.5">
                          {isComplete && (
                            <CheckCircle2
                              className={`w-3 h-3 shrink-0 ${
                                isSelected ? (isGirl ? "text-white" : "text-[#0B0D12]") : (isGirl ? "text-[#2DD4BF]" : "text-[#10B981]")
                              }`}
                            />
                          )}
                          <span>{s.label}</span>
                        </div>
                        <div
                          className={`w-full h-1 mt-1 ${
                            isSelected
                              ? (isGirl ? "bg-white/30" : "bg-[#0B0D12]/30")
                              : (isGirl ? "bg-[#1D1229]" : "bg-[#131720]")
                          }`}
                        >
                          <div
                            className={`h-full transition-all ${isGirl ? "bg-[#2DD4BF]" : "bg-[#10B981]"}`}
                            style={{
                              width: `${Math.min(
                                100,
                                Math.round((masteredCount / Math.max(1, totalInStage)) * 100)
                              )}%`,
                            }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 中学英単語1800レベルグリッド（選択中のカードは拡大鼓動＆オーラ！） */}
              {selectedGrade === "ターゲット1800" && (
                <div className="grid grid-cols-5 gap-1.5">
                  {TARGET1800_STAGES.filter((s) => s.group === "level10").map((s) => {
                    const isSelected = selectedTargetStage === s.unitNumber;
                    const poolWords = getActiveVocabPool().target1800Words;
                    const stageWords = poolWords.filter((w) =>
                      s.levels.includes(w.track || 1)
                    );
                    const masteredCount = stageWords.filter(
                      (w) => (profile.wordMastery?.[w.id]?.cleared || 0) > 0
                    ).length;
                    const totalInStage = stageWords.length || 180;
                    const isComplete = totalInStage > 0 && masteredCount >= totalInStage;

                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          soundEngine.playTap();
                          setSelectedTargetStage(s.unitNumber);
                        }}
                        className={`py-1.5 px-1 text-center border-2 transition relative ${
                          isSelected
                            ? isGirl
                              ? "bg-[#F43F5E] text-white border-white font-black z-20 animate-stage-selected-girl"
                              : "bg-[#FACC15] text-[#0B0D12] border-white font-black z-20 animate-stage-selected"
                            : isGirl
                            ? "bg-[#13091B] text-[#C4B5FD] border-[#3D2752] hover:border-[#F43F5E] hover:text-white font-bold"
                            : "bg-[#0B0D12] text-[#94A3B8] border-[#262D3D] hover:border-[#FACC15] hover:text-white font-bold"
                        }`}
                      >
                        <div className="text-[11px] leading-tight flex items-center justify-center gap-0.5">
                          {isComplete && (
                            <CheckCircle2
                              className={`w-3 h-3 shrink-0 ${
                                isSelected ? (isGirl ? "text-white" : "text-[#0B0D12]") : (isGirl ? "text-[#2DD4BF]" : "text-[#10B981]")
                              }`}
                            />
                          )}
                          <span>{s.label}</span>
                        </div>
                        <div
                          className={`w-full h-1 mt-1 ${
                            isSelected
                              ? (isGirl ? "bg-white/30" : "bg-[#0B0D12]/30")
                              : (isGirl ? "bg-[#1D1229]" : "bg-[#131720]")
                          }`}
                        >
                          <div
                            className={`h-full transition-all ${isGirl ? "bg-[#2DD4BF]" : "bg-[#10B981]"}`}
                            style={{
                              width: `${Math.min(
                                100,
                                Math.round((masteredCount / Math.max(1, totalInStage)) * 100)
                              )}%`,
                            }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* 👤 キャラクター詳細ステータス＆五角形育成モーダル */}
      {isStatusModalOpen && (
        <StatusModal
          profile={profile}
          totalLxp={totalLxp}
          currentStageInfo={currentStageInfo}
          radarBounceKey={radarBounceKey}
          onRadarBounce={() => setRadarBounceKey((k) => k + 1)}
          recentInjectedGains={recentInjectedGains}
          injectionNotice={injectionNotice}
          affordableStatPoints={affordableStatPoints}
          onBatchInjectLxp={handleBatchInjectLxp}
          onFocusInjectStat={handleFocusInjectStat}
          onInjectSingleStat={handleInjectSingleStat}
          getStatUpgradeLxpCost={getStatUpgradeLxpCost}
          onOpenSkillModal={() => setIsSkillModalOpen(true)}
          onClose={() => setIsStatusModalOpen(false)}
          onToggleGender={handleToggleGender}
          isMuted={isMuted}
          onToggleMute={() => {
            const nextMute = !isMuted;
            setIsMuted(nextMute);
            soundEngine.setMuted(nextMute);
          }}
        />
      )}

      {/* 特権スキルハック＆10段階ドット絵進化図鑑モーダル */}
      {isSkillModalOpen && (
        <SkillHackModal
          profile={profile}
          onToggleSkill={handleToggleSkill}
          onUnlockSkill={handleUnlockSkill}
          onInstantLevelChange={handleInstantLevelChange}
          onAddTestLxp={handleAddTestLxp}
          onClose={() => setIsSkillModalOpen(false)}
        />
      )}

      {/* 📖 英検4級700語 ＆ 中学英単語1,800語 ＆ 英検1級 Unit 01 全96語 図鑑＆制覇状況モーダル */}
      {isCodexModalOpen && (
        <VocabCodexModal
          category={codexCategory}
          wordMastery={profile.wordMastery || {}}
          initialTrack={
            codexCategory === "英検4級"
              ? selectedEiken4Stage
              : codexCategory === "ターゲット1800"
              ? selectedTargetStage
              : selectedEikenTrack
          }
          onSelectTrackAndStart={(trackNum, onlyWeak, cat) =>
            handleStartBattle(trackNum, onlyWeak, cat)
          }
          onClose={() => setIsCodexModalOpen(false)}
        />
      )}

      {/* 🎨 キャラクター着せ替え ＆ 120形態進化図鑑モーダル */}
      {isCustomizeModalOpen && (
        <CharacterCustomizeModal
          isOpen={isCustomizeModalOpen}
          onClose={() => setIsCustomizeModalOpen(false)}
          profile={profile}
          onSave={(updatedProfile) => {
            setProfile(updatedProfile);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
            } catch (e) {
              console.error("Failed to save profile:", e);
            }
          }}
        />
      )}

      {/* 🏆 全国ランキングボードモーダル */}
      {isRankingModalOpen && (
        <RankingBoardModal
          isOpen={isRankingModalOpen}
          onClose={() => setIsRankingModalOpen(false)}
          onStartRankingBattle={() => {
            setIsRankingModalOpen(false);
            setIsRankingEntryModalOpen(true);
          }}
          course="eiken4"
        />
      )}

      {/* ⚔️ ランキング出撃前エントリーモーダル（事前ネーム入力 ＆ 24時間制限チェック） */}
      {isRankingEntryModalOpen && (
        <RankingEntryModal
          isOpen={isRankingEntryModalOpen}
          onClose={() => setIsRankingEntryModalOpen(false)}
          onStartBattle={handleStartRankingBattle}
          onOpenLeaderboard={() => {
            setIsRankingEntryModalOpen(false);
            setIsRankingModalOpen(true);
          }}
        />
      )}
    </div>
  );
}
