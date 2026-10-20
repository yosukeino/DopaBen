import questionsJson from "@/data/socialQuestions.json";

export type SocialSubject = "地理" | "歴史" | "公民";

export interface SocialQuestion {
  id: number;
  subject: SocialSubject;
  chapter: string;
  section: string;
  number: number;
  stage: 1 | 2;
  is_difficult: boolean;
  question: string;
  supplement: string;
  answer: string;
  answer_kana?: string;
}

export const ALL_SOCIAL_QUESTIONS: SocialQuestion[] = questionsJson as SocialQuestion[];

// 科目別
export const GEOGRAPHY_QUESTIONS = ALL_SOCIAL_QUESTIONS.filter(
  (q) => q.subject === "地理"
);
export const HISTORY_QUESTIONS = ALL_SOCIAL_QUESTIONS.filter(
  (q) => q.subject === "歴史"
);
export const CIVICS_QUESTIONS = ALL_SOCIAL_QUESTIONS.filter(
  (q) => q.subject === "公民"
);

// 科目ごとのユニークな章一覧
export const SUBJECT_CHAPTERS: Record<SocialSubject, string[]> = {
  地理: Array.from(new Set(GEOGRAPHY_QUESTIONS.map((q) => q.chapter))),
  歴史: Array.from(new Set(HISTORY_QUESTIONS.map((q) => q.chapter))),
  公民: Array.from(new Set(CIVICS_QUESTIONS.map((q) => q.chapter))),
};

// 科目ごとのテーマカラーやアイコン
export const SUBJECT_META: Record<
  SocialSubject,
  {
    name: SocialSubject;
    icon: string;
    tag: string;
    color: string;
    bgGradient: string;
    border: string;
    accent: string;
    count: number;
    description: string;
  }
> = {
  地理: {
    name: "地理",
    icon: "🌏",
    tag: "GEOGRAPHY",
    color: "#06B6D4",
    bgGradient: "from-[#083344] via-[#0E7490]/20 to-[#0B0D12]",
    border: "border-[#06B6D4]/40 hover:border-[#06B6D4]",
    accent: "text-[#38BDF8]",
    count: GEOGRAPHY_QUESTIONS.length,
    description: "世界と日本、気候・地形・諸地域の特徴を網羅",
  },
  歴史: {
    name: "歴史",
    icon: "🏯",
    tag: "HISTORY",
    color: "#F59E0B",
    bgGradient: "from-[#451A03] via-[#B45309]/20 to-[#0B0D12]",
    border: "border-[#F59E0B]/40 hover:border-[#F59E0B]",
    accent: "text-[#FBBF24]",
    count: HISTORY_QUESTIONS.length,
    description: "古代から現代まで、激動の出来事と重要人物",
  },
  公民: {
    name: "公民",
    icon: "⚖️",
    tag: "CIVICS",
    color: "#10B981",
    bgGradient: "from-[#064E3B] via-[#059669]/20 to-[#0B0D12]",
    border: "border-[#10B981]/40 hover:border-[#10B981]",
    accent: "text-[#34D399]",
    count: CIVICS_QUESTIONS.length,
    description: "日本国憲法、三権分立、現代経済と国際社会",
  },
};
