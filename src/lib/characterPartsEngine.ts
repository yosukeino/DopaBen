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
  branchAffinity?: StatBranchType;
}

export interface PaletteColors {
  id: string;
  name: string;
  hairBoy: string;
  hairGirl: string;
  hairHighlight: string;
  primary: string;
  secondary: string;
  accent: string;
  weaponBlade: string;
  weaponGlow: string;
  wingMain: string;
  wingInner: string;
  aura: string;
}

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
    label: "万能バランス系統（王道ヒーロー）",
    shortLabel: "万能王道",
    badge: "⚖️ ALL-ROUND",
    color: "#FACC15",
    description: "5つのステータスをバランス良く鍛えた正統派の王道進化ルート。",
    classTitlesBoy: [
      "寝起きの中学生",
      "単語帳ファイター",
      "放課後ビートランナー",
      "ネオン・スカウター",
      "紅蓮の反逆者",
      "サンダー・ストライカー",
      "黒鉄の怪盗ナイト",
      "二刀流・語彙マスター",
      "紅蓮翼のアークロード",
      "全知全能の語彙神（ゴッド）",
    ],
    classTitlesGirl: [
      "寝起きの中学生",
      "単語帳ヒロイン",
      "放課後ポップスター",
      "サイバー・ガンナー",
      "深紅のファントム",
      "ライトニング・ディーヴァ",
      "白銀の怪盗ヴァルキリー",
      "双剣のエok・ミストレス",
      "紅蓮翼のアーク・ロゼ",
      "全知全能の語彙女神（ゴッデス）",
    ],
  },
  vocab: {
    id: "vocab",
    label: "語彙特化系統（星詠み魔導・大賢者）",
    shortLabel: "語彙・魔導",
    badge: "📖 SAGE",
    color: "#A855F7",
    description: "【語彙】が最も高い時に分岐！古代魔導書と魔導杖を操る大賢者ルート。",
    classTitlesBoy: [
      "見習い図書委員",
      "辞書読みスカラー",
      "ルーンの探求者",
      "アストラル・メイジ",
      "深淵のグリモワール使い",
      "星詠みのアークウィザード",
      "禁書庫のグランドメイジ",
      "次元魔導のロード",
      "六翼のクロノ・セージ",
      "森羅万象の語彙大賢者",
    ],
    classTitlesGirl: [
      "見習い図書委員",
      "辞書読みウィッチ",
      "ルーンの魔法少女",
      "アストラル・ソーサレス",
      "深淵のグリモワール姫",
      "星詠みのアークウィッチ",
      "禁書庫のグランドメイジ",
      "次元魔導のクイーン",
      "六翼のクロノ・オラクル",
      "森羅万象の語彙大女神",
    ],
  },
  speed: {
    id: "speed",
    label: "瞬発特化系統（疾風・神速シノビ）",
    shortLabel: "瞬発・神速",
    badge: "⚡ SHINOBI",
    color: "#06B6D4",
    description: "【瞬発】が最も高い時に分岐！二刀流と神速ブレードで斬り裂く忍者・剣豪ルート。",
    classTitlesBoy: [
      "俊足の駆け出し生",
      "疾風のランナー",
      "ストリート・ブレード",
      "サイバー・ニンジャ",
      "紫電の抜刀剣士",
      "音速の二刀流シノビ",
      "闇夜のファントム・エッジ",
      "神速の剣聖（ソードマスター）",
      "雷神の双刃アーク",
      "時空超越の光速剣神",
    ],
    classTitlesGirl: [
      "俊足の駆け出し生",
      "疾風のガール",
      "ストリート・くノ一",
      "サイバー・アサシン",
      "紫電の抜刀乙女",
      "音速の二刀流くノ一",
      "闇夜のファントム・ダンサー",
      "神速の剣姫（ブレードプリンセス）",
      "雷神の双刃ヴァルキリー",
      "時空超越の光速剣女神",
    ],
  },
  grammar: {
    id: "grammar",
    label: "構築特化系統（機巧・聖騎士パラディン）",
    shortLabel: "構築・聖騎士",
    badge: "🛡️ PALADIN",
    color: "#10B981",
    description: "【構築】が最も高い時に分岐！聖盾イージスと重装アーマーを纏う聖騎士ルート。",
    classTitlesBoy: [
      "パズル好きの生徒",
      "構文ビルダー",
      "アイアン・ディフェンダー",
      "機巧アーキテクト",
      "翡翠のクルセイダー",
      "黄金盾のガーディアン",
      "白銀のホーリーナイト",
      "不落のイージス・ロード",
      "熾天使ウイング・パラディン",
      "絶対秩序の創世聖騎士神",
    ],
    classTitlesGirl: [
      "パズル好きの生徒",
      "構文ビルダー",
      "アイアン・シールド娘",
      "機巧アーキテクト",
      "翡翠のジャンヌ",
      "黄金盾のガーディアン",
      "白銀のホーリーヴァルキリー",
      "不落のイージス・クイーン",
      "熾天使ウイング・セラフィム",
      "絶対秩序の創世聖騎士女神",
    ],
  },
  listening: {
    id: "listening",
    label: "聴覚特化系統（音撃・サイバーファントム）",
    shortLabel: "聴覚・音撃",
    badge: "🎧 SONIC",
    color: "#EC4899",
    description: "【聴覚】が最も高い時に分岐！音波ウイングとネオンヘッドホンで共鳴する音撃ルート。",
    classTitlesBoy: [
      "音楽好きの生徒",
      "ビート・リスナー",
      "ネオンDJ・ハッカー",
      "ソニック・ガンナー",
      "共鳴のファントム・スター",
      "オーバードライブ・ロッカー",
      "電脳イコライザー・ナイト",
      "超音撃のシンフォニー・ロード",
      "極彩音波のアーク・スター",
      "宇宙共鳴のサウンドゴッド",
    ],
    classTitlesGirl: [
      "音楽好きの生徒",
      "ビート・リスナー",
      "ネオンDJ・ディーヴァ",
      "ソニック・アイドル",
      "共鳴のファントム・ミューズ",
      "オーバードライブ・歌姫",
      "電脳イコライザー・クイーン",
      "超音撃のシンフォニー・姫",
      "極彩音波のアーク・ディーヴァ",
      "宇宙共鳴のサウンドゴッデス",
    ],
  },
  guts: {
    id: "guts",
    label: "度胸特化系統（紅蓮・倍返し覇王）",
    shortLabel: "度胸・覇王",
    badge: "🔥 OVERLORD",
    color: "#EF4444",
    description: "【度胸】が最も高い時に分岐！逆境を力に変える大剣と紅蓮の翼を持つ覇王ルート。",
    classTitlesBoy: [
      "不屈のチャレンジャー",
      "リベンジ・ファイター",
      "紅蓮のストリート番長",
      "ブレイズ・グラディエーター",
      "業火のバーサーカー",
      "断罪大剣のデストロイヤー",
      "黒炎の魔王（ダークロード）",
      "不死鳥のクリムゾン・オウガ",
      "紅蓮竜翼のオーバーロード",
      "逆転無双の紅蓮覇王神",
    ],
    classTitlesGirl: [
      "不屈のチャレンジャー",
      "リベンジ・ガール",
      "紅蓮のストリート姉御",
      "ブレイズ・グラディエーター",
      "業火のバーサーカー姫",
      "断罪大剣のヴァルキリー",
      "黒炎の魔王姫（ダーククイーン）",
      "不死鳥のクリムゾン・ロゼ",
      "紅蓮竜翼のオーバーロード",
      "逆転無双の紅蓮覇王女神",
    ],
  },
};

export const HAIR_STYLES: PartItemDef[] = [
  { id: "hair_spiky", slot: "hairStyle", name: "ツンツンヒーロー", badge: "定番", unlockLevel: 1, lxpCost: 0 },
  { id: "hair_bob", slot: "hairStyle", name: "ふんわりショートボブ", badge: "定番", unlockLevel: 1, lxpCost: 0 },
  { id: "hair_twintail", slot: "hairStyle", name: "王道ツインテール", badge: "人気", unlockLevel: 1, lxpCost: 0 },
  { id: "hair_wolf", slot: "hairStyle", name: "クールウルフ", badge: "Lv.2", unlockLevel: 2, lxpCost: 300 },
  { id: "hair_ponytail", slot: "hairStyle", name: "疾風ポニーテール", badge: "瞬発", unlockLevel: 2, lxpCost: 300, branchAffinity: "speed" },
  { id: "hair_cyber_mesh", slot: "hairStyle", name: "ネオンアシメバング", badge: "聴覚", unlockLevel: 3, lxpCost: 600, branchAffinity: "listening" },
  { id: "hair_drill", slot: "hairStyle", name: "お嬢様ツイン縦ロール", badge: "構築", unlockLevel: 4, lxpCost: 800, branchAffinity: "grammar" },
  { id: "hair_samurai", slot: "hairStyle", name: "剣豪サムライ結い", badge: "瞬発", unlockLevel: 5, lxpCost: 1200, branchAffinity: "speed" },
  { id: "hair_long_sage", slot: "hairStyle", name: "星詠み大賢者ロング", badge: "語彙", unlockLevel: 5, lxpCost: 1200, branchAffinity: "vocab" },
  { id: "hair_odango", slot: "hairStyle", name: "ネオ中華お団子ツイン", badge: "Lv.6", unlockLevel: 6, lxpCost: 1800 },
  { id: "hair_wild_flame", slot: "hairStyle", name: "紅蓮バーサーカー逆毛", badge: "度胸", unlockLevel: 7, lxpCost: 2500, branchAffinity: "guts" },
  { id: "hair_god_aura", slot: "hairStyle", name: "超覚醒・神逆立ちヘア", badge: "Lv.10", unlockLevel: 10, lxpCost: 5000 },
];

export const HEADGEAR_PARTS: PartItemDef[] = [
  { id: "head_none", slot: "headgear", name: "なし（素頭）", badge: "定番", unlockLevel: 1, lxpCost: 0 },
  { id: "head_ahoge", slot: "headgear", name: "寝癖ピョコ毛", badge: "Lv.1", unlockLevel: 1, lxpCost: 0 },
  { id: "head_ribbon", slot: "headgear", name: "ツインリボン飾り", badge: "Lv.2", unlockLevel: 2, lxpCost: 200 },
  { id: "head_glasses", slot: "headgear", name: "知略のインテリ眼鏡", badge: "語彙", unlockLevel: 2, lxpCost: 400, branchAffinity: "vocab" },
  { id: "head_headphones", slot: "headgear", name: "ネオンヘッドホン", badge: "聴覚", unlockLevel: 3, lxpCost: 600, branchAffinity: "listening" },
  { id: "head_ninja_band", slot: "headgear", name: "疾風の忍額当て", badge: "瞬発", unlockLevel: 3, lxpCost: 600, branchAffinity: "speed" },
  { id: "head_visor", slot: "headgear", name: "サイバースカウター", badge: "Lv.4", unlockLevel: 4, lxpCost: 900 },
  { id: "head_phantom_mask", slot: "headgear", name: "怪盗ファントムマスク", badge: "Lv.5", unlockLevel: 5, lxpCost: 1400 },
  { id: "head_wizard_hat", slot: "headgear", name: "星詠み魔導クラウン", badge: "語彙", unlockLevel: 6, lxpCost: 2000, branchAffinity: "vocab" },
  { id: "head_valkyrie_helm", slot: "headgear", name: "聖騎士ヴァルキリー翼冠", badge: "構築", unlockLevel: 7, lxpCost: 2800, branchAffinity: "grammar" },
  { id: "head_demon_horns", slot: "headgear", name: "紅蓮覇王の龍角", badge: "度胸", unlockLevel: 8, lxpCost: 3600, branchAffinity: "guts" },
  { id: "head_god_crown", slot: "headgear", name: "語彙神の黄金王冠＆光輪", badge: "Lv.10", unlockLevel: 10, lxpCost: 6000 },
];

export const EYE_STYLES: PartItemDef[] = [
  { id: "eye_normal", slot: "eyeStyle", name: "スタンダード瞳", badge: "定番", unlockLevel: 1, lxpCost: 0 },
  { id: "eye_determined", slot: "eyeStyle", name: "熱血キリッ目", badge: "度胸", unlockLevel: 2, lxpCost: 300, branchAffinity: "guts" },
  { id: "eye_cool", slot: "eyeStyle", name: "クールジト目", badge: "語彙", unlockLevel: 3, lxpCost: 500, branchAffinity: "vocab" },
  { id: "eye_sparkle", slot: "eyeStyle", name: "キラ星アイドル瞳", badge: "聴覚", unlockLevel: 4, lxpCost: 800, branchAffinity: "listening" },
  { id: "eye_cyber", slot: "eyeStyle", name: "電脳レーザーアイ", badge: "構築", unlockLevel: 5, lxpCost: 1200, branchAffinity: "grammar" },
  { id: "eye_oddeye", slot: "eyeStyle", name: "覚醒オッドアイ(紅×蒼)", badge: "Lv.6", unlockLevel: 6, lxpCost: 1800 },
  { id: "eye_crimson", slot: "eyeStyle", name: "紅蓮の覇王眼", badge: "度胸", unlockLevel: 8, lxpCost: 3000, branchAffinity: "guts" },
  { id: "eye_god", slot: "eyeStyle", name: "全知の黄金神眼", badge: "Lv.10", unlockLevel: 10, lxpCost: 5000 },
];

export const OUTFIT_PARTS: PartItemDef[] = [
  { id: "outfit_jersey", slot: "outfit", name: "部屋着ジャージ", badge: "Lv.1", unlockLevel: 1, lxpCost: 0 },
  { id: "outfit_uniform", slot: "outfit", name: "学園ブレザー制服", badge: "Lv.2", unlockLevel: 2, lxpCost: 300 },
  { id: "outfit_hoodie", slot: "outfit", name: "ストリートパーカー", badge: "Lv.3", unlockLevel: 3, lxpCost: 600 },
  { id: "outfit_cyber", slot: "outfit", name: "ネオンサイバースーツ", badge: "Lv.4", unlockLevel: 4, lxpCost: 1000 },
  { id: "outfit_phantom", slot: "outfit", name: "怪盗ロングコート", badge: "Lv.5", unlockLevel: 5, lxpCost: 1500 },
  { id: "outfit_shinobi", slot: "outfit", name: "神速の闇忍装束", badge: "瞬発", unlockLevel: 5, lxpCost: 1600, branchAffinity: "speed" },
  { id: "outfit_sage", slot: "outfit", name: "星詠み大魔導ローブ", badge: "語彙", unlockLevel: 6, lxpCost: 2200, branchAffinity: "vocab" },
  { id: "outfit_idol_rock", slot: "outfit", name: "超音撃ステージ衣装", badge: "聴覚", unlockLevel: 6, lxpCost: 2200, branchAffinity: "listening" },
  { id: "outfit_paladin", slot: "outfit", name: "白銀の聖騎士アーマー", badge: "構築", unlockLevel: 7, lxpCost: 3000, branchAffinity: "grammar" },
  { id: "outfit_berserker", slot: "outfit", name: "黒炎の狂戦士メイル", badge: "度胸", unlockLevel: 8, lxpCost: 3800, branchAffinity: "guts" },
  { id: "outfit_overlord", slot: "outfit", name: "アークロード覇王鎧", badge: "Lv.9", unlockLevel: 9, lxpCost: 4800 },
  { id: "outfit_god", slot: "outfit", name: "語彙神の黄金神衣", badge: "Lv.10", unlockLevel: 10, lxpCost: 6500 },
];

export const WEAPON_RIGHT_PARTS: PartItemDef[] = [
  { id: "wp_none", slot: "weaponRight", name: "なし（素手）", badge: "Lv.1", unlockLevel: 1, lxpCost: 0 },
  { id: "wp_pencil_dagger", slot: "weaponRight", name: "必勝ペンシルダガー", badge: "Lv.2", unlockLevel: 2, lxpCost: 300 },
  { id: "wp_katana", slot: "weaponRight", name: "名刀・紫電ブレード", badge: "瞬発", unlockLevel: 4, lxpCost: 900, branchAffinity: "speed" },
  { id: "wp_sonic_mic", slot: "weaponRight", name: "超音撃マイクランス", badge: "聴覚", unlockLevel: 4, lxpCost: 900, branchAffinity: "listening" },
  { id: "wp_arcane_staff", slot: "weaponRight", name: "星結晶の魔導杖", badge: "語彙", unlockLevel: 5, lxpCost: 1400, branchAffinity: "vocab" },
  { id: "wp_laser_sabre", slot: "weaponRight", name: "ネオンプラズマセイバー", badge: "Lv.5", unlockLevel: 5, lxpCost: 1400 },
  { id: "wp_greatsword", slot: "weaponRight", name: "聖騎士の白銀大剣", badge: "構築", unlockLevel: 6, lxpCost: 2200, branchAffinity: "grammar" },
  { id: "wp_thunder_spear", slot: "weaponRight", name: "雷神の稲妻スピア", badge: "Lv.6", unlockLevel: 6, lxpCost: 2200 },
  { id: "wp_shuriken_chakram", slot: "weaponRight", name: "巨大風魔チャクラム", badge: "瞬発", unlockLevel: 7, lxpCost: 3000, branchAffinity: "speed" },
  { id: "wp_demon_buster", slot: "weaponRight", name: "紅蓮の断罪バスター剣", badge: "度胸", unlockLevel: 8, lxpCost: 3800, branchAffinity: "guts" },
  { id: "wp_scythe", slot: "weaponRight", name: "紅蓮死神の大鎌", badge: "Lv.9", unlockLevel: 9, lxpCost: 4800 },
  { id: "wp_excalibur", slot: "weaponRight", name: "神剣エクスカリバーΩ", badge: "Lv.10", unlockLevel: 10, lxpCost: 6500 },
];

export const WEAPON_LEFT_PARTS: PartItemDef[] = [
  { id: "sub_none", slot: "weaponLeft", name: "なし", badge: "定番", unlockLevel: 1, lxpCost: 0 },
  { id: "sub_note_shield", slot: "weaponLeft", name: "必勝単語帳ボード", badge: "Lv.2", unlockLevel: 2, lxpCost: 300 },
  { id: "sub_grimoire", slot: "weaponLeft", name: "浮遊する古代魔導書", badge: "語彙", unlockLevel: 4, lxpCost: 900, branchAffinity: "vocab" },
  { id: "sub_sonic_amp", slot: "weaponLeft", name: "重低音スピーカー宝珠", badge: "聴覚", unlockLevel: 4, lxpCost: 900, branchAffinity: "listening" },
  { id: "sub_aegis_shield", slot: "weaponLeft", name: "聖盾イージス", badge: "構築", unlockLevel: 5, lxpCost: 1500, branchAffinity: "grammar" },
  { id: "sub_dual_kodachi", slot: "weaponLeft", name: "逆手・二刀流小太刀", badge: "瞬発", unlockLevel: 6, lxpCost: 2200, branchAffinity: "speed" },
  { id: "sub_cyber_drone", slot: "weaponLeft", name: "電脳ビットドローン", badge: "Lv.7", unlockLevel: 7, lxpCost: 2800 },
  { id: "sub_dragon_claw", slot: "weaponLeft", name: "紅蓮の竜爪ガントレット", badge: "度胸", unlockLevel: 8, lxpCost: 3600, branchAffinity: "guts" },
  { id: "sub_dual_laser", slot: "weaponLeft", name: "二刀流・紅蓮レーザー刃", badge: "Lv.8", unlockLevel: 8, lxpCost: 3600 },
  { id: "sub_god_orb", slot: "weaponLeft", name: "森羅万象の黄金宝珠", badge: "Lv.10", unlockLevel: 10, lxpCost: 6000 },
];

export const BACK_GEAR_PARTS: PartItemDef[] = [
  { id: "back_none", slot: "backGear", name: "なし", badge: "Lv.1", unlockLevel: 1, lxpCost: 0 },
  { id: "back_scarf", slot: "backGear", name: "なびく疾風マフラー", badge: "瞬発", unlockLevel: 3, lxpCost: 600, branchAffinity: "speed" },
  { id: "back_cape", slot: "backGear", name: "怪盗の深紅マント", badge: "Lv.5", unlockLevel: 5, lxpCost: 1400 },
  { id: "back_thruster", slot: "backGear", name: "サイバーウイング推進器", badge: "構築", unlockLevel: 5, lxpCost: 1500, branchAffinity: "grammar" },
  { id: "back_equalizer", slot: "backGear", name: "ネオン音波イコライザー翼", badge: "聴覚", unlockLevel: 6, lxpCost: 2200, branchAffinity: "listening" },
  { id: "back_thunder_drums", slot: "backGear", name: "雷神の背面雷鼓リング", badge: "Lv.6", unlockLevel: 6, lxpCost: 2200 },
  { id: "back_floating_swords", slot: "backGear", name: "無限展開・浮遊剣陣", badge: "瞬発", unlockLevel: 7, lxpCost: 3000, branchAffinity: "speed" },
  { id: "back_angel_wings", slot: "backGear", name: "純白の熾天使ウイング", badge: "構築", unlockLevel: 8, lxpCost: 3800, branchAffinity: "grammar" },
  { id: "back_demon_wings", slot: "backGear", name: "闇夜の悪魔ウイング", badge: "度胸", unlockLevel: 8, lxpCost: 3800, branchAffinity: "guts" },
  { id: "back_nine_tails", slot: "backGear", name: "神秘の九尾狐オーラ", badge: "語彙", unlockLevel: 9, lxpCost: 4800, branchAffinity: "vocab" },
  { id: "back_crimson_wings", slot: "backGear", name: "紅蓮のアークドラゴン翼", badge: "Lv.9", unlockLevel: 9, lxpCost: 4800 },
  { id: "back_seraphim_gold", slot: "backGear", name: "黄金六枚翼・セラフィム", badge: "Lv.10", unlockLevel: 10, lxpCost: 6500 },
];

export const COLOR_PALETTES: PaletteColors[] = [
  {
    id: "pal_stage_default",
    name: "進化段階デフォルト",
    hairBoy: "#2A2421",
    hairGirl: "#5C3A21",
    hairHighlight: "#FACC15",
    primary: "#1E293B",
    secondary: "#0F172A",
    accent: "#EF4444",
    weaponBlade: "#00F0FF",
    weaponGlow: "#FFFFFF",
    wingMain: "#EF4444",
    wingInner: "#FACC15",
    aura: "#FACC15",
  },
  {
    id: "pal_vocab_arcane",
    name: "語彙の蒼紫 (Arcane Sage)",
    hairBoy: "#312E81",
    hairGirl: "#6D28D9",
    hairHighlight: "#C084FC",
    primary: "#2E1065",
    secondary: "#1E1B4B",
    accent: "#C084FC",
    weaponBlade: "#A855F7",
    weaponGlow: "#F3E8FF",
    wingMain: "#7C3AED",
    wingInner: "#E9D5FF",
    aura: "#A855F7",
  },
  {
    id: "pal_speed_volt",
    name: "瞬発の紫電 (Volt Shinobi)",
    hairBoy: "#0F766E",
    hairGirl: "#0284C7",
    hairHighlight: "#22D3EE",
    primary: "#0F172A",
    secondary: "#1E293B",
    accent: "#22D3EE",
    weaponBlade: "#00F0FF",
    weaponGlow: "#ECFEFF",
    wingMain: "#06B6D4",
    wingInner: "#FACC15",
    aura: "#06B6D4",
  },
  {
    id: "pal_grammar_emerald",
    name: "構築の聖翠 (Emerald Paladin)",
    hairBoy: "#065F46",
    hairGirl: "#10B981",
    hairHighlight: "#6EE7B7",
    primary: "#F8FAFC",
    secondary: "#064E3B",
    accent: "#10B981",
    weaponBlade: "#34D399",
    weaponGlow: "#FFFFFF",
    wingMain: "#10B981",
    wingInner: "#FEF08A",
    aura: "#10B981",
  },
  {
    id: "pal_listening_neon",
    name: "聴覚の極彩 (Sonic Neon)",
    hairBoy: "#BE185D",
    hairGirl: "#EC4899",
    hairHighlight: "#F472B6",
    primary: "#18181B",
    secondary: "#500724",
    accent: "#EC4899",
    weaponBlade: "#F43F5E",
    weaponGlow: "#22D3EE",
    wingMain: "#EC4899",
    wingInner: "#22D3EE",
    aura: "#EC4899",
  },
  {
    id: "pal_guts_crimson",
    name: "度胸の紅蓮 (Crimson Overlord)",
    hairBoy: "#991B1B",
    hairGirl: "#DC2626",
    hairHighlight: "#FACC15",
    primary: "#450A0A",
    secondary: "#111827",
    accent: "#EF4444",
    weaponBlade: "#EF4444",
    weaponGlow: "#FACC15",
    wingMain: "#DC2626",
    wingInner: "#FACC15",
    aura: "#EF4444",
  },
  {
    id: "pal_phantom_thief",
    name: "怪盗ノクターン (Phantom Red)",
    hairBoy: "#111827",
    hairGirl: "#1F2937",
    hairHighlight: "#EF4444",
    primary: "#090D16",
    secondary: "#1E293B",
    accent: "#E60012",
    weaponBlade: "#E60012",
    weaponGlow: "#FFFFFF",
    wingMain: "#991B1B",
    wingInner: "#111827",
    aura: "#E60012",
  },
  {
    id: "pal_sakura_blossom",
    name: "桜吹雪 (Sakura Blossom)",
    hairBoy: "#F472B6",
    hairGirl: "#FB7185",
    hairHighlight: "#FFE4E6",
    primary: "#831843",
    secondary: "#500724",
    accent: "#FBBF24",
    weaponBlade: "#FDA4AF",
    weaponGlow: "#FFFFFF",
    wingMain: "#F472B6",
    wingInner: "#FFFFFF",
    aura: "#F472B6",
  },
  {
    id: "pal_silver_valkyrie",
    name: "白銀ヴァルキリー (Platinum)",
    hairBoy: "#E2E8F0",
    hairGirl: "#F1F5F9",
    hairHighlight: "#38BDF8",
    primary: "#334155",
    secondary: "#0F172A",
    accent: "#38BDF8",
    weaponBlade: "#7DD3FC",
    weaponGlow: "#FFFFFF",
    wingMain: "#E2E8F0",
    wingInner: "#38BDF8",
    aura: "#38BDF8",
  },
  {
    id: "pal_god_gold",
    name: "語彙神の黄金 (Supreme Gold)",
    hairBoy: "#FFE600",
    hairGirl: "#FFF04D",
    hairHighlight: "#FFFFFF",
    primary: "#FFFFFF",
    secondary: "#99000C",
    accent: "#FFE600",
    weaponBlade: "#FFE600",
    weaponGlow: "#FFFFFF",
    wingMain: "#FFE600",
    wingInner: "#FFFFFF",
    aura: "#FFE600",
  },
];

export const PALETTE_PART_DEFS: PartItemDef[] = COLOR_PALETTES.map((p, idx) => ({
  id: p.id,
  slot: "palette",
  name: p.name,
  badge: idx === 0 ? "定番" : idx <= 5 ? "系統色" : `Lv.${Math.min(10, idx)}`,
  unlockLevel: idx <= 5 ? 1 : Math.min(10, idx),
  lxpCost: idx <= 5 ? 0 : idx * 350,
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
 * - 最も高いステータスが2位より2ポイント以上高い場合、その特化系統へ分岐！
 * - 拮抗している場合は王道の「balanced」系統へ進化
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

  // 初期状態近く、またはトップと最小の差が小さい場合はバランス型
  if (entries[0].val <= 20 || entries[0].val - entries[4].val < 3) {
    return "balanced";
  }
  return entries[0].key;
}

/**
 * 性別 × レベル(1〜10) × 進化系統(6系統) から、全120パターンの公式進化ロードアウトを生成するアルゴリズム
 */
export function resolveAutoLoadout(
  gender: CharacterGender,
  stage: number,
  branch: StatBranchType
): CharacterPartLoadout {
  const lv = Math.max(1, Math.min(10, stage));

  // Lv.10 はどの系統でも神格化パーツをまとった究極形態へ到達（系統ごとの武器・カラー特徴は維持）
  if (lv === 10) {
    const lv10WeaponMap: Record<StatBranchType, string> = {
      balanced: "wp_excalibur",
      vocab: "wp_arcane_staff",
      speed: "wp_excalibur",
      grammar: "wp_excalibur",
      listening: "wp_sonic_mic",
      guts: "wp_demon_buster",
    };
    const lv10SubMap: Record<StatBranchType, string> = {
      balanced: "sub_god_orb",
      vocab: "sub_grimoire",
      speed: "sub_dual_laser",
      grammar: "sub_aegis_shield",
      listening: "sub_god_orb",
      guts: "sub_dragon_claw",
    };
    return {
      mode: "auto",
      forcedBranch: branch,
      hairStyle: gender === "boy" ? "hair_god_aura" : "hair_drill",
      headgear: "head_god_crown",
      eyeStyle: "eye_god",
      outfit: "outfit_god",
      weaponRight: lv10WeaponMap[branch],
      weaponLeft: lv10SubMap[branch],
      backGear: "back_seraphim_gold",
      palette: "pal_god_gold",
    };
  }

  // 系統別の段階進化テーブル (Lv.1〜Lv.9)
  switch (branch) {
    case "vocab": {
      const hairsBoy = ["hair_spiky", "hair_wolf", "hair_wolf", "hair_long_sage", "hair_long_sage", "hair_long_sage", "hair_long_sage", "hair_long_sage", "hair_god_aura"];
      const hairsGirl = ["hair_bob", "hair_bob", "hair_long_sage", "hair_long_sage", "hair_drill", "hair_drill", "hair_long_sage", "hair_drill", "hair_long_sage"];
      const heads = ["head_ahoge", "head_glasses", "head_glasses", "head_glasses", "head_wizard_hat", "head_wizard_hat", "head_wizard_hat", "head_wizard_hat", "head_god_crown"];
      const outfits = ["outfit_jersey", "outfit_uniform", "outfit_uniform", "outfit_sage", "outfit_sage", "outfit_sage", "outfit_sage", "outfit_overlord", "outfit_overlord"];
      const wpR = ["wp_none", "wp_pencil_dagger", "wp_pencil_dagger", "wp_arcane_staff", "wp_arcane_staff", "wp_arcane_staff", "wp_arcane_staff", "wp_arcane_staff", "wp_excalibur"];
      const wpL = ["sub_none", "sub_note_shield", "sub_grimoire", "sub_grimoire", "sub_grimoire", "sub_grimoire", "sub_cyber_drone", "sub_god_orb", "sub_god_orb"];
      const backs = ["back_none", "back_none", "back_none", "back_cape", "back_cape", "back_floating_swords", "back_nine_tails", "back_nine_tails", "back_nine_tails"];
      return {
        mode: "auto",
        forcedBranch: branch,
        hairStyle: gender === "boy" ? hairsBoy[lv - 1] : hairsGirl[lv - 1],
        headgear: heads[lv - 1],
        eyeStyle: lv >= 6 ? "eye_oddeye" : "eye_cool",
        outfit: outfits[lv - 1],
        weaponRight: wpR[lv - 1],
        weaponLeft: wpL[lv - 1],
        backGear: backs[lv - 1],
        palette: "pal_vocab_arcane",
      };
    }

    case "speed": {
      const hairsBoy = ["hair_spiky", "hair_spiky", "hair_wolf", "hair_wolf", "hair_samurai", "hair_samurai", "hair_samurai", "hair_wild_flame", "hair_god_aura"];
      const hairsGirl = ["hair_ponytail", "hair_ponytail", "hair_ponytail", "hair_twintail", "hair_ponytail", "hair_odango", "hair_ponytail", "hair_ponytail", "hair_twintail"];
      const heads = ["head_ahoge", "head_ninja_band", "head_ninja_band", "head_visor", "head_ninja_band", "head_phantom_mask", "head_phantom_mask", "head_valkyrie_helm", "head_valkyrie_helm"];
      const outfits = ["outfit_jersey", "outfit_hoodie", "outfit_shinobi", "outfit_shinobi", "outfit_shinobi", "outfit_shinobi", "outfit_phantom", "outfit_shinobi", "outfit_overlord"];
      const wpR = ["wp_none", "wp_pencil_dagger", "wp_katana", "wp_katana", "wp_katana", "wp_katana", "wp_shuriken_chakram", "wp_katana", "wp_excalibur"];
      const wpL = ["sub_none", "sub_none", "sub_none", "sub_dual_kodachi", "sub_dual_kodachi", "sub_dual_kodachi", "sub_dual_kodachi", "sub_dual_laser", "sub_dual_laser"];
      const backs = ["back_none", "back_scarf", "back_scarf", "back_scarf", "back_thruster", "back_floating_swords", "back_floating_swords", "back_floating_swords", "back_seraphim_gold"];
      return {
        mode: "auto",
        forcedBranch: branch,
        hairStyle: gender === "boy" ? hairsBoy[lv - 1] : hairsGirl[lv - 1],
        headgear: heads[lv - 1],
        eyeStyle: lv >= 6 ? "eye_cyber" : "eye_determined",
        outfit: outfits[lv - 1],
        weaponRight: wpR[lv - 1],
        weaponLeft: wpL[lv - 1],
        backGear: backs[lv - 1],
        palette: "pal_speed_volt",
      };
    }

    case "grammar": {
      const hairsBoy = ["hair_spiky", "hair_wolf", "hair_wolf", "hair_cyber_mesh", "hair_samurai", "hair_wolf", "hair_long_sage", "hair_samurai", "hair_god_aura"];
      const hairsGirl = ["hair_bob", "hair_twintail", "hair_drill", "hair_drill", "hair_drill", "hair_long_sage", "hair_drill", "hair_long_sage", "hair_drill"];
      const heads = ["head_ahoge", "head_ribbon", "head_visor", "head_visor", "head_valkyrie_helm", "head_valkyrie_helm", "head_valkyrie_helm", "head_valkyrie_helm", "head_god_crown"];
      const outfits = ["outfit_jersey", "outfit_uniform", "outfit_cyber", "outfit_cyber", "outfit_paladin", "outfit_paladin", "outfit_paladin", "outfit_paladin", "outfit_god"];
      const wpR = ["wp_none", "wp_pencil_dagger", "wp_laser_sabre", "wp_laser_sabre", "wp_greatsword", "wp_greatsword", "wp_thunder_spear", "wp_greatsword", "wp_excalibur"];
      const wpL = ["sub_none", "sub_note_shield", "sub_note_shield", "sub_aegis_shield", "sub_aegis_shield", "sub_aegis_shield", "sub_aegis_shield", "sub_aegis_shield", "sub_aegis_shield"];
      const backs = ["back_none", "back_none", "back_thruster", "back_thruster", "back_cape", "back_thruster", "back_angel_wings", "back_angel_wings", "back_seraphim_gold"];
      return {
        mode: "auto",
        forcedBranch: branch,
        hairStyle: gender === "boy" ? hairsBoy[lv - 1] : hairsGirl[lv - 1],
        headgear: heads[lv - 1],
        eyeStyle: lv >= 5 ? "eye_cyber" : "eye_normal",
        outfit: outfits[lv - 1],
        weaponRight: wpR[lv - 1],
        weaponLeft: wpL[lv - 1],
        backGear: backs[lv - 1],
        palette: "pal_grammar_emerald",
      };
    }

    case "listening": {
      const hairsBoy = ["hair_spiky", "hair_cyber_mesh", "hair_cyber_mesh", "hair_cyber_mesh", "hair_wolf", "hair_cyber_mesh", "hair_wild_flame", "hair_cyber_mesh", "hair_god_aura"];
      const hairsGirl = ["hair_twintail", "hair_twintail", "hair_cyber_mesh", "hair_odango", "hair_twintail", "hair_odango", "hair_twintail", "hair_drill", "hair_twintail"];
      const heads = ["head_ahoge", "head_headphones", "head_headphones", "head_headphones", "head_headphones", "head_visor", "head_headphones", "head_headphones", "head_god_crown"];
      const outfits = ["outfit_jersey", "outfit_hoodie", "outfit_hoodie", "outfit_idol_rock", "outfit_idol_rock", "outfit_idol_rock", "outfit_cyber", "outfit_idol_rock", "outfit_overlord"];
      const wpR = ["wp_none", "wp_sonic_mic", "wp_sonic_mic", "wp_sonic_mic", "wp_sonic_mic", "wp_laser_sabre", "wp_sonic_mic", "wp_sonic_mic", "wp_excalibur"];
      const wpL = ["sub_none", "sub_none", "sub_sonic_amp", "sub_sonic_amp", "sub_sonic_amp", "sub_cyber_drone", "sub_sonic_amp", "sub_dual_laser", "sub_god_orb"];
      const backs = ["back_none", "back_none", "back_scarf", "back_equalizer", "back_equalizer", "back_equalizer", "back_equalizer", "back_equalizer", "back_seraphim_gold"];
      return {
        mode: "auto",
        forcedBranch: branch,
        hairStyle: gender === "boy" ? hairsBoy[lv - 1] : hairsGirl[lv - 1],
        headgear: heads[lv - 1],
        eyeStyle: "eye_sparkle",
        outfit: outfits[lv - 1],
        weaponRight: wpR[lv - 1],
        weaponLeft: wpL[lv - 1],
        backGear: backs[lv - 1],
        palette: "pal_listening_neon",
      };
    }

    case "guts": {
      const hairsBoy = ["hair_spiky", "hair_spiky", "hair_wild_flame", "hair_wild_flame", "hair_wild_flame", "hair_wild_flame", "hair_wild_flame", "hair_wild_flame", "hair_god_aura"];
      const hairsGirl = ["hair_ponytail", "hair_ponytail", "hair_twintail", "hair_wild_flame", "hair_ponytail", "hair_wild_flame", "hair_drill", "hair_wild_flame", "hair_god_aura"];
      const heads = ["head_ahoge", "head_ninja_band", "head_phantom_mask", "head_demon_horns", "head_demon_horns", "head_demon_horns", "head_demon_horns", "head_demon_horns", "head_demon_horns"];
      const outfits = ["outfit_jersey", "outfit_uniform", "outfit_phantom", "outfit_berserker", "outfit_berserker", "outfit_berserker", "outfit_overlord", "outfit_overlord", "outfit_overlord"];
      const wpR = ["wp_none", "wp_pencil_dagger", "wp_katana", "wp_demon_buster", "wp_demon_buster", "wp_demon_buster", "wp_scythe", "wp_demon_buster", "wp_demon_buster"];
      const wpL = ["sub_none", "sub_none", "sub_none", "sub_dragon_claw", "sub_dragon_claw", "sub_dragon_claw", "sub_dragon_claw", "sub_dual_laser", "sub_dragon_claw"];
      const backs = ["back_none", "back_scarf", "back_cape", "back_cape", "back_demon_wings", "back_demon_wings", "back_crimson_wings", "back_crimson_wings", "back_crimson_wings"];
      return {
        mode: "auto",
        forcedBranch: branch,
        hairStyle: gender === "boy" ? hairsBoy[lv - 1] : hairsGirl[lv - 1],
        headgear: heads[lv - 1],
        eyeStyle: lv >= 5 ? "eye_crimson" : "eye_determined",
        outfit: outfits[lv - 1],
        weaponRight: wpR[lv - 1],
        weaponLeft: wpL[lv - 1],
        backGear: backs[lv - 1],
        palette: "pal_guts_crimson",
      };
    }

    case "balanced":
    default: {
      const hairsBoy = ["hair_spiky", "hair_spiky", "hair_wolf", "hair_cyber_mesh", "hair_wolf", "hair_spiky", "hair_samurai", "hair_wild_flame", "hair_god_aura"];
      const hairsGirl = ["hair_bob", "hair_twintail", "hair_twintail", "hair_ponytail", "hair_twintail", "hair_odango", "hair_drill", "hair_long_sage", "hair_twintail"];
      const heads = ["head_ahoge", "head_ribbon", "head_headphones", "head_visor", "head_phantom_mask", "head_visor", "head_valkyrie_helm", "head_valkyrie_helm", "head_demon_horns"];
      const outfits = ["outfit_jersey", "outfit_uniform", "outfit_hoodie", "outfit_cyber", "outfit_phantom", "outfit_cyber", "outfit_paladin", "outfit_shinobi", "outfit_overlord"];
      const wpR = ["wp_none", "wp_pencil_dagger", "wp_pencil_dagger", "wp_laser_sabre", "wp_katana", "wp_thunder_spear", "wp_greatsword", "wp_katana", "wp_excalibur"];
      const wpL = ["sub_none", "sub_note_shield", "sub_none", "sub_none", "sub_none", "sub_cyber_drone", "sub_aegis_shield", "sub_dual_laser", "sub_dual_laser"];
      const backs = ["back_none", "back_none", "back_scarf", "back_thruster", "back_cape", "back_thunder_drums", "back_cape", "back_floating_swords", "back_crimson_wings"];
      return {
        mode: "auto",
        forcedBranch: "balanced",
        hairStyle: gender === "boy" ? hairsBoy[lv - 1] : hairsGirl[lv - 1],
        headgear: heads[lv - 1],
        eyeStyle: lv >= 7 ? "eye_oddeye" : "eye_normal",
        outfit: outfits[lv - 1],
        weaponRight: wpR[lv - 1],
        weaponLeft: wpL[lv - 1],
        backGear: backs[lv - 1],
        palette: "pal_stage_default",
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
  const branch =
    loadout?.forcedBranch || detectStatBranch(stats);
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
