const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkQuestionStructure() {
  console.log('🔍 Checking question structure...\n');
  
  // Get one scenario question
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('question_type', 'scenario')
    .limit(1);
  
  if (error) {
    console.error('❌ Error:', error);
    return;
  }
  
  if (data && data.length > 0) {
    const question = data[0];
    console.log('📊 Question structure:\n');
    console.log('Question:', question.question.substring(0, 100) + '...');
    console.log('\nOptions:', question.options);
    console.log('Options length:', question.options.length);
    console.log('\nCorrect Answer Field:', question.correct_answer);
    console.log('Correct Answer Type:', typeof question.correct_answer);
    console.log('\nDoes correct_answer match an index?');
    question.options.forEach((opt, idx) => {
      const matches = idx === question.correct_answer;
      console.log(`  Index ${idx}: ${matches ? '✅ MATCH' : '❌'} - "${opt.substring(0, 50)}..."`);
    });
  }
}

checkQuestionStructure().catch(console.error);
