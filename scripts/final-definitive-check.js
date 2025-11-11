// Final definitive check - no fancy logic, just raw data
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function definitiveCheck() {
  console.log('🎯 DEFINITIVE FINAL CHECK - RAW DATA ONLY\n');

  try {
    // Get ALL flashcards, no filters
    const { data: allCards, error } = await supabase
      .from('ai_flashcards')
      .select('article_number, question')
      .order('article_number');

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log(`📊 TOTAL FLASHCARDS: ${allCards.length}\n`);

    // Count by article - simple and clean
    const articleCounts = {};
    allCards.forEach(card => {
      const article = card.article_number;
      articleCounts[article] = (articleCounts[article] || 0) + 1;
    });

    // Show all articles
    console.log('📋 ALL ARTICLES WITH FLASHCARDS:');
    const sortedArticles = Object.keys(articleCounts).sort();
    
    sortedArticles.forEach(article => {
      const count = articleCounts[article];
      const critical = article === 'Article XXXVI' ? ' ⭐ CRITICAL' : '';
      console.log(`  ${article}${critical}: ${count} flashcards`);
    });

    // Check specifically for Article XXXVI
    console.log('\n🎯 ARTICLE XXXVI CHECK:');
    const xxxviCount = articleCounts['Article XXXVI'] || 0;
    
    if (xxxviCount > 0) {
      console.log(`✅ Article XXXVI: ${xxxviCount} flashcards FOUND`);
      
      // Get a sample
      const xxxviSample = allCards.find(card => card.article_number === 'Article XXXVI');
      if (xxxviSample) {
        console.log(`📝 Sample: "${xxxviSample.question.substring(0, 100)}..."`);
      }
    } else {
      console.log('❌ Article XXXVI: NOT FOUND');
    }

    // Final simple count
    const totalArticles = Object.keys(articleCounts).length;
    console.log(`\n🏆 FINAL ANSWER:`);
    console.log(`  📊 Total flashcards: ${allCards.length}`);
    console.log(`  📚 Articles covered: ${totalArticles}/42`);
    console.log(`  🎯 Coverage: ${(totalArticles/42*100).toFixed(1)}%`);
    console.log(`  ⭐ Article XXXVI: ${xxxviCount > 0 ? 'COVERED ✅' : 'MISSING ❌'}`);

    if (xxxviCount > 0) {
      console.log('\n🎉 SUCCESS! You have Article XXXVI (Player Agents)!');
      console.log('🏀 Your NBA agent certification flashcards are ready!');
    } else {
      console.log('\n📝 Need to generate Article XXXVI (Player Agents)');
    }

  } catch (error) {
    console.error('❌ Check failed:', error);
  }
}

definitiveCheck();