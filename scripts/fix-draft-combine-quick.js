#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function quickFix() {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  console.log('\n🔍 Searching for NBA Draft Combine question...\n');
  
  // The question text from your screenshot
  const questionText = "What is the NBA Draft Combine?";
  
  const { data: questions, error } = await supabase
    .from('questions')
    .select('*')
    .eq('question', questionText);
  
  if (error) {
    console.error('❌ Error:', error);
    return;
  }
  
  if (!questions || questions.length === 0) {
    // Try partial match
    const { data: partialMatch } = await supabase
      .from('questions')
      .select('*')
      .ilike('question', '%Draft Combine%');
    
    if (partialMatch && partialMatch.length > 0) {
      questions.push(...partialMatch);
    } else {
      console.log('❌ Question not found!');
      return;
    }
  }
  
  const q = questions[0];
  
  console.log('✅ Found question!');
  console.log('\nQuestion ID:', q.id);
  console.log('Question:', q.question);
  console.log('\nOptions:');
  q.options.forEach((opt, idx) => {
    const current = idx === q.correct_answer ? ' ← Currently marked correct' : '';
    console.log(`  [${idx}] ${opt}${current}`);
  });
  
  // Find the correct answer
  // Based on your screenshot, option 1 (index 1) should be correct:
  // "An optional pre-draft event where players can showcase skills, do medical exams, and interview with teams"
  
  const correctIndex = q.options.findIndex(opt => 
    opt.toLowerCase().includes('optional') && 
    opt.toLowerCase().includes('pre-draft')
  );
  
  console.log('\n📊 Analysis:');
  console.log(`Current answer index: ${q.correct_answer}`);
  console.log(`Should be index: ${correctIndex}`);
  console.log(`\nCurrently marked: "${q.options[q.correct_answer]}"`);
  console.log(`Should be: "${q.options[correctIndex]}"`);
  
  if (q.correct_answer === correctIndex) {
    console.log('\n✅ Answer is already correct! No fix needed.');
    return;
  }
  
  console.log('\n⚠️  INCORRECT ANSWER DETECTED!');
  console.log('🔧 Fixing now...\n');
  
  const { error: updateError } = await supabase
    .from('questions')
    .update({ 
      correct_answer: correctIndex,
      explanation: q.explanation || 'The NBA Draft Combine is an optional pre-draft event where eligible players showcase their skills through drills and measurements, undergo medical examinations, and participate in interviews with NBA teams. It helps teams evaluate prospects before the draft.'
    })
    .eq('id', q.id);
  
  if (updateError) {
    console.error('❌ Update failed:', updateError);
  } else {
    console.log('✅ SUCCESS! Question fixed.');
    console.log(`   Correct answer is now option ${correctIndex}`);
    console.log(`   "${q.options[correctIndex]}"`);
  }
}

quickFix().catch(err => {
  console.error('❌ Script error:', err);
  process.exit(1);
});
