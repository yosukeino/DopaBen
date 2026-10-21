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
  Filter,
  Swords,
  TrendingUp,
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
  DEFAULT_BASEBALL_PLAYER,
  BAT_EQUIPMENTS,
  PLAYER_RANKS,
} from "@/lib/baseballGrowthEngine";
import { PlayerProfile } from "@/lib/types";

const DOPA_PROFILE_KEY = "dopaben_player_profile_v1";
const SOCIAL_STATS_KEY = "dopasoc_stats_v1";
const SOCIAL_PLAYER_KEY = "dopasoc_player_v2";
const WEAK_QUESTIONS_KEY = "dopasoc_weak_question_ids";

interface SocialStats {
  totalGames: number;
  totalAtBats: number;
  totalHits: number;
  totalHomeruns: number;
  totalRuns: number;
  highestRuns: number;
  highestCombo: number;
}

const DEFAULT_STATS: SocialStats = {
  totalGames: 0,
  totalAtBats: 0,
  totalHits: 0,
  totalHomeruns: 0,
  totalRuns: 0,
  highestRuns: 0,
  highestCombo: 0,
};

const TEAM_COLORS = [
  { name: "クリムゾン", color: "#EF4444" },
  { name: "ゴールド", color: "#FACC15" },
  { name: "スカイ", color: "#38BDF8" },
  { name: "エメラルド", color: "#10B981" },
];

export default function DopaSocPage() {
  const [viewState, setViewState] = useState<"lobby" | "playing" | "result">("lobby");
  const [isLockerOpen, setIsLockerOpen] = useState(false);

  // 選手育成プロファイル
  const [player, setPlayer] = useState<BaseballPlayerProfile>(DEFAULT_BASEBALL_PLAYER);

  // 設定・出題フィルター
  const [selectedSubject, setSelectedSubject] = useState<SocialSubject | "ALL">("ALL");
  const [selectedChapter, setSelectedChapter] = useState<string>("ALL");
  const [selectedStage, setSelectedStage] = useState<1 | 2 | "ALL">("ALL");

  // デッキ・ゲーム進行
  const [gameMode, setGameMode] = useState<"game9" | "quick" | "endless" | "review">("game9");
  const [deck, setDeck] = useState<GeneratedSocialQuestion[]>([]);
  const [latestSummary, setLatestSummary] = useState<GameSummary | null>(null);

  // 統計データ
  const [stats, setStats] = useState<SocialStats>(DEFAULT_STATS);
  const [weakIds, setWeakIds] = useState<number[]>([]);

  // 初回マウント時にローカルストレージから読み込み
  useEffect(() => {
    try {
      // 共通プロファイル
      const profileJson = localStorage.getItem(DOPA_PROFILE_KEY);
      let globalLxp = 0;
      let globalGender: "boy" | "girl" = "boy";
      if (profileJson) {
        const p: PlayerProfile = JSON.parse(profileJson);
        globalLxp = p.exp ?? 0;
        if (p.gender) globalGender = p.gender;
      }

      // 社会科選手プロファイル
      const storedPlayer = localStorage.getItem(SOCIAL_PLAYER_KEY);
      if (storedPlayer) {
        setPlayer(JSON.parse(storedPlayer));
      } else {
        // 初期化
        const initPlayer: BaseballPlayerProfile = {
          ...DEFAULT_BASEBALL_PLAYER,
          gender: globalGender,
          exp: globalLxp,
          totalLxp: globalLxp,
        };
        setPlayer(initPlayer);
      }

      // スタッツ
      const statsJson = localStorage.getItem(SOCIAL_STATS_KEY);
      if (statsJson) setStats(JSON.parse(statsJson));

      // 弱点問題ID
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

      // グローバルプロファイルのLXPも同期
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

  const handleSubjectChange = (subj: SocialSubject | "ALL") => {
    soundEngine.playTap();
    setSelectedSubject(subj);
    setSelectedChapter("ALL");
  };

  // 試合開始
  const handleStartGame = (mode: "game9" | "quick" | "endless" | "review") => {
    soundEngine.playPlayBall();

    let questionLimit = 10;
    if (mode === "game9") questionLimit = 9;
    if (mode === "endless") questionLimit = 30;
    if (mode === "review") questionLimit = Math.min(20, weakIds.length || 10);

    const generatedDeck = generateSocialQuizDeck({
      subject: selectedSubject,
      chapter: selectedChapter,
      stage: selectedStage,
      limit: questionLimit,
      reviewIds: mode === "review" ? weakIds : undefined,
    });

    if (generatedDeck.length === 0) {
      alert("選択された条件に一致する問題がありません。フィルターを変更してください。");
      return;
    }

    setGameMode(mode);
    setDeck(generatedDeck);
    setViewState("playing");
  };

  // 試合終了コールバック
  const handleFinishGame = (summary: GameSummary) => {
    setLatestSummary(summary);
    setViewState("result");

    // スタッツ更新
    const newStats: SocialStats = {
      totalGames: stats.totalGames + 1,
      totalAtBats: stats.totalAtBats + summary.totalQuestions,
      totalHits: stats.totalHits + summary.hits,
      totalHomeruns: stats.totalHomeruns + summary.homeruns,
      totalRuns: stats.totalRuns + summary.runs,
      highestRuns: Math.max(stats.highestRuns, summary.runs),
      highestCombo: Math.max(stats.highestCombo, summary.maxCombo),
    };
    setStats(newStats);

    // 選手プロファイルの成長（LXP獲得＆レベルアップ判定）
    const newTotalLxp = player.totalLxp + summary.earnedLxp;
    const newExp = player.exp + summary.earnedLxp;
    const rankInfo = calculateLevelFromTotalLxp(newTotalLxp);
    const hasLeveledUp = rankInfo.level > player.level;

    const updatedPlayer: BaseballPlayerProfile = {
      ...player,
      exp: newExp,
      totalLxp: newTotalLxp,
      level: rankInfo.level,
    };
    handleUpdatePlayer(updatedPlayer);

    if (hasLeveledUp) {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.4 },
        colors: ["#FACC15", "#EF4444", "#38BDF8", "#FFFFFF"],
      });
    }

    try {
      localStorage.setItem(SOCIAL_STATS_KEY, JSON.stringify(newStats));
      const weakJson = localStorage.getItem(WEAK_QUESTIONS_KEY);
      if (weakJson) setWeakIds(JSON.parse(weakJson));
    } catch {
      // ignore
    }
  };

  const battingAvg =
    stats.totalAtBats > 0
      ? (stats.totalHits / stats.totalAtBats).toFixed(3).replace(/^0/, "")
      : ".000";

  const overall = calculateOverallRank(player.stats);
  const currentBat = BAT_EQUIPMENTS.find((b) => b.tier === player.selectedBatTier) || BAT_EQUIPMENTS[0];

  const filteredQuestionCount = ALL_SOCIAL_QUESTIONS.filter((q) => {
    if (selectedSubject !== "ALL" && q.subject !== selectedSubject) return false;
    if (selectedChapter !== "ALL" && q.chapter !== selectedChapter) return false;
    if (selectedStage !== "ALL" && q.stage !== selectedStage) return false;
    return true;
  }).length;

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
          deck={deck}
          mode={gameMode}
          player={player}
          onFinishGame={handleFinishGame}
          onAbort={() => {
            soundEngine.playTap();
            setViewState("lobby");
          }}
        />
      )}

      {/* 試合結果画面 */}
      {viewState === "result" && latestSummary && (
        <SocialGameResult
          summary={latestSummary}
          onPlayAgain={(reviewOnly) => {
            soundEngine.playTap();
            if (reviewOnly) {
              handleStartGame("review");
            } else {
              handleStartGame(gameMode);
            }
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
              {player.exp >= 80 && (
                <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping" />
              )}
            </button>
          </div>

          {/* 選手アバター & 育成ダッシュボードカード */}
          <div className="bg-gradient-to-br from-[#1E293B] via-[#1C0D12] to-[#0B0D12] border-2 border-white p-4 sm:p-5 rounded-3xl shadow-p5-red relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#EF4444]/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-3">
              {/* アバターと選手ステータス */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* アバター */}
                  <div
                    onClick={() => {
                      soundEngine.playTap();
                      setIsLockerOpen(true);
                    }}
                    className="w-16 h-16 rounded-2xl bg-[#090D16] border-2 border-[#EF4444] flex items-center justify-center p-1 relative shadow-inner cursor-pointer hover:scale-105 active:scale-95 transition"
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

                    <div className="flex items-center gap-1.5 mt-1 text-[11px]">
                      <span className="text-[#FACC15] font-black">
                        装備: {currentBat.name.split("の")[1] || currentBat.name}
                      </span>
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

                {/* 総合評価ランク */}
                <div className="text-right">
                  <span className="text-[9px] font-bold text-[#94A3B8] block">選手ランク</span>
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

              {/* 次のバット・称号進化プログレスバー */}
              {(() => {
                const nextBat = BAT_EQUIPMENTS.find((b) => b.unlockLevel > player.level);
                if (!nextBat) return null;
                const nextRank = PLAYER_RANKS.find((r) => r.level === nextBat.unlockLevel);
                if (!nextRank) return null;
                const neededLxp = Math.max(0, nextRank.requiredTotalLxp - player.totalLxp);
                const progressPct = Math.min(100, Math.round((player.totalLxp / nextRank.requiredTotalLxp) * 100));

                return (
                  <div className="bg-[#090D16]/90 border border-[#FACC15]/40 rounded-xl p-2.5 space-y-1.5 shadow-inner">
                    <div className="flex items-center justify-between text-[11px] font-black">
                      <span className="text-[#FACC15] flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-[#FACC15]" />
                        <span>次の装備「{nextBat.name}」まで</span>
                      </span>
                      <span className="text-white">あと {neededLxp.toLocaleString()} LXP</span>
                    </div>

                    <div className="w-full h-2 bg-[#1E293B] rounded-full overflow-hidden p-0.5 border border-[#334155]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPct}%` }}
                        className="h-full bg-gradient-to-r from-[#EF4444] via-[#FACC15] to-[#38BDF8] rounded-full"
                      />
                    </div>
                  </div>
                );
              })()}

              {/* ロッカールーム強化バナー */}
              <button
                onClick={() => {
                  soundEngine.playTap();
                  setIsLockerOpen(true);
                }}
                className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-[#FACC15] via-[#FFE600] to-[#FACC15] hover:brightness-105 text-slate-950 font-black text-xs flex items-center justify-between shadow-md active:scale-95 transition group"
              >
                <div className="flex items-center gap-1.5">
                  <Swords className="w-4 h-4 text-black" />
                  <span>ロッカールームで能力アップ ＆ 装備着せ替え</span>
                </div>
                <div className="flex items-center gap-1 text-[11px]">
                  <span>所持 {player.exp} LXP</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </button>
            </div>
          </div>

          {/* 通算スタッツ */}
          <div className="bg-[#111827] border-2 border-[#334155] p-3 rounded-2xl shadow-md">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-black text-white flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-[#FACC15]" />
                <span>通算成績 (CAREER STATS)</span>
              </span>
              <span className="text-[10px] font-bold text-[#94A3B8]">
                {stats.totalGames} 試合参戦
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-[#0B0D12] p-2 rounded-xl border border-[#262D3D]">
                <span className="text-[9px] text-[#94A3B8] block">打率</span>
                <span className="text-sm font-black text-white">{battingAvg}</span>
              </div>
              <div className="bg-[#0B0D12] p-2 rounded-xl border border-[#262D3D]">
                <span className="text-[9px] text-[#94A3B8] block">安打</span>
                <span className="text-sm font-black text-white">{stats.totalHits}</span>
              </div>
              <div className="bg-[#0B0D12] p-2 rounded-xl border border-[#262D3D]">
                <span className="text-[9px] text-[#EF4444] block">本塁打</span>
                <span className="text-sm font-black text-[#EF4444]">{stats.totalHomeruns}</span>
              </div>
              <div className="bg-[#0B0D12] p-2 rounded-xl border border-[#262D3D]">
                <span className="text-[9px] text-[#FACC15] block">最高得点</span>
                <span className="text-sm font-black text-[#FACC15]">{stats.highestRuns}点</span>
              </div>
            </div>
          </div>

          {/* 教科＆単元選択フィルター */}
          <div className="bg-[#111827] border-2 border-[#334155] p-3.5 rounded-2xl space-y-2.5 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>出題範囲フィルター</span>
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#38BDF8]/20 text-[#38BDF8]">
                該当 {filteredQuestionCount} 問
              </span>
            </div>

            {/* 教科切り替えタブ */}
            <div className="grid grid-cols-4 gap-1.5">
              <button
                onClick={() => handleSubjectChange("ALL")}
                className={`py-2 rounded-xl text-xs font-black transition ${
                  selectedSubject === "ALL"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "bg-[#1E293B] text-[#94A3B8] hover:text-white"
                }`}
              >
                全教科
              </button>
              {(["地理", "歴史", "公民"] as SocialSubject[]).map((subj) => {
                const meta = SUBJECT_META[subj];
                const isSelected = selectedSubject === subj;
                return (
                  <button
                    key={subj}
                    onClick={() => handleSubjectChange(subj)}
                    className={`py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1 transition ${
                      isSelected
                        ? "bg-gradient-to-r text-white shadow-md font-black"
                        : "bg-[#1E293B] text-[#94A3B8] hover:text-white"
                    }`}
                    style={
                      isSelected
                        ? { backgroundColor: meta.color }
                        : {}
                    }
                  >
                    <span>{meta.icon}</span>
                    <span>{subj}</span>
                  </button>
                );
              })}
            </div>

            {/* 章（単元）選択ドロップダウン */}
            {selectedSubject !== "ALL" && (
              <div className="space-y-1">
                <select
                  value={selectedChapter}
                  onChange={(e) => {
                    soundEngine.playTap();
                    setSelectedChapter(e.target.value);
                  }}
                  className="w-full p-2.5 rounded-xl bg-[#0B0D12] border border-[#334155] text-white text-xs font-bold outline-none focus:border-[#38BDF8]"
                >
                  <option value="ALL">全ての章（総合問題）</option>
                  {SUBJECT_CHAPTERS[selectedSubject].map((ch) => (
                    <option key={ch} value={ch}>
                      {ch}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* 試合形式選択カード */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-black text-[#CBD5E1] tracking-wide flex items-center gap-1.5 px-1">
              <span>🏟️</span>
              <span>試合形式を選択してプレイボール:</span>
            </span>

            {/* ① 9回熱闘甲子園 */}
            <button
              onClick={() => handleStartGame("game9")}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#B91C1C] via-[#DC2626] to-[#EF4444] hover:brightness-110 border-2 border-white text-white font-black text-left shadow-p5-red active:scale-[0.99] transition flex items-center justify-between group"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[9px] bg-black/40 text-[#FACC15] border border-white/20">
                    メイン看板モード
                  </span>
                  <span className="text-xs font-black text-white">全9打席</span>
                </div>
                <div className="text-base font-black italic tracking-wide group-hover:translate-x-0.5 transition">
                  9回熱闘甲子園バトル
                </div>
                <div className="text-[11px] text-[#FEE2E2] font-normal">
                  長打・ホームランで得点を重ね、フィーバー突入でハイスコアを目指せ！
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-black/30 border border-white/30 flex items-center justify-center shrink-0 ml-2 group-hover:scale-110 transition">
                <Play className="w-5 h-5 fill-white" />
              </div>
            </button>

            {/* ② 10問クイック特訓 */}
            <button
              onClick={() => handleStartGame("quick")}
              className="w-full p-3.5 rounded-2xl bg-[#1E293B] hover:bg-[#334155] border-2 border-[#475569] hover:border-[#38BDF8] text-white text-left shadow-md active:scale-[0.99] transition flex items-center justify-between group"
            >
              <div className="space-y-0.5 min-w-0">
                <div className="text-sm font-black text-white flex items-center gap-1.5">
                  <span>⚡ 10問サクサクスイング特訓</span>
                  <span className="text-[10px] text-[#38BDF8] font-bold">サクッと育成</span>
                </div>
                <div className="text-[11px] text-[#94A3B8]">
                  隙間時間の1〜2分で10問を瞬時に打ち返すクイックノック！
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#94A3B8] group-hover:text-white group-hover:translate-x-1 transition shrink-0 ml-2" />
            </button>

            {/* ③ エンドレス千本ノック */}
            <button
              onClick={() => handleStartGame("endless")}
              className="w-full p-3.5 rounded-2xl bg-[#1E293B] hover:bg-[#334155] border-2 border-[#475569] hover:border-[#F59E0B] text-white text-left shadow-md active:scale-[0.99] transition flex items-center justify-between group"
            >
              <div className="space-y-0.5 min-w-0">
                <div className="text-sm font-black text-white flex items-center gap-1.5">
                  <span>🔥 エンドレス千本ノック（3アウト制）</span>
                </div>
                <div className="text-[11px] text-[#94A3B8]">
                  3回三振するまで連続で出題！限界までスコアとコンボを伸ばせ！
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#94A3B8] group-hover:text-white group-hover:translate-x-1 transition shrink-0 ml-2" />
            </button>

            {/* ④ 弱点問題リベンジ打席 */}
            {weakIds.length > 0 && (
              <button
                onClick={() => handleStartGame("review")}
                className="w-full p-3.5 rounded-2xl bg-[#2D151B] hover:bg-[#3E1A23] border-2 border-[#EF4444] text-white text-left shadow-md active:scale-[0.99] transition flex items-center justify-between group"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="text-sm font-black text-[#F87171] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#EF4444]" />
                    <span>弱点リベンジ打席（要復習 {weakIds.length} 問）</span>
                  </div>
                  <div className="text-[11px] text-[#CBD5E1]">
                    過去に間違えた問題だけをピックアップして集中的に克服！
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#EF4444] group-hover:translate-x-1 transition shrink-0 ml-2" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
