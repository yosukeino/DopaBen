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

// レベルアップに必要なEXP閾値（1〜2プレイでサクサク進化を体感できるテンポ設計）
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

  // ローカルストレージから復元
  useEffect(() => {
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

    // 新たに解放された特権スキルハックを自動ONにする
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
          colors: ["#E60012", "#FFE600", "#FFFFFF", "#00F0FF"],
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
    profile.level >= 10 ? 100 : Math.min(100, Math.round((profile.exp / reqExp) * 100));
  const isHardcoreActive =
    profile.level >= 5 &&
    profile.activeSkillHacks.includes("hardcore_challenge");

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-x-hidden">
      {/* P5風・斜めスラッシュ画面遷移エフェクト */}
      <AnimatePresence>
        {slashTransition && (
          <motion.div
            initial={{ x: "-120%", skewX: -18 }}
            animate={{ x: "0%", skewX: -18 }}
            exit={{ x: "120%", skewX: -18 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-[#E60012] border-x-8 border-white flex items-center justify-center pointer-events-none"
          >
            <div className="bg-black text-[#FFE600] font-black text-3xl px-8 py-3 -skew-x-12 border-4 border-white tracking-widest">
              DOPABEN // TAKE YOUR BRAIN
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
        <div className="min-h-screen w-full max-w-md mx-auto flex flex-col justify-between bg-[#080808] bg-halftone p-4">
          <div className="space-y-4">
            {/* リザルトバナー */}
            <motion.div
              initial={{ scale: 0.85, rotate: -3 }}
              animate={{ scale: 1, rotate: -1 }}
              className="bg-[#E60012] border-2 border-white p-3.5 text-center shadow-p5-white clip-p5-banner"
            >
              <div className="text-xs font-black text-[#FFE600] tracking-widest">
                MISSION ACCOMPLISHED // 脳汁リザルト
              </div>
              <h1 className="text-3xl font-black italic tracking-tight">
                +{lastResult.summary.earnedExp} EXP GET!!
              </h1>
            </motion.div>

            {/* レベルアップ＆ドット絵進化演出カード */}
            <div className="bg-[#111111] border-2 border-white p-4 shadow-p5-red relative">
              {lastResult.newLevel > lastResult.previousLevel ? (
                <div className="text-center space-y-2">
                  <span className="inline-block bg-[#FFE600] text-black font-black text-xs px-3 py-1 -skew-x-12 animate-bounce">
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
                  <div className="font-black text-lg text-[#FFE600]">
                    {profile.gender === "boy"
                      ? currentStageInfo.titleBoy
                      : currentStageInfo.titleGirl}
                  </div>
                  <p className="text-xs text-zinc-300">
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
                    <div className="text-xs font-black text-[#FFE600]">
                      Lv.{profile.level} //{" "}
                      {profile.gender === "boy"
                        ? currentStageInfo.titleBoy
                        : currentStageInfo.titleGirl}
                    </div>
                    <div className="w-full h-3 bg-zinc-900 border border-white -skew-x-12 p-0.5">
                      <div
                        className="h-full bg-[#FFE600]"
                        style={{ width: `${expPercent}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-zinc-400 font-bold">
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
                <div className="mt-3 bg-[#1A050A] border-2 border-[#00F0FF] p-3 space-y-1">
                  <div className="text-xs font-black text-[#00F0FF] flex items-center gap-1">
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

            {/* P5風・五角形スターパラメータ上昇表示 */}
            <div className="bg-[#0E0E0E] border-2 border-zinc-700 p-3 flex flex-col items-center">
              <div className="text-xs font-black text-[#FFE600] mb-1">
                ♪♪ PARAMETER GROWTH // 五角形ステータス成長 ♪♪
              </div>
              <StarRadarChart
                stats={profile.stats}
                recentGains={lastResult.summary.statGains}
              />
              <div className="grid grid-cols-3 gap-2 w-full mt-2 text-center">
                <div className="bg-zinc-900 border border-zinc-700 p-2">
                  <div className="text-[10px] text-zinc-400 font-bold">
                    最大チェイン
                  </div>
                  <div className="text-base font-black text-white">
                    {lastResult.summary.maxCombo} COMBO
                  </div>
                </div>
                <div className="bg-zinc-900 border border-zinc-700 p-2">
                  <div className="text-[10px] text-zinc-400 font-bold">
                    倍返し撃破
                  </div>
                  <div className="text-base font-black text-[#FFE600]">
                    {lastResult.summary.revengeCount} 回
                  </div>
                </div>
                <div className="bg-zinc-900 border border-zinc-700 p-2">
                  <div className="text-[10px] text-zinc-400 font-bold">
                    撃破問題数
                  </div>
                  <div className="text-base font-black text-[#00F0FF]">
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
              className="w-full py-4 bg-[#E60012] hover:bg-red-600 text-white font-black text-lg border-2 border-white clip-p5-btn shadow-p5-yellow flex items-center justify-center gap-2 active:scale-95 transition"
            >
              <Flame className="w-5 h-5 fill-[#FFE600] text-[#FFE600]" />
              もう1戦突入する！（1 MORE BATTLE）
            </button>
            <button
              onClick={() =>
                triggerSlashTransition(() => {
                  setScreen("home");
                })
              }
              className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-black text-sm border border-zinc-600"
            >
              アジト（拠点）へ戻る
            </button>
          </div>
        </div>
      )}

      {/* === 3. ホーム拠点（アジト）画面 === */}
      {screen === "home" && (
        <div className="min-h-screen w-full max-w-md mx-auto flex flex-col justify-between bg-[#080808] bg-halftone p-3.5 space-y-3">
          {/* トップヘッダー：タイトルロゴ ＆ 男女切替 ＆ 音量 */}
          <header className="flex items-center justify-between border-b-2 border-zinc-800 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="bg-[#E60012] text-white font-black text-xl px-3 py-1 -skew-x-12 border-2 border-white shadow-[3px_3px_0_#FFE600] tracking-tighter">
                ドパベン
              </div>
              <div>
                <div className="text-[10px] font-black text-[#FFE600] tracking-widest">
                  DOPAMINE × STUDY
                </div>
                <div className="text-xs font-bold text-zinc-300">
                  中学英単語・脳汁育成バトル
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* 男子 / 女子 ドット絵切り替え */}
              <div className="flex bg-zinc-900 border border-zinc-700 p-0.5">
                <button
                  onClick={() => handleToggleGender("boy")}
                  className={`px-2 py-1 text-[11px] font-black transition ${
                    profile.gender === "boy"
                      ? "bg-[#E60012] text-white"
                      : "text-zinc-400"
                  }`}
                >
                  男子
                </button>
                <button
                  onClick={() => handleToggleGender("girl")}
                  className={`px-2 py-1 text-[11px] font-black transition ${
                    profile.gender === "girl"
                      ? "bg-[#E60012] text-white"
                      : "text-zinc-400"
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
                className="p-2 bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white"
                title="音声ON/OFF"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-red-500" />
                ) : (
                  <Volume2 className="w-4 h-4 text-[#FFE600]" />
                )}
              </button>
            </div>
          </header>

          {/* メイン育成キャラクター・ステージカード（温かみのあるレトロドット絵 × P5風フレーム） */}
          <section className="bg-[#111111] border-2 border-white p-3.5 shadow-p5-red relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="bg-[#FFE600] text-black font-black text-[11px] px-2.5 py-0.5 -skew-x-12">
                {currentStageInfo.subtitle}
              </span>
              <button
                onClick={() => {
                  soundEngine.playTap();
                  setIsSkillModalOpen(true);
                }}
                className="text-xs font-black text-[#00F0FF] hover:underline flex items-center gap-0.5"
              >
                10段階進化図鑑・特権スキル <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-3.5">
              {/* レトロドット絵キャラ */}
              <div
                onClick={() => {
                  soundEngine.playTap();
                  setIsSkillModalOpen(true);
                }}
                className="cursor-pointer bg-zinc-950/90 border-2 border-zinc-700 hover:border-[#FFE600] p-1.5 transition shrink-0"
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
                    <span className="text-2xl font-black italic text-[#FFE600]">
                      Lv.{profile.level}
                    </span>
                    <span className="text-xs font-bold text-zinc-400">
                      / 10段階進化
                    </span>
                  </div>
                  <h2 className="font-black text-base text-white leading-snug">
                    {profile.gender === "boy"
                      ? currentStageInfo.titleBoy
                      : currentStageInfo.titleGirl}
                  </h2>
                </div>

                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  {currentStageInfo.unlockMessage}
                </p>

                {/* EXPバー */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-black">
                    <span className="text-zinc-400">NEXT EVOLUTION</span>
                    <span className="text-[#FFE600]">
                      {profile.level >= 10
                        ? "MAX LEVEL"
                        : `${profile.exp} / ${reqExp} EXP`}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-black border border-white -skew-x-12 p-0.5">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#E60012] to-[#FFE600]"
                      animate={{ width: `${expPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 機能ハックスキル・クイックバー（高レベル特権の優越感） */}
            <div className="mt-3 pt-2.5 border-t border-zinc-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-black text-zinc-400 flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-[#00F0FF]" /> 発動スキル:
                </span>
                {profile.activeSkillHacks.filter((id) => {
                  const def = SKILL_HACKS.find((s) => s.id === id);
                  return def && profile.level >= def.unlockLevel;
                }).length === 0 ? (
                  <span className="text-[11px] text-zinc-500 font-bold">
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
                      className="bg-[#1F090D] border border-[#E60012] text-[#FFE600] text-[10px] font-black px-2 py-0.5 -skew-x-6"
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
                className="bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-600 px-2.5 py-1 text-[11px] font-black shrink-0"
              >
                スキル設定
              </button>
            </div>
          </section>

          {/* 五角形ステータス＆戦績サマリー */}
          <section className="grid grid-cols-12 gap-2.5 items-center bg-[#0D0D0D] border border-zinc-800 p-2.5">
            <div className="col-span-7 flex justify-center">
              <StarRadarChart stats={profile.stats} />
            </div>
            <div className="col-span-5 space-y-2 pr-1">
              <div className="bg-zinc-900/90 border-l-4 border-[#E60012] p-2">
                <div className="text-[10px] text-zinc-400 font-bold">
                  総撃破単語数
                </div>
                <div className="text-base font-black text-white">
                  {profile.totalWordsCleared} WORDS
                </div>
              </div>
              <div className="bg-zinc-900/90 border-l-4 border-[#FFE600] p-2">
                <div className="text-[10px] text-zinc-400 font-bold">
                  倍返し(REVENGE)成功
                </div>
                <div className="text-base font-black text-[#FFE600]">
                  {profile.totalRevengeJackpots} JACKPOTS
                </div>
              </div>
              <div className="bg-zinc-900/90 border-l-4 border-[#00F0FF] p-2">
                <div className="text-[10px] text-zinc-400 font-bold">
                  最高コンボ記録
                </div>
                <div className="text-base font-black text-[#00F0FF]">
                  {profile.maxCombo} CHAIN
                </div>
              </div>
            </div>
          </section>

          {/* 出撃学年セレクト ＆ Lv.5特権「激ムズ問題に挑戦できる権」トグル */}
          <section className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-zinc-300 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-[#FFE600]" />
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
                      ? "bg-purple-600 text-white border-[#FFE600] shadow-[2px_2px_0_#FFE600]"
                      : "bg-zinc-900 text-zinc-400 border-zinc-700"
                  }`}
                >
                  <Skull className="w-3.5 h-3.5" />
                  激ムズ挑戦権: {isHardcoreActive ? "ON (EXP×2)" : "OFF"}
                </button>
              ) : (
                <button
                  onClick={() => {
                    soundEngine.playTap();
                    setIsSkillModalOpen(true);
                  }}
                  className="text-[11px] font-bold text-zinc-500 hover:text-[#FFE600] transition"
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
                      ? "bg-[#FFE600] text-black border-white shadow-[3px_3px_0_#E60012]"
                      : "bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-zinc-500"
                  }`}
                >
                  {g === "ALL" ? "全学年MIX" : g}
                </button>
              ))}
            </div>

            {/* 出撃ボタン */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleStartBattle}
              className="w-full py-4 bg-[#E60012] hover:bg-red-600 text-white font-black text-xl tracking-wider border-2 border-white clip-p5-btn shadow-p5-yellow flex items-center justify-center gap-2.5 relative overflow-hidden group"
            >
              <Zap className="w-6 h-6 fill-[#FFE600] text-[#FFE600] group-hover:scale-125 transition" />
              <span>BATTLE START // 出撃する</span>
              <Sparkles className="w-5 h-5 text-[#FFE600]" />
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
