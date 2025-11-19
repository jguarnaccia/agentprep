const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🔧 Re-importing scenarios with CORRECT isCorrect flags...\n');

async function reimportScenarios() {
  try {
    // First, delete all existing scenarios
    console.log('🗑️  Deleting old scenarios...');
    const { error: deleteError } = await supabase
      .from('scenarios')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (deleteError) {
      console.error('❌ Error deleting scenarios:', deleteError.message);
      return;
    }
    console.log('✅ Old scenarios deleted\n');
    
    // Get all scenario-type questions from questions table
    const { data: questions, error: fetchError } = await supabase
      .from('questions')
      .select('*')
      .eq('question_type', 'scenario');
    
    if (fetchError) {
      console.error('❌ Error fetching questions:', fetchError.message);
      return;
    }
    
    console.log(`📊 Found ${questions.length} scenario questions to convert\n`);
    
    // Convert each question to scenario format WITH CORRECT isCorrect FLAGS
    const scenarios = questions.map((q, idx) => {
      // Map difficulty
      let difficulty = 'Intermediate';
      if (q.difficulty === 'Easy') difficulty = 'Beginner';
      if (q.difficulty === 'Hard') difficulty = 'Advanced';
      
      // Extract topic from category
      const topic = q.category.replace(/^Article [IVX]+ - /, '');
      
      // Create options array with PROPER isCorrect flags
      const options = q.options.map((optText, optIdx) => ({
        id: String.fromCharCode(97 + optIdx), // 'a', 'b', 'c', 'd'
        text: optText,
        isCorrect: optIdx === q.correct // FIXED: Use 'correct' field, not 'correct_answer'
      }));
      
      // Split question into situation and question
      const parts = q.question.split('?');
      const situation = parts[0] + '?';
      const question = parts.length > 1 ? parts.slice(1).join('?').trim() : 'What is the correct answer?';
      
      // Extract key takeaway (first 2 sentences)
      const sentences = q.explanation.split(/\. (?=[A-Z])/);
      const keyTakeaway = sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? '.' : '');
      
      return {
        title: `${topic} - Scenario ${idx + 1}`,
        difficulty,
        topic,
        description: `Real-world scenario about ${topic.toLowerCase()}`,
        situation,
        question: question || 'What is the correct answer?',
        options, // NOW WITH CORRECT isCorrect FLAGS!
        explanation: q.explanation,
        key_takeaway: keyTakeaway
      };
    });
    
    console.log(`🔄 Converting ${scenarios.length} questions to scenarios...\n`);
    
    // Insert all scenarios in batches of 50
    const batchSize = 50;
    let inserted = 0;
    
    for (let i = 0; i < scenarios.length; i += batchSize) {
      const batch = scenarios.slice(i, i + batchSize);
      
      const { data, error: insertError } = await supabase
        .from('scenarios')
        .insert(batch)
        .select();
      
      if (insertError) {
        console.error(`❌ Error inserting batch ${i / batchSize + 1}:`, insertError.message);
      } else {
        inserted += data.length;
        console.log(`✅ Inserted batch ${i / batchSize + 1}: ${data.length} scenarios`);
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log(`🎉 SUCCESS! Re-imported ${inserted} scenarios with correct answers!`);
    console.log('='.repeat(60) + '\n');
    
    // Verify one scenario
    const { data: verifyData } = await supabase
      .from('scenarios')
      .select('*')
      .limit(1);
    
    if (verifyData && verifyData.length > 0) {
      console.log('✅ Verification - First scenario:');
      console.log('   Question:', verifyData[0].question.substring(0, 80) + '...');
      console.log('   Options:');
      verifyData[0].options.forEach((opt, idx) => {
          console.log(`   ${opt.id}: isCorrect=${opt.isCorrect} ${opt.isCorrect ? '← ✅ CORRECT ANSWER' : ''}`);
    });
    console.log('');
  }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

// Run the reimport
reimportScenarios().catch(console.error);
