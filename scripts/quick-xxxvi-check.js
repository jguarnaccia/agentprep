// Simple check for Article XXXVI in the clean 3,204 flashcard database
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkArticleXXXVI() {
  console.log('🔍 CHECKING FOR ARTICLE XXXVI (PLAYER AGENTS)\n');

  try {
    // Check for Article XXXVI specifically
    const { data: xxxviCards, error } = await supabase
      .from('ai_flashcards')
      .select('*')
      .eq('article_number', 'Article XXXVI');

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log(`Article XXXVI (Player Agents): ${xxxviCards.length} flashcards`);

    if (xxxviCards.length > 0) {
      console.log('✅ GREAT NEWS! Article XXXVI is covered!\n');
      console.log('Sample flashcard:');
      console.log(`Q: ${xxxviCards[0].question}`);
      console.log(`A: ${xxxviCards[0].answer.substring(0, 200)}...`);
      console.log(`Citation: ${xxxviCards[0].citation}`);
    } else {
      console.log('❌ Article XXXVI (Player Agents) is still missing');
      console.log('⭐ This is the CRITICAL article for NBA agent certification');
    }

    // Quick coverage check
    const { data: allArticles } = await supabase
      .from('ai_flashcards')
      .select('article_number');

    if (allArticles) {
      const uniqueArticles = [...new Set(allArticles.map(f => f.article_number))];
      console.log(`\n📊 Current Status:`);
      console.log(`Total flashcards: 3,204`);
      console.log(`Articles covered: ${uniqueArticles.length}/42`);
      console.log(`Coverage: ${(uniqueArticles.length/42*100).toFixed(1)}%`);
      
      const hasPlayerAgents = uniqueArticles.includes('Article XXXVI');
      console.log(`Article XXXVI (Player Agents): ${hasPlayerAgents ? 'COVERED ✅' : 'MISSING ❌'}`);
    }

  } catch (error) {
    console.error('❌ Check failed:', error);
  }
}

checkArticleXXXVI();