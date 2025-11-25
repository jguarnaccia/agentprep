require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function comprehensiveAudit() {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  console.log('\n=== COMPREHENSIVE QUESTION AUDIT ===\n');
  
  // Get all questions
  const { data: questions, error } = await supabase
    .from('questions')
    .select('*')
    .order('id');
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log(`Auditing ${questions.length} questions...\n`);
  
  const issues = [];
  
  questions.forEach(q => {
    // Check 1: Invalid index
    if (q.correct_answer < 0 || q.correct_answer >= q.options.length) {
      issues.push({
        id: q.id,
        question: q.question,
        issue: 'Invalid correct_answer index',
        details: `Index ${q.correct_answer} but only ${q.options.length} options`
      });
    }
  });
  
  // Report findings
  if (issues.length === 0) {
    console.log('✅ No structural issues found!\n');
  } else {
    console.log(`❌ Found ${issues.length} issues:\n`);
    issues.forEach(issue => {
      console.log(`Question ID ${issue.id}:`);
      console.log(`  Problem: ${issue.issue}`);
      console.log(`  Details: ${issue.details}`);
      console.log(`  Question: ${issue.question.substring(0, 80)}...`);
      console.log('');
    });
  }
  
  // Now let's look at questions that might have been answered incorrectly by users
  // Get all user progress where they got it wrong
  const { data: wrongAnswers, error: progressError } = await supabase
    .from('user_progress')
    .select('question_id, incorrect_count')
    .gt('incorrect_count', 0)
    .order('incorrect_count', { ascending: false })
    .limit(50);
  
  if (progressError) {
    console.error('Progress Error:', progressError);
    return;
  }
  
  console.log('\n=== TOP 20 MOST COMMONLY MISSED QUESTIONS ===\n');
  console.log('(These might have wrong answer keys)\n');
  
  const questionIds = wrongAnswers.slice(0, 20).map(p => p.question_id);
  const { data: topMissed, error: missedError } = await supabase
    .from('questions')
    .select('*')
    .in('id', questionIds);
  
  if (!missedError && topMissed) {
    topMissed.forEach(q => {
      const progress = wrongAnswers.find(p => p.question_id === q.id);
      console.log(`Question ID ${q.id} (${progress.incorrect_count} incorrect attempts):`);
      console.log(`  ${q.question.substring(0, 100)}...`);
      console.log(`  Marked correct: Option ${q.correct_answer}: ${q.options[q.correct_answer]}`);
      console.log('');
    });
  }
  
  console.log('\n=== AUDIT COMPLETE ===\n');
}

comprehensiveAudit().catch(console.error);
