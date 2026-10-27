-- ============================================================
-- Step 1: Drop dependent views and all RLS policies (to resolve the "cannot alter type" error)
-- ============================================================
DROP VIEW IF EXISTS public.user_anime_stats CASCADE;

-- Drop all policies on user_anime_list that may reference user_id
DROP POLICY IF EXISTS "Users can view their own list" ON public.user_anime_list;
DROP POLICY IF EXISTS "Users can insert into their own list" ON public.user_anime_list;
DROP POLICY IF EXISTS "Users can update their own list" ON public.user_anime_list;
DROP POLICY IF EXISTS "Users can delete from their own list" ON public.user_anime_list;
DROP POLICY IF EXISTS "anon_select" ON public.user_anime_list;
DROP POLICY IF EXISTS "anon_insert" ON public.user_anime_list;
DROP POLICY IF EXISTS "anon_update" ON public.user_anime_list;
DROP POLICY IF EXISTS "anon_delete" ON public.user_anime_list;
DROP POLICY IF EXISTS "Enable all access for user anime list" ON public.user_anime_list;

-- Drop all policies on user_profiles
DROP POLICY IF EXISTS "Users can read own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable insert/update for users" ON public.user_profiles;
DROP POLICY IF EXISTS "anon_select" ON public.user_profiles;
DROP POLICY IF EXISTS "anon_insert" ON public.user_profiles;
DROP POLICY IF EXISTS "anon_update" ON public.user_profiles;
DROP POLICY IF EXISTS "anon_delete" ON public.user_profiles;


-- ============================================================
-- Step 2: Remove foreign key constraints (to resolve the "text and uuid incompatible" error)
-- ============================================================
-- This is the key! The foreign key to auth.users(id) must be dropped, because auth.users.id is UUID type
ALTER TABLE public.user_anime_list DROP CONSTRAINT IF EXISTS user_anime_list_user_id_fkey;

-- For user_profiles, first drop the foreign key, then drop the primary key (to allow type change)
ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_id_fkey;
ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_pkey;
ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_firebase_uid_key;

-- Remove the redundant firebase_uid column
ALTER TABLE public.user_profiles DROP COLUMN IF EXISTS firebase_uid;


-- ============================================================
-- Step 3: Safely modify column types (now that there are no policy or foreign key dependencies)
-- ============================================================
-- Modify user_anime_list.user_id
ALTER TABLE public.user_anime_list
  ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;

-- Modify user_profiles.id
ALTER TABLE public.user_profiles
  ALTER COLUMN id TYPE TEXT USING id::TEXT;

-- Restore the primary key for user_profiles
ALTER TABLE public.user_profiles
  ADD PRIMARY KEY (id);


-- ============================================================
-- Step 4: Rebuild permissive RLS policies (your application layer uses Firebase UID to filter)
-- ============================================================
-- Policies for user_anime_list
CREATE POLICY "open_select" ON public.user_anime_list FOR SELECT USING (true);
CREATE POLICY "open_insert" ON public.user_anime_list FOR INSERT WITH CHECK (true);
CREATE POLICY "open_update" ON public.user_anime_list FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "open_delete" ON public.user_anime_list FOR DELETE USING (true);

-- Policies for user_profiles
CREATE POLICY "open_select" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "open_insert" ON public.user_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "open_update" ON public.user_profiles FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "open_delete" ON public.user_profiles FOR DELETE USING (true);


-- ============================================================
-- Step 5: Rebuild the stats view
-- ============================================================
CREATE OR REPLACE VIEW public.user_anime_stats AS
SELECT
  user_id,
  COUNT(*)                                                AS total_anime,
  COUNT(*) FILTER (WHERE status = 'watching')             AS watching_count,
  COUNT(*) FILTER (WHERE status = 'completed')            AS completed_count,
  COUNT(*) FILTER (WHERE status = 'planned')              AS planned_count,
  COUNT(*) FILTER (WHERE status = 'dropped')              AS dropped_count,
  COUNT(*) FILTER (WHERE status = 'paused')               AS paused_count,
  COALESCE(SUM(progress_ep), 0)                           AS total_episodes_watched,
  ROUND(AVG(score) FILTER (WHERE score IS NOT NULL), 1)   AS avg_score
FROM public.user_anime_list
GROUP BY user_id;