const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkDatabase() {
  console.log('Checking existing questions in database...\n');
  
  // Get all questions
  const { data: allQuestions, error: allError } = await supabase
    .from('questions')
    .select('id, question, category, batch, question_type, source');
  
  if (allError) {
    console.error('Error fetching questions:', allError);
    return;
  }
  
  console.log(`📊 Total questions in database: ${allQuestions.length}\n`);
  
  // Group by question_type
  const byType = allQuestions.reduce((acc, q) => {
    const type = q.question_type || 'multiple_choice';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  
  console.log('By Question Type:');
  Object.entries(byType).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
  });
  console.log('');
  
  // Group by batch
  const byBatch = allQuestions.reduce((acc, q) => {
    const batch = q.batch || 'unknown';
    acc[batch] = (acc[batch] || 0) + 1;
    return acc;
  }, {});
  
  console.log('By Batch:');
  Object.entries(byBatch).sort((a, b) => a[0] - b[0]).forEach(([batch, count]) => {
    console.log(`  Batch ${batch}: ${count}`);
  });
  console.log('');
  
  // Group by source
  const bySource = allQuestions.reduce((acc, q) => {
    const source = q.source || 'Unknown';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});
  
  console.log('By Source:');
  Object.entries(bySource).forEach(([source, count]) => {
    console.log(`  ${source}: ${count}`);
  });
  console.log('');
  
  // Check for Bobby Marks content
  const bobbyMarksQuestions = allQuestions.filter(q => 
    q.source && q.source.includes('Bobby Marks')
  );
  
  console.log(`🔍 Bobby Marks questions already in database: ${bobbyMarksQuestions.length}`);
  
  if (bobbyMarksQuestions.length > 0) {
    console.log('\nSample Bobby Marks questions:');
    bobbyMarksQuestions.slice(0, 5).forEach(q => {
      console.log(`  - ${q.question.substring(0, 80)}...`);
    });
  }
  
  // Check for potential duplicates by question text similarity
  const questionTexts = allQuestions.map(q => q.question.toLowerCase().trim());
  const duplicates = questionTexts.filter((text, index) => 
    questionTexts.indexOf(text) !== index
  );
  
  if (duplicates.length > 0) {
    console.log(`\n⚠️  Found ${duplicates.length} potential duplicate questions`);
  } else {
    console.log('\n✅ No exact duplicate questions found');
  }
  
  // Sample questions from each type
  console.log('\n📝 Sample questions by type:');
  Object.keys(byType).forEach(type => {
    const sample = allQuestions.find(q => (q.question_type || 'multiple_choice') === type);
    if (sample) {
      console.log(`\n${type}:`);
      console.log(`  Q: ${sample.question.substring(0, 100)}...`);
    }
  });
}

checkDatabase();
