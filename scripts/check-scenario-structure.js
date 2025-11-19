const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkScenarioStructure() {
  console.log('🔍 Checking scenario data structure...\n');
  
  // Get one scenario
  const { data, error } = await supabase
    .from('scenarios')
    .select('*')
    .limit(1);
  
  if (error) {
    console.error('❌ Error:', error);
    return;
  }
  
  if (data && data.length > 0) {
    const scenario = data[0];
    console.log('📊 Scenario structure:\n');
    console.log('ID:', scenario.id);
    console.log('Title:', scenario.title);
    console.log('Difficulty:', scenario.difficulty);
    console.log('\nOptions type:', typeof scenario.options);
    console.log('Options value:', JSON.stringify(scenario.options, null, 2));
    console.log('\nFirst option structure:');
    if (Array.isArray(scenario.options) && scenario.options.length > 0) {
      console.log(JSON.stringify(scenario.options[0], null, 2));
      console.log('\nChecking for isCorrect field:');
      scenario.options.forEach((opt, idx) => {
        console.log(`  Option ${idx}: id="${opt.id}", isCorrect=${opt.isCorrect}`);
      });
    }
  }
}

checkScenarioStructure().catch(console.error);
