import {
  ALL_SOCIAL_QUESTIONS,
  SocialQuestion,
  SocialSubject,
} from "./socialData";
import { SocialTriStats } from "./baseballGrowthEngine";

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
  | "HOMERUN"   // 特大ホームラン (超ファインプレー)
  | "DOUBLE"    // 二塁打 (ナイスキャッチ)
  | "SINGLE"    // ヒット (好捕)
  | "OUT";      // 三振・アウト (トンネル/後逸)

export interface AtBatEvaluationInput {
  isCorrect: boolean;
  responseTimeMs: number;
  currentCombo: number;
  currentBases: [boolean, boolean, boolean];
  subject: SocialSubject;
  stats: SocialTriStats;
  isFever: boolean;
}

export interface AtBatResult {
  outcome: BattingOutcome;
  title: string;
  comment: string;
  distanceMeters: number;    // 飛距離 (m)
  exitVelocityKmh: number;   // 打球初速 (km/h)
  lxpGained: number;
  runsScored: number;
  newBases: [boolean, boolean, boolean];
  isExtraBaseHitBySpeed?: boolean;
}

// 科目ごとの全正解用語プール
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
ANSWER_POOL_BY_CHAPTER.forEach((list, key) => {
  ANSWER_POOL_BY_CHAPTER.set(key, Array.from(new Set(list)));
});

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function buildChoicesForQuestion(
  question: SocialQuestion,
  totalChoices: number = 4
): SocialChoice[] {
  const correctAnswer = question.answer.trim();
  const chapterKey = `${question.subject}::${question.chapter}`;

  const chapterPool = (ANSWER_POOL_BY_CHAPTER.get(chapterKey) || []).filter(
    (ans) => ans !== correctAnswer && ans.length > 0
  );
  const subjectPool = (ANSWER_POOL_BY_SUBJECT[question.subject] || []).filter(
    (ans) => ans !== correctAnswer && ans.length > 0
  );

  const shuffledChapterPool = shuffle(chapterPool);
  const selectedDistractors: string[] = [];

  for (const item of shuffledChapterPool) {
    if (selectedDistractors.length >= totalChoices - 1) break;
    if (!selectedDistractors.includes(item)) {
      selectedDistractors.push(item);
    }
  }

  if (selectedDistractors.length < totalChoices - 1) {
    const shuffledSubject = shuffle(subjectPool);
    for (const item of shuffledSubject) {
      if (selectedDistractors.length >= totalChoices - 1) break;
      if (!selectedDistractors.includes(item)) {
        selectedDistractors.push(item);
      }
    }
  }

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

  if (reviewIds && reviewIds.length > 0) {
    const reviewSet = new Set(reviewIds);
    pool = pool.filter((q) => reviewSet.has(q.id));
  } else {
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
 * 選手の3大ステータス（地理・歴史・公民力）を完全連動させたノック打撃シミュレーション
 */
export function evaluateAtBatAdvanced(input: AtBatEvaluationInput): AtBatResult {
  const { isCorrect, responseTimeMs, currentCombo, currentBases, subject, stats, isFever } = input;

  if (!isCorrect) {
    return {
      outcome: "OUT",
      title: "空振り三振！",
      comment: "渾身のノックにバットが空を切る…！次で取り返せ！",
      distanceMeters: 0,
      exitVelocityKmh: 0,
      lxpGained: 25,
      runsScored: 0,
      newBases: currentBases,
    };
  }

  // 科目に対応するステータス値 (10〜99)
  const subjectStat =
    subject === "地理" ? stats.geo : subject === "歴史" ? stats.history : stats.civics;

  // 該当科目のステータスが高いほど、判定時間が拡大し、長打・ホームランが出やすい！
  const homerunThreshold = 1800 + (subjectStat * 16);
  const doubleThreshold = 3500 + (subjectStat * 20);

  let outcome: BattingOutcome = "SINGLE";
  let title = "クリーンヒット！";
  let comment = "センター前へ鋭く弾き返す見事なライナー！";
  let basesToAdvance = 1;
  let baseLxp = 120;

  // 飛距離(m) と 打球初速(km/h) の算出
  let distanceMeters = Math.round(75 + (subjectStat * 0.35) + Math.random() * 10);
  let exitVelocityKmh = Math.round(110 + (subjectStat * 0.4) + Math.random() * 8);

  if (responseTimeMs <= homerunThreshold) {
    outcome = "HOMERUN";
    distanceMeters = Math.round(118 + (subjectStat * 0.55) + Math.random() * 15);
    exitVelocityKmh = Math.round(145 + (subjectStat * 0.45) + Math.random() * 10);
    title = distanceMeters >= 145 ? "場外特大ホームラン！！⚾💥" : "特大ホームラン！！⚾🔥";
    comment = `打球速度${exitVelocityKmh}km/h！スタンド中段へ突き刺さる会心の一撃！`;
    basesToAdvance = 4;
    baseLxp = 380;
  } else if (responseTimeMs <= doubleThreshold) {
    outcome = "DOUBLE";
    distanceMeters = Math.round(92 + (subjectStat * 0.4) + Math.random() * 12);
    exitVelocityKmh = Math.round(125 + (subjectStat * 0.35) + Math.random() * 8);
    title = "右中間を破る快速ツーベース！⚡";
    comment = "外野の間を真っ二つに破る強烈な長打！";
    basesToAdvance = 2;
    baseLxp = 240;
  }

  // 3大ステータス平均値による好走塁判定
  const avgStat = (stats.geo + stats.history + stats.civics) / 3;
  let isExtraBaseHitBySpeed = false;
  if (outcome === "SINGLE" && avgStat >= 40 && Math.random() < (avgStat / 140)) {
    basesToAdvance = 2;
    isExtraBaseHitBySpeed = true;
    title = "俊足を生かした快速スライディング進塁！💨";
    comment = "快足を飛ばして一気に2塁を陥れる好走塁！";
  }

  // コンボ ＆ ステータス ＆ FEVER 倍率
  const statMultiplier = 1.0 + (subjectStat / 200);
  const comboMultiplier = Math.min(2.5, 1.0 + currentCombo * 0.12);
  const feverMultiplier = isFever ? 2.0 : 1.0;

  const totalLxp = Math.round(baseLxp * comboMultiplier * statMultiplier * feverMultiplier);

  // ランナー進塁＆得点計算
  let runsScored = 0;
  const [b1, b2, b3] = currentBases;
  let nextBases: [boolean, boolean, boolean] = [false, false, false];

  if (basesToAdvance === 4) {
    runsScored = 1 + (b1 ? 1 : 0) + (b2 ? 1 : 0) + (b3 ? 1 : 0);
    nextBases = [false, false, false];
  } else if (basesToAdvance === 2) {
    if (b3) runsScored++;
    if (b2) runsScored++;
    if (b1) {
      if (avgStat >= 55) {
        runsScored++;
      } else {
        nextBases[2] = true;
      }
    }
    nextBases[1] = true;
  } else {
    if (b3) runsScored++;
    nextBases = [true, b1, b2];
  }

  return {
    outcome,
    title,
    comment,
    distanceMeters,
    exitVelocityKmh,
    lxpGained: totalLxp,
    runsScored,
    newBases: nextBases,
    isExtraBaseHitBySpeed,
  };
}

export function evaluateAtBat(
  isCorrect: boolean,
  responseTimeMs: number,
  currentCombo: number,
  currentBases: [boolean, boolean, boolean]
) {
  return evaluateAtBatAdvanced({
    isCorrect,
    responseTimeMs,
    currentCombo,
    currentBases,
    subject: "地理",
    stats: { geo: 10, history: 10, civics: 10 },
    isFever: false,
  });
}
