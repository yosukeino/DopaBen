"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  Turtle,
  Flame,
  Zap,
  Eye,
  RotateCcw,
  ArrowLeft,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import {
  FiveStats,
  GeneratedQuestion,
  PlayerProfile,
} from "@/lib/types";
import { buildWordQuestion } from "@/lib/questionGenerator";
import { soundEngine } from "@/lib/soundEngine";
import { PixelCharacter } from "./PixelCharacter";

export interface BattleResultSummary {
  earnedExp: number;
  maxCombo: number;
  revengeCount: number;
  wordsCleared: number;
  statGains: Partial<FiveStats>;
}

interface BattleScreenProps {
  initialDeck: GeneratedQuestion[];
  profile: PlayerProfile;
  onCompleteBattle: (summary: BattleResultSummary) => void;
  onAbort: () => void;
}

export const BattleScreen: React.FC<BattleScreenProps> = ({
  initialDeck,
  profile,
  onCompleteBattle,
  onAbort,
}) => {
  const [deck, setDeck] = useState<GeneratedQuestion[]>(initialDeck);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [earnedExp, setEarnedExp] = useState(0);
  const [revengeCount, setRevengeCount] = useState(0);

  // カットイン＆フィードバック状態
  const [bannerText, setBannerText] = useState<string | null>(null);
  const [bannerType, setBannerType] = useState<
    "weak" | "revenge" | "bounty" | "allout" | null
  >(null);
  const [bountyTip, setBountyTip] = useState<{
    word: string;
    meaning: string;
    tip: string;
    multiplier: number;
  } | null>(null);

  // ワードバンク（総攻撃並び替え）用の選択済みトークン
  const [selectedTokens, setSelectedTokens] = useState<
    { id: string; text: string }[]
  >([]);

  // Lv.3特権スキル「PHANTOM EYE（2択ハック）」の使用状態
  const [eliminatedChoiceIds, setEliminatedChoiceIds] = useState<string[]>([]);

  // ステータスの獲得蓄積
  const [statGains, setStatGains] = useState<FiveStats>({
    vocab: 3,
    speed: 2,
    grammar: 2,
    listening: 2,
    guts: 2,
  });

  const currentQuestion = deck[currentIndex];
  const hasBountyOverdrive =
    profile.level >= 2 &&
    profile.activeSkillHacks.includes("bounty_overdrive");
  const hasPhantomEye =
    profile.level >= 3 &&
    profile.activeSkillHacks.includes("phantom_eliminator");
  const hasHardcoreHack =
    profile.level >= 5 &&
    profile.activeSkillHacks.includes("hardcore_challenge");
  const hasOverclockAudio =
    profile.level >= 7 && profile.activeSkillHacks.includes("overclock_audio");
  const hasLegendAura =
    profile.level >= 10 && profile.activeSkillHacks.includes("legend_aura");

  const defaultSpeechRate = hasOverclockAudio ? 1.35 : 1.0;

  useEffect(() => {
    if (!currentQuestion) return;
    setSelectedTokens([]);
    setEliminatedChoiceIds([]);

    if (currentQuestion.phase === "STAGE2_ALLOUT") {
      soundEngine.playAllOutIntro();
      setBannerType("allout");
      setBannerText("HOLD UP!! // 総攻撃チャンス！");
      const t = setTimeout(() => setBannerText(null), 1100);
      soundEngine.speakEnglish(currentQuestion.audioText, defaultSpeechRate);
      return () => clearTimeout(t);
    } else {
      soundEngine.speakEnglish(currentQuestion.audioText, defaultSpeechRate);
    }
  }, [currentIndex, currentQuestion, defaultSpeechRate]);

  if (!currentQuestion) return null;

  const getGlobalMultiplier = () => {
    let mult = 1.0;
    if (hasHardcoreHack) mult *= 2.0;
    if (hasOverclockAudio) mult *= 1.5;
    if (hasLegendAura) mult *= 2.0;
    return mult;
  };

  const advanceToNext = (
    nextExp: number,
    nextMaxCombo: number,
    nextRevengeCount: number,
    updatedGains: FiveStats,
    currentDeckSnapshot: GeneratedQuestion[]
  ) => {
    if (currentIndex + 1 >= currentDeckSnapshot.length) {
      onCompleteBattle({
        earnedExp: Math.round(nextExp),
        maxCombo: nextMaxCombo,
        revengeCount: nextRevengeCount,
        wordsCleared: currentDeckSnapshot.length,
        statGains: updatedGains,
      });
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSelectChoice = (choice: {
    id: string;
    label: string;
    speakOnTap?: string;
    isCorrect: boolean;
  }) => {
    if (bountyTip) return;

    if (choice.speakOnTap) {
      soundEngine.speakEnglish(choice.speakOnTap, defaultSpeechRate);
    }

    if (choice.isCorrect) {
      const newCombo = combo + 1;
      const newMaxCombo = Math.max(maxCombo, newCombo);
      setCombo(newCombo);
      setMaxCombo(newMaxCombo);

      const isRevenge = Boolean(currentQuestion.isRevengeBounty);
      const bountyMult = isRevenge
        ? currentQuestion.bountyMultiplier || (hasBountyOverdrive ? 3.5 : 2.5)
        : 1.0;

      const baseExp = currentQuestion.isHardcoreQuestion ? 60 : 35;
      const gained = Math.round(
        baseExp * (1 + newCombo * 0.15) * bountyMult * getGlobalMultiplier()
      );
      const nextExp = earnedExp + gained;
      setEarnedExp(nextExp);

      const nextRevenge = isRevenge ? revengeCount + 1 : revengeCount;
      if (isRevenge) setRevengeCount(nextRevenge);

      const nextGains: FiveStats = {
        vocab: statGains.vocab + (currentQuestion.isHardcoreQuestion ? 4 : 2),
        speed: statGains.speed + (newCombo >= 3 ? 3 : 2),
        grammar: statGains.grammar + 1,
        listening:
          statGains.listening +
          (currentQuestion.format === "listening" ? 4 : 1),
        guts: statGains.guts + (isRevenge ? 6 : 1),
      };
      setStatGains(nextGains);

      soundEngine.playWeakHit(newCombo, isRevenge);
      setBannerType(isRevenge ? "revenge" : "weak");
      setBannerText(
        isRevenge
          ? `🔥 REVENGE JACKPOT!! +${gained} EXP (×${bountyMult}倍返し!)`
          : `WEAK!! → 1 MORE! (${newCombo} COMBO / +${gained} EXP)`
      );

      setTimeout(() => {
        setBannerText(null);
        advanceToNext(nextExp, newMaxCombo, nextRevenge, nextGains, deck);
      }, 520);
    } else {
      soundEngine.playBountyLock();
      const mult = hasBountyOverdrive ? 3.5 : 2.5;
      setCombo(Math.max(1, Math.floor(combo / 2)));

      if (currentQuestion.word) {
        soundEngine.speakEnglish(currentQuestion.word.english, 0.9);
        const revengeFormat =
          currentQuestion.format === "en_to_ja" ? "ja_to_en" : "en_to_ja";
        const revengeQ = buildWordQuestion(currentQuestion.word, revengeFormat, {
          isRevengeBounty: true,
          bountyMultiplier: mult,
        });

        const updatedDeck = [...deck];
        const insertPos = Math.max(currentIndex + 1, updatedDeck.length - 1);
        updatedDeck.splice(insertPos, 0, revengeQ);
        setDeck(updatedDeck);

        setBountyTip({
          word: currentQuestion.word.english,
          meaning: currentQuestion.word.japanese,
          tip: currentQuestion.word.tip,
          multiplier: mult,
        });
      }
    }
  };

  const handleActivatePhantomEye = () => {
    if (!currentQuestion.choices || eliminatedChoiceIds.length > 0) return;
    soundEngine.playTap();
    const wrongChoices = currentQuestion.choices
      .filter((c) => !c.isCorrect)
      .slice(0, 2)
      .map((c) => c.id);
    setEliminatedChoiceIds(wrongChoices);
  };

  const handleTapToken = (token: { id: string; text: string }) => {
    soundEngine.playTap();
    soundEngine.speakEnglish(token.text, defaultSpeechRate);

    const nextSelected = [...selectedTokens, token];
    setSelectedTokens(nextSelected);

    const targetTokens = currentQuestion.wordBank?.correctTokens || [];

    if (nextSelected.length === targetTokens.length) {
      const assembled = nextSelected.map((t) => t.text).join(" ");
      const answer = targetTokens.join(" ");

      if (assembled === answer) {
        const newCombo = combo + 2;
        const newMaxCombo = Math.max(maxCombo, newCombo);
        const allOutBonus = Math.round(120 * getGlobalMultiplier());
        const nextExp = earnedExp + allOutBonus;

        const nextGains: FiveStats = {
          ...statGains,
          grammar: statGains.grammar + 6,
          vocab: statGains.vocab + 4,
        };

        soundEngine.playEvolutionFanfare();
        soundEngine.speakEnglish(answer, 1.0);
        setBannerType("allout");
        setBannerText(`💥 ALL-OUT FINISH!! 総攻撃成功 +${allOutBonus} EXP!!`);

        setTimeout(() => {
          setBannerText(null);
          advanceToNext(nextExp, newMaxCombo, revengeCount, nextGains, deck);
        }, 1050);
      } else {
        soundEngine.playBountyLock();
        setStatGains((prev) => ({ ...prev, guts: prev.guts + 2 }));
        setBannerType("bounty");
        setBannerText("⚡ 語順を再構築せよ！（度胸ボーナス +2 獲得！）");
        setTimeout(() => {
          setBannerText(null);
          setSelectedTokens([]);
        }, 750);
      }
    }
  };

  const handleRemoveSelectedToken = (tokenId: string) => {
    soundEngine.playTap();
    setSelectedTokens((prev) => prev.filter((t) => t.id !== tokenId));
  };

  const progressPercent = Math.round(((currentIndex + 1) / deck.length) * 100);

  return (
    <div className="min-h-screen w-full max-w-md mx-auto flex flex-col justify-between bg-[#0C0F0A] bg-halftone p-3.5 relative overflow-hidden">
      {/* 上部ステータス＆進捗バー */}
      <div className="relative z-20 space-y-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              soundEngine.playTap();
              onAbort();
            }}
            className="bg-[#141911] border border-[#2C3527] px-2.5 py-1 text-xs font-black flex items-center gap-1 hover:border-[#41EAD4]"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#41EAD4]" /> 拠点へ
          </button>

          <div className="flex items-center gap-2">
            <motion.div
              key={combo}
              initial={{ scale: 1.35 }}
              animate={{ scale: 1 }}
              className="bg-[#FF206E] text-white px-2.5 py-1 font-black text-xs -skew-x-12 border border-white flex items-center gap-1"
            >
              <Flame className="w-3.5 h-3.5 fill-[#FBFF12] text-[#FBFF12]" />
              {combo} CHAIN
            </motion.div>

            <motion.div
              key={earnedExp}
              initial={{ scale: 1.25 }}
              animate={{ scale: 1 }}
              className="bg-[#FBFF12] text-[#0C0F0A] px-2.5 py-1 font-black text-xs -skew-x-12 border border-[#0C0F0A]"
            >
              +{earnedExp} EXP
            </motion.div>
          </div>
        </div>

        {/* 斜めプログレスバー */}
        <div className="w-full h-3 bg-[#141911] border border-[#2C3527] -skew-x-12 overflow-hidden p-0.5">
          <motion.div
            className="h-full bg-gradient-to-r from-[#FF206E] via-[#FBFF12] to-[#41EAD4]"
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-bold text-[#A3B19B]">
          <span>
            PHASE:{" "}
            <strong className="text-white">
              {currentQuestion.phase === "STAGE2_ALLOUT"
                ? "2段目：総攻撃（文構築）"
                : `1段目：高速反射 (${currentIndex + 1}/${deck.length})`}
            </strong>
          </span>
          <div className="flex items-center gap-1.5">
            {hasHardcoreHack && (
              <span className="bg-[#FF206E]/25 text-[#FBFF12] border border-[#FF206E] px-1.5 py-0.5 text-[10px] font-black">
                鬼モード×2.0
              </span>
            )}
            {hasOverclockAudio && (
              <span className="bg-[#0C0F0A] text-[#41EAD4] border border-[#41EAD4] px-1.5 py-0.5 text-[10px] font-black">
                1.35x倍速
              </span>
            )}
          </div>
        </div>
      </div>

      {/* カットイン・バナー演出 */}
      <AnimatePresence>
        {bannerText && (
          <motion.div
            initial={{ x: -320, opacity: 0, skewX: -14 }}
            animate={{ x: 0, opacity: 1, skewX: -10 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 26 }}
            className={`fixed top-20 left-2 right-2 max-w-md mx-auto z-40 py-2.5 px-4 border-2 text-center font-black text-sm tracking-wider shadow-2xl pointer-events-none ${
              bannerType === "revenge"
                ? "bg-[#FBFF12] text-[#0C0F0A] border-white shadow-[0_0_25px_#FBFF12]"
                : bannerType === "allout"
                ? "bg-[#FF206E] text-white border-[#FBFF12] shadow-[0_0_25px_#FF206E]"
                : "bg-white text-[#0C0F0A] border-[#FF206E]"
            }`}
          >
            {bannerText}
          </motion.div>
        )}
      </AnimatePresence>

      {/* メイン問題カード領域 */}
      <div className="my-auto py-2 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.uid}
            initial={{ x: 90, opacity: 0, rotate: 1.5 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            exit={{ x: -90, opacity: 0, rotate: -1.5 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* キャラクターミニ応援＆問題ヘッダー */}
            <div className="flex items-center gap-3">
              <div className="bg-[#141911] border-2 border-[#41EAD4] p-1 shrink-0 shadow-[3px_3px_0_#FF206E]">
                <PixelCharacter
                  gender={profile.gender}
                  stage={profile.level}
                  size={58}
                  mood={bannerType ? "happy" : "idle"}
                  showAura={false}
                />
              </div>

              <div className="flex-1">
                <div
                  className={`inline-block px-2.5 py-0.5 text-[11px] font-black -skew-x-12 mb-1 ${
                    currentQuestion.isRevengeBounty
                      ? "bg-[#FBFF12] text-[#0C0F0A] animate-pulse"
                      : currentQuestion.phase === "STAGE2_ALLOUT"
                      ? "bg-[#41EAD4] text-[#0C0F0A]"
                      : "bg-[#FF206E] text-white"
                  }`}
                >
                  {currentQuestion.promptTitle}
                </div>
                {currentQuestion.isRevengeBounty && (
                  <div className="text-xs font-black text-[#FBFF12] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    今撃破で EXP ×{currentQuestion.bountyMultiplier}倍 ＆ 度胸爆伸び！
                  </div>
                )}
              </div>
            </div>

            {/* ターゲット問題パネル */}
            <div
              className={`p-5 border-2 relative clip-p5-card ${
                currentQuestion.isRevengeBounty
                  ? "bg-[#141911] border-[#FBFF12] shadow-p5-yellow"
                  : currentQuestion.phase === "STAGE2_ALLOUT"
                  ? "bg-[#141911] border-[#41EAD4] shadow-p5-cyan"
                  : "bg-[#141911] border-white shadow-p5-pink"
              }`}
            >
              <div className="text-center space-y-2">
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-white break-words">
                  {currentQuestion.promptMain}
                </div>
                {currentQuestion.promptSub && (
                  <div className="text-xs font-bold text-[#41EAD4]">
                    {currentQuestion.promptSub}
                  </div>
                )}

                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    onClick={() =>
                      soundEngine.speakEnglish(
                        currentQuestion.audioText,
                        defaultSpeechRate
                      )
                    }
                    className="bg-[#FF206E] hover:brightness-110 text-white font-black text-xs px-3.5 py-2 border border-white -skew-x-6 flex items-center gap-1.5 active:scale-95 transition"
                  >
                    <Volume2 className="w-4 h-4" />
                    発音を聞く
                  </button>
                  <button
                    onClick={() =>
                      soundEngine.speakEnglish(currentQuestion.audioText, 0.6)
                    }
                    className="bg-[#0C0F0A] hover:border-white text-[#41EAD4] font-black text-xs px-3 py-2 border border-[#41EAD4] -skew-x-6 flex items-center gap-1.5 active:scale-95 transition"
                    title="ゆっくり発音"
                  >
                    <Turtle className="w-4 h-4" />
                    ゆっくり
                  </button>
                </div>
              </div>
            </div>

            {/* Stage 1: 4択ボタン */}
            {currentQuestion.phase === "STAGE1_COMBO" &&
              currentQuestion.choices && (
                <div className="space-y-2.5 pt-1">
                  {hasPhantomEye && eliminatedChoiceIds.length === 0 && (
                    <div className="flex justify-end">
                      <button
                        onClick={handleActivatePhantomEye}
                        className="bg-[#0C0F0A] text-[#41EAD4] border border-[#41EAD4] px-3 py-1 text-xs font-black -skew-x-6 flex items-center gap-1.5 hover:bg-[#41EAD4] hover:text-[#0C0F0A] transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        特権ハック：誤答を2つ消去（PHANTOM EYE）
                      </button>
                    </div>
                  )}

                  {currentQuestion.choices.map((choice, idx) => {
                    const isEliminated = eliminatedChoiceIds.includes(choice.id);
                    if (isEliminated) {
                      return (
                        <div
                          key={choice.id}
                          className="w-full py-3 px-4 bg-[#0C0F0A]/50 border border-[#2C3527] text-[#2C3527] text-xs font-black line-through text-center -skew-x-3"
                        >
                          [PHANTOM EYE により消去済み]
                        </div>
                      );
                    }

                    return (
                      <motion.button
                        key={choice.id}
                        whileTap={{ scale: 0.96, x: 6 }}
                        onClick={() => handleSelectChoice(choice)}
                        className={`w-full py-3.5 px-4 text-left border-2 transition flex items-center justify-between group ${
                          idx % 2 === 0 ? "clip-p5-btn" : "clip-p5-btn-alt"
                        } bg-[#141911] hover:bg-[#FF206E] border-white shadow-[4px_4px_0_#FF206E] hover:shadow-[4px_4px_0_#FBFF12]`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 bg-[#FF206E] group-hover:bg-[#0C0F0A] text-white group-hover:text-[#FBFF12] font-black text-xs flex items-center justify-center border border-white -skew-x-12">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="font-black text-base text-white tracking-wide">
                              {choice.label}
                            </div>
                            {choice.subLabel && (
                              <div className="text-[11px] text-[#41EAD4] group-hover:text-white">
                                {choice.subLabel}
                              </div>
                            )}
                          </div>
                        </div>
                        <Zap className="w-4 h-4 text-[#FBFF12] opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition" />
                      </motion.button>
                    );
                  })}
                </div>
              )}

            {/* Stage 2: 総攻撃（例文ワードバンク並び替え） */}
            {currentQuestion.phase === "STAGE2_ALLOUT" &&
              currentQuestion.wordBank && (
                <div className="space-y-4">
                  <div className="min-h-[76px] p-3 bg-[#141911] border-2 border-[#FBFF12] flex flex-wrap items-center gap-2">
                    {selectedTokens.length === 0 ? (
                      <span className="text-xs text-[#A3B19B] font-bold">
                        下の英単語チップを順番にタップして英文を完成させろ！
                      </span>
                    ) : (
                      selectedTokens.map((tok) => (
                        <motion.button
                          key={tok.id}
                          initial={{ scale: 0.8, y: 10 }}
                          animate={{ scale: 1, y: 0 }}
                          onClick={() => handleRemoveSelectedToken(tok.id)}
                          className="bg-[#FBFF12] text-[#0C0F0A] font-black text-sm px-3 py-1.5 border border-[#0C0F0A] -skew-x-6 shadow-[2px_2px_0_#FF206E]"
                        >
                          {tok.text}
                        </motion.button>
                      ))
                    )}
                  </div>

                  <div className="flex flex-wrap justify-center gap-2.5">
                    {currentQuestion.wordBank.shuffledTokens.map((tok) => {
                      const isUsed = selectedTokens.some((s) => s.id === tok.id);
                      return (
                        <button
                          key={tok.id}
                          disabled={isUsed}
                          onClick={() => handleTapToken(tok)}
                          className={`px-3.5 py-2.5 font-black text-sm border-2 -skew-x-6 transition ${
                            isUsed
                              ? "bg-[#141911] border-[#2C3527] text-[#2C3527] opacity-40"
                              : "bg-[#141911] border-white text-white shadow-[3px_3px_0_#41EAD4] hover:bg-[#FF206E] active:scale-95"
                          }`}
                        >
                          {tok.text}
                        </button>
                      );
                    })}
                  </div>

                  {selectedTokens.length > 0 && (
                    <div className="flex justify-center">
                      <button
                        onClick={() => {
                          soundEngine.playTap();
                          setSelectedTokens([]);
                        }}
                        className="text-xs text-[#41EAD4] hover:text-white flex items-center gap-1 font-bold"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> 最初から並べ直す
                      </button>
                    </div>
                  )}
                </div>
              )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ミス時の「倍返しターゲットロック」オーバーレイ */}
      <AnimatePresence>
        {bountyTip && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed inset-x-0 bottom-0 z-50 p-4 max-w-md mx-auto"
          >
            <div className="bg-[#141911] border-2 border-[#FBFF12] p-4 shadow-[0_-8px_30px_rgba(255,32,110,0.35)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="bg-[#FBFF12] text-[#0C0F0A] font-black text-xs px-2.5 py-0.5 -skew-x-12 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  ペナルティなし！倍返し懸賞金ロックオン！
                </span>
                <span className="text-[#41EAD4] font-black text-sm">
                  次回撃破で EXP ×{bountyTip.multiplier}倍！
                </span>
              </div>

              <div className="bg-[#0C0F0A] border border-[#2C3527] p-3 flex items-center justify-between">
                <div>
                  <div className="text-xl font-black text-white">
                    {bountyTip.word}{" "}
                    <span className="text-[#FBFF12] text-base ml-2">
                      ＝ {bountyTip.meaning}
                    </span>
                  </div>
                  <div className="text-xs text-[#C8D4C2] mt-1">
                    💡 {bountyTip.tip}
                  </div>
                </div>
                <button
                  onClick={() => soundEngine.speakEnglish(bountyTip.word, 0.9)}
                  className="bg-[#FF206E] p-2.5 border border-white text-white shrink-0"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => {
                  soundEngine.playTap();
                  setBountyTip(null);
                  advanceToNext(
                    earnedExp,
                    maxCombo,
                    revengeCount,
                    statGains,
                    deck
                  );
                }}
                className="w-full py-3 bg-[#FBFF12] text-[#0C0F0A] font-black text-sm border-2 border-white -skew-x-6 shadow-[4px_4px_0_#FF206E] active:scale-95 transition"
              >
                覚えた！数問後の『倍返しチャンス』へ進む ▶
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center text-[11px] text-[#A3B19B] pt-2">
        💡 ミスしても減点なし！最後まで走り切ると獲得EXP＆五角形ステータス全加算！
      </div>
    </div>
  );
};
