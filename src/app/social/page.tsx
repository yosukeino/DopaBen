"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
import { PlayerProfile } from "@/lib/types";

const DOPA_PROFILE_KEY = "dopaben_player_profile_v1";
const SOCIAL_STATS_KEY = "dopasoc_stats_v1";
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
  // 画面遷移
  const [viewState, setViewState] = useState<"lobby" | "playing" | "result">("lobby");

  // 設定
  const [gender, setGender] = useState<"boy" | "girl">("boy");
  const [teamColor, setTeamColor] = useState<string>("#EF4444");
  const [selectedSubject, setSelectedSubject] = useState<SocialSubject | "ALL">("ALL");
  const [selectedChapter, setSelectedChapter] = useState<string>("ALL");
  const [selectedStage, setSelectedStage] = useState<1 | 2 | "ALL">("ALL");

  // デッキ・ゲーム進行
  const [gameMode, setGameMode] = useState<"game9" | "quick" | "endless" | "review">("game9");
  const [deck, setDeck] = useState<GeneratedSocialQuestion[]>([]);
  const [latestSummary, setLatestSummary] = useState<GameSummary | null>(null);

  // 永続データ
  const [stats, setStats] = useState<SocialStats>(DEFAULT_STATS);
  const [weakIds, setWeakIds] = useState<number[]>([]);
  const [playerExp, setPlayerExp] = useState<number>(0);

  // 初回マウント時にローカルストレージからデータ読み込み
  useEffect(() => {
    try {
      // 共通プロファイル
      const profileJson = localStorage.getItem(DOPA_PROFILE_KEY);
      if (profileJson) {
        const p: PlayerProfile = JSON.parse(profileJson);
        setPlayerExp(p.exp ?? 0);
        if (p.gender) setGender(p.gender);
      }

      // 社会科スタッツ
      const statsJson = localStorage.getItem(SOCIAL_STATS_KEY);
      if (statsJson) {
        setStats(JSON.parse(statsJson));
      }

      // 弱点問題ID
      const weakJson = localStorage.getItem(WEAK_QUESTIONS_KEY);
      if (weakJson) {
        setWeakIds(JSON.parse(weakJson));
      }
    } catch {
      // ignore
    }
  }, []);

  // 科目切り替え時に章の選択をリセット
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
    if (mode === "endless") questionLimit = 30; // 3アウトまで
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
    try {
      localStorage.setItem(SOCIAL_STATS_KEY, JSON.stringify(newStats));

      // DopaBen全体プロファイルのLXP加算
      const profileJson = localStorage.getItem(DOPA_PROFILE_KEY);
      if (profileJson) {
        const p: PlayerProfile = JSON.parse(profileJson);
        p.exp = (p.exp ?? 0) + summary.earnedLxp;
        p.totalLxp = (p.totalLxp ?? 0) + summary.earnedLxp;
        localStorage.setItem(DOPA_PROFILE_KEY, JSON.stringify(p));
        setPlayerExp(p.exp);
      }

      // 弱点問題ID更新
      const weakJson = localStorage.getItem(WEAK_QUESTIONS_KEY);
      if (weakJson) {
        setWeakIds(JSON.parse(weakJson));
      }
    } catch {
      // ignore
    }
  };

  // 打率計算
  const battingAvg =
    stats.totalAtBats > 0
      ? (stats.totalHits / stats.totalAtBats).toFixed(3).replace(/^0/, "")
      : ".000";

  // 現在のフィルターで該当する問題数
  const filteredQuestionCount = ALL_SOCIAL_QUESTIONS.filter((q) => {
    if (selectedSubject !== "ALL" && q.subject !== selectedSubject) return false;
    if (selectedChapter !== "ALL" && q.chapter !== selectedChapter) return false;
    if (selectedStage !== "ALL" && q.stage !== selectedStage) return false;
    return true;
  }).length;

  return (
    <div className="min-h-screen w-full bg-[#0B0D12] bg-halftone text-white flex flex-col items-center justify-start p-4 sm:p-6 select-none">
      {/* 試合中画面 */}
      {viewState === "playing" && (
        <SocialBaseballGame
          deck={deck}
          mode={gameMode}
          gender={gender}
          teamColor={teamColor}
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
        <div className="w-full max-w-md space-y-4 pb-12">
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

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-[#111827] border border-[#334155] text-xs font-black text-[#FACC15] flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-[#FACC15]" />
                <span>{playerExp.toLocaleString()} LXP</span>
              </span>
            </div>
          </div>

          {/* メインヒーローカード */}
          <div className="bg-gradient-to-br from-[#1E293B] via-[#1C0D12] to-[#0B0D12] border-2 border-white p-5 rounded-2xl shadow-p5-red relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#EF4444]/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⚾</span>
                  <div>
                    <span className="text-[10px] font-black tracking-widest text-[#EF4444] uppercase">
                      Baseball × Social Studies Battle
                    </span>
                    <h1 className="text-xl font-black italic text-white tracking-wide">
                      DopaSoc 〜熱闘！社会科ベースボール〜
                    </h1>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#CBD5E1] leading-relaxed">
                中学社会の一問一答（全1,331問）をフルスイングで打ち返せ！
                地理・歴史・公民の知識で甲子園の頂点を目指せ！
              </p>

              {/* キャラクター＆チームカラーカスタマイズ */}
              <div className="pt-2 flex items-center justify-between border-t border-[#334155]">
                {/* ミニプレビュー */}
                <div className="flex items-center gap-2.5">
                  <div className="w-12 h-12 rounded-xl bg-[#090D16] border border-[#475569] flex items-center justify-center p-1">
                    <BaseballCharacter
                      gender={gender}
                      pose="stance"
                      size={44}
                      teamColor={teamColor}
                      animate={true}
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#94A3B8] font-bold block">部員設定</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          soundEngine.playTap();
                          setGender("boy");
                        }}
                        className={`px-2 py-0.5 rounded text-[10px] font-black transition ${
                          gender === "boy"
                            ? "bg-[#38BDF8] text-slate-950 font-black"
                            : "text-[#94A3B8] hover:text-white"
                        }`}
                      >
                        男子 👦
                      </button>
                      <button
                        onClick={() => {
                          soundEngine.playTap();
                          setGender("girl");
                        }}
                        className={`px-2 py-0.5 rounded text-[10px] font-black transition ${
                          gender === "girl"
                            ? "bg-[#F43F5E] text-white font-black"
                            : "text-[#94A3B8] hover:text-white"
                        }`}
                      >
                        女子 👧
                      </button>
                    </div>
                  </div>
                </div>

                {/* チームカラー選択 */}
                <div className="flex items-center gap-1.5">
                  {TEAM_COLORS.map((tc) => (
                    <button
                      key={tc.color}
                      onClick={() => {
                        soundEngine.playTap();
                        setTeamColor(tc.color);
                      }}
                      style={{ backgroundColor: tc.color }}
                      className={`w-5 h-5 rounded-full border-2 transition ${
                        teamColor === tc.color ? "border-white scale-110 shadow-sm" : "border-transparent opacity-60"
                      }`}
                      title={tc.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 通算スタッツ（打率、ホームラン、総得点） */}
          <div className="bg-[#111827] border-2 border-[#334155] p-3.5 rounded-2xl shadow-md">
            <div className="flex items-center justify-between mb-2">
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
          <div className="bg-[#111827] border-2 border-[#334155] p-4 rounded-2xl space-y-3 shadow-md">
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
                <label className="text-[10px] font-bold text-[#94A3B8]">
                  章・単元の指定:
                </label>
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

            {/* 難易度ステージ選択 */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-[10px] font-bold text-[#94A3B8]">難易度:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    soundEngine.playTap();
                    setSelectedStage("ALL");
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition ${
                    selectedStage === "ALL"
                      ? "bg-[#475569] text-white"
                      : "text-[#94A3B8] hover:text-white"
                  }`}
                >
                  すべて
                </button>
                <button
                  onClick={() => {
                    soundEngine.playTap();
                    setSelectedStage(1);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition ${
                    selectedStage === 1
                      ? "bg-[#10B981] text-slate-950"
                      : "text-[#94A3B8] hover:text-white"
                  }`}
                >
                  標準 (Stage 1)
                </button>
                <button
                  onClick={() => {
                    soundEngine.playTap();
                    setSelectedStage(2);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition ${
                    selectedStage === 2
                      ? "bg-[#EF4444] text-white"
                      : "text-[#94A3B8] hover:text-white"
                  }`}
                >
                  発展 (Stage 2)
                </button>
              </div>
            </div>
          </div>

          {/* ゲームモード出撃カード */}
          <div className="space-y-2.5 pt-1">
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
                    おすすめ看板モード
                  </span>
                  <span className="text-xs font-black text-white">全9打席勝負</span>
                </div>
                <div className="text-base font-black italic tracking-wide group-hover:translate-x-0.5 transition">
                  9回熱闘甲子園バトル
                </div>
                <div className="text-[11px] text-[#FEE2E2] font-normal">
                  1打席1問勝負！クリーンヒットやホームランで得点を重ねて優勝を目指せ！
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
                  <span className="text-[10px] text-[#38BDF8] font-bold">手軽に復習</span>
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
