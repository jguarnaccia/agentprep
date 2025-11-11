// Test script to verify flashcards database connection and data
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFlashcards() {
  console.log('🔍 Testing flashcards database connection...\n');

  try {
    // Test basic connection
    console.log('1. Testing database connection...');
    const { data: testData, error: testError } = await supabase
      .from('ai_flashcards')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('❌ Database connection failed:', testError.message);
      return;
    }
    console.log('✅ Database connection successful');

    // Get total count
    console.log('\n2. Counting total flashcards...');
    const { count, error: countError } = await supabase
      .from('ai_flashcards')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Count query failed:', countError.message);
      return;
    }
    console.log(`✅ Total flashcards: ${count.toLocaleString()}`);

    // Get sample flashcards
    console.log('\n3. Fetching sample flashcards...');
    const { data: samples, error: sampleError } = await supabase
      .from('ai_flashcards')
      .select('*')
      .limit(3);

    if (sampleError) {
      console.error('❌ Sample query failed:', sampleError.message);
      return;
    }

    console.log('✅ Sample flashcards:');
    samples.forEach((card, index) => {
      console.log(`\n  Card ${index + 1}:`);
      console.log(`    Article: ${card.article_number} (${card.article_title})`);
      console.log(`    Section: ${card.section_number}`);
      console.log(`    Topic: ${card.topic}`);
      console.log(`    Difficulty: ${card.difficulty}`);
      console.log(`    Question: ${card.question.substring(0, 100)}...`);
      console.log(`    Answer: ${card.answer.substring(0, 100)}...`);
      console.log(`    Citation: ${card.citation}`);
    });

    // Get statistics by difficulty
    console.log('\n4. Getting difficulty distribution...');
    const { data: difficultyStats, error: diffError } = await supabase
      .from('ai_flashcards')
      .select('difficulty')
      .order('difficulty');

    if (diffError) {
      console.error('❌ Difficulty stats failed:', diffError.message);
      return;
    }

    const difficultyCount = difficultyStats.reduce((acc, card) => {
      acc[card.difficulty] = (acc[card.difficulty] || 0) + 1;
      return acc;
    }, {});

    console.log('✅ Difficulty distribution:');
    Object.entries(difficultyCount).forEach(([difficulty, count]) => {
      console.log(`    ${difficulty}: ${count.toLocaleString()}`);
    });

    // Get statistics by topic
    console.log('\n5. Getting topic distribution...');
    const { data: topicStats, error: topicError } = await supabase
      .from('ai_flashcards')
      .select('topic')
      .order('topic');

    if (topicError) {
      console.error('❌ Topic stats failed:', topicError.message);
      return;
    }

    const topicCount = topicStats.reduce((acc, card) => {
      acc[card.topic] = (acc[card.topic] || 0) + 1;
      return acc;
    }, {});

    console.log('✅ Topic distribution:');
    Object.entries(topicCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .forEach(([topic, count]) => {
        console.log(`    ${topic}: ${count.toLocaleString()}`);
      });

    // Get articles covered
    console.log('\n6. Getting article coverage...');
    const { data: articleStats, error: articleError } = await supabase
      .from('ai_flashcards')
      .select('article_number')
      .order('article_number');

    if (articleError) {
      console.error('❌ Article stats failed:', articleError.message);
      return;
    }

    const uniqueArticles = [...new Set(articleStats.map(card => card.article_number))];
    console.log('✅ Articles covered:');
    console.log(`    Total: ${uniqueArticles.length} articles`);
    console.log(`    Articles: ${uniqueArticles.join(', ')}`);

    console.log('\n🎉 All tests passed! Flashcards database is ready for the UI.');
    console.log('\n📋 Summary:');
    console.log(`   • ${count.toLocaleString()} total flashcards`);
    console.log(`   • ${uniqueArticles.length} CBA articles covered`);
    console.log(`   • ${Object.keys(topicCount).length} different topics`);
    console.log(`   • ${Object.keys(difficultyCount).length} difficulty levels`);

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

testFlashcards();