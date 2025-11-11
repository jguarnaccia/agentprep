// scripts/check-total-flashcards.js
// Check the actual total count of flashcards in the database

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTotalCount() {
  console.log('🔍 Checking total flashcard count...');
  
  try {
    // Get total count
    const { count, error } = await supabase
      .from('ai_flashcards')
      .select('*', { count: 'exact', head: true });
      
    if (error) {
      console.error('❌ Error getting count:', error);
      return;
    }
    
    console.log('📊 Total flashcards in database:', count);
    
    // Get all cards for analysis
    const { data: allCards, error: fetchError } = await supabase
      .from('ai_flashcards')
      .select('article_number, id, topic, difficulty')
      .not('article_number', 'is', null);
      
    if (fetchError) {
      console.error('❌ Error fetching cards:', fetchError);
      return;
    }
    
    console.log('📈 Cards fetched for analysis:', allCards.length);
    
    // Count by article
    const articleCounts = {};
    allCards.forEach(card => {
      const article = card.article_number;
      articleCounts[article] = (articleCounts[article] || 0) + 1;
    });
    
    // Sort by Roman numeral order
    const romanMap = {
      'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10,
      'XI': 11, 'XII': 12, 'XIII': 13, 'XIV': 14, 'XV': 15, 'XVI': 16, 'XVII': 17, 'XVIII': 18, 'XIX': 19, 'XX': 20,
      'XXI': 21, 'XXII': 22, 'XXIII': 23, 'XXIV': 24, 'XXV': 25, 'XXVI': 26, 'XXVII': 27, 'XXVIII': 28, 'XXIX': 29, 'XXX': 30,
      'XXXI': 31, 'XXXII': 32, 'XXXIII': 33, 'XXXIV': 34, 'XXXV': 35, 'XXXVI': 36, 'XXXVII': 37, 'XXXVIII': 38, 'XXXIX': 39, 'XL': 40,
      'XLI': 41, 'XLII': 42
    };
    
    const extractRoman = (str) => {
      const match = str.match(/([IVX]+)/);
      return match ? match[1] : '';
    };
    
    const romanToNum = (roman) => romanMap[roman] || 999;
    
    const sortedArticles = Object.entries(articleCounts).sort(([a], [b]) => {
      return romanToNum(extractRoman(a)) - romanToNum(extractRoman(b));
    });
    
    console.log('\n📋 Article distribution:');
    let totalCards = 0;
    sortedArticles.forEach(([article, count]) => {
      console.log(`  ${article}: ${count} cards`);
      totalCards += count;
    });
    
    console.log(`\n🎯 Summary: ${totalCards} cards across ${sortedArticles.length} articles`);
    
    // Check for missing articles
    const expectedArticles = [
      'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
      'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX',
      'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI', 'XXVII', 'XXVIII', 'XXIX', 'XXX',
      'XXXI', 'XXXII', 'XXXIII', 'XXXIV', 'XXXV', 'XXXVI', 'XXXVII', 'XXXVIII', 'XXXIX', 'XL',
      'XLI', 'XLII'
    ].map(num => `Article ${num}`);
    
    const currentArticles = sortedArticles.map(([article]) => article);
    const missingArticles = expectedArticles.filter(article => !currentArticles.includes(article));
    
    if (missingArticles.length > 0) {
      console.log('\n❌ Missing articles:');
      missingArticles.forEach(article => console.log(`  ${article}`));
      console.log(`\n💡 Missing ${missingArticles.length} out of 42 articles`);
    } else {
      console.log('\n✅ All 42 articles are present!');
    }
    
    // Check if we exceed 1000 cards
    if (totalCards > 1000) {
      console.log(`\n⚠️  Database has ${totalCards} cards, but you want to limit to 1000`);
      console.log('💡 We can create a rebalancing script to:');
      console.log('   - Keep all 42 articles represented');
      console.log('   - Limit total to 1000 cards');
      console.log('   - Distribute cards proportionally');
    }
    
    // Show topic distribution
    const topicCounts = {};
    allCards.forEach(card => {
      const topic = card.topic || 'general';
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    });
    
    console.log('\n📊 Topic distribution:');
    Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)
      .forEach(([topic, count]) => {
        console.log(`  ${topic}: ${count} cards`);
      });
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

checkTotalCount();