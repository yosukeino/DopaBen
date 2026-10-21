export interface BaseballStats {
  meet: number;    // ミート力 (1〜99)
  power: number;   // パワー (1〜99)
  speed: number;   // 走力 (1〜99)
  focus: number;   // 集中力 (1〜99)
  clutch: number;  // 勝負強さ (1〜99)
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
    color: "#D97706", // 木製
    subColor: "#92400E",
    description: "入部時に渡される基本の木製バット。素朴な打感が手に残る。",
    unlockLevel: 1,
  },
  {
    tier: 2,
    name: "高反発ジュラルミン金属バット",
    badge: "金属音",
    color: "#CBD5E1", // シルバー
    subColor: "#64748B",
    description: "金属特有の快音「カキーン！」がスタジアムに響き渡る名器。",
    unlockLevel: 2,
  },
  {
    tier: 3,
    name: "漆黒の超々ジュラルミン・ブラック",
    badge: "長打特化",
    color: "#1E293B", // 漆黒
    subColor: "#EF4444",
    description: "軽量カーボンを複合した漆黒のバット。芯で捉えた打球が鋭く伸びる。",
    unlockLevel: 4,
  },
  {
    tier: 4,
    name: "栄光の黄金Vバット",
    badge: "甲子園覇者",
    color: "#FACC15", // ゴールド
    subColor: "#FFE600",
    description: "甲子園優勝記念に贈られる純金コーティングバット。オーラを放つ。",
    unlockLevel: 6,
  },
  {
    tier: 5,
    name: "雷神のネオンビームバット",
    badge: "神話レジェンド",
    color: "#22D3EE", // ネオンシアン
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
  { level: 2, title: "期待の代打の切り札", badge: "代打枠", auraTier: 0, requiredTotalLxp: 600 },
  { level: 3, title: "レギュラー定着スタメン", badge: "スタメン", auraTier: 1, requiredTotalLxp: 1500 },
  { level: 4, title: "韋駄天リードオフマン", badge: "1番打者", auraTier: 1, requiredTotalLxp: 3000 },
  { level: 5, title: "豪打のクリーンナップ砲", badge: "4番打者", auraTier: 2, requiredTotalLxp: 5500 },
  { level: 6, title: "学園野球部 副主将", badge: "副キャプテン", auraTier: 2, requiredTotalLxp: 9000 },
  { level: 7, title: "二刀流・主将エース", badge: "主将", auraTier: 2, requiredTotalLxp: 14000 },
  { level: 8, title: "甲子園を揺るがす怪物", badge: "全国大会", auraTier: 3, requiredTotalLxp: 21000 },
  { level: 9, title: "高校日本代表 4番打者", badge: "日本代表", auraTier: 3, requiredTotalLxp: 30000 },
  { level: 10, title: "球史に刻まれし球聖 (GOD)", badge: "殿堂入り", auraTier: 3, requiredTotalLxp: 42000 },
];

export interface BaseballPlayerProfile {
  name: string;
  gender: "boy" | "girl";
  teamColor: string;
  level: number;
  exp: number;        // 未使用所持LXP（ステータス強化に消費可能）
  totalLxp: number;   // 累積LXP（レベルアップ判定）
  stats: BaseballStats;
  selectedBatTier: BatTier;
}

export const DEFAULT_BASEBALL_PLAYER: BaseballPlayerProfile = {
  name: "熱血球児",
  gender: "boy",
  teamColor: "#EF4444",
  level: 1,
  exp: 0,
  totalLxp: 0,
  stats: {
    meet: 15,
    power: 15,
    speed: 15,
    focus: 15,
    clutch: 15,
  },
  selectedBatTier: 1,
};

/**
 * ステータス1UPに必要なLXPコストを計算
 * パラメータが上がるほど徐々にコストが増加（パワプロ風の育成感）
 */
export function getStatUpgradeCost(currentValue: number): number {
  if (currentValue < 30) return 80;
  if (currentValue < 50) return 150;
  if (currentValue < 70) return 260;
  if (currentValue < 85) return 420;
  return 650;
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
 * 総合評価ランク (G, F, E, D, C, B, A, S, SS) を計算
 */
export function calculateOverallRank(stats: BaseballStats): {
  rank: string;
  color: string;
  average: number;
} {
  const sum = stats.meet + stats.power + stats.speed + stats.focus + stats.clutch;
  const avg = Math.round(sum / 5);

  if (avg >= 85) return { rank: "SS", color: "#F43F5E", average: avg };
  if (avg >= 75) return { rank: "S", color: "#FACC15", average: avg };
  if (avg >= 65) return { rank: "A", color: "#FB923C", average: avg };
  if (avg >= 55) return { rank: "B", color: "#A855F7", average: avg };
  if (avg >= 45) return { rank: "C", color: "#38BDF8", average: avg };
  if (avg >= 35) return { rank: "D", color: "#10B981", average: avg };
  if (avg >= 25) return { rank: "E", color: "#94A3B8", average: avg };
  return { rank: "F", color: "#64748B", average: avg };
}
