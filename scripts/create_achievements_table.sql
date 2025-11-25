-- ============================================================================
-- ACHIEVEMENTS SYSTEM DATABASE SCHEMA
-- ============================================================================
-- Creates the user_achievements table to track unlocked achievements
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure a user can only unlock each achievement once
  UNIQUE(user_id, achievement_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id 
  ON user_achievements(user_id);

CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id 
  ON user_achievements(achievement_id);

CREATE INDEX IF NOT EXISTS idx_user_achievements_unlocked_at 
  ON user_achievements(unlocked_at DESC);

-- Enable Row Level Security
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only read their own achievements
CREATE POLICY "Users can view own achievements" 
  ON user_achievements
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own achievements
CREATE POLICY "Users can unlock own achievements"
  ON user_achievements
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Optional: Allow users to delete their own achievements (for testing)
CREATE POLICY "Users can delete own achievements"
  ON user_achievements
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these to verify the table was created correctly:
-- 
-- 1. Check table structure:
--    SELECT * FROM information_schema.columns WHERE table_name = 'user_achievements';
--
-- 2. Check indexes:
--    SELECT * FROM pg_indexes WHERE tablename = 'user_achievements';
--
-- 3. Check RLS policies:
--    SELECT * FROM pg_policies WHERE tablename = 'user_achievements';
-- ============================================================================
