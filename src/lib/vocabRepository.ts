import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { SentenceItem, WordItem } from "./types";
import { EIKEN1_SENTENCES, EIKEN1_UNIT1_ENTRIES, EIKEN1_WORDS } from "./eiken1Data";
import { SENTENCES, WORDS } from "./vocabData";

export interface DbStageRow {
  slug: string;
  category: string;
  unit_number: number;
  title: string;
  subtitle: string;
  sort_order: number;
  is_active: boolean;
}

export interface DbVocabEntryRow {
  id: string;
  stage_slug: string;
  category: "英検1級" | "中1" | "中2" | "中3" | "激ムズ";
  unit_number: number;
  track_number: number;
  entry_number: string;
  english: string;
  japanese: string;
  phonetic: string;
  part_of_speech: string;
  tip: string;
  distractors_ja: string[];
  distractors_en: string[];
  sentence_en_tokens: string[];
  sentence_ja: string;
  sentence_distractor_tokens: string[];
  grammar_point: string;
}

export interface ExtendedWordItem extends WordItem {
  track: number;
  num: string;
  stageSlug: string;
  unitNumber: number;
}

export interface ExtendedSentenceItem extends SentenceItem {
  track: number;
  num: string;
  stageSlug: string;
  unitNumber: number;
}

export interface VocabDataPool {
  source: "supabase" | "local";
  totalCount: number;
  eiken1Words: ExtendedWordItem[];
  eiken1Sentences: ExtendedSentenceItem[];
  standardWords: WordItem[];
  standardSentences: SentenceItem[];
}

// メモリキャッシュ（起動時にSupabaseから取得したら保持）
let cachedPool: VocabDataPool | null = null;

/**
 * ローカル定義データから初期フォールバックプールを生成
 */
export function getLocalFallbackPool(): VocabDataPool {
  const eiken1Words: ExtendedWordItem[] = EIKEN1_WORDS.map((w) => ({
    ...w,
    stageSlug: "eiken1_unit01",
    unitNumber: 1,
  }));
  const eiken1Sentences: ExtendedSentenceItem[] = EIKEN1_SENTENCES.map((s) => ({
    ...s,
    stageSlug: "eiken1_unit01",
    unitNumber: 1,
  }));

  return {
    source: "local",
    totalCount: eiken1Words.length + WORDS.length,
    eiken1Words,
    eiken1Sentences,
    standardWords: WORDS,
    standardSentences: SENTENCES,
  };
}

/**
 * 現在有効なボキャブラリープールを返す（Supabase取得済みならDB版、未接続ならローカル版）
 */
export function getActiveVocabPool(): VocabDataPool {
  return cachedPool ?? getLocalFallbackPool();
}

/**
 * Supabase の `dopaben_vocab_entries` から全問題データを取得し、
 * ダミー選択肢が空のレコードには同一カテゴリ・同一品詞から自動で4択ダミーを生成する
 */
export async function loadVocabPoolFromSupabase(): Promise<VocabDataPool> {
  if (!isSupabaseConfigured || !supabase) {
    cachedPool = getLocalFallbackPool();
    return cachedPool;
  }

  try {
    const { data, error } = await supabase
      .from("dopaben_vocab_entries")
      .select("*")
      .order("entry_number", { ascending: true });

    if (error || !data || data.length === 0) {
      cachedPool = getLocalFallbackPool();
      return cachedPool;
    }

    const rows = data as DbVocabEntryRow[];

    const eikenRows = rows.filter((r) => r.category === "英検1級");
    const standardRows = rows.filter((r) => r.category !== "英検1級");

    // 1. 英検1級（または今後追加されるUnit 02以降のステージ）の変換
    const eiken1Words: ExtendedWordItem[] = eikenRows.map((row, idx) => {
      // ダミー選択肢がDB側で未指定なら、同じ品詞から自動選出する汎用ロジック
      const samePos = eikenRows.filter(
        (other) =>
          other.id !== row.id && other.part_of_speech === row.part_of_speech
      );
      const pool =
        samePos.length >= 3
          ? samePos
          : eikenRows.filter((other) => other.id !== row.id);

      const d1 = pool[(idx * 3 + 1) % Math.max(1, pool.length)];
      const d2 = pool[(idx * 3 + 5) % Math.max(1, pool.length)];
      const d3 = pool[(idx * 3 + 9) % Math.max(1, pool.length)];

      const distractorsJa =
        Array.isArray(row.distractors_ja) && row.distractors_ja.length >= 3
          ? row.distractors_ja
          : [d1?.japanese || "", d2?.japanese || "", d3?.japanese || ""].filter(
              Boolean
            );

      const distractorsEn =
        Array.isArray(row.distractors_en) && row.distractors_en.length >= 3
          ? row.distractors_en
          : [d1?.english || "", d2?.english || "", d3?.english || ""].filter(
              Boolean
            );

      return {
        id: row.id,
        num: row.entry_number || String(idx + 1).padStart(4, "0"),
        track: row.track_number || 1,
        stageSlug: row.stage_slug || "eiken1_unit01",
        unitNumber: row.unit_number || 1,
        english: row.english,
        japanese: row.japanese,
        phonetic: row.phonetic,
        partOfSpeech: row.entry_number
          ? `英検1級 #${row.entry_number} (${row.part_of_speech})`
          : row.part_of_speech,
        grade: "英検1級",
        distractorsJa,
        distractorsEn,
        tip: row.tip,
        exampleSentenceEn:
          Array.isArray(row.sentence_en_tokens) &&
          row.sentence_en_tokens.length > 0
            ? row.sentence_en_tokens.join(" ")
            : undefined,
        exampleSentenceJa: row.sentence_ja || undefined,
      };
    });

    const eiken1Sentences: ExtendedSentenceItem[] = eikenRows
      .filter(
        (row) =>
          Array.isArray(row.sentence_en_tokens) &&
          row.sentence_en_tokens.length > 0
      )
      .map((row, idx) => {
        const other1 =
          eikenRows[(idx + 4) % Math.max(1, eikenRows.length)]?.english ||
          "however";
        const other2 =
          eikenRows[(idx + 11) % Math.max(1, eikenRows.length)]?.english ||
          "moreover";

        const distractorTokens =
          Array.isArray(row.sentence_distractor_tokens) &&
          row.sentence_distractor_tokens.length > 0
            ? row.sentence_distractor_tokens
            : [other1, other2];

        return {
          id: `s_${row.id}`,
          num: row.entry_number || String(idx + 1).padStart(4, "0"),
          track: row.track_number || 1,
          stageSlug: row.stage_slug || "eiken1_unit01",
          unitNumber: row.unit_number || 1,
          englishTokens: row.sentence_en_tokens,
          distractorTokens,
          japanese: row.sentence_ja,
          targetWordIds: [row.id],
          grade: "英検1級",
          grammarPoint:
            row.grammar_point ||
            `【英検1級 #${row.entry_number}】${row.english} ＝ ${row.japanese}`,
        };
      });

    // 2. 通常ステージ（中1・中2・中3・激ムズ）の変換
    const standardWords: WordItem[] =
      standardRows.length > 0
        ? standardRows.map((row) => ({
            id: row.id,
            english: row.english,
            japanese: row.japanese,
            phonetic: row.phonetic,
            partOfSpeech: row.part_of_speech,
            grade: row.category,
            distractorsJa: row.distractors_ja,
            distractorsEn: row.distractors_en,
            tip: row.tip,
            exampleSentenceEn:
              Array.isArray(row.sentence_en_tokens) &&
              row.sentence_en_tokens.length > 0
                ? row.sentence_en_tokens.join(" ")
                : undefined,
            exampleSentenceJa: row.sentence_ja || undefined,
          }))
        : WORDS;

    const dbStandardSentences: SentenceItem[] = standardRows
      .filter(
        (row) =>
          Array.isArray(row.sentence_en_tokens) &&
          row.sentence_en_tokens.length > 0
      )
      .map((row) => ({
        id: `s_${row.id}`,
        englishTokens: row.sentence_en_tokens,
        distractorTokens: row.sentence_distractor_tokens || [],
        japanese: row.sentence_ja,
        targetWordIds: [row.id],
        grade: row.category,
        grammarPoint: row.grammar_point,
      }));

    cachedPool = {
      source: "supabase",
      totalCount: rows.length,
      eiken1Words: eiken1Words.length > 0 ? eiken1Words : getLocalFallbackPool().eiken1Words,
      eiken1Sentences:
        eiken1Sentences.length > 0
          ? eiken1Sentences
          : getLocalFallbackPool().eiken1Sentences,
      standardWords,
      standardSentences:
        dbStandardSentences.length > 0 ? dbStandardSentences : SENTENCES,
    };

    return cachedPool;
  } catch {
    cachedPool = getLocalFallbackPool();
    return cachedPool;
  }
}

/**
 * 既存の全ステージ＆全問題データ（英検1級 96語＋例文96文 ＆ 中1〜中3・激ムズ）を
 * Supabase の `dopaben_stages` と `dopaben_vocab_entries` に一括Upsert（同期）する関数
 */
export async function syncAllLocalDataToSupabase(): Promise<{
  ok: boolean;
  message: string;
  stagesCount?: number;
  entriesCount?: number;
}> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      ok: false,
      message:
        "Supabase環境変数（NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY）が未設定です。",
    };
  }

  // 1. ステージマスターデータ
  const stages: DbStageRow[] = [
    {
      slug: "eiken1_unit01",
      category: "英検1級",
      unit_number: 1,
      title: "👑 英検1級 単語ステージ【Unit 01】",
      subtitle: "全96語 (0001〜0096 / Track 001〜008)",
      sort_order: 1,
      is_active: true,
    },
    {
      slug: "jhs_1",
      category: "中1",
      unit_number: 1,
      title: "中1 コア単語ステージ",
      subtitle: "基礎アクション＆日常語彙",
      sort_order: 10,
      is_active: true,
    },
    {
      slug: "jhs_2",
      category: "中2",
      unit_number: 1,
      title: "中2 コア単語ステージ",
      subtitle: "不定詞・比較・接続詞コア語彙",
      sort_order: 20,
      is_active: true,
    },
    {
      slug: "jhs_3",
      category: "中3",
      unit_number: 1,
      title: "中3 コア単語ステージ",
      subtitle: "現在完了・関係代名詞・長文必須語彙",
      sort_order: 30,
      is_active: true,
    },
    {
      slug: "hardcore_boss",
      category: "激ムズ",
      unit_number: 1,
      title: "💀 激ムズ挑戦ステージ",
      subtitle: "Lv.5特権スキル解禁・ハイレベル語彙",
      sort_order: 40,
      is_active: true,
    },
  ];

  const { error: stageError } = await supabase
    .from("dopaben_stages")
    .upsert(stages, { onConflict: "slug" });

  if (stageError) {
    return {
      ok: false,
      message: `ステージテーブル同期エラー: ${stageError.message}（先に supabase/schema.sql をSQL Editorで実行してください）`,
    };
  }

  // 2. 英検1級 Unit 01 全96語＋公式例文96文レコード
  const eikenEntries: DbVocabEntryRow[] = EIKEN1_UNIT1_ENTRIES.map(
    (entry, idx) => {
      const generatedWord = EIKEN1_WORDS[idx];
      const generatedSentence = EIKEN1_SENTENCES[idx];
      return {
        id: `eiken1_${entry.num}`,
        stage_slug: "eiken1_unit01",
        category: "英検1級",
        unit_number: 1,
        track_number: entry.track,
        entry_number: entry.num,
        english: entry.english,
        japanese: entry.japanese,
        phonetic: entry.phonetic,
        part_of_speech: entry.partOfSpeech,
        tip: entry.tip,
        distractors_ja: generatedWord.distractorsJa,
        distractors_en: generatedWord.distractorsEn,
        sentence_en_tokens: entry.sentenceEn,
        sentence_ja: entry.sentenceJa,
        sentence_distractor_tokens: generatedSentence.distractorTokens,
        grammar_point: generatedSentence.grammarPoint,
      };
    }
  );

  // 3. 中1〜中3・激ムズ単語レコード（対応する例文があれば紐付け）
  const standardEntries: DbVocabEntryRow[] = WORDS.map((w, idx) => {
    const matchedSentence = SENTENCES.find((s) =>
      s.targetWordIds.includes(w.id)
    );
    const stageSlug =
      w.grade === "中1"
        ? "jhs_1"
        : w.grade === "中2"
        ? "jhs_2"
        : w.grade === "中3"
        ? "jhs_3"
        : "hardcore_boss";

    return {
      id: w.id,
      stage_slug: stageSlug,
      category: w.grade,
      unit_number: 1,
      track_number: 1,
      entry_number: String(idx + 1).padStart(4, "0"),
      english: w.english,
      japanese: w.japanese,
      phonetic: w.phonetic,
      part_of_speech: w.partOfSpeech,
      tip: w.tip,
      distractors_ja: w.distractorsJa,
      distractors_en: w.distractorsEn,
      sentence_en_tokens: matchedSentence ? matchedSentence.englishTokens : [],
      sentence_ja: matchedSentence ? matchedSentence.japanese : "",
      sentence_distractor_tokens: matchedSentence
        ? matchedSentence.distractorTokens
        : [],
      grammar_point: matchedSentence ? matchedSentence.grammarPoint : "",
    };
  });

  const allEntries = [...eikenEntries, ...standardEntries];

  const { error: vocabError } = await supabase
    .from("dopaben_vocab_entries")
    .upsert(allEntries, { onConflict: "id" });

  if (vocabError) {
    return {
      ok: false,
      message: `問題データ同期エラー: ${vocabError.message}`,
    };
  }

  // キャッシュも最新DBでリフレッシュ
  await loadVocabPoolFromSupabase();

  return {
    ok: true,
    message: `Supabaseへの同期完了！ (${stages.length}ステージ / 計${allEntries.length}問)`,
    stagesCount: stages.length,
    entriesCount: allEntries.length,
  };
}
