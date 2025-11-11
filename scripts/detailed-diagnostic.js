// Detailed diagnostic script to investigate flashcard database
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function detailedDiagnostic() {
  console.log('🔬 DETAILED FLASHCARD DATABASE DIAGNOSTIC\n');

  try {
    // 1. Get all flashcards with full details
    console.log('1. Fetching all flashcard data...');
    const { data: allCards, error } = await supabase
      .from('ai_flashcards')
      .select('*')
      .order('article_number')
      .order('section_number');

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log(`✅ Total flashcards: ${allCards.length}\n`);

    // 2. Analyze difficulty distribution
    console.log('2. Difficulty Analysis:');
    const difficultyStats = allCards.reduce((acc, card) => {
      const diff = card.difficulty || 'unknown';
      acc[diff] = (acc[diff] || 0) + 1;
      return acc;
    }, {});

    Object.entries(difficultyStats).forEach(([difficulty, count]) => {
      console.log(`   ${difficulty}: ${count}`);
    });
    console.log('');

    // 3. Analyze topic distribution
    console.log('3. Topic Analysis:');
    const topicStats = allCards.reduce((acc, card) => {
      const topic = card.topic || 'unknown';
      acc[topic] = (acc[topic] || 0) + 1;
      return acc;
    }, {});

    Object.entries(topicStats)
      .sort(([,a], [,b]) => b - a)
      .forEach(([topic, count]) => {
        console.log(`   ${topic}: ${count}`);
      });
    console.log('');

    // 4. Analyze article coverage in detail
    console.log('4. Article Coverage Analysis:');
    const articleStats = allCards.reduce((acc, card) => {
      const article = card.article_number;
      if (!acc[article]) {
        acc[article] = {
          count: 0,
          title: card.article_title,
          topics: new Set(),
          difficulties: new Set()
        };
      }
      acc[article].count++;
      acc[article].topics.add(card.topic);
      acc[article].difficulties.add(card.difficulty);
      return acc;
    }, {});

    // Sort articles by Roman numeral order
    const sortedArticles = Object.keys(articleStats).sort((a, b) => {
      const romanToNum = (roman) => {
        const cleaned = roman.replace('Article ', '').trim();
        const values = { 'I': 1, 'V': 5, 'X': 10, 'L': 50 };
        let total = 0;
        for (let i = 0; i < cleaned.length; i++) {
          const current = values[cleaned[i]];
          const next = values[cleaned[i + 1]];
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

    console.log('   Articles with flashcards:');
    sortedArticles.forEach(article => {
      const stats = articleStats[article];
      const topics = Array.from(stats.topics).join(', ');
      const difficulties = Array.from(stats.difficulties).join(', ');
      console.log(`   ${article}: ${stats.count} cards (${topics}) [${difficulties}]`);
    });
    console.log('');

    // 5. Check for missing articles (I-XLII = 1-42)
    console.log('5. Missing Article Analysis:');
    const romanNumerals = [
      'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
      'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX',
      'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI', 'XXVII', 'XXVIII', 'XXIX', 'XXX',
      'XXXI', 'XXXII', 'XXXIII', 'XXXIV', 'XXXV', 'XXXVI', 'XXXVII', 'XXXVIII', 'XXXIX', 'XL',
      'XLI', 'XLII'
    ];

    const presentArticles = new Set(sortedArticles.map(a => a.replace('Article ', '').trim()));
    const missingArticles = romanNumerals.filter(roman => !presentArticles.has(roman));

    if (missingArticles.length > 0) {
      console.log('   Missing articles:');
      missingArticles.forEach(roman => {
        const critical = roman === 'XXXVI' ? ' ⭐ CRITICAL (Player Agents)' : '';
        console.log(`   Article ${roman}${critical}`);
      });
      console.log(`   Total missing: ${missingArticles.length}/42 articles`);
    } else {
      console.log('   ✅ All 42 articles covered!');
    }
    console.log('');

    // 6. Check data quality issues
    console.log('6. Data Quality Check:');
    
    // Check for null/empty fields
    const nullChecks = {
      'missing_question': allCards.filter(c => !c.question || c.question.trim() === '').length,
      'missing_answer': allCards.filter(c => !c.answer || c.answer.trim() === '').length,
      'missing_difficulty': allCards.filter(c => !c.difficulty).length,
      'missing_topic': allCards.filter(c => !c.topic).length,
      'missing_citation': allCards.filter(c => !c.citation).length,
    };

    Object.entries(nullChecks).forEach(([check, count]) => {
      if (count > 0) {
        console.log(`   ⚠️  ${check}: ${count} cards`);
      } else {
        console.log(`   ✅ ${check}: OK`);
      }
    });
    console.log('');

    // 7. Sample problematic data if any
    const problemCards = allCards.filter(c => 
      !c.difficulty || !c.topic || !c.question || !c.answer
    );

    if (problemCards.length > 0) {
      console.log('7. Sample Problematic Cards:');
      problemCards.slice(0, 3).forEach((card, i) => {
        console.log(`   Card ${i + 1}:`);
        console.log(`     Article: ${card.article_number}`);
        console.log(`     Question: ${card.question ? 'OK' : 'MISSING'}`);
        console.log(`     Answer: ${card.answer ? 'OK' : 'MISSING'}`);
        console.log(`     Difficulty: ${card.difficulty || 'MISSING'}`);
        console.log(`     Topic: ${card.topic || 'MISSING'}`);
        console.log('');
      });
    }

    // 8. Database summary
    console.log('8. Database Summary:');
    console.log(`   📊 Total flashcards: ${allCards.length.toLocaleString()}`);
    console.log(`   📚 Articles covered: ${sortedArticles.length}/42 (${(sortedArticles.length/42*100).toFixed(1)}%)`);
    console.log(`   🎯 Topics: ${Object.keys(topicStats).length}`);
    console.log(`   📈 Difficulties: ${Object.keys(difficultyStats).length}`);
    console.log(`   ⚠️  Data issues: ${problemCards.length} cards`);
    
    if (missingArticles.length > 0) {
      console.log(`   📝 Missing articles: ${missingArticles.length} (including Article XXXVI)`);
      console.log('   🎯 Recommendation: Generate missing articles for complete coverage');
    } else {
      console.log('   ✅ Complete NBA CBA coverage achieved!');
    }

  } catch (error) {
    console.error('❌ Diagnostic failed:', error);
  }
}

detailedDiagnostic();