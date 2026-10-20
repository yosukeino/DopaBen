-- =========================================================================
-- DopaBen: 全国ランキングバトル用テーブル
-- =========================================================================

CREATE TABLE IF NOT EXISTS dopaben_rankings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_uuid text NOT NULL DEFAULT '',
  player_name text NOT NULL,
  score int NOT NULL,                  -- 正解数 (0..20)
  total_questions int NOT NULL DEFAULT 20,
  time_ms int NOT NULL,                -- 所要時間（ミリ秒）
  game_points int NOT NULL DEFAULT 0,  -- 総合スコア
  max_combo int NOT NULL DEFAULT 0,    -- 最大コンボ
  course text NOT NULL DEFAULT 'eiken4',
  created_at timestamptz DEFAULT now()
);

-- インデックス作成（リーダーボード検索高速化）
CREATE INDEX IF NOT EXISTS idx_dopaben_rankings_board ON dopaben_rankings (course, score DESC, time_ms ASC);
CREATE INDEX IF NOT EXISTS idx_dopaben_rankings_uuid ON dopaben_rankings (player_uuid);
CREATE INDEX IF NOT EXISTS idx_dopaben_rankings_created ON dopaben_rankings (created_at DESC);

-- RLS設定 (公開読み取り & 匿名書き込み許可)
ALTER TABLE dopaben_rankings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_dopaben_rankings" ON dopaben_rankings;
CREATE POLICY "anon_select_dopaben_rankings" ON dopaben_rankings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_dopaben_rankings" ON dopaben_rankings;
CREATE POLICY "anon_insert_dopaben_rankings" ON dopaben_rankings FOR INSERT
  TO anon, authenticated WITH CHECK (true);
