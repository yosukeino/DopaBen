export type GradeLevel = "英検4級" | "ターゲット1800" | "英検1級" | "中1" | "中2" | "中3" | "ALL";

export type QuestionFormat =
  | "en_to_ja"       // ① 英単語(＋発音) → 日本語4択
  | "ja_to_en"       // ② 日本語 → 英単語4択(回答後に発音)
  | "listening"      // ③ 音声のみリスニング → 日本語の意味4択(スペル隠蔽)
  | "sentence_fill"  // ④ 例文の文脈穴埋め → 英単語4択(英検1級本試験スタイル！)
  | "sentence_order"; // ⑤ 例文ワードバンク並び替え（中学ステージ総攻撃フィニッシュ）

export interface WordItem {
  id: string;
  english: string;
  japanese: string;
  phonetic: string;
  partOfSpeech: string;
  grade: "英検4級" | "ターゲット1800" | "英検1級" | "中1" | "中2" | "中3" | "激ムズ";
  distractorsJa: string[];
  distractorsEn: string[];
  tip: string; // ミスした時・正解後の解説モーダルで出る記憶フック
  exampleSentenceEn?: string; // 解説モーダル・穴埋め問題で使用する公式例文
  exampleSentenceJa?: string; // 解説モーダル・穴埋め問題で使用する公式例文の和訳
}

export interface SentenceItem {
  id: string;
  englishTokens: string[];
  distractorTokens: string[];
  japanese: string;
  targetWordIds: string[];
  grade: "英検4級" | "ターゲット1800" | "英検1級" | "中1" | "中2" | "中3" | "激ムズ";
  grammarPoint: string;
}

export interface GeneratedQuestion {
  uid: string;
  format: QuestionFormat;
  phase: "STAGE1_COMBO" | "STAGE2_ALLOUT"; // 二段ロケットの1段目 or 2段目(総攻撃)
  word?: WordItem;
  sentence?: SentenceItem;
  promptTitle: string;
  promptMain: string;
  promptSub?: string;
  audioText: string;
  hideTextForListening?: boolean;
  hideAudioBeforeAnswer?: boolean; // 日→英や文脈穴埋めで回答前に正解音声がバレないようにするフラグ
  choices?: {
    id: string;
    label: string;
    subLabel?: string;
    speakOnTap?: string;
    isCorrect: boolean;
  }[];
  wordBank?: {
    correctTokens: string[];
    shuffledTokens: { id: string; text: string }[];
  };
  // ミスしても続けた方がお得な「懸賞金（倍返し）フラグ」
  isRevengeBounty?: boolean;
  bountyMultiplier?: number;
  isHardcoreQuestion?: boolean;
}

export type CharacterGender = "boy" | "girl";

export interface FiveStats {
  vocab: number;     // 語彙力 (KNOWLEDGE)
  speed: number;     // 瞬発力 (AGILITY)
  grammar: number;   // 構築力 (PROFICIENCY)
  listening: number; // 聴覚力 (PERCEPTION)
  guts: number;      // 度胸・逆転力 (GUTS - ミスからのリベンジで爆伸び！)
}

export type SkillHackId =
  | "bounty_overdrive"   // Lv.2解放: ミス後の倍返し懸賞金が×2.5 → ×3.5に強化
  | "phantom_eliminator" // Lv.3解放: 4択の誤答を2つ消去する「怪盗の眼」コマンド解禁
  | "hardcore_challenge" // Lv.5解放: 『激ムズ問題に挑戦できる権』(LXP常時2倍＆難関単語乱入)
  | "overclock_audio"    // Lv.7解放: 『倍速ネイティブリスニング権』(LXP1.5倍＆聴覚・瞬発爆伸び)
  | "legend_aura";       // Lv.10解放: 『語彙神の覇気』(全獲得LXP＋100%＆黄金オーラ)

export interface SkillHackDefinition {
  id: SkillHackId;
  unlockLevel: number;
  requiredTotalLxp: number; // アンロックに必要な累積LXP
  lxpCost: number;          // 習得に消費する所持LXP
  name: string;
  badge: string;
  description: string;
  effectSummary: string;
  isToggleable: boolean;
}

export interface EvolutionStageInfo {
  stage: number; // 1 to 10
  titleBoy: string;
  titleGirl: string;
  subtitle: string;
  auraColor: string;
  unlockMessage: string;
}

export interface WordMasteryRecord {
  cleared: number;
  missed: number;
  lastPlayedAt: number;
}

export interface BattleWordLog {
  wordId: string;
  english: string;
  japanese: string;
  phonetic: string;
  tip: string;
  exampleSentenceEn?: string;
  exampleSentenceJa?: string;
  result: "perfect" | "revenge" | "missed";
}

export type StatBranchType =
  | "balanced"  // 万能ヒーロー／ヒロイン系統
  | "vocab"     // 語彙特化：魔導・賢者系統 (SAGE / ARCANIST)
  | "speed"     // 瞬発特化：疾風・神速忍系統 (SPEEDSTER / SHINOBI)
  | "grammar"   // 構築特化：機巧・聖騎士系統 (ARCHITECT / PALADIN)
  | "listening" // 聴覚特化：音撃・サイバー怪盗系統 (SONIC PHANTOM)
  | "guts";     // 度胸特化：紅蓮・覇王系統 (BERSERKER / OVERLORD)

export interface CharacterPartLoadout {
  mode: "auto" | "custom"; // auto = Lv×五角形ステータス連動進化, custom = 自由パーツ組み合わせ
  forcedBranch?: StatBranchType; // auto時に特定系統をプレビュー・固定したい場合
  hairStyle: string;
  headgear: string;
  eyeStyle: string;
  outfit: string;
  weaponRight: string;
  weaponLeft: string;
  backGear: string;
  palette: string;
}

export interface PlayerProfile {
  name: string;
  gender: CharacterGender;
  level: number; // 1〜10 (累積LXPによって昇格する進化段階)
  exp: number;   // 所持LXP (五角形ステータス強化やスキル習得に任意消費できるLXPプール)
  totalLxp: number; // 累積LXP (総学習経験値＝学習時間の指標、消費しても減らない)
  totalBattles: number;
  totalWordsCleared: number;
  totalRevengeJackpots: number;
  maxCombo: number;
  stats: FiveStats;
  unlockedSkillHacks: SkillHackId[]; // 所持LXPを消費して習得済みのスキル一覧
  activeSkillHacks: SkillHackId[];   // 現在ONにしているスキル一覧
  wordMastery?: Record<string, WordMasteryRecord>;
  unlockedParts?: string[];          // LXPで解放した着せ替えパーツID一覧
  characterLoadout?: CharacterPartLoadout;
}
