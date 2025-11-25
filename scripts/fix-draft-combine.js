require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function fixDraftCombineQuestion() {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  console.log('\n=== FIXING NBA DRAFT COMBINE QUESTION ===\n');
  
  // Search for the question
  const { data: questions, error: searchError } = await supabase
    .from('questions')
    .select('*')
    .ilike('question', '%NBA Draft Combine%');
  
  if (searchError) {
    console.error('Search Error:', searchError);
    return;
  }
  
  if (!questions || questions.length === 0) {
    console.log('Question not found in database!');
    return;
  }
  
  const question = questions[0];
  
  console.log('Found Question:');
  console.log('ID:', question.id);
  console.log('Question:', question.question);
  console.log('\nCurrent Options:');
  question.options.forEach((opt, idx) => {
    const marker = idx === question.correct_answer ? '✓ [MARKED CORRECT]' : '';
    console.log(`  ${idx}: ${opt} ${marker}`);
  });
  
  // The correct answer should be option 1: "An optional pre-draft event..."
  const correctAnswerIndex = question.options.findIndex(opt => 
    opt.includes('optional pre-draft event')
  );
  
  console.log('\n--- ANALYSIS ---');
  console.log('Current correct_answer index:', question.correct_answer);
  console.log('Should be index:', correctAnswerIndex);
  console.log('Current marked answer:', question.options[question.correct_answer]);
  console.log('Correct answer:', question.options[correctAnswerIndex]);
  
  if (question.correct_answer !== correctAnswerIndex) {
    console.log('\n❌ INCORRECT! Fixing now...\n');
    
    const { error: updateError } = await supabase
      .from('questions')
      .update({ correct_answer: correctAnswerIndex })
      .eq('id', question.id);
    
    if (updateError) {
      console.error('Update Error:', updateError);
    } else {
      console.log('✅ Successfully fixed! Correct answer is now index', correctAnswerIndex);
    }
  } else {
    console.log('\n✅ Answer is already correct!');
  }
}

fixDraftCombineQuestion().catch(console.error);
