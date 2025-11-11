const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wxidxpqdbhlchqxlapdv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4aWR4cHFkYmhsY2hxeGxhcGR2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTg0NTg5NCwiZXhwIjoyMDc1NDIxODk0fQ.iaTAyzQqPW7TgYXnh-C2042ELFKn3zXWEXo0pmakDiU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function importBatch1() {
  console.log('🚀 Importing Batch 1 (50 questions)...\n');
  
  const filePath = '/Users/jeremiahg/Desktop/Sports Agent Study Tool/NBA-CBA-Batch-1-CLEAN.json';
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const questions = data.questions.map(q => ({
    question: q.question,
    options: q.options,
    correct: q.correct,
    explanation: q.explanation,
    category: q.category,
    difficulty: q.difficulty,
    source: q.source,
    batch: 1
  }));

  const { error } = await supabase.from('questions').insert(questions);

  if (error) {
    console.error('❌ Error importing Batch 1:', error.message);
  } else {
    console.log('✅ Batch 1: Imported 50 questions');
    console.log('\n🎉 You now have all 500 questions!');
  }
}

importBatch1();
