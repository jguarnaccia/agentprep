const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkDatabase() {
  console.log('🔍 Checking AgentPrep Database Tables...\n');

  const tables = [
    'flashcard_sets',
    'flashcards',
    'scenarios',
    'questions',
    'user_progress',
    'cba_content',
    'test_results',
    'user_notes'
  ];

  const results = {};

  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        if (error.message.includes('does not exist')) {
          results[table] = { exists: false, count: 0, error: 'Table does not exist' };
        } else {
          results[table] = { exists: true, count: 0, error: error.message };
        }
      } else {
        results[table] = { exists: true, count: count || 0, error: null };
      }
    } catch (err) {
      results[table] = { exists: false, count: 0, error: err.message };
    }
  }

  // Print results
  console.log('📊 Table Status:\n');
  
  let allGood = true;
  tables.forEach(table => {
    const result = results[table];
    const status = result.exists ? '✅' : '❌';
    const countStr = result.exists ? `(${result.count} rows)` : '';
    const errorStr = result.error ? `⚠️  ${result.error}` : '';
    
    console.log(`${status} ${table.padEnd(20)} ${countStr} ${errorStr}`);
    
    if (!result.exists) allGood = false;
  });

  console.log('\n' + '='.repeat(60) + '\n');

  if (allGood) {
    console.log('🎉 SUCCESS! All tables exist!\n');
    console.log('Your database is ready to use.');
  } else {
    console.log('⚠️  MISSING TABLES DETECTED!\n');
    console.log('Please run this SQL file in Supabase SQL Editor:');
    console.log('📄 /scripts/setup-complete-database.sql\n');
    console.log('Instructions:');
    console.log('1. Open Supabase Dashboard');
    console.log('2. Go to SQL Editor');
    console.log('3. Create New Query');
    console.log('4. Paste contents of setup-complete-database.sql');
    console.log('5. Click Run');
  }

  console.log('\n' + '='.repeat(60));
}

checkDatabase().catch(console.error);
