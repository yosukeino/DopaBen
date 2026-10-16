import { NextResponse } from "next/server";
import {
  loadVocabPoolFromSupabase,
  syncAllLocalDataToSupabase,
} from "@/lib/vocabRepository";

export async function GET() {
  const pool = await loadVocabPoolFromSupabase();
  return NextResponse.json({
    source: pool.source,
    totalCount: pool.totalCount,
    eiken1WordsCount: pool.eiken1Words.length,
    standardWordsCount: pool.standardWords.length,
  });
}

export async function POST() {
  const result = await syncAllLocalDataToSupabase();
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
