-- AI Test Sessions Table
-- Stores each test generation request
CREATE TABLE ai_test_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT,  -- For future auth integration
  test_config JSONB NOT NULL,  -- Stores: topics, difficulty, question_count
  questions JSONB NOT NULL,  -- Array of generated questions
  created_at TIMESTAMP DEFAULT NOW()
);

-- AI Test Results Table
-- Stores user answers and scores
CREATE TABLE ai_test_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES ai_test_sessions(id),
  user_id TEXT,
  answers JSONB NOT NULL,  -- User's answers
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  completed_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_ai_test_sessions_user ON ai_test_sessions(user_id);
CREATE INDEX idx_ai_test_results_session ON ai_test_results(session_id);
CREATE INDEX idx_ai_test_results_user ON ai_test_results(user_id);

-- Sample test config structure:
-- {
--   "topics": ["salary-cap", "luxury-tax"],
--   "difficulty": "medium",
--   "question_count": 20,
--   "articles": ["Article VII", "Article VIII"]
-- }

-- Sample questions structure:
-- [
--   {
--     "id": 1,
--     "question": "What is the luxury tax threshold?",
--     "options": ["$150M", "$165M", "$171M", "$180M"],
--     "correct": 2,
--     "explanation": "The 2023-24 luxury tax threshold is $171M",
--     "citation": "Article VII, Section 1",
--     "topic": "luxury-tax",
--     "difficulty": "medium"
--   }
-- ]
