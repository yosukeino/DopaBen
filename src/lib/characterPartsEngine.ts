import {
  CharacterGender,
  CharacterPartLoadout,
  FiveStats,
  StatBranchType,
} from "./types";

export interface PartItemDef {
  id: string;
  slot:
    | "hairStyle"
    | "headgear"
    | "eyeStyle"
    | "outfit"
    | "weaponRight"
    | "weaponLeft"
    | "backGear"
    | "palette";
  name: string;
  badge: string;
  unlockLevel: number;
  lxpCost: number;
  description?: string;
  branchAffinity?: StatBranchType;
}

/**
 * 4色カラーパレット（キャラの全ピクセルを厳密にこの4色のみで表現）
 * c1: 暗部 / 輪郭線 / 靴 / 瞳 (Base Dark)
 * c2: 肌色 / 明部 / シャツ (Light / Skin)
 * c3: 制服メイン色 / 髪色 (Main Fabric / Hair)
 * c4: アクセント色 (Tie, Ribbon, Emblem, Pen Light)
 */
export interface FourColorPalette {
  id: string;
  name: string;
  badge: string;
  c1: string; // Base Dark
  c2: string; // Light / Skin
  c3: string; // Main Fabric / Hair
  c4: string; // Accent
  isCustom?: boolean;
}

// 学園モノ世界観における6系統の称号定義（DopaEng＝万能勇者）
export const STAT_BRANCH_INFO: Record<
  StatBranchType,
  {
    id: StatBranchType;
    label: string;
    shortLabel: string;
    badge: string;
    color: string;
    description: string;
    classTitlesBoy: string[];
    classTitlesGirl: string[];
  }
> = {
  balanced: {
    id: "balanced",
    label: "万能勇者系統（学園の英語勇者・DopaEng）",
    shortLabel: "万能勇者",
    badge: "⚖️ DopaEng勇者",
    color: "#FACC15",
    description:
      "他教科の仲間と力を合わせて大ボスに立ち向かう、英語の万能勇者ルート！",
    classTitlesBoy: [
      "寝起きの英語新入生",
      "単語帳スプリンター",
      "放課後イングリッシュ",
      "学園の英語エース",
      "生徒会スピーチリーダー",
      "学園英語フェニックス",
      "特待生・DopaEng",
      "学園選抜・英語ヒーロー",
      "覚醒・万能勇者DopaEng",
      "森羅万象の英語勇者（レジェンド）",
    ],
    classTitlesGirl: [
      "寝起きの英語新入生",
      "単語帳スプリンター",
      "放課後イングリッシュ",
      "学園の英語エース",
      "生徒会スピーチリーダー",
      "学園英語フェニックス",
      "特待生・DopaEng",
      "学園選抜・英語ヒロイン",
      "覚醒・万能勇者DopaEng",
      "森羅万象の英語勇者（レジェンド）",
    ],
  },
  vocab: {
    id: "vocab",
    label: "語彙特化系統（図書室の英語スカラー）",
    shortLabel: "語彙スカラー",
    badge: "📖 SAGE",
    color: "#A855F7",
    description: "【語彙】が突出！分厚い英英辞典と単語力で論破する図書賢者ルート。",
    classTitlesBoy: [
      "見習い図書委員",
      "単語帳マスター",
      "辞書引きスカラー",
      "オックスフォード読破生",
      "学園の生き字引",
      "図書室のアーク賢者",
      "禁書庫のイングリッシュロード",
      "語彙力無双のスペシャリスト",
      "六翼のボキャブラリーセージ",
      "森羅万象の語彙大賢者",
    ],
    classTitlesGirl: [
      "見習い図書委員",
      "単語帳マスター",
      "辞書引きスカラー",
      "オックスフォード読破生",
      "学園の生き字引",
      "図書室のアーク賢者",
      "禁書庫のイングリッシュクイーン",
      "語彙力無双のスペシャリスト",
      "六翼のボキャブラリーセージ",
      "森羅万象の語彙大賢者",
    ],
  },
  speed: {
    id: "speed",
    label: "瞬発特化系統（シャドーイング神速走者）",
    shortLabel: "瞬発スプリンター",
    badge: "⚡ SHINOBI",
    color: "#06B6D4",
    description: "【瞬発】が突出！電光石火の即答とシャドーイングで駆け抜ける神速ルート。",
    classTitlesBoy: [
      "早口英語の練習生",
      "即答スラッガー",
      "シャドーイング走者",
      "疾風のディベーター",
      "音速のスピーカー",
      "ストリート・ラッパー",
      "ライトニング・トーカー",
      "英語フラッシュマスター",
      "瞬発神速のライトニング・ロード",
      "時空超越の光速スピーカー",
    ],
    classTitlesGirl: [
      "早口英語の練習生",
      "即答スラッガー",
      "シャドーイング走者",
      "疾風のディベーター",
      "音速のスピーカー",
      "ストリート・ラッパー",
      "ライトニング・トーカー",
      "英語フラッシュマスター",
      "瞬発神速のライトニング・クイーン",
      "時空超越の光速スピーカー",
    ],
  },
  grammar: {
    id: "grammar",
    label: "構築特化系統（鉄壁の構文アーキテクト）",
    shortLabel: "構文パラディン",
    badge: "🛡️ PALADIN",
    color: "#10B981",
    description: "【構築】が突出！5文型と複雑な複文パズルを瞬時に組み立てる理論派ルート。",
    classTitlesBoy: [
      "文法パズル好きの生徒",
      "5文型ビルダー",
      "構文アーキテクト",
      "ロジカル・エッセイスト",
      "長文解読パラディン",
      "不落のグラマーガード",
      "白銀の構文ナイト",
      "秩序のイージス・ディベーター",
      "構文創世のアークアーキテクト",
      "絶対秩序の創世文法神",
    ],
    classTitlesGirl: [
      "文法パズル好きの生徒",
      "5文型ビルダー",
      "構文アーキテクト",
      "ロジカル・エッセイスト",
      "長文解読パラディン",
      "不落のグラマーガード",
      "白銀の構文ヴァルキリー",
      "秩序のイージス・ディベーター",
      "構文創世のアークアーキテクト",
      "絶対秩序の創世文法神",
    ],
  },
  listening: {
    id: "listening",
    label: "聴覚特化系統（共鳴のネイティブリスナー）",
    shortLabel: "聴覚リスナー",
    badge: "🎧 SONIC",
    color: "#EC4899",
    description: "【聴覚】が突出！ネイティブの微細な発音も完璧に聞き分ける音撃ルート。",
    classTitlesBoy: [
      "通学ヘッドホンの生徒",
      "ポッドキャスト愛好家",
      "ネイティブ耳の生徒",
      "発音チューナーDJ",
      "学園放送の英語アナウンサー",
      "超音撃のリスナー",
      "共鳴のソニック・スター",
      "極彩音波のイングリッシュマスター",
      "宇宙共鳴のサウンドロード",
      "全知共鳴のリスニングゴッド",
    ],
    classTitlesGirl: [
      "通学ヘッドホンの生徒",
      "ポッドキャスト愛好家",
      "ネイティブ耳の生徒",
      "発音チューナーDJ",
      "学園放送の英語アナウンサー",
      "超音撃のリスナー",
      "共鳴のソニック・ミューズ",
      "極彩音波のイングリッシュマスター",
      "宇宙共鳴のサウンドクイーン",
      "全知共鳴のリスニングゴッド",
    ],
  },
  guts: {
    id: "guts",
    label: "度胸特化系統（不屈のプレゼン覇王）",
    shortLabel: "度胸スピーカー",
    badge: "🔥 OVERLORD",
    color: "#EF4444",
    description: "【度胸】が突出！文法ミスを恐れず壇上で堂々と英語を放つ度胸満点ルート。",
    classTitlesBoy: [
      "身振り手振りスピーカー",
      "物怖じしない新星",
      "学園ストリートスピーカー",
      "不屈のプレゼンター",
      "英語弁論ファイナリスト",
      "壇上のディベート覇王",
      "スピーチコンテストの勝者",
      "逆転無双のプレゼンリーダー",
      "紅蓮スピーチのオーバードライブ",
      "逆転無双の英語プレゼン神",
    ],
    classTitlesGirl: [
      "身振り手振りスピーカー",
      "物怖じしない新星",
      "学園ストリートスピーカー",
      "不屈のプレゼンター",
      "英語弁論ファイナリスト",
      "壇上のディベート覇王",
      "スピーチコンテストの勝者",
      "逆転無双のプレゼンリーダー",
      "紅蓮スピーチのオーバードライブ",
      "逆転無双の英語プレゼン神",
    ],
  },
};

/**
 * 厳選された基本4色パレットアイテム群（学園モノ・レトロピクセル調）
 */
export const PRESET_4COLOR_PALETTES: FourColorPalette[] = [
  {
    id: "pal_classic_navy",
    name: "王道ネイビー制服",
    badge: "定番",
    c1: "#0F172A", // 深紺ライン
    c2: "#FFDCB8", // 健康的な肌色
    c3: "#1E3A8A", // 伝統ブレザー紺
    c4: "#FACC15", // ゴールド金ボタン
  },
  {
    id: "pal_crimson_afterschool",
    name: "茜色の放課後",
    badge: "人気",
    c1: "#1E1B18",
    c2: "#FFE3C7",
    c3: "#991B1B", // 夕暮れクリムゾン
    c4: "#F59E0B", // 琥珀色の夕陽
  },
  {
    id: "pal_campus_emerald",
    name: "新緑のキャンパス",
    badge: "爽やか",
    c1: "#064E3B",
    c2: "#FFDCB8",
    c3: "#047857", // エメラルド制服
    c4: "#FEF08A", // レモンイエロータイ
  },
  {
    id: "pal_sakura_blossom",
    name: "春風の桜並木",
    badge: "春季",
    c1: "#4A044E",
    c2: "#FFF1F2",
    c3: "#DB2777", // 桜ピンク
    c4: "#FACC15", // 花粉ゴールド
  },
  {
    id: "pal_berry_rose",
    name: "放課後チェリーローズ",
    badge: "人気",
    c1: "#1E1229", // 深みショコラライン
    c2: "#FFF0F5", // 透き通るミルキー美肌
    c3: "#831843", // 上品なディープチェリー
    c4: "#F43F5E", // 華やかチェリーローズリボン
  },
  {
    id: "pal_sweet_caramel",
    name: "ミルクティーラテ",
    badge: "キュート",
    c1: "#29150B", // ビターショコラ
    c2: "#FFF7ED", // やわらか白肌
    c3: "#9A3412", // ふんわりミルクティー
    c4: "#2DD4BF", // スパークルミントリボン
  },
  {
    id: "pal_cyber_academy",
    name: "電脳アカデミー",
    badge: "SF",
    c1: "#090D16",
    c2: "#E0F2FE",
    c3: "#0284C7", // サイバーブルー
    c4: "#22D3EE", // ネオンシアン
  },
  {
    id: "pal_monotone_gakuran",
    name: "伝統の漆黒学ラン",
    badge: "硬派",
    c1: "#030712",
    c2: "#FFDCB8",
    c3: "#374151", // チャコールブラック
    c4: "#FFFFFF", // 白詰襟・白ライン
  },
  {
    id: "pal_twilight_violet",
    name: "黄昏の図書室",
    badge: "知性",
    c1: "#1E1B4B",
    c2: "#FAF5FF",
    c3: "#6D28D9", // ロイヤルパープル
    c4: "#C084FC", // アメジスト
  },
  {
    id: "pal_retro_gameboy",
    name: "初代レトロポータブル",
    badge: "激レア",
    c1: "#0F380F",
    c2: "#9BBC0F",
    c3: "#306230",
    c4: "#8BAC0F",
  },
  {
    id: "pal_brave_gold",
    name: "万能勇者DopaEngゴールド",
    badge: "Lv.10",
    c1: "#1E293B",
    c2: "#FFFFFF",
    c3: "#CA8A04", // 黄金ブレザー
    c4: "#EF4444", // 勇者の深紅ネクタイ
  },
];

/**
 * ランダムに美しい調和の取れた4色パレットを1つ生成するジェネレーター
 */
export function generateRandom4ColorPalette(): FourColorPalette {
  const hues = [
    { name: "サイバー", c3: "#0284C7", c4: "#00F0FF" },
    { name: "紅蓮", c3: "#B91C1C", c4: "#F59E0B" },
    { name: "フォレスト", c3: "#15803D", c4: "#FACC15" },
    { name: "プラム", c3: "#7E22CE", c4: "#F472B6" },
    { name: "サンセット", c3: "#C2410C", c4: "#FEF08A" },
    { name: "インディゴ", c3: "#3730A3", c4: "#38BDF8" },
    { name: "ローズ", c3: "#BE123C", c4: "#FDA4AF" },
    { name: "ティール", c3: "#0F766E", c4: "#A7F3D0" },
    { name: "ノクターン", c3: "#1F2937", c4: "#E11D48" },
    { name: "ゴールド", c3: "#A16207", c4: "#FFFFFF" },
  ];
  const darks = ["#090D16", "#0F172A", "#111827", "#1A102F", "#18181B"];
  const lights = ["#FFDCB8", "#FFE3C7", "#F8FAFC", "#FEF3C7", "#EDE9FE"];

  const randomHue = hues[Math.floor(Math.random() * hues.length)];
  const randomDark = darks[Math.floor(Math.random() * darks.length)];
  const randomLight = lights[Math.floor(Math.random() * lights.length)];
  const idSuffix = Math.floor(1000 + Math.random() * 9000);

  return {
    id: `pal_custom_${idSuffix}`,
    name: `${randomHue.name}カスタム #${idSuffix}`,
    badge: "生成",
    c1: randomDark,
    c2: randomLight,
    c3: randomHue.c3,
    c4: randomHue.c4,
    isCustom: true,
  };
}

// =========================================================================
// 学園モノ × 英語勇者DopaEng のパーツ定義（全8部位）
// =========================================================================

export const HAIR_STYLES: PartItemDef[] = [
  { id: "hair_spiky", slot: "hairStyle", name: "爽やかスクールショート", badge: "定番", unlockLevel: 1, lxpCost: 0 },
  { id: "hair_bob", slot: "hairStyle", name: "ふんわりスクールボブ", badge: "定番", unlockLevel: 1, lxpCost: 0 },
  { id: "hair_twintail", slot: "hairStyle", name: "王道スクールツインテ", badge: "人気", unlockLevel: 1, lxpCost: 0 },
  { id: "hair_mush", slot: "hairStyle", name: "今どきマッシュヘア", badge: "Lv.2", unlockLevel: 2, lxpCost: 200 },
  { id: "hair_ponytail", slot: "hairStyle", name: "疾風ポニーテール", badge: "瞬発", unlockLevel: 2, lxpCost: 200, branchAffinity: "speed" },
  { id: "hair_wolf", slot: "hairStyle", name: "ストリートウルフ", badge: "Lv.3", unlockLevel: 3, lxpCost: 400 },
  { id: "hair_center", slot: "hairStyle", name: "知的センターパート", badge: "語彙", unlockLevel: 3, lxpCost: 400, branchAffinity: "vocab" },
  { id: "hair_drill", slot: "hairStyle", name: "お嬢様ツインロール", badge: "構築", unlockLevel: 4, lxpCost: 600, branchAffinity: "grammar" },
  { id: "hair_allback", slot: "hairStyle", name: "気合のオールバック", badge: "度胸", unlockLevel: 5, lxpCost: 800, branchAffinity: "guts" },
  { id: "hair_odango", slot: "hairStyle", name: "ポップお団子ツイン", badge: "聴覚", unlockLevel: 6, lxpCost: 1000, branchAffinity: "listening" },
  { id: "hair_flame", slot: "hairStyle", name: "不屈のバーサーカー逆毛", badge: "Lv.8", unlockLevel: 8, lxpCost: 1500 },
  { id: "hair_brave_crown", slot: "hairStyle", name: "覚醒・英語勇者ヘア", badge: "Lv.10", unlockLevel: 10, lxpCost: 3000 },
];

export const HEADGEAR_PARTS: PartItemDef[] = [
  { id: "head_none", slot: "headgear", name: "なし（素頭）", badge: "定番", unlockLevel: 1, lxpCost: 0 },
  { id: "head_ahoge", slot: "headgear", name: "寝癖ピョコ毛", badge: "Lv.1", unlockLevel: 1, lxpCost: 0 },
  { id: "head_ribbon", slot: "headgear", name: "制服ヘアリボン", badge: "Lv.2", unlockLevel: 2, lxpCost: 150 },
  { id: "head_glasses", slot: "headgear", name: "知略のスクールメガネ", badge: "語彙", unlockLevel: 2, lxpCost: 250, branchAffinity: "vocab" },
  { id: "head_headphones", slot: "headgear", name: "通学ネオンヘッドホン", badge: "聴覚", unlockLevel: 3, lxpCost: 400, branchAffinity: "listening" },
  { id: "head_cap", slot: "headgear", name: "ストリート英語キャップ", badge: "瞬発", unlockLevel: 3, lxpCost: 400, branchAffinity: "speed" },
  { id: "head_smart_glass", slot: "headgear", name: "電子辞書スマートグラス", badge: "構築", unlockLevel: 4, lxpCost: 600, branchAffinity: "grammar" },
  { id: "head_headband", slot: "headgear", name: "必勝スピーチハチマキ", badge: "度胸", unlockLevel: 5, lxpCost: 800, branchAffinity: "guts" },
  { id: "head_laurel", slot: "headgear", name: "英語弁論大会月桂冠", badge: "Lv.7", unlockLevel: 7, lxpCost: 1200 },
  { id: "head_brave_tiara", slot: "headgear", name: "万能勇者の黄金ティアラ", badge: "Lv.10", unlockLevel: 10, lxpCost: 2500 },
];

export const EYE_STYLES: PartItemDef[] = [
  { id: "eye_normal", slot: "eyeStyle", name: "まじめスクール瞳", badge: "定番", unlockLevel: 1, lxpCost: 0 },
  { id: "eye_determined", slot: "eyeStyle", name: "熱血キリッ目", badge: "度胸", unlockLevel: 2, lxpCost: 200, branchAffinity: "guts" },
  { id: "eye_cool", slot: "eyeStyle", name: "クールインテリ瞳", badge: "語彙", unlockLevel: 3, lxpCost: 350, branchAffinity: "vocab" },
  { id: "eye_sparkle", slot: "eyeStyle", name: "キラキラ期待の瞳", badge: "聴覚", unlockLevel: 4, lxpCost: 500, branchAffinity: "listening" },
  { id: "eye_cyber", slot: "eyeStyle", name: "電脳スマートスキャン瞳", badge: "構築", unlockLevel: 5, lxpCost: 750, branchAffinity: "grammar" },
  { id: "eye_brave", slot: "eyeStyle", name: "万能勇者DopaEngの瞳", badge: "Lv.10", unlockLevel: 10, lxpCost: 2000 },
];

export const OUTFIT_PARTS: PartItemDef[] = [
  { id: "outfit_jersey", slot: "outfit", name: "部屋着・新入生ジャージ", badge: "Lv.1", unlockLevel: 1, lxpCost: 0 },
  { id: "outfit_uniform", slot: "outfit", name: "学園ブレザー制服", badge: "Lv.2", unlockLevel: 2, lxpCost: 200 },
  { id: "outfit_sailor_gakuran", slot: "outfit", name: "伝統セーラー / 学ラン", badge: "Lv.2", unlockLevel: 2, lxpCost: 200 },
  { id: "outfit_cardigan", slot: "outfit", name: "放課後スクールカーディガン", badge: "Lv.3", unlockLevel: 3, lxpCost: 400 },
  { id: "outfit_hoodie", slot: "outfit", name: "パーカー制服スタイル", badge: "瞬発", unlockLevel: 4, lxpCost: 600, branchAffinity: "speed" },
  { id: "outfit_tuxedo", slot: "outfit", name: "英語弁論大会フォーマルスーツ", badge: "度胸", unlockLevel: 5, lxpCost: 800, branchAffinity: "guts" },
  { id: "outfit_scholar_robe", slot: "outfit", name: "図書室スカラー制服", badge: "語彙", unlockLevel: 6, lxpCost: 1000, branchAffinity: "vocab" },
  { id: "outfit_idol_stage", slot: "outfit", name: "学園祭ステージ衣装", badge: "聴覚", unlockLevel: 6, lxpCost: 1000, branchAffinity: "listening" },
  { id: "outfit_council_blazer", slot: "outfit", name: "生徒会特注エンブレム制服", badge: "構築", unlockLevel: 7, lxpCost: 1400, branchAffinity: "grammar" },
  { id: "outfit_ace_blazer", slot: "outfit", name: "学園英語選抜エースブレザー", badge: "Lv.8", unlockLevel: 8, lxpCost: 1800 },
  { id: "outfit_brave_dopaeng", slot: "outfit", name: "万能勇者DopaEngマント制服", badge: "Lv.10", unlockLevel: 10, lxpCost: 3500 },
];

export const WEAPON_RIGHT_PARTS: PartItemDef[] = [
  { id: "wp_none", slot: "weaponRight", name: "なし（素手）", badge: "Lv.1", unlockLevel: 1, lxpCost: 0 },
  { id: "wp_pencil_dagger", slot: "weaponRight", name: "必勝シャープペンシル", badge: "Lv.2", unlockLevel: 2, lxpCost: 200 },
  { id: "wp_fountain_pen", slot: "weaponRight", name: "インテリ万年筆ブレード", badge: "語彙", unlockLevel: 3, lxpCost: 400, branchAffinity: "vocab" },
  { id: "wp_ruler_blade", slot: "weaponRight", name: "30cm定規スラッシャー", badge: "瞬発", unlockLevel: 4, lxpCost: 600, branchAffinity: "speed" },
  { id: "wp_speech_mic", slot: "weaponRight", name: "英語スピーチマイク", badge: "聴覚", unlockLevel: 4, lxpCost: 600, branchAffinity: "listening" },
  { id: "wp_laser_pointer", slot: "weaponRight", name: "レーザーポインターセイバー", badge: "構築", unlockLevel: 5, lxpCost: 800, branchAffinity: "grammar" },
  { id: "wp_megaphone", slot: "weaponRight", name: "学園応援メガホン", badge: "度胸", unlockLevel: 6, lxpCost: 1000, branchAffinity: "guts" },
  { id: "wp_penlight_sabre", slot: "weaponRight", name: "ペンライトツインブレード", badge: "Lv.7", unlockLevel: 7, lxpCost: 1400 },
  { id: "wp_e_dict_sabre", slot: "weaponRight", name: "電子辞書プラズマセイバー", badge: "Lv.8", unlockLevel: 8, lxpCost: 1800 },
  { id: "wp_brave_pen_caliber", slot: "weaponRight", name: "勇者の光筆ペンシルカリバー", badge: "Lv.10", unlockLevel: 10, lxpCost: 3500 },
];

export const WEAPON_LEFT_PARTS: PartItemDef[] = [
  { id: "sub_none", slot: "weaponLeft", name: "なし", badge: "定番", unlockLevel: 1, lxpCost: 0 },
  { id: "sub_word_ring", slot: "weaponLeft", name: "必勝リング単語帳", badge: "Lv.2", unlockLevel: 2, lxpCost: 200 },
  { id: "sub_school_bag", slot: "weaponLeft", name: "通学スクールバッグ", badge: "Lv.3", unlockLevel: 3, lxpCost: 400 },
  { id: "sub_oxford_dict", slot: "weaponLeft", name: "厚口オックスフォード英英辞典", badge: "語彙", unlockLevel: 4, lxpCost: 600, branchAffinity: "vocab" },
  { id: "sub_speech_notes", slot: "weaponLeft", name: "英語弁論スピーチ原稿", badge: "度胸", unlockLevel: 5, lxpCost: 800, branchAffinity: "guts" },
  { id: "sub_e_dict_pad", slot: "weaponLeft", name: "小型電子辞書パッド", badge: "構築", unlockLevel: 6, lxpCost: 1000, branchAffinity: "grammar" },
  { id: "sub_wireless_earbud", slot: "weaponLeft", name: "重低音スピーカー宝珠", badge: "聴覚", unlockLevel: 6, lxpCost: 1000, branchAffinity: "listening" },
  { id: "sub_dual_pen", slot: "weaponLeft", name: "逆手・二刀流赤ペン", badge: "瞬発", unlockLevel: 7, lxpCost: 1300, branchAffinity: "speed" },
  { id: "sub_brave_crest_shield", slot: "weaponLeft", name: "万能勇者の生徒手帳シールド", badge: "Lv.10", unlockLevel: 10, lxpCost: 3000 },
];

export const BACK_GEAR_PARTS: PartItemDef[] = [
  { id: "back_none", slot: "backGear", name: "なし", badge: "Lv.1", unlockLevel: 1, lxpCost: 0 },
  { id: "back_rucksack", slot: "backGear", name: "スクールリュックサック", badge: "Lv.2", unlockLevel: 2, lxpCost: 200 },
  { id: "back_scarf", slot: "backGear", name: "風になびく通学マフラー", badge: "瞬発", unlockLevel: 3, lxpCost: 400, branchAffinity: "speed" },
  { id: "back_shoulder_knit", slot: "backGear", name: "肩掛けプロデューサーニット", badge: "Lv.4", unlockLevel: 4, lxpCost: 600 },
  { id: "back_equalizer", slot: "backGear", name: "ネオン音波イコライザー", badge: "聴覚", unlockLevel: 5, lxpCost: 800, branchAffinity: "listening" },
  { id: "back_flying_stationery", slot: "backGear", name: "浮遊する必勝文具ビット", badge: "構築", unlockLevel: 6, lxpCost: 1100, branchAffinity: "grammar" },
  { id: "back_speech_banner", slot: "backGear", name: "大会応援スクールフラッグ", badge: "度胸", unlockLevel: 7, lxpCost: 1400, branchAffinity: "guts" },
  { id: "back_alphabet_aura", slot: "backGear", name: "舞い踊る英単語(A-Z)オーラ", badge: "語彙", unlockLevel: 8, lxpCost: 1800, branchAffinity: "vocab" },
  { id: "back_brave_cape", slot: "backGear", name: "英語勇者の学園マント", badge: "Lv.9", unlockLevel: 9, lxpCost: 2400 },
  { id: "back_brave_wings", slot: "backGear", name: "万能勇者DopaEngの光翼", badge: "Lv.10", unlockLevel: 10, lxpCost: 3500 },
];

// パレットパーツ一覧（プリセット）
export const PALETTE_PART_DEFS: PartItemDef[] = PRESET_4COLOR_PALETTES.map((p) => ({
  id: p.id,
  slot: "palette",
  name: p.name,
  badge: p.badge,
  unlockLevel: 1,
  lxpCost: 0,
}));

export const ALL_CHARACTER_PARTS: PartItemDef[] = [
  ...HAIR_STYLES,
  ...HEADGEAR_PARTS,
  ...EYE_STYLES,
  ...OUTFIT_PARTS,
  ...WEAPON_RIGHT_PARTS,
  ...WEAPON_LEFT_PARTS,
  ...BACK_GEAR_PARTS,
  ...PALETTE_PART_DEFS,
];

/**
 * プレイヤーの五角形ステータスから、現在の「進化系統（6系統）」を自動判定する
 */
export function detectStatBranch(stats?: FiveStats): StatBranchType {
  if (!stats) return "balanced";
  const entries: { key: StatBranchType; val: number }[] = [
    { key: "vocab", val: stats.vocab },
    { key: "speed", val: stats.speed },
    { key: "grammar", val: stats.grammar },
    { key: "listening", val: stats.listening },
    { key: "guts", val: stats.guts },
  ];
  entries.sort((a, b) => b.val - a.val);

  if (entries[0].val <= 20 || entries[0].val - entries[4].val < 3) {
    return "balanced";
  }
  return entries[0].key;
}

/**
 * 性別 × レベル(1〜10) × 進化系統(6系統) から、全120パターンの公式学園進化ロードアウトを解決
 */
export function resolveAutoLoadout(
  gender: CharacterGender,
  stage: number,
  branch: StatBranchType
): CharacterPartLoadout {
  const lv = Math.max(1, Math.min(10, stage));

  // Lv.10 はどの系統でも「万能勇者DopaEng」覚醒フォーム！
  if (lv === 10) {
    return {
      mode: "auto",
      forcedBranch: branch,
      hairStyle: "hair_brave_crown",
      headgear: "head_brave_tiara",
      eyeStyle: "eye_brave",
      outfit: "outfit_brave_dopaeng",
      weaponRight: "wp_brave_pen_caliber",
      weaponLeft: "sub_brave_crest_shield",
      backGear: "back_brave_wings",
      palette: "pal_brave_gold",
    };
  }

  // 系統別テーブル
  switch (branch) {
    case "vocab": {
      const hairs = ["hair_spiky", "hair_center", "hair_center", "hair_center", "hair_wolf", "hair_center", "hair_center", "hair_center", "hair_brave_crown"];
      const hairsG = ["hair_bob", "hair_bob", "hair_drill", "hair_bob", "hair_drill", "hair_bob", "hair_drill", "hair_bob", "hair_brave_crown"];
      const heads = ["head_ahoge", "head_glasses", "head_glasses", "head_glasses", "head_smart_glass", "head_smart_glass", "head_laurel", "head_laurel", "head_brave_tiara"];
      const outfits = ["outfit_jersey", "outfit_uniform", "outfit_cardigan", "outfit_scholar_robe", "outfit_scholar_robe", "outfit_scholar_robe", "outfit_council_blazer", "outfit_ace_blazer", "outfit_ace_blazer"];
      const wpR = ["wp_none", "wp_pencil_dagger", "wp_fountain_pen", "wp_fountain_pen", "wp_fountain_pen", "wp_e_dict_sabre", "wp_fountain_pen", "wp_e_dict_sabre", "wp_brave_pen_caliber"];
      const wpL = ["sub_none", "sub_word_ring", "sub_word_ring", "sub_oxford_dict", "sub_oxford_dict", "sub_oxford_dict", "sub_e_dict_pad", "sub_oxford_dict", "sub_brave_crest_shield"];
      const backs = ["back_none", "back_none", "back_rucksack", "back_rucksack", "back_shoulder_knit", "back_alphabet_aura", "back_alphabet_aura", "back_brave_cape", "back_brave_cape"];
      return {
        mode: "auto",
        forcedBranch: branch,
        hairStyle: gender === "boy" ? hairs[lv - 1] : hairsG[lv - 1],
        headgear: heads[lv - 1],
        eyeStyle: lv >= 5 ? "eye_cool" : "eye_normal",
        outfit: outfits[lv - 1],
        weaponRight: wpR[lv - 1],
        weaponLeft: wpL[lv - 1],
        backGear: backs[lv - 1],
        palette: "pal_twilight_violet",
      };
    }

    case "speed": {
      const hairs = ["hair_spiky", "hair_spiky", "hair_mush", "hair_mush", "hair_wolf", "hair_mush", "hair_wolf", "hair_flame", "hair_brave_crown"];
      const hairsG = ["hair_ponytail", "hair_ponytail", "hair_ponytail", "hair_twintail", "hair_ponytail", "hair_ponytail", "hair_twintail", "hair_ponytail", "hair_brave_crown"];
      const heads = ["head_ahoge", "head_cap", "head_cap", "head_cap", "head_headband", "head_cap", "head_headband", "head_laurel", "head_brave_tiara"];
      const outfits = ["outfit_jersey", "outfit_uniform", "outfit_hoodie", "outfit_hoodie", "outfit_hoodie", "outfit_cardigan", "outfit_council_blazer", "outfit_ace_blazer", "outfit_ace_blazer"];
      const wpR = ["wp_none", "wp_pencil_dagger", "wp_ruler_blade", "wp_ruler_blade", "wp_ruler_blade", "wp_ruler_blade", "wp_penlight_sabre", "wp_ruler_blade", "wp_brave_pen_caliber"];
      const wpL = ["sub_none", "sub_none", "sub_word_ring", "sub_dual_pen", "sub_dual_pen", "sub_school_bag", "sub_dual_pen", "sub_dual_pen", "sub_brave_crest_shield"];
      const backs = ["back_none", "back_scarf", "back_scarf", "back_scarf", "back_rucksack", "back_scarf", "back_scarf", "back_brave_cape", "back_brave_cape"];
      return {
        mode: "auto",
        forcedBranch: branch,
        hairStyle: gender === "boy" ? hairs[lv - 1] : hairsG[lv - 1],
        headgear: heads[lv - 1],
        eyeStyle: lv >= 5 ? "eye_determined" : "eye_normal",
        outfit: outfits[lv - 1],
        weaponRight: wpR[lv - 1],
        weaponLeft: wpL[lv - 1],
        backGear: backs[lv - 1],
        palette: "pal_cyber_academy",
      };
    }

    case "grammar": {
      const hairs = ["hair_spiky", "hair_mush", "hair_center", "hair_mush", "hair_center", "hair_mush", "hair_center", "hair_center", "hair_brave_crown"];
      const hairsG = ["hair_bob", "hair_twintail", "hair_drill", "hair_drill", "hair_drill", "hair_drill", "hair_drill", "hair_drill", "hair_brave_crown"];
      const heads = ["head_ahoge", "head_ribbon", "head_smart_glass", "head_smart_glass", "head_smart_glass", "head_smart_glass", "head_laurel", "head_laurel", "head_brave_tiara"];
      const outfits = ["outfit_jersey", "outfit_uniform", "outfit_cardigan", "outfit_cardigan", "outfit_council_blazer", "outfit_council_blazer", "outfit_council_blazer", "outfit_ace_blazer", "outfit_ace_blazer"];
      const wpR = ["wp_none", "wp_pencil_dagger", "wp_laser_pointer", "wp_laser_pointer", "wp_laser_pointer", "wp_laser_pointer", "wp_laser_pointer", "wp_e_dict_sabre", "wp_brave_pen_caliber"];
      const wpL = ["sub_none", "sub_word_ring", "sub_word_ring", "sub_e_dict_pad", "sub_e_dict_pad", "sub_e_dict_pad", "sub_e_dict_pad", "sub_e_dict_pad", "sub_brave_crest_shield"];
      const backs = ["back_none", "back_none", "back_shoulder_knit", "back_shoulder_knit", "back_flying_stationery", "back_flying_stationery", "back_flying_stationery", "back_brave_cape", "back_brave_cape"];
      return {
        mode: "auto",
        forcedBranch: branch,
        hairStyle: gender === "boy" ? hairs[lv - 1] : hairsG[lv - 1],
        headgear: heads[lv - 1],
        eyeStyle: lv >= 5 ? "eye_cyber" : "eye_normal",
        outfit: outfits[lv - 1],
        weaponRight: wpR[lv - 1],
        weaponLeft: wpL[lv - 1],
        backGear: backs[lv - 1],
        palette: "pal_campus_emerald",
      };
    }

    case "listening": {
      const hairs = ["hair_spiky", "hair_mush", "hair_wolf", "hair_mush", "hair_wolf", "hair_mush", "hair_wolf", "hair_wolf", "hair_brave_crown"];
      const hairsG = ["hair_twintail", "hair_twintail", "hair_odango", "hair_odango", "hair_twintail", "hair_odango", "hair_twintail", "hair_odango", "hair_brave_crown"];
      const heads = ["head_ahoge", "head_headphones", "head_headphones", "head_headphones", "head_headphones", "head_headphones", "head_headphones", "head_laurel", "head_brave_tiara"];
      const outfits = ["outfit_jersey", "outfit_uniform", "outfit_hoodie", "outfit_idol_stage", "outfit_idol_stage", "outfit_idol_stage", "outfit_council_blazer", "outfit_ace_blazer", "outfit_ace_blazer"];
      const wpR = ["wp_none", "wp_speech_mic", "wp_speech_mic", "wp_speech_mic", "wp_speech_mic", "wp_penlight_sabre", "wp_speech_mic", "wp_speech_mic", "wp_brave_pen_caliber"];
      const wpL = ["sub_none", "sub_none", "sub_wireless_earbud", "sub_wireless_earbud", "sub_wireless_earbud", "sub_wireless_earbud", "sub_wireless_earbud", "sub_school_bag", "sub_brave_crest_shield"];
      const backs = ["back_none", "back_none", "back_rucksack", "back_equalizer", "back_equalizer", "back_equalizer", "back_equalizer", "back_brave_cape", "back_brave_cape"];
      return {
        mode: "auto",
        forcedBranch: branch,
        hairStyle: gender === "boy" ? hairs[lv - 1] : hairsG[lv - 1],
        headgear: heads[lv - 1],
        eyeStyle: "eye_sparkle",
        outfit: outfits[lv - 1],
        weaponRight: wpR[lv - 1],
        weaponLeft: wpL[lv - 1],
        backGear: backs[lv - 1],
        palette: "pal_sakura_blossom",
      };
    }

    case "guts": {
      const hairs = ["hair_spiky", "hair_spiky", "hair_allback", "hair_allback", "hair_allback", "hair_flame", "hair_allback", "hair_flame", "hair_brave_crown"];
      const hairsG = ["hair_ponytail", "hair_ponytail", "hair_ponytail", "hair_twintail", "hair_ponytail", "hair_flame", "hair_ponytail", "hair_flame", "hair_brave_crown"];
      const heads = ["head_ahoge", "head_headband", "head_headband", "head_headband", "head_headband", "head_headband", "head_laurel", "head_laurel", "head_brave_tiara"];
      const outfits = ["outfit_jersey", "outfit_uniform", "outfit_sailor_gakuran", "outfit_tuxedo", "outfit_tuxedo", "outfit_tuxedo", "outfit_council_blazer", "outfit_ace_blazer", "outfit_ace_blazer"];
      const wpR = ["wp_none", "wp_pencil_dagger", "wp_megaphone", "wp_megaphone", "wp_megaphone", "wp_megaphone", "wp_megaphone", "wp_e_dict_sabre", "wp_brave_pen_caliber"];
      const wpL = ["sub_none", "sub_none", "sub_speech_notes", "sub_speech_notes", "sub_speech_notes", "sub_speech_notes", "sub_speech_notes", "sub_speech_notes", "sub_brave_crest_shield"];
      const backs = ["back_none", "back_scarf", "back_speech_banner", "back_speech_banner", "back_speech_banner", "back_speech_banner", "back_speech_banner", "back_brave_cape", "back_brave_cape"];
      return {
        mode: "auto",
        forcedBranch: branch,
        hairStyle: gender === "boy" ? hairs[lv - 1] : hairsG[lv - 1],
        headgear: heads[lv - 1],
        eyeStyle: lv >= 5 ? "eye_determined" : "eye_normal",
        outfit: outfits[lv - 1],
        weaponRight: wpR[lv - 1],
        weaponLeft: wpL[lv - 1],
        backGear: backs[lv - 1],
        palette: "pal_crimson_afterschool",
      };
    }

    case "balanced":
    default: {
      const hairs = ["hair_spiky", "hair_spiky", "hair_mush", "hair_spiky", "hair_wolf", "hair_spiky", "hair_center", "hair_flame", "hair_brave_crown"];
      const hairsG = ["hair_bob", "hair_twintail", "hair_twintail", "hair_ponytail", "hair_twintail", "hair_drill", "hair_bob", "hair_twintail", "hair_brave_crown"];
      const heads = ["head_ahoge", "head_ribbon", "head_headphones", "head_glasses", "head_smart_glass", "head_headphones", "head_laurel", "head_laurel", "head_brave_tiara"];
      const outfits = ["outfit_jersey", "outfit_uniform", "outfit_cardigan", "outfit_hoodie", "outfit_council_blazer", "outfit_council_blazer", "outfit_ace_blazer", "outfit_ace_blazer", "outfit_ace_blazer"];
      const wpR = ["wp_none", "wp_pencil_dagger", "wp_pencil_dagger", "wp_speech_mic", "wp_ruler_blade", "wp_laser_pointer", "wp_penlight_sabre", "wp_e_dict_sabre", "wp_brave_pen_caliber"];
      const wpL = ["sub_none", "sub_word_ring", "sub_school_bag", "sub_oxford_dict", "sub_speech_notes", "sub_e_dict_pad", "sub_dual_pen", "sub_school_bag", "sub_brave_crest_shield"];
      const backs = ["back_none", "back_none", "back_rucksack", "back_scarf", "back_shoulder_knit", "back_equalizer", "back_flying_stationery", "back_brave_cape", "back_brave_cape"];
      return {
        mode: "auto",
        forcedBranch: "balanced",
        hairStyle: gender === "boy" ? hairs[lv - 1] : hairsG[lv - 1],
        headgear: heads[lv - 1],
        eyeStyle: lv >= 7 ? "eye_brave" : "eye_normal",
        outfit: outfits[lv - 1],
        weaponRight: wpR[lv - 1],
        weaponLeft: wpL[lv - 1],
        backGear: backs[lv - 1],
        palette: gender === "girl" ? "pal_berry_rose" : "pal_classic_navy",
      };
    }
  }
}

/**
 * 現在の進化段階および系統に応じた肩書きタイトルを取得
 */
export function getCharacterEvolutionTitle(
  gender: CharacterGender,
  stage: number,
  stats?: FiveStats,
  loadout?: CharacterPartLoadout
): { title: string; branch: StatBranchType; branchLabel: string; branchBadge: string } {
  const lvIdx = Math.max(0, Math.min(9, stage - 1));
  const branch = loadout?.forcedBranch || detectStatBranch(stats);
  const info = STAT_BRANCH_INFO[branch] || STAT_BRANCH_INFO.balanced;
  const title =
    gender === "boy"
      ? info.classTitlesBoy[lvIdx]
      : info.classTitlesGirl[lvIdx];
  return {
    title,
    branch,
    branchLabel: info.shortLabel,
    branchBadge: info.badge,
  };
}
