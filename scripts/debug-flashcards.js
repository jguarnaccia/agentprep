// Debug script to understand the flashcard database issues
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function debugFlashcardDatabase() {
  console.log('🔍 DEBUGGING FLASHCARD DATABASE ISSUES\n');

  try {
    // 1. Get actual total count
    console.log('1. Getting TRUE total count...');
    const { count: trueCount, error: countError } = await supabase
      .from('ai_flashcards')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Count error:', countError);
      return;
    }

    console.log(`✅ TRUE total flashcards: ${trueCount}\n`);

    // 2. Check for duplicate records
    console.log('2. Checking for duplicates...');
    const { data: allCards, error } = await supabase
      .from('ai_flashcards')
      .select('id, question, article_number, section_number')
      .order('created_at');

    if (error) {
      console.error('❌ Error fetching cards:', error);
      return;
    }

    // Check for exact duplicate questions
    const questionCounts = {};
    allCards.forEach(card => {
      const key = card.question.toLowerCase().trim();
      questionCounts[key] = (questionCounts[key] || 0) + 1;
    });

    const duplicateQuestions = Object.entries(questionCounts)
      .filter(([question, count]) => count > 1)
      .sort((a, b) => b[1] - a[1]);

    console.log(`✅ Found ${duplicateQuestions.length} duplicate questions\n`);

    if (duplicateQuestions.length > 0) {
      console.log('🔍 Top duplicate questions:');
      duplicateQuestions.slice(0, 5).forEach(([question, count]) => {
        console.log(`  ${count}x: "${question.substring(0, 80)}..."`);
      });
      console.log('');
    }

    // 3. Check Article I specifically (868 cards is crazy!)
    console.log('3. Investigating Article I (868 cards?)...');
    const { data: articleICards } = await supabase
      .from('ai_flashcards')
      .select('*')
      .eq('article_number', 'Article I')
      .limit(10);

    if (articleICards) {
      console.log(`✅ Article I sample (showing first 3 of ${articleICards.length}):`);
      articleICards.slice(0, 3).forEach((card, i) => {
        console.log(`\n  Card ${i + 1}:`);
        console.log(`    Question: "${card.question.substring(0, 100)}..."`);
        console.log(`    Section: ${card.section_number}`);
        console.log(`    Created: ${card.created_at}`);
        console.log(`    ID: ${card.id}`);
      });
    }

    // 4. Check for multiple generations of same content
    console.log('\n4. Checking for multiple generation runs...');
    const { data: creationDates } = await supabase
      .from('ai_flashcards')
      .select('created_at, article_number')
      .order('created_at');

    if (creationDates) {
      const dateGroups = {};
      creationDates.forEach(card => {
        const date = card.created_at.split('T')[0]; // Just the date part
        if (!dateGroups[date]) dateGroups[date] = {};
        dateGroups[date][card.article_number] = (dateGroups[date][card.article_number] || 0) + 1;
      });

      console.log('✅ Flashcards created by date:');
      Object.entries(dateGroups).forEach(([date, articles]) => {
        const totalForDate = Object.values(articles).reduce((sum, count) => sum + count, 0);
        console.log(`  ${date}: ${totalForDate} cards`);
        
        // Show articles with suspicious high counts
        Object.entries(articles).forEach(([article, count]) => {
          if (count > 50) { // Suspicious if more than 50 cards per article per day
            console.log(`    ⚠️  ${article}: ${count} cards (suspicious!)`);
          }
        });
      });
    }

    // 5. Check database schema/structure
    console.log('\n5. Checking for data consistency issues...');
    
    // Check for null/empty critical fields
    const { data: problemCards } = await supabase
      .from('ai_flashcards')
      .select('*')
      .or('question.is.null,answer.is.null,article_number.is.null')
      .limit(5);

    console.log(`✅ Cards with missing data: ${problemCards?.length || 0}`);

    // Check for unusual article numbers
    const { data: allArticleNumbers } = await supabase
      .from('ai_flashcards')
      .select('article_number')
      .order('article_number');

    if (allArticleNumbers) {
      const articleCounts = {};
      allArticleNumbers.forEach(card => {
        articleCounts[card.article_number] = (articleCounts[card.article_number] || 0) + 1;
      });

      console.log('\n📊 Cards per article (top 10 highest):');
      Object.entries(articleCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .forEach(([article, count]) => {
          const suspicious = count > 100 ? ' ⚠️ SUSPICIOUS' : '';
          console.log(`  ${article}: ${count} cards${suspicious}`);
        });
    }

    // 6. Recommendations
    console.log('\n🎯 DIAGNOSIS & RECOMMENDATIONS:');
    
    if (duplicateQuestions.length > 100) {
      console.log('❌ ISSUE: Massive duplicates detected');
      console.log('   Recommendation: Clean duplicate flashcards');
    }
    
    if (trueCount > 2000) {
      console.log('❌ ISSUE: Unrealistic flashcard count');
      console.log('   Recommendation: Check for multiple generation runs');
    }
    
    const maxArticleCount = Math.max(...Object.values(
      allArticleNumbers?.reduce((acc, card) => {
        acc[card.article_number] = (acc[card.article_number] || 0) + 1;
        return acc;
      }, {}) || {}
    ));
    
    if (maxArticleCount > 200) {
      console.log('❌ ISSUE: Single article has too many flashcards');
      console.log('   Recommendation: Review generation logic');
    }

    console.log('\n💡 LIKELY CAUSES:');
    console.log('• Multiple generation script runs without cleanup');
    console.log('• Database query counting logic error'); 
    console.log('• Duplicate content being generated');
    console.log('• Different counting methods in different scripts');

  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

debugFlashcardDatabase();