import { supabase, isSupabaseConfigured } from "./supabaseClient";

export interface RankingSubmission {
  playerName: string;
  playerUuid?: string;
  score: number;          // 正解数 (0..20)
  totalQuestions: number; // 全問題数 (20)
  timeMs: number;         // 所要時間（ミリ秒）
  gamePoints: number;     // 総合スコア（正解点 + スピードボーナス + コンボボーナス）
  maxCombo: number;       // 最大連続正解数
  course: string;         // 'eiken4' | 'eiken4_all' など
  subject?: string;       // 'english' | 'social' など
}

export interface RankingRecord {
  id: string;
  subject?: string;
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
const LAST_PLAYED_KEY = "dopaben_last_ranking_played_at";
const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24時間

/**
 * 24時間制限のチェック
 */
export function getRankingCooldownStatus(): {
  canPlay: boolean;
  remainingMs: number;
  remainingHours: number;
  remainingMinutes: number;
  lastPlayedAt: number | null;
} {
  if (typeof window === "undefined") {
    return { canPlay: true, remainingMs: 0, remainingHours: 0, remainingMinutes: 0, lastPlayedAt: null };
  }
  try {
    const raw = localStorage.getItem(LAST_PLAYED_KEY);
    if (!raw) {
      return { canPlay: true, remainingMs: 0, remainingHours: 0, remainingMinutes: 0, lastPlayedAt: null };
    }
    const lastPlayedAt = parseInt(raw, 10);
    if (isNaN(lastPlayedAt)) {
      return { canPlay: true, remainingMs: 0, remainingHours: 0, remainingMinutes: 0, lastPlayedAt: null };
    }
    const diff = Date.now() - lastPlayedAt;
    if (diff >= COOLDOWN_MS) {
      return { canPlay: true, remainingMs: 0, remainingHours: 0, remainingMinutes: 0, lastPlayedAt };
    }
    const remainingMs = COOLDOWN_MS - diff;
    const remainingHours = Math.floor(remainingMs / (60 * 60 * 1000));
    const remainingMinutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
    return {
      canPlay: false,
      remainingMs,
      remainingHours,
      remainingMinutes,
      lastPlayedAt,
    };
  } catch {
    return { canPlay: true, remainingMs: 0, remainingHours: 0, remainingMinutes: 0, lastPlayedAt: null };
  }
}

/**
 * ランキングバトル挑戦時刻を記録
 */
export function recordRankingPlayed(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LAST_PLAYED_KEY, Date.now().toString());
  } catch {
    // ignore
  }
}

/**
 * テスト・デバッグ用：クールダウンリセット
 */
export function resetRankingCooldown(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(LAST_PLAYED_KEY);
  } catch {
    // ignore
  }
}

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

let lastFetchIsOnline = false;

export function getLastRankingOnlineStatus(): boolean {
  return lastFetchIsOnline;
}

/**
 * ランキング送信（/api/rankings ＋ Supabase ＋ localStorage ハイブリッド）
 */
export async function submitRankingScore(
  submission: RankingSubmission
): Promise<{ success: boolean; record: RankingRecord; isOnline: boolean }> {
  const uuid = submission.playerUuid || getOrCreatePlayerUuid();
  savePlayerName(submission.playerName);

  const localRecord = saveLocalRanking({ ...submission, playerUuid: uuid });

  // 1. Next.js API ルート (/api/rankings) への送信
  try {
    const res = await fetch("/api/rankings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...submission,
        playerUuid: uuid,
        subject: submission.subject || "english",
        course: submission.course || "eiken4",
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.record) {
        lastFetchIsOnline = true;
        return {
          success: true,
          isOnline: true,
          record: data.record,
        };
      }
    }
  } catch (err) {
    console.warn("POST /api/rankings failed, trying direct Supabase fallback:", err);
  }

  // 2. Supabase への直接送信フォールバック
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
        subject: submission.subject || "english",
      };

      const { data, error } = await supabase
        .from("dopaben_rankings")
        .insert(payload)
        .select()
        .single();

      if (!error && data) {
        lastFetchIsOnline = true;
        return {
          success: true,
          isOnline: true,
          record: {
            id: data.id,
            subject: data.subject || submission.subject || "english",
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
 * ランキング一覧を取得（/api/rankings 優先、失敗時はSupabase、最終ローカル）
 */
export async function fetchTopRankings(
  course = "eiken4",
  limit = 50,
  subject = "english"
): Promise<RankingRecord[]> {
  // 1. Next.js API Route (/api/rankings) からの取得
  try {
    const res = await fetch(
      `/api/rankings?course=${encodeURIComponent(course)}&subject=${encodeURIComponent(
        subject
      )}&limit=${limit}`
    );
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.rankings) && data.rankings.length > 0) {
        lastFetchIsOnline = true;
        return data.rankings;
      }
    }
  } catch (err) {
    console.warn("GET /api/rankings failed, trying direct Supabase fallback:", err);
  }

  // 2. Supabase 直接取得フォールバック
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase
        .from("dopaben_rankings")
        .select("*")
        .eq("course", course);
      if (subject) {
        query = query.eq("subject", subject);
      }

      const { data, error } = await query
        .order("score", { ascending: false })
        .order("time_ms", { ascending: true })
        .limit(limit * 3);

      if (!error && data && data.length > 0) {
        // 重複プレイヤー（同一UUIDまたは同名）は自己ベストのみを抽出
        const bestByUser = new Map<string, RankingRecord>();
        for (const row of data) {
          const key = row.player_uuid || normalizePlayerName(row.player_name);
          const rec: RankingRecord = {
            id: row.id,
            subject: row.subject || subject,
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
          if (a.timeMs !== b.timeMs) return a.timeMs - b.timeMs;
          return b.gamePoints - a.gamePoints;
        });

        lastFetchIsOnline = true;
        return sorted.slice(0, limit);
      }
    } catch (e) {
      console.warn("Supabase ranking fetch failed, using local fallback:", e);
    }
  }

  // 3. ローカルフォールバック
  lastFetchIsOnline = false;
  const localList = getLocalRankings().filter((r) => r.course === course);
  return localList.slice(0, limit);
}
