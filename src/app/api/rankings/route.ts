import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export interface ApiRankingRecord {
  id: string;
  subject: string;
  course: string;
  playerUuid: string;
  playerName: string;
  score: number;
  totalQuestions: number;
  timeMs: number;
  gamePoints: number;
  maxCombo: number;
  createdAt: string;
}

function normalizeName(name: string): string {
  if (!name) return "";
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0));
}

function isScoreBetter(
  a: { score: number; gamePoints: number; timeMs: number },
  b: { score: number; gamePoints: number; timeMs: number }
): boolean {
  if (a.score !== b.score) return a.score > b.score;
  if (a.timeMs !== b.timeMs) return a.timeMs < b.timeMs;
  return a.gamePoints > b.gamePoints;
}

/**
 * GET /api/rankings?course=eiken4&subject=english&limit=50
 * 全国ランキング一覧を取得
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const course = searchParams.get("course") || "eiken4";
    const subject = searchParams.get("subject") || "english";
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "50", 10), 1), 100);

    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json(
        {
          success: false,
          source: "unconfigured",
          message: "Supabase is not configured.",
          rankings: [],
        },
        { status: 200 }
      );
    }

    // Supabaseから最新ランキングを取得
    let query = supabase
      .from("dopaben_rankings")
      .select("*")
      .eq("course", course);

    // subject 指定がある場合
    if (subject && subject !== "ALL") {
      query = query.eq("subject", subject);
    }

    const { data, error } = await query
      .order("score", { ascending: false })
      .order("time_ms", { ascending: true })
      .limit(limit * 3);

    if (error) {
      console.warn("Supabase fetch rankings error:", error);
      return NextResponse.json(
        {
          success: false,
          source: "error",
          error: error.message,
          rankings: [],
        },
        { status: 200 }
      );
    }

    // プレイヤーごとに自己ベストを1つのみ抽出
    const bestByPlayer = new Map<string, ApiRankingRecord>();
    for (const row of data || []) {
      const norm = normalizeName(row.player_name);
      const key = row.player_uuid ? `${row.player_uuid}` : norm;
      const rec: ApiRankingRecord = {
        id: row.id,
        subject: row.subject || "english",
        course: row.course,
        playerUuid: row.player_uuid || "",
        playerName: row.player_name,
        score: row.score,
        totalQuestions: row.total_questions,
        timeMs: row.time_ms,
        gamePoints: row.game_points,
        maxCombo: row.max_combo,
        createdAt: row.created_at,
      };

      const existing = bestByPlayer.get(key);
      if (!existing || isScoreBetter(rec, existing)) {
        bestByPlayer.set(key, rec);
      }
    }

    const sortedRankings = Array.from(bestByPlayer.values());
    sortedRankings.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.timeMs !== b.timeMs) return a.timeMs - b.timeMs;
      return b.gamePoints - a.gamePoints;
    });

    return NextResponse.json({
      success: true,
      source: "supabase",
      totalParticipants: sortedRankings.length,
      rankings: sortedRankings.slice(0, limit),
    });
  } catch (err: any) {
    console.error("GET /api/rankings error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Internal server error",
        rankings: [],
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/rankings
 * スコア登録
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      playerName,
      playerUuid,
      score,
      totalQuestions = 20,
      timeMs,
      gamePoints = 0,
      maxCombo = 0,
      course = "eiken4",
      subject = "english",
    } = body;

    // バリデーション
    const trimmedName = (playerName || "").trim();
    if (!trimmedName) {
      return NextResponse.json(
        { success: false, error: "プレイヤー名を入力してください。" },
        { status: 400 }
      );
    }

    const safeScore = Math.max(0, Math.min(Number(score) || 0, Number(totalQuestions) || 20));
    const safeTimeMs = Math.max(100, Number(timeMs) || 1000);

    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json(
        {
          success: false,
          isOnline: false,
          message: "Supabase not configured. Saved locally only.",
        },
        { status: 200 }
      );
    }

    const payload = {
      player_uuid: playerUuid || "",
      player_name: trimmedName.slice(0, 20),
      score: safeScore,
      total_questions: Number(totalQuestions) || 20,
      time_ms: safeTimeMs,
      game_points: Number(gamePoints) || 0,
      max_combo: Number(maxCombo) || 0,
      course: course || "eiken4",
      subject: subject || "english",
    };

    const { data, error } = await supabase
      .from("dopaben_rankings")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.warn("Supabase insert rankings error:", error);
      return NextResponse.json(
        {
          success: false,
          isOnline: false,
          error: error.message,
        },
        { status: 200 }
      );
    }

    const record: ApiRankingRecord = {
      id: data.id,
      subject: data.subject || subject,
      course: data.course,
      playerUuid: data.player_uuid,
      playerName: data.player_name,
      score: data.score,
      totalQuestions: data.total_questions,
      timeMs: data.time_ms,
      gamePoints: data.game_points,
      maxCombo: data.max_combo,
      createdAt: data.created_at,
    };

    return NextResponse.json({
      success: true,
      isOnline: true,
      record,
    });
  } catch (err: any) {
    console.error("POST /api/rankings error:", err);
    return NextResponse.json(
      {
        success: false,
        isOnline: false,
        error: err?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
