const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// Supabase setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase credentials not found in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// File paths
const PARSED_CBA_FILE = path.join(__dirname, '../cba-parsed/all_articles.json');

console.log('🏀 NBA CBA IMPORTER - Starting...\n');

async function importCBA() {
  // Read parsed CBA data
  if (!fs.existsSync(PARSED_CBA_FILE)) {
    console.error(`❌ Error: Parsed CBA file not found at ${PARSED_CBA_FILE}`);
    console.error('   Run: node scripts/parse-cba-complete.js first!');
    process.exit(1);
  }
  
  const articles = JSON.parse(fs.readFileSync(PARSED_CBA_FILE, 'utf-8'));
  console.log(`📄 Loaded ${articles.length} articles\n`);
  
  // Clear existing CBA content
  console.log('🗑️  Clearing existing CBA content...');
  const { error: deleteError } = await supabase
    .from('cba_content')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
  
  if (deleteError) {
    console.error('❌ Error clearing existing content:', deleteError);
    process.exit(1);
  }
  console.log('✅ Existing content cleared\n');
  
  // Flatten articles into entries for database
  console.log('🔄 Processing articles and sections...');
  const entries = [];
  let orderIndex = 0;
  
  articles.forEach(article => {
    // Add article header entry
    entries.push({
      type: 'article',
      article_number: article.article_number,
      article_title: article.title,
      section_number: null,
      title: article.title,
      content: article.intro_content || `This is ${article.article_number}: ${article.title}`,
      category: null,
      keywords: [],
      order_index: orderIndex++
    });
    
    // Add all sections
    article.sections.forEach(section => {
      entries.push({
        type: 'section',
        article_number: article.article_number,
        article_title: article.title,
        section_number: section.section_number,
        title: section.section_title,
        content: section.content,
        category: null,
        keywords: [],
        order_index: orderIndex++
      });
    });
  });
  
  console.log(`✅ Processed ${entries.length} total entries\n`);
  
  // Import in batches (Supabase has limits on batch size)
  const BATCH_SIZE = 100;
  let imported = 0;
  
  console.log(`📤 Importing ${entries.length} entries in batches of ${BATCH_SIZE}...\n`);
  
  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);
    
    const { data, error } = await supabase
      .from('cba_content')
      .insert(batch);
    
    if (error) {
      console.error(`❌ Error importing batch ${Math.floor(i / BATCH_SIZE) + 1}:`, error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      continue;
    }
    
    imported += batch.length;
    console.log(`   ✓ Imported ${imported}/${entries.length} entries`);
  }
  
  console.log('\n✅ IMPORT COMPLETE!\n');
  console.log(`📊 Successfully imported ${imported} CBA entries to Supabase\n`);
  
  // Summary
  const summary = {
    articles: entries.filter(d => d.type === 'article').length,
    sections: entries.filter(d => d.type === 'section').length,
    total: entries.length
  };
  
  console.log('📈 Summary:');
  console.log(`   Articles: ${summary.articles}`);
  console.log(`   Sections: ${summary.sections}`);
  console.log(`   Total entries: ${summary.total}`);
  console.log('\n🎯 CBA Database ready! Now you can build the Study Guide UI!');
}

// Run import
importCBA().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
