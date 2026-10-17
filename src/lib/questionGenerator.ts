import {
  GeneratedQuestion,
  GradeLevel,
  QuestionFormat,
  SentenceItem,
  WordItem,
  WordMasteryRecord,
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

const IRREGULAR_FORMS: Record<string, string[]> = {
  override: ["overrode", "overridden", "overriding", "overrides"],
  undergo: ["underwent", "undergone", "undergoing", "undergoes"],
  undertake: ["undertook", "undertaken", "undertaking", "undertakes"],
  uphold: ["upheld", "upholding", "upholds"],
  withstand: ["withstood", "withstanding", "withstands"],
  overcome: ["overcame", "overcoming", "overcomes"],
  forgo: ["forwent", "forgone", "forgoing", "forgoes"],
};

/**
 * 例文中のターゲット単語（活用形 -ed, -ing, -s, -d や不規則変化を含む）を検出して穴埋めマスクまたは分割する
 */
export function splitSentenceByTargetWord(
  sentence: string,
  baseWord: string
): { before: string; matched: string; after: string } | null {
  if (!sentence || !baseWord) return null;
  const cleanBase = baseWord.trim().toLowerCase();
  // 語幹（末尾の e や y を除いた部分、最低3文字）
  const stem =
    cleanBase.endsWith("e") || cleanBase.endsWith("y")
      ? cleanBase.slice(0, -1)
      : cleanBase;

  const escapedFull = cleanBase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedStem = stem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const irregularAlts = (IRREGULAR_FORMS[cleanBase] || []).join("|");
  const irregularPart = irregularAlts ? `|${irregularAlts}` : "";

  // 1. 完全一致・不規則活用・規則活用語尾つきの単語境界マッチ
  const regex = new RegExp(
    `\\b(${escapedFull}[a-z]*|${escapedStem}(?:e|ed|d|s|es|ing|ied|ies|ier|iest|ly)?${irregularPart})\\b`,
    "i"
  );
  const match = sentence.match(regex);
  if (!match || match.index === undefined) {
    return null;
  }

  return {
    before: sentence.slice(0, match.index),
    matched: match[0],
    after: sentence.slice(match.index + match[0].length),
  };
}

/**
 * 1つのWordItemから、指定されたDuolingo×英検式フォーマットの問題を自動生成する
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

  // ④ 文脈穴埋め4択（sentence_fill）：例文がある場合のみ生成、なければ ja_to_en にフォールバック
  if (format === "sentence_fill" && word.exampleSentenceEn) {
    const split = splitSentenceByTargetWord(
      word.exampleSentenceEn,
      word.english
    );
    if (split) {
      const maskedSentence = `${split.before}[  ______  ]${split.after}`;
      const choices = shuffleArray([
        {
          id: `${uid}_correct`,
          label: word.english,
          isCorrect: true,
        },
        ...word.distractorsEn.slice(0, 3).map((d, idx) => ({
          id: `${uid}_d_${idx}`,
          label: d,
          isCorrect: false,
        })),
      ]);

      return {
        uid,
        format: "sentence_fill",
        phase: "STAGE1_COMBO",
        word,
        promptTitle: options?.isRevengeBounty
          ? "🔥 REVENGE CLOZE // 文脈穴埋めで倍返し！"
          : "CONTEXT SNIPE // 空欄に入る英単語を選べ！",
        promptMain: maskedSentence,
        promptSub: `${word.exampleSentenceJa || ""}  (${word.partOfSpeech})`,
        audioText: word.english,
        hideAudioBeforeAnswer: true,
        choices,
        isRevengeBounty: options?.isRevengeBounty,
        bountyMultiplier: options?.bountyMultiplier,
        isHardcoreQuestion: isHardcore,
      };
    }
  }

  // ① 英単語(＋発音) ➔ 日本語4択
  if (format === "en_to_ja") {
    const choices = shuffleArray([
      {
        id: `${uid}_correct`,
        label: word.japanese,
        isCorrect: true,
      },
      ...word.distractorsJa.slice(0, 3).map((d, idx) => ({
        id: `${uid}_d_${idx}`,
        label: d,
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
      promptSub: `${word.phonetic}  |  ${word.partOfSpeech}`,
      audioText: word.english,
      choices,
      isRevengeBounty: options?.isRevengeBounty,
      bountyMultiplier: options?.bountyMultiplier,
      isHardcoreQuestion: isHardcore,
    };
  }

  // ② 日本語 ➔ 英単語4択（全選択肢の見た目を統一してヒント漏れを防止＆回答後に発音）
  if (format === "ja_to_en" || format === "sentence_fill") {
    const choices = shuffleArray([
      {
        id: `${uid}_correct`,
        label: word.english,
        isCorrect: true,
      },
      ...word.distractorsEn.slice(0, 3).map((d, idx) => ({
        id: `${uid}_d_${idx}`,
        label: d,
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
      promptSub: `${word.partOfSpeech}`,
      audioText: word.english,
      hideAudioBeforeAnswer: true,
      choices,
      isRevengeBounty: options?.isRevengeBounty,
      bountyMultiplier: options?.bountyMultiplier,
      isHardcoreQuestion: isHardcore,
    };
  }

  // ③ リスニング：音声のみ ➔ 日本語の意味4択（スペルを見せずに純粋な聴覚理解をテスト！）
  const choices = shuffleArray([
    {
      id: `${uid}_correct`,
      label: word.japanese,
      isCorrect: true,
    },
    ...word.distractorsJa.slice(0, 3).map((d, idx) => ({
      id: `${uid}_d_${idx}`,
      label: d,
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
      : "SONAR HACK // 発音だけで意味を撃ち抜け！",
    promptMain: "🔊 LISTEN & LOCK ON",
    promptSub: `音声を聞いて正しい意味を選べ！  (${word.partOfSpeech})`,
    audioText: word.english,
    hideTextForListening: true,
    choices,
    isRevengeBounty: options?.isRevengeBounty,
    bountyMultiplier: options?.bountyMultiplier,
    isHardcoreQuestion: isHardcore,
  };
}

/**
 * 例文データから「総攻撃（ALL-OUT ATTACK）ワードバンク並び替え問題」を生成する（中学ステージ用）
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
 * 単語リストを「①苦手(missed > cleared) ➔ ②未出題(cleared === 0) ➔ ③習得済み」の優先順でスマート選出する
 */
function prioritizeWordsByMastery<T extends WordItem>(
  words: T[],
  count: number,
  wordMastery?: Record<string, WordMasteryRecord>,
  onlyWeakWords?: boolean
): T[] {
  const mastery = wordMastery || {};

  if (onlyWeakWords) {
    const weakList = words.filter((w) => {
      const m = mastery[w.id];
      return m && m.missed > 0;
    });
    if (weakList.length >= count) {
      return shuffleArray(weakList).slice(0, count);
    }
    const unseenList = words.filter((w) => !mastery[w.id] || mastery[w.id].cleared === 0);
    return [...shuffleArray(weakList), ...shuffleArray(unseenList)].slice(0, count);
  }

  // Tier 1: ミス回数がクリア回数以上の要注意ワード
  const tier1Weak = shuffleArray(
    words.filter((w) => {
      const m = mastery[w.id];
      return m && m.missed > 0 && m.missed >= m.cleared;
    })
  );

  // Tier 2: まだ一度もクリアしていない未出題ワード
  const tier2Unseen = shuffleArray(
    words.filter((w) => {
      const m = mastery[w.id];
      return !m || (m.cleared === 0 && m.missed === 0);
    })
  );

  // Tier 3: すでにクリア済みのワード（クリア回数が少ない順）
  const tier3Cleared = shuffleArray(
    words.filter((w) => {
      const m = mastery[w.id];
      return m && m.cleared > 0 && m.missed < m.cleared;
    })
  ).sort((a, b) => (mastery[a.id]?.cleared || 0) - (mastery[b.id]?.cleared || 0));

  return [...tier1Weak, ...tier2Unseen, ...tier3Cleared].slice(0, count);
}

/**
 * 1プレイのバトルデッキを自動生成する
 * - 全ステージ共通：4形式（①英→日 ②日→英 ③リスニング ④文脈穴埋め）がデフォルトで均等に出現！
 * - テンポの良い4択 6問で出撃（英検1級も中学ステージも統一！）
 * - 未出題＆苦手ワードを自動優先出題
 * - 激ムズモード（HARDCORE CHALLENGE）ON時は、難関・激ムズ問題が乱入し全獲得EXPが2倍に跳ね上がる！
 */
export function generateBattleDeck(
  grade: GradeLevel,
  includeHardcoreHack: boolean,
  eiken1Track: number = 0,
  wordMastery?: Record<string, WordMasteryRecord>,
  onlyWeakWords: boolean = false
): GeneratedQuestion[] {
  const pool = getActiveVocabPool();

  // 4種類の4択問題（①英→日 ②日→英 ③リスニング ④公式例文穴埋め）を全ステージでバランスよくシャッフル配置
  const defaultFormats: Exclude<QuestionFormat, "sentence_order">[] =
    shuffleArray([
      "en_to_ja",
      "ja_to_en",
      "listening",
      "sentence_fill",
      "en_to_ja",
      "sentence_fill",
    ]);

  // === 専用ステージ：『英検1級 Unit 01（0001〜0096）』 ===
  if (grade === "英検1級") {
    const trackWords =
      eiken1Track > 0
        ? pool.eiken1Words.filter((w) => w.track === eiken1Track)
        : pool.eiken1Words;

    const candidatePool =
      trackWords.length >= 6 ? trackWords : pool.eiken1Words;

    const selectedEikenWords = prioritizeWordsByMastery(
      candidatePool,
      6,
      wordMastery,
      onlyWeakWords
    );

    return selectedEikenWords.map((word, index) =>
      buildWordQuestion(word, defaultFormats[index % defaultFormats.length])
    );
  }

  // === 通常ステージ（中1 / 中2 / 中3 / 全学年MIX） ===
  let poolWords =
    grade === "ALL"
      ? pool.standardWords.filter((w) => w.grade !== "激ムズ")
      : pool.standardWords.filter((w) => w.grade === grade);

  if (poolWords.length < 4) {
    poolWords = pool.standardWords.filter((w) => w.grade !== "激ムズ");
  }

  // 通常4〜6問（激ムズON時は4問通常 + 2問激ムズ = 6問、激ムズOFF時は6問通常）
  const normalWordCount = includeHardcoreHack ? 4 : 6;
  let selectedWords = prioritizeWordsByMastery(
    poolWords,
    normalWordCount,
    wordMastery,
    onlyWeakWords
  );

  // 高レベルスキル「激ムズ問題に挑戦できる権」がONの場合、激ムズ単語を2問乱入させる！
  if (includeHardcoreHack) {
    const hardcoreWords = prioritizeWordsByMastery(
      pool.standardWords.filter((w) => w.grade === "激ムズ"),
      2,
      wordMastery,
      onlyWeakWords
    );
    selectedWords = [...selectedWords, ...hardcoreWords];
  }

  // 全問4択（英→日、日→英、リスニング、文脈穴埋め）でテンポよく出題！
  return selectedWords.map((word, index) => {
    const format = defaultFormats[index % defaultFormats.length];
    return buildWordQuestion(word, format);
  });
}
