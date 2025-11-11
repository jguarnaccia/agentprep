-- Create AI Test Sessions Table in Supabase
-- Run this in Supabase SQL Editor

CREATE TABLE ai_test_sessions (
  id SERIAL PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  user_id TEXT,
  
  -- Test Configuration
  topic TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  question_count INTEGER NOT NULL,
  question_format TEXT NOT NULL,
  
  -- Generated Content
  questions JSONB NOT NULL,
  
  -- User Progress
  user_answers JSONB DEFAULT '[]'::jsonb,
  current_question_index INTEGER DEFAULT 0,
  
  -- Results
  score INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  time_spent INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  
  CONSTRAINT valid_difficulty CHECK (difficulty IN ('easy', 'medium', 'hard')),
  CONSTRAINT valid_format CHECK (question_format IN ('multiple_choice', 'true_false', 'scenario'))
);

-- Create index for faster lookups
CREATE INDEX idx_ai_test_sessions_session_id ON ai_test_sessions(session_id);
CREATE INDEX idx_ai_test_sessions_created_at ON ai_test_sessions(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE ai_test_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for now, can be restricted later)
CREATE POLICY "Allow all operations on ai_test_sessions"
  ON ai_test_sessions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Grant permissions
GRANT ALL ON ai_test_sessions TO anon;
GRANT ALL ON ai_test_sessions TO authenticated;
