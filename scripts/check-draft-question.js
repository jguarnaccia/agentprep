require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function checkQuestion() {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Search for the NBA Draft Combine question
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .ilike('question', '%NBA Draft Combine%');
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log('\n=== NBA DRAFT COMBINE QUESTION ===\n');
  
  if (data && data.length > 0) {
    const q = data[0];
    console.log('Question ID:', q.id);
    console.log('Question:', q.question);
    console.log('\nOptions:');
    q.options.forEach((opt, idx) => {
      console.log(`  ${idx}: ${opt}`);
    });
    console.log('\nCorrect Answer Index:', q.correct_answer);
    console.log('Correct Answer:', q.options[q.correct_answer]);
    console.log('\nExplanation:', q.explanation);
  } else {
    console.log('Question not found!');
  }
}

checkQuestion().catch(console.error);
