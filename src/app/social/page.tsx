"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  Sparkles,
  Trophy,
  Flame,
  Zap,
  BookOpen,
  Play,
  RotateCcw,
  Target,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Filter,
  Swords,
  TrendingUp,
  Compass,
  Hourglass,
  Scale,
} from "lucide-react";
import {
  ALL_SOCIAL_QUESTIONS,
  GEOGRAPHY_QUESTIONS,
  HISTORY_QUESTIONS,
  CIVICS_QUESTIONS,
  SUBJECT_CHAPTERS,
  SUBJECT_META,
  SocialSubject,
} from "@/lib/socialData";
import {
  generateSocialQuizDeck,
  GeneratedSocialQuestion,
  QuizDeckOptions,
} from "@/lib/socialQuestionEngine";
import { soundEngine } from "@/lib/soundEngine";
import { BaseballCharacter } from "@/components/BaseballCharacter";
import {
  SocialBaseballGame,
  GameSummary,
} from "@/components/SocialBaseballGame";
import { SocialGameResult } from "@/components/SocialGameResult";
import { BaseballLockerModal } from "@/components/BaseballLockerModal";
import {
  BaseballPlayerProfile,
  calculateLevelFromTotalLxp,
  calculateOverallRank,
  calculateStatFromCatches,
  applyKnockProgress,
  KnockProgressDelta,
  DEFAULT_BASEBALL_PLAYER,
  BAT_EQUIPMENTS,
  PLAYER_RANKS,
} from "@/lib/baseballGrowthEngine";
import { PlayerProfile } from "@/lib/types";

const DOPA_PROFILE_KEY = "dopaben_player_profile_v1";
const SOCIAL_PLAYER_KEY = "dopasoc_player_v3"; // 3大ステータス＆ノック記録対応
const WEAK_QUESTIONS_KEY = "dopasoc_weak_question_ids";

export default function DopaSocPage() {
  const [viewState, setViewState] = useState<"lobby" | "playing" | "result">("lobby");
  const [isLockerOpen, setIsLockerOpen] = useState(false);

  // 選手育成プロファイル
  const [player, setPlayer] = useState<BaseballPlayerProfile>(DEFAULT_BASEBALL_PLAYER);

  // 出題範囲選択ステート
  // "ALL" | "地理" | "歴史" | "公民"
  const [selectedSubject, setSelectedSubject] = useState<SocialSubject | "ALL">("ALL");
  const [selectedChapter, setSelectedChapter] = useState<string>("ALL");

  // 科目アコーディオンの開閉状態
  const [openAccordion, setOpenAccordion] = useState<SocialSubject | null>(null);

  // ゲーム進行
  const [deck, setDeck] = useState<GeneratedSocialQuestion[]>([]);
  const [deckOptions, setDeckOptions] = useState<QuizDeckOptions>({});
  const [latestSummary, setLatestSummary] = useState<GameSummary | null>(null);

  // 中断時の成果保存トースト
  const [abortSavedToast, setAbortSavedToast] = useState<{
    totalQuestions: number;
    hits: number;
    earnedLxp: number;
  } | null>(null);

  // 弱点問題ID
  const [weakIds, setWeakIds] = useState<number[]>([]);

  // 初回マウント時読み込み
  useEffect(() => {
    try {
      const profileJson = localStorage.getItem(DOPA_PROFILE_KEY);
      let globalLxp = 0;
      let globalGender: "boy" | "girl" = "boy";
      if (profileJson) {
        const p: PlayerProfile = JSON.parse(profileJson);
        globalLxp = p.exp ?? 0;
        if (p.gender) globalGender = p.gender;
      }

      const storedPlayer = localStorage.getItem(SOCIAL_PLAYER_KEY);
      if (storedPlayer) {
        setPlayer(JSON.parse(storedPlayer));
      } else {
        const initPlayer: BaseballPlayerProfile = {
          ...DEFAULT_BASEBALL_PLAYER,
          gender: globalGender,
          exp: globalLxp,
          totalLxp: globalLxp,
        };
        setPlayer(initPlayer);
      }

      const weakJson = localStorage.getItem(WEAK_QUESTIONS_KEY);
      if (weakJson) setWeakIds(JSON.parse(weakJson));
    } catch {
      // ignore
    }
  }, []);

  // 選手データ保存
  const handleUpdatePlayer = (updated: BaseballPlayerProfile) => {
    setPlayer(updated);
    try {
      localStorage.setItem(SOCIAL_PLAYER_KEY, JSON.stringify(updated));
      const profileJson = localStorage.getItem(DOPA_PROFILE_KEY);
      if (profileJson) {
        const p: PlayerProfile = JSON.parse(profileJson);
        p.exp = updated.exp;
        localStorage.setItem(DOPA_PROFILE_KEY, JSON.stringify(p));
      }
    } catch {
      // ignore
    }
  };

  // アコーディオン開閉
  const toggleAccordion = (subj: SocialSubject) => {
    soundEngine.playTap();
    if (openAccordion === subj) {
      setOpenAccordion(null);
    } else {
      setOpenAccordion(subj);
      setSelectedSubject(subj);
      setSelectedChapter("ALL");
    }
  };

  // 全体または科目一括選択
  const handleSelectField = (subj: SocialSubject | "ALL") => {
    soundEngine.playTap();
    setSelectedSubject(subj);
    setSelectedChapter("ALL");
    if (subj === "ALL") {
      setOpenAccordion(null);
    } else {
      setOpenAccordion(subj);
    }
  };

  // 無限ノック開始
  const handleStartInfiniteKnock = (customSubj?: SocialSubject | "ALL", customChap?: string) => {
    soundEngine.playPlayBall();

    const targetSubj = customSubj !== undefined ? customSubj : selectedSubject;
    const targetChap = customChap !== undefined ? customChap : selectedChapter;

    const options: QuizDeckOptions = {
      subject: targetSubj,
      chapter: targetChap,
      limit: 10, // 初回10本、以降はモーダルで10本/30本/100本と無限追加！
    };

    const initialDeck = generateSocialQuizDeck(options);
    if (initialDeck.length === 0) {
      alert("選択された単元に問題がありません。別の単元を選んでください。");
      return;
    }

    setDeckOptions(options);
    setDeck(initialDeck);
    setViewState("playing");
  };

  // 試合終了・結果反映
  const handleFinishGame = (summary: GameSummary) => {
    setLatestSummary(summary);
    setViewState("result");

    const updatedPlayer = applyKnockProgress(player, summary);
    handleUpdatePlayer(updatedPlayer);

    try {
      const weakJson = localStorage.getItem(WEAK_QUESTIONS_KEY);
      if (weakJson) setWeakIds(JSON.parse(weakJson));
    } catch {
      // ignore
    }
  };

  // 中断時の成果保存処理
  const handleAbortGame = (delta?: KnockProgressDelta) => {
    soundEngine.playTap();
    if (delta && delta.totalQuestions > 0) {
      const updatedPlayer = applyKnockProgress(player, delta);
      handleUpdatePlayer(updatedPlayer);
      setAbortSavedToast({
        totalQuestions: delta.totalQuestions,
        hits: delta.hits,
        earnedLxp: delta.earnedLxp,
      });
      setTimeout(() => setAbortSavedToast(null), 5000);
    }
    setViewState("lobby");
  };

  const overall = calculateOverallRank(player.stats);
  const currentBat = BAT_EQUIPMENTS.find((b) => b.tier === player.selectedBatTier) || BAT_EQUIPMENTS[0];

  // 出題対象問題数
  const targetCount = ALL_SOCIAL_QUESTIONS.filter((q) => {
    if (selectedSubject !== "ALL" && q.subject !== selectedSubject) return false;
    if (selectedChapter !== "ALL" && q.chapter !== selectedChapter) return false;
    return true;
  }).length;

  const selectedFieldLabel =
    selectedSubject === "ALL"
      ? "全分野シャッフル (1,331問)"
      : selectedChapter === "ALL"
      ? `${selectedSubject} 全部 (${targetCount}問)`
      : `${selectedSubject}・${selectedChapter} (${targetCount}問)`;

  return (
    <div className="min-h-screen w-full bg-[#0B0D12] bg-halftone text-white flex flex-col items-center justify-start p-4 sm:p-6 select-none">
      {/* 選手育成・ロッカールームモーダル */}
      <BaseballLockerModal
        isOpen={isLockerOpen}
        onClose={() => setIsLockerOpen(false)}
        player={player}
        onUpdatePlayer={handleUpdatePlayer}
      />

      {/* 試合中画面 */}
      {viewState === "playing" && (
        <SocialBaseballGame
          initialDeck={deck}
          deckOptions={deckOptions}
          player={player}
          onFinishGame={handleFinishGame}
          onAbort={handleAbortGame}
        />
      )}

      {/* 試合結果画面 */}
      {viewState === "result" && latestSummary && (
        <SocialGameResult
          summary={latestSummary}
          onPlayAgain={() => {
            soundEngine.playTap();
            handleStartInfiniteKnock();
          }}
          onBackToLobby={() => {
            soundEngine.playTap();
            setViewState("lobby");
          }}
        />
      )}

      {/* ロビー画面 */}
      {viewState === "lobby" && (
        <div className="w-full max-w-md space-y-3.5 pb-12">
          {/* 中断成果保存トースト */}
          <AnimatePresence>
            {abortSavedToast && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="bg-gradient-to-r from-[#0369A1]/90 via-[#0284C7]/90 to-[#0369A1]/90 border border-[#38BDF8] rounded-xl p-3 flex items-center justify-between shadow-lg text-white"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">💾</span>
                  <div>
                    <div className="text-xs font-black flex items-center gap-1.5">
                      <span>特訓成果を記録・保存しました！</span>
                      <span className="text-[#FACC15]">+{abortSavedToast.earnedLxp} LXP</span>
                    </div>
                    <div className="text-[10px] text-sky-100">
                      ノック {abortSavedToast.totalQuestions}本中 {abortSavedToast.hits}本捕球（ステータス反映済）
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setAbortSavedToast(null)}
                  className="text-white/60 hover:text-white text-xs p-1"
                >
                  ✕
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* トップナビゲーション */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              onClick={() => soundEngine.playTap()}
              className="px-3 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#334155] border border-[#475569] text-[#94A3B8] hover:text-white text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>教科選択へ戻る</span>
            </Link>

            <button
              onClick={() => {
                soundEngine.playTap();
                setIsLockerOpen(true);
              }}
              className="px-2.5 py-1 rounded-lg bg-[#111827] border border-[#334155] hover:border-[#FACC15] text-xs font-black text-[#FACC15] flex items-center gap-1.5 transition active:scale-95 shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 fill-[#FACC15]" />
              <span>{player.exp.toLocaleString()} LXP</span>
            </button>
          </div>

          {/* 1. 選手ステータス ＆ 3大能力カード */}
          <div className="bg-gradient-to-br from-[#1E293B] via-[#1C0D12] to-[#0B0D12] border-2 border-white p-4 sm:p-5 rounded-3xl shadow-p5-red relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#EF4444]/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => {
                      soundEngine.playTap();
                      setIsLockerOpen(true);
                    }}
                    className="w-16 h-16 rounded-2xl bg-[#090D16] border-2 border-[#EF4444] flex items-center justify-center p-1 relative shadow-inner cursor-pointer hover:scale-105 active:scale-95 transition shrink-0"
                  >
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
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#EF4444] text-white">
                        Lv.{player.level}
                      </span>
                      <h1 className="text-base font-black italic text-white tracking-wide">
                        {player.name}
                      </h1>
                    </div>

                    <div className="text-[11px] text-[#FACC15] font-black mt-1">
                      装備: {currentBat.name.split("の")[1] || currentBat.name}
                    </div>

                    {/* 性別切り替え */}
                    <div className="flex items-center gap-1 mt-1.5">
                      <button
                        onClick={() => {
                          soundEngine.playTap();
                          handleUpdatePlayer({ ...player, gender: "boy" });
                        }}
                        className={`px-2 py-0.5 rounded text-[9px] font-black transition ${
                          player.gender === "boy"
                            ? "bg-[#38BDF8] text-slate-950"
                            : "text-[#94A3B8] hover:text-white"
                        }`}
                      >
                        男子 👦
                      </button>
                      <button
                        onClick={() => {
                          soundEngine.playTap();
                          handleUpdatePlayer({ ...player, gender: "girl" });
                        }}
                        className={`px-2 py-0.5 rounded text-[9px] font-black transition ${
                          player.gender === "girl"
                            ? "bg-[#F43F5E] text-white"
                            : "text-[#94A3B8] hover:text-white"
                        }`}
                      >
                        女子 👧
                      </button>
                    </div>
                  </div>
                </div>

                {/* 総合ランク */}
                <div className="text-right">
                  <span className="text-[9px] font-bold text-[#94A3B8] block">総合ランク</span>
                  <div
                    style={{ color: overall.color }}
                    className="text-3xl font-black italic tracking-wider leading-none"
                  >
                    {overall.rank}
                  </div>
                  <span className="text-[10px] text-[#CBD5E1] font-bold">
                    能力値 {overall.average}
                  </span>
                </div>
              </div>

              {/* 3大ステータス ミニインジケータ */}
              <div className="grid grid-cols-3 gap-1.5 pt-1 text-center text-xs">
                <div className="bg-[#083344]/60 border border-[#06B6D4]/40 p-1.5 rounded-xl">
                  <span className="text-[9px] text-[#38BDF8] font-bold block">地理力</span>
                  <span className="text-sm font-black text-white">{player.stats.geo}</span>
                </div>
                <div className="bg-[#451A03]/60 border border-[#F59E0B]/40 p-1.5 rounded-xl">
                  <span className="text-[9px] text-[#FBBF24] font-bold block">歴史力</span>
                  <span className="text-sm font-black text-white">{player.stats.history}</span>
                </div>
                <div className="bg-[#064E3B]/60 border border-[#10B981]/40 p-1.5 rounded-xl">
                  <span className="text-[9px] text-[#34D399] font-bold block">公民力</span>
                  <span className="text-sm font-black text-white">{player.stats.civics}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ★ ファーストビュー：特大メインゲームスタートボタン（英語アプリ同様の特大3D立体出撃CTA） */}
          <div className="relative pt-1 pb-1">
            {/* 背後で拍動する高輝度ネオングローオーラ */}
            <div className="pointer-events-none absolute inset-x-2 -inset-y-1 blur-xl opacity-60 bg-gradient-to-r from-[#EF4444] via-[#F59E0B] to-[#EF4444] animate-pulse" />

            {/* 上部インジケータ */}
            <div className="flex items-center justify-between px-2 mb-1.5 relative z-10 text-[11px] font-black">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping shrink-0" />
                <span className="text-[#FACC15] shrink-0">KNOCK READY</span>
                <span className="text-slate-500 font-normal">/</span>
                <span className="text-white truncate max-w-[200px] drop-shadow-sm font-bold">
                  {selectedFieldLabel}
                </span>
              </div>
              <div className="text-[10px] font-black text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded-full border border-slate-700/80 shrink-0 ml-1">
                対象: {targetCount}問
              </div>
            </div>

            {/* 特大3D立体プッシュボタン本体 */}
            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => {
                soundEngine.playTap();
                handleStartInfiniteKnock();
              }}
              className="w-full relative group overflow-hidden border-2 border-white -skew-x-6 transition-all duration-150 select-none cursor-pointer bg-gradient-to-r from-[#DC2626] via-[#EF4444] to-[#F97316] text-white shadow-[0_7px_0_#991B1B,0_14px_24px_rgba(239,68,68,0.45)] active:translate-y-1.5 active:shadow-[0_1px_0_#991B1B]"
            >
              {/* シャインエフェクト */}
              <span className="pointer-events-none absolute -inset-y-4 -inset-x-12 w-20 bg-gradient-to-r from-transparent via-white/70 to-transparent skew-x-12 animate-glint-sweep" />

              <div className="skew-x-6 px-4 py-3 sm:py-3.5 flex items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-xl border-2 border-white flex items-center justify-center shrink-0 shadow-[2px_2px_0_#0B0D12] bg-[#0B0D12] text-[#FACC15]">
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current ml-0.5 animate-pulse" />
                  </div>

                  <div className="text-left min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-[#78350F] text-amber-100">
                        無限ノック
                      </span>
                      <span className="text-[11px] font-bold opacity-90 truncate text-slate-200">
                        {selectedSubject === "ALL" ? "全分野総力戦" : `${selectedSubject} 特訓`}
                      </span>
                    </div>
                    <div className="text-base sm:text-lg font-black tracking-wide flex items-center gap-1.5 mt-0.5 drop-shadow-sm leading-tight text-white">
                      <span>ゲームスタート！</span>
                      <span className="text-xs sm:text-sm text-[#FACC15]">PLAY BALL</span>
                    </div>
                  </div>
                </div>

                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border-2 border-white flex items-center justify-center shrink-0 shadow-[2px_2px_0_#0B0D12] bg-[#78350F] text-white group-hover:translate-x-1 transition-transform">
                  <ChevronRight className="w-6 h-6 stroke-[3]" />
                </div>
              </div>
            </motion.button>
          </div>

          {/* 2. トータルノック記録（キャリアスタッツ） */}
          <div className="bg-[#111827] border-2 border-[#334155] p-3 rounded-2xl shadow-md">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-black text-white flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-[#FACC15]" />
                <span>通算ノック記録 (CAREER STATS)</span>
              </span>
              <span className="text-[10px] font-bold text-[#94A3B8]">
                正解率{" "}
                {player.career.totalKnocks > 0
                  ? Math.round((player.career.totalCatches / player.career.totalKnocks) * 100)
                  : 0}
                %
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-[#0B0D12] p-2 rounded-xl border border-[#262D3D]">
                <span className="text-[9px] text-[#94A3B8] block">トータルノック</span>
                <span className="text-sm font-black text-white">{player.career.totalKnocks} 本</span>
              </div>
              <div className="bg-[#0B0D12] p-2 rounded-xl border border-[#262D3D]">
                <span className="text-[9px] text-[#10B981] block">ナイス捕球(正解)</span>
                <span className="text-sm font-black text-[#10B981]">{player.career.totalCatches} 本</span>
              </div>
              <div className="bg-[#0B0D12] p-2 rounded-xl border border-[#262D3D]">
                <span className="text-[9px] text-[#38BDF8] block">最高連続捕球</span>
                <span className="text-sm font-black text-[#38BDF8]">{player.career.maxCombo} 連</span>
              </div>
            </div>
          </div>

          {/* 3. メインモード：『無限ノック一問一答』出題範囲セレクター */}
          <div className="bg-[#111827] border-2 border-[#334155] p-4 rounded-3xl space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[9px] font-black tracking-widest text-[#EF4444] uppercase block">
                  MAIN GAME MODE
                </span>
                <h2 className="text-sm font-black italic text-white flex items-center gap-1.5">
                  <span>🧢🔥</span>
                  <span>無限ノック一問一答 〜出題分野を選択〜</span>
                </h2>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30">
                該当 {targetCount} 問
              </span>
            </div>

            {/* ファーストビュー：大きく4択ボタン */}
            <div className="grid grid-cols-2 gap-2">
              {/* ① 全分野シャッフル */}
              <button
                onClick={() => handleSelectField("ALL")}
                className={`p-3 rounded-2xl border-2 text-left transition flex flex-col justify-between ${
                  selectedSubject === "ALL"
                    ? "bg-gradient-to-br from-[#B91C1C] to-[#EF4444] border-white text-white shadow-lg scale-[1.01]"
                    : "bg-[#1E293B] border-[#334155] text-[#CBD5E1] hover:border-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">🔥</span>
                  <span className="text-[10px] font-black opacity-80">1,331問</span>
                </div>
                <div>
                  <div className="text-xs font-black">全分野シャッフル</div>
                  <div className="text-[9px] opacity-75">地理・歴史・公民の総力戦</div>
                </div>
              </button>

              {/* ② 地理全部 */}
              <button
                onClick={() => handleSelectField("地理")}
                className={`p-3 rounded-2xl border-2 text-left transition flex flex-col justify-between ${
                  selectedSubject === "地理" && selectedChapter === "ALL"
                    ? "bg-gradient-to-br from-[#083344] to-[#06B6D4] border-white text-white shadow-lg scale-[1.01]"
                    : "bg-[#1E293B] border-[#334155] text-[#CBD5E1] hover:border-[#06B6D4]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">🌏</span>
                  <span className="text-[10px] font-black opacity-80">{GEOGRAPHY_QUESTIONS.length}問</span>
                </div>
                <div>
                  <div className="text-xs font-black">地理 全部</div>
                  <div className="text-[9px] opacity-75">世界と日本・気候・地域</div>
                </div>
              </button>

              {/* ③ 歴史全部 */}
              <button
                onClick={() => handleSelectField("歴史")}
                className={`p-3 rounded-2xl border-2 text-left transition flex flex-col justify-between ${
                  selectedSubject === "歴史" && selectedChapter === "ALL"
                    ? "bg-gradient-to-br from-[#451A03] to-[#F59E0B] border-white text-white shadow-lg scale-[1.01]"
                    : "bg-[#1E293B] border-[#334155] text-[#CBD5E1] hover:border-[#F59E0B]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">🏯</span>
                  <span className="text-[10px] font-black opacity-80">{HISTORY_QUESTIONS.length}問</span>
                </div>
                <div>
                  <div className="text-xs font-black">歴史 全部</div>
                  <div className="text-[9px] opacity-75">古代から現代の出来事・人物</div>
                </div>
              </button>

              {/* ④ 公民全部 */}
              <button
                onClick={() => handleSelectField("公民")}
                className={`p-3 rounded-2xl border-2 text-left transition flex flex-col justify-between ${
                  selectedSubject === "公民" && selectedChapter === "ALL"
                    ? "bg-gradient-to-br from-[#064E3B] to-[#10B981] border-white text-white shadow-lg scale-[1.01]"
                    : "bg-[#1E293B] border-[#334155] text-[#CBD5E1] hover:border-[#10B981]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">⚖️</span>
                  <span className="text-[10px] font-black opacity-80">{CIVICS_QUESTIONS.length}問</span>
                </div>
                <div>
                  <div className="text-xs font-black">公民 全部</div>
                  <div className="text-[9px] opacity-75">憲法・政治・経済・国際社会</div>
                </div>
              </button>
            </div>

            {/* 各科目の詳細単元アコーディオン */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-[#94A3B8] block px-1">
                ▼ 単元をピンポイントで絞り込む（アコーディオン）:
              </span>

              {(["地理", "歴史", "公民"] as SocialSubject[]).map((subj) => {
                const isOpen = openAccordion === subj;
                const meta = SUBJECT_META[subj];
                const chapters = SUBJECT_CHAPTERS[subj];

                return (
                  <div
                    key={subj}
                    className="border border-[#334155] rounded-2xl overflow-hidden bg-[#0B0D12]"
                  >
                    <button
                      onClick={() => toggleAccordion(subj)}
                      className="w-full px-3 py-2 flex items-center justify-between hover:bg-[#1E293B]/70 transition"
                    >
                      <div className="flex items-center gap-2 text-xs font-black">
                        <span>{meta.icon}</span>
                        <span className="text-white">{subj}の章一覧</span>
                        <span className="text-[10px] text-[#94A3B8]">({chapters.length}章)</span>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="p-2 space-y-1 bg-[#090D16] border-t border-[#334155]/60 text-xs">
                        <button
                          onClick={() => {
                            soundEngine.playTap();
                            setSelectedSubject(subj);
                            setSelectedChapter("ALL");
                          }}
                          className={`w-full py-1.5 px-2.5 rounded-xl text-left font-bold transition flex items-center justify-between ${
                            selectedSubject === subj && selectedChapter === "ALL"
                              ? "bg-white text-slate-950 font-black"
                              : "text-[#94A3B8] hover:text-white hover:bg-[#1E293B]"
                          }`}
                        >
                          <span>{subj}の全範囲（全問）</span>
                          <span className="text-[10px]">{meta.count}問</span>
                        </button>

                        {chapters.map((ch) => {
                          const isSelected = selectedSubject === subj && selectedChapter === ch;
                          const chCount = ALL_SOCIAL_QUESTIONS.filter(
                            (q) => q.subject === subj && q.chapter === ch
                          ).length;

                          return (
                            <button
                              key={ch}
                              onClick={() => {
                                soundEngine.playTap();
                                setSelectedSubject(subj);
                                setSelectedChapter(ch);
                              }}
                              className={`w-full py-1.5 px-2.5 rounded-xl text-left font-bold transition flex items-center justify-between ${
                                isSelected
                                  ? "bg-[#FACC15] text-slate-950 font-black shadow-sm"
                                  : "text-[#CBD5E1] hover:text-white hover:bg-[#1E293B]"
                              }`}
                            >
                              <span className="truncate pr-2">{ch}</span>
                              <span className="text-[10px] shrink-0 opacity-75">{chCount}問</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 無限ノック開始ビッグボタン */}
            <button
              onClick={() => handleStartInfiniteKnock()}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#B91C1C] via-[#DC2626] to-[#EF4444] hover:brightness-110 border-2 border-white text-white font-black text-left shadow-p5-red active:scale-[0.99] transition flex items-center justify-between group mt-2"
            >
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[9px] bg-black/40 text-[#FACC15] border border-white/20">
                    鬼コーチの猛特訓
                  </span>
                  <span className="text-xs font-black text-white">
                    {selectedSubject === "ALL"
                      ? "全分野シャッフル"
                      : `${selectedSubject} (${selectedChapter === "ALL" ? "全章" : selectedChapter})`}
                  </span>
                </div>
                <div className="text-base font-black italic tracking-wide group-hover:translate-x-0.5 transition">
                  『無限ノック一問一答』プレイボール！
                </div>
                <div className="text-[11px] text-[#FEE2E2] font-normal">
                  まずは10本！捕球するほどキャラの地理・歴史・公民ステータスが急成長！
                </div>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-black/30 border border-white/30 flex items-center justify-center shrink-0 ml-2 group-hover:scale-110 transition shadow-md">
                <Play className="w-6 h-6 fill-white" />
              </div>
            </button>
          </div>

          {/* ★ 画面右下固定（Fix）ゲームスタートFABボタン */}
          <div className="fixed bottom-5 right-4 sm:right-6 z-40">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                soundEngine.playTap();
                handleStartInfiniteKnock();
              }}
              className="group relative flex items-center gap-2.5 px-4 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#DC2626] via-[#EF4444] to-[#F97316] text-white font-black shadow-[0_6px_20px_rgba(239,68,68,0.5),0_2px_0_#991B1B] border-2 border-white hover:brightness-110 active:translate-y-0.5 active:shadow-[0_1px_0_#991B1B] transition select-none cursor-pointer"
            >
              {/* ネオンパルスオーラ */}
              <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[#EF4444] to-[#FACC15] blur-sm opacity-70 group-hover:opacity-100 animate-pulse pointer-events-none" />

              <div className="relative z-10 flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 border border-white/40 flex items-center justify-center shrink-0">
                  <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white ml-0.5" />
                </div>
                <div className="text-left pr-1">
                  <div className="text-[9px] font-black text-amber-200 tracking-wider leading-none">
                    {selectedSubject === "ALL" ? "全分野" : selectedSubject}
                  </div>
                  <div className="text-xs sm:text-sm font-black italic tracking-wide leading-tight mt-0.5 drop-shadow">
                    ゲームスタート
                  </div>
                </div>
              </div>
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
