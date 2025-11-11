const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkFlashcards() {
  console.log('🃏 Checking AI-Generated Flashcards\n');
  console.log('═'.repeat(60) + '\n');

  // Get total count
  const { count: totalCount } = await supabase
    .from('ai_flashcards')
    .select('id', { count: 'exact', head: true });

  console.log(`📊 Total Flashcards: ${totalCount}\n`);

  if (totalCount === 0) {
    console.log('⚠️  No flashcards found. Run generation script first:\n');
    console.log('   node scripts/generate-flashcards.js\n');
    return;
  }

  // Get all flashcards for analysis
  const { data: flashcards, error } = await supabase
    .from('ai_flashcards')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching flashcards:', error);
    return;
  }

  // By Difficulty
  console.log('📈 By Difficulty:');
  const byDifficulty = flashcards.reduce((acc, f) => {
    acc[f.difficulty] = (acc[f.difficulty] || 0) + 1;
    return acc;
  }, {});
  
  Object.entries(byDifficulty)
    .sort((a, b) => b[1] - a[1])
    .forEach(([diff, count]) => {
      const percentage = ((count / totalCount) * 100).toFixed(1);
      console.log(`  ${diff.padEnd(10)}: ${String(count).padStart(4)} (${percentage}%)`);
    });
  console.log('');

  // By Topic
  console.log('📚 By Topic:');
  const byTopic = flashcards.reduce((acc, f) => {
    acc[f.topic] = (acc[f.topic] || 0) + 1;
    return acc;
  }, {});
  
  Object.entries(byTopic)
    .sort((a, b) => b[1] - a[1])
    .forEach(([topic, count]) => {
      const percentage = ((count / totalCount) * 100).toFixed(1);
      console.log(`  ${topic.padEnd(20)}: ${String(count).padStart(4)} (${percentage}%)`);
    });
  console.log('');

  // By Article
  console.log('📖 By Article (Top 10):');
  const byArticle = flashcards.reduce((acc, f) => {
    const article = f.article_number.split('-')[0];
    acc[article] = (acc[article] || 0) + 1;
    return acc;
  }, {});
  
  Object.entries(byArticle)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([article, count]) => {
      const sample = flashcards.find(f => f.article_number.startsWith(article));
      const title = sample?.article_title || 'Unknown';
      console.log(`  Article ${article.padEnd(6)}: ${String(count).padStart(4)} - ${title.substring(0, 40)}`);
    });
  console.log('');

  // Sample flashcards
  console.log('📝 Sample Flashcards:\n');
  
  // One from each difficulty
  ['easy', 'medium', 'hard'].forEach(difficulty => {
    const sample = flashcards.find(f => f.difficulty === difficulty);
    if (sample) {
      console.log(`${difficulty.toUpperCase()} DIFFICULTY:`);
      console.log(`Question: ${sample.question}`);
      console.log(`Answer: ${sample.answer.substring(0, 150)}${sample.answer.length > 150 ? '...' : ''}`);
      console.log(`Citation: ${sample.citation}`);
      console.log(`Topic: ${sample.topic}\n`);
    }
  });

  // Quality checks
  console.log('═'.repeat(60));
  console.log('\n🔍 Quality Checks:\n');

  const avgQuestionLength = flashcards.reduce((sum, f) => sum + f.question.length, 0) / flashcards.length;
  const avgAnswerLength = flashcards.reduce((sum, f) => sum + f.answer.length, 0) / flashcards.length;

  console.log(`Average question length: ${avgQuestionLength.toFixed(0)} characters`);
  console.log(`Average answer length: ${avgAnswerLength.toFixed(0)} characters`);

  // Check for very short or very long
  const shortQuestions = flashcards.filter(f => f.question.length < 20);
  const longQuestions = flashcards.filter(f => f.question.length > 200);
  const shortAnswers = flashcards.filter(f => f.answer.length < 50);
  const longAnswers = flashcards.filter(f => f.answer.length > 500);

  if (shortQuestions.length > 0) {
    console.log(`⚠️  ${shortQuestions.length} questions are very short (<20 chars)`);
  }
  if (longQuestions.length > 0) {
    console.log(`⚠️  ${longQuestions.length} questions are very long (>200 chars)`);
  }
  if (shortAnswers.length > 0) {
    console.log(`⚠️  ${shortAnswers.length} answers are very short (<50 chars)`);
  }
  if (longAnswers.length > 0) {
    console.log(`⚠️  ${longAnswers.length} answers are very long (>500 chars)`);
  }

  // Check citation format
  const missingCitations = flashcards.filter(f => !f.citation || !f.citation.includes('Article'));
  if (missingCitations.length > 0) {
    console.log(`⚠️  ${missingCitations.length} flashcards have missing or invalid citations`);
  }

  if (shortQuestions.length === 0 && longQuestions.length === 0 && 
      shortAnswers.length === 0 && longAnswers.length === 0 && 
      missingCitations.length === 0) {
    console.log('✅ All quality checks passed!');
  }

  console.log('');

  // Coverage analysis
  console.log('═'.repeat(60));
  console.log('\n📊 Coverage Analysis:\n');

  const { count: totalSections } = await supabase
    .from('cba_content')
    .select('id', { count: 'exact', head: true })
    .eq('type', 'section');

  const { count: coveredSections } = await supabase
    .from('cba_content')
    .select('id', { count: 'exact', head: true })
    .eq('type', 'section')
    .in('id', flashcards.map(f => f.cba_section_id).filter(Boolean));

  const coveragePercentage = ((coveredSections / totalSections) * 100).toFixed(1);

  console.log(`Total CBA sections: ${totalSections}`);
  console.log(`Sections with flashcards: ${coveredSections} (${coveragePercentage}%)`);
  console.log(`Sections missing flashcards: ${totalSections - coveredSections}`);

  if (coveragePercentage < 100) {
    console.log('\n💡 To generate flashcards for missing sections, run:');
    console.log('   node scripts/generate-flashcards.js\n');
  } else {
    console.log('\n✅ All sections have flashcards!\n');
  }

  // Newest flashcards
  console.log('═'.repeat(60));
  console.log('\n🆕 Most Recently Generated:\n');
  
  flashcards.slice(0, 5).forEach((f, i) => {
    const date = new Date(f.created_at).toLocaleString();
    console.log(`${i + 1}. [${date}] Article ${f.article_number} - ${f.difficulty}`);
    console.log(`   ${f.question.substring(0, 70)}...\n`);
  });

  console.log('═'.repeat(60));
  console.log('\n✅ Flashcard analysis complete!\n');
}

checkFlashcards().catch(console.error);
