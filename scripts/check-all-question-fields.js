const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkAllFields() {
  console.log('🔍 Checking ALL fields in questions table...\n');
  
  // Get one scenario question with all fields
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('question_type', 'scenario')
    .limit(1);
  
  if (error) {
    console.error('❌ Error:', error);
    return;
  }
  
  if (data && data.length > 0) {
    const question = data[0];
    console.log('📊 All fields in questions table:\n');
    
    Object.keys(question).forEach(key => {
      const value = question[key];
      const valueStr = typeof value === 'string' && value.length > 100 
        ? value.substring(0, 100) + '...' 
        : JSON.stringify(value);
      
      console.log(`${key}: ${valueStr}`);
    });
    
    console.log('\n🔍 Looking for correct answer indicator...\n');
    
    // Check for fields that might indicate correct answer
    const possibleFields = ['correct', 'correct_answer', 'answer', 'correct_option', 'right_answer'];
    possibleFields.forEach(field => {
      if (question[field] !== undefined) {
        console.log(`✅ Found: ${field} = ${question[field]}`);
      }
    });
  }
}

checkAllFields().catch(console.error);
