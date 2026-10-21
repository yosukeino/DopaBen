import {
  ALL_SOCIAL_QUESTIONS,
  SocialQuestion,
  SocialSubject,
} from "./socialData";
import { BaseballStats } from "./baseballGrowthEngine";

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
  | "HOMERUN"   // 特大ホームラン
  | "DOUBLE"    // 二塁打
  | "SINGLE"    // ヒット
  | "OUT";      // 三振・アウト

export interface AtBatEvaluationInput {
  isCorrect: boolean;
  responseTimeMs: number;
  currentCombo: number;
  currentBases: [boolean, boolean, boolean];
  stats: BaseballStats;
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
  isExtraBaseHitBySpeed?: boolean; // 走力による好走塁
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
 * 選手の5大ステータス（パワー・ミート・走力・集中力・勝負強さ）を完全連動させた打撃シミュレーション
 */
export function evaluateAtBatAdvanced(input: AtBatEvaluationInput): AtBatResult {
  const { isCorrect, responseTimeMs, currentCombo, currentBases, stats, isFever } = input;

  if (!isCorrect) {
    return {
      outcome: "OUT",
      title: "空振り三振！",
      comment: "渾身のボールにバットが空を切る…！次で取り返せ！",
      distanceMeters: 0,
      exitVelocityKmh: 0,
      lxpGained: 25,
      runsScored: 0,
      newBases: currentBases,
    };
  }

  // 1. パワーとミートによる判定許容時間の拡張
  // パワーが高いほど、遅い回答でもホームラン・長打になる！
  const powerHomerunThreshold = 1800 + (stats.power * 15); // パワー99なら最大3285msまでHR！
  const powerDoubleThreshold = 3500 + (stats.power * 20);

  let outcome: BattingOutcome = "SINGLE";
  let title = "クリーンヒット！";
  let comment = "センター前へ鋭く弾き返す見事なライナー！";
  let basesToAdvance = 1;
  let baseLxp = 120;

  // 飛距離(m) と 打球初速(km/h) の算出
  let distanceMeters = Math.round(75 + (stats.power * 0.35) + Math.random() * 10);
  let exitVelocityKmh = Math.round(110 + (stats.power * 0.4) + Math.random() * 8);

  if (responseTimeMs <= powerHomerunThreshold) {
    outcome = "HOMERUN";
    distanceMeters = Math.round(118 + (stats.power * 0.55) + Math.random() * 15);
    exitVelocityKmh = Math.round(145 + (stats.power * 0.45) + Math.random() * 10);
    title = distanceMeters >= 145 ? "場外特大ホームラン！！⚾💥" : "特大ホームラン！！⚾🔥";
    comment = `打球速度${exitVelocityKmh}km/h！スタンド中段へ突き刺さる会心の一撃！`;
    basesToAdvance = 4;
    baseLxp = 380;
  } else if (responseTimeMs <= powerDoubleThreshold) {
    outcome = "DOUBLE";
    distanceMeters = Math.round(92 + (stats.power * 0.4) + Math.random() * 12);
    exitVelocityKmh = Math.round(125 + (stats.power * 0.35) + Math.random() * 8);
    title = "右中間を破る快速ツーベース！⚡";
    comment = "外野の間を真っ二つに破る強烈な長打！";
    basesToAdvance = 2;
    baseLxp = 240;
  }

  // 2. 走力 (speed) による「俊足スチール進塁」
  let isExtraBaseHitBySpeed = false;
  if (outcome === "SINGLE" && stats.speed >= 60 && Math.random() < (stats.speed / 130)) {
    basesToAdvance = 2;
    isExtraBaseHitBySpeed = true;
    title = "俊足を生かした快速スライディング進塁！💨";
    comment = "快足を飛ばして一気に2塁を陥れる好走塁！";
  }

  // 3. コンボ ＆ 集中力 (focus) ＆ FEVER 倍率
  const focusMultiplier = 1.0 + (stats.focus / 200); // 集中力99で+50%
  const comboMultiplier = Math.min(2.5, 1.0 + currentCombo * 0.12);
  const feverMultiplier = isFever ? 2.0 : 1.0;

  // 4. 勝負強さ (clutch) ボーナス（得点圏または満塁）
  const isScoringPosition = currentBases[1] || currentBases[2];
  const clutchMultiplier = isScoringPosition ? (1.0 + (stats.clutch / 100)) : 1.0;

  const totalLxp = Math.round(baseLxp * comboMultiplier * focusMultiplier * feverMultiplier * clutchMultiplier);

  // 5. ランナー進塁＆得点計算
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
      if (stats.speed >= 75) {
        runsScored++; // 走力75以上なら1塁走者も本塁生還！
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

// 下位互換用の簡易ラッパー
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
    stats: { meet: 15, power: 15, speed: 15, focus: 15, clutch: 15 },
    isFever: false,
  });
}
