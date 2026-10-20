"use client";

import React, { useEffect, useState, useCallback } from "react";
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
  Lock,
} from "lucide-react";
import {
  BattleWordLog,
  FiveStats,
  GeneratedQuestion,
  PlayerProfile,
} from "@/lib/types";
import {
  buildWordQuestion,
  splitSentenceByTargetWord,
} from "@/lib/questionGenerator";
import { soundEngine } from "@/lib/soundEngine";
import { PixelCharacter } from "./PixelCharacter";

export interface RankingBattleStats {
  timeMs: number;
  score: number;
  totalQuestions: number;
  gamePoints: number;
  maxCombo: number;
}

export interface BattleResultSummary {
  earnedExp: number;
  maxCombo: number;
  revengeCount: number;
  wordsCleared: number;
  statGains: Partial<FiveStats>;
  wordLogs: BattleWordLog[];
  masteryDeltas: Record<string, { cleared: number; missed: number }>;
  rankingStats?: RankingBattleStats;
}

/**
 * スマホ端末の触覚フィードバック（バイブレーション）
 * - ネイティブアプリのような「コンッ」とした極短のキータップ手応え
 * - Android等の対応ブラウザで小気味よく振動（iOS Safariでは無害にスルー）
 */
const triggerHapticFeedback = (type: "light" | "medium" | "heavy" | "success" | "error" = "light") => {
  if (typeof window === "undefined" || !("vibrate" in navigator)) return;
  try {
    switch (type) {
      case "light":
        // わずか12msの超短パルス：モーターが尾を引かない「コンッ」とした心地よいタップ手応え
        navigator.vibrate(12);
        break;
      case "medium":
        navigator.vibrate(22);
        break;
      case "heavy":
        navigator.vibrate(36);
        break;
      case "success":
        // 極短パルスによるリズミカルな「コ・コンッ！」
        navigator.vibrate([10, 40, 14]);
        break;
      case "error":
        // 短めの微小2連振動「ツ・ツッ」
        navigator.vibrate([18, 45, 18]);
        break;
    }
  } catch {
    // ignore
  }
};

interface BattleScreenProps {
  initialDeck: GeneratedQuestion[];
  profile: PlayerProfile;
  onCompleteBattle: (summary: BattleResultSummary) => void;
  onAbort: () => void;
  isRankingBattle?: boolean;
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
  nextSnapshot: {
    exp: number;
    maxCombo: number;
    revengeCount: number;
    gains: FiveStats;
    deck: GeneratedQuestion[];
    wordLogs: BattleWordLog[];
    masteryDeltas: Record<string, { cleared: number; missed: number }>;
    correctCount: number;
  };
}

export const BattleScreen: React.FC<BattleScreenProps> = ({
  initialDeck,
  profile,
  onCompleteBattle,
  onAbort,
  isRankingBattle = false,
}) => {
  const [deck, setDeck] = useState<GeneratedQuestion[]>(initialDeck);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [earnedExp, setEarnedExp] = useState(0);
  const [revengeCount, setRevengeCount] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  // ランキングバトル用タイマー
  const startTimeRef = React.useRef<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState<string>("00:00.0");

  useEffect(() => {
    if (!isRankingBattle) return;
    startTimeRef.current = Date.now();
    const timer = setInterval(() => {
      const ms = Date.now() - startTimeRef.current;
      const totalSec = Math.floor(ms / 1000);
      const m = Math.floor(totalSec / 60);
      const s = totalSec % 60;
      const d = Math.floor((ms % 1000) / 100);
      setElapsedTime(
        `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${d}`
      );
    }, 100);
    return () => clearInterval(timer);
  }, [isRankingBattle]);

  // 今回のバトルで出題された単語の戦績ログ＆習熟度差分
  const [wordLogs, setWordLogs] = useState<BattleWordLog[]>([]);
  const [masteryDeltas, setMasteryDeltas] = useState<
    Record<string, { cleared: number; missed: number }>
  >({});

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

  // 音声再生中フラグ＆現在再生中テキスト（ボタンの波形アニメ・二重再生防止用）
  const [isSpeakingAudio, setIsSpeakingAudio] = useState(false);
  const [currentSpeakingText, setCurrentSpeakingText] = useState("");

  useEffect(() => {
    return soundEngine.onSpeakingChange((speaking, text) => {
      setIsSpeakingAudio(speaking);
      setCurrentSpeakingText(speaking ? text : "");
    });
  }, []);

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

  const isAdvancingRef = React.useRef(false);

  // バトル画面マウント時にも念のためデッキ全単語＆例文のGoogle TTS音声をプリロード
  useEffect(() => {
    const preloadList: string[] = [];
    initialDeck.forEach((q) => {
      if (q.audioText) preloadList.push(q.audioText);
      if (q.word?.english) preloadList.push(q.word.english);
      if (q.word?.exampleSentenceEn) preloadList.push(q.word.exampleSentenceEn);
    });
    soundEngine.preloadTexts(preloadList);
  }, [initialDeck]);

  // 新しい問題に切り替わった時：前の音声をリセットし、プリロード済みのGoogle TTS音声を再生
  useEffect(() => {
    isAdvancingRef.current = false;
    if (!currentQuestion) return;
    setSelectedTokens([]);
    setEliminatedChoiceIds([]);
    setAnswerModal(null);
    soundEngine.stopSpeech();

    let timer: NodeJS.Timeout | null = null;

    if (currentQuestion.phase === "STAGE2_ALLOUT") {
      soundEngine.playAllOutIntro();
      setBannerType("allout");
      setBannerText("HOLD UP!! // 総攻撃チャンス！");
      timer = setTimeout(() => {
        setBannerText(null);
        soundEngine.speakEnglish(currentQuestion.audioText, defaultSpeechRate);
      }, 650);
    } else if (!currentQuestion.hideAudioBeforeAnswer) {
      // プリロード済みの Web Audio API バッファから即座に発音
      timer = setTimeout(() => {
        soundEngine.speakEnglish(currentQuestion.audioText, defaultSpeechRate);
      }, 60);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, currentQuestion?.uid, defaultSpeechRate]);

  const getGlobalMultiplier = useCallback(() => {
    let mult = 1.0;
    if (hasHardcoreHack) mult *= 2.0;
    if (hasOverclockAudio) mult *= 1.5;
    if (hasLegendAura) mult *= 2.0;
    return mult;
  }, [hasHardcoreHack, hasOverclockAudio, hasLegendAura]);

  const advanceToNext = useCallback(
    (
      nextExp: number,
      nextMaxCombo: number,
      nextRevengeCount: number,
      updatedGains: FiveStats,
      currentDeckSnapshot: GeneratedQuestion[],
      updatedLogs: BattleWordLog[],
      updatedDeltas: Record<string, { cleared: number; missed: number }>,
      nextCorrectCount?: number
    ) => {
      if (isAdvancingRef.current) return;
      isAdvancingRef.current = true;

      soundEngine.stopSpeech();
      setBannerText(null);
      setAnswerModal(null);

      if (currentIndex + 1 >= currentDeckSnapshot.length) {
        const timeMs = Date.now() - startTimeRef.current;
        const correctCount =
          typeof nextCorrectCount === "number"
            ? nextCorrectCount
            : updatedLogs.filter((l) => l.result !== "missed").length;
        const basePts = correctCount * 500;
        const comboPts = nextMaxCombo * 80;
        const timeBonus = Math.max(0, 10000 - Math.floor(timeMs / 10));
        const gamePoints = basePts + comboPts + timeBonus;

        onCompleteBattle({
          earnedExp: Math.round(nextExp),
          maxCombo: nextMaxCombo,
          revengeCount: nextRevengeCount,
          wordsCleared: correctCount,
          statGains: updatedGains,
          wordLogs: updatedLogs,
          masteryDeltas: updatedDeltas,
          rankingStats: isRankingBattle
            ? {
                timeMs,
                score: correctCount,
                totalQuestions: currentDeckSnapshot.length,
                gamePoints,
                maxCombo: nextMaxCombo,
              }
            : undefined,
        });
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    },
    [currentIndex, onCompleteBattle, isRankingBattle]
  );

  /**
   * 4択の回答選択時：
   * 1. 正解の英単語の音声を流す
   * 2. 正解でも不正解でも「解説モーダル」を表示する
   * 3. ユーザーがもう1タップしたら次の問題へ進む（次の問題の音声と絶対に被らない！）
   */
  const handleSelectChoice = useCallback(
    (choice: {
      id: string;
      label: string;
      speakOnTap?: string;
      isCorrect: boolean;
    }) => {
      if (!currentQuestion || answerModal) return;

      const targetWord = currentQuestion.word;
      const targetAudio = targetWord?.english || currentQuestion.audioText;

      // 習熟度デルタ＆戦績ログの更新計算
      const nextDeltas = { ...masteryDeltas };
      const nextLogs = [...wordLogs];

      if (targetWord) {
        const prevDelta = nextDeltas[targetWord.id] || {
          cleared: 0,
          missed: 0,
        };
        nextDeltas[targetWord.id] = {
          cleared: prevDelta.cleared + (choice.isCorrect ? 1 : 0),
          missed: prevDelta.missed + (choice.isCorrect ? 0 : 1),
        };

        const existingIdx = nextLogs.findIndex(
          (l) => l.wordId === targetWord.id
        );
        const logStatus: BattleWordLog["result"] = choice.isCorrect
          ? currentQuestion.isRevengeBounty
            ? "revenge"
            : "perfect"
          : "missed";

        if (existingIdx >= 0) {
          nextLogs[existingIdx] = {
            ...nextLogs[existingIdx],
            result: logStatus,
          };
        } else {
          nextLogs.push({
            wordId: targetWord.id,
            english: targetWord.english,
            japanese: targetWord.japanese,
            phonetic: targetWord.phonetic,
            tip: targetWord.tip,
            exampleSentenceEn: targetWord.exampleSentenceEn,
            exampleSentenceJa: targetWord.exampleSentenceJa,
            result: logStatus,
          });
        }
      } else {
        // targetWord がない場合（短文問題など）のフォールバック
        nextLogs.push({
          wordId: currentQuestion.uid,
          english: currentQuestion.audioText || currentQuestion.promptMain,
          japanese: currentQuestion.promptSub || currentQuestion.promptMain,
          phonetic: "",
          tip: currentQuestion.promptSub || "",
          result: choice.isCorrect ? "perfect" : "missed",
        });
      }

      setMasteryDeltas(nextDeltas);
      setWordLogs(nextLogs);

      const newCorrectCount = correctAnswersCount + (choice.isCorrect ? 1 : 0);
      if (choice.isCorrect) {
        setCorrectAnswersCount(newCorrectCount);
        const newCombo = combo + 1;
        const newMaxCombo = Math.max(maxCombo, newCombo);
        setCombo(newCombo);
        setMaxCombo(newMaxCombo);

        const isRevenge = Boolean(currentQuestion.isRevengeBounty);
        const bountyMult = isRevenge
          ? currentQuestion.bountyMultiplier || (hasBountyOverdrive ? 3.5 : 2.5)
          : 1.0;

        const baseExp = currentQuestion.isHardcoreQuestion ? 30 : 20;
        const gained = Math.round(
          baseExp * (1 + newCombo * 0.12) * bountyMult * getGlobalMultiplier()
        );
        const nextExp = earnedExp + gained;
        setEarnedExp(nextExp);

        const nextRevenge = isRevenge ? revengeCount + 1 : revengeCount;
        if (isRevenge) setRevengeCount(nextRevenge);

        const nextGains: FiveStats = {
          vocab: statGains.vocab + (currentQuestion.isHardcoreQuestion ? 4 : 2),
          speed: statGains.speed + (newCombo >= 3 ? 3 : 2),
          grammar:
            statGains.grammar +
            (currentQuestion.format === "sentence_fill" ? 4 : 1),
          listening:
            statGains.listening +
            (currentQuestion.format === "listening" ? 4 : 1),
          guts: statGains.guts + (isRevenge ? 6 : 1),
        };
        setStatGains(nextGains);

        triggerHapticFeedback(isRevenge ? "success" : "light");
        soundEngine.playWeakHit(newCombo, isRevenge);
        // プリロード済みの Google TTS (Web Audio API) で例文（なければ英単語）の発音を即座に再生
        const speechAudio = targetWord?.exampleSentenceEn || targetAudio;
        soundEngine.speakEnglish(speechAudio, defaultSpeechRate);

        setBannerType(isRevenge ? "revenge" : "weak");
        setBannerText(
          isRevenge
            ? `🔥 REVENGE JACKPOT!! +${gained} LXP (×${bountyMult}倍返し!)`
            : `WEAK!! → 1 MORE! (${newCombo} COMBO / +${gained} LXP)`
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
            wordLogs: nextLogs,
            masteryDeltas: nextDeltas,
            correctCount: newCorrectCount,
          },
        });
      } else {
        soundEngine.playBountyLock();
        const mult = hasBountyOverdrive ? 3.5 : 2.5;
        const nextCombo = Math.max(1, Math.floor(combo / 2));
        setCombo(nextCombo);

        // 不正解時もプリロード済みの Google TTS (Web Audio API) で正解英単語の発音を即座に再生
        soundEngine.speakEnglish(targetAudio, 0.95);

        let updatedDeck = [...deck];
        // ランキングバトル以外の場合のみリベンジ問題を挿入
        if (!isRankingBattle && targetWord) {
          const revengeFormat =
            currentQuestion.format === "en_to_ja" ? "ja_to_en" : "en_to_ja";
          const revengeQ = buildWordQuestion(targetWord, revengeFormat, {
            isRevengeBounty: true,
            bountyMultiplier: mult,
          });

          const insertPos = Math.min(
            updatedDeck.length,
            Math.max(currentIndex + 2, updatedDeck.length)
          );
          updatedDeck.splice(insertPos, 0, revengeQ);
          setDeck(updatedDeck);
        }

        setBannerType("bounty");
        setBannerText(`🛡️ BOUNTY LOCK!! 次回撃破で LXP ×${mult}倍！`);

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
            wordLogs: nextLogs,
            masteryDeltas: nextDeltas,
            correctCount: newCorrectCount,
          },
        });
      }
    },
    [
      answerModal,
      combo,
      currentIndex,
      currentQuestion,
      deck,
      defaultSpeechRate,
      earnedExp,
      getGlobalMultiplier,
      hasBountyOverdrive,
      masteryDeltas,
      maxCombo,
      revengeCount,
      statGains,
      wordLogs,
      correctAnswersCount,
      isRankingBattle,
    ]
  );

  // PCテスター向けの快適キーボードショートカット（1〜4で選択、Space/Enterで次へ、Rで発音再生）
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentQuestion) return;

      if (answerModal) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (isLastQuestion) {
            soundEngine.playTap();
          } else {
            soundEngine.playTransition();
          }
          const snap = answerModal.nextSnapshot;
          advanceToNext(
            snap.exp,
            snap.maxCombo,
            snap.revengeCount,
            snap.gains,
            snap.deck,
            snap.wordLogs,
            snap.masteryDeltas,
            snap.correctCount
          );
        } else if (e.key === "r" || e.key === "R") {
          e.preventDefault();
          soundEngine.speakEnglish(answerModal.word, defaultSpeechRate);
        }
        return;
      }

      if (
        currentQuestion.phase === "STAGE1_COMBO" &&
        currentQuestion.choices
      ) {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= currentQuestion.choices.length) {
          const targetChoice = currentQuestion.choices[num - 1];
          if (
            targetChoice &&
            !eliminatedChoiceIds.includes(targetChoice.id)
          ) {
            e.preventDefault();
            handleSelectChoice(targetChoice);
          }
        } else if (
          (e.key === "r" || e.key === "R") &&
          !currentQuestion.hideAudioBeforeAnswer
        ) {
          e.preventDefault();
          soundEngine.speakEnglish(
            currentQuestion.audioText,
            defaultSpeechRate
          );
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    advanceToNext,
    answerModal,
    currentQuestion,
    defaultSpeechRate,
    eliminatedChoiceIds,
    handleSelectChoice,
  ]);

  if (!currentQuestion) return null;

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
        const allOutBonus = Math.round(60 * getGlobalMultiplier());
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

        triggerHapticFeedback("success");
        soundEngine.playEvolutionFanfare();
        soundEngine.speakEnglish(answer, 1.0);
        setBannerType("allout");
        setBannerText(`💥 ALL-OUT FINISH!! 総攻撃成功 +${allOutBonus} LXP!!`);

        const newCorrect = correctAnswersCount + 1;
        setCorrectAnswersCount(newCorrect);

        const updatedLogsWithSentence: BattleWordLog[] = [
          ...wordLogs,
          {
            wordId: currentQuestion.uid,
            english: answer,
            japanese: currentQuestion.sentence?.japanese || currentQuestion.promptMain,
            phonetic: "",
            tip: currentQuestion.sentence?.grammarPoint || "",
            result: "perfect",
          },
        ];
        setWordLogs(updatedLogsWithSentence);

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
            wordLogs: updatedLogsWithSentence,
            masteryDeltas,
            correctCount: newCorrect,
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

  // 例文中のターゲット語をハイライト表示するヘルパー
  const renderHighlightedSentence = (sentence: string, baseWord: string) => {
    const split = splitSentenceByTargetWord(sentence, baseWord);
    if (!split) return <span>{sentence}</span>;
    return (
      <span>
        {split.before}
        <span className="text-[#FACC15] font-black underline decoration-[#FACC15] decoration-2 underline-offset-2 px-0.5">
          {split.matched}
        </span>
        {split.after}
      </span>
    );
  };

  const progressPercent = Math.round(((currentIndex + 1) / deck.length) * 100);
  const isLastQuestion = answerModal
    ? currentIndex + 1 >= answerModal.nextSnapshot.deck.length
    : currentIndex + 1 >= deck.length;

  const isGirl = profile.gender === "girl";

  return (
    <div
      className={`min-h-screen w-full max-w-md mx-auto flex flex-col justify-between p-3.5 pb-6 relative overflow-x-hidden transition-colors duration-300 ${
        isGirl ? "bg-[#13091B] bg-halftone-girl" : "bg-[#0B0D12] bg-halftone"
      }`}
    >
      {/* 上部ステータス＆進捗バー */}
      <div className="relative z-20 space-y-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              soundEngine.playTap();
              onAbort();
            }}
            className={`border px-2.5 py-1 text-xs font-black flex items-center gap-1 transition ${
              isGirl
                ? "bg-[#1D1229] border-[#3D2752] hover:border-[#F43F5E]"
                : "bg-[#131720] border-[#262D3D] hover:border-[#FACC15]"
            }`}
          >
            <ArrowLeft className={`w-3.5 h-3.5 ${isGirl ? "text-[#FB7185]" : "text-[#FACC15]"}`} /> 拠点へ
          </button>

          <div className="flex items-center gap-2">
            {/* ランキングバトル専用タイマー */}
            {isRankingBattle && (
              <div className="px-2.5 py-1 bg-amber-950/80 border border-amber-400 text-amber-300 font-mono font-black text-xs flex items-center gap-1 shadow-[0_0_10px_rgba(250,204,21,0.3)] -skew-x-6">
                <span>⏱</span>
                <span>{elapsedTime}</span>
              </div>
            )}

            <motion.div
              key={combo}
              initial={{ scale: 1.35 }}
              animate={{ scale: 1 }}
              className={`text-white px-2.5 py-1 font-black text-xs -skew-x-12 border border-white flex items-center gap-1 ${
                isGirl ? "bg-[#1D1229]" : "bg-[#131720]"
              }`}
            >
              <Flame className={`w-3.5 h-3.5 fill-[#FACC15] ${isGirl ? "text-[#FB7185]" : "text-[#FACC15]"}`} />
              {combo} CHAIN
            </motion.div>

            <motion.div
              key={earnedExp}
              initial={{ scale: 1.25 }}
              animate={{ scale: 1 }}
              className={`px-2.5 py-1 font-black text-xs -skew-x-12 border ${
                isGirl
                  ? "bg-[#F43F5E] text-white border-white"
                  : "bg-[#FACC15] text-[#0B0D12] border-[#0B0D12]"
              }`}
            >
              +{earnedExp} LXP
            </motion.div>
          </div>
        </div>

        {/* 斜めプログレスバー */}
        <div className={`w-full h-3 border -skew-x-12 overflow-hidden p-0.5 ${
          isGirl ? "bg-[#1D1229] border-[#3D2752]" : "bg-[#131720] border-[#262D3D]"
        }`}>
          <motion.div
            className={`h-full ${isGirl ? "bg-[#2DD4BF]" : "bg-[#10B981]"}`}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-bold text-[#94A3B8]">
          <div className="flex items-center gap-1.5">
            {isRankingBattle && (
              <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 px-1.5 py-0.5 rounded text-[10px] font-black shadow-sm">
                🏆 RANKING
              </span>
            )}
            <span>
              QUESTION:{" "}
              <strong className="text-white">
                {currentQuestion.phase === "STAGE2_ALLOUT"
                  ? "総攻撃フィニッシュ（文構築）"
                  : `${currentIndex + 1} / ${deck.length}`}
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {currentQuestion.format === "sentence_fill" && (
              <span className={`px-1.5 py-0.5 text-[10px] font-black border ${
                isGirl
                  ? "bg-[#1D1229] text-[#FB7185] border-[#FB7185]"
                  : "bg-[#131720] text-[#FACC15] border-[#FACC15]"
              }`}>
                文脈穴埋め
              </span>
            )}
            {hasHardcoreHack && (
              <span className="bg-[#FACC15] text-[#0B0D12] border border-white px-1.5 py-0.5 text-[10px] font-black">
                激ムズLXP×2.0
              </span>
            )}
            {hasOverclockAudio && (
              <span className={`px-1.5 py-0.5 text-[10px] font-black border ${
                isGirl
                  ? "bg-[#1D1229] text-[#FB7185] border-[#FB7185]"
                  : "bg-[#131720] text-[#FACC15] border-[#FACC15]"
              }`}>
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
            className="space-y-3.5"
          >
            {/* キャラクターミニ応援＆問題ヘッダー */}
            <div className="flex items-center gap-3">
              <div className="bg-[#131720] border-2 border-white p-1 shrink-0 shadow-[3px_3px_0_#FACC15]">
                <PixelCharacter
                  gender={profile.gender}
                  stage={profile.level}
                  stats={profile.stats}
                  loadout={profile.characterLoadout}
                  size={54}
                  mood={
                    answerModal?.isCorrect
                      ? "attack"
                      : combo >= 5
                      ? "happy"
                      : "idle"
                  }
                  showAura={profile.level >= 5}
                  animateFrames={true}
                />
              </div>

              <div className="flex-1">
                <div
                  className={`inline-block px-2.5 py-0.5 text-[11px] font-black -skew-x-12 mb-1 border ${
                    currentQuestion.isRevengeBounty
                      ? "bg-[#EF4444] text-white border-white animate-pulse"
                      : "bg-[#FACC15] text-[#0B0D12] border-white"
                  }`}
                >
                  {currentQuestion.promptTitle}
                </div>
                {currentQuestion.isRevengeBounty && (
                  <div className="text-xs font-black text-[#FACC15] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    今撃破で LXP ×{currentQuestion.bountyMultiplier}倍！
                  </div>
                )}
              </div>
            </div>

            {/* ターゲット問題パネル */}
            <div
              className={`p-4 sm:p-5 border-2 relative ${
                isGirl
                  ? "bg-gradient-to-br from-[#1D1229] via-[#2A173B] to-[#13091B]"
                  : "bg-gradient-to-br from-[#131720] via-[#1a202c] to-[#0B0D12]"
              } ${
                currentQuestion.isRevengeBounty
                  ? "border-[#EF4444] shadow-[4px_4px_0_#EF4444]"
                  : isGirl
                  ? "border-white shadow-[4px_4px_0_#F43F5E]"
                  : "border-white shadow-[4px_4px_0_#FACC15]"
              }`}
            >
              <div className="text-center space-y-2">
                <div
                  className={`${
                    currentQuestion.format === "sentence_fill"
                      ? "text-base sm:text-lg leading-relaxed text-left font-bold"
                      : "text-2xl sm:text-3xl font-black tracking-tight"
                  } text-white break-words`}
                >
                  {currentQuestion.format === "sentence_fill" &&
                  currentQuestion.word?.exampleSentenceEn ? (
                    answerModal ? (
                      renderHighlightedSentence(
                        currentQuestion.word.exampleSentenceEn,
                        currentQuestion.word.english
                      )
                    ) : (
                      <span>
                        {currentQuestion.promptMain
                          .split("[  ______  ]")
                          .map((part, i, arr) => (
                            <React.Fragment key={i}>
                              {part}
                              {i < arr.length - 1 && (
                                <span
                                  className="inline-block align-middle bg-[#0B0D12] border-2 border-[#FACC15] w-20 sm:w-24 h-7 sm:h-8 mx-1.5 rounded-[2px] shadow-[0_0_8px_rgba(250,204,21,0.25)]"
                                  aria-label="空欄"
                                />
                              )}
                            </React.Fragment>
                          ))}
                      </span>
                    )
                  ) : (
                    currentQuestion.promptMain
                  )}
                </div>

                {currentQuestion.promptSub && (() => {
                  if (currentQuestion.format === "sentence_fill") {
                    const match =
                      currentQuestion.promptSub.match(/^(.*?)\s*(\(#[0-9]+.*?\))$/) ||
                      currentQuestion.promptSub.match(/^(.*?)\s*(\(.*?\))$/);
                    if (match) {
                      const mainText = match[1].trim();
                      const metaText = match[2].trim();
                      return (
                        <div className="text-left border-t border-[#262D3D] pt-2 flex items-baseline justify-between gap-2 flex-wrap">
                          <span className="text-[#E2E8F0] font-bold text-xs sm:text-sm leading-snug">
                            {mainText}
                          </span>
                          <span className="text-[10px] text-[#64748B] font-mono shrink-0">
                            {metaText}
                          </span>
                        </div>
                      );
                    }
                    return (
                      <div className="text-xs font-bold text-[#E2E8F0] text-left border-t border-[#262D3D] pt-2">
                        {currentQuestion.promptSub}
                      </div>
                    );
                  }

                  return (
                    <div className="text-xs font-bold text-[#FACC15]">
                      {currentQuestion.promptSub}
                    </div>
                  );
                })()}

                {/* 音声ボタン（listening問題時は再生ボタン、回答前に音声非表示の問題では何も表示しない） */}
                {(!currentQuestion.hideAudioBeforeAnswer || Boolean(answerModal)) && (
                  <div className="pt-1.5 flex items-center justify-center gap-2.5 flex-wrap">
                    {currentQuestion.format === "listening" ? (
                    <div className="w-full flex items-center justify-center gap-2.5">
                      <button
                        onClick={() =>
                          soundEngine.speakEnglish(
                            currentQuestion.audioText,
                            defaultSpeechRate
                          )
                        }
                        className={`px-4 py-2 text-sm font-black border-2 -skew-x-6 flex items-center justify-center gap-2 active:scale-95 transition ${
                          isSpeakingAudio
                            ? "bg-[#FACC15] text-[#0B0D12] border-white shadow-[0_0_15px_rgba(250,204,21,0.7)] animate-pulse"
                            : "bg-[#0B0D12] text-[#FACC15] border-[#FACC15] hover:bg-[#FACC15] hover:text-[#0B0D12]"
                        }`}
                      >
                        <Volume2 className={`w-5 h-5 ${isSpeakingAudio ? "animate-bounce" : ""}`} />
                        {isSpeakingAudio ? "🔊 音声を再生中..." : "🔊 もう一度聴く (Rキー)"}
                      </button>
                      <button
                        onClick={() =>
                          soundEngine.speakEnglish(
                            currentQuestion.audioText,
                            0.7
                          )
                        }
                        className="bg-[#0B0D12] hover:border-white text-[#94A3B8] hover:text-white font-black text-xs px-3 py-2 border border-[#262D3D] -skew-x-6 flex items-center gap-1.5 active:scale-95 transition"
                        title="ゆっくり再生 (0.7倍速)"
                      >
                        <Turtle className="w-4 h-4" />
                        0.7x
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          soundEngine.speakEnglish(
                            currentQuestion.audioText,
                            defaultSpeechRate
                          )
                        }
                        className={`font-black text-xs px-3.5 py-1.5 border -skew-x-6 flex items-center gap-1.5 active:scale-95 transition ${
                          isSpeakingAudio
                            ? "bg-[#FACC15] text-[#0B0D12] border-white shadow-[0_0_12px_rgba(250,204,21,0.6)] animate-pulse"
                            : "bg-[#0B0D12] hover:bg-[#FACC15] hover:text-[#0B0D12] text-[#FACC15] border-[#FACC15]"
                        }`}
                      >
                        <Volume2 className={`w-4 h-4 ${isSpeakingAudio ? "animate-bounce" : ""}`} />
                        {isSpeakingAudio ? "再生中..." : "発音を聞く (R)"}
                      </button>
                      <button
                        onClick={() =>
                          soundEngine.speakEnglish(
                            currentQuestion.audioText,
                            0.7
                          )
                        }
                        className="bg-[#0B0D12] hover:border-white text-[#94A3B8] hover:text-white font-black text-xs px-3 py-1.5 border border-[#262D3D] -skew-x-6 flex items-center gap-1.5 active:scale-95 transition"
                        title="ゆっくり発音 (0.7倍速)"
                      >
                        <Turtle className="w-4 h-4" />
                        0.7x
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

            {/* Stage 1: 4択ボタン */}
            {currentQuestion.phase === "STAGE1_COMBO" &&
              currentQuestion.choices && (
                <div className="space-y-2 pt-0.5">
                  {hasPhantomEye &&
                    eliminatedChoiceIds.length === 0 &&
                    !answerModal && (
                      <div className="flex justify-end">
                        <button
                          onClick={handleActivatePhantomEye}
                          className="bg-[#0B0D12] text-[#FACC15] border border-[#FACC15] px-3 py-1 text-xs font-black -skew-x-6 flex items-center gap-1.5 hover:bg-[#FACC15] hover:text-[#0B0D12] transition"
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
                          className="w-full py-3 px-4 bg-[#0B0D12]/50 border border-[#262D3D] text-[#94A3B8]/50 text-xs font-black line-through text-center -skew-x-3"
                        >
                          [PHANTOM EYE により消去済み]
                        </div>
                      );
                    }

                    const isAnswered = Boolean(answerModal);
                    const isSelectedChoice =
                      answerModal?.selectedChoiceId === choice.id;

                    let choiceStyle = isGirl
                      ? "bg-gradient-to-r from-[#1D1229] to-[#2A173B] border-white text-white shadow-[3px_3px_0_#13091B] hover:border-[#F43F5E] hover:shadow-[3px_3px_0_#F43F5E]"
                      : "bg-gradient-to-r from-[#131720] to-[#1a202c] border-white text-white shadow-[3px_3px_0_#0B0D12] hover:border-[#FACC15] hover:shadow-[3px_3px_0_#FACC15]";
                    if (isAnswered) {
                      if (choice.isCorrect) {
                        choiceStyle =
                          "bg-gradient-to-r from-[#064E3B] to-[#131720] border-[#10B981] shadow-[3px_3px_0_#10B981] text-white";
                      } else if (isSelectedChoice && !choice.isCorrect) {
                        choiceStyle =
                          "bg-gradient-to-r from-[#7F1D1D] to-[#131720] border-[#EF4444] shadow-[3px_3px_0_#EF4444] text-white";
                      } else {
                        choiceStyle = isGirl
                          ? "bg-[#13091B]/70 border-[#3D2752] opacity-40 text-[#94A3B8]"
                          : "bg-[#0B0D12]/70 border-[#262D3D] opacity-40 text-[#94A3B8]";
                      }
                    }

                    return (
                      <motion.button
                        key={choice.id}
                        whileTap={isAnswered ? undefined : { scale: 0.98 }}
                        disabled={isAnswered}
                        onClick={() => handleSelectChoice(choice)}
                        className={`w-full py-3 px-3.5 sm:px-4 text-left border-2 transition flex items-center justify-between group -skew-x-2 ${choiceStyle}`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* こだわりのスタイリッシュ番号バッジ */}
                          <div className="relative shrink-0 flex items-center justify-center">
                            <div
                              className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center font-black text-xs sm:text-sm -skew-x-6 border-2 transition-all relative overflow-hidden shadow-[2px_2px_0_#0B0D12] ${
                                isAnswered && choice.isCorrect
                                  ? "bg-[#10B981] text-[#0B0D12] border-white shadow-[0_0_10px_#10B981]"
                                  : isAnswered && isSelectedChoice && !choice.isCorrect
                                  ? "bg-[#EF4444] text-white border-white shadow-[0_0_10px_#EF4444]"
                                  : isGirl
                                  ? "bg-[#13091B] text-[#FB7185] border-[#FB7185]/80 group-hover:border-white group-hover:bg-[#F43F5E] group-hover:text-white"
                                  : "bg-[#0B0D12] text-[#FACC15] border-[#FACC15]/80 group-hover:border-white group-hover:bg-[#FACC15] group-hover:text-[#0B0D12]"
                              }`}
                            >
                              {/* バッジ上部の光沢スライス */}
                              <span className="pointer-events-none absolute top-0 inset-x-0 h-[2px] bg-white/50" />
                              <span className="relative z-10 italic">{idx + 1}</span>
                            </div>
                          </div>

                          {/* 選択肢テキスト */}
                          <div className="min-w-0">
                            <div className={`font-black text-base sm:text-lg text-white tracking-wide truncate transition-colors ${
                              isGirl ? "group-hover:text-[#FB7185]" : "group-hover:text-[#FACC15]"
                            }`}>
                              {choice.label}
                            </div>
                            {choice.subLabel && (
                              <div className="text-[11px] text-[#94A3B8] truncate">
                                {choice.subLabel}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}

            {/* Stage 2: 総攻撃（例文ワードバンク並び替え） */}
            {currentQuestion.phase === "STAGE2_ALLOUT" &&
              currentQuestion.wordBank && (
                <div className="space-y-4">
                  <div className="min-h-[76px] p-3 bg-[#131720] border-2 border-[#FACC15] flex flex-wrap items-center gap-2">
                    {selectedTokens.length === 0 ? (
                      <span className="text-xs text-[#94A3B8] font-bold">
                        下の英単語チップを順番にタップして英文を完成させろ！
                      </span>
                    ) : (
                      selectedTokens.map((tok) => (
                        <motion.button
                          key={tok.id}
                          initial={{ scale: 0.8, y: 10 }}
                          animate={{ scale: 1, y: 0 }}
                          onClick={() => handleRemoveSelectedToken(tok.id)}
                          className="bg-[#FACC15] text-[#0B0D12] font-black text-sm px-3 py-1.5 border border-white -skew-x-6"
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
                              ? "bg-[#131720] border-[#262D3D] text-[#262D3D] opacity-40"
                              : "bg-[#131720] border-white text-white hover:bg-[#FACC15] hover:text-[#0B0D12] active:scale-95"
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
                        className="text-xs text-[#FACC15] hover:text-white flex items-center gap-1 font-bold"
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

      {/* 正解・不正解共通『解説＆発音確認モーダル』（正解＝エメラルドグリーン / 不正解＝レッド で直感的に判別可能） */}
      <AnimatePresence>
        {answerModal && (
          <>
            {/* 背景の半透明カラーフラッシュ暗幕（正解＝エメラルド、不正解＝レッド） */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`fixed inset-0 backdrop-blur-[2px] z-40 transition-colors ${
                answerModal.isCorrect
                  ? "bg-[#022C22]/80"
                  : "bg-[#450A0A]/85"
              }`}
            />

            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 420, damping: 28 }}
              className="fixed inset-x-0 bottom-0 z-50 p-3.5 max-w-md mx-auto"
            >
              <div
                className={`border-2 p-4 space-y-3 ${
                  answerModal.isCorrect
                    ? "bg-gradient-to-b from-[#10B981] via-[#059669] to-[#064E3B] border-white shadow-[0_-10px_40px_rgba(16,185,129,0.65)]"
                    : "bg-gradient-to-b from-[#EF4444] via-[#DC2626] to-[#7F1D1D] border-white shadow-[0_-10px_40px_rgba(239,68,68,0.75)]"
                }`}
              >
                {/* 1. 判定ヘッダー（正解：エメラルド×白 / 不正解：レッド×黄色） */}
                <div className="flex items-center justify-between gap-2">
                  {answerModal.isCorrect ? (
                    <span className="bg-white text-[#064E3B] font-black text-xs sm:text-sm px-3 py-1 -skew-x-12 flex items-center gap-1.5 shadow-[3px_3px_0_#022C22]">
                      <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                      {answerModal.isRevenge
                        ? `⭕ REVENGE!! ×${answerModal.bountyMultiplier}倍返し正解！`
                        : `⭕ 正解！！ GREAT!! (${answerModal.comboCount} CHAIN)`}
                    </span>
                  ) : (
                    <span className="bg-[#FACC15] text-[#0B0D12] font-black text-xs sm:text-sm px-3 py-1 -skew-x-12 flex items-center gap-1.5 shadow-[3px_3px_0_#450A0A]">
                      <ShieldAlert className="w-4 h-4 text-[#DC2626] shrink-0" />
                      ❌ 不正解... MISS!!（後で倍返し！）
                    </span>
                  )}

                  <span
                    className={`font-black text-xs sm:text-sm px-2 py-0.5 border -skew-x-6 ${
                      answerModal.isCorrect
                        ? "bg-[#0B0D12]/85 text-[#FACC15] border-white"
                        : "bg-[#0B0D12]/85 text-[#FACC15] border-white"
                    }`}
                  >
                    {answerModal.isCorrect
                      ? `+${answerModal.gainedExp} LXP GET!!`
                      : `次回撃破 LXP ×${answerModal.bountyMultiplier}倍`}
                  </span>
                </div>

                {/* 2. 見出し語・発音・意味・解説フック */}
                <div
                  className={`p-3 space-y-2 border ${
                    answerModal.isCorrect
                      ? "bg-[#0B0D12]/90 border-[#10B981]"
                      : "bg-[#0B0D12]/90 border-[#EF4444]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-xl font-black text-white">
                          {answerModal.word}
                        </span>
                        {answerModal.phonetic && (
                          <span className="text-xs font-bold text-[#94A3B8]">
                            {answerModal.phonetic}
                          </span>
                        )}
                        {answerModal.partOfSpeech && (
                          <span className="text-[11px] font-bold text-white/90 bg-[#131720] border border-[#262D3D] px-1.5 py-0.5 rounded-sm">
                            {answerModal.partOfSpeech}
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-black text-[#FACC15] mt-1">
                        ＝ {answerModal.meaning}
                      </div>
                    </div>

                    {(() => {
                      const isSpeakingThisWord =
                        isSpeakingAudio &&
                        Boolean(
                          currentSpeakingText &&
                            answerModal.word &&
                            currentSpeakingText.trim().toLowerCase() ===
                              answerModal.word.trim().toLowerCase()
                        );
                      return (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() =>
                              soundEngine.speakEnglish(
                                answerModal.word,
                                defaultSpeechRate
                              )
                            }
                            className={`px-2.5 py-2 border text-xs font-black flex items-center gap-1 active:scale-95 transition ${
                              isSpeakingThisWord
                                ? "bg-[#FACC15] text-[#0B0D12] border-white shadow-[0_0_12px_rgba(250,204,21,0.6)] animate-pulse"
                                : "bg-[#131720] hover:bg-[#FACC15] hover:text-[#0B0D12] border-[#FACC15] text-[#FACC15]"
                            }`}
                            title="発音を再生 (Rキー)"
                          >
                            <Volume2
                              className={`w-4 h-4 ${isSpeakingThisWord ? "animate-bounce" : ""}`}
                            />
                            {isSpeakingThisWord ? "再生中" : "発音 (R)"}
                          </button>
                          <button
                            onClick={() =>
                              soundEngine.speakEnglish(
                                answerModal.word,
                                0.7
                              )
                            }
                            className="bg-[#131720] hover:border-white text-[#94A3B8] hover:text-white font-black text-xs px-2 py-2 border border-[#262D3D] flex items-center gap-1 active:scale-95 transition"
                            title="ゆっくり発音 (0.7倍速)"
                          >
                            <Turtle className="w-3.5 h-3.5" />
                            0.7x
                          </button>
                        </div>
                      );
                    })()}
                  </div>

                  {(() => {
                    if (!answerModal.tip) return null;
                    const cleanedTip = answerModal.exampleSentenceEn
                      ? answerModal.tip
                          .replace(answerModal.exampleSentenceEn, "")
                          .replace(/^\s*\/\s*/, "")
                          .trim()
                      : answerModal.tip.trim();
                    if (!cleanedTip) return null;
                    return (
                      <div className="text-xs text-white/90 border-t border-white/15 pt-2 leading-relaxed">
                        💡 <span className="font-bold">{cleanedTip}</span>
                      </div>
                    );
                  })()}

                  {/* 公式例文＆和訳（ターゲット単語をイエローでハイライト＋例文音声再生） */}
                  {answerModal.exampleSentenceEn && (() => {
                    const isSpeakingThisSentence =
                      isSpeakingAudio &&
                      Boolean(
                        currentSpeakingText &&
                          answerModal.exampleSentenceEn &&
                          currentSpeakingText.trim().toLowerCase() ===
                            answerModal.exampleSentenceEn.trim().toLowerCase()
                      );

                    return (
                      <div
                        className={`bg-[#131720] border p-2.5 space-y-1 transition-colors ${
                          isSpeakingThisSentence
                            ? "border-[#FACC15] shadow-[0_0_15px_rgba(250,204,21,0.25)]"
                            : "border-[#262D3D]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="text-xs font-bold text-white leading-snug">
                            <BookOpen className="w-3.5 h-3.5 text-[#FACC15] inline mr-1 -mt-0.5" />
                            {renderHighlightedSentence(
                              answerModal.exampleSentenceEn,
                              answerModal.word
                            )}
                          </div>
                          <button
                            onClick={() =>
                              soundEngine.speakEnglish(
                                answerModal.exampleSentenceEn!,
                                defaultSpeechRate
                              )
                            }
                            className={`text-[10px] font-black border px-2 py-0.5 shrink-0 flex items-center gap-1 active:scale-95 transition ${
                              isSpeakingThisSentence
                                ? "bg-[#FACC15] text-[#0B0D12] border-white shadow-[0_0_10px_rgba(250,204,21,0.6)] animate-pulse"
                                : "text-[#FACC15] hover:bg-[#FACC15] hover:text-[#0B0D12] border-[#FACC15]"
                            }`}
                            title="例文の音声を再生"
                          >
                            <Volume2
                              className={`w-3 h-3 ${isSpeakingThisSentence ? "animate-bounce" : ""}`}
                            />
                            {isSpeakingThisSentence ? "再生中" : "例文"}
                          </button>
                        </div>
                        {answerModal.exampleSentenceJa && (
                          <div className="text-[11px] text-[#94A3B8]">
                            {answerModal.exampleSentenceJa}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* 3. もう1タップで次の問題へ進むボタン */}
                <button
                  onClick={() => {
                    if (isLastQuestion) {
                      soundEngine.playTap();
                    } else {
                      soundEngine.playTransition();
                    }
                    const snap = answerModal.nextSnapshot;
                    advanceToNext(
                      snap.exp,
                      snap.maxCombo,
                      snap.revengeCount,
                      snap.gains,
                      snap.deck,
                      snap.wordLogs,
                      snap.masteryDeltas,
                      snap.correctCount
                    );
                  }}
                  className={`w-full py-3.5 font-black text-base border-2 -skew-x-6 active:scale-95 transition flex items-center justify-center gap-2 ${
                    answerModal.isCorrect
                      ? "bg-[#FACC15] hover:brightness-105 text-[#0B0D12] border-white shadow-[4px_4px_0_#022C22]"
                      : "bg-white hover:bg-[#FACC15] text-[#0B0D12] border-[#FACC15] shadow-[4px_4px_0_#450A0A]"
                  }`}
                >
                  <span>
                    {isLastQuestion
                      ? "バトル完了！リザルト画面へ進む ▶"
                      : answerModal.isCorrect
                      ? "⭕ 次の問題へ進む（1 MORE!） ▶"
                      : "🔥 覚えた！次の問題へ進む（後で倍返し！） ▶"}
                  </span>
                  <span className="text-[10px] opacity-75 font-mono px-1.5 py-0.5 border border-current rounded hidden sm:inline">
                    [Space / Enter]
                  </span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="text-center text-[11px] text-[#94A3B8] pt-2">
        💡 ミスしても減点なし！最後まで走り切ると獲得LXPをストック！拠点で好きな時に注入強化！
      </div>
    </div>
  );
};
