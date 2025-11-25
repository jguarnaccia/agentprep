import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function resetAchievements() {
  console.log('🔄 Resetting all achievements...');
  
  // Delete all user achievements
  const { error } = await supabase
    .from('user_achievements')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows
  
  if (error) {
    console.error('❌ Error:', error);
  } else {
    console.log('✅ All achievements reset! They will unlock again as you study.');
  }
}

resetAchievements();
