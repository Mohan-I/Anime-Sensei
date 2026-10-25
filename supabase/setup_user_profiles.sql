-- =============================================
-- Anime Sensei: user_profiles table + RLS
-- Run this first in your Supabase SQL Editor.
-- =============================================

-- 1. Create the table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id              UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  firebase_uid    TEXT        UNIQUE,                      -- bridges Firebase ↔ Supabase
  username        TEXT,
  display_name    TEXT,
  avatar_url      TEXT        DEFAULT NULL,
  banner_idx      INTEGER     DEFAULT 0,
  favorite_genres TEXT[]      DEFAULT '{}',
  last_visited    JSONB       DEFAULT NULL,
  preferences     JSONB       NOT NULL DEFAULT '{}'::jsonb,
  subscription    JSONB       NOT NULL DEFAULT '{"plan":"basic","status":"default"}'::jsonb,
  age             INTEGER,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Add profile data fields when upgrading an existing installation.
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS last_visited JSONB DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS subscription JSONB NOT NULL DEFAULT '{"plan":"basic","status":"default"}'::jsonb;

-- 2. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 3. Policies — users can only see / mutate their own row
CREATE POLICY "Users can read own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- 4. Auto-create a profile row the moment a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Back-fill for any users already in auth.users
INSERT INTO public.user_profiles (id)
SELECT id FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 6. updated_at auto-stamp trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER set_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
