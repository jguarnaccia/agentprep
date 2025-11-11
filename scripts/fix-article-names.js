// Complete fix for article naming and add proper sorting to UI
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixArticleNaming() {
  console.log('🔧 FIXING ARTICLE NAMING AND SORTING\n');

  try {
    // 1. Fix remaining duplicate "Article" text
    console.log('1. Finding cards with duplicate "Article" text...');
    
    const { data: duplicateCards, error } = await supabase
      .from('ai_flashcards')
      .select('*')
      .like('article_number', '%Article Article%');

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log(`   Found ${duplicateCards.length} cards with "Article Article" text`);

    // Fix each card
    for (const card of duplicateCards) {
      const fixedArticleNumber = card.article_number.replace('Article Article ', 'Article ');
      const fixedCitation = card.citation?.replace('Article Article ', 'Article ');

      await supabase
        .from('ai_flashcards')
        .update({ 
          article_number: fixedArticleNumber,
          citation: fixedCitation 
        })
        .eq('id', card.id);
    }

    console.log(`   ✅ Fixed ${duplicateCards.length} article naming issues\n`);

    // 2. Verify the fix
    console.log('2. Verifying article names...');
    
    const { data: allArticles } = await supabase
      .from('ai_flashcards')
      .select('article_number')
      .order('article_number');

    if (allArticles) {
      const uniqueArticles = [...new Set(allArticles.map(f => f.article_number))];
      
      console.log('✅ Current article list:');
      uniqueArticles.forEach(article => {
        console.log(`   ${article}`);
      });
    }

    console.log('\n✅ Article naming fix complete!');

  } catch (error) {
    console.error('❌ Fix failed:', error);
  }
}

fixArticleNaming();