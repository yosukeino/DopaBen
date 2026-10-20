"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  Check,
  Lock,
  RotateCcw,
  Dice5,
  Shirt,
  Flame,
  Unlock,
} from "lucide-react";
import {
  CharacterPartLoadout,
  PlayerProfile,
} from "@/lib/types";
import {
  AURA_LEVEL_DEFS,
  AuraLevelDef,
  BOY_HAIR_DEFS,
  getCharacterEvolutionTitle,
  GIRL_HAIR_DEFS,
  HairDef,
  UNIFORM_DEFS,
  UniformDef,
} from "@/lib/characterPartsEngine";
import { PixelCharacter } from "./PixelCharacter";
import { soundEngine } from "@/lib/soundEngine";

interface CharacterCustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PlayerProfile;
  onSave: (updatedProfile: PlayerProfile) => void;
}

type MainTab = "uniform" | "hair" | "aura";

export const CharacterCustomizeModal: React.FC<CharacterCustomizeModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<MainTab>("uniform");

  const isGirl = profile.gender === "girl";
  const hairList = isGirl ? GIRL_HAIR_DEFS : BOY_HAIR_DEFS;

  // 初期ロードアウト解決
  const [loadout, setLoadout] = useState<CharacterPartLoadout>(() => {
    const existing = profile.characterLoadout;
    const defaultAura = Math.max(1, Math.min(5, Math.ceil(profile.level / 2)));
    return {
      mode: "custom",
      hairId: existing?.hairId || hairList[0].id,
      uniformId: existing?.uniformId || UNIFORM_DEFS[0].id,
      auraLevel: existing?.auraLevel ?? defaultAura,
    };
  });

  const [unlockedParts, setUnlockedParts] = useState<string[]>(
    profile.unlockedParts || []
  );
  const [currentExp, setCurrentExp] = useState<number>(profile.exp);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // 称号取得
  const evolutionTitle = getCharacterEvolutionTitle(
    profile.gender,
    profile.level,
    profile.stats,
    loadout
  );

  // 解放チェック
  const isHairUnlocked = (h: HairDef) => {
    if (unlockedParts.includes("__ALL_UNLOCKED__")) return true;
    if (h.lxpCost === 0) return true;
    if (unlockedParts.includes(h.id)) return true;
    if (profile.level >= h.unlockLevel && h.lxpCost <= 0) return true;
    return false;
  };

  const isUniformUnlocked = (u: UniformDef) => {
    if (unlockedParts.includes("__ALL_UNLOCKED__")) return true;
    if (u.lxpCost === 0) return true;
    if (unlockedParts.includes(u.id)) return true;
    if (profile.level >= u.unlockLevel && u.lxpCost <= 0) return true;
    return false;
  };

  const isAuraUnlocked = (a: AuraLevelDef) => {
    if (unlockedParts.includes("__ALL_UNLOCKED__")) return true;
    const reqLevel = (a.level - 1) * 2 + 1;
    return profile.level >= reqLevel;
  };

  // 装備ハンドラー
  const handleSelectHair = (h: HairDef) => {
    soundEngine.playTap();
    const updated: CharacterPartLoadout = { ...loadout, hairId: h.id };
    setLoadout(updated);
    onSave({ ...profile, characterLoadout: updated });
  };

  const handleSelectUniform = (u: UniformDef) => {
    soundEngine.playTap();
    const updated: CharacterPartLoadout = { ...loadout, uniformId: u.id };
    setLoadout(updated);
    onSave({ ...profile, characterLoadout: updated });
  };

  const handleSelectAura = (a: AuraLevelDef) => {
    soundEngine.playTap();
    const updated: CharacterPartLoadout = { ...loadout, auraLevel: a.level };
    setLoadout(updated);
    onSave({ ...profile, characterLoadout: updated });
  };

  // LXPアンロック（髪型・制服）
  const handleUnlockItem = (id: string, cost: number) => {
    if (currentExp < cost) {
      soundEngine.playBountyLock();
      alert(`LXPが足りません！ 必要: ${cost} LXP / 所持: ${currentExp} LXP`);
      return;
    }
    soundEngine.playStageVictory();
    const newExp = currentExp - cost;
    const newUnlocked = [...unlockedParts, id];
    setCurrentExp(newExp);
    setUnlockedParts(newUnlocked);
    onSave({
      ...profile,
      exp: newExp,
      unlockedParts: newUnlocked,
    });
  };

  // テスト用：全要素アンロック
  const handleUnlockAll = () => {
    soundEngine.playStageVictory();
    const allIds = [
      "__ALL_UNLOCKED__",
      ...UNIFORM_DEFS.map((u) => u.id),
      ...GIRL_HAIR_DEFS.map((h) => h.id),
      ...BOY_HAIR_DEFS.map((h) => h.id),
    ];
    const newUnlocked = Array.from(new Set([...unlockedParts, ...allIds]));
    const newExp = Math.max(currentExp, 99999);
    const newLevel = Math.max(profile.level, 10);

    setUnlockedParts(newUnlocked);
    setCurrentExp(newExp);

    const updatedProfile: PlayerProfile = {
      ...profile,
      level: newLevel,
      exp: newExp,
      unlockedParts: newUnlocked,
    };

    onSave(updatedProfile);
    setToastMessage("🎉 全要素（髪型・制服・飾り・Lv.10）をアンロック！");
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // ランダム着せ替え
  const handleRandomize = () => {
    soundEngine.playWeakHit(5);
    const randomHair = hairList[Math.floor(Math.random() * hairList.length)];
    const randomUniform = UNIFORM_DEFS[Math.floor(Math.random() * UNIFORM_DEFS.length)];
    const maxAura = unlockedParts.includes("__ALL_UNLOCKED__")
      ? 5
      : Math.max(1, Math.min(5, Math.ceil(profile.level / 2)));
    const randomAura = Math.floor(Math.random() * maxAura) + 1;

    const updated: CharacterPartLoadout = {
      mode: "custom",
      hairId: randomHair.id,
      uniformId: randomUniform.id,
      auraLevel: randomAura,
    };
    setLoadout(updated);
    onSave({ ...profile, characterLoadout: updated });
  };

  // リセット（基本中学生スタイルに戻す）
  const handleReset = () => {
    soundEngine.playWeakHit(2);
    const defaultAura = Math.max(1, Math.min(5, Math.ceil(profile.level / 2)));
    const resetLoadout: CharacterPartLoadout = {
      mode: "custom",
      hairId: hairList[0].id,
      uniformId: UNIFORM_DEFS[0].id,
      auraLevel: defaultAura,
    };
    setLoadout(resetLoadout);
    onSave({ ...profile, characterLoadout: resetLoadout });
  };

  const currentUniformName = UNIFORM_DEFS.find((u) => u.id === loadout.uniformId)?.name || "制服";
  const currentHairName = hairList.find((h) => h.id === loadout.hairId)?.name || "髪型";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          className="relative w-full max-w-4xl h-[94vh] max-h-[820px] flex flex-col bg-slate-900/98 border border-indigo-500/30 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden text-slate-100"
        >
          {/* 右上固定：閉じるボタン */}
          <button
            onClick={onClose}
            className="absolute top-2.5 right-2.5 z-30 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition shadow-md"
            title="閉じる"
          >
            <X className="w-4 h-4" />
          </button>

          {/* トースト通知（アンロック時） */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-0 inset-x-0 z-40 bg-emerald-600/95 border-b border-emerald-400 text-white text-xs font-bold py-1.5 px-3 text-center flex items-center justify-center gap-1.5 shadow-lg"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" />
                <span>{toastMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* プレビューエリア（上部コンパクト配置：モバイルでは横型に収める） */}
          <div className="shrink-0 px-3 py-2.5 sm:px-5 sm:py-3 border-b border-slate-800/90 bg-slate-950/70">
            <div className="flex items-center gap-3 sm:gap-5 pr-8">
              {/* ドット絵キャラクター（自然体アニメーション） */}
              <div className="relative shrink-0 flex items-center justify-center bg-slate-900/80 border border-slate-800 rounded-xl p-1 shadow-inner">
                <PixelCharacter
                  gender={profile.gender}
                  stage={profile.level}
                  size={88}
                  mood="idle"
                  loadout={loadout}
                  animateFrames={true}
                />
              </div>

              {/* キャラクター情報 ＆ コントロール */}
              <div className="flex-1 min-w-0 space-y-1.5">
                {/* 1行目: レベル・性別・系統バッジ */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] sm:text-xs font-black">
                    Lv.{profile.level} {isGirl ? "女子生徒" : "男子生徒"}
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-300 truncate">
                    {evolutionTitle.title}
                  </span>
                </div>

                {/* 2行目: 現在の着用パーツ名（1行でコンパクトに把握） */}
                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-400 truncate">
                  <span className="truncate text-slate-200">
                    👔 {currentUniformName.split("（")[0]}
                  </span>
                  <span className="text-slate-600">/</span>
                  <span className="truncate text-slate-200">
                    💇 {currentHairName.split("・")[0]}
                  </span>
                  <span className="text-slate-600">/</span>
                  <span className="text-amber-300 shrink-0 font-bold">
                    ✨ 飾りLv.{loadout.auraLevel}
                  </span>
                </div>

                {/* 3行目: アクションボタン（ランダム、リセット、テストアンロック） */}
                <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                  <button
                    onClick={handleRandomize}
                    className="py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] sm:text-xs font-bold text-slate-200 border border-slate-700 flex items-center gap-1 transition active:scale-95"
                  >
                    <Dice5 className="w-3 h-3 text-amber-400" />
                    <span>ランダム</span>
                  </button>
                  <button
                    onClick={handleReset}
                    className="py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] sm:text-xs font-bold text-slate-400 hover:text-slate-200 border border-slate-700 flex items-center gap-1 transition active:scale-95"
                    title="初期状態に戻す"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span className="hidden sm:inline">リセット</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleUnlockAll}
                    className="py-1 px-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-[10px] sm:text-xs flex items-center gap-1 border border-emerald-400/40 shadow-sm active:scale-95 transition"
                    title="テスト用：全ての制服・髪型・飾りを解放"
                  >
                    <Unlock className="w-3 h-3" />
                    <span>全開放(テスト)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3大タブナビゲーション（スリム設計） */}
          <div className="shrink-0 flex border-b border-slate-800 bg-slate-950/50 p-1.5 gap-1">
            <button
              onClick={() => {
                soundEngine.playTap();
                setActiveTab("uniform");
              }}
              className={`flex-1 py-1.5 px-2 flex items-center justify-center gap-1.5 rounded-lg text-xs font-black transition ${
                activeTab === "uniform"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <Shirt className="w-3.5 h-3.5 text-indigo-300" />
              <span>制服 (20校)</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playTap();
                setActiveTab("hair");
              }}
              className={`flex-1 py-1.5 px-2 flex items-center justify-center gap-1.5 rounded-lg text-xs font-black transition ${
                activeTab === "hair"
                  ? "bg-pink-600 text-white shadow-md shadow-pink-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-300" />
              <span>髪型 (10選)</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playTap();
                setActiveTab("aura");
              }}
              className={`flex-1 py-1.5 px-2 flex items-center justify-center gap-1.5 rounded-lg text-xs font-black transition ${
                activeTab === "aura"
                  ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>レベル飾り (5段階)</span>
            </button>
          </div>

          {/* 選択エリア（高さを最大化し、ワンビューで複数選択可能に） */}
          <div className="flex-1 overflow-y-auto p-2.5 sm:p-3.5">
            {/* 1. 制服 20校（2カラムグリッドで一目で一覧可能） */}
            {activeTab === "uniform" && (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {UNIFORM_DEFS.map((u) => {
                  const isEquipped = loadout.uniformId === u.id;
                  const unlocked = isUniformUnlocked(u);

                  return (
                    <div
                      key={u.id}
                      onClick={() => {
                        if (unlocked) {
                          handleSelectUniform(u);
                        } else if (u.lxpCost > 0) {
                          handleUnlockItem(u.id, u.lxpCost);
                        }
                      }}
                      className={`relative p-2 sm:p-2.5 rounded-xl border transition text-left cursor-pointer flex flex-col justify-between ${
                        isEquipped
                          ? "bg-indigo-950/70 border-indigo-400 shadow-sm ring-1 ring-indigo-400"
                          : unlocked
                          ? "bg-slate-800/70 border-slate-700/80 hover:bg-slate-800 hover:border-slate-500"
                          : "bg-slate-900/50 border-slate-800/80 opacity-70 hover:opacity-90"
                      }`}
                    >
                      {/* タイトル ＆ バッジ */}
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-bold text-[11px] sm:text-xs text-slate-100 truncate">
                          {u.name.replace(/（.*）/, "")}
                        </span>
                        <span className="px-1 py-0.2 rounded text-[8px] sm:text-[9px] font-bold bg-slate-900/80 border border-slate-700 text-indigo-300 shrink-0">
                          {u.badge}
                        </span>
                      </div>

                      {/* カラードット ＆ 状態 */}
                      <div className="mt-2 flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1">
                          <span
                            className="w-3 h-3 rounded-full border border-black/50"
                            style={{ backgroundColor: u.top }}
                            title="トップス"
                          />
                          <span
                            className="w-3 h-3 rounded-full border border-black/50"
                            style={{ backgroundColor: u.sub }}
                            title="シャツ"
                          />
                          <span
                            className="w-3 h-3 rounded-full border border-black/50"
                            style={{ backgroundColor: u.acc }}
                            title="アクセント"
                          />
                          <span
                            className="w-3 h-3 rounded-full border border-black/50"
                            style={{ backgroundColor: isGirl ? u.bot_g : u.bot }}
                            title={isGirl ? "スカート" : "スラックス"}
                          />
                        </div>

                        <div>
                          {isEquipped ? (
                            <span className="flex items-center gap-0.5 text-[10px] font-black text-emerald-400">
                              <Check className="w-3 h-3" /> 着用中
                            </span>
                          ) : !unlocked ? (
                            <span className="flex items-center gap-0.5 text-[9px] font-bold text-amber-400">
                              <Lock className="w-2.5 h-2.5" />
                              {u.lxpCost > 0 ? `${u.lxpCost}` : `Lv.${u.unlockLevel}`}
                            </span>
                          ) : (
                            <span className="text-[9px] text-slate-400 font-medium">選ぶ</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 2. 髪型 10選（2カラムグリッド） */}
            {activeTab === "hair" && (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {hairList.map((h) => {
                  const isEquipped = loadout.hairId === h.id;
                  const unlocked = isHairUnlocked(h);

                  return (
                    <div
                      key={h.id}
                      onClick={() => {
                        if (unlocked) {
                          handleSelectHair(h);
                        } else if (h.lxpCost > 0) {
                          handleUnlockItem(h.id, h.lxpCost);
                        }
                      }}
                      className={`relative p-2 sm:p-2.5 rounded-xl border transition text-left cursor-pointer flex flex-col justify-between ${
                        isEquipped
                          ? "bg-pink-950/70 border-pink-400 shadow-sm ring-1 ring-pink-400"
                          : unlocked
                          ? "bg-slate-800/70 border-slate-700/80 hover:bg-slate-800 hover:border-slate-500"
                          : "bg-slate-900/50 border-slate-800/80 opacity-70 hover:opacity-90"
                      }`}
                    >
                      {/* タイトル ＆ バッジ */}
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-bold text-[11px] sm:text-xs text-slate-100 truncate">
                          {h.name}
                        </span>
                        <span className="px-1 py-0.2 rounded text-[8px] sm:text-[9px] font-bold bg-slate-900/80 border border-slate-700 text-pink-300 shrink-0">
                          {h.badge}
                        </span>
                      </div>

                      {/* カラードット ＆ 状態 */}
                      <div className="mt-2 flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1">
                          <span
                            className="w-3 h-3 rounded-full border border-black/50"
                            style={{ backgroundColor: h.base }}
                            title="ベース色"
                          />
                          <span
                            className="w-3 h-3 rounded-full border border-black/50"
                            style={{ backgroundColor: h.dark }}
                            title="シャドウ色"
                          />
                          <span
                            className="w-3 h-3 rounded-full border border-black/50"
                            style={{ backgroundColor: h.lite }}
                            title="ハイライト色"
                          />
                        </div>

                        <div>
                          {isEquipped ? (
                            <span className="flex items-center gap-0.5 text-[10px] font-black text-emerald-400">
                              <Check className="w-3 h-3" /> セット中
                            </span>
                          ) : !unlocked ? (
                            <span className="flex items-center gap-0.5 text-[9px] font-bold text-amber-400">
                              <Lock className="w-2.5 h-2.5" />
                              {h.lxpCost > 0 ? `${h.lxpCost}` : `Lv.${h.unlockLevel}`}
                            </span>
                          ) : (
                            <span className="text-[9px] text-slate-400 font-medium">選ぶ</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 3. レベル飾り（全5段階） */}
            {activeTab === "aura" && (
              <div className="space-y-2">
                {AURA_LEVEL_DEFS.map((a) => {
                  const isEquipped = (loadout.auraLevel ?? 1) === a.level;
                  const unlocked = isAuraUnlocked(a);
                  const reqLevel = (a.level - 1) * 2 + 1;

                  return (
                    <div
                      key={a.level}
                      onClick={() => {
                        if (unlocked) {
                          handleSelectAura(a);
                        }
                      }}
                      className={`p-2.5 sm:p-3 rounded-xl border transition text-left flex items-center justify-between gap-2.5 ${
                        isEquipped
                          ? "bg-amber-950/70 border-amber-400 shadow-sm ring-1 ring-amber-400 cursor-pointer"
                          : unlocked
                          ? "bg-slate-800/70 border-slate-700/80 hover:bg-slate-800 hover:border-slate-500 cursor-pointer"
                          : "bg-slate-900/50 border-slate-800 opacity-60 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 border ${
                            isEquipped
                              ? "bg-amber-500 text-slate-950 border-amber-300"
                              : unlocked
                              ? "bg-slate-800 text-amber-400 border-slate-700"
                              : "bg-slate-900 text-slate-500 border-slate-800"
                          }`}
                        >
                          {a.badge}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-[11px] sm:text-xs text-slate-100">
                              {a.name}
                            </span>
                            <span className="text-[10px] text-amber-400/90 font-medium truncate">
                              ({a.title})
                            </span>
                          </div>
                          <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                            {a.description}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isEquipped ? (
                          <span className="flex items-center gap-0.5 text-[10px] font-black text-emerald-400">
                            <Check className="w-3.5 h-3.5" /> 解放中
                          </span>
                        ) : !unlocked ? (
                          <span className="flex items-center gap-0.5 text-[9px] font-bold text-slate-500">
                            <Lock className="w-2.5 h-2.5" /> Lv.{reqLevel}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium">選ぶ</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* フッター（完了ボタン） */}
          <div className="shrink-0 p-2 sm:p-2.5 border-t border-slate-800/90 bg-slate-950/80 flex items-center justify-between">
            <span className="text-[10px] text-slate-400">
              タップで即時反映・自動保存されます
            </span>
            <button
              onClick={() => {
                soundEngine.playStageVictory();
                onClose();
              }}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-black text-xs shadow-md transition active:scale-95"
            >
              決定して閉じる
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
