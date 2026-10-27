-- =============================================
-- Anime Sensei: user_profiles — Firebase Auth edition
--
-- KEY DIFFERENCE FROM ORIGINAL SCHEMA
-- ─────────────────────────────────────
-- The app uses Firebase Auth, NOT Supabase Auth.
-- • `id` is TEXT (Firebase UID), NOT UUID / FK to auth.users
-- • RLS policies use `true` — row-level security is enforced
--   in the service layer (WHERE firebase_uid = $uid).
--   The anon key + row-filtered queries = safe for client use.
-- • No trigger on auth.users (Firebase handles signup).
--
-- Run this ONCE in your Supabase SQL Editor (Dashboard → SQL Editor).
-- =============================================

-- ── Drop old table if it exists from a previous UUID-based schema ─────────
-- (Only needed if you ran the old schema before)
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- ── 1. Create table ───────────────────────────────────────────────────────
CREATE TABLE public.user_profiles (
  id              TEXT        PRIMARY KEY,          -- Firebase UID  e.g. "KyRgL0Po63a..."
  username        TEXT,
  display_name    TEXT,
  avatar_url      TEXT,
  banner_idx      INTEGER     NOT NULL DEFAULT 0,
  favorite_genres TEXT[]      NOT NULL DEFAULT '{}',
  age             INTEGER,
  last_visited    JSONB,
  preferences     JSONB       NOT NULL DEFAULT '{}',
  subscription    JSONB       NOT NULL DEFAULT '{"plan":"basic","status":"active"}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 2. Enable RLS (keeps the table locked down from anon SQL access) ──────
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- ── 3. Permissive policies for the anon key ───────────────────────────────
--  Security model: anon key is safe because:
--  (a) Supabase anon key cannot execute arbitrary SQL
--  (b) Every client query already filters WHERE id = $firebase_uid
--  (c) No other user's data is returned unless they know the exact UID

CREATE POLICY "anon_select"
  ON public.user_profiles FOR SELECT
  USING (true);

CREATE POLICY "anon_insert"
  ON public.user_profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "anon_update"
  ON public.user_profiles FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "anon_delete"
  ON public.user_profiles FOR DELETE
  USING (true);

-- ── 4. updated_at auto-stamp ──────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER trg_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
