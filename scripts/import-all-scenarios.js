const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🎯 Starting scenario import from all batches...\n');

// Helper function to convert question format to scenario format
function convertToScenario(question, batchNumber) {
  // Determine difficulty
  let difficulty = 'Intermediate';
  if (question.difficulty === 'easy') difficulty = 'Beginner';
  if (question.difficulty === 'hard') difficulty = 'Advanced';
  
  // Extract topic from category
  const topic = question.category.replace('Article VII - ', '').replace('Article VIII - ', '');
  
  // Create options in the format scenarios expect
  const options = question.options.map((opt, idx) => ({
    id: String.fromCharCode(97 + idx), // 'a', 'b', 'c', 'd'
    text: opt,
    isCorrect: idx === question.correct
  }));
  
  return {
    title: `${topic} - Scenario ${batchNumber}`,
    difficulty,
    topic,
    description: `Complex real-world scenario about ${topic.toLowerCase()}`,
    situation: question.question.split('?')[0] + '?', // Use question as situation
    question: 'What is the correct answer?',
    options,
    explanation: question.explanation,
    key_takeaway: question.explanation.split('.')[0] + '.' // First sentence as takeaway
  };
}

async function importBatch(batchNumber) {
  try {
    console.log(`📥 Importing batch ${batchNumber}...`);
    
    // Require the batch file
    const batchModule = require(`./import-scenario-batch-${batchNumber}.js`);
    
    // The batch files export the questions array
    // We need to extract it - they typically have a variable like batch1, batch2, etc.
    const batchData = batchModule[`batch${batchNumber}`] || batchModule.scenarios || batchModule.batch;
    
    if (!batchData || !Array.isArray(batchData)) {
      console.log(`⚠️  Batch ${batchNumber}: Could not find data array, skipping...`);
      return 0;
    }
    
    // Convert to scenario format
    const scenarios = batchData.map((q, idx) => convertToScenario(q, `${batchNumber}-${idx + 1}`));
    
    // Insert into database
    const { data, error } = await supabase
      .from('scenarios')
      .insert(scenarios)
      .select();
    
    if (error) {
      console.error(`❌ Error importing batch ${batchNumber}:`, error.message);
      return 0;
    }
    
    console.log(`✅ Batch ${batchNumber}: Imported ${data.length} scenarios`);
    return data.length;
    
  } catch (err) {
    console.error(`❌ Error processing batch ${batchNumber}:`, err.message);
    return 0;
  }
}

async function importAllScenarios() {
  let totalImported = 0;
  
  // Import batches 1-8
  for (let i = 1; i <= 8; i++) {
    const imported = await importBatch(i);
    totalImported += imported;
    
    // Small delay between batches
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`🎉 Import complete! Total scenarios imported: ${totalImported}`);
  console.log('='.repeat(50) + '\n');
  
  // Verify the import
  const { count, error } = await supabase
    .from('scenarios')
    .select('*', { count: 'exact', head: true });
  
  if (!error) {
    console.log(`✅ Database now has ${count} scenarios total\n`);
  }
}

// Run the import
importAllScenarios().catch(console.error);
