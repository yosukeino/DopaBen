-- ============================================================
-- 『ドパベン (DopaBen)』 汎用ボキャブラリー＆ステージ DBスキーマ
-- Supabase SQL Editor にそのまま貼り付けて実行できます
-- ============================================================

-- 1. ステージ管理テーブル（英検1級 Unit 01, Unit 02..., 中1, 中2, 中3, TOEIC等）
CREATE TABLE IF NOT EXISTS public.dopaben_stages (
  slug TEXT PRIMARY KEY,                  -- 例: 'eiken1_unit01', 'jhs_1'
  category TEXT NOT NULL,                 -- 例: '英検1級', '中1', '中2', '中3', '激ムズ'
  unit_number INTEGER NOT NULL DEFAULT 1, -- 例: 1 (Unit 01)
  title TEXT NOT NULL,                    -- 例: '👑 英検1級 単語ステージ【Unit 01】'
  subtitle TEXT NOT NULL DEFAULT '',      -- 例: '全96語 (0001〜0096)'
  sort_order INTEGER NOT NULL DEFAULT 10,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. 汎用英単語＆例文マスターテーブル
-- 1レコードに「英単語・発音・品詞・日本語訳・記憶ヒント・公式例文チャンク」を統合！
-- これ1つから4形式（英→日 / 日→英 / リスニング / 総攻撃ワードバンク並び替え）を自動生成します。
CREATE TABLE IF NOT EXISTS public.dopaben_vocab_entries (
  id TEXT PRIMARY KEY,                                  -- 例: 'eiken1_0001', 'w_m1_1'
  stage_slug TEXT NOT NULL REFERENCES public.dopaben_stages(slug) ON DELETE CASCADE,
  category TEXT NOT NULL,                               -- 例: '英検1級', '中1', '中2', '中3', '激ムズ'
  unit_number INTEGER NOT NULL DEFAULT 1,               -- 例: 1 (Unit 01)
  track_number INTEGER NOT NULL DEFAULT 0,              -- 例: 1〜8 (Track 001〜008), 0はトラックなし
  entry_number TEXT NOT NULL DEFAULT '',                -- 例: '0001'〜'0096'
  english TEXT NOT NULL,                                -- 例: 'lucrative'
  japanese TEXT NOT NULL,                               -- 例: 'もうかる、利益の上がる'
  phonetic TEXT NOT NULL DEFAULT '',                    -- 例: '[lúːkrətɪv]'
  part_of_speech TEXT NOT NULL DEFAULT '',              -- 例: '形容詞'
  tip TEXT NOT NULL DEFAULT '',                         -- ミス時に1行で出る記憶フック（語源・コロケーション・類義語）
  distractors_ja JSONB NOT NULL DEFAULT '[]'::jsonb,    -- 空配列なら同じ品詞・同じステージから自動生成
  distractors_en JSONB NOT NULL DEFAULT '[]'::jsonb,    -- 空配列なら同じ品詞・同じステージから自動生成
  sentence_en_tokens JSONB NOT NULL DEFAULT '[]'::jsonb,-- 例: ["My", "brother", "quit", "his", "company", ...]
  sentence_ja TEXT NOT NULL DEFAULT '',                 -- 例: '私の兄はより実入りのいい仕事に就くために会社を辞めた。'
  sentence_distractor_tokens JSONB NOT NULL DEFAULT '[]'::jsonb,
  grammar_point TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 高速検索用インデックス
CREATE INDEX IF NOT EXISTS idx_dopaben_vocab_stage_track
  ON public.dopaben_vocab_entries (stage_slug, track_number);

CREATE INDEX IF NOT EXISTS idx_dopaben_vocab_category
  ON public.dopaben_vocab_entries (category, track_number);

-- Row Level Security (RLS) の設定
ALTER TABLE public.dopaben_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dopaben_vocab_entries ENABLE ROW LEVEL SECURITY;

-- 誰でも問題データを読み取れるポリシー (Public Read)
DROP POLICY IF EXISTS "Allow public read on dopaben_stages" ON public.dopaben_stages;
CREATE POLICY "Allow public read on dopaben_stages"
  ON public.dopaben_stages FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow public read on dopaben_vocab_entries" ON public.dopaben_vocab_entries;
CREATE POLICY "Allow public read on dopaben_vocab_entries"
  ON public.dopaben_vocab_entries FOR SELECT
  USING (true);

-- 初期データ投入・問題追加用ポリシー (Anon/Service Role での Upsert を許可)
DROP POLICY IF EXISTS "Allow upsert on dopaben_stages" ON public.dopaben_stages;
CREATE POLICY "Allow upsert on dopaben_stages"
  ON public.dopaben_stages FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow upsert on dopaben_vocab_entries" ON public.dopaben_vocab_entries;
CREATE POLICY "Allow upsert on dopaben_vocab_entries"
  ON public.dopaben_vocab_entries FOR ALL
  USING (true)
  WITH CHECK (true);
