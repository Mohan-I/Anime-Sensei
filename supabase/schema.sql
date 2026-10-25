-- =============================================
-- Anime Sensei: user_anime_list table + RLS
-- Run this AFTER setup_user_profiles.sql.
-- =============================================

-- 1. Main list table
CREATE TABLE IF NOT EXISTS public.user_anime_list (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mal_id          INTEGER     NOT NULL,
  status          TEXT        NOT NULL
                  CHECK (status IN ('watching', 'completed', 'paused', 'dropped', 'planned')),
  score           INTEGER     CHECK (score >= 1 AND score <= 10),
  progress_ep     INTEGER     DEFAULT 0,   -- episodes watched so far
  total_ep        INTEGER,                 -- total episodes (null = ongoing)
  anime_title     TEXT        NOT NULL,
  anime_image_url TEXT,
  anime_year      INTEGER,
  anime_type      TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),

  UNIQUE (user_id, mal_id)
);

-- 2. Enable RLS
ALTER TABLE public.user_anime_list ENABLE ROW LEVEL SECURITY;

-- 3. Row-level policies
CREATE POLICY "Users can view their own list"
  ON public.user_anime_list FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own list"
  ON public.user_anime_list FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own list"
  ON public.user_anime_list FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own list"
  ON public.user_anime_list FOR DELETE
  USING (auth.uid() = user_id);

-- 4. updated_at auto-stamp
DROP TRIGGER IF EXISTS set_user_anime_list_updated_at ON public.user_anime_list;
CREATE TRIGGER set_user_anime_list_updated_at
  BEFORE UPDATE ON public.user_anime_list
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================
-- Derived stats VIEW (used by the Profile page)
-- Returns one row per user: watched, completed,
-- total episodes, distinct score counts.
-- =============================================
CREATE OR REPLACE VIEW public.user_anime_stats AS
SELECT
  user_id,
  COUNT(*)                                               AS total_anime,
  COUNT(*) FILTER (WHERE status = 'watching')            AS watching_count,
  COUNT(*) FILTER (WHERE status = 'completed')           AS completed_count,
  COUNT(*) FILTER (WHERE status = 'planned')             AS planned_count,
  COUNT(*) FILTER (WHERE status = 'dropped')             AS dropped_count,
  COUNT(*) FILTER (WHERE status = 'paused')              AS paused_count,
  COALESCE(SUM(progress_ep), 0)                          AS total_episodes_watched,
  ROUND(AVG(score) FILTER (WHERE score IS NOT NULL), 1)  AS avg_score
FROM public.user_anime_list
GROUP BY user_id;

-- RLS on the view: restrict to own row
ALTER VIEW public.user_anime_stats OWNER TO postgres;
