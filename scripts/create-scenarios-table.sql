-- Create scenarios table
CREATE TABLE IF NOT EXISTS scenarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')) NOT NULL,
  topic TEXT NOT NULL,
  description TEXT NOT NULL,
  situation TEXT NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of {id, text, isCorrect}
  explanation TEXT NOT NULL,
  key_takeaway TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can read scenarios"
  ON scenarios
  FOR SELECT
  TO public
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_scenarios_difficulty ON scenarios(difficulty);
CREATE INDEX IF NOT EXISTS idx_scenarios_topic ON scenarios(topic);
CREATE INDEX IF NOT EXISTS idx_scenarios_created_at ON scenarios(created_at);

-- Grant access
GRANT SELECT ON scenarios TO anon;
GRANT SELECT ON scenarios TO authenticated;
