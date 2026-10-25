-- Add per-account theme preference for existing Sorai databases.
-- Run this once in the Supabase SQL Editor if user_profiles already exists.

ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS theme_preference TEXT DEFAULT NULL
CHECK (theme_preference IN ('light', 'dark'));
