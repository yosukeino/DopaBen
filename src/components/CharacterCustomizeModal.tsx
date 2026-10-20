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
  Palette,
  BookOpen,
  Sword,
  Shield,
  Zap,
  Flame,
  Music,
  Eye,
  Shirt,
  Crown,
} from "lucide-react";
import {
  CharacterGender,
  CharacterPartLoadout,
  PlayerProfile,
  StatBranchType,
} from "@/lib/types";
import {
  ALL_CHARACTER_PARTS,
  BACK_GEAR_PARTS,
  COLOR_PALETTES,
  detectStatBranch,
  EYE_STYLES,
  getCharacterEvolutionTitle,
  HAIR_STYLES,
  HEADGEAR_PARTS,
  OUTFIT_PARTS,
  PALETTE_PART_DEFS,
  PartItemDef,
  resolveAutoLoadout,
  STAT_BRANCH_INFO,
  WEAPON_LEFT_PARTS,
  WEAPON_RIGHT_PARTS,
} from "@/lib/characterPartsEngine";
import { PixelCharacter } from "./PixelCharacter";
import { soundEngine } from "@/lib/soundEngine";

interface CharacterCustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PlayerProfile;
  onSave: (updatedProfile: PlayerProfile) => void;
}

type SlotKey =
  | "hairStyle"
  | "headgear"
  | "eyeStyle"
  | "outfit"
  | "weaponRight"
  | "weaponLeft"
  | "backGear"
  | "palette";

const SLOT_TABS: { key: SlotKey; label: string; icon: React.ReactNode }[] = [
  { key: "hairStyle", label: "髪型", icon: <Sparkles className="w-4 h-4" /> },
  { key: "headgear", label: "頭装備", icon: <Crown className="w-4 h-4" /> },
  { key: "eyeStyle", label: "瞳", icon: <Eye className="w-4 h-4" /> },
  { key: "outfit", label: "衣装", icon: <Shirt className="w-4 h-4" /> },
  { key: "weaponRight", label: "右手武器", icon: <Sword className="w-4 h-4" /> },
  { key: "weaponLeft", label: "左手装備", icon: <Shield className="w-4 h-4" /> },
  { key: "backGear", label: "背面・翼", icon: <Zap className="w-4 h-4" /> },
  { key: "palette", label: "カラー", icon: <Palette className="w-4 h-4" /> },
];

export const CharacterCustomizeModal: React.FC<CharacterCustomizeModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [mainTab, setMainTab] = useState<"customize" | "codex">("customize");
  const [activeSlot, setActiveSlot] = useState<SlotKey>("hairStyle");
  const [previewMood, setPreviewMood] = useState<"idle" | "attack" | "happy">("idle");
  const [selectedBranch, setSelectedBranch] = useState<StatBranchType>(
    detectStatBranch(profile.stats)
  );

  // 一時ロードアウト
  const currentBranch = detectStatBranch(profile.stats);
  const defaultAuto = resolveAutoLoadout(profile.gender, profile.level, currentBranch);
  const [loadout, setLoadout] = useState<CharacterPartLoadout>(
    profile.characterLoadout || defaultAuto
  );

  // 解放済みパーツ一覧
  const [unlockedParts, setUnlockedParts] = useState<string[]>(
    profile.unlockedParts || []
  );
  const [currentExp, setCurrentExp] = useState<number>(profile.exp);

  if (!isOpen) return null;

  // パーツが解放されているか判定
  const isPartUnlocked = (part: PartItemDef) => {
    if (part.lxpCost === 0) return true;
    if (unlockedParts.includes(part.id)) return true;
    if (profile.level >= part.unlockLevel && part.lxpCost <= 0) return true;
    return false;
  };

  // スロットごとのパーツリスト取得
  const getSlotParts = (slot: SlotKey): PartItemDef[] => {
    switch (slot) {
      case "hairStyle":
        return HAIR_STYLES;
      case "headgear":
        return HEADGEAR_PARTS;
      case "eyeStyle":
        return EYE_STYLES;
      case "outfit":
        return OUTFIT_PARTS;
      case "weaponRight":
        return WEAPON_RIGHT_PARTS;
      case "weaponLeft":
        return WEAPON_LEFT_PARTS;
      case "backGear":
        return BACK_GEAR_PARTS;
      case "palette":
        return PALETTE_PART_DEFS;
      default:
        return [];
    }
  };

  // パーツ装備
  const handleEquipPart = (part: PartItemDef) => {
    soundEngine.playTap();
    const updated: CharacterPartLoadout = {
      ...loadout,
      mode: "custom",
      [part.slot]: part.id,
    };
    setLoadout(updated);
    onSave({
      ...profile,
      characterLoadout: updated,
      unlockedParts,
      exp: currentExp,
    });
  };

  // LXP消費でパーツ解放
  const handleUnlockPart = (part: PartItemDef) => {
    if (currentExp < part.lxpCost) {
      soundEngine.playBountyLock();
      alert(`LXPが足りません！必要: ${part.lxpCost} LXP / 所持: ${currentExp} LXP`);
      return;
    }

    soundEngine.playStageVictory();
    const newExp = currentExp - part.lxpCost;
    const newUnlocked = [...unlockedParts, part.id];
    const updatedLoadout: CharacterPartLoadout = {
      ...loadout,
      mode: "custom",
      [part.slot]: part.id,
    };

    setCurrentExp(newExp);
    setUnlockedParts(newUnlocked);
    setLoadout(updatedLoadout);

    onSave({
      ...profile,
      exp: newExp,
      unlockedParts: newUnlocked,
      characterLoadout: updatedLoadout,
    });
  };

  // オート進化モードに戻す
  const handleResetToAuto = () => {
    soundEngine.playWeakHit(3);
    const auto = resolveAutoLoadout(profile.gender, profile.level, currentBranch);
    setLoadout(auto);
    onSave({
      ...profile,
      characterLoadout: auto,
      unlockedParts,
      exp: currentExp,
    });
  };

  // ランダム着せ替え
  const handleRandomize = () => {
    soundEngine.playWeakHit(5);
    const pickRandom = (arr: PartItemDef[]) => arr[Math.floor(Math.random() * arr.length)].id;
    const randomized: CharacterPartLoadout = {
      mode: "custom",
      hairStyle: pickRandom(HAIR_STYLES),
      headgear: pickRandom(HEADGEAR_PARTS),
      eyeStyle: pickRandom(EYE_STYLES),
      outfit: pickRandom(OUTFIT_PARTS),
      weaponRight: pickRandom(WEAPON_RIGHT_PARTS),
      weaponLeft: pickRandom(WEAPON_LEFT_PARTS),
      backGear: pickRandom(BACK_GEAR_PARTS),
      palette: pickRandom(PALETTE_PART_DEFS),
    };
    setLoadout(randomized);
    onSave({
      ...profile,
      characterLoadout: randomized,
      unlockedParts,
      exp: currentExp,
    });
  };

  // 120形態図鑑から特定系統を適用
  const handleApplyBranchForm = (branch: StatBranchType) => {
    soundEngine.playEvolutionFanfare();
    const newAuto = resolveAutoLoadout(profile.gender, profile.level, branch);
    setLoadout(newAuto);
    onSave({
      ...profile,
      characterLoadout: newAuto,
      unlockedParts,
      exp: currentExp,
    });
  };

  const titleInfo = getCharacterEvolutionTitle(
    profile.gender,
    profile.level,
    profile.stats,
    loadout
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-[#0F172A] border-2 border-[#334155] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.9)] overflow-hidden"
        >
          {/* ヘッダー */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#334155] bg-[#1E293B]/70">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎨</span>
              <div>
                <h2 className="text-base font-black text-white tracking-wider flex items-center gap-2">
                  キャラ着せ替え ＆ 120形態図鑑
                </h2>
                <p className="text-[11px] text-[#94A3B8]">
                  4コマ・ドット絵アニメーション × 2,388万通りのパーツ組み合わせ
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded-full bg-[#111827] border border-[#FACC15]/40 flex items-center gap-1.5 shadow-inner">
                <span className="text-xs">⚡</span>
                <span className="text-xs font-black text-[#FACC15]">
                  {currentExp.toLocaleString()} LXP
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-[#334155]/60 hover:bg-[#475569] flex items-center justify-center text-[#94A3B8] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* キャラクタープレビューエリア（上部固定） */}
          <div className="px-5 py-4 bg-gradient-to-b from-[#111827] to-[#0F172A] border-b border-[#334155] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative w-28 h-28 flex items-center justify-center bg-[#07090E] rounded-xl border border-[#334155] shadow-inner overflow-hidden">
                <PixelCharacter
                  gender={profile.gender}
                  stage={profile.level}
                  loadout={loadout}
                  mood={previewMood}
                  size={104}
                  showAura={true}
                  animateFrames={true}
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#FACC15]/20 text-[#FACC15] border border-[#FACC15]/40">
                    Lv.{profile.level}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40">
                    {titleInfo.branchBadge}
                  </span>
                  {loadout.mode === "custom" ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#A855F7]/20 text-[#C084FC] border border-[#A855F7]/40">
                      カスタム
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#06B6D4]/20 text-[#22D3EE] border border-[#06B6D4]/40">
                      オート進化
                    </span>
                  )}
                </div>
                <h3 className="text-base font-black text-white tracking-wide">
                  {titleInfo.title}
                </h3>
                <p className="text-[11px] text-[#94A3B8] mt-0.5">
                  性別: {profile.gender === "boy" ? "男子 👦" : "女子 👧"} / 系統: {titleInfo.branchLabel}
                </p>

                {/* 4コマモーション確認ボタン */}
                <div className="flex items-center gap-1.5 mt-2">
                  <button
                    onClick={() => setPreviewMood("idle")}
                    className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                      previewMood === "idle"
                        ? "bg-[#38BDF8] text-black font-black"
                        : "bg-[#1E293B] text-[#94A3B8] hover:text-white"
                    }`}
                  >
                    待機4コマ
                  </button>
                  <button
                    onClick={() => setPreviewMood("attack")}
                    className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                      previewMood === "attack"
                        ? "bg-[#EF4444] text-white font-black"
                        : "bg-[#1E293B] text-[#94A3B8] hover:text-white"
                    }`}
                  >
                    斬撃4コマ
                  </button>
                  <button
                    onClick={() => setPreviewMood("happy")}
                    className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                      previewMood === "happy"
                        ? "bg-[#10B981] text-black font-black"
                        : "bg-[#1E293B] text-[#94A3B8] hover:text-white"
                    }`}
                  >
                    歓喜4コマ
                  </button>
                </div>
              </div>
            </div>

            {/* クイックアクション */}
            <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
              <button
                onClick={handleResetToAuto}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#334155] text-xs font-bold text-[#E2E8F0] border border-[#475569] transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#06B6D4]" />
                オート進化に戻す
              </button>
              <button
                onClick={handleRandomize}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#A855F7]/30 to-[#EC4899]/30 hover:from-[#A855F7]/45 hover:to-[#EC4899]/45 text-xs font-bold text-white border border-[#A855F7]/50 transition-all shadow-sm"
              >
                <Dice5 className="w-3.5 h-3.5 text-[#FACC15]" />
                🎲 ランダム着せ替え
              </button>
            </div>
          </div>

          {/* メインタブバー */}
          <div className="flex border-b border-[#334155] bg-[#0B0F19]">
            <button
              onClick={() => setMainTab("customize")}
              className={`flex-1 py-2.5 text-xs font-black flex items-center justify-center gap-2 border-b-2 transition-all ${
                mainTab === "customize"
                  ? "border-[#FACC15] text-[#FACC15] bg-[#1E293B]/40"
                  : "border-transparent text-[#94A3B8] hover:text-white"
              }`}
            >
              <Palette className="w-4 h-4" />
              🎨 パーツ自由着せ替え
            </button>
            <button
              onClick={() => setMainTab("codex")}
              className={`flex-1 py-2.5 text-xs font-black flex items-center justify-center gap-2 border-b-2 transition-all ${
                mainTab === "codex"
                  ? "border-[#FACC15] text-[#FACC15] bg-[#1E293B]/40"
                  : "border-transparent text-[#94A3B8] hover:text-white"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              📖 120形態・進化図鑑
            </button>
          </div>

          {/* タブコンテンツ */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mainTab === "customize" ? (
              <>
                {/* スロット選択タブ（横スクロール） */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {SLOT_TABS.map((tab) => {
                    const isSelected = activeSlot === tab.key;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActiveSlot(tab.key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                          isSelected
                            ? "bg-[#FACC15] text-black shadow-md font-black"
                            : "bg-[#1E293B] text-[#94A3B8] hover:text-white hover:bg-[#334155]"
                        }`}
                      >
                        {tab.icon}
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* パーツ一覧グリッド */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {getSlotParts(activeSlot).map((part) => {
                    const isEquipped = loadout[activeSlot] === part.id;
                    const unlocked = isPartUnlocked(part);
                    const canAfford = currentExp >= part.lxpCost;

                    return (
                      <div
                        key={part.id}
                        className={`relative p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                          isEquipped
                            ? "bg-[#1E293B] border-[#FACC15] shadow-[0_0_15px_rgba(250,204,21,0.2)]"
                            : unlocked
                            ? "bg-[#111827]/80 border-[#334155] hover:border-[#64748B]"
                            : "bg-[#090D16] border-[#1E293B] opacity-80"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-[#030712] border border-[#334155] flex items-center justify-center shrink-0">
                            {unlocked ? (
                              isEquipped ? (
                                <Check className="w-4 h-4 text-[#FACC15]" />
                              ) : (
                                <Sparkles className="w-4 h-4 text-[#38BDF8]" />
                              )
                            ) : (
                              <Lock className="w-4 h-4 text-[#64748B]" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-white truncate">
                                {part.name}
                              </span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-[#334155] text-[#CBD5E1] shrink-0">
                                {part.badge}
                              </span>
                            </div>
                            <div className="text-[10px] text-[#94A3B8] mt-0.5">
                              {part.lxpCost === 0
                                ? "初期解放"
                                : unlocked
                                ? "解放済み"
                                : `${part.lxpCost} LXP で即解放`}
                            </div>
                          </div>
                        </div>

                        {/* アクションボタン */}
                        <div className="shrink-0">
                          {isEquipped ? (
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-black bg-[#FACC15] text-black">
                              装備中
                            </span>
                          ) : unlocked ? (
                            <button
                              onClick={() => handleEquipPart(part)}
                              className="px-2.5 py-1 rounded-md text-[11px] font-black bg-[#334155] hover:bg-[#475569] text-white transition-all"
                            >
                              装備
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUnlockPart(part)}
                              disabled={!canAfford}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-black transition-all flex items-center gap-1 ${
                                canAfford
                                  ? "bg-gradient-to-r from-[#FACC15] to-[#EAB308] text-black hover:brightness-110 shadow-sm"
                                  : "bg-[#1E293B] text-[#64748B] cursor-not-allowed"
                              }`}
                            >
                              <Sparkles className="w-3 h-3" />
                              解放
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              /* 120形態・進化図鑑 */
              <div className="space-y-4">
                {/* 6系統セレクター */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(
                    Object.keys(STAT_BRANCH_INFO) as StatBranchType[]
                  ).map((branchKey) => {
                    const info = STAT_BRANCH_INFO[branchKey];
                    const isSelected = selectedBranch === branchKey;
                    return (
                      <button
                        key={branchKey}
                        onClick={() => setSelectedBranch(branchKey)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? "bg-[#1E293B] border-[#FACC15] shadow-md"
                            : "bg-[#111827] border-[#334155] hover:border-[#64748B]"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-black text-white">
                            {info.badge}
                          </span>
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: info.color }}
                          />
                        </div>
                        <div className="text-[11px] font-bold text-[#E2E8F0]">
                          {info.shortLabel}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* 選択中の系統バナー */}
                <div className="p-3.5 rounded-xl bg-[#111827] border border-[#334155] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-black text-white flex items-center gap-2">
                      <span>{STAT_BRANCH_INFO[selectedBranch].label}</span>
                    </h4>
                    <p className="text-[11px] text-[#94A3B8] mt-1">
                      {STAT_BRANCH_INFO[selectedBranch].description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleApplyBranchForm(selectedBranch)}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gradient-to-r from-[#FACC15] to-[#EAB308] text-black font-black text-xs hover:brightness-110 shadow-md shrink-0 flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    この系統の姿にする
                  </button>
                </div>

                {/* Lv.1〜10 の10段階プレビューリスト */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((stageNum) => {
                    const stageLoadout = resolveAutoLoadout(
                      profile.gender,
                      stageNum,
                      selectedBranch
                    );
                    const titleObj = getCharacterEvolutionTitle(
                      profile.gender,
                      stageNum,
                      undefined,
                      stageLoadout
                    );
                    const isCurrentStage = profile.level === stageNum;

                    return (
                      <div
                        key={stageNum}
                        className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all ${
                          isCurrentStage
                            ? "bg-[#1E293B] border-[#FACC15] shadow-md"
                            : "bg-[#090D16] border-[#1E293B]"
                        }`}
                      >
                        <div className="w-16 h-16 flex items-center justify-center bg-[#030712] rounded-lg border border-[#334155] mb-2 overflow-hidden shadow-inner">
                          <PixelCharacter
                            gender={profile.gender}
                            stage={stageNum}
                            loadout={stageLoadout}
                            size={56}
                            showAura={stageNum >= 5}
                            animateFrames={true}
                          />
                        </div>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-[#334155] text-[#FACC15] mb-1">
                          Lv.{stageNum}
                        </span>
                        <span className="text-[10px] font-bold text-white line-clamp-1">
                          {titleObj.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* フッター */}
          <div className="px-5 py-3 border-t border-[#334155] bg-[#1E293B]/60 flex items-center justify-between">
            <span className="text-[11px] text-[#94A3B8]">
              ※ パーツはいつでも自由に着せ替え・戻すことができます
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FACC15] to-[#EAB308] text-black font-black text-xs hover:brightness-110 shadow-md transition-all"
            >
              決定して閉じる
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
