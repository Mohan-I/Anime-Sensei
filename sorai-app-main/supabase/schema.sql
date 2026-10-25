-- ============================================
-- Sorai App: user_anime_list table + RLS
-- Run this in your Supabase SQL Editor
-- ============================================

CREATE TABLE user_anime_list (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mal_id INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('watching', 'completed', 'paused', 'dropped', 'planned')),
  score INTEGER CHECK (score >= 1 AND score <= 10),
  anime_title TEXT NOT NULL,
  anime_image_url TEXT,
  anime_year INTEGER,
  anime_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, mal_id)
);

-- Row Level Security
ALTER TABLE user_anime_list ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own list"
  ON user_anime_list FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own list"
  ON user_anime_list FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own list"
  ON user_anime_list FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own list"
  ON user_anime_list FOR DELETE
  USING (auth.uid() = user_id);
