// Test script to verify AI Test Generator API
// Run with: node scripts/test-ai-generator.js

const fetch = require('node-fetch');

const TEST_CONFIG = {
  topics: ['salary-cap', 'luxury-tax'],
  difficulty: 'medium',
  questionCount: 5,
  articles: ['Article VII']
};

async function testAIGenerator() {
  console.log('🧪 Testing AI Test Generator API...\n');
  console.log('Test Configuration:');
  console.log(JSON.stringify(TEST_CONFIG, null, 2));
  console.log('\n⏳ Calling API...\n');

  try {
    const response = await fetch('http://localhost:3000/api/generate-ai-test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(TEST_CONFIG)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ API Error:', error);
      return;
    }

    const data = await response.json();
    
    console.log('✅ Test generated successfully!\n');
    console.log(`Session ID: ${data.sessionId}`);
    console.log(`Questions Generated: ${data.questions.length}\n`);
    
    console.log('Sample Question:');
    console.log('─'.repeat(50));
    console.log(`Q: ${data.questions[0].question}`);
    console.log(`\nOptions:`);
    data.questions[0].options.forEach((opt, idx) => {
      const marker = idx === data.questions[0].correct ? '✓' : ' ';
      console.log(`  ${marker} ${opt}`);
    });
    console.log(`\nExplanation: ${data.questions[0].explanation}`);
    console.log(`Citation: ${data.questions[0].citation}`);
    console.log('─'.repeat(50));
    
    console.log('\n🎉 AI Test Generator is working perfectly!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAIGenerator();
