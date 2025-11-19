const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🔧 Fixing isCorrect flags in all scenarios...\n');

async function fixScenarioOptions() {
  try {
    // Get all scenarios
    const { data: scenarios, error: fetchError } = await supabase
      .from('scenarios')
      .select('id, options');
    
    if (fetchError) {
      console.error('❌ Error fetching scenarios:', fetchError.message);
      return;
    }
    
    console.log(`📊 Found ${scenarios.length} scenarios to fix\n`);
    
    let fixed = 0;
    let alreadyCorrect = 0;
    
    for (const scenario of scenarios) {
      const options = scenario.options;
      
      // Check if any option is marked as correct
      const hasCorrect = options.some(opt => opt.isCorrect === true);
      
      if (!hasCorrect) {
        // No correct answer marked - need to fix this
        // The correct answer should be at index where isCorrect should be true
        // Since we don't have the original correct_answer index, we need to get it from questions table
        
        // For now, let's mark option 'c' as correct (index 2) as that's a common pattern
        // But better: let's skip scenarios without correct answers and log them
        console.log(`⚠️  Scenario ${scenario.id}: No correct answer marked!`);
        fixed++;
      } else {
        alreadyCorrect++;
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log(`📊 Analysis:`);
    console.log(`   Scenarios with correct answer: ${alreadyCorrect}`);
    console.log(`   Scenarios WITHOUT correct answer: ${fixed}`);
    console.log('='.repeat(60) + '\n');
    
    if (fixed > 0) {
      console.log('❌ PROBLEM: All scenarios are missing correct answer flags!');
      console.log('🔧 Need to re-import from original questions table...\n');
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

// Run the fix
fixScenarioOptions().catch(console.error);
