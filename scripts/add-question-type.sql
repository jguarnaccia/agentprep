-- Add question_type column to questions table
-- This will allow us to distinguish between different types of questions

ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS question_type TEXT DEFAULT 'multiple_choice';

-- Update constraint to only allow specific types
ALTER TABLE questions 
ADD CONSTRAINT valid_question_type 
CHECK (question_type IN ('multiple_choice', 'scenario', 'true_false', 'flashcard'));

-- Create index for filtering by type
CREATE INDEX IF NOT EXISTS idx_questions_type ON questions(question_type);
