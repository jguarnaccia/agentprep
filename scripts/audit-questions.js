require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function auditQuestions() {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Get all questions
  const { data: questions, error } = await supabase
    .from('questions')
    .select('*')
    .order('id');
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log(`\n=== AUDITING ${questions.length} QUESTIONS ===\n`);
  
  let issuesFound = 0;
  
  questions.forEach(q => {
    // Check if correct_answer is valid
    if (q.correct_answer < 0 || q.correct_answer >= q.options.length) {
      issuesFound++;
      console.log(`❌ ISSUE: Question ID ${q.id}`);
      console.log(`   Question: ${q.question.substring(0, 80)}...`);
      console.log(`   Correct Answer Index: ${q.correct_answer}`);
      console.log(`   Number of Options: ${q.options.length}`);
      console.log(`   Options:`, q.options);
      console.log('');
    }
  });
  
  if (issuesFound === 0) {
    console.log('✅ All questions have valid correct_answer indices!');
  } else {
    console.log(`\n⚠️  Found ${issuesFound} questions with invalid indices`);
  }
  
  // Also check the specific Draft Combine question
  console.log('\n=== CHECKING DRAFT COMBINE QUESTION ===\n');
  const draftQuestion = questions.find(q => q.question.includes('NBA Draft Combine'));
  
  if (draftQuestion) {
    console.log('Question ID:', draftQuestion.id);
    console.log('Question:', draftQuestion.question);
    console.log('\nOptions:');
    draftQuestion.options.forEach((opt, idx) => {
      const marker = idx === draftQuestion.correct_answer ? '✓' : ' ';
      console.log(`  [${marker}] ${idx}: ${opt}`);
    });
    console.log(`\nMarked Correct Answer (index ${draftQuestion.correct_answer}):`, draftQuestion.options[draftQuestion.correct_answer]);
  }
}

auditQuestions().catch(console.error);
