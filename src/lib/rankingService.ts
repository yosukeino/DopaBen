import { supabase, isSupabaseConfigured } from "./supabaseClient";

export interface RankingSubmission {
  playerName: string;
  playerUuid?: string;
  score: number;          // 正解数 (0..20)
  totalQuestions: number; // 全問題数 (20)
  timeMs: number;         // 所要時間（ミリ秒）
  gamePoints: number;     // 総合スコア（正解点 + スピードボーナス + コンボボーナス）
  maxCombo: number;       // 最大連続正解数
  course: string;         // 'eiken4' | 'eiken4_all'
}

export interface RankingRecord {
  id: string;
  playerUuid: string;
  playerName: string;
  score: number;
  totalQuestions: number;
  timeMs: number;
  gamePoints: number;
  maxCombo: number;
  course: string;
  createdAt: string;
}

const LOCAL_STORAGE_KEY = "dopaben_local_rankings";
const DEVICE_UUID_KEY = "dopaben_device_uuid";
const PLAYER_NAME_KEY = "dopaben_ranking_player_name";

/**
 * 端末固有の匿名UUID（ログイン不要で同一端末判定）
 */
export function getOrCreatePlayerUuid(): string {
  if (typeof window === "undefined") return "server";
  try {
    let uuid = localStorage.getItem(DEVICE_UUID_KEY);
    if (!uuid) {
      uuid = "dp_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 9);
      localStorage.setItem(DEVICE_UUID_KEY, uuid);
    }
    return uuid;
  } catch {
    return "dev_" + Date.now();
  }
}

/**
 * 前回の入力名前を取得
 */
export function getSavedPlayerName(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(PLAYER_NAME_KEY) || "";
  } catch {
    return "";
  }
}

/**
 * プレイヤー名を保存
 */
export function savePlayerName(name: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PLAYER_NAME_KEY, name.trim());
  } catch {
    // ignore
  }
}

/**
 * 名前の正規化
 */
export function normalizePlayerName(name: string): string {
  if (!name) return "";
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0));
}

/**
 * 自己ベスト判定
 * 1. 正解数 (多い方が勝ち)
 * 2. 総合ポイント (高い方が勝ち)
 * 3. クリアタイム (速い方が勝ち)
 */
export function isScoreBetter(a: { score: number; gamePoints: number; timeMs: number }, b: { score: number; gamePoints: number; timeMs: number }): boolean {
  if (a.score !== b.score) return a.score > b.score;
  if (a.gamePoints !== b.gamePoints) return a.gamePoints > b.gamePoints;
  return a.timeMs < b.timeMs;
}

/**
 * ローカルストレージからランキング取得
 */
function getLocalRankings(): RankingRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

/**
 * ローカルストレージに保存（自己ベスト更新ルール）
 */
function saveLocalRanking(sub: RankingSubmission): RankingRecord {
  const current = getLocalRankings();
  const uuid = sub.playerUuid || getOrCreatePlayerUuid();
  const normName = normalizePlayerName(sub.playerName);
  const now = new Date().toISOString();

  const record: RankingRecord = {
    id: "loc_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 6),
    playerUuid: uuid,
    playerName: sub.playerName.trim(),
    score: sub.score,
    totalQuestions: sub.totalQuestions,
    timeMs: sub.timeMs,
    gamePoints: sub.gamePoints,
    maxCombo: sub.maxCombo,
    course: sub.course,
    createdAt: now,
  };

  let replaced = false;
  const updated = current.map((existing) => {
    if (existing.course !== sub.course) return existing;
    const existingNorm = normalizePlayerName(existing.playerName);
    // 同一UUIDまたは同名の場合、スコアが良ければ更新
    if (existing.playerUuid === uuid || existingNorm === normName) {
      replaced = true;
      return isScoreBetter(record, existing)
        ? { ...record, id: existing.id }
        : existing;
    }
    return existing;
  });

  if (!replaced) {
    updated.push(record);
  }

  // ソート (正解数 降順 -> クリアタイム 昇順)
  updated.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.gamePoints !== a.gamePoints) return b.gamePoints - a.gamePoints;
    return a.timeMs - b.timeMs;
  });

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated.slice(0, 100)));
  } catch (e) {
    console.error("Failed to save local ranking:", e);
  }

  return record;
}

/**
 * ランキング送信（Supabase ＋ localStorage ハイブリッド）
 */
export async function submitRankingScore(submission: RankingSubmission): Promise<{ success: boolean; record: RankingRecord; isOnline: boolean }> {
  const uuid = submission.playerUuid || getOrCreatePlayerUuid();
  savePlayerName(submission.playerName);

  const localRecord = saveLocalRanking({ ...submission, playerUuid: uuid });

  // Supabase への送信を試行
  if (isSupabaseConfigured && supabase) {
    try {
      const payload = {
        player_uuid: uuid,
        player_name: submission.playerName.trim(),
        score: submission.score,
        total_questions: submission.totalQuestions,
        time_ms: submission.timeMs,
        game_points: submission.gamePoints,
        max_combo: submission.maxCombo,
        course: submission.course || "eiken4",
      };

      // dopaben_rankings または word_quiz_scores への保存
      const { data, error } = await supabase
        .from("dopaben_rankings")
        .insert(payload)
        .select()
        .single();

      if (!error && data) {
        return {
          success: true,
          isOnline: true,
          record: {
            id: data.id,
            playerUuid: data.player_uuid,
            playerName: data.player_name,
            score: data.score,
            totalQuestions: data.total_questions,
            timeMs: data.time_ms,
            gamePoints: data.game_points,
            maxCombo: data.max_combo,
            course: data.course,
            createdAt: data.created_at,
          },
        };
      }
    } catch (e) {
      console.warn("Supabase ranking insert failed, using local fallback:", e);
    }
  }

  return {
    success: true,
    isOnline: false,
    record: localRecord,
  };
}

/**
 * ランキング一覧を取得（Supabase優先、失敗時はlocalStorage）
 */
export async function fetchTopRankings(course = "eiken4", limit = 50): Promise<RankingRecord[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("dopaben_rankings")
        .select("*")
        .eq("course", course)
        .order("score", { ascending: false })
        .order("time_ms", { ascending: true })
        .limit(limit * 2);

      if (!error && data && data.length > 0) {
        // 重複プレイヤー（同一UUIDまたは同名）は自己ベストのみを抽出
        const bestByUser = new Map<string, RankingRecord>();
        for (const row of data) {
          const key = row.player_uuid || normalizePlayerName(row.player_name);
          const rec: RankingRecord = {
            id: row.id,
            playerUuid: row.player_uuid,
            playerName: row.player_name,
            score: row.score,
            totalQuestions: row.total_questions,
            timeMs: row.time_ms,
            gamePoints: row.game_points,
            maxCombo: row.max_combo,
            course: row.course,
            createdAt: row.created_at,
          };

          const existing = bestByUser.get(key);
          if (!existing || isScoreBetter(rec, existing)) {
            bestByUser.set(key, rec);
          }
        }

        const sorted = Array.from(bestByUser.values());
        sorted.sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          if (b.gamePoints !== a.gamePoints) return b.gamePoints - a.gamePoints;
          return a.timeMs - b.timeMs;
        });

        return sorted.slice(0, limit);
      }
    } catch (e) {
      console.warn("Supabase ranking fetch failed, using local fallback:", e);
    }
  }

  // ローカルフォールバック
  const localList = getLocalRankings().filter((r) => r.course === course);
  return localList.slice(0, limit);
}
