// Quick verification of Article XXXVI flashcards
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function verifyArticleXXXVI() {
  console.log('🔍 VERIFYING ARTICLE XXXVI FLASHCARDS\n');

  try {
    // Check for Article XXXVI flashcards
    const { data: xxxviCards, error } = await supabase
      .from('ai_flashcards')
      .select('*')
      .eq('article_number', 'Article XXXVI')
      .order('section_number');

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log(`✅ Found ${xxxviCards.length} Article XXXVI flashcards\n`);

    if (xxxviCards.length > 0) {
      console.log('📋 Article XXXVI Flashcard Details:');
      console.log(`  Article: ${xxxviCards[0].article_number}`);
      console.log(`  Title: ${xxxviCards[0].article_title}`);
      console.log(`  Topic: ${xxxviCards[0].topic}`);
      console.log(`  Difficulty range: ${[...new Set(xxxviCards.map(c => c.difficulty))].join(', ')}`);
      
      console.log('\n📝 Sample Flashcards:');
      xxxviCards.slice(0, 3).forEach((card, i) => {
        console.log(`\n  ${i + 1}. ${card.difficulty.toUpperCase()}`);
        console.log(`     Q: ${card.question.substring(0, 100)}...`);
        console.log(`     A: ${card.answer.substring(0, 100)}...`);
        console.log(`     Citation: ${card.citation}`);
      });
    }

    // Get updated article coverage
    console.log('\n🔍 Checking All Article Coverage:');
    const { data: allCards } = await supabase
      .from('ai_flashcards')
      .select('article_number');

    if (allCards) {
      const uniqueArticles = [...new Set(allCards.map(f => f.article_number.replace('Article ', '')))];
      const sortedArticles = uniqueArticles.sort((a, b) => {
        const romanToNum = (roman) => {
          const values = { 'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000 };
          let total = 0;
          for (let i = 0; i < roman.length; i++) {
            const current = values[roman[i]];
            const next = values[roman[i + 1]];
            if (next && current < next) {
              total += next - current;
              i++;
            } else {
              total += current;
            }
          }
          return total;
        };
        return romanToNum(a) - romanToNum(b);
      });

      console.log(`\n📊 Current Coverage: ${uniqueArticles.length}/42 articles`);
      console.log('✅ Articles with flashcards:');
      sortedArticles.forEach(article => {
        const count = allCards.filter(f => f.article_number.includes(article)).length;
        const critical = article === 'XXXVI' ? ' ⭐ CRITICAL' : '';
        console.log(`  Article ${article}${critical}: ${count} flashcards`);
      });

      // Check for missing articles
      const allPossibleArticles = [
        'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
        'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX',
        'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI', 'XXVII', 'XXVIII', 'XXIX', 'XXX',
        'XXXI', 'XXXII', 'XXXIII', 'XXXIV', 'XXXV', 'XXXVI', 'XXXVII', 'XXXVIII', 'XXXIX', 'XL',
        'XLI', 'XLII'
      ];

      const missingArticles = allPossibleArticles.filter(article => !uniqueArticles.includes(article));
      
      if (missingArticles.length > 0) {
        console.log('\n❌ Still missing:');
        missingArticles.forEach(article => {
          console.log(`  Article ${article}`);
        });
      } else {
        console.log('\n🎉 PERFECT! All 42 articles covered!');
      }

      console.log(`\n🏆 COVERAGE: ${(uniqueArticles.length/42*100).toFixed(1)}%`);
      console.log(`📊 TOTAL FLASHCARDS: ${allCards.length.toLocaleString()}`);
    }

  } catch (error) {
    console.error('❌ Verification failed:', error);
  }
}

verifyArticleXXXVI();