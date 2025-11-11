-- Create AI Flashcards Table
-- This stores flashcards generated from CBA content using OpenAI

CREATE TABLE IF NOT EXISTS ai_flashcards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cba_section_id UUID REFERENCES cba_content(id) ON DELETE CASCADE,
  article_number TEXT NOT NULL,
  article_title TEXT,
  section_number TEXT,
  section_title TEXT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  citation TEXT NOT NULL,
  topic TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ai_flashcards_article ON ai_flashcards(article_number);
CREATE INDEX IF NOT EXISTS idx_ai_flashcards_topic ON ai_flashcards(topic);
CREATE INDEX IF NOT EXISTS idx_ai_flashcards_difficulty ON ai_flashcards(difficulty);
CREATE INDEX IF NOT EXISTS idx_ai_flashcards_section ON ai_flashcards(cba_section_id);

-- Enable Row Level Security (RLS)
ALTER TABLE ai_flashcards ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust based on your auth needs)
CREATE POLICY "Allow all operations on ai_flashcards"
  ON ai_flashcards
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Add helpful comment
COMMENT ON TABLE ai_flashcards IS 'AI-generated flashcards from NBA CBA content using OpenAI GPT-4o';
