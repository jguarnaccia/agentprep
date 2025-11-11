// Fix remaining citation issues and ensure critical topics are assigned
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function finalCleanup() {
  console.log('🔧 FINAL CLEANUP - CITATIONS AND CRITICAL TOPICS\n');

  try {
    // 1. Fix citation "Section Section" issues
    console.log('1. Fixing citation duplicates...');
    
    const { data: citationIssues, error: fetchError } = await supabase
      .from('ai_flashcards')
      .select('*')
      .like('citation', '%Section Section%');

    if (fetchError) {
      console.error('❌ Error fetching citation issues:', fetchError);
      return;
    }

    console.log(`   Found ${citationIssues.length} cards with "Section Section" issues`);

    // Fix citations
    for (const card of citationIssues) {
      const fixedCitation = card.citation.replace('Section Section', 'Section');
      
      await supabase
        .from('ai_flashcards')
        .update({ citation: fixedCitation })
        .eq('id', card.id);
    }

    console.log(`   ✅ Fixed ${citationIssues.length} citation issues\n`);

    // 2. Check for Article XXXVI and assign player-agents topic
    console.log('2. Checking Article XXXVI (Player Agents)...');
    
    const { data: xxxviCards } = await supabase
      .from('ai_flashcards')
      .select('*')
      .eq('article_number', 'Article XXXVI');

    if (xxxviCards && xxxviCards.length > 0) {
      console.log(`   Found ${xxxviCards.length} Article XXXVI cards - assigning "player-agents" topic`);
      
      for (const card of xxxviCards) {
        await supabase
          .from('ai_flashcards')
          .update({ topic: 'player-agents' })
          .eq('id', card.id);
      }
      
      console.log('   ✅ Article XXXVI cards updated to "player-agents" topic');
    } else {
      console.log('   ❌ No Article XXXVI cards found');
    }

    // 3. Assign other critical topics
    console.log('\n3. Assigning other critical topics...');
    
    const criticalTopics = {
      'Article VII': 'salary-cap',
      'Article XII': 'trades', 
      'Article XXII': 'health-safety'
    };

    for (const [article, topic] of Object.entries(criticalTopics)) {
      const { data: cards } = await supabase
        .from('ai_flashcards')
        .select('id')
        .eq('article_number', article);

      if (cards && cards.length > 0) {
        console.log(`   Updating ${cards.length} ${article} cards to "${topic}" topic`);
        
        for (const card of cards) {
          await supabase
            .from('ai_flashcards')
            .update({ topic })
            .eq('id', card.id);
        }
      }
    }

    // 4. Final verification
    console.log('\n4. Final verification...');
    
    const { data: finalTopics } = await supabase
      .from('ai_flashcards')
      .select('topic, article_number');

    if (finalTopics) {
      const topicCounts = finalTopics.reduce((acc, card) => {
        acc[card.topic] = (acc[card.topic] || 0) + 1;
        return acc;
      }, {});

      console.log('\n📊 Final topic distribution:');
      Object.entries(topicCounts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([topic, count]) => {
          const critical = ['player-agents', 'salary-cap', 'trades'].includes(topic) ? ' ⭐' : '';
          console.log(`   ${topic}${critical}: ${count} cards`);
        });

      // Check for Article XXXVI specifically
      const xxxviCount = finalTopics.filter(card => card.article_number === 'Article XXXVI').length;
      console.log(`\n⭐ Article XXXVI (Player Agents): ${xxxviCount} cards`);
    }

    console.log('\n✅ Final cleanup complete!');
    console.log('🎯 Your flashcard platform now has proper topics and clean data.');

  } catch (error) {
    console.error('❌ Final cleanup failed:', error);
  }
}

finalCleanup();