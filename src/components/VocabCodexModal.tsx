"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Volume2,
  BookOpen,
  CheckCircle2,
  Flame,
  Trophy,
  Search,
} from "lucide-react";
import { WordMasteryRecord } from "@/lib/types";
import { EIKEN1_TRACK_STAGES } from "@/lib/eiken1Data";
import { TARGET1800_STAGES } from "@/lib/target1800Data";
import { getActiveVocabPool } from "@/lib/vocabRepository";
import { soundEngine } from "@/lib/soundEngine";

interface VocabCodexModalProps {
  category?: "ターゲット1800" | "英検1級";
  wordMastery: Record<string, WordMasteryRecord>;
  initialTrack: number;
  onSelectTrackAndStart: (
    trackNumber: number,
    onlyWeak: boolean,
    category: "ターゲット1800" | "英検1級"
  ) => void;
  onClose: () => void;
}

export const VocabCodexModal: React.FC<VocabCodexModalProps> = ({
  category = "ターゲット1800",
  wordMastery,
  initialTrack,
  onSelectTrackAndStart,
  onClose,
}) => {
  const [activeCategory, setActiveCategory] = useState<"ターゲット1800" | "英検1級">(
    category
  );
  const [activeTrack, setActiveTrack] = useState<number>(initialTrack);
  const [filterMode, setFilterMode] = useState<"all" | "weak" | "unseen">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [displayLimit, setDisplayLimit] = useState<number>(80);

  const pool = getActiveVocabPool();
  const isTarget1800 = activeCategory === "ターゲット1800";
  const allCategoryWords = isTarget1800
    ? pool.target1800Words
    : pool.eiken1Words;

  const currentTargetStage = isTarget1800
    ? TARGET1800_STAGES.find((s) => s.unitNumber === activeTrack) ||
      TARGET1800_STAGES[0]
    : null;

  const scopeWords = isTarget1800
    ? currentTargetStage
      ? allCategoryWords.filter((w) =>
          currentTargetStage.levels.includes(w.track || 1)
        )
      : allCategoryWords
    : activeTrack > 0
    ? allCategoryWords.filter((w) => w.track === activeTrack)
    : allCategoryWords;

  const totalMastered = allCategoryWords.filter(
    (w) => (wordMastery[w.id]?.cleared || 0) > 0
  ).length;
  const scopeMastered = scopeWords.filter(
    (w) => (wordMastery[w.id]?.cleared || 0) > 0
  ).length;
  const scopeWeak = scopeWords.filter((w) => {
    const m = wordMastery[w.id];
    return m && m.missed > 0 && m.missed >= m.cleared;
  }).length;

  const filteredWords = scopeWords.filter((w) => {
    const m = wordMastery[w.id];
    if (filterMode === "weak") {
      if (!m || m.missed === 0) return false;
    } else if (filterMode === "unseen") {
      if (m && m.cleared > 0) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      return (
        w.english.toLowerCase().includes(q) ||
        w.japanese.toLowerCase().includes(q) ||
        w.num.includes(q)
      );
    }
    return true;
  });

  const visibleWords = filteredWords.slice(0, displayLimit);

  const activeScopeLabel = isTarget1800
    ? currentTargetStage?.label || "Lv.01"
    : activeTrack === 0
    ? "全96語"
    : `Track 00${activeTrack}`;

  return (
    <div className="fixed inset-0 z-50 bg-[#0C0F0A]/90 backdrop-blur-sm flex items-center justify-center p-3">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md max-h-[90vh] bg-[#141911] border-2 border-white shadow-p5-cyan flex flex-col overflow-hidden"
      >
        {/* ヘッダー */}
        <div className="bg-[#FF206E] p-3.5 flex items-center justify-between border-b-2 border-white">
          <div>
            <div className="text-[10px] font-black text-[#FBFF12] tracking-widest">
              {isTarget1800
                ? "JUNIOR HIGH CODEX // 中学英単語ターゲット1800 全1,800語DB"
                : "EIKEN GRADE 1 CODEX // Unit 01 全96語データベース"}
            </div>
            <h2 className="text-lg font-black text-white flex items-center gap-1.5">
              <BookOpen className="w-5 h-5 text-[#FBFF12]" />
              {isTarget1800
                ? "中学英単語ステージ 図鑑＆制覇率"
                : "英検1級 単語図鑑＆制覇ステータス"}
            </h2>
          </div>
          <button
            onClick={() => {
              soundEngine.playTap();
              onClose();
            }}
            className="bg-[#0C0F0A] text-white p-1.5 border border-white hover:bg-white hover:text-[#0C0F0A] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 総合制覇プログレス＆フィルター */}
        <div className="p-3 bg-[#0C0F0A] border-b border-[#2C3527] space-y-2.5">
          {/* カテゴリ切り替え（中学英単語1800 vs 英検1級） */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => {
                soundEngine.playTap();
                setActiveCategory("ターゲット1800");
                setActiveTrack(1);
                setDisplayLimit(80);
              }}
              className={`py-1 px-2 text-[11px] font-black border transition ${
                isTarget1800
                  ? "bg-[#FBFF12] text-[#0C0F0A] border-white"
                  : "bg-[#141911] text-[#A3B19B] border-[#2C3527] hover:text-white"
              }`}
            >
              🎯 中学英単語 (全1,800語)
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playTap();
                setActiveCategory("英検1級");
                setActiveTrack(0);
                setDisplayLimit(80);
              }}
              className={`py-1 px-2 text-[11px] font-black border transition ${
                !isTarget1800
                  ? "bg-[#FBFF12] text-[#0C0F0A] border-white"
                  : "bg-[#141911] text-[#A3B19B] border-[#2C3527] hover:text-white"
              }`}
            >
              👑 英検1級 (全96語)
            </button>
          </div>

          <div className="flex items-center justify-between text-xs font-black">
            <span className="text-[#41EAD4] flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-[#FBFF12]" />
              {activeScopeLabel} 制覇: {scopeMastered} / {scopeWords.length} 語 (
              {Math.round(
                (scopeMastered / Math.max(1, scopeWords.length)) * 100
              )}
              %)
            </span>
            <span className="text-[10px] text-[#C8D4C2] font-bold">
              全体: {totalMastered}/{allCategoryWords.length}語
            </span>
          </div>

          <div className="w-full h-2.5 bg-[#141911] border border-white -skew-x-12 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#FF206E] via-[#FBFF12] to-[#41EAD4] transition-all duration-300"
              style={{
                width: `${Math.min(
                  100,
                  Math.round(
                    (scopeMastered / Math.max(1, scopeWords.length)) * 100
                  )
                )}%`,
              }}
            />
          </div>

          {/* ステージ / トラック切り替えピル */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {isTarget1800
              ? TARGET1800_STAGES.map((s) => {
                  const isSelected = activeTrack === s.unitNumber;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        soundEngine.playTap();
                        setActiveTrack(s.unitNumber);
                        setDisplayLimit(80);
                      }}
                      className={`px-2.5 py-1 text-[11px] font-black border shrink-0 transition ${
                        isSelected
                          ? "bg-[#41EAD4] text-[#0C0F0A] border-white"
                          : "bg-[#141911] text-[#C8D4C2] border-[#2C3527] hover:border-[#41EAD4]"
                      }`}
                    >
                      {s.label} ({s.rangeLabel})
                    </button>
                  );
                })
              : EIKEN1_TRACK_STAGES.map((t) => {
                  const isSelected = activeTrack === t.trackNumber;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        soundEngine.playTap();
                        setActiveTrack(t.trackNumber);
                      }}
                      className={`px-2.5 py-1 text-[11px] font-black border shrink-0 transition ${
                        isSelected
                          ? "bg-[#FBFF12] text-[#0C0F0A] border-white"
                          : "bg-[#141911] text-[#C8D4C2] border-[#2C3527] hover:border-[#41EAD4]"
                      }`}
                    >
                      {t.trackNumber === 0 ? "全96語" : `T00${t.trackNumber}`}
                    </button>
                  );
                })}
          </div>

          {/* 状態フィルター＆検索 */}
          <div className="flex items-center gap-2">
            <div className="flex bg-[#141911] border border-[#2C3527] p-0.5 shrink-0">
              {(
                [
                  { id: "all", label: "すべて" },
                  { id: "unseen", label: "未制覇" },
                  { id: "weak", label: `ミス(${scopeWeak})` },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    soundEngine.playTap();
                    setFilterMode(f.id);
                    setDisplayLimit(80);
                  }}
                  className={`px-2 py-1 text-[10px] font-black transition ${
                    filterMode === f.id
                      ? "bg-[#41EAD4] text-[#0C0F0A]"
                      : "text-[#A3B19B] hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-[#A3B19B] absolute left-2 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setDisplayLimit(80);
                }}
                placeholder="英単語・意味・番号で検索..."
                className="w-full bg-[#141911] border border-[#2C3527] focus:border-[#41EAD4] text-xs text-white pl-7 pr-2 py-1 outline-none"
              />
            </div>
          </div>
        </div>

        {/* 単語カード一覧 */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {visibleWords.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#A3B19B] font-bold">
              該当する英単語がありません。フィルターを切り替えてください。
            </div>
          ) : (
            <>
              {visibleWords.map((w) => {
                const m = wordMastery[w.id];
                const isMastered = m && m.cleared > 0 && m.cleared > m.missed;
                const isWeak = m && m.missed > 0 && m.missed >= m.cleared;

                return (
                  <div
                    key={w.id}
                    className={`p-3 bg-[#0C0F0A] border transition space-y-1.5 ${
                      isMastered
                        ? "border-[#41EAD4]"
                        : isWeak
                        ? "border-[#FF206E]"
                        : "border-[#2C3527]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-black bg-[#141911] text-[#41EAD4] border border-[#2C3527] px-1.5 py-0.5">
                            #{w.num}{" "}
                            {isTarget1800
                              ? `(Lv.${String(w.track).padStart(2, "0")})`
                              : `(T00${w.track})`}
                          </span>
                          <span className="text-base font-black text-white">
                            {w.english}
                          </span>
                          <span className="text-xs text-[#A3B19B] font-bold">
                            {w.phonetic}
                          </span>
                          {isMastered && (
                            <span className="bg-[#41EAD4] text-[#0C0F0A] text-[10px] font-black px-1.5 py-0.5 flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> 制覇 (
                              {m.cleared})
                            </span>
                          )}
                          {isWeak && (
                            <span className="bg-[#FF206E] text-white text-[10px] font-black px-1.5 py-0.5">
                              🔥 要復習 (ミス{m.missed})
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-black text-[#FBFF12] mt-1">
                          ＝ {w.japanese}
                        </div>
                      </div>

                      <button
                        onClick={() => soundEngine.speakEnglish(w.english, 1.0)}
                        className="bg-[#FF206E] hover:brightness-110 text-white p-2 border border-white shrink-0 active:scale-95 transition"
                        title="単語発音"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    {w.tip && (
                      <div className="text-[11px] text-[#C8D4C2] leading-snug">
                        💡 {w.tip}
                      </div>
                    )}

                    {w.exampleSentenceEn && (
                      <div className="bg-[#141911] border border-[#2C3527] p-2 text-[11px] space-y-0.5">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-white font-bold">
                            {w.exampleSentenceEn}
                          </span>
                          <button
                            onClick={() =>
                              soundEngine.speakEnglish(
                                w.exampleSentenceEn!,
                                1.0
                              )
                            }
                            className="text-[10px] font-black text-[#41EAD4] hover:text-[#FBFF12] border border-[#41EAD4] px-1.5 py-0.5 shrink-0"
                          >
                            🔊 例文
                          </button>
                        </div>
                        {w.exampleSentenceJa && (
                          <div className="text-[#A3B19B]">
                            {w.exampleSentenceJa}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredWords.length > displayLimit && (
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTap();
                    setDisplayLimit((prev) => prev + 100);
                  }}
                  className="w-full py-2.5 bg-[#141911] hover:bg-[#1D2419] text-[#41EAD4] font-black text-xs border border-[#41EAD4]"
                >
                  ▼ さらに100語を表示（残り {filteredWords.length - displayLimit}{" "}
                  語）
                </button>
              )}
            </>
          )}
        </div>

        {/* フッターアクション：選択中ステージ／トラックで即出撃 */}
        <div className="p-3 bg-[#0C0F0A] border-t-2 border-[#2C3527] flex gap-2">
          <button
            onClick={() => {
              soundEngine.playTap();
              onSelectTrackAndStart(activeTrack, false, activeCategory);
            }}
            className="flex-1 py-3 bg-[#FF206E] hover:brightness-110 text-white font-black text-xs border-2 border-white -skew-x-6 shadow-[3px_3px_0_#FBFF12] active:scale-95 transition"
          >
            ⚡ この範囲（{activeScopeLabel}）で出撃！
          </button>
          {scopeWeak > 0 && (
            <button
              onClick={() => {
                soundEngine.playTap();
                onSelectTrackAndStart(activeTrack, true, activeCategory);
              }}
              className="py-3 px-3 bg-[#FBFF12] text-[#0C0F0A] font-black text-xs border-2 border-white -skew-x-6 shadow-[3px_3px_0_#41EAD4] active:scale-95 transition shrink-0"
            >
              🔥 苦手優先出撃
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
