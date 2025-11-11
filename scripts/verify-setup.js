const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifySetup() {
  console.log('🔍 Verifying AgentPrep Setup\n');
  console.log('═'.repeat(60) + '\n');

  // Check CBA content
  console.log('📚 Checking CBA Content...');
  const { data: cbaData, error: cbaError } = await supabase
    .from('cba_content')
    .select('id, article_number, type')
    .limit(5);

  if (cbaError) {
    console.log('  ❌ Error:', cbaError.message);
  } else {
    const { count } = await supabase
      .from('cba_content')
      .select('id', { count: 'exact', head: true });
    
    console.log(`  ✅ Found ${count} CBA entries`);
    
    const { count: sectionCount } = await supabase
      .from('cba_content')
      .select('id', { count: 'exact', head: true })
      .eq('type', 'section');
    
    console.log(`  ✅ Found ${sectionCount} sections to process\n`);
  }

  // Check ai_flashcards table
  console.log('🃏 Checking AI Flashcards Table...');
  const { data: flashcardsData, error: flashcardsError } = await supabase
    .from('ai_flashcards')
    .select('id')
    .limit(1);

  if (flashcardsError) {
    console.log('  ❌ Table does not exist or has permission issues');
    console.log('  ℹ️  Error:', flashcardsError.message);
    console.log('\n  💡 To create the table, run this SQL in Supabase:\n');
    console.log('  https://supabase.com/dashboard/project/wxidxpqdbhlchqxlapdv/sql/new\n');
    console.log('  Or see: scripts/create-ai-flashcards-table.sql\n');
  } else {
    const { count } = await supabase
      .from('ai_flashcards')
      .select('id', { count: 'exact', head: true });
    
    console.log(`  ✅ Table exists with ${count} flashcards\n`);

    if (count > 0) {
      // Get sample flashcard
      const { data: sample } = await supabase
        .from('ai_flashcards')
        .select('*')
        .limit(1)
        .single();

      if (sample) {
        console.log('  📝 Sample flashcard:');
        console.log(`    Question: ${sample.question.substring(0, 60)}...`);
        console.log(`    Article: ${sample.article_number}`);
        console.log(`    Difficulty: ${sample.difficulty}\n`);
      }
    }
  }

  // Check OpenAI API key
  console.log('🤖 Checking OpenAI Configuration...');
  if (process.env.OPENAI_API_KEY) {
    const keyPreview = process.env.OPENAI_API_KEY.substring(0, 20) + '...';
    console.log(`  ✅ API key found: ${keyPreview}\n`);
  } else {
    console.log('  ❌ OPENAI_API_KEY not found in .env.local\n');
  }

  // Summary
  console.log('═'.repeat(60));
  console.log('\n✅ Setup verification complete!\n');
  
  if (flashcardsError) {
    console.log('⚠️  Next step: Create the ai_flashcards table');
    console.log('   Run the SQL from: scripts/create-ai-flashcards-table.sql\n');
  } else {
    console.log('✅ Ready to generate flashcards!');
    console.log('   Run: node scripts/generate-flashcards.js\n');
  }
}

verifySetup().catch(console.error);
