import {
  ALL_SOCIAL_QUESTIONS,
  SocialQuestion,
  SocialSubject,
} from "./socialData";

export interface SocialChoice {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface GeneratedSocialQuestion {
  question: SocialQuestion;
  choices: SocialChoice[];
}

export type BattingOutcome =
  | "HOMERUN"   // 特大ホームラン（超速答）
  | "DOUBLE"    // 二塁打（高速答）
  | "SINGLE"    // ヒット（通常正解）
  | "STRIKE"    // 空振りストライク / アウト
  | "OUT";      // 三振・アウト

export interface AtBatResult {
  outcome: BattingOutcome;
  text: string;
  subText: string;
  scoreGained: number; // この打席で入った得点
  lxpGained: number;
  basesAdvanced: number;
}

// 科目ごとの全正解用語プール（キャッシュ）
const ANSWER_POOL_BY_SUBJECT: Record<SocialSubject, string[]> = {
  地理: Array.from(
    new Set(
      ALL_SOCIAL_QUESTIONS.filter((q) => q.subject === "地理").map((q) => q.answer.trim())
    )
  ),
  歴史: Array.from(
    new Set(
      ALL_SOCIAL_QUESTIONS.filter((q) => q.subject === "歴史").map((q) => q.answer.trim())
    )
  ),
  公民: Array.from(
    new Set(
      ALL_SOCIAL_QUESTIONS.filter((q) => q.subject === "公民").map((q) => q.answer.trim())
    )
  ),
};

// 章ごとの正解用語プール
const ANSWER_POOL_BY_CHAPTER: Map<string, string[]> = new Map();
ALL_SOCIAL_QUESTIONS.forEach((q) => {
  const key = `${q.subject}::${q.chapter}`;
  const list = ANSWER_POOL_BY_CHAPTER.get(key) || [];
  list.push(q.answer.trim());
  ANSWER_POOL_BY_CHAPTER.set(key, list);
});
// ユニーク化
ANSWER_POOL_BY_CHAPTER.forEach((list, key) => {
  ANSWER_POOL_BY_CHAPTER.set(key, Array.from(new Set(list)));
});

/**
 * 配列をランダムにシャッフル (Fisher-Yates)
 */
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 指定問題に対する高品質な4択選択肢を生成
 */
export function buildChoicesForQuestion(
  question: SocialQuestion,
  totalChoices: number = 4
): SocialChoice[] {
  const correctAnswer = question.answer.trim();
  const chapterKey = `${question.subject}::${question.chapter}`;

  // 1. 同一章の用語から候補を収集
  const chapterPool = (ANSWER_POOL_BY_CHAPTER.get(chapterKey) || []).filter(
    (ans) => ans !== correctAnswer && ans.length > 0
  );

  // 2. 同一科目の全用語から候補を収集
  const subjectPool = (ANSWER_POOL_BY_SUBJECT[question.subject] || []).filter(
    (ans) => ans !== correctAnswer && ans.length > 0
  );

  const shuffledChapterPool = shuffle(chapterPool);
  const selectedDistractors: string[] = [];

  // まず同章から優先的に最大3つ
  for (const item of shuffledChapterPool) {
    if (selectedDistractors.length >= totalChoices - 1) break;
    if (!selectedDistractors.includes(item)) {
      selectedDistractors.push(item);
    }
  }

  // 足りない場合は科目全体から補充
  if (selectedDistractors.length < totalChoices - 1) {
    const shuffledSubject = shuffle(subjectPool);
    for (const item of shuffledSubject) {
      if (selectedDistractors.length >= totalChoices - 1) break;
      if (!selectedDistractors.includes(item)) {
        selectedDistractors.push(item);
      }
    }
  }

  // 選択肢オブジェクトを構築
  const choices: SocialChoice[] = [
    {
      id: "correct",
      text: correctAnswer,
      isCorrect: true,
    },
    ...selectedDistractors.map((text, idx) => ({
      id: `distractor_${idx}`,
      text,
      isCorrect: false,
    })),
  ];

  return shuffle(choices);
}

export interface QuizDeckOptions {
  subject?: SocialSubject | "ALL";
  chapter?: string | "ALL";
  stage?: 1 | 2 | "ALL";
  limit?: number;
  reviewIds?: number[];
}

/**
 * クイズ出題デッキを生成
 */
export function generateSocialQuizDeck(
  options: QuizDeckOptions = {}
): GeneratedSocialQuestion[] {
  const {
    subject = "ALL",
    chapter = "ALL",
    stage = "ALL",
    limit = 10,
    reviewIds,
  } = options;

  let pool = ALL_SOCIAL_QUESTIONS;

  // 特定の復習IDリストが与えられている場合
  if (reviewIds && reviewIds.length > 0) {
    const reviewSet = new Set(reviewIds);
    pool = pool.filter((q) => reviewSet.has(q.id));
  } else {
    // フィルター適用
    if (subject !== "ALL") {
      pool = pool.filter((q) => q.subject === subject);
    }
    if (chapter !== "ALL") {
      pool = pool.filter((q) => q.chapter === chapter);
    }
    if (stage !== "ALL") {
      pool = pool.filter((q) => q.stage === stage);
    }
  }

  const shuffled = shuffle(pool);
  const selected = limit > 0 ? shuffled.slice(0, limit) : shuffled;

  return selected.map((question) => ({
    question,
    choices: buildChoicesForQuestion(question),
  }));
}

/**
 * 打撃結果の判定と獲得スコア・LXPの計算
 */
export function evaluateAtBat(
  isCorrect: boolean,
  responseTimeMs: number,
  currentCombo: number,
  currentBases: [boolean, boolean, boolean] // [1塁, 2塁, 3塁]
): {
  outcome: BattingOutcome;
  title: string;
  comment: string;
  lxpGained: number;
  runsScored: number;
  newBases: [boolean, boolean, boolean];
} {
  if (!isCorrect) {
    return {
      outcome: "OUT",
      title: "空振り三振！",
      comment: "ボールを見極められずアウト！ドンマイ、次の打席で打ち返そう！",
      lxpGained: 20, // ミスしても学習参加経験値は付与
      runsScored: 0,
      newBases: currentBases,
    };
  }

  // 正解時のスピード判定
  // 超速答 (1.8秒以内): ホームラン
  // 高速答 (3.5秒以内): 二塁打
  // 通常 (それ以上): 単打
  let outcome: BattingOutcome = "SINGLE";
  let title = "クリーンヒット！";
  let comment = "センター前へ運ぶ見事なライナーヒット！";
  let basesToAdvance = 1;
  let baseLxp = 120;

  if (responseTimeMs < 1800) {
    outcome = "HOMERUN";
    title = "特大ホームラン！！⚾💥";
    comment = "バックスクリーンへ一直線！打った瞬間それと分かる会心の一撃！";
    basesToAdvance = 4;
    baseLxp = 350;
  } else if (responseTimeMs < 3500) {
    outcome = "DOUBLE";
    title = "タイムリーツーベース！⚡";
    comment = "右中間を真っ二つに破る鋭い長打！";
    basesToAdvance = 2;
    baseLxp = 220;
  }

  // コンボボーナス (最大2倍)
  const comboMultiplier = Math.min(2.0, 1.0 + currentCombo * 0.1);
  const lxpGained = Math.round(baseLxp * comboMultiplier);

  // ランナー進塁・得点計算
  let runsScored = 0;
  const [b1, b2, b3] = currentBases;
  let nextBases: [boolean, boolean, boolean] = [false, false, false];

  if (basesToAdvance === 4) {
    // ホームラン：走者全員生還＋打者生還
    runsScored = 1 + (b1 ? 1 : 0) + (b2 ? 1 : 0) + (b3 ? 1 : 0);
    nextBases = [false, false, false];
  } else if (basesToAdvance === 2) {
    // 二塁打：2塁・3塁は生還、1塁走者は3塁へ、打者は2塁へ
    if (b3) runsScored++;
    if (b2) runsScored++;
    const runnerToThird = b1;
    nextBases = [false, true, runnerToThird];
  } else {
    // 単打：3塁走者は生還、2塁走者は3塁へ、1塁走者は2塁へ、打者は1塁へ
    if (b3) runsScored++;
    nextBases = [true, b1, b2];
  }

  return {
    outcome,
    title,
    comment,
    lxpGained,
    runsScored,
    newBases: nextBases,
  };
}
