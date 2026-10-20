import { NextRequest, NextResponse } from "next/server";
import {
  ALL_SOCIAL_QUESTIONS,
  SocialSubject,
} from "@/lib/socialData";
import {
  generateSocialQuizDeck,
} from "@/lib/socialQuestionEngine";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subjectParam = searchParams.get("subject") || "ALL";
    const chapterParam = searchParams.get("chapter") || "ALL";
    const stageParam = searchParams.get("stage") || "ALL";
    const limitParam = parseInt(searchParams.get("limit") || "10", 10);
    const withChoices = searchParams.get("withChoices") !== "false";

    const subject =
      subjectParam === "地理" || subjectParam === "歴史" || subjectParam === "公民"
        ? (subjectParam as SocialSubject)
        : "ALL";

    const stage =
      stageParam === "1" ? 1 : stageParam === "2" ? 2 : "ALL";

    if (withChoices) {
      const deck = generateSocialQuizDeck({
        subject,
        chapter: chapterParam,
        stage,
        limit: limitParam,
      });

      return NextResponse.json({
        totalMatched: deck.length,
        questions: deck,
      });
    }

    // 生の問題データのみ
    let filtered = ALL_SOCIAL_QUESTIONS;
    if (subject !== "ALL") filtered = filtered.filter((q) => q.subject === subject);
    if (chapterParam !== "ALL") filtered = filtered.filter((q) => q.chapter === chapterParam);
    if (stage !== "ALL") filtered = filtered.filter((q) => q.stage === stage);

    const limited = limitParam > 0 ? filtered.slice(0, limitParam) : filtered;

    return NextResponse.json({
      totalMatched: filtered.length,
      limit: limitParam,
      questions: limited,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate social quiz", details: String(error) },
      { status: 500 }
    );
  }
}
