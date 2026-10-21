export interface SocialTriStats {
  geo: number;     // 地理力 (GEOGRAPHY)
  history: number; // 歴史力 (HISTORY)
  civics: number;  // 公民力 (CIVICS)
}

export interface KnockCareerRecord {
  totalKnocks: number;    // トータルノック本数 (累計ノック受け数)
  totalCatches: number;   // トータル正解数 (累計ナイスキャッチ)
  maxCombo: number;       // 最高連続正解数
  geoCatches: number;     // 地理の正解数
  historyCatches: number; // 歴史の正解数
  civicsCatches: number;  // 公民の正解数
}

export type BatTier = 1 | 2 | 3 | 4 | 5;

export interface BatEquipment {
  tier: BatTier;
  name: string;
  badge: string;
  color: string;
  subColor: string;
  description: string;
  unlockLevel: number;
}

export const BAT_EQUIPMENTS: BatEquipment[] = [
  {
    tier: 1,
    name: "素振り用の木製練習バット",
    badge: "初期装備",
    color: "#D97706",
    subColor: "#92400E",
    description: "入部時に渡される基本の木製バット。素朴な打感が手に残る。",
    unlockLevel: 1,
  },
  {
    tier: 2,
    name: "高反発ジュラルミン金属バット",
    badge: "金属音",
    color: "#CBD5E1",
    subColor: "#64748B",
    description: "金属特有の快音「カキーン！」がスタジアムに響き渡る名器。",
    unlockLevel: 2,
  },
  {
    tier: 3,
    name: "漆黒の超々ジュラルミン・ブラック",
    badge: "長打特化",
    color: "#1E293B",
    subColor: "#EF4444",
    description: "軽量カーボンを複合した漆黒のバット。芯で捉えた打球が鋭く伸びる。",
    unlockLevel: 4,
  },
  {
    tier: 4,
    name: "栄光の黄金Vバット",
    badge: "甲子園覇者",
    color: "#FACC15",
    subColor: "#FFE600",
    description: "甲子園優勝記念に贈られる純金コーティングバット。オーラを放つ。",
    unlockLevel: 6,
  },
  {
    tier: 5,
    name: "雷神のネオンビームバット",
    badge: "神話レジェンド",
    color: "#22D3EE",
    subColor: "#A855F7",
    description: "青白い雷光をまとい、打球が光の矢となってスタンドに消える究極のバット。",
    unlockLevel: 8,
  },
];

export interface PlayerRankInfo {
  level: number;
  title: string;
  badge: string;
  auraTier: 0 | 1 | 2 | 3;
  requiredTotalLxp: number;
}

export const PLAYER_RANKS: PlayerRankInfo[] = [
  { level: 1, title: "ボール拾いルーキー", badge: "新入生", auraTier: 0, requiredTotalLxp: 0 },
  { level: 2, title: "期待の代打の切り札", badge: "代打枠", auraTier: 0, requiredTotalLxp: 500 },
  { level: 3, title: "レギュラー定着スタメン", badge: "スタメン", auraTier: 1, requiredTotalLxp: 1200 },
  { level: 4, title: "韋駄天リードオフマン", badge: "1番打者", auraTier: 1, requiredTotalLxp: 2500 },
  { level: 5, title: "豪打のクリーンナップ砲", badge: "4番打者", auraTier: 2, requiredTotalLxp: 4500 },
  { level: 6, title: "学園野球部 副主将", badge: "副キャプテン", auraTier: 2, requiredTotalLxp: 7500 },
  { level: 7, title: "二刀流・主将エース", badge: "主将", auraTier: 2, requiredTotalLxp: 12000 },
  { level: 8, title: "甲子園を揺るがす怪物", badge: "全国大会", auraTier: 3, requiredTotalLxp: 18000 },
  { level: 9, title: "高校日本代表 4番打者", badge: "日本代表", auraTier: 3, requiredTotalLxp: 26000 },
  { level: 10, title: "球史に刻まれし球聖 (GOD)", badge: "殿堂入り", auraTier: 3, requiredTotalLxp: 36000 },
];

export interface BaseballPlayerProfile {
  name: string;
  gender: "boy" | "girl";
  teamColor: string;
  level: number;
  exp: number;        // 未使用所持LXP
  totalLxp: number;   // 累積LXP
  career: KnockCareerRecord; // トータルノック記録
  stats: SocialTriStats;    // 地理・歴史・公民の3大ステータス (1〜99)
  selectedBatTier: BatTier;
}

export const DEFAULT_KNOCK_RECORD: KnockCareerRecord = {
  totalKnocks: 0,
  totalCatches: 0,
  maxCombo: 0,
  geoCatches: 0,
  historyCatches: 0,
  civicsCatches: 0,
};

export const DEFAULT_BASEBALL_PLAYER: BaseballPlayerProfile = {
  name: "熱血球児",
  gender: "boy",
  teamColor: "#EF4444",
  level: 1,
  exp: 0,
  totalLxp: 0,
  career: DEFAULT_KNOCK_RECORD,
  stats: {
    geo: 10,
    history: 10,
    civics: 10,
  },
  selectedBatTier: 1,
};

/**
 * 分野別の正解数からステータス値 (1〜99) を計算
 * 1問正解ごとに伸びていき、たくさん解くほどぐんぐん育つ！
 */
export function calculateStatFromCatches(catches: number): number {
  // 初期値10 + 正解数に応じた成長カーブ（最大99）
  const val = 10 + Math.floor(Math.sqrt(catches) * 5.2);
  return Math.min(99, Math.max(10, val));
}

/**
 * 累積LXPから現在の到達可能レベルを計算
 */
export function calculateLevelFromTotalLxp(totalLxp: number): PlayerRankInfo {
  let reached = PLAYER_RANKS[0];
  for (const rank of PLAYER_RANKS) {
    if (totalLxp >= rank.requiredTotalLxp) {
      reached = rank;
    } else {
      break;
    }
  }
  return reached;
}

/**
 * 総合評価ランク (F, E, D, C, B, A, S, SS) を計算
 */
export function calculateOverallRank(stats: SocialTriStats): {
  rank: string;
  color: string;
  average: number;
} {
  const sum = stats.geo + stats.history + stats.civics;
  const avg = Math.round(sum / 3);

  if (avg >= 85) return { rank: "SS", color: "#F43F5E", average: avg };
  if (avg >= 75) return { rank: "S", color: "#FACC15", average: avg };
  if (avg >= 65) return { rank: "A", color: "#FB923C", average: avg };
  if (avg >= 55) return { rank: "B", color: "#A855F7", average: avg };
  if (avg >= 45) return { rank: "C", color: "#38BDF8", average: avg };
  if (avg >= 35) return { rank: "D", color: "#10B981", average: avg };
  if (avg >= 25) return { rank: "E", color: "#94A3B8", average: avg };
  return { rank: "F", color: "#64748B", average: avg };
}

export interface KnockProgressDelta {
  totalQuestions: number;
  hits: number;
  maxCombo: number;
  earnedLxp: number;
  geoCatches: number;
  historyCatches: number;
  civicsCatches: number;
}

/**
 * ノックセッションの進行成果（中断時・完了時）をプレイヤープロファイルに反映する純粋関数
 */
export function applyKnockProgress(
  player: BaseballPlayerProfile,
  delta: KnockProgressDelta
): BaseballPlayerProfile {
  const newCareer: KnockCareerRecord = {
    totalKnocks: player.career.totalKnocks + delta.totalQuestions,
    totalCatches: player.career.totalCatches + delta.hits,
    maxCombo: Math.max(player.career.maxCombo, delta.maxCombo),
    geoCatches: player.career.geoCatches + delta.geoCatches,
    historyCatches: player.career.historyCatches + delta.historyCatches,
    civicsCatches: player.career.civicsCatches + delta.civicsCatches,
  };

  const newStats: SocialTriStats = {
    geo: calculateStatFromCatches(newCareer.geoCatches),
    history: calculateStatFromCatches(newCareer.historyCatches),
    civics: calculateStatFromCatches(newCareer.civicsCatches),
  };

  const newTotalLxp = player.totalLxp + delta.earnedLxp;
  const newExp = player.exp + delta.earnedLxp;
  const rankInfo = calculateLevelFromTotalLxp(newTotalLxp);

  return {
    ...player,
    career: newCareer,
    stats: newStats,
    exp: newExp,
    totalLxp: newTotalLxp,
    level: rankInfo.level,
  };
}

