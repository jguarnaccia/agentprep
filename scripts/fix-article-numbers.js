// scripts/fix-article-numbers.js
// Run this to clean up "Article Article" issues in your database

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function cleanArticleNumber(articleNumber) {
  if (!articleNumber) return '';
  
  // Remove duplicate "Article" text
  let cleaned = articleNumber.replace(/Article\s+Article\s+/gi, 'Article ');
  
  // Ensure it starts with "Article" if it has roman numerals
  if (/[IVX]+/.test(cleaned) && !cleaned.toLowerCase().startsWith('article')) {
    cleaned = `Article ${cleaned}`;
  }
  
  return cleaned.trim();
}

async function fixArticleNumbers() {
  console.log('🔧 Starting article number cleanup...');
  
  try {
    // Check current state
    const { data: flashcards, error: fetchError } = await supabase
      .from('ai_flashcards')
      .select('id, article_number')
      .not('article_number', 'is', null);

    if (fetchError) {
      console.error('❌ Error fetching flashcards:', fetchError);
      return;
    }

    console.log(`📊 Found ${flashcards.length} flashcards to check`);

    // Find cards that need fixing
    const cardsToFix = flashcards.filter(card => {
      const cleaned = cleanArticleNumber(card.article_number);
      return cleaned !== card.article_number;
    });

    console.log(`🔍 Found ${cardsToFix.length} cards that need fixing`);

    if (cardsToFix.length === 0) {
      console.log('✅ No cards need fixing! Database is clean.');
      return;
    }

    // Show examples of what will be fixed
    console.log('\n🔧 Examples of fixes:');
    cardsToFix.slice(0, 5).forEach(card => {
      const cleaned = cleanArticleNumber(card.article_number);
      console.log(`  "${card.article_number}" → "${cleaned}"`);
    });

    // Fix each card
    let fixed = 0;
    for (const card of cardsToFix) {
      const cleaned = cleanArticleNumber(card.article_number);
      
      const { error: updateError } = await supabase
        .from('ai_flashcards')
        .update({ article_number: cleaned })
        .eq('id', card.id);

      if (updateError) {
        console.error(`❌ Error updating card ${card.id}:`, updateError);
      } else {
        fixed++;
        if (fixed % 100 === 0) {
          console.log(`📝 Fixed ${fixed}/${cardsToFix.length} cards...`);
        }
      }
    }

    console.log(`✅ Successfully fixed ${fixed} out of ${cardsToFix.length} cards`);

    // Verify the fix
    console.log('\n🔍 Verifying fix...');
    const { data: verification, error: verifyError } = await supabase
      .from('ai_flashcards')
      .select('article_number')
      .like('article_number', '%Article Article%');

    if (verifyError) {
      console.error('❌ Error verifying fix:', verifyError);
    } else if (verification.length === 0) {
      console.log('✅ Verification passed - no more "Article Article" entries found!');
    } else {
      console.log(`⚠️  Warning: ${verification.length} entries still have "Article Article"`);
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

async function showArticleStats() {
  console.log('\n📊 Current article distribution:');
  
  try {
    const { data: articles, error } = await supabase
      .from('ai_flashcards')
      .select('article_number')
      .not('article_number', 'is', null)
      .neq('article_number', '');

    if (error) {
      console.error('❌ Error fetching articles:', error);
      return;
    }

    // Count articles
    const counts = {};
    articles.forEach(item => {
      const article = item.article_number;
      counts[article] = (counts[article] || 0) + 1;
    });

    // Sort by Roman numeral order
    const sortedArticles = Object.entries(counts).sort(([a], [b]) => {
      const extractRoman = (str) => {
        const match = str.match(/([IVX]+)/);
        return match ? match[1] : '';
      };
      
      const romanToNum = (roman) => {
        const romanMap = {
          'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10,
          'XI': 11, 'XII': 12, 'XIII': 13, 'XIV': 14, 'XV': 15, 'XVI': 16, 'XVII': 17, 'XVIII': 18, 'XIX': 19, 'XX': 20,
          'XXI': 21, 'XXII': 22, 'XXIII': 23, 'XXIV': 24, 'XXV': 25, 'XXVI': 26, 'XXVII': 27, 'XXVIII': 28, 'XXIX': 29, 'XXX': 30,
          'XXXI': 31, 'XXXII': 32, 'XXXIII': 33, 'XXXIV': 34, 'XXXV': 35, 'XXXVI': 36, 'XXXVII': 37, 'XXXVIII': 38, 'XXXIX': 39, 'XL': 40,
          'XLI': 41, 'XLII': 42
        };
        return romanMap[roman] || 999;
      };
      
      return romanToNum(extractRoman(a)) - romanToNum(extractRoman(b));
    });

    sortedArticles.forEach(([article, count]) => {
      console.log(`  ${article}: ${count} cards`);
    });

    console.log(`\n📈 Total: ${articles.length} AI flashcards across ${sortedArticles.length} articles`);

  } catch (error) {
    console.error('💥 Error showing stats:', error);
  }
}

async function main() {
  console.log('🚀 AgentPrep Database Cleanup Starting...\n');
  await fixArticleNumbers();
  await showArticleStats();
  console.log('\n🎉 Database cleanup complete! Ready for the new flashcard UI.');
}

if (require.main === module) {
  main();
}

module.exports = { cleanArticleNumber, fixArticleNumbers };