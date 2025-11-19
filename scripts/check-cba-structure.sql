-- Check existing structure of cba_content table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'cba_content'
ORDER BY ordinal_position;
