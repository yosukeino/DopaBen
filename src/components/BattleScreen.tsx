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
  CheckCircle2,
  BookOpen,
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

interface AnswerFeedbackModalState {
  isCorrect: boolean;
  isRevenge: boolean;
  gainedExp: number;
  bountyMultiplier: number;
  comboCount: number;
  word: string;
  phonetic?: string;
  partOfSpeech?: string;
  meaning: string;
  tip: string;
  exampleSentenceEn?: string;
  exampleSentenceJa?: string;
  selectedChoiceId?: string;
  // 次の問題へ進む際に確定させるスナップショット
  nextSnapshot: {
    exp: number;
    maxCombo: number;
    revengeCount: number;
    gains: FiveStats;
    deck: GeneratedQuestion[];
  };
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

  // カットイン＆解説モーダル状態（正解・不正解ともに表示して1タップで次へ進む）
  const [bannerText, setBannerText] = useState<string | null>(null);
  const [bannerType, setBannerType] = useState<
    "weak" | "revenge" | "bounty" | "allout" | null
  >(null);
  const [answerModal, setAnswerModal] =
    useState<AnswerFeedbackModalState | null>(null);

  // ワードバンク（中学ステージの総攻撃並び替え）用の選択済みトークン
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

  // 新しい問題に切り替わった時のみ問題音声を再生（日→英の時は正解バレを防ぐため回答後に再生）
  useEffect(() => {
    if (!currentQuestion) return;
    setSelectedTokens([]);
    setEliminatedChoiceIds([]);
    setAnswerModal(null);

    if (currentQuestion.phase === "STAGE2_ALLOUT") {
      soundEngine.playAllOutIntro();
      setBannerType("allout");
      setBannerText("HOLD UP!! // 総攻撃チャンス！");
      const t = setTimeout(() => setBannerText(null), 1100);
      soundEngine.speakEnglish(currentQuestion.audioText, defaultSpeechRate);
      return () => clearTimeout(t);
    } else if (currentQuestion.format !== "ja_to_en") {
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
    setBannerText(null);
    setAnswerModal(null);

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

  /**
   * 4択の回答選択時：
   * 1. 正解の英単語の音声を流す
   * 2. 正解でも不正解でも「解説モーダル」を表示する
   * 3. ユーザーがもう1タップしたら次の問題へ進む（次の問題の音声と絶対に被らない！）
   */
  const handleSelectChoice = (choice: {
    id: string;
    label: string;
    speakOnTap?: string;
    isCorrect: boolean;
  }) => {
    if (answerModal) return;

    const targetWord = currentQuestion.word;
    const targetAudio = targetWord?.english || currentQuestion.audioText;

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
      // 正解後に英単語の音声をクリアに再生（自動遷移しないので次の問題と被らない）
      soundEngine.speakEnglish(targetAudio, defaultSpeechRate);

      setBannerType(isRevenge ? "revenge" : "weak");
      setBannerText(
        isRevenge
          ? `🔥 REVENGE JACKPOT!! +${gained} EXP (×${bountyMult}倍返し!)`
          : `WEAK!! → 1 MORE! (${newCombo} COMBO / +${gained} EXP)`
      );

      setAnswerModal({
        isCorrect: true,
        isRevenge,
        gainedExp: gained,
        bountyMultiplier: bountyMult,
        comboCount: newCombo,
        word: targetWord?.english || currentQuestion.audioText,
        phonetic: targetWord?.phonetic,
        partOfSpeech: targetWord?.partOfSpeech,
        meaning: targetWord?.japanese || "",
        tip: targetWord?.tip || "",
        exampleSentenceEn: targetWord?.exampleSentenceEn,
        exampleSentenceJa: targetWord?.exampleSentenceJa,
        selectedChoiceId: choice.id,
        nextSnapshot: {
          exp: nextExp,
          maxCombo: newMaxCombo,
          revengeCount: nextRevenge,
          gains: nextGains,
          deck,
        },
      });
    } else {
      soundEngine.playBountyLock();
      const mult = hasBountyOverdrive ? 3.5 : 2.5;
      const nextCombo = Math.max(1, Math.floor(combo / 2));
      setCombo(nextCombo);

      // 不正解時も正解の英単語の発音をしっかり聴かせる
      soundEngine.speakEnglish(targetAudio, 0.92);

      let updatedDeck = [...deck];
      if (targetWord) {
        const revengeFormat =
          currentQuestion.format === "en_to_ja" ? "ja_to_en" : "en_to_ja";
        const revengeQ = buildWordQuestion(targetWord, revengeFormat, {
          isRevengeBounty: true,
          bountyMultiplier: mult,
        });

        const insertPos = Math.max(currentIndex + 1, updatedDeck.length - 1);
        updatedDeck.splice(insertPos, 0, revengeQ);
        setDeck(updatedDeck);
      }

      setBannerType("bounty");
      setBannerText(`🛡️ BOUNTY LOCK!! 次回撃破で EXP ×${mult}倍！`);

      setAnswerModal({
        isCorrect: false,
        isRevenge: false,
        gainedExp: 0,
        bountyMultiplier: mult,
        comboCount: nextCombo,
        word: targetWord?.english || currentQuestion.audioText,
        phonetic: targetWord?.phonetic,
        partOfSpeech: targetWord?.partOfSpeech,
        meaning: targetWord?.japanese || "",
        tip: targetWord?.tip || "",
        exampleSentenceEn: targetWord?.exampleSentenceEn,
        exampleSentenceJa: targetWord?.exampleSentenceJa,
        selectedChoiceId: choice.id,
        nextSnapshot: {
          exp: earnedExp,
          maxCombo,
          revengeCount,
          gains: statGains,
          deck: updatedDeck,
        },
      });
    }
  };

  const handleActivatePhantomEye = () => {
    if (!currentQuestion.choices || eliminatedChoiceIds.length > 0 || answerModal)
      return;
    soundEngine.playTap();
    const wrongChoices = currentQuestion.choices
      .filter((c) => !c.isCorrect)
      .slice(0, 2)
      .map((c) => c.id);
    setEliminatedChoiceIds(wrongChoices);
  };

  const handleTapToken = (token: { id: string; text: string }) => {
    if (answerModal) return;
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
        setCombo(newCombo);
        setMaxCombo(newMaxCombo);
        setEarnedExp(nextExp);
        setStatGains(nextGains);

        soundEngine.playEvolutionFanfare();
        soundEngine.speakEnglish(answer, 1.0);
        setBannerType("allout");
        setBannerText(`💥 ALL-OUT FINISH!! 総攻撃成功 +${allOutBonus} EXP!!`);

        setAnswerModal({
          isCorrect: true,
          isRevenge: false,
          gainedExp: allOutBonus,
          bountyMultiplier: 1.0,
          comboCount: newCombo,
          word: answer,
          meaning: currentQuestion.sentence?.japanese || "",
          tip: currentQuestion.sentence?.grammarPoint || "",
          nextSnapshot: {
            exp: nextExp,
            maxCombo: newMaxCombo,
            revengeCount,
            gains: nextGains,
            deck,
          },
        });
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
    if (answerModal) return;
    soundEngine.playTap();
    setSelectedTokens((prev) => prev.filter((t) => t.id !== tokenId));
  };

  const progressPercent = Math.round(((currentIndex + 1) / deck.length) * 100);
  const isLastQuestion = answerModal
    ? currentIndex + 1 >= answerModal.nextSnapshot.deck.length
    : currentIndex + 1 >= deck.length;

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
            QUESTION:{" "}
            <strong className="text-white">
              {currentQuestion.phase === "STAGE2_ALLOUT"
                ? "総攻撃フィニッシュ（文構築）"
                : `${currentIndex + 1} / ${deck.length}`}
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
                  mood={answerModal?.isCorrect ? "happy" : "idle"}
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
                  {hasPhantomEye &&
                    eliminatedChoiceIds.length === 0 &&
                    !answerModal && (
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

                    const isAnswered = Boolean(answerModal);
                    const isSelectedChoice =
                      answerModal?.selectedChoiceId === choice.id;

                    let choiceStyle =
                      "bg-[#141911] hover:bg-[#FF206E] border-white shadow-[4px_4px_0_#FF206E] hover:shadow-[4px_4px_0_#FBFF12]";
                    if (isAnswered) {
                      if (choice.isCorrect) {
                        choiceStyle =
                          "bg-[#141911] border-[#41EAD4] shadow-[4px_4px_0_#41EAD4]";
                      } else if (isSelectedChoice && !choice.isCorrect) {
                        choiceStyle =
                          "bg-[#FF206E]/30 border-[#FF206E] opacity-80";
                      } else {
                        choiceStyle =
                          "bg-[#0C0F0A]/60 border-[#2C3527] opacity-45";
                      }
                    }

                    return (
                      <motion.button
                        key={choice.id}
                        whileTap={isAnswered ? undefined : { scale: 0.96, x: 6 }}
                        disabled={isAnswered}
                        onClick={() => handleSelectChoice(choice)}
                        className={`w-full py-3.5 px-4 text-left border-2 transition flex items-center justify-between group ${
                          idx % 2 === 0 ? "clip-p5-btn" : "clip-p5-btn-alt"
                        } ${choiceStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 font-black text-xs flex items-center justify-center border -skew-x-12 ${
                              isAnswered && choice.isCorrect
                                ? "bg-[#41EAD4] text-[#0C0F0A] border-white"
                                : "bg-[#FF206E] group-hover:bg-[#0C0F0A] text-white group-hover:text-[#FBFF12] border-white"
                            }`}
                          >
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

            {/* Stage 2: 総攻撃（中学ステージ用の例文ワードバンク並び替え） */}
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
                          disabled={isUsed || Boolean(answerModal)}
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

                  {selectedTokens.length > 0 && !answerModal && (
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

      {/* 正解・不正解共通『解説＆発音確認モーダル』（もう1タップで次の問題へ進む） */}
      <AnimatePresence>
        {answerModal && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="fixed inset-x-0 bottom-0 z-50 p-3.5 max-w-md mx-auto"
          >
            <div
              className={`bg-[#141911] border-2 p-4 shadow-[0_-10px_35px_rgba(12,15,10,0.92)] space-y-3 ${
                answerModal.isCorrect
                  ? "border-[#41EAD4] shadow-[0_-6px_28px_rgba(65,234,212,0.3)]"
                  : "border-[#FBFF12] shadow-[0_-6px_28px_rgba(255,32,110,0.35)]"
              }`}
            >
              {/* 1. 判定ヘッダー */}
              <div className="flex items-center justify-between gap-2">
                {answerModal.isCorrect ? (
                  <span className="bg-[#41EAD4] text-[#0C0F0A] font-black text-xs px-2.5 py-0.5 -skew-x-12 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {answerModal.isRevenge
                      ? `REVENGE JACKPOT!! ×${answerModal.bountyMultiplier}倍返し撃破！`
                      : `WEAK!! 正解！ (${answerModal.comboCount} CHAIN)`}
                  </span>
                ) : (
                  <span className="bg-[#FBFF12] text-[#0C0F0A] font-black text-xs px-2.5 py-0.5 -skew-x-12 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    ペナルティなし！倍返し懸賞金ロックオン！
                  </span>
                )}

                <span
                  className={`font-black text-xs ${
                    answerModal.isCorrect ? "text-[#FBFF12]" : "text-[#41EAD4]"
                  }`}
                >
                  {answerModal.isCorrect
                    ? `+${answerModal.gainedExp} EXP GET!!`
                    : `次回撃破で EXP ×${answerModal.bountyMultiplier}倍！`}
                </span>
              </div>

              {/* 2. 見出し語・発音・意味・解説フック */}
              <div className="bg-[#0C0F0A] border border-[#2C3527] p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-xl font-black text-white">
                        {answerModal.word}
                      </span>
                      {answerModal.phonetic && (
                        <span className="text-xs font-bold text-[#41EAD4]">
                          {answerModal.phonetic}
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-black text-[#FBFF12] mt-0.5">
                      ＝ {answerModal.meaning}
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      soundEngine.speakEnglish(
                        answerModal.word,
                        defaultSpeechRate
                      )
                    }
                    className="bg-[#FF206E] hover:brightness-110 px-2.5 py-2 border border-white text-white text-xs font-black flex items-center gap-1 shrink-0 active:scale-95 transition"
                  >
                    <Volume2 className="w-4 h-4" />
                    発音
                  </button>
                </div>

                {answerModal.tip && (
                  <div className="text-xs text-[#C8D4C2] border-t border-[#2C3527] pt-2 leading-relaxed">
                    💡 <span className="font-bold">{answerModal.tip}</span>
                  </div>
                )}

                {/* 公式例文＆和訳（英検1級などで登録されている場合に表示＋音声再生可能） */}
                {answerModal.exampleSentenceEn && (
                  <div className="bg-[#141911] border border-[#2C3527] p-2.5 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-xs font-bold text-white leading-snug">
                        <BookOpen className="w-3.5 h-3.5 text-[#41EAD4] inline mr-1 -mt-0.5" />
                        {answerModal.exampleSentenceEn}
                      </div>
                      <button
                        onClick={() =>
                          soundEngine.speakEnglish(
                            answerModal.exampleSentenceEn!,
                            defaultSpeechRate
                          )
                        }
                        className="text-[10px] font-black text-[#41EAD4] hover:text-[#FBFF12] border border-[#41EAD4] px-1.5 py-0.5 shrink-0"
                      >
                        🔊 例文
                      </button>
                    </div>
                    {answerModal.exampleSentenceJa && (
                      <div className="text-[11px] text-[#A3B19B]">
                        {answerModal.exampleSentenceJa}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 3. もう1タップで次の問題へ進むボタン */}
              <button
                onClick={() => {
                  soundEngine.playTap();
                  const snap = answerModal.nextSnapshot;
                  advanceToNext(
                    snap.exp,
                    snap.maxCombo,
                    snap.revengeCount,
                    snap.gains,
                    snap.deck
                  );
                }}
                className={`w-full py-3.5 font-black text-base border-2 border-white -skew-x-6 active:scale-95 transition ${
                  answerModal.isCorrect
                    ? "bg-[#FF206E] text-white shadow-[4px_4px_0_#41EAD4]"
                    : "bg-[#FBFF12] text-[#0C0F0A] shadow-[4px_4px_0_#FF206E]"
                }`}
              >
                {isLastQuestion
                  ? "バトル完了！リザルト画面へ進む ▶"
                  : answerModal.isCorrect
                  ? "次の問題へ進む（1 MORE!） ▶"
                  : "覚えた！次の問題へ進む（後で倍返し！） ▶"}
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
