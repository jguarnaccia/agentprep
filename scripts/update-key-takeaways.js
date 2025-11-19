const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🔄 Updating key takeaways for all scenarios...\n');

function generateKeyTakeaway(explanation) {
  // Split by sentences
  const sentences = explanation.split(/\. (?=[A-Z])/);
  
  // Get first 2 sentences as key takeaway
  const takeaway = sentences.slice(0, 2).join('. ');
  
  // Ensure it ends with period
  return takeaway.endsWith('.') ? takeaway : takeaway + '.';
}

async function updateKeyTakeaways() {
  try {
    // Get all scenarios
    const { data: scenarios, error: fetchError } = await supabase
      .from('scenarios')
      .select('id, explanation, key_takeaway');
    
    if (fetchError) {
      console.error('❌ Error fetching scenarios:', fetchError.message);
      return;
    }
    
    console.log(`📊 Found ${scenarios.length} scenarios to update\n`);
    
    let updated = 0;
    let skipped = 0;
    
    for (const scenario of scenarios) {
      // Generate new key takeaway
      const newTakeaway = generateKeyTakeaway(scenario.explanation);
      
      // Only update if different or empty
      if (!scenario.key_takeaway || scenario.key_takeaway !== newTakeaway) {
        const { error: updateError } = await supabase
          .from('scenarios')
          .update({ key_takeaway: newTakeaway })
          .eq('id', scenario.id);
        
        if (updateError) {
          console.error(`❌ Error updating scenario ${scenario.id}:`, updateError.message);
        } else {
          updated++;
          if (updated % 50 === 0) {
            console.log(`✅ Updated ${updated} scenarios...`);
          }
        }
      } else {
        skipped++;
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log(`🎉 Update complete!`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Total: ${scenarios.length}`);
    console.log('='.repeat(60) + '\n');
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

// Run the update
updateKeyTakeaways().catch(console.error);
