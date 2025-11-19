const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Topics that need more scenarios
const topicsNeeded = [
  { topic: 'Waivers', needed: 9, difficulty: 'Intermediate' },
  { topic: 'Player Contracts', needed: 14, difficulty: 'Intermediate' },
  { topic: 'Two-Way Contracts', needed: 14, difficulty: 'Intermediate' },
  { topic: 'Rookie Scale', needed: 17, difficulty: 'Beginner' },
  { topic: 'Contract Structures', needed: 20, difficulty: 'Intermediate' },
  { topic: 'Luxury Tax & Aprons', needed: 21, difficulty: 'Advanced' },
  { topic: 'Rookie Extensions', needed: 21, difficulty: 'Intermediate' },
  { topic: 'Salary Cap Management', needed: 21, difficulty: 'Advanced' },
  { topic: 'Trade Mechanics', needed: 21, difficulty: 'Intermediate' },
  { topic: 'Veteran Extensions', needed: 21, difficulty: 'Advanced' },
  { topic: 'Waivers & Buyouts', needed: 21, difficulty: 'Intermediate' },
  { topic: 'Designated Rookie Extensions', needed: 22, difficulty: 'Advanced' },
  { topic: 'Free Agency Rules', needed: 23, difficulty: 'Intermediate' },
  { topic: 'Bird Rights', needed: 24, difficulty: 'Advanced' },
  { topic: 'Designated Veteran Extensions', needed: 24, difficulty: 'Advanced' },
  { topic: 'Rookie Contracts', needed: 24, difficulty: 'Beginner' }
];

async function generateScenario(topic, difficulty, existingScenarios) {
  const prompt = `You are an expert NBA salary cap consultant creating practice scenarios for aspiring NBA agents studying for their NBPA certification exam.

Create ONE realistic, exam-style scenario about: ${topic}
Difficulty level: ${difficulty}

The scenario should:
- Present a real-world situation an NBA team/agent might face
- Include specific dollar amounts, player examples, and CBA rules
- Have 4 multiple choice answers (a, b, c, d)
- Only ONE answer should be correct
- Include a detailed explanation citing relevant CBA articles
- Be different from these existing scenarios: ${existingScenarios.map(s => s.situation.substring(0, 50)).join('; ')}

Return ONLY a valid JSON object with this EXACT structure (no markdown, no code blocks):
{
  "situation": "The detailed scenario setup with specific teams, players, and circumstances",
  "question": "What is the correct answer?",
  "options": [
    {"id": "a", "text": "First option with specific details", "isCorrect": false},
    {"id": "b", "text": "Second option (THIS ONE IS CORRECT)", "isCorrect": true},
    {"id": "c", "text": "Third option", "isCorrect": false},
    {"id": "d", "text": "Fourth option", "isCorrect": false}
  ],
  "explanation": "Detailed explanation of why the correct answer is right, citing specific CBA articles and rules. Should be 3-4 sentences.",
  "key_takeaway": "One sentence summarizing the key principle or rule."
}

Make it realistic, professional, and educational. Use actual NBA team names and realistic salary figures for 2024-2025 season.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an NBA CBA expert creating high-quality practice scenarios for sports agent certification exams. Always return valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1500
    });

    const content = response.choices[0].message.content.trim();
    
    // Remove markdown code blocks if present
    const jsonContent = content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    const scenarioData = JSON.parse(jsonContent);
    
    // Validate the structure
    if (!scenarioData.situation || !scenarioData.options || scenarioData.options.length !== 4) {
      throw new Error('Invalid scenario structure');
    }
    
    // Ensure exactly one correct answer
    const correctCount = scenarioData.options.filter(o => o.isCorrect).length;
    if (correctCount !== 1) {
      console.log('⚠️  Warning: Fixing incorrect isCorrect flags');
      // Find the option marked as correct in the text
      scenarioData.options.forEach((opt, idx) => {
        opt.isCorrect = opt.text.includes('CORRECT') || idx === 1; // Default to 'b' if unclear
      });
    }
    
    return scenarioData;
    
  } catch (error) {
    console.error(`❌ Error generating scenario: ${error.message}`);
    return null;
  }
}

async function generateAndImportScenarios() {
  console.log('🤖 Starting AI scenario generation...\n');
  console.log(`Total scenarios to generate: ${topicsNeeded.reduce((sum, t) => sum + t.needed, 0)}\n`);
  
  let totalGenerated = 0;
  let totalInserted = 0;
  
  for (const topicInfo of topicsNeeded) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📝 Generating ${topicInfo.needed} scenarios for: ${topicInfo.topic}`);
    console.log(`${'='.repeat(60)}\n`);
    
    // Get existing scenarios for this topic to avoid duplicates
    const { data: existing } = await supabase
      .from('scenarios')
      .select('situation')
      .eq('topic', topicInfo.topic);
    
    const scenarios = [];
    
    for (let i = 0; i < topicInfo.needed; i++) {
      console.log(`   Generating scenario ${i + 1}/${topicInfo.needed}...`);
      
      const scenario = await generateScenario(topicInfo.topic, topicInfo.difficulty, existing || []);
      
      if (scenario) {
        scenarios.push({
          title: `${topicInfo.topic} - Scenario ${existing.length + i + 1}`,
          difficulty: topicInfo.difficulty,
          topic: topicInfo.topic,
          description: `Real-world scenario about ${topicInfo.topic.toLowerCase()}`,
          situation: scenario.situation,
          question: scenario.question || 'What is the correct answer?',
          options: scenario.options,
          explanation: scenario.explanation,
          key_takeaway: scenario.key_takeaway || scenario.explanation.split('.')[0] + '.'
        });
        
        totalGenerated++;
        console.log(`   ✅ Generated successfully`);
      } else {
        console.log(`   ❌ Failed to generate`);
      }
      
      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Insert scenarios for this topic
    if (scenarios.length > 0) {
      console.log(`\n   💾 Inserting ${scenarios.length} scenarios into database...`);
      
      const { data, error } = await supabase
        .from('scenarios')
        .insert(scenarios)
        .select();
      
      if (error) {
        console.error(`   ❌ Error inserting: ${error.message}`);
      } else {
        totalInserted += data.length;
        console.log(`   ✅ Inserted ${data.length} scenarios`);
      }
    }
  }
  
  console.log('\n\n' + '='.repeat(60));
  console.log('🎉 GENERATION COMPLETE!');
  console.log('='.repeat(60));
  console.log(`Total generated: ${totalGenerated}`);
  console.log(`Total inserted: ${totalInserted}`);
  console.log('='.repeat(60) + '\n');
  
  // Show final distribution
  const { data: allScenarios } = await supabase
    .from('scenarios')
    .select('topic');
  
  const finalCounts = allScenarios.reduce((acc, s) => {
    acc[s.topic] = (acc[s.topic] || 0) + 1;
    return acc;
  }, {});
  
  console.log('📊 Final Distribution:\n');
  Object.entries(finalCounts).sort((a, b) => a[0].localeCompare(b[0])).forEach(([topic, count]) => {
    const status = count >= 25 ? '✅' : '⚠️';
    console.log(`   ${status} ${topic.padEnd(40)} ${count}`);
  });
  
  console.log(`\n✅ Total scenarios: ${allScenarios.length}\n`);
}

// Run the generation
generateAndImportScenarios().catch(console.error);
