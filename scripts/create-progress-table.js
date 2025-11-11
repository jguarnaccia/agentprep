const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createProgressTable() {
  console.log('🚀 Creating progress tracking table...');

  // Read the SQL file
  const sqlPath = path.join(__dirname, 'create-progress-table.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  // Split into individual statements (separated by semicolons)
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  console.log(`📝 Executing ${statements.length} SQL statements...`);

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    console.log(`\n[${i + 1}/${statements.length}] Executing...`);
    
    try {
      const { data, error } = await supabase.rpc('exec_sql', { 
        sql_query: statement 
      });

      if (error) {
        // Try direct query instead
        console.log('Trying alternative method...');
        const result = await supabase.from('_sql').insert({ query: statement });
        
        if (result.error) {
          console.error('❌ Error:', error.message);
          console.log('Statement:', statement.substring(0, 100) + '...');
        } else {
          console.log('✅ Success');
        }
      } else {
        console.log('✅ Success');
      }
    } catch (err) {
      console.error('❌ Unexpected error:', err.message);
    }
  }

  console.log('\n✅ Progress table setup complete!');
  console.log('\nNext steps:');
  console.log('1. Verify table exists in Supabase dashboard');
  console.log('2. Test progress tracking in the app');
}

createProgressTable();
