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
} from "lucide-react";
import {
  CharacterGender,
  FiveStats,
  GeneratedQuestion,
  GradeLevel,
  PlayerProfile,
  SkillHackId,
} from "@/lib/types";
import { EVOLUTION_STAGES, SKILL_HACKS } from "@/lib/vocabData";
import { generateBattleDeck } from "@/lib/questionGenerator";
import { soundEngine } from "@/lib/soundEngine";
import { PixelCharacter } from "@/components/PixelCharacter";
import { StarRadarChart } from "@/components/StarRadarChart";
import { BattleResultSummary, BattleScreen } from "@/components/BattleScreen";
import { SkillHackModal } from "@/components/SkillHackModal";

const STORAGE_KEY = "dopaben_player_profile_v1";

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
  activeSkillHacks: ["bounty_overdrive", "phantom_eliminator"],
};

function getRequiredExpForLevel(level: number): number {
  return 180 + (level - 1) * 90;
}

export default function DopaBenApp() {
  const [profile, setProfile] = useState<PlayerProfile>(DEFAULT_PROFILE);
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>("ALL");
  const [screen, setScreen] = useState<"home" | "battle" | "result">("home");
  const [battleDeck, setBattleDeck] = useState<GeneratedQuestion[]>([]);
  const [lastResult, setLastResult] = useState<{
    summary: BattleResultSummary;
    previousLevel: number;
    newLevel: number;
    newlyUnlockedSkills: string[];
  } | null>(null);

  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [slashTransition, setSlashTransition] = useState(false);

  // ローカルストレージから復元 ＆ 過去の別アプリのService Workerキャッシュを自動解除
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
  }, []);

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

  // バトル開始
  const handleStartBattle = () => {
    soundEngine.playAllOutIntro();
    const useHardcore =
      profile.level >= 5 &&
      profile.activeSkillHacks.includes("hardcore_challenge");
    const deck = generateBattleDeck(selectedGrade, useHardcore);

    triggerSlashTransition(() => {
      setBattleDeck(deck);
      setScreen("battle");
    });
  };

  // バトル完了＆進化計算
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
      soundEngine.playEvolutionFanfare();
      try {
        confetti({
          particleCount: currentLv > prevLevel ? 110 : 55,
          spread: 75,
          origin: { y: 0.6 },
          colors: ["#FF206E", "#FBFF12", "#41EAD4", "#FFFFFF"],
        });
      } catch {
        // ignore confetti error
      }
    });
  };

  // 男女切り替え
  const handleToggleGender = (gender: CharacterGender) => {
    soundEngine.playTap();
    saveProfile({ ...profile, gender });
  };

  // 特権スキルハックのON/OFF切り替え
  const handleToggleSkill = (skillId: SkillHackId) => {
    const exists = profile.activeSkillHacks.includes(skillId);
    const nextSkills = exists
      ? profile.activeSkillHacks.filter((id) => id !== skillId)
      : [...profile.activeSkillHacks, skillId];
    saveProfile({ ...profile, activeSkillHacks: nextSkills });
  };

  // プロトタイプ検証用：即座に任意の進化段階（Lv.1〜10）へ変更
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
    <div className="min-h-screen bg-[#0C0F0A] text-white relative overflow-x-hidden">
      {/* 斜めスラッシュ画面遷移エフェクト (#FF206E × #FBFF12 × #41EAD4) */}
      <AnimatePresence>
        {slashTransition && (
          <motion.div
            initial={{ x: "-120%", skewX: -18 }}
            animate={{ x: "0%", skewX: -18 }}
            exit={{ x: "120%", skewX: -18 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-[#FF206E] border-x-8 border-[#41EAD4] flex items-center justify-center pointer-events-none"
          >
            <div className="bg-[#0C0F0A] text-[#FBFF12] font-black text-3xl px-8 py-3 -skew-x-12 border-4 border-white shadow-[6px_6px_0_#41EAD4] tracking-widest">
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
        <div className="min-h-screen w-full max-w-md mx-auto flex flex-col justify-between bg-[#0C0F0A] bg-halftone p-4">
          <div className="space-y-4">
            {/* リザルトバナー */}
            <motion.div
              initial={{ scale: 0.85, rotate: -3 }}
              animate={{ scale: 1, rotate: -1 }}
              className="bg-[#FF206E] border-2 border-white p-3.5 text-center shadow-p5-cyan clip-p5-banner"
            >
              <div className="text-xs font-black text-[#FBFF12] tracking-widest">
                MISSION ACCOMPLISHED // 脳汁リザルト
              </div>
              <h1 className="text-3xl font-black italic tracking-tight text-white">
                +{lastResult.summary.earnedExp} EXP GET!!
              </h1>
            </motion.div>

            {/* レベルアップ＆ドット絵進化演出カード */}
            <div className="bg-[#141911] border-2 border-white p-4 shadow-p5-pink relative">
              {lastResult.newLevel > lastResult.previousLevel ? (
                <div className="text-center space-y-2">
                  <span className="inline-block bg-[#FBFF12] text-[#0C0F0A] font-black text-xs px-3 py-1 -skew-x-12 animate-bounce">
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
                  <div className="font-black text-lg text-[#FBFF12]">
                    {profile.gender === "boy"
                      ? currentStageInfo.titleBoy
                      : currentStageInfo.titleGirl}
                  </div>
                  <p className="text-xs text-[#C8D4C2]">
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
                    <div className="text-xs font-black text-[#FBFF12]">
                      Lv.{profile.level} //{" "}
                      {profile.gender === "boy"
                        ? currentStageInfo.titleBoy
                        : currentStageInfo.titleGirl}
                    </div>
                    <div className="w-full h-3 bg-[#0C0F0A] border border-white -skew-x-12 p-0.5">
                      <div
                        className="h-full bg-gradient-to-r from-[#FF206E] via-[#FBFF12] to-[#41EAD4]"
                        style={{ width: `${expPercent}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-[#A3B19B] font-bold">
                      次のドット絵進化まで: あと{" "}
                      <span className="text-white font-black">
                        {Math.max(0, reqExp - profile.exp)} EXP
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 新規アンロックされた特権スキルハック通知 */}
              {lastResult.newlyUnlockedSkills.length > 0 && (
                <div className="mt-3 bg-[#0C0F0A] border-2 border-[#41EAD4] p-3 space-y-1">
                  <div className="text-xs font-black text-[#41EAD4] flex items-center gap-1">
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

            {/* 五角形スターパラメータ上昇表示 */}
            <div className="bg-[#141911] border-2 border-[#2C3527] p-3 flex flex-col items-center">
              <div className="text-xs font-black text-[#FBFF12] mb-1">
                ♪♪ PARAMETER GROWTH // 五角形ステータス成長 ♪♪
              </div>
              <StarRadarChart
                stats={profile.stats}
                recentGains={lastResult.summary.statGains}
              />
              <div className="grid grid-cols-3 gap-2 w-full mt-2 text-center">
                <div className="bg-[#0C0F0A] border border-[#2C3527] p-2">
                  <div className="text-[10px] text-[#A3B19B] font-bold">
                    最大チェイン
                  </div>
                  <div className="text-base font-black text-white">
                    {lastResult.summary.maxCombo} COMBO
                  </div>
                </div>
                <div className="bg-[#0C0F0A] border border-[#2C3527] p-2">
                  <div className="text-[10px] text-[#A3B19B] font-bold">
                    倍返し撃破
                  </div>
                  <div className="text-base font-black text-[#FBFF12]">
                    {lastResult.summary.revengeCount} 回
                  </div>
                </div>
                <div className="bg-[#0C0F0A] border border-[#2C3527] p-2">
                  <div className="text-[10px] text-[#A3B19B] font-bold">
                    撃破問題数
                  </div>
                  <div className="text-base font-black text-[#41EAD4]">
                    {lastResult.summary.wordsCleared} 問
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="space-y-2.5 pt-3">
            <button
              onClick={handleStartBattle}
              className="w-full py-4 bg-[#FF206E] hover:brightness-110 text-white font-black text-lg border-2 border-white clip-p5-btn shadow-p5-yellow flex items-center justify-center gap-2 active:scale-95 transition"
            >
              <Flame className="w-5 h-5 fill-[#FBFF12] text-[#FBFF12]" />
              もう1戦突入する！（1 MORE BATTLE）
            </button>
            <button
              onClick={() =>
                triggerSlashTransition(() => {
                  setScreen("home");
                })
              }
              className="w-full py-3 bg-[#141911] hover:bg-[#1D2419] text-white font-black text-sm border border-[#41EAD4]"
            >
              アジト（拠点）へ戻る
            </button>
          </div>
        </div>
      )}

      {/* === 3. ホーム拠点（アジト）画面 === */}
      {screen === "home" && (
        <div className="min-h-screen w-full max-w-md mx-auto flex flex-col justify-between bg-[#0C0F0A] bg-halftone p-3.5 space-y-3">
          {/* トップヒーローヘッダー：生成AIカスタムロゴ（ダイカット透過加工）＆操作バー */}
          <header className="relative pt-1 pb-2 border-b-2 border-[#2C3527]">
            {/* 上部ユーティリティバー（ステータス表記 ＆ 男女切替・音量） */}
            <div className="flex items-center justify-between mb-1.5 relative z-20">
              <div className="flex items-center gap-1.5">
                <span className="bg-[#FF206E] text-white text-[10px] font-black px-2 py-0.5 -skew-x-12 border border-white">
                  DOPAMINE × STUDY
                </span>
                <span className="text-[10px] font-black text-[#41EAD4] tracking-wider">
                  脳汁育成イングリッシュ
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {/* 男子 / 女子 ドット絵切り替え */}
                <div className="flex bg-[#141911] border border-[#2C3527] p-0.5">
                  <button
                    onClick={() => handleToggleGender("boy")}
                    className={`px-2.5 py-1 text-[11px] font-black transition ${
                      profile.gender === "boy"
                        ? "bg-[#41EAD4] text-[#0C0F0A]"
                        : "text-[#A3B19B] hover:text-white"
                    }`}
                  >
                    男子
                  </button>
                  <button
                    onClick={() => handleToggleGender("girl")}
                    className={`px-2.5 py-1 text-[11px] font-black transition ${
                      profile.gender === "girl"
                        ? "bg-[#FF206E] text-white"
                        : "text-[#A3B19B] hover:text-white"
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
                  className="p-1.5 bg-[#141911] border border-[#2C3527] text-white hover:border-[#41EAD4] transition"
                  title="音声ON/OFF"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-[#FF206E]" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-[#FBFF12]" />
                  )}
                </button>
              </div>
            </div>

            {/* メインロゴビジュアル（ダイカットステッカー加工＋背面ネオングロー） */}
            <div className="relative flex justify-center items-center py-1">
              <div
                className="absolute inset-x-6 inset-y-2 rounded-full blur-2xl opacity-35 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, #FF206E 0%, #41EAD4 55%, transparent 80%)",
                }}
              />
              <motion.img
                src="/dopaben-logo.png"
                alt="ドパベン 新感覚学習アプリ"
                initial={{ scale: 0.92, opacity: 0, y: -6 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-full max-w-[330px] h-auto object-contain relative z-10 drop-shadow-[0_6px_16px_rgba(255,32,110,0.45)] select-none"
              />
            </div>
          </header>

          {/* メイン育成キャラクター・ステージカード */}
          <section className="bg-[#141911] border-2 border-white p-3.5 shadow-p5-pink relative overflow-hidden">
            {/* 右上の斜めアクセント装飾 */}
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-[#FF206E]/15 rotate-12 pointer-events-none" />

            <div className="flex items-center justify-between mb-2.5 relative z-10">
              <span className="bg-[#FBFF12] text-[#0C0F0A] font-black text-[11px] px-2.5 py-0.5 -skew-x-12 border border-[#0C0F0A]">
                {currentStageInfo.subtitle}
              </span>
              <button
                onClick={() => {
                  soundEngine.playTap();
                  setIsSkillModalOpen(true);
                }}
                className="text-xs font-black text-[#41EAD4] hover:text-[#FBFF12] transition flex items-center gap-0.5"
              >
                10段階進化図鑑・特権スキル <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-3.5 relative z-10">
              {/* レトロドット絵キャラ展示ボックス */}
              <div
                onClick={() => {
                  soundEngine.playTap();
                  setIsSkillModalOpen(true);
                }}
                className="cursor-pointer bg-[#0C0F0A] border-2 border-[#41EAD4] hover:border-[#FBFF12] p-1.5 transition shrink-0 shadow-[3px_3px_0_#FF206E]"
              >
                <PixelCharacter
                  gender={profile.gender}
                  stage={profile.level}
                  size={108}
                  mood="idle"
                />
              </div>

              {/* キャラ情報＆進化EXPゲージ */}
              <div className="flex-1 space-y-2">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black italic text-[#FBFF12] drop-shadow-[2px_2px_0_#FF206E]">
                      Lv.{profile.level}
                    </span>
                    <span className="text-xs font-bold text-[#41EAD4]">
                      / 10段階進化
                    </span>
                  </div>
                  <h2 className="font-black text-base text-white leading-snug mt-0.5">
                    {profile.gender === "boy"
                      ? currentStageInfo.titleBoy
                      : currentStageInfo.titleGirl}
                  </h2>
                </div>

                <p className="text-[11px] text-[#C8D4C2] leading-relaxed">
                  {currentStageInfo.unlockMessage}
                </p>

                {/* EXPバー */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-black">
                    <span className="text-[#41EAD4]">NEXT EVOLUTION</span>
                    <span className="text-[#FBFF12]">
                      {profile.level >= 10
                        ? "MAX LEVEL"
                        : `${profile.exp} / ${reqExp} EXP`}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#0C0F0A] border border-white -skew-x-12 p-0.5">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#FF206E] via-[#FBFF12] to-[#41EAD4]"
                      animate={{ width: `${expPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 機能ハックスキル・クイックバー */}
            <div className="mt-3 pt-2.5 border-t border-[#2C3527] flex items-center justify-between gap-2 relative z-10">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-black text-[#41EAD4] flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-[#41EAD4]" /> 発動スキル:
                </span>
                {profile.activeSkillHacks.filter((id) => {
                  const def = SKILL_HACKS.find((s) => s.id === id);
                  return def && profile.level >= def.unlockLevel;
                }).length === 0 ? (
                  <span className="text-[11px] text-[#A3B19B] font-bold">
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
                      className="bg-[#0C0F0A] border border-[#FF206E] text-[#FBFF12] text-[10px] font-black px-2 py-0.5 -skew-x-6"
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
                className="bg-[#0C0F0A] hover:bg-[#41EAD4] hover:text-[#0C0F0A] text-[#41EAD4] border border-[#41EAD4] px-2.5 py-1 text-[11px] font-black shrink-0 transition"
              >
                スキル設定
              </button>
            </div>
          </section>

          {/* 五角形ステータス＆戦績サマリー */}
          <section className="grid grid-cols-12 gap-2.5 items-center bg-[#141911] border-2 border-[#2C3527] p-2.5">
            <div className="col-span-7 flex justify-center">
              <StarRadarChart stats={profile.stats} />
            </div>
            <div className="col-span-5 space-y-2 pr-1">
              <div className="bg-[#0C0F0A] border-l-4 border-[#FF206E] p-2">
                <div className="text-[10px] text-[#A3B19B] font-bold">
                  総撃破単語数
                </div>
                <div className="text-base font-black text-white">
                  {profile.totalWordsCleared} WORDS
                </div>
              </div>
              <div className="bg-[#0C0F0A] border-l-4 border-[#FBFF12] p-2">
                <div className="text-[10px] text-[#A3B19B] font-bold">
                  倍返し(REVENGE)成功
                </div>
                <div className="text-base font-black text-[#FBFF12]">
                  {profile.totalRevengeJackpots} JACKPOTS
                </div>
              </div>
              <div className="bg-[#0C0F0A] border-l-4 border-[#41EAD4] p-2">
                <div className="text-[10px] text-[#A3B19B] font-bold">
                  最高コンボ記録
                </div>
                <div className="text-base font-black text-[#41EAD4]">
                  {profile.maxCombo} CHAIN
                </div>
              </div>
            </div>
          </section>

          {/* 出撃学年セレクト ＆ Lv.5特権「激ムズ問題に挑戦できる権」トグル */}
          <section className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-[#FBFF12]" />
                出撃レンジ選択（4形式＋音声自動生成）
              </span>

              {/* Lv.5特権：激ムズ問題に挑戦できる権のワンタップトグル */}
              {profile.level >= 5 ? (
                <button
                  onClick={() => {
                    soundEngine.playTap();
                    handleToggleSkill("hardcore_challenge");
                  }}
                  className={`px-2.5 py-1 text-[11px] font-black border -skew-x-6 flex items-center gap-1 transition ${
                    isHardcoreActive
                      ? "bg-[#FF206E] text-white border-[#FBFF12] shadow-[2px_2px_0_#41EAD4]"
                      : "bg-[#141911] text-[#A3B19B] border-[#2C3527]"
                  }`}
                >
                  <Skull className="w-3.5 h-3.5 text-[#FBFF12]" />
                  激ムズ挑戦権: {isHardcoreActive ? "ON (EXP×2)" : "OFF"}
                </button>
              ) : (
                <button
                  onClick={() => {
                    soundEngine.playTap();
                    setIsSkillModalOpen(true);
                  }}
                  className="text-[11px] font-bold text-[#41EAD4]/80 hover:text-[#FBFF12] transition"
                >
                  🔒 Lv.5で『激ムズ挑戦権』解禁
                </button>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {(["ALL", "中1", "中2", "中3"] as GradeLevel[]).map((g) => (
                <button
                  key={g}
                  onClick={() => {
                    soundEngine.playTap();
                    setSelectedGrade(g);
                  }}
                  className={`py-2 font-black text-xs border-2 -skew-x-6 transition ${
                    selectedGrade === g
                      ? "bg-[#FBFF12] text-[#0C0F0A] border-white shadow-[3px_3px_0_#FF206E]"
                      : "bg-[#141911] text-white border-[#2C3527] hover:border-[#41EAD4]"
                  }`}
                >
                  {g === "ALL" ? "全学年MIX" : g}
                </button>
              ))}
            </div>

            {/* 出撃ボタン (#FF206E ベース × #FBFF12 シャドウ × #FFFFFF エッジ) */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleStartBattle}
              className="w-full py-4 bg-[#FF206E] hover:brightness-110 text-white font-black text-xl tracking-wider border-2 border-white clip-p5-btn shadow-p5-yellow flex items-center justify-center gap-2.5 relative overflow-hidden group transition"
            >
              <Zap className="w-6 h-6 fill-[#FBFF12] text-[#FBFF12] group-hover:scale-125 transition" />
              <span>BATTLE START // 出撃する</span>
              <Sparkles className="w-5 h-5 text-[#41EAD4]" />
            </motion.button>
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
    </div>
  );
}
