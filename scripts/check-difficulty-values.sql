-- Check existing difficulty values in questions table
SELECT DISTINCT difficulty, COUNT(*) as count
FROM questions
GROUP BY difficulty
ORDER BY count DESC;
