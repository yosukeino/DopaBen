-- =========================================================================
-- DopaBen: 全国ランキングバトル用テーブル
-- 英語（英検4級等）、社会、数学、理科、国語など全教科で共通利用可能！
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.dopaben_rankings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL DEFAULT 'english', -- 教科: 'english', 'social', 'math' など
  course text NOT NULL DEFAULT 'eiken4',   -- コース/ステージ: 'eiken4', 'social_all' など
  player_uuid text NOT NULL DEFAULT '',    -- 端末UUID（匿名識別用）
  player_name text NOT NULL,               -- プレイヤーの表示名
  score int NOT NULL,                      -- 正解数 (0..20)
  total_questions int NOT NULL DEFAULT 20, -- 出題総数
  time_ms int NOT NULL,                   -- 所要時間（ミリ秒）
  game_points int NOT NULL DEFAULT 0,     -- 総合スコア（ポイント）
  max_combo int NOT NULL DEFAULT 0,       -- 最大コンボ数
  created_at timestamptz DEFAULT now()
);

-- リーダーボード検索用インデックス（教科・コース別、正解数降順、クリアタイム昇順）
CREATE INDEX IF NOT EXISTS idx_dopaben_rankings_board ON public.dopaben_rankings (subject, course, score DESC, time_ms ASC);
CREATE INDEX IF NOT EXISTS idx_dopaben_rankings_course_board ON public.dopaben_rankings (course, score DESC, time_ms ASC);
CREATE INDEX IF NOT EXISTS idx_dopaben_rankings_uuid ON public.dopaben_rankings (player_uuid);
CREATE INDEX IF NOT EXISTS idx_dopaben_rankings_created ON public.dopaben_rankings (created_at DESC);

-- RLS設定 (公開読み取り & 匿名書き込み許可)
ALTER TABLE public.dopaben_rankings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_dopaben_rankings" ON public.dopaben_rankings;
CREATE POLICY "anon_select_dopaben_rankings" ON public.dopaben_rankings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_dopaben_rankings" ON public.dopaben_rankings;
CREATE POLICY "anon_insert_dopaben_rankings" ON public.dopaben_rankings FOR INSERT
  TO anon, authenticated WITH CHECK (true);
