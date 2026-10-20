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
  Award,
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

type MainTab = "aura" | "uniform" | "hair";

export const CharacterCustomizeModal: React.FC<CharacterCustomizeModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<MainTab>("uniform");
  const [previewMood, setPreviewMood] = useState<"idle" | "attack" | "happy">("idle");

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
    // レベル飾りはキャラクターレベル（1〜10）の進行で自動解放
    // Lv.1: 全員, Lv.2: Lv.3以上, Lv.3: Lv.5以上, Lv.4: Lv.7以上, Lv.5: Lv.9以上
    const reqLevel = (a.level - 1) * 2 + 1;
    return profile.level >= reqLevel;
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
    setToastMessage("🎉 全要素（髪型・制服・レベル飾り・Lv.10）をアンロックしました！");
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
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

  // ランダム着せ替え
  const handleRandomize = () => {
    soundEngine.playWeakHit(5);
    const randomHair = hairList[Math.floor(Math.random() * hairList.length)];
    const randomUniform = UNIFORM_DEFS[Math.floor(Math.random() * UNIFORM_DEFS.length)];
    // 解放済みのオーラから選ぶ
    const maxAura = Math.max(1, Math.min(5, Math.ceil(profile.level / 2)));
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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900/95 border-2 border-indigo-500/40 rounded-3xl shadow-2xl overflow-hidden text-slate-100"
        >
          {/* ヘッダー */}
          <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 border border-indigo-400/40 rounded-xl text-indigo-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black tracking-wide">
                    アジト着せ替えスタジオ
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    世界観統一
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {evolutionTitle.title} ({evolutionTitle.branchLabel})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* テスト用：全要素アンロックボタン */}
              <button
                type="button"
                onClick={handleUnlockAll}
                className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-[11px] sm:text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/30 border border-emerald-300/40 active:scale-95 transition"
                title="全ての髪型・制服・レベル飾りを即座に解放し、Lv.10と99999 LXPを付与します"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>全要素アンロック(テスト)</span>
              </button>

              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-bold text-amber-300">
                <span>所持 LXP:</span>
                <span className="font-mono text-sm">{currentExp}</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* トースト通知 */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-emerald-600/90 border-b border-emerald-400 text-white text-xs font-bold py-2 px-4 text-center flex items-center justify-center gap-2 shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
                <span>{toastMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* メインコンテンツ（2カラム: 左プレビュー / 右パーツ一覧） */}
          <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">
            {/* 左側: キャラクター大型プレビュー */}
            <div className="md:col-span-5 p-4 sm:p-6 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-slate-800 bg-gradient-to-b from-slate-950/40 to-slate-900/60">
              <div className="w-full flex justify-between items-center text-xs">
                <span className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 font-bold">
                  Lv.{profile.level} {isGirl ? "女子生徒" : "男子生徒"}
                </span>
                <span className="text-[11px] text-indigo-300 font-medium">
                  {evolutionTitle.branchBadge}
                </span>
              </div>

              {/* ドット絵キャラクター */}
              <div className="relative py-4 my-auto flex flex-col items-center">
                <PixelCharacter
                  gender={profile.gender}
                  stage={profile.level}
                  size={180}
                  mood={previewMood}
                  loadout={loadout}
                  animateFrames={true}
                />
                <div className="mt-2 text-center">
                  <div className="text-xs font-bold text-slate-200">
                    {evolutionTitle.title}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    飾り Lv.{loadout.auraLevel} / {hairList.find(h => h.id === loadout.hairId)?.name}
                  </div>
                </div>
              </div>

              {/* モーション変更 & アクションバー */}
              <div className="w-full space-y-2.5">
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/60 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setPreviewMood("idle")}
                    className={`py-1.5 rounded-lg font-bold transition ${
                      previewMood === "idle"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    自然体
                  </button>
                  <button
                    onClick={() => setPreviewMood("happy")}
                    className={`py-1.5 rounded-lg font-bold transition ${
                      previewMood === "happy"
                        ? "bg-pink-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    笑顔 ✨
                  </button>
                  <button
                    onClick={() => setPreviewMood("attack")}
                    className={`py-1.5 rounded-lg font-bold transition ${
                      previewMood === "attack"
                        ? "bg-amber-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    決めポーズ ⚡
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleRandomize}
                    className="flex-1 py-2 px-3 flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition"
                  >
                    <Dice5 className="w-3.5 h-3.5 text-amber-400" />
                    ランダムコーデ
                  </button>
                  <button
                    onClick={handleReset}
                    className="py-2 px-3 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-400 hover:text-slate-200 border border-slate-700 transition"
                    title="初期状態に戻す"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 右側: 3軸の着せ替え選択エリア */}
            <div className="md:col-span-7 flex flex-col h-[400px] md:h-[540px] bg-slate-900/40">
              {/* 3大タブナビゲーション */}
              <div className="flex border-b border-slate-800 bg-slate-950/40 p-2 gap-1.5">
                <button
                  onClick={() => {
                    soundEngine.playTap();
                    setActiveTab("uniform");
                  }}
                  className={`flex-1 py-2 px-3 flex items-center justify-center gap-2 rounded-xl text-xs sm:text-sm font-black transition ${
                    activeTab === "uniform"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <Shirt className="w-4 h-4 text-indigo-300" />
                  <span>制服 20校</span>
                </button>

                <button
                  onClick={() => {
                    soundEngine.playTap();
                    setActiveTab("hair");
                  }}
                  className={`flex-1 py-2 px-3 flex items-center justify-center gap-2 rounded-xl text-xs sm:text-sm font-black transition ${
                    activeTab === "hair"
                      ? "bg-pink-600 text-white shadow-md shadow-pink-600/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-pink-300" />
                  <span>髪型 10選</span>
                </button>

                <button
                  onClick={() => {
                    soundEngine.playTap();
                    setActiveTab("aura");
                  }}
                  className={`flex-1 py-2 px-3 flex items-center justify-center gap-2 rounded-xl text-xs sm:text-sm font-black transition ${
                    activeTab === "aura"
                      ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <Flame className="w-4 h-4 text-amber-300" />
                  <span>レベル飾り (5段階)</span>
                </button>
              </div>

              {/* アイテムリスト（スクロール領域） */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                {/* 1. 制服 20校 */}
                {activeTab === "uniform" && (
                  <div className="space-y-2.5">
                    <div className="text-xs text-slate-400 px-1 flex items-center justify-between">
                      <span>全国・世界の名門＆個性派スクール制服 (全20種)</span>
                      <span className="text-[11px] text-slate-500">靴・ボトムスセット</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                            className={`relative p-3 rounded-2xl border transition text-left cursor-pointer flex flex-col justify-between ${
                              isEquipped
                                ? "bg-indigo-950/60 border-indigo-400 shadow-md ring-1 ring-indigo-400"
                                : unlocked
                                ? "bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600"
                                : "bg-slate-900/40 border-slate-800 opacity-70 hover:opacity-90"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-xs text-slate-100">
                                    {u.name}
                                  </span>
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  {u.schoolName}
                                </div>
                              </div>

                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-800 border border-slate-700 text-indigo-300">
                                {u.badge}
                              </span>
                            </div>

                            {/* カラーパレットバー */}
                            <div className="mt-2.5 flex items-center gap-1">
                              <span
                                className="w-4 h-4 rounded-full border border-black/40"
                                style={{ backgroundColor: u.top }}
                                title="トップス"
                              />
                              <span
                                className="w-4 h-4 rounded-full border border-black/40"
                                style={{ backgroundColor: u.sub }}
                                title="シャツ/サブ"
                              />
                              <span
                                className="w-4 h-4 rounded-full border border-black/40"
                                style={{ backgroundColor: u.acc }}
                                title="ネクタイ/アクセント"
                              />
                              <span
                                className="w-4 h-4 rounded-full border border-black/40"
                                style={{ backgroundColor: isGirl ? u.bot_g : u.bot }}
                                title={isGirl ? "スカート" : "スラックス"}
                              />

                              <div className="ml-auto flex items-center">
                                {isEquipped ? (
                                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                                    <Check className="w-3.5 h-3.5" /> 着用中
                                  </span>
                                ) : !unlocked ? (
                                  <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400">
                                    <Lock className="w-3 h-3" />
                                    {u.lxpCost > 0 ? `${u.lxpCost} LXP` : `Lv.${u.unlockLevel}`}
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-400">着用する</span>
                                )}
                              </div>
                            </div>

                            <p className="mt-1.5 text-[10px] text-slate-400 line-clamp-1">
                              {u.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. 髪型 10選 */}
                {activeTab === "hair" && (
                  <div className="space-y-2.5">
                    <div className="text-xs text-slate-400 px-1 flex items-center justify-between">
                      <span>{isGirl ? "女子" : "男子"} 髪型＆カラーセット (全10種)</span>
                      <span className="text-[11px] text-pink-300 font-bold">カット×カラー固定</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                            className={`relative p-3 rounded-2xl border transition text-left cursor-pointer flex flex-col justify-between ${
                              isEquipped
                                ? "bg-pink-950/60 border-pink-400 shadow-md ring-1 ring-pink-400"
                                : unlocked
                                ? "bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600"
                                : "bg-slate-900/40 border-slate-800 opacity-70 hover:opacity-90"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="font-bold text-xs text-slate-100">
                                  {h.name}
                                </span>
                              </div>
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-800 border border-slate-700 text-pink-300">
                                {h.badge}
                              </span>
                            </div>

                            {/* ヘアカラープレビュー */}
                            <div className="mt-3 flex items-center gap-1.5">
                              <div className="flex items-center gap-1">
                                <span
                                  className="w-4 h-4 rounded-full border border-black/40"
                                  style={{ backgroundColor: h.base }}
                                  title="ベース色"
                                />
                                <span
                                  className="w-4 h-4 rounded-full border border-black/40"
                                  style={{ backgroundColor: h.dark }}
                                  title="シャドウ色"
                                />
                                <span
                                  className="w-4 h-4 rounded-full border border-black/40"
                                  style={{ backgroundColor: h.lite }}
                                  title="ハイライト色"
                                />
                              </div>

                              <div className="ml-auto flex items-center">
                                {isEquipped ? (
                                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                                    <Check className="w-3.5 h-3.5" /> セット中
                                  </span>
                                ) : !unlocked ? (
                                  <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400">
                                    <Lock className="w-3 h-3" />
                                    {h.lxpCost > 0 ? `${h.lxpCost} LXP` : `Lv.${h.unlockLevel}`}
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-400">セットする</span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. レベル開放の飾り（Lv.1〜5 段階） */}
                {activeTab === "aura" && (
                  <div className="space-y-2.5">
                    <div className="text-xs text-slate-400 px-1 flex items-center justify-between">
                      <span>キャラクターレベルで開放されるファンタジー進化 (全5段階)</span>
                      <span className="text-[11px] text-amber-300 font-bold">装飾＆オーラ</span>
                    </div>

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
                            className={`p-3.5 rounded-2xl border transition text-left flex items-center justify-between gap-3 ${
                              isEquipped
                                ? "bg-amber-950/60 border-amber-400 shadow-md ring-1 ring-amber-400 cursor-pointer"
                                : unlocked
                                ? "bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600 cursor-pointer"
                                : "bg-slate-900/40 border-slate-800 opacity-60 cursor-not-allowed"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border ${
                                  isEquipped
                                    ? "bg-amber-500 text-slate-950 border-amber-300"
                                    : unlocked
                                    ? "bg-slate-800 text-amber-400 border-slate-700"
                                    : "bg-slate-900 text-slate-500 border-slate-800"
                                }`}
                              >
                                {a.badge}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-xs text-slate-100">
                                    {a.name}
                                  </span>
                                  <span className="text-[10px] text-amber-400/90 font-medium">
                                    ({a.title})
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                  {a.description}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center shrink-0">
                              {isEquipped ? (
                                <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                                  <Check className="w-4 h-4" /> 解放中
                                </span>
                              ) : !unlocked ? (
                                <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                                  <Lock className="w-3.5 h-3.5" /> Lv.{reqLevel}で開放
                                </span>
                              ) : (
                                <span className="text-xs text-slate-400">切り替える</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* フッター（保存＆完了ボタン） */}
              <div className="p-3.5 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  選択した組み合わせは自動保存されます
                </div>
                <button
                  onClick={() => {
                    soundEngine.playStageVictory();
                    onClose();
                  }}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-black text-xs sm:text-sm shadow-md shadow-indigo-500/25 transition active:scale-95"
                >
                  着せ替えを決定
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
