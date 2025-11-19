-- ============================================================================
-- SPACED REPETITION SYSTEM (SRS) - Database Migration
-- ============================================================================
-- This adds SRS capabilities to StadiumU for optimal learning intervals
-- Based on SuperMemo SM-2 algorithm with custom modifications

-- ============================================================================
-- STEP 1: Add SRS columns to user_progress table
-- ============================================================================

-- Add columns for spaced repetition (safe - does nothing if columns exist)
ALTER TABLE user_progress 
  ADD COLUMN IF NOT EXISTS next_review_date TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS ease_factor DECIMAL(3,2) DEFAULT 2.50,
  ADD COLUMN IF NOT EXISTS interval_days INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS consecutive_correct INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_review_date TIMESTAMPTZ;

-- Add helpful comment
COMMENT ON COLUMN user_progress.next_review_date IS 'When this question should be reviewed next (SRS)';
COMMENT ON COLUMN user_progress.ease_factor IS 'SM-2 ease factor (1.30-2.50), higher = easier';
COMMENT ON COLUMN user_progress.interval_days IS 'Current interval in days between reviews';
COMMENT ON COLUMN user_progress.consecutive_correct IS 'Number of correct answers in a row';
COMMENT ON COLUMN user_progress.last_review_date IS 'Last time this question was reviewed';

-- ============================================================================
-- STEP 2: Create flashcard_progress table (if it doesn't exist)
-- ============================================================================

CREATE TABLE IF NOT EXISTS flashcard_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  flashcard_id UUID NOT NULL,
  correct_count INTEGER DEFAULT 0,
  incorrect_count INTEGER DEFAULT 0,
  last_attempted TIMESTAMPTZ DEFAULT NOW(),
  mastery_level TEXT DEFAULT 'new' CHECK (mastery_level IN ('new', 'learning', 'reviewing', 'mastered')),
  
  -- SRS columns
  next_review_date TIMESTAMPTZ DEFAULT NOW(),
  ease_factor DECIMAL(3,2) DEFAULT 2.50,
  interval_days INTEGER DEFAULT 1,
  consecutive_correct INTEGER DEFAULT 0,
  last_review_date TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one record per user per flashcard
  UNIQUE(user_id, flashcard_id)
);

-- Add helpful comments
COMMENT ON TABLE flashcard_progress IS 'Tracks user progress on flashcards with SRS';
COMMENT ON COLUMN flashcard_progress.next_review_date IS 'When this flashcard should be reviewed next (SRS)';
COMMENT ON COLUMN flashcard_progress.ease_factor IS 'SM-2 ease factor (1.30-2.50), higher = easier';
COMMENT ON COLUMN flashcard_progress.interval_days IS 'Current interval in days between reviews';
COMMENT ON COLUMN flashcard_progress.consecutive_correct IS 'Number of correct answers in a row';

-- ============================================================================
-- STEP 3: Initialize existing records with SRS defaults
-- ============================================================================

-- Update existing user_progress records that don't have SRS data
UPDATE user_progress 
SET 
  next_review_date = NOW(),
  ease_factor = 2.50,
  interval_days = 1,
  consecutive_correct = 0,
  last_review_date = last_attempted
WHERE next_review_date IS NULL;

-- Update existing flashcard_progress records (if any exist)
UPDATE flashcard_progress 
SET 
  next_review_date = NOW(),
  ease_factor = 2.50,
  interval_days = 1,
  consecutive_correct = 0,
  last_review_date = last_attempted
WHERE next_review_date IS NULL;

-- ============================================================================
-- STEP 4: Create indexes for efficient SRS queries
-- ============================================================================

-- Index for finding due questions/flashcards
CREATE INDEX IF NOT EXISTS idx_user_progress_next_review 
  ON user_progress(user_id, next_review_date);

CREATE INDEX IF NOT EXISTS idx_flashcard_progress_next_review 
  ON flashcard_progress(user_id, next_review_date);

-- Index for mastery level filtering
CREATE INDEX IF NOT EXISTS idx_user_progress_mastery_review 
  ON user_progress(user_id, mastery_level, next_review_date);

CREATE INDEX IF NOT EXISTS idx_flashcard_progress_mastery_review 
  ON flashcard_progress(user_id, mastery_level, next_review_date);

-- ============================================================================
-- STEP 5: Enable RLS for flashcard_progress
-- ============================================================================

ALTER TABLE flashcard_progress ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own flashcard progress" ON flashcard_progress;
DROP POLICY IF EXISTS "Users can insert own flashcard progress" ON flashcard_progress;
DROP POLICY IF EXISTS "Users can update own flashcard progress" ON flashcard_progress;

-- Create new policies
CREATE POLICY "Users can read own flashcard progress" 
  ON flashcard_progress 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own flashcard progress" 
  ON flashcard_progress 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own flashcard progress" 
  ON flashcard_progress 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- ============================================================================
-- STEP 6: Create helpful views for SRS analytics
-- ============================================================================

-- View: Questions due for review
CREATE OR REPLACE VIEW questions_due_for_review AS
SELECT 
  up.*,
  q.question,
  q.difficulty,
  q.category,
  CASE 
    WHEN up.next_review_date <= NOW() THEN 'Due'
    WHEN up.next_review_date <= NOW() + INTERVAL '1 day' THEN 'Due Soon'
    ELSE 'Scheduled'
  END AS review_status,
  EXTRACT(EPOCH FROM (up.next_review_date - NOW())) / 3600 AS hours_until_due
FROM user_progress up
JOIN questions q ON up.question_id = q.id
WHERE up.next_review_date IS NOT NULL;

COMMENT ON VIEW questions_due_for_review IS 'Shows all questions with their review status and timing';

-- View: Flashcards due for review
CREATE OR REPLACE VIEW flashcards_due_for_review AS
SELECT 
  fp.*,
  f.front,
  f.back,
  f.article_number,
  CASE 
    WHEN fp.next_review_date <= NOW() THEN 'Due'
    WHEN fp.next_review_date <= NOW() + INTERVAL '1 day' THEN 'Due Soon'
    ELSE 'Scheduled'
  END AS review_status,
  EXTRACT(EPOCH FROM (fp.next_review_date - NOW())) / 3600 AS hours_until_due
FROM flashcard_progress fp
JOIN flashcards f ON fp.flashcard_id = f.id
WHERE fp.next_review_date IS NOT NULL;

COMMENT ON VIEW flashcards_due_for_review IS 'Shows all flashcards with their review status and timing';

-- View: User SRS statistics
CREATE OR REPLACE VIEW user_srs_stats AS
SELECT 
  user_id,
  
  -- Question stats
  COUNT(DISTINCT CASE WHEN up.mastery_level = 'new' THEN up.id END) AS new_questions,
  COUNT(DISTINCT CASE WHEN up.mastery_level = 'learning' THEN up.id END) AS learning_questions,
  COUNT(DISTINCT CASE WHEN up.mastery_level = 'reviewing' THEN up.id END) AS reviewing_questions,
  COUNT(DISTINCT CASE WHEN up.mastery_level = 'mastered' THEN up.id END) AS mastered_questions,
  COUNT(DISTINCT CASE WHEN up.next_review_date <= NOW() THEN up.id END) AS questions_due,
  COUNT(DISTINCT CASE WHEN up.next_review_date <= NOW() + INTERVAL '1 day' THEN up.id END) AS questions_due_soon,
  
  -- Flashcard stats
  COUNT(DISTINCT CASE WHEN fp.mastery_level = 'new' THEN fp.id END) AS new_flashcards,
  COUNT(DISTINCT CASE WHEN fp.mastery_level = 'learning' THEN fp.id END) AS learning_flashcards,
  COUNT(DISTINCT CASE WHEN fp.mastery_level = 'reviewing' THEN fp.id END) AS reviewing_flashcards,
  COUNT(DISTINCT CASE WHEN fp.mastery_level = 'mastered' THEN fp.id END) AS mastered_flashcards,
  COUNT(DISTINCT CASE WHEN fp.next_review_date <= NOW() THEN fp.id END) AS flashcards_due,
  COUNT(DISTINCT CASE WHEN fp.next_review_date <= NOW() + INTERVAL '1 day' THEN fp.id END) AS flashcards_due_soon,
  
  -- Overall stats
  ROUND(AVG(up.ease_factor), 2) AS avg_question_ease,
  ROUND(AVG(fp.ease_factor), 2) AS avg_flashcard_ease,
  ROUND(AVG(up.interval_days), 1) AS avg_question_interval,
  ROUND(AVG(fp.interval_days), 1) AS avg_flashcard_interval
  
FROM auth.users u
LEFT JOIN user_progress up ON u.id = up.user_id
LEFT JOIN flashcard_progress fp ON u.id = fp.user_id
GROUP BY user_id;

COMMENT ON VIEW user_srs_stats IS 'Comprehensive SRS statistics per user for dashboard display';

-- ============================================================================
-- STEP 7: Grant permissions
-- ============================================================================

GRANT ALL ON flashcard_progress TO authenticated;
GRANT SELECT ON questions_due_for_review TO authenticated;
GRANT SELECT ON flashcards_due_for_review TO authenticated;
GRANT SELECT ON user_srs_stats TO authenticated;

-- ============================================================================
-- STEP 8: Success verification
-- ============================================================================

-- Show current state
SELECT 
  'SRS System installed successfully!' AS status,
  
  -- Table counts
  (SELECT COUNT(*) FROM user_progress) AS total_question_progress,
  (SELECT COUNT(*) FROM flashcard_progress) AS total_flashcard_progress,
  
  -- SRS-enabled records
  (SELECT COUNT(*) FROM user_progress WHERE next_review_date IS NOT NULL) AS questions_with_srs,
  (SELECT COUNT(*) FROM flashcard_progress WHERE next_review_date IS NOT NULL) AS flashcards_with_srs,
  
  -- Due items
  (SELECT COUNT(*) FROM user_progress WHERE next_review_date <= NOW()) AS questions_due_now,
  (SELECT COUNT(*) FROM flashcard_progress WHERE next_review_date <= NOW()) AS flashcards_due_now;

-- ============================================================================
-- NOTES:
-- ============================================================================
-- 1. All existing progress records are initialized with default SRS values
-- 2. next_review_date starts at NOW() so items appear as "due" immediately
-- 3. ease_factor starts at 2.50 (optimal for new material)
-- 4. interval_days starts at 1 (first review after 1 day)
-- 5. Views provide real-time analytics for the dashboard
-- 6. Indexes ensure fast queries even with thousands of records
-- ============================================================================
