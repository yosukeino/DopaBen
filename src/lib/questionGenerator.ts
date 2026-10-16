import {
  GeneratedQuestion,
  GradeLevel,
  QuestionFormat,
  SentenceItem,
  WordItem,
} from "./types";
import { getActiveVocabPool } from "./vocabRepository";

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * 1つのWordItemから、指定されたDuolingo式フォーマットの問題を自動生成する
 */
export function buildWordQuestion(
  word: WordItem,
  format: Exclude<QuestionFormat, "sentence_order">,
  options?: {
    isRevengeBounty?: boolean;
    bountyMultiplier?: number;
  }
): GeneratedQuestion {
  const uid = `${word.id}_${format}_${Math.random().toString(36).slice(2, 7)}`;
  const isHardcore = word.grade === "激ムズ" || word.grade === "英検1級";

  if (format === "en_to_ja") {
    const choices = shuffleArray([
      {
        id: `${uid}_correct`,
        label: word.japanese,
        subLabel: word.partOfSpeech,
        isCorrect: true,
      },
      ...word.distractorsJa.slice(0, 3).map((d, idx) => ({
        id: `${uid}_d_${idx}`,
        label: d,
        subLabel: word.partOfSpeech,
        isCorrect: false,
      })),
    ]);

    return {
      uid,
      format: "en_to_ja",
      phase: "STAGE1_COMBO",
      word,
      promptTitle: options?.isRevengeBounty
        ? "🔥 REVENGE TARGET // 倍返しチャンス！"
        : "SLASH THE MEANING // 意味を撃ち抜け！",
      promptMain: word.english,
      promptSub: `${word.phonetic}  [${word.grade}]`,
      audioText: word.english,
      choices,
      isRevengeBounty: options?.isRevengeBounty,
      bountyMultiplier: options?.bountyMultiplier,
      isHardcoreQuestion: isHardcore,
    };
  }

  if (format === "ja_to_en") {
    const choices = shuffleArray([
      {
        id: `${uid}_correct`,
        label: word.english,
        subLabel: word.phonetic,
        speakOnTap: word.english,
        isCorrect: true,
      },
      ...word.distractorsEn.slice(0, 3).map((d, idx) => ({
        id: `${uid}_d_${idx}`,
        label: d,
        speakOnTap: d,
        isCorrect: false,
      })),
    ]);

    return {
      uid,
      format: "ja_to_en",
      phase: "STAGE1_COMBO",
      word,
      promptTitle: options?.isRevengeBounty
        ? "🔥 REVENGE TARGET // 英語に逆転変換！"
        : "REVERSE STRIKE // 英語を選択せよ！",
      promptMain: word.japanese,
      promptSub: `${word.partOfSpeech}  [${word.grade}]`,
      audioText: word.english,
      choices,
      isRevengeBounty: options?.isRevengeBounty,
      bountyMultiplier: options?.bountyMultiplier,
      isHardcoreQuestion: isHardcore,
    };
  }

  // format === "listening"
  const choices = shuffleArray([
    {
      id: `${uid}_correct`,
      label: word.english,
      subLabel: word.japanese,
      speakOnTap: word.english,
      isCorrect: true,
    },
    ...word.distractorsEn.slice(0, 3).map((d, idx) => ({
      id: `${uid}_d_${idx}`,
      label: d,
      subLabel: word.distractorsJa[idx] || "",
      speakOnTap: d,
      isCorrect: false,
    })),
  ]);

  return {
    uid,
    format: "listening",
    phase: "STAGE1_COMBO",
    word,
    promptTitle: options?.isRevengeBounty
      ? "🔥 REVENGE SONAR // 音を聴き分けろ！"
      : "SONAR HACK // 発音だけで撃ち抜け！",
    promptMain: "🔊 LISTEN & LOCK ON",
    promptSub: "音声を聞いて正しい英単語＆意味を選べ！",
    audioText: word.english,
    hideTextForListening: true,
    choices,
    isRevengeBounty: options?.isRevengeBounty,
    bountyMultiplier: options?.bountyMultiplier,
    isHardcoreQuestion: isHardcore,
  };
}

/**
 * 例文データから「総攻撃（ALL-OUT ATTACK）ワードバンク並び替え問題」を生成する
 */
export function buildSentenceQuestion(sentence: SentenceItem): GeneratedQuestion {
  const uid = `${sentence.id}_allout_${Math.random().toString(36).slice(2, 7)}`;
  const allTokens = [...sentence.englishTokens, ...sentence.distractorTokens];
  const shuffledTokens = shuffleArray(
    allTokens.map((text, index) => ({
      id: `${uid}_tok_${index}_${text}`,
      text,
    }))
  );

  return {
    uid,
    format: "sentence_order",
    phase: "STAGE2_ALLOUT",
    sentence,
    promptTitle: "⚡ HOLD UP!! // 総攻撃（チャンク合体フィニッシュ）",
    promptMain: sentence.japanese,
    promptSub: sentence.grammarPoint,
    audioText: sentence.englishTokens.join(" "),
    wordBank: {
      correctTokens: sentence.englishTokens,
      shuffledTokens,
    },
    isHardcoreQuestion: sentence.grade === "激ムズ" || sentence.grade === "英検1級",
  };
}

/**
 * 1プレイ（約2〜3分）の二段ロケット・バトルデッキを自動生成する
 * - 1段目：ランダムな形式（英→日 / 日→英 / リスニング）で5問連続コンボ
 * - 2段目：登場した単語を含む「総攻撃（例文ワードバンク並び替え）」でフィニッシュ！
 */
export function generateBattleDeck(
  grade: GradeLevel,
  includeHardcoreHack: boolean,
  eiken1Track: number = 0
): GeneratedQuestion[] {
  const pool = getActiveVocabPool();
  const formats: Exclude<QuestionFormat, "sentence_order">[] = shuffleArray([
    "en_to_ja",
    "ja_to_en",
    "listening",
    "en_to_ja",
    "ja_to_en",
  ]);

  // === 専用ステージ：『英検1級 Unit 01（0001〜0096）』（長文並び替えなし・4択6問に集中！） ===
  if (grade === "英検1級") {
    const trackWords =
      eiken1Track > 0
        ? pool.eiken1Words.filter((w) => w.track === eiken1Track)
        : pool.eiken1Words;

    const selectedEikenWords = shuffleArray(
      trackWords.length >= 6 ? trackWords : pool.eiken1Words
    ).slice(0, 6);

    const eikenFormats: Exclude<QuestionFormat, "sentence_order">[] =
      shuffleArray([
        "en_to_ja",
        "ja_to_en",
        "listening",
        "en_to_ja",
        "ja_to_en",
        "listening",
      ]);

    const eikenQuestions = selectedEikenWords.map((word, index) =>
      buildWordQuestion(word, eikenFormats[index % eikenFormats.length])
    );

    return eikenQuestions;
  }

  // === 通常ステージ（中1 / 中2 / 中3 / 全学年MIX） ===
  let poolWords =
    grade === "ALL"
      ? pool.standardWords.filter((w) => w.grade !== "激ムズ")
      : pool.standardWords.filter((w) => w.grade === grade);

  if (poolWords.length < 4) {
    poolWords = pool.standardWords.filter((w) => w.grade !== "激ムズ");
  }

  let selectedWords = shuffleArray(poolWords).slice(0, 4);

  // 高レベルスキル「激ムズ問題に挑戦できる権」がONの場合、激ムズ単語を1〜2問乱入させる！
  if (includeHardcoreHack) {
    const hardcoreWords = shuffleArray(
      pool.standardWords.filter((w) => w.grade === "激ムズ")
    ).slice(0, 2);
    selectedWords = [...selectedWords.slice(0, 3), ...hardcoreWords];
  } else {
    selectedWords = shuffleArray(poolWords).slice(0, 5);
  }

  // Stage 1: 5問の高速「WEAK! → 1 MORE!」パート
  const stage1Questions = selectedWords.map((word, index) => {
    const format = formats[index % formats.length];
    return buildWordQuestion(word, format);
  });

  // Stage 2: 総攻撃（例文ワードバンク並び替え）パート
  let candidateSentences =
    grade === "ALL"
      ? pool.standardSentences.filter((s) => s.grade !== "激ムズ")
      : pool.standardSentences.filter((s) => s.grade === grade);

  if (includeHardcoreHack) {
    const hcSentences = pool.standardSentences.filter(
      (s) => s.grade === "激ムズ"
    );
    if (hcSentences.length > 0) {
      candidateSentences = [...hcSentences, ...candidateSentences];
    }
  }

  if (candidateSentences.length === 0) {
    candidateSentences = pool.standardSentences;
  }

  const chosenSentence = includeHardcoreHack
    ? candidateSentences[0]
    : shuffleArray(candidateSentences)[0];

  const stage2Question = buildSentenceQuestion(chosenSentence);

  return [...stage1Questions, stage2Question];
}
