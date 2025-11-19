const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🎯 Converting scenario-style questions to scenarios table...\n');

async function convertQuestionsToScenarios() {
  try {
    // Get all questions with question_type = 'scenario'
    const { data: questions, error: fetchError } = await supabase
      .from('questions')
      .select('*')
      .eq('question_type', 'scenario');
    
    if (fetchError) {
      console.error('❌ Error fetching questions:', fetchError.message);
      return;
    }
    
    console.log(`📊 Found ${questions.length} scenario-style questions to convert\n`);
    
    if (questions.length === 0) {
      console.log('⚠️  No scenario questions found. They might need to be imported first.');
      return;
    }
    
    // Convert each question to scenario format
    const scenarios = questions.map((q, idx) => {
      // Map difficulty
      let difficulty = 'Intermediate';
      if (q.difficulty === 'Easy') difficulty = 'Beginner';
      if (q.difficulty === 'Hard') difficulty = 'Advanced';
      
      // Extract topic from category
      const topic = q.category.replace(/^Article [IVX]+ - /, '');
      
      // Create options array with proper format
      const options = q.options.map((optText, optIdx) => ({
        id: String.fromCharCode(97 + optIdx), // 'a', 'b', 'c', 'd'
        text: optText,
        isCorrect: optIdx === q.correct_answer
      }));
      
      // Split question into situation and actual question
      const parts = q.question.split('?');
      const situation = parts[0] + '?';
      const question = parts.length > 1 ? parts.slice(1).join('?') : 'What is the correct answer?';
      
      // Extract key takeaway (first sentence of explanation)
      const sentences = q.explanation.split('. ');
      const keyTakeaway = sentences[0] + '.';
      
      return {
        title: `${topic} - Scenario ${idx + 1}`,
        difficulty,
        topic,
        description: `Real-world scenario about ${topic.toLowerCase()}`,
        situation,
        question: question.trim() || 'What is the correct answer?',
        options,
        explanation: q.explanation,
        key_takeaway: keyTakeaway
      };
    });
    
    console.log(`🔄 Converting ${scenarios.length} questions to scenario format...\n`);
    
    // Insert all scenarios
    const { data, error: insertError } = await supabase
      .from('scenarios')
      .insert(scenarios)
      .select();
    
    if (insertError) {
      console.error('❌ Error inserting scenarios:', insertError.message);
      return;
    }
    
    console.log('='.repeat(60));
    console.log(`🎉 SUCCESS! Imported ${data.length} scenarios`);
    console.log('='.repeat(60) + '\n');
    
    // Show breakdown by difficulty
    const beginner = data.filter(s => s.difficulty === 'Beginner').length;
    const intermediate = data.filter(s => s.difficulty === 'Intermediate').length;
    const advanced = data.filter(s => s.difficulty === 'Advanced').length;
    
    console.log('📊 Difficulty breakdown:');
    console.log(`   Beginner: ${beginner}`);
    console.log(`   Intermediate: ${intermediate}`);
    console.log(`   Advanced: ${advanced}`);
    console.log('');
    
    // Verify total count
    const { count } = await supabase
      .from('scenarios')
      .select('*', { count: 'exact', head: true });
    
    console.log(`✅ Total scenarios in database: ${count}\n`);
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

// Run the conversion
convertQuestionsToScenarios().catch(console.error);
