import {
  CharacterGender,
  CharacterPartLoadout,
  FiveStats,
  StatBranchType,
} from "./types";

// =========================================================================
// 1. 髪型 10選（色×カットセット）
// =========================================================================
export interface HairDef {
  id: string;
  name: string;
  badge: string;
  base: string;
  dark: string;
  lite: string;
  type: string;
  unlockLevel: number;
  lxpCost: number;
}

export const GIRL_HAIR_DEFS: HairDef[] = [
  { id: "gh_01", name: "フェアルーン・チェリーボブ", badge: "定番", base: "#D92B3A", dark: "#9E1B28", lite: "#FF7A8A", type: "bob", unlockLevel: 1, lxpCost: 0 },
  { id: "gh_02", name: "ミルクティー・ツインテール", badge: "人気", base: "#C26D2D", dark: "#8A4312", lite: "#E89B58", type: "twintail", unlockLevel: 1, lxpCost: 0 },
  { id: "gh_03", name: "ストロベリー・ハーフアップ", badge: "可憐", base: "#DB2777", dark: "#9D174D", lite: "#F472B6", type: "halfup", unlockLevel: 2, lxpCost: 200 },
  { id: "gh_04", name: "漆黒・サラサラストレートロング", badge: "清楚", base: "#1E293B", dark: "#0F172A", lite: "#475569", type: "long", unlockLevel: 3, lxpCost: 350 },
  { id: "gh_05", name: "ハニーゴールド・ポニーテール", badge: "快活", base: "#D97706", dark: "#92400E", lite: "#FBBF24", type: "ponytail", unlockLevel: 4, lxpCost: 500 },
  { id: "gh_06", name: "プラチナシルバー・ショートウルフ", badge: "クール", base: "#94A3B8", dark: "#64748B", lite: "#E2E8F0", type: "wolf", unlockLevel: 5, lxpCost: 650 },
  { id: "gh_07", name: "ショコラ・お嬢様縦ロール", badge: "気品", base: "#451A03", dark: "#2E1002", lite: "#78350F", type: "drill", unlockLevel: 6, lxpCost: 800 },
  { id: "gh_08", name: "パステルミント・お団子ツイン", badge: "ポップ", base: "#0D9488", dark: "#115E59", lite: "#2DD4BF", type: "odango", unlockLevel: 7, lxpCost: 1000 },
  { id: "gh_09", name: "アメジスト・サイドテール", badge: "知性", base: "#7C3AED", dark: "#5B21B6", lite: "#A78BFA", type: "sidetail", unlockLevel: 8, lxpCost: 1200 },
  { id: "gh_10", name: "サンセット・ゆるふわウェーブ", badge: "華やか", base: "#EA580C", dark: "#9A3412", lite: "#FB923C", type: "wave", unlockLevel: 9, lxpCost: 1500 },
];

export const BOY_HAIR_DEFS: HairDef[] = [
  { id: "bh_01", name: "ショコラ・少年勇者ショート", badge: "定番", base: "#3F2B1D", dark: "#26180E", lite: "#6A4A32", type: "spiky", unlockLevel: 1, lxpCost: 0 },
  { id: "bh_02", name: "スレート・洗練クリーンマッシュ", badge: "今どき", base: "#2D3748", dark: "#1A202C", lite: "#4A5568", type: "mush", unlockLevel: 1, lxpCost: 0 },
  { id: "bh_03", name: "アッシュブロンド・ウルフ", badge: "快活", base: "#CA8A04", dark: "#854D0E", lite: "#FACC15", type: "wolf", unlockLevel: 2, lxpCost: 200 },
  { id: "bh_04", name: "ジェットブラック・ナチュラル分け", badge: "知性", base: "#0F172A", dark: "#020617", lite: "#334155", type: "part", unlockLevel: 3, lxpCost: 350 },
  { id: "bh_05", name: "ロイヤルインディゴ・スパイキー", badge: "エネルギッシュ", base: "#3730A3", dark: "#1E1B4B", lite: "#6366F1", type: "spiky2", unlockLevel: 4, lxpCost: 500 },
  { id: "bh_06", name: "シルバーホワイト・アンニュイマッシュ", badge: "クール", base: "#94A3B8", dark: "#475569", lite: "#F1F5F9", type: "mush2", unlockLevel: 5, lxpCost: 650 },
  { id: "bh_07", name: "クリムゾン・ツーブロック", badge: "情熱", base: "#991B1B", dark: "#450A0A", lite: "#DC2626", type: "undercut", unlockLevel: 6, lxpCost: 800 },
  { id: "bh_08", name: "キャメル・センターパート", badge: "爽やか", base: "#B45309", dark: "#78350F", lite: "#F59E0B", type: "center", unlockLevel: 7, lxpCost: 1000 },
  { id: "bh_09", name: "ダークエメラルド・カーリー", badge: "個性派", base: "#065F46", dark: "#022C22", lite: "#059669", type: "curly", unlockLevel: 8, lxpCost: 1200 },
  { id: "bh_10", name: "ゴールド・覚醒勇者逆毛", badge: "神話", base: "#EAB308", dark: "#A16207", lite: "#FEF08A", type: "crown", unlockLevel: 9, lxpCost: 1500 },
];

// =========================================================================
// 2. 制服 20校（様々な学校の制服）
// =========================================================================
export interface UniformDef {
  id: string;
  name: string;
  schoolName: string;
  badge: string;
  top: string;
  sub: string;
  acc: string;
  bot: string;   // 男子スラックス
  bot_g: string; // 女子スカート
  unlockLevel: number;
  lxpCost: number;
  description: string;
}

export const UNIFORM_DEFS: UniformDef[] = [
  { id: "uni_01", name: "桜台高校（王道ブレザー校）", schoolName: "都立桜台高校", badge: "定番", top: "#1E293B", sub: "#FFFFFF", acc: "#DC2626", bot: "#1E293B", bot_g: "#DC2626", unlockLevel: 1, lxpCost: 0, description: "王道の濃紺ブレザーに赤いチェックスカート＆ネクタイが映える名門校制服。" },
  { id: "uni_02", name: "開智アカデミー（名門進学校）", schoolName: "開智アカデミー高等部", badge: "知性", top: "#475569", sub: "#FFFFFF", acc: "#2563EB", bot: "#334155", bot_g: "#475569", unlockLevel: 1, lxpCost: 0, description: "洗練されたチャコールグレーに知的なブルータイを合わせた進学校スタイル。" },
  { id: "uni_03", name: "聖カトレア学園（伝統セーラー＆漆黒学ラン）", schoolName: "私立聖カトレア学園", badge: "伝統", top: "#0F172A", sub: "#FFFFFF", acc: "#DC2626", bot: "#0F172A", bot_g: "#0F172A", unlockLevel: 2, lxpCost: 200, description: "白襟セーラー服と漆黒の詰襟学ラン。100年の歴史を誇るクラシックスタイル。" },
  { id: "uni_04", name: "セント・オックスフォード（英国風トラッド校）", schoolName: "セント・オックスフォード国際校", badge: "英国風", top: "#D97706", sub: "#FFFFFF", acc: "#059669", bot: "#78350F", bot_g: "#047857", unlockLevel: 2, lxpCost: 200, description: "キャメルブレザーに深緑タータンチェックをあしらった気品あふれる英国調。" },
  { id: "uni_05", name: "自由ヶ丘高校（放課後カーディガン校）", schoolName: "自由ヶ丘学園高校", badge: "人気", top: "#B45309", sub: "#FFFFFF", acc: "#10B981", bot: "#991B1B", bot_g: "#991B1B", unlockLevel: 3, lxpCost: 350, description: "ざっくり羽織ったルーズなキャメルカーディガンと赤チェックスカート。" },
  { id: "uni_06", name: "翔嶺アスリート（スポーツ強豪校）", schoolName: "翔嶺体育大学附属高校", badge: "スポーティ", top: "#1D4ED8", sub: "#FFFFFF", acc: "#FFFFFF", bot: "#1E3A8A", bot_g: "#1D4ED8", unlockLevel: 3, lxpCost: 350, description: "シャープなブルーに白のサイドラインが走る公式アスリートジャージ。" },
  { id: "uni_07", name: "ネオ・アキバ高等工専（電脳サイバー校）", schoolName: "ネオ・アキバ工業高等専門学校", badge: "SF", top: "#1E293B", sub: "#06B6D4", acc: "#22D3EE", bot: "#0F172A", bot_g: "#0F172A", unlockLevel: 4, lxpCost: 500, description: "ダークスーツにネオンシアンの発光ラインが組み込まれたハイテクベスト。" },
  { id: "uni_08", name: "湘南シーサイド（海風爽快マリン校）", schoolName: "湘南シーサイド学園", badge: "爽快", top: "#FFFFFF", sub: "#0284C7", acc: "#0284C7", bot: "#0369A1", bot_g: "#0284C7", unlockLevel: 4, lxpCost: 500, description: "青い海と空をイメージした純白セーラーブレザーとスカイブルータイ。" },
  { id: "uni_09", name: "白百合貴族学院（お嬢様ボルドー校）", schoolName: "私立白百合貴族女学院", badge: "お嬢様", top: "#831843", sub: "#FBCFE8", acc: "#FACC15", bot: "#500724", bot_g: "#831843", unlockLevel: 5, lxpCost: 650, description: "深紅のボルドーワイン生地にゴールドボタンが輝く最高峰のセレブ制服。" },
  { id: "uni_10", name: "アレクサンドリア学園（図書室スカラー校）", schoolName: "大図書館アレクサンドリア学園", badge: "賢者", top: "#312E81", sub: "#E0E7FF", acc: "#C084FC", bot: "#1E1B4B", bot_g: "#312E81", unlockLevel: 5, lxpCost: 650, description: "深い知性を湛えた夜空色のローブ風ブレザーにアメジストタイ。" },
  { id: "uni_11", name: "渋谷ユース（ストリートパーカー校）", schoolName: "渋谷クリエイティブ高等学院", badge: "ストリート", top: "#111827", sub: "#E5E7EB", acc: "#F43F5E", bot: "#374151", bot_g: "#991B1B", unlockLevel: 6, lxpCost: 800, description: "オーバーサイズの漆黒パーカーにネオンピンクのアクセント。" },
  { id: "uni_12", name: "コンセルヴァトワール（芸術音楽校）", schoolName: "帝都音楽芸術高等学院", badge: "芸術", top: "#0D9488", sub: "#CCFBF1", acc: "#F59E0B", bot: "#115E59", bot_g: "#0D9488", unlockLevel: 6, lxpCost: 800, description: "音符エンブレムを胸に宿した、上品なノーカラージャケットスタイル。" },
  { id: "uni_13", name: "神楽坂学園（モダン和風ハイカラ校）", schoolName: "神楽坂モダン高等女学校", badge: "和風", top: "#7F1D1D", sub: "#FEF2F2", acc: "#15803D", bot: "#1E293B", bot_g: "#15803D", unlockLevel: 7, lxpCost: 1000, description: "大正ロマンの書生羽織と深緑の袴をブレザーに融合させたハイカラスタイル。" },
  { id: "uni_14", name: "グリーンヒルズ（自然環境エコ校）", schoolName: "グリーンヒルズ環境アカデミー", badge: "エコ", top: "#15803D", sub: "#FEF3C7", acc: "#EAB308", bot: "#14532D", bot_g: "#15803D", unlockLevel: 7, lxpCost: 1000, description: "豊かな森のフォレストグリーンとクリームイエローの自然派スクール。" },
  { id: "uni_15", name: "常夏サマー（清涼開襟サマー校）", schoolName: "常夏インターナショナルスクール", badge: "夏期", top: "#F8FAFC", sub: "#38BDF8", acc: "#0284C7", bot: "#0284C7", bot_g: "#38BDF8", unlockLevel: 8, lxpCost: 1200, description: "照りつける太陽にも涼やかな開襟サマーシャツと水色スカーフ。" },
  { id: "uni_16", name: "生徒会執行部（純白テーラード特別制服）", schoolName: "全国生徒会連合・特待執行部", badge: "生徒会", top: "#FFFFFF", sub: "#F1F5F9", acc: "#EAB308", bot: "#0F172A", bot_g: "#0F172A", unlockLevel: 8, lxpCost: 1200, description: "選ばれし生徒会幹部のみが袖を通す、黄金肩章つきの純白ジャケット。" },
  { id: "uni_17", name: "ミッドナイトハイスクール（漆黒バイカー校）", schoolName: "深夜特別定時制ミッドナイト高校", badge: "硬派", top: "#000000", sub: "#A855F7", acc: "#C084FC", bot: "#1E1B4B", bot_g: "#581C87", unlockLevel: 9, lxpCost: 1500, description: "ライダース風の漆黒レザージャケットに妖艶なパープルネオン。" },
  { id: "uni_18", name: "エンタメハイスクール（アイドルステージ制服）", schoolName: "帝都エンターテインメント学院", badge: "アイドル", top: "#EC4899", sub: "#FFFFFF", acc: "#FACC15", bot: "#BE185D", bot_g: "#DB2777", unlockLevel: 9, lxpCost: 1500, description: "ステージライトの下で眩しく輝く、チェック柄フリルと星のバッジ。" },
  { id: "uni_19", name: "スノーフェザー学園（冬期ダッフルコート校）", schoolName: "北海道スノーフェザー学院", badge: "冬期", top: "#78350F", sub: "#DC2626", acc: "#FEF08A", bot: "#1E293B", bot_g: "#78350F", unlockLevel: 10, lxpCost: 2000, description: "雪降る通学路を温かく彩る、キャメルダッフルコートと赤チェックマフラー。" },
  { id: "uni_20", name: "万能勇者アカデミー（レジェンド制服）", schoolName: "時空超越・万能勇者アカデミー", badge: "神話", top: "#CA8A04", sub: "#FEF08A", acc: "#DC2626", bot: "#713F12", bot_g: "#CA8A04", unlockLevel: 10, lxpCost: 3000, description: "全教科の壁を越えた伝説の英語勇者DopaEngが纏う、黄金装飾と深紅のマント。" },
];

// =========================================================================
// 3. レベル開放の飾り（ファンタジー進化 5段階）
// =========================================================================
export interface AuraLevelDef {
  level: number;
  name: string;
  badge: string;
  title: string;
  description: string;
}

export const AURA_LEVEL_DEFS: AuraLevelDef[] = [
  { level: 1, name: "自然体（ノーマル）", badge: "Lv.1", title: "爽やか中学生", description: "飾りなし。自然体で爽やかな学園生活スタイル。" },
  { level: 2, name: "英気覚醒（スタディ・スパークル）", badge: "Lv.2", title: "英気覚醒", description: "周囲に淡いきらめきと知性の星屑パーティクルが舞い踊る。" },
  { level: 3, name: "英知解放（マジック・ビット）", badge: "Lv.3", title: "英知解放", description: "頭上に知性の光輪が浮かび、浮遊する魔導書や文具ビットがホバー。" },
  { level: 4, name: "属性共鳴（エレメンタル・オーラ）", badge: "Lv.4", title: "属性共鳴", description: "激しく燃え盛る属性オーラの炎と、背後に交差する光の双剣。" },
  { level: 5, name: "全知超越（ゴッド・ウィング）", badge: "Lv.5", title: "全知共鳴のゴッド", description: "神聖な黄金光輪と、背後に大きく羽ばたく神話の六翼光翼。" },
];

// =========================================================================
// 4. 称号定義（アジト画面などで使用）
// =========================================================================
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
    label: "万能系統（バランス型）",
    shortLabel: "万能型",
    badge: "⚖️ バランス",
    color: "#FACC15",
    description: "全ステータスが均等に成長する万能バランスルート！",
    classTitlesBoy: [
      "寝起きの英語新入生", "単語帳スプリンター", "放課後イングリッシュ", "学園の英語エース", "生徒会スピーチリーダー",
      "学園英語フェニックス", "特待選抜生", "学園選抜・英語ヒーロー", "覚醒・万能マスター", "全知共鳴の英語勇者（ゴッド）"
    ],
    classTitlesGirl: [
      "寝起きの英語新入生", "単語帳スプリンター", "放課後イングリッシュ", "学園の英語エース", "生徒会スピーチリーダー",
      "学園英語フェニックス", "特待選抜生", "学園選抜・英語ヒロイン", "覚醒・万能マスター", "全知共鳴の英語勇者（ゴッド）"
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
      "見習い図書委員", "単語帳マスター", "辞書引きスカラー", "オックスフォード読破生", "学園の生き字引",
      "図書室のアーク賢者", "禁書庫のイングリッシュロード", "語彙力無双のスペシャリスト", "六翼のボキャブラリーセージ", "森羅万象の語彙大賢者"
    ],
    classTitlesGirl: [
      "見習い図書委員", "単語帳マスター", "辞書引きスカラー", "オックスフォード読破生", "学園の生き字引",
      "図書室のアーク賢者", "禁書庫のイングリッシュクイーン", "語彙力無双のスペシャリスト", "六翼のボキャブラリーセージ", "森羅万象の語彙大賢者"
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
      "早口英語の練習生", "即答スラッガー", "シャドーイング走者", "疾風のディベーター", "音速のスピーカー",
      "ストリート・ラッパー", "ライトニング・トーカー", "英語フラッシュマスター", "瞬発神速のライトニング・ロード", "時空超越の光速スピーカー"
    ],
    classTitlesGirl: [
      "早口英語の練習生", "即答スラッガー", "シャドーイング走者", "疾風のディベーター", "音速のスピーカー",
      "ストリート・ラッパー", "ライトニング・トーカー", "英語フラッシュマスター", "瞬発神速のライトニング・クイーン", "時空超越の光速スピーカー"
    ],
  },
  grammar: {
    id: "grammar",
    label: "構築特化系統（鉄壁の構文アーキテクト）",
    shortLabel: "構文パラディン",
    badge: "🛡️ PALADIN",
    color: "#10B981",
    description: "【構築】が突出！長文読解と文法ロジックで強固な要塞を築く構文騎士ルート。",
    classTitlesBoy: [
      "文法パズルの入門生", "構文グラマリアン", "文法チェックキーパー", "鉄壁のセンテンスガード", "英語論理アーキテクト",
      "構文パラディン", "要塞級グラマープライム", "真理を暴く構文マスター", "神託のロジカルロード", "森羅万象の文法守護神"
    ],
    classTitlesGirl: [
      "文法パズルの入門生", "構文グラマリアン", "文法チェックキーパー", "鉄壁のセンテンスガード", "英語論理アーキテクト",
      "構文パラディン", "要塞級グラマープライム", "真理を暴く構文マスター", "神託のロジカルクイーン", "森羅万象の文法守護神"
    ],
  },
  listening: {
    id: "listening",
    label: "聴覚特化系統（音波のリスニングゴッド）",
    shortLabel: "音波ゴッド",
    badge: "🎧 BARD",
    color: "#EC4899",
    description: "【聴覚】が突出！ネイティブの高速英語も一発で聞き分ける音響詩人ルート。",
    classTitlesBoy: [
      "イヤホンリスナー新入生", "ネイティブ耳の予備軍", "発音キャッチビギナー", "音波のリスニングマスター", "スクールDJスピーカー",
      "全方位バイノーラルセージ", "超音速のリスニングロード", "音波超越のエコーマスター", "全知共鳴のリスニングゴッド", "全次元のネイティブ共鳴神"
    ],
    classTitlesGirl: [
      "イヤホンリスナー新入生", "ネイティブ耳の予備軍", "発音キャッチビギナー", "音波のリスニングマスター", "スクールDJスピーカー",
      "全方位バイノーラルセージ", "超音速のリスニングクイーン", "音波超越のエコーマスター", "全知共鳴のリスニングゴッド", "全次元のネイティブ共鳴神"
    ],
  },
  guts: {
    id: "guts",
    label: "度胸特化系統（英語弁論のバーサーカー）",
    shortLabel: "弁論バーサーカー",
    badge: "🔥 BERSERK",
    color: "#EF4444",
    description: "【度胸】が突出！ミスを恐れずパッションと大声で押し通す豪快ルート。",
    classTitlesBoy: [
      "声出しイングリッシュ", "物怖じ知らずのチャレンジャー", "パッション・トーカー", "英語弁論のスピーチファイター", "メガホン・スピーカー",
      "不屈のバーサーカー", "全校集会の大演説家", "度胸無双のイングリッシュライオン", "覇王のパッショングレート", "不滅の英語バーサーカー神"
    ],
    classTitlesGirl: [
      "声出しイングリッシュ", "物怖じ知らずのチャレンジャー", "パッション・トーカー", "英語弁論のスピーチファイター", "メガホン・スピーカー",
      "不屈のバーサーカー", "全校集会の大演説家", "度胸無双のイングリッシュライオン", "覇王のパッショングレート", "不滅の英語バーサーカー神"
    ],
  },
};

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

// =========================================================================
// 5. ロードアウト解決関数（3つの軸を統合）
// =========================================================================
export function resolveEffectiveLoadout(
  gender: CharacterGender,
  level: number,
  loadout?: CharacterPartLoadout
): {
  hair: HairDef;
  uniform: UniformDef;
  auraLevel: number;
} {
  const isGirl = gender === "girl";
  const hairList = isGirl ? GIRL_HAIR_DEFS : BOY_HAIR_DEFS;

  // 1. 髪型
  let hair = hairList[0];
  if (loadout?.hairId) {
    const found = hairList.find((h) => h.id === loadout.hairId);
    if (found) hair = found;
  }

  // 2. 制服
  let uniform = UNIFORM_DEFS[0];
  if (loadout?.uniformId) {
    const found = UNIFORM_DEFS.find((u) => u.id === loadout.uniformId);
    if (found) uniform = found;
  }

  // 3. レベル開放の飾り（1〜5段階）
  // 未設定の場合はキャラクターのレベル（1〜10）に応じて自動決定:
  // Lv.1-2 -> 1, Lv.3-4 -> 2, Lv.5-6 -> 3, Lv.7-8 -> 4, Lv.9-10 -> 5
  let auraLevel = Math.max(1, Math.min(5, Math.ceil(level / 2)));
  if (loadout?.auraLevel && loadout.auraLevel >= 1 && loadout.auraLevel <= 5) {
    auraLevel = loadout.auraLevel;
  }

  return {
    hair,
    uniform,
    auraLevel,
  };
}

// 後方互換用：以前の呼び出しシグネチャ互換
export function resolveAutoLoadout(
  gender: CharacterGender,
  stage: number,
  _branch?: StatBranchType
): CharacterPartLoadout {
  const isGirl = gender === "girl";
  const hairList = isGirl ? GIRL_HAIR_DEFS : BOY_HAIR_DEFS;
  const auraLevel = Math.max(1, Math.min(5, Math.ceil(stage / 2)));
  
  return {
    mode: "auto",
    hairId: hairList[0].id,
    uniformId: UNIFORM_DEFS[0].id,
    auraLevel,
  };
}
