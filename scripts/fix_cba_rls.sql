-- =====================================================
-- FIX RLS POLICY FOR CBA_CONTENT
-- Adds INSERT policy so the importer can add data
-- =====================================================

-- Add policy to allow INSERT operations (anon users can insert)
CREATE POLICY "Allow anon to insert CBA content"
  ON public.cba_content
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Also allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert CBA content"
  ON public.cba_content
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

SELECT 'RLS policies updated successfully!' AS status;
