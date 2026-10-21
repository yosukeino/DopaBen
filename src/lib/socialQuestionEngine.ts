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

// 小単元（セクション）ごとの正解用語プール (最優先)
const ANSWER_POOL_BY_SECTION: Map<string, string[]> = new Map();
ALL_SOCIAL_QUESTIONS.forEach((q) => {
  const key = `${q.subject}::${q.chapter}::${q.section}`;
  const list = ANSWER_POOL_BY_SECTION.get(key) || [];
  list.push(q.answer.trim());
  ANSWER_POOL_BY_SECTION.set(key, list);
});
ANSWER_POOL_BY_SECTION.forEach((list, key) => {
  ANSWER_POOL_BY_SECTION.set(key, Array.from(new Set(list)));
});

// 大章ごとの正解用語プール
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

/**
 * 用語のセマンティック（概念・品詞）属性を判定するルール
 */
export type SocialSemanticType =
  | "GEO_REGION"            // 都道府県・地域・国名・大陸
  | "LANDFORM_NATURE"       // 地形・河川・山・海・気候
  | "PERSON"                // 歴史人物
  | "LAW_TREATY"            // 法律・令・条約・憲法・制度
  | "WAR_EVENT"             // 事件・合戦・戦争・乱・変・改革
  | "ERA_CULTURE"           // 時代・幕府・文化
  | "POST_STATUS"           // 役職・身分・階級
  | "ORGANIZATION"          // 組織・議会・省庁・裁判所
  | "AGRICULTURE_INDUSTRY"  // 農業・作物・鉱工業・エネルギー
  | "OTHER";

export function getAnswerSemanticType(
  answer: string,
  questionText: string = ""
): SocialSemanticType {
  const a = answer.trim();

  // 1. 都道府県・地域・国名・大陸
  if (
    /(地方|都道府県|県|府|都|道|諸島|列島|海峡|半島)$/.test(a) ||
    /(大陸|州)$/.test(a) ||
    /^(北海道|青森|岩手|宮城|秋田|山形|福島|茨城|栃木|群馬|埼玉|千葉|東京|神奈川|新潟|富山|石川|福井|山梨|長野|岐阜|静岡|愛知|三重|滋賀|京都|大阪|兵庫|奈良|和歌山|鳥取|島根|岡山|広島|山口|徳島|香川|愛媛|高知|福岡|佐賀|長崎|熊本|大分|宮崎|鹿児島|沖縄)$/.test(
      a
    ) ||
    /^(日本|アメリカ|イギリス|フランス|ドイツ|ロシア|中国|韓国|北朝鮮|インド|イタリア|ブラジル|オーストラリア|エジプト|カナダ|スペイン|サウジアラビア|南アフリカ)/.test(
      a
    )
  ) {
    return "GEO_REGION";
  }

  // 2. 地形・自然・気候
  if (
    /(川|山|湾|海|島|平野|盆地|台地|山脈|海流|砂漠|湖|湿原|海岸|カルデラ|扇状地|三角州|段丘|気候|風|モンスーン|偏西風|台風|白夜|潮)$/.test(
      a
    )
  ) {
    return "LANDFORM_NATURE";
  }

  // 3. 人物
  if (
    /(天皇|上皇|将軍|親王|信長|秀吉|家康|大統領|首相|氏|法師|卿|公|王|太子|皇子|鎌足|卑弥呼|鑑真|ザビエル|ペリー|ビスマルク|リンカーン|ルーズベルト|ガンディー|毛沢東|レーニン|ヒトラー)$/.test(
      a
    ) ||
    ((questionText.includes("誰") ||
      questionText.includes("人物") ||
      questionText.includes("指導者") ||
      questionText.includes("皇帝") ||
      questionText.includes("国王")) &&
      a.length <= 8)
  ) {
    return "PERSON";
  }

  // 4. 法律・令・条約・憲法
  if (/(令|法|条約|宣言|協定|規約|憲法|制度|原則|法度|令制|詔|格|式|案)$/.test(a)) {
    return "LAW_TREATY";
  }

  // 5. 事件・戦争・乱・変・改革
  if (
    /(乱|変|戦い|戦争|事件|一揆|革命|クーデター|運動|改革|打ちこわし|事変|危機|遠征|の役)$/.test(
      a
    )
  ) {
    return "WAR_EVENT";
  }

  // 6. 時代・幕府・文化
  if (/(時代|幕府|朝|文化|世紀)$/.test(a)) {
    return "ERA_CULTURE";
  }

  // 7. 役職・身分
  if (
    /(将軍|執権|守護|地頭|奉行|老中|管領|大老|大名|武士|公家|農民|町人|貴族|奴隷|平民|議員|大臣|長官|知事|官)$/.test(
      a
    )
  ) {
    return "POST_STATUS";
  }

  // 8. 組織・機関・機関名
  if (
    /(院|省|府|庁|裁判所|議会|連盟|連合|組合|党|組織|機構|委員会|銀行|会社|所|隊)$/.test(
      a
    )
  ) {
    return "ORGANIZATION";
  }

  // 9. 産業・農業・作物・技術
  if (
    /(栽培|農業|林業|水産業|漁業|工業|産業|米|麦|茶|カカオ|綿花|石油|石炭|鉄鉱石|自動車|電力|エネルギー)$/.test(
      a
    )
  ) {
    return "AGRICULTURE_INDUSTRY";
  }

  return "OTHER";
}

// 科目×セマンティック属性ごとの正解用語プール
const ANSWER_POOL_BY_TYPE: Map<string, string[]> = new Map();
ALL_SOCIAL_QUESTIONS.forEach((q) => {
  const a = q.answer.trim();
  const type = getAnswerSemanticType(a, q.question);
  if (type !== "OTHER") {
    const key = `${q.subject}::${type}`;
    const list = ANSWER_POOL_BY_TYPE.get(key) || [];
    list.push(a);
    ANSWER_POOL_BY_TYPE.set(key, list);
  }
});
ANSWER_POOL_BY_TYPE.forEach((list, key) => {
  ANSWER_POOL_BY_TYPE.set(key, Array.from(new Set(list)));
});

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 賢い4択選択肢生成エンジン:
 * 1. 同一小単元(section) かつ 同一概念カテゴリ（最優先）
 * 2. 同一小単元(section)
 * 3. 同一教科 かつ 同一概念カテゴリ
 * 4. 同一大章(chapter)
 * 5. 同一教科(subject)
 */
export function buildChoicesForQuestion(
  question: SocialQuestion,
  totalChoices: number = 4
): SocialChoice[] {
  const correctAnswer = question.answer.trim();
  const sectionKey = `${question.subject}::${question.chapter}::${question.section}`;
  const chapterKey = `${question.subject}::${question.chapter}`;
  const semanticType = getAnswerSemanticType(correctAnswer, question.question);
  const typeKey = `${question.subject}::${semanticType}`;

  const selectedDistractors: string[] = [];

  const addFromList = (list: string[]) => {
    const shuffled = shuffle(list.filter((ans) => ans !== correctAnswer && ans.length > 0));
    for (const item of shuffled) {
      if (selectedDistractors.length >= totalChoices - 1) break;
      if (!selectedDistractors.includes(item)) {
        selectedDistractors.push(item);
      }
    }
  };

  // Tier 1: 同一小単元 かつ 同一カテゴリ (最優先)
  const sectionPool = ANSWER_POOL_BY_SECTION.get(sectionKey) || [];
  if (semanticType !== "OTHER") {
    const sectionSameType = sectionPool.filter(
      (a) => getAnswerSemanticType(a, question.question) === semanticType
    );
    addFromList(sectionSameType);
  }

  // Tier 2: 同一小単元内の全候補
  if (selectedDistractors.length < totalChoices - 1) {
    addFromList(sectionPool);
  }

  // Tier 3: 同一教科の同一カテゴリ (例: 全地理から他の「地方・地域名」、全歴史から他の「人物」など)
  if (selectedDistractors.length < totalChoices - 1 && semanticType !== "OTHER") {
    const typePool = ANSWER_POOL_BY_TYPE.get(typeKey) || [];
    addFromList(typePool);
  }

  // Tier 4: 同一大章内
  if (selectedDistractors.length < totalChoices - 1) {
    const chapterPool = ANSWER_POOL_BY_CHAPTER.get(chapterKey) || [];
    addFromList(chapterPool);
  }

  // Tier 5: 同一教科全体（最終フォールバック）
  if (selectedDistractors.length < totalChoices - 1) {
    const subjectPool = ANSWER_POOL_BY_SUBJECT[question.subject] || [];
    addFromList(subjectPool);
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
