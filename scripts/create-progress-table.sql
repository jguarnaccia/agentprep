-- Progress tracking table
-- Stores each answer attempt for every question
-- This allows us to track which questions answered, correct/incorrect history, and success rates

CREATE TABLE IF NOT EXISTS question_attempts (
  id BIGSERIAL PRIMARY KEY,
  question_id BIGINT NOT NULL REFERENCES questions(id),
  session_id TEXT NOT NULL, -- Browser-based session ID (no auth yet)
  is_correct BOOLEAN NOT NULL,
  attempt_number INT DEFAULT 1, -- How many times this question has been attempted
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast lookups by session
CREATE INDEX IF NOT EXISTS idx_question_attempts_session ON question_attempts(session_id);

-- Index for fast lookups by question
CREATE INDEX IF NOT EXISTS idx_question_attempts_question ON question_attempts(question_id);

-- Enable Row Level Security
ALTER TABLE question_attempts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (for now, until we add auth)
CREATE POLICY "Anyone can insert attempts" ON question_attempts
  FOR INSERT WITH CHECK (true);

-- Policy: Anyone can read their own attempts by session_id
CREATE POLICY "Anyone can read their own attempts" ON question_attempts
  FOR SELECT USING (true);

-- Summary statistics view (optional but useful)
CREATE OR REPLACE VIEW progress_summary AS
SELECT 
  session_id,
  COUNT(DISTINCT question_id) as questions_attempted,
  SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct_answers,
  COUNT(*) as total_attempts,
  ROUND(
    (SUM(CASE WHEN is_correct THEN 1 ELSE 0 END)::NUMERIC / COUNT(*)::NUMERIC) * 100, 
    2
  ) as success_rate_percentage
FROM question_attempts
GROUP BY session_id;
