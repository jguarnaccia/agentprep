// Script to clean up and reorganize flashcard data
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Proper topic mapping based on NBA CBA articles
const ARTICLE_TOPICS = {
  'I': 'definitions',
  'II': 'player-contracts',
  'III': 'general',
  'IV': 'benefits',
  'V': 'general',
  'VI': 'conduct',
  'VII': 'salary-cap',
  'VIII': 'rookie-scale', 
  'IX': 'general',
  'X': 'player-movement',
  'XI': 'free-agency',
  'XII': 'trades',
  'XIII': 'draft',
  'XIV': 'general',
  'XV': 'general',
  'XVI': 'general',
  'XVII': 'facilities',
  'XVIII': 'facilities',
  'XIX': 'general',
  'XX': 'general',
  'XXI': 'general',
  'XXII': 'health-safety',
  'XXIII': 'conduct',
  'XXIV': 'general',
  'XXV': 'general',
  'XXVI': 'general',
  'XXVII': 'general',
  'XXVIII': 'general',
  'XXIX': 'arbitration',
  'XXX': 'general',
  'XXXI': 'arbitration',
  'XXXII': 'general',
  'XXXIII': 'health-safety',
  'XXXIV': 'general',
  'XXXV': 'general',
  'XXXVI': 'player-agents',
  'XXXVII': 'general',
  'XXXVIII': 'general',
  'XXXIX': 'general',
  'XL': 'general',
  'XLI': 'general',
  'XLII': 'general'
};

async function cleanupFlashcards() {
  console.log('🧹 CLEANING UP FLASHCARD DATA\n');

  try {
    // 1. Get all flashcards
    console.log('1. Fetching all flashcards...');
    const { data: allCards, error } = await supabase
      .from('ai_flashcards')
      .select('*');

    if (error) {
      console.error('❌ Error fetching flashcards:', error);
      return;
    }

    console.log(`✅ Found ${allCards.length} flashcards to clean\n`);

    // 2. Analyze current issues
    console.log('2. Analyzing current issues...');
    
    const currentIssues = {
      duplicateArticleText: 0,
      generalTopic: 0,
      incorrectCitations: 0
    };

    allCards.forEach(card => {
      if (card.article_number && card.article_number.includes('Article Article')) {
        currentIssues.duplicateArticleText++;
      }
      if (card.topic === 'general') {
        currentIssues.generalTopic++;
      }
      if (card.citation && card.citation.includes('Article Article')) {
        currentIssues.incorrectCitations++;
      }
    });

    console.log('Issues found:');
    console.log(`  - Duplicate "Article" text: ${currentIssues.duplicateArticleText} cards`);
    console.log(`  - Generic "general" topic: ${currentIssues.generalTopic} cards`);
    console.log(`  - Incorrect citations: ${currentIssues.incorrectCitations} cards\n`);

    // 3. Clean up the data
    console.log('3. Cleaning up flashcard data...');

    const cleanedCards = allCards.map(card => {
      const cleanedCard = { ...card };

      // Fix article number (remove duplicate "Article")
      if (cleanedCard.article_number) {
        cleanedCard.article_number = cleanedCard.article_number
          .replace('Article Article ', 'Article ')
          .replace('Article Article', 'Article');
      }

      // Extract Roman numeral for topic assignment
      const romanNumeral = cleanedCard.article_number
        ?.replace('Article ', '')
        ?.trim();

      // Assign proper topic
      if (romanNumeral && ARTICLE_TOPICS[romanNumeral]) {
        cleanedCard.topic = ARTICLE_TOPICS[romanNumeral];
      }

      // Fix citation
      if (cleanedCard.citation) {
        cleanedCard.citation = cleanedCard.citation
          .replace('Article Article ', 'Article ')
          .replace('Article Article', 'Article');
      }

      return cleanedCard;
    });

    // 4. Update database in batches
    console.log('4. Updating database...');

    const batchSize = 100;
    let updated = 0;
    let failed = 0;

    for (let i = 0; i < cleanedCards.length; i += batchSize) {
      const batch = cleanedCards.slice(i, i + batchSize);
      
      console.log(`   Updating batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(cleanedCards.length/batchSize)}...`);

      for (const card of batch) {
        try {
          const { error: updateError } = await supabase
            .from('ai_flashcards')
            .update({
              article_number: card.article_number,
              topic: card.topic,
              citation: card.citation
            })
            .eq('id', card.id);

          if (updateError) {
            console.error(`     ❌ Failed to update card ${card.id}:`, updateError.message);
            failed++;
          } else {
            updated++;
          }
        } catch (error) {
          console.error(`     ❌ Error updating card ${card.id}:`, error.message);
          failed++;
        }
      }

      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\n✅ Update complete:`);
    console.log(`   Updated: ${updated} cards`);
    console.log(`   Failed: ${failed} cards\n`);

    // 5. Verify the cleanup
    console.log('5. Verifying cleanup...');

    const { data: verifyCards, error: verifyError } = await supabase
      .from('ai_flashcards')
      .select('article_number, topic, citation')
      .limit(10);

    if (verifyError) {
      console.error('❌ Verification error:', verifyError);
      return;
    }

    console.log('✅ Sample cleaned data:');
    verifyCards.slice(0, 3).forEach((card, i) => {
      console.log(`   ${i + 1}. ${card.article_number} | Topic: ${card.topic} | Citation: ${card.citation}`);
    });

    // 6. Get updated topic distribution
    const { data: topicCheck } = await supabase
      .from('ai_flashcards')
      .select('topic');

    if (topicCheck) {
      const topicCounts = topicCheck.reduce((acc, card) => {
        acc[card.topic] = (acc[card.topic] || 0) + 1;
        return acc;
      }, {});

      console.log('\n📊 Updated topic distribution:');
      Object.entries(topicCounts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([topic, count]) => {
          console.log(`   ${topic}: ${count} cards`);
        });
    }

    console.log('\n🎉 Cleanup complete! Your flashcard filters should now work properly.');
    console.log('🔄 Refresh your flashcard UI to see the improvements.');

  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  }
}

cleanupFlashcards();