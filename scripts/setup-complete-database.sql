-- AgentPrep Database Setup - Complete
-- Run this in your Supabase SQL Editor

-- Step 1: Create all tables
CREATE TABLE IF NOT EXISTS scenarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  topic TEXT NOT NULL,
  description TEXT NOT NULL,
  situation TEXT NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  explanation TEXT NOT NULL,
  key_takeaway TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  article TEXT NOT NULL,
  section TEXT,
  difficulty TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  question_id UUID NOT NULL,
  correct_count INTEGER DEFAULT 0,
  incorrect_count INTEGER DEFAULT 0,
  last_attempted TIMESTAMPTZ DEFAULT NOW(),
  mastery_level TEXT DEFAULT 'new'
);

CREATE TABLE IF NOT EXISTS test_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  time_taken INTEGER NOT NULL,
  questions JSONB NOT NULL,
  answers JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cba_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_number INTEGER NOT NULL,
  article_title TEXT NOT NULL,
  section_number TEXT,
  section_title TEXT,
  content TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  level TEXT DEFAULT 'section',
  parent_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Add missing columns (safe - does nothing if column exists)
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS mastery_level TEXT DEFAULT 'new';
ALTER TABLE cba_content ADD COLUMN IF NOT EXISTS level TEXT DEFAULT 'section';
ALTER TABLE cba_content ADD COLUMN IF NOT EXISTS parent_id UUID;
ALTER TABLE scenarios ADD COLUMN IF NOT EXISTS key_takeaway TEXT;

-- Step 3: Fix existing data (simple UPDATE statements)
UPDATE questions SET difficulty = 'Medium' WHERE difficulty NOT IN ('Easy', 'Medium', 'Hard');
UPDATE scenarios SET difficulty = 'Intermediate' WHERE difficulty NOT IN ('Beginner', 'Intermediate', 'Advanced');
UPDATE test_results SET difficulty = 'Mixed' WHERE difficulty NOT IN ('Easy', 'Medium', 'Hard', 'Mixed');
UPDATE user_progress SET mastery_level = 'new' WHERE mastery_level NOT IN ('new', 'learning', 'reviewing', 'mastered');
UPDATE cba_content SET level = 'section' WHERE level NOT IN ('article', 'section', 'subsection') OR level IS NULL;

-- Step 4: Drop old constraints
ALTER TABLE scenarios DROP CONSTRAINT IF EXISTS scenarios_difficulty_check;
ALTER TABLE questions DROP CONSTRAINT IF EXISTS questions_difficulty_check;
ALTER TABLE user_progress DROP CONSTRAINT IF EXISTS user_progress_mastery_level_check;
ALTER TABLE test_results DROP CONSTRAINT IF EXISTS test_results_difficulty_check;
ALTER TABLE cba_content DROP CONSTRAINT IF EXISTS cba_content_level_check;

-- Step 5: Add new constraints
ALTER TABLE scenarios ADD CONSTRAINT scenarios_difficulty_check CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced'));
ALTER TABLE questions ADD CONSTRAINT questions_difficulty_check CHECK (difficulty IN ('Easy', 'Medium', 'Hard'));
ALTER TABLE user_progress ADD CONSTRAINT user_progress_mastery_level_check CHECK (mastery_level IN ('new', 'learning', 'reviewing', 'mastered'));
ALTER TABLE test_results ADD CONSTRAINT test_results_difficulty_check CHECK (difficulty IN ('Easy', 'Medium', 'Hard', 'Mixed'));
ALTER TABLE cba_content ADD CONSTRAINT cba_content_level_check CHECK (level IN ('article', 'section', 'subsection'));

-- Step 6: Add unique constraints
ALTER TABLE user_progress DROP CONSTRAINT IF EXISTS user_progress_user_question_unique;
ALTER TABLE user_progress ADD CONSTRAINT user_progress_user_question_unique UNIQUE(user_id, question_id);

-- Step 7: Add foreign keys
ALTER TABLE user_progress DROP CONSTRAINT IF EXISTS user_progress_question_id_fkey;
ALTER TABLE user_progress ADD CONSTRAINT user_progress_question_id_fkey FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE;

ALTER TABLE cba_content DROP CONSTRAINT IF EXISTS cba_content_parent_id_fkey;
ALTER TABLE cba_content ADD CONSTRAINT cba_content_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES cba_content(id) ON DELETE CASCADE;

-- Step 8: Enable RLS
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cba_content ENABLE ROW LEVEL SECURITY;

-- Step 9: Create policies
DROP POLICY IF EXISTS "Anyone can read scenarios" ON scenarios;
CREATE POLICY "Anyone can read scenarios" ON scenarios FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Anyone can read questions" ON questions;
CREATE POLICY "Anyone can read questions" ON questions FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Users can read own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
CREATE POLICY "Users can read own progress" ON user_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON user_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON user_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own tests" ON test_results;
DROP POLICY IF EXISTS "Users can insert own tests" ON test_results;
DROP POLICY IF EXISTS "Users can delete own tests" ON test_results;
CREATE POLICY "Users can read own tests" ON test_results FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tests" ON test_results FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own tests" ON test_results FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own notes" ON user_notes;
DROP POLICY IF EXISTS "Users can insert own notes" ON user_notes;
DROP POLICY IF EXISTS "Users can update own notes" ON user_notes;
DROP POLICY IF EXISTS "Users can delete own notes" ON user_notes;
CREATE POLICY "Users can read own notes" ON user_notes FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notes" ON user_notes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notes" ON user_notes FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notes" ON user_notes FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can read CBA content" ON cba_content;
CREATE POLICY "Anyone can read CBA content" ON cba_content FOR SELECT TO public USING (true);

-- Step 10: Create indexes
CREATE INDEX IF NOT EXISTS idx_scenarios_difficulty ON scenarios(difficulty);
CREATE INDEX IF NOT EXISTS idx_scenarios_topic ON scenarios(topic);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_mastery ON user_progress(mastery_level);
CREATE INDEX IF NOT EXISTS idx_test_results_user_id ON test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_test_results_created_at ON test_results(created_at);
CREATE INDEX IF NOT EXISTS idx_user_notes_user_id ON user_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_category ON user_notes(category);
CREATE INDEX IF NOT EXISTS idx_cba_content_article ON cba_content(article_number);
CREATE INDEX IF NOT EXISTS idx_cba_content_order ON cba_content(order_index);

-- Step 11: Grant permissions
GRANT SELECT ON scenarios TO anon, authenticated;
GRANT SELECT ON questions TO anon, authenticated;
GRANT ALL ON user_progress TO authenticated;
GRANT ALL ON test_results TO authenticated;
GRANT ALL ON user_notes TO authenticated;
GRANT SELECT ON cba_content TO anon, authenticated;

-- Success message
SELECT 
  'Database setup complete!' AS status,
  (SELECT COUNT(*) FROM scenarios) AS scenarios,
  (SELECT COUNT(*) FROM questions) AS questions,
  (SELECT COUNT(*) FROM user_progress) AS progress,
  (SELECT COUNT(*) FROM test_results) AS tests,
  (SELECT COUNT(*) FROM user_notes) AS notes,
  (SELECT COUNT(*) FROM cba_content) AS cba;
