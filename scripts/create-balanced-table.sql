-- Create balanced flashcards table
-- Run this in Supabase SQL Editor first

CREATE OR REPLACE FUNCTION create_balanced_flashcards_table()
RETURNS void AS $$
BEGIN
  -- Drop table if exists
  DROP TABLE IF EXISTS balanced_flashcards;
  
  -- Create new table with same structure as ai_flashcards
  CREATE TABLE balanced_flashcards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cba_section_id UUID,
    article_number TEXT NOT NULL,
    article_title TEXT,
    section_number TEXT,
    section_title TEXT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    citation TEXT NOT NULL,
    topic TEXT,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    created_at TIMESTAMP DEFAULT NOW()
  );
  
  -- Enable RLS
  ALTER TABLE balanced_flashcards ENABLE ROW LEVEL SECURITY;
  
  -- Create policy for public read access
  CREATE POLICY "Public read access" ON balanced_flashcards
    FOR SELECT USING (true);
    
  -- Create index for better performance
  CREATE INDEX idx_balanced_flashcards_article ON balanced_flashcards(article_number);
  CREATE INDEX idx_balanced_flashcards_topic ON balanced_flashcards(topic);
  CREATE INDEX idx_balanced_flashcards_difficulty ON balanced_flashcards(difficulty);
  
END;
$$ LANGUAGE plpgsql;