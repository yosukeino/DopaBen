export type GradeLevel = "中1" | "中2" | "中3" | "ALL";

export type QuestionFormat =
  | "en_to_ja"       // ① 英単語(＋発音) → 日本語4択
  | "ja_to_en"       // ② 日本語 → 英単語4択(タップ時発音)
  | "listening"      // ③ 音声のみリスニング → 英単語＋意味4択
  | "sentence_order"; // ④ 例文ワードバンク並び替え（総攻撃フィニッシュ）

export interface WordItem {
  id: string;
  english: string;
  japanese: string;
  phonetic: string;
  partOfSpeech: string;
  grade: "中1" | "中2" | "中3" | "激ムズ";
  distractorsJa: string[];
  distractorsEn: string[];
  tip: string; // ミスした時に1行で「あ、なるほど！」となる記憶フック
}

export interface SentenceItem {
  id: string;
  englishTokens: string[];
  distractorTokens: string[];
  japanese: string;
  targetWordIds: string[];
  grade: "中1" | "中2" | "中3" | "激ムズ";
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
  | "hardcore_challenge" // Lv.5解放: 『激ムズ問題に挑戦できる権』(EXP常時2倍＆難関単語乱入)
  | "overclock_audio"    // Lv.7解放: 『倍速ネイティブリスニング権』(EXP1.5倍＆聴覚・瞬発爆伸び)
  | "legend_aura";       // Lv.10解放: 『語彙神の覇気』(全獲得EXP＋100%＆黄金オーラ)

export interface SkillHackDefinition {
  id: SkillHackId;
  unlockLevel: number;
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

export interface PlayerProfile {
  name: string;
  gender: CharacterGender;
  level: number; // 1〜10 (進化段階と直結、10以降もオーバーレベル可能)
  exp: number;
  totalBattles: number;
  totalWordsCleared: number;
  totalRevengeJackpots: number;
  maxCombo: number;
  stats: FiveStats;
  activeSkillHacks: SkillHackId[];
}
