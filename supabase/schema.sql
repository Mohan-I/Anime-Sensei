-- =============================================
-- Anime Sensei: user_anime_list — Firebase Auth edition
--
-- KEY DIFFERENCE FROM ORIGINAL SCHEMA
-- ─────────────────────────────────────
-- `user_id` is TEXT (Firebase UID), NOT UUID / FK to auth.users.
-- RLS policies are permissive — row filtering happens in the
-- service layer via WHERE user_id = $firebaseUid.
--
-- Run AFTER setup_user_profiles.sql.
-- =============================================

-- ── Drop old UUID-based table if present ─────────────────────────────────
DROP TABLE IF EXISTS public.user_anime_list CASCADE;
DROP VIEW  IF EXISTS public.user_anime_stats  CASCADE;

-- ── 1. Create table ───────────────────────────────────────────────────────
CREATE TABLE public.user_anime_list (
  id              UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         TEXT        NOT NULL,              -- Firebase UID (TEXT, not UUID)
  mal_id          INTEGER     NOT NULL,
  status          TEXT        NOT NULL
                    CHECK (status IN ('watching','completed','paused','dropped','planned')),
  score           INTEGER     CHECK (score >= 1 AND score <= 10),
  progress_ep     INTEGER     NOT NULL DEFAULT 0,
  total_ep        INTEGER,
  anime_title     TEXT        NOT NULL,
  anime_image_url TEXT,
  anime_year      INTEGER,
  anime_type      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (user_id, mal_id)
);

-- ── 2. Enable RLS ─────────────────────────────────────────────────────────
ALTER TABLE public.user_anime_list ENABLE ROW LEVEL SECURITY;

-- ── 3. Permissive policies (anon key + service-layer WHERE filters) ───────
CREATE POLICY "anon_select"  ON public.user_anime_list FOR SELECT  USING (true);
CREATE POLICY "anon_insert"  ON public.user_anime_list FOR INSERT  WITH CHECK (true);
CREATE POLICY "anon_update"  ON public.user_anime_list FOR UPDATE  USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete"  ON public.user_anime_list FOR DELETE  USING (true);

-- ── 4. updated_at trigger ─────────────────────────────────────────────────
-- (set_updated_at() is created in setup_user_profiles.sql — run that first)
DROP TRIGGER IF EXISTS trg_user_anime_list_updated_at ON public.user_anime_list;
CREATE TRIGGER trg_user_anime_list_updated_at
  BEFORE UPDATE ON public.user_anime_list
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── 5. Per-user stats VIEW ────────────────────────────────────────────────
CREATE OR REPLACE VIEW public.user_anime_stats AS
SELECT
  user_id,
  COUNT(*)                                                 AS total_anime,
  COUNT(*) FILTER (WHERE status = 'watching')              AS watching_count,
  COUNT(*) FILTER (WHERE status = 'completed')             AS completed_count,
  COUNT(*) FILTER (WHERE status = 'planned')               AS planned_count,
  COUNT(*) FILTER (WHERE status = 'dropped')               AS dropped_count,
  COUNT(*) FILTER (WHERE status = 'paused')                AS paused_count,
  COALESCE(SUM(progress_ep), 0)                            AS total_episodes_watched,
  ROUND(AVG(score) FILTER (WHERE score IS NOT NULL), 1)    AS avg_score
FROM public.user_anime_list
GROUP BY user_id;
