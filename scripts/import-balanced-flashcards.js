// scripts/import-balanced-flashcards.js
// Import the balanced flashcard set to database

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function importBalancedFlashcards() {
  console.log('🚀 Importing balanced flashcards to database...');
  
  try {
    const fs = require('fs');
    
    // Try to load the perfect set first, fall back to final set
    let data;
    try {
      data = JSON.parse(fs.readFileSync('perfect-1000-flashcards.json', 'utf8'));
      console.log('📥 Loading perfect-1000-flashcards.json');
    } catch (e) {
      data = JSON.parse(fs.readFileSync('final-balanced-flashcards.json', 'utf8'));
      console.log('📥 Loading final-balanced-flashcards.json');
    }
    
    const cards = data.cards;
    console.log(`📊 Found ${cards.length} cards to import\n`);
    
    // Create the balanced_flashcards table
    console.log('🏗️  Creating balanced_flashcards table...');
    
    const createTableSQL = `
      -- Drop existing table if it exists
      DROP TABLE IF EXISTS balanced_flashcards;
      
      -- Create new table
      CREATE TABLE balanced_flashcards (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        original_id UUID,  -- Reference to original card
        cba_section_id UUID,
        article_number TEXT NOT NULL,
        article_title TEXT,
        section_number TEXT,
        section_title TEXT,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        citation TEXT NOT NULL,
        topic TEXT,
        difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
        created_at TIMESTAMP DEFAULT NOW(),
        balanced_at TIMESTAMP DEFAULT NOW()
      );
      
      -- Enable RLS
      ALTER TABLE balanced_flashcards ENABLE ROW LEVEL SECURITY;
      
      -- Create policy for public read access
      CREATE POLICY "Public read access" ON balanced_flashcards
        FOR SELECT USING (true);
        
      -- Create indexes for better performance
      CREATE INDEX idx_balanced_flashcards_article ON balanced_flashcards(article_number);
      CREATE INDEX idx_balanced_flashcards_topic ON balanced_flashcards(topic);
      CREATE INDEX idx_balanced_flashcards_difficulty ON balanced_flashcards(difficulty);
      CREATE INDEX idx_balanced_flashcards_original_id ON balanced_flashcards(original_id);
    `;
    
    // Execute table creation
    const { error: createError } = await supabase.rpc('exec_sql', { 
      sql: createTableSQL 
    });
    
    if (createError) {
      console.log('ℹ️  Table creation error (might already exist):', createError.message);
      
      // Try simple drop and create
      await supabase.rpc('exec_sql', { sql: 'DROP TABLE IF EXISTS balanced_flashcards;' });
      await supabase.rpc('exec_sql', { 
        sql: `CREATE TABLE balanced_flashcards (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          original_id UUID,
          cba_section_id UUID,
          article_number TEXT NOT NULL,
          article_title TEXT,
          section_number TEXT,
          section_title TEXT,
          question TEXT NOT NULL,
          answer TEXT NOT NULL,
          citation TEXT NOT NULL,
          topic TEXT,
          difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
          created_at TIMESTAMP DEFAULT NOW(),
          balanced_at TIMESTAMP DEFAULT NOW()
        );`
      });
      
      await supabase.rpc('exec_sql', { 
        sql: 'ALTER TABLE balanced_flashcards ENABLE ROW LEVEL SECURITY;'
      });
      
      await supabase.rpc('exec_sql', { 
        sql: `CREATE POLICY "Public read access" ON balanced_flashcards FOR SELECT USING (true);`
      });
    }
    
    console.log('✅ Table created successfully');
    
    // Prepare cards for import
    console.log('📝 Preparing cards for import...');
    const cardsToImport = cards.map(card => ({
      original_id: card.id,
      cba_section_id: card.cba_section_id || null,
      article_number: card.article_number || '',
      article_title: card.article_title || '',
      section_number: card.section_number || '',
      section_title: card.section_title || '',
      question: card.question || '',
      answer: card.answer || '',
      citation: card.citation || '',
      topic: card.topic || 'general',
      difficulty: card.difficulty || 'medium'
    }));
    
    // Import in batches
    console.log('📥 Importing cards in batches...');
    const batchSize = 100;
    let imported = 0;
    
    for (let i = 0; i < cardsToImport.length; i += batchSize) {
      const batch = cardsToImport.slice(i, i + batchSize);
      
      const { error: insertError } = await supabase
        .from('balanced_flashcards')
        .insert(batch);
      
      if (insertError) {
        console.error(`❌ Error importing batch ${Math.floor(i/batchSize) + 1}:`, insertError);
        continue;
      }
      
      imported += batch.length;
      console.log(`   Imported ${imported}/${cardsToImport.length} cards`);
    }
    
    console.log(`\n✅ Successfully imported ${imported} cards`);
    
    // Verify import
    console.log('🔍 Verifying import...');
    const { count, error: countError } = await supabase
      .from('balanced_flashcards')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Error verifying import:', countError);
    } else {
      console.log(`✅ Verified: ${count} cards in balanced_flashcards table`);
    }
    
    // Show article distribution
    const { data: articleCounts, error: articleError } = await supabase
      .from('balanced_flashcards')
      .select('article_number')
      .not('article_number', 'is', null);
    
    if (!articleError && articleCounts) {
      const distribution = {};
      articleCounts.forEach(item => {
        distribution[item.article_number] = (distribution[item.article_number] || 0) + 1;
      });
      
      console.log('\n📊 Article distribution in database:');
      Object.entries(distribution)
        .sort()
        .forEach(([article, count]) => {
          console.log(`   ${article}: ${count} cards`);
        });
    }
    
    console.log('\n🎉 Import complete!');
    console.log('\n📝 Next steps:');
    console.log('   1. Update your flashcard page to use "balanced_flashcards" table');
    console.log('   2. Test the new balanced flashcard experience');
    console.log('   3. Optionally add Bobby Marks questions for even more content');
    
  } catch (error) {
    console.error('💥 Import error:', error);
  }
}

importBalancedFlashcards();