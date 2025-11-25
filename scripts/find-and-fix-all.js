#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function findAndFixAll() {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║  COMPREHENSIVE QUESTION ANSWER AUDIT & FIX TOOL        ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  
  // Get all questions
  const { data: questions, error } = await supabase
    .from('questions')
    .select('*')
    .order('id');
  
  if (error) {
    console.error('❌ Error fetching questions:', error);
    return;
  }
  
  console.log(`📊 Loaded ${questions.length} questions\n`);
  
  const fixes = [];
  const structuralIssues = [];
  
  // Check each question
  questions.forEach(q => {
    // Check for structural issues
    if (q.correct_answer < 0 || q.correct_answer >= q.options.length) {
      structuralIssues.push({
        id: q.id,
        question: q.question,
        currentAnswer: q.correct_answer,
        numOptions: q.options.length
      });
    }
  });
  
  // Report structural issues
  if (structuralIssues.length > 0) {
    console.log(`❌ CRITICAL: Found ${structuralIssues.length} questions with invalid answer indices:\n`);
    structuralIssues.forEach(issue => {
      console.log(`   ID ${issue.id}: correct_answer=${issue.currentAnswer} but only ${issue.numOptions} options`);
      console.log(`   Question: ${issue.question.substring(0, 80)}...`);
      console.log('');
    });
  } else {
    console.log('✅ All questions have valid answer indices\n');
  }
  
  // Get user progress to find commonly missed questions
  console.log('📈 Analyzing user performance data...\n');
  
  const { data: progress } = await supabase
    .from('user_progress')
    .select('question_id, correct_count, incorrect_count')
    .gt('incorrect_count', 0);
  
  if (progress && progress.length > 0) {
    // Calculate miss rate for each question
    const questionStats = {};
    progress.forEach(p => {
      if (!questionStats[p.question_id]) {
        questionStats[p.question_id] = { correct: 0, incorrect: 0 };
      }
      questionStats[p.question_id].correct += p.correct_count;
      questionStats[p.question_id].incorrect += p.incorrect_count;
    });
    
    // Find questions with >70% miss rate (likely wrong answer key)
    const suspiciousQuestions = Object.entries(questionStats)
      .map(([id, stats]) => ({
        id,
        total: stats.correct + stats.incorrect,
        incorrect: stats.incorrect,
        missRate: stats.incorrect / (stats.correct + stats.incorrect)
      }))
      .filter(q => q.missRate > 0.7 && q.total >= 2) // At least 2 attempts and >70% wrong
      .sort((a, b) => b.missRate - a.missRate);
    
    if (suspiciousQuestions.length > 0) {
      console.log(`⚠️  Found ${suspiciousQuestions.length} questions with >70% incorrect rate:\n`);
      console.log('These likely have wrong answer keys and need manual review:\n');
      
      for (const suspicious of suspiciousQuestions.slice(0, 10)) {
        const q = questions.find(question => question.id == suspicious.id);
        if (q) {
          console.log(`\n📝 Question ID ${q.id} (${(suspicious.missRate * 100).toFixed(0)}% miss rate, ${suspicious.total} attempts)`);
          console.log(`   ${q.question}`);
          console.log(`\n   Options:`);
          q.options.forEach((opt, idx) => {
            const marker = idx === q.correct_answer ? '✓ [MARKED CORRECT]' : '  ';
            console.log(`   ${marker} [${idx}] ${opt}`);
          });
          console.log(`\n   Explanation: ${q.explanation || 'No explanation provided'}`);
          console.log('   ' + '─'.repeat(80));
        }
      }
    } else {
      console.log('✅ No questions with suspiciously high miss rates found\n');
    }
  }
  
  // Fix the specific NBA Draft Combine question
  console.log('\n\n🔧 FIXING KNOWN ISSUE: NBA Draft Combine Question...\n');
  
  const draftQuestion = questions.find(q => q.question.includes('NBA Draft Combine'));
  
  if (draftQuestion) {
    const correctIndex = draftQuestion.options.findIndex(opt => 
      opt.toLowerCase().includes('optional') && 
      opt.toLowerCase().includes('pre-draft')
    );
    
    if (correctIndex !== -1 && draftQuestion.correct_answer !== correctIndex) {
      console.log(`   Found it! Question ID ${draftQuestion.id}`);
      console.log(`   Current answer: ${draftQuestion.correct_answer} - "${draftQuestion.options[draftQuestion.correct_answer]}"`);
      console.log(`   Should be: ${correctIndex} - "${draftQuestion.options[correctIndex]}"`);
      console.log(`\n   Applying fix...`);
      
      const { error: fixError } = await supabase
        .from('questions')
        .update({ correct_answer: correctIndex })
        .eq('id', draftQuestion.id);
      
      if (fixError) {
        console.log(`   ❌ Fix failed:`, fixError);
      } else {
        console.log(`   ✅ Fixed successfully!`);
      }
    } else if (correctIndex !== -1) {
      console.log(`   ✅ Already correct!`);
    }
  }
  
  console.log('\n\n╔════════════════════════════════════════════════════════╗');
  console.log('║  AUDIT COMPLETE                                        ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  
  if (structuralIssues.length > 0 || suspiciousQuestions?.length > 0) {
    console.log('⚠️  ACTION REQUIRED: Please review the questions listed above');
  } else {
    console.log('✅ All questions look good!');
  }
}

findAndFixAll().catch(err => {
  console.error('❌ Script error:', err);
  process.exit(1);
});
