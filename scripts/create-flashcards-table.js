const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createFlashcardsTable() {
  console.log('📊 Creating ai_flashcards table...\n');

  // Read the SQL file
  const sqlPath = path.join(__dirname, 'create-ai-flashcards-table.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  // Split by semicolons to execute each statement
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    console.log(`Executing statement ${i + 1}/${statements.length}...`);
    
    const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
    
    if (error) {
      // Try direct execution if RPC doesn't work
      console.log('RPC failed, trying direct execution...');
      
      // For Supabase, we can't execute raw SQL directly from the client
      // Instead, let's create the table using the REST API or suggest manual execution
      console.log('\n⚠️  Unable to execute SQL directly from Node.js');
      console.log('Please run this SQL in your Supabase SQL Editor:\n');
      console.log('📍 https://supabase.com/dashboard/project/wxidxpqdbhlchqxlapdv/sql/new\n');
      console.log(sql);
      console.log('\n💡 Or copy from: scripts/create-ai-flashcards-table.sql\n');
      return false;
    }
    
    console.log('✅ Success!\n');
  }

  console.log('✅ Table created successfully!\n');
  
  // Verify the table exists
  const { data, error } = await supabase
    .from('ai_flashcards')
    .select('id')
    .limit(1);

  if (error) {
    console.log('⚠️  Could not verify table. Please check manually.');
    console.log('Error:', error.message);
    return false;
  }

  console.log('✅ Table verified and ready to use!\n');
  return true;
}

createFlashcardsTable().catch(console.error);
