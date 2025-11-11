const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// Initialize clients
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configuration
const CONFIG = {
  FLASHCARDS_PER_SECTION: 4, // Target 4 flashcards per section
  BATCH_SIZE: 5, // Process 5 sections at a time to avoid rate limits
  DELAY_BETWEEN_BATCHES: 2000, // 2 seconds between batches
  MAX_RETRIES: 3,
  TEST_MODE: false, // Set to true to only process first 5 sections
  PRIORITY_ARTICLES: ['II', 'VII', 'VIII', 'XI', 'XXII'], // Critical articles
};

// Topic mapping for categorization
const TOPIC_MAP = {
  'I': 'definitions',
  'II': 'player-contracts',
  'VII': 'salary-cap',
  'VIII': 'rookie-scale',
  'X': 'player-movement',
  'XI': 'free-agency',
  'XII': 'trades',
  'XIII': 'draft',
  'XXII': 'health-safety',
  'XXIII': 'conduct',
  'XXIX': 'arbitration',
};

// Get topic from article number
function getTopicFromArticle(articleNum) {
  const romanNumeral = articleNum.split('-')[0].trim();
  return TOPIC_MAP[romanNumeral] || 'general';
}

// Determine difficulty based on article importance and content complexity
function suggestDifficulty(articleNum, content) {
  const roman = articleNum.split('-')[0].trim();
  const isComplex = content.length > 1000;
  const isPriority = CONFIG.PRIORITY_ARTICLES.includes(roman);
  
  if (isPriority && isComplex) return 'hard';
  if (isPriority || isComplex) return 'medium';
  return 'easy';
}

// Generate flashcards for a single section
async function generateFlashcardsForSection(section, retryCount = 0) {
  const suggestedDifficulty = suggestDifficulty(section.article_number, section.content);
  
  const prompt = `You are an expert NBA agent educator creating study flashcards for the NBPA certification exam.

**CBA Section:**
Article ${section.article_number} - ${section.article_title}
Section ${section.section_number}: ${section.title}

Content:
${section.content}

**Instructions:**
Generate EXACTLY ${CONFIG.FLASHCARDS_PER_SECTION} high-quality flashcards from this CBA section.

**Flashcard Requirements:**
1. Questions should be clear, specific, and testable
2. Answers should be concise but complete (2-4 sentences)
3. Mix of question types:
   - Direct facts (e.g., "What is the minimum salary?")
   - Applications (e.g., "When can a team use the MLE?")
   - Scenarios (e.g., "If a team is $2M over the first apron...")
   - Definitions (e.g., "Define 'veteran free agent'")

4. Difficulty distribution (suggested: ${suggestedDifficulty}):
   - **Easy**: Direct facts from the text, simple definitions
   - **Medium**: Requires understanding and application
   - **Hard**: Complex scenarios, multiple concepts combined

5. Each flashcard must include:
   - Clear question (front of card)
   - Complete answer (back of card)
   - Specific citation to this section

**Output Format (JSON only):**
{
  "flashcards": [
    {
      "question": "What is the maximum salary a player can earn?",
      "answer": "The maximum salary varies by years of service. Players with 0-6 years can earn up to 25% of the salary cap, 7-9 years up to 30%, and 10+ years up to 35% of the salary cap.",
      "difficulty": "medium"
    }
  ]
}

Generate EXACTLY ${CONFIG.FLASHCARDS_PER_SECTION} flashcards. Output ONLY valid JSON, no other text.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert NBA agent educator. Always respond with valid JSON only, no markdown or additional text.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content || '';
    
    // Extract JSON from response
    let jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in OpenAI response');
    }

    const data = JSON.parse(jsonMatch[0]);
    
    if (!data.flashcards || !Array.isArray(data.flashcards)) {
      throw new Error('Invalid flashcard format');
    }

    // Format flashcards for database
    const formattedFlashcards = data.flashcards.map(card => ({
      cba_section_id: section.id,
      article_number: section.article_number,
      article_title: section.article_title,
      section_number: section.section_number,
      section_title: section.title,
      question: card.question,
      answer: card.answer,
      citation: `Article ${section.article_number}, Section ${section.section_number}`,
      topic: getTopicFromArticle(section.article_number),
      difficulty: card.difficulty || suggestedDifficulty,
    }));

    return formattedFlashcards;

  } catch (error) {
    if (retryCount < CONFIG.MAX_RETRIES) {
      console.log(`  ⚠️  Retry ${retryCount + 1}/${CONFIG.MAX_RETRIES}...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
      return generateFlashcardsForSection(section, retryCount + 1);
    }
    
    console.error(`  ❌ Failed after ${CONFIG.MAX_RETRIES} retries:`, error.message);
    throw error;
  }
}

// Delay helper
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main generation function
async function generateAllFlashcards() {
  console.log('🚀 AgentPrep Flashcard Generator\n');
  console.log('Configuration:');
  console.log(`  - Flashcards per section: ${CONFIG.FLASHCARDS_PER_SECTION}`);
  console.log(`  - Batch size: ${CONFIG.BATCH_SIZE}`);
  console.log(`  - Test mode: ${CONFIG.TEST_MODE ? 'ON (first 5 sections only)' : 'OFF'}`);
  console.log(`  - Priority articles: ${CONFIG.PRIORITY_ARTICLES.join(', ')}\n`);

  // Fetch all CBA sections
  console.log('📚 Fetching CBA sections from database...\n');
  
  const { data: sections, error: fetchError } = await supabase
    .from('cba_content')
    .select('*')
    .eq('type', 'section')
    .not('article_number', 'like', 'Exhibit%')
    .not('article_number', 'like', 'J-%')
    .not('article_number', 'ilike', '%exhibit%')
    .order('article_number')
    .order('section_number');

  if (fetchError) {
    console.error('❌ Error fetching sections:', fetchError);
    return;
  }

  console.log(`✅ Found ${sections.length} CBA sections\n`);

  // Filter to test mode if enabled
  const sectionsToProcess = CONFIG.TEST_MODE ? sections.slice(0, 5) : sections;
  
  if (CONFIG.TEST_MODE) {
    console.log(`⚠️  TEST MODE: Processing only ${sectionsToProcess.length} sections\n`);
  }

  // Check if flashcards already exist
  const { data: existingFlashcards } = await supabase
    .from('ai_flashcards')
    .select('cba_section_id');

  const existingSectionIds = new Set(
    existingFlashcards?.map(f => f.cba_section_id) || []
  );

  const sectionsNeedingFlashcards = sectionsToProcess.filter(
    s => !existingSectionIds.has(s.id)
  );

  console.log(`📊 Status:`);
  console.log(`  - Total sections: ${sectionsToProcess.length}`);
  console.log(`  - Already processed: ${existingSectionIds.size}`);
  console.log(`  - Need processing: ${sectionsNeedingFlashcards.length}\n`);

  if (sectionsNeedingFlashcards.length === 0) {
    console.log('✅ All sections already have flashcards!\n');
    return;
  }

  // Process in batches
  const totalBatches = Math.ceil(sectionsNeedingFlashcards.length / CONFIG.BATCH_SIZE);
  let totalGenerated = 0;
  let totalFailed = 0;

  console.log(`🎯 Starting generation: ${totalBatches} batches\n`);
  console.log('═'.repeat(60) + '\n');

  for (let batchNum = 0; batchNum < totalBatches; batchNum++) {
    const batchStart = batchNum * CONFIG.BATCH_SIZE;
    const batchEnd = Math.min(batchStart + CONFIG.BATCH_SIZE, sectionsNeedingFlashcards.length);
    const batch = sectionsNeedingFlashcards.slice(batchStart, batchEnd);

    console.log(`📦 Batch ${batchNum + 1}/${totalBatches} (Sections ${batchStart + 1}-${batchEnd})`);
    console.log('─'.repeat(60));

    for (let i = 0; i < batch.length; i++) {
      const section = batch[i];
      const overallIndex = batchStart + i + 1;
      
      console.log(`\n[${overallIndex}/${sectionsNeedingFlashcards.length}] Article ${section.article_number}, Section ${section.section_number}`);
      console.log(`  "${section.title}"`);

      try {
        // Generate flashcards
        const flashcards = await generateFlashcardsForSection(section);
        
        // Save to database
        const { error: insertError } = await supabase
          .from('ai_flashcards')
          .insert(flashcards);

        if (insertError) {
          console.error(`  ❌ Database error:`, insertError.message);
          totalFailed++;
        } else {
          console.log(`  ✅ Generated ${flashcards.length} flashcards`);
          totalGenerated += flashcards.length;
        }

      } catch (error) {
        console.error(`  ❌ Generation failed:`, error.message);
        totalFailed++;
      }

      // Small delay between sections within a batch
      if (i < batch.length - 1) {
        await delay(500);
      }
    }

    // Delay between batches (except for the last one)
    if (batchNum < totalBatches - 1) {
      console.log(`\n⏱️  Waiting ${CONFIG.DELAY_BETWEEN_BATCHES / 1000}s before next batch...\n`);
      await delay(CONFIG.DELAY_BETWEEN_BATCHES);
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log('🎉 Generation Complete!\n');
  console.log('📊 Final Statistics:');
  console.log(`  ✅ Flashcards generated: ${totalGenerated}`);
  console.log(`  ❌ Sections failed: ${totalFailed}`);
  console.log(`  📝 Sections processed: ${sectionsNeedingFlashcards.length - totalFailed}\n`);

  // Fetch final counts
  const { data: finalFlashcards } = await supabase
    .from('ai_flashcards')
    .select('id, difficulty, topic');

  if (finalFlashcards) {
    console.log('📈 Database Summary:');
    console.log(`  Total flashcards: ${finalFlashcards.length}`);
    
    // By difficulty
    const byDifficulty = finalFlashcards.reduce((acc, f) => {
      acc[f.difficulty] = (acc[f.difficulty] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n  By Difficulty:');
    Object.entries(byDifficulty).forEach(([diff, count]) => {
      console.log(`    ${diff}: ${count}`);
    });

    // By topic
    const byTopic = finalFlashcards.reduce((acc, f) => {
      acc[f.topic] = (acc[f.topic] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n  By Topic:');
    Object.entries(byTopic)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([topic, count]) => {
        console.log(`    ${topic}: ${count}`);
      });
  }

  console.log('\n✅ Done! Flashcards ready to use.\n');
}

// Run if called directly
if (require.main === module) {
  generateAllFlashcards()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('\n❌ Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { generateAllFlashcards };
