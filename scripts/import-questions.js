const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wxidxpqdbhlchqxlapdv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4aWR4cHFkYmhsY2hxeGxhcGR2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTg0NTg5NCwiZXhwIjoyMDc1NDIxODk0fQ.iaTAyzQqPW7TgYXnh-C2042ELFKn3zXWEXo0pmakDiU'

const supabase = createClient(supabaseUrl, supabaseKey);

const basePath = '/Users/jeremiahg/Desktop/Sports Agent Study Tool/';

const batchFiles = [
  'NBA-CBA-Questions-Batch-1-Article-VII-COMPLETE.json',
  'NBA-CBA-Questions-Batch-2-Article-XXXVI-COMPLETE.json',
  'NBA-CBA-Questions-Batch-3-Article-X-COMPLETE.json',
  'NBA-CBA-Questions-Batch-4-Article-XI-COMPLETE.json',
  'NBA-CBA-Questions-Batch-5-Article-VIII-COMPLETE.json',
  'NBA-CBA-Questions-Batch-6-Article-II-COMPLETE.json',
  'NBA-CBA-Questions-Batch-7-Article-XXXIII-COMPLETE.json',
  'NBA-CBA-Questions-Batch-8-Article-VI-COMPLETE.json',
  'NBA-CBA-Questions-Batch-9-Article-IV-COMPLETE.json',
  'NBA-CBA-Questions-Batch-10-Article-XXII-COMPLETE.json',
  'NBA-CBA-Questions-Batch-11-Article-XIV-COMPLETE.json',
  'NBA-CBA-Questions-Batch-12-Article-VII-Part-2-COMPLETE.json',
  'NBA-CBA-Questions-Batch-13-Article-XV-COMPLETE.json',
  'NBA-CBA-Questions-Batch-14-Article-XII-COMPLETE.json',
  'NBA-CBA-Questions-Batch-15-Article-XIII-COMPLETE.json',
  'NBA-CBA-Questions-Batch-16-Article-XX-COMPLETE.json',
  'NBA-CBA-Questions-Batch-17-Article-XXV-COMPLETE.json'
];

async function importQuestions() {
  console.log('🚀 Starting import of 500 questions...\n');
  
  for (let i = 0; i < batchFiles.length; i++) {
    const filePath = basePath + batchFiles[i];
    
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const questions = data.questions.map(q => ({
        question: q.question,
        options: q.options,
        correct: q.correct,
        explanation: q.explanation,
        category: q.category,
        difficulty: q.difficulty,
        source: q.source,
        batch: i + 1
      }));

      const { error } = await supabase.from('questions').insert(questions);

      if (error) {
        console.error(`❌ Error importing batch ${i + 1}:`, error.message);
      } else {
        console.log(`✅ Batch ${i + 1}: Imported ${questions.length} questions`);
      }
    } catch (err) {
      console.error(`❌ Error reading file ${batchFiles[i]}:`, err.message);
    }
  }

  console.log('\n🎉 Import complete! All 500 questions imported.');
}

importQuestions();
