-- =====================================================
-- CBA CONTENT TABLE MIGRATION
-- Creates table for storing the full NBA Collective Bargaining Agreement
-- =====================================================

-- Drop existing table if it exists
DROP TABLE IF EXISTS public.cba_content CASCADE;

-- Create cba_content table
CREATE TABLE public.cba_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Structure fields
  type TEXT NOT NULL, -- 'article', 'section', 'subsection', 'exhibit'
  article_number TEXT, -- 'I', 'II', 'VII', etc. or 'A', 'B' for exhibits
  article_title TEXT, -- 'Team Salary Cap', 'Uniform Player Contract', etc.
  section_number TEXT, -- '1', '2', '3', etc.
  subsection TEXT, -- '(a)', '(b)', '(1)', '(i)', etc.
  title TEXT, -- Section or subsection title
  
  -- Content
  content TEXT NOT NULL, -- Full CBA text for this section
  
  -- AI-generated explanation (added later via "Explain This" feature)
  ai_explanation TEXT,
  ai_explanation_generated_at TIMESTAMP WITH TIME ZONE,
  
  -- Categorization (links to existing study guide categories)
  category TEXT, -- 'salary-cap', 'luxury-tax', etc.
  keywords TEXT[], -- Searchable keywords
  
  -- Hierarchy and ordering
  order_index INTEGER NOT NULL, -- For maintaining document order
  parent_id UUID REFERENCES public.cba_content(id) ON DELETE SET NULL,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for fast querying
CREATE INDEX idx_cba_article ON public.cba_content(article_number);
CREATE INDEX idx_cba_section ON public.cba_content(section_number);
CREATE INDEX idx_cba_category ON public.cba_content(category);
CREATE INDEX idx_cba_order ON public.cba_content(order_index);
CREATE INDEX idx_cba_parent ON public.cba_content(parent_id);
CREATE INDEX idx_cba_type ON public.cba_content(type);

-- Full-text search index on content and title
CREATE INDEX idx_cba_content_search ON public.cba_content 
  USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, '')));

-- Index for keyword search
CREATE INDEX idx_cba_keywords ON public.cba_content USING gin(keywords);

-- Enable Row Level Security (optional, but recommended)
ALTER TABLE public.cba_content ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all authenticated users to read CBA content
CREATE POLICY "Allow public read access to CBA content"
  ON public.cba_content
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy: Only authenticated users can update AI explanations
CREATE POLICY "Allow authenticated users to update AI explanations"
  ON public.cba_content
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add helpful comments
COMMENT ON TABLE public.cba_content IS 'Stores the complete NBA Collective Bargaining Agreement in structured format';
COMMENT ON COLUMN public.cba_content.type IS 'Type of content: article, section, subsection, or exhibit';
COMMENT ON COLUMN public.cba_content.content IS 'Full CBA text for this section';
COMMENT ON COLUMN public.cba_content.ai_explanation IS 'AI-generated beginner-friendly explanation (generated on-demand)';
COMMENT ON COLUMN public.cba_content.order_index IS 'Maintains the original document order for proper display';

-- Success message
SELECT 'CBA content table created successfully!' AS status;
