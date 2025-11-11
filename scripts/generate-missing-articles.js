// Script to find missing articles and generate flashcards for them
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

// Missing articles we need to generate
const MISSING_ARTICLES = ['XVI', 'XVII', 'XXXIV', 'XXXV', 'XXXVI', 'XXXVII', 'XXXVIII', 'XXXIX'];

// Configuration
const CONFIG = {
  FLASHCARDS_PER_SECTION: 4,
  DELAY_BETWEEN_SECTIONS: 1000, // 1 second between sections
  MAX_RETRIES: 3,
};

// Topic mapping for categorization
const TOPIC_MAP = {
  'XVI': 'benefits',
  'XVII': 'benefits', 
  'XXXIV': 'conduct',
  'XXXV': 'general',
  'XXXVI': 'player-agents', // CRITICAL - Player Agents
  'XXXVII': 'general',
  'XXXVIII': 'general',
  'XXXIX': 'general',
};

// Determine difficulty - Article XXXVI is critical for agents
function suggestDifficulty(articleNum) {
  if (articleNum === 'XXXVI') return 'hard'; // Player Agents - critical
  if (['XVI', 'XVII'].includes(articleNum)) return 'medium'; // Benefits
  return 'medium'; // Default for missing articles
}

// Generate flashcards for a single section
async function generateFlashcardsForSection(section, retryCount = 0) {
  const suggestedDifficulty = suggestDifficulty(section.article_number);
  const topic = TOPIC_MAP[section.article_number] || 'general';
  
  const prompt = `You are an expert NBA agent educator creating study flashcards for the NBPA certification exam.

**CBA Section:**
Article ${section.article_number} - ${section.article_title}
Section ${section.section_number}: ${section.title}

Content:
${section.content}

**Special Instructions:**
${section.article_number === 'XXXVI' ? 
  'This is Article XXXVI about PLAYER AGENTS - CRITICAL for NBA agent certification! Focus on agent requirements, fees, prohibited conduct, and NBAPA regulations.' : 
  'Generate comprehensive flashcards covering the key concepts and requirements from this section.'}

**Instructions:**
Generate EXACTLY ${CONFIG.FLASHCARDS_PER_SECTION} high-quality flashcards from this CBA section.

**Flashcard Requirements:**
1. Questions should be clear, specific, and testable
2. Answers should be concise but complete (2-4 sentences)
3. Mix of question types:
   - Direct facts (e.g., "What is the agent fee maximum?")
   - Applications (e.g., "When can an agent represent a player?")
   - Scenarios (e.g., "What happens if an agent violates conduct rules?")
   - Definitions (e.g., "Define 'certified agent'")

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
      "question": "What is the maximum fee a player agent can charge?",
      "answer": "Player agents are limited to a maximum fee of 4% of the player's total compensation under their NBA player contract.",
      "difficulty": "medium"
    }
  ]
}

Generate EXACTLY ${CONFIG.FLASHCARDS_PER_SECTION} flashcards. Output ONLY valid JSON, no other text.`;

  try {
    console.log(`    🤖 Generating flashcards with OpenAI...`);
    
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
      topic: topic,
      difficulty: card.difficulty || suggestedDifficulty,
    }));

    return formattedFlashcards;

  } catch (error) {
    if (retryCount < CONFIG.MAX_RETRIES) {
      console.log(`    ⚠️  Retry ${retryCount + 1}/${CONFIG.MAX_RETRIES}...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
      return generateFlashcardsForSection(section, retryCount + 1);
    }
    
    console.error(`    ❌ Failed after ${CONFIG.MAX_RETRIES} retries:`, error.message);
    throw error;
  }
}

// Main function to generate missing articles
async function generateMissingArticles() {
  console.log('🎯 GENERATING MISSING ARTICLES FLASHCARDS\n');
  console.log('Missing Articles:');
  MISSING_ARTICLES.forEach(article => {
    const topic = TOPIC_MAP[article];
    const critical = article === 'XXXVI' ? ' ⭐ CRITICAL' : '';
    console.log(`  - Article ${article}: ${topic}${critical}`);
  });
  console.log('');

  // Fetch sections for missing articles
  console.log('📚 Fetching CBA sections for missing articles...\n');
  
  const { data: sections, error: fetchError } = await supabase
    .from('cba_content')
    .select('*')
    .eq('type', 'section')
    .in('article_number', MISSING_ARTICLES)
    .not('article_number', 'like', 'Exhibit%')
    .not('article_number', 'like', 'J-%')
    .order('article_number')
    .order('section_number');

  if (fetchError) {
    console.error('❌ Error fetching sections:', fetchError);
    return;
  }

  console.log(`✅ Found ${sections.length} sections for missing articles\n`);

  if (sections.length === 0) {
    console.log('⚠️  No sections found for missing articles. Check article numbers in database.\n');
    return;
  }

  // Group by article for better output
  const sectionsByArticle = sections.reduce((acc, section) => {
    const article = section.article_number;
    if (!acc[article]) acc[article] = [];
    acc[article].push(section);
    return acc;
  }, {});

  console.log('📋 Sections by Article:');
  Object.entries(sectionsByArticle).forEach(([article, articleSections]) => {
    const critical = article === 'XXXVI' ? ' ⭐ CRITICAL' : '';
    console.log(`  Article ${article}${critical}: ${articleSections.length} sections`);
  });
  console.log('');

  // Check which sections already have flashcards
  const { data: existingFlashcards } = await supabase
    .from('ai_flashcards')
    .select('cba_section_id')
    .in('article_number', MISSING_ARTICLES);

  const existingSectionIds = new Set(
    existingFlashcards?.map(f => f.cba_section_id) || []
  );

  const sectionsToProcess = sections.filter(s => !existingSectionIds.has(s.id));

  console.log(`📊 Generation Status:`);
  console.log(`  - Total sections found: ${sections.length}`);
  console.log(`  - Already have flashcards: ${existingSectionIds.size}`);
  console.log(`  - Need to generate: ${sectionsToProcess.length}\n`);

  if (sectionsToProcess.length === 0) {
    console.log('✅ All missing articles already have flashcards!\n');
    return;
  }

  // Generate flashcards
  console.log('🚀 Starting flashcard generation...\n');
  console.log('═'.repeat(70) + '\n');

  let totalGenerated = 0;
  let totalFailed = 0;

  // Process Article XXXVI first (most critical)
  const articleXXXVISections = sectionsToProcess.filter(s => s.article_number === 'XXXVI');
  const otherSections = sectionsToProcess.filter(s => s.article_number !== 'XXXVI');
  const orderedSections = [...articleXXXVISections, ...otherSections];

  for (let i = 0; i < orderedSections.length; i++) {
    const section = orderedSections[i];
    const critical = section.article_number === 'XXXVI' ? ' ⭐ CRITICAL' : '';
    
    console.log(`[${i + 1}/${orderedSections.length}] Article ${section.article_number}${critical}, Section ${section.section_number}`);
    console.log(`  "${section.title}"`);
    console.log(`  Topic: ${TOPIC_MAP[section.article_number]}`);

    try {
      // Generate flashcards
      const flashcards = await generateFlashcardsForSection(section);
      
      console.log(`    ✅ Generated ${flashcards.length} flashcards`);
      
      // Show sample question for Article XXXVI
      if (section.article_number === 'XXXVI' && flashcards.length > 0) {
        console.log(`    📝 Sample: "${flashcards[0].question}"`);
      }
      
      // Save to database
      const { error: insertError } = await supabase
        .from('ai_flashcards')
        .insert(flashcards);

      if (insertError) {
        console.error(`    ❌ Database error:`, insertError.message);
        totalFailed++;
      } else {
        console.log(`    💾 Saved to database`);
        totalGenerated += flashcards.length;
      }

    } catch (error) {
      console.error(`    ❌ Generation failed:`, error.message);
      totalFailed++;
    }

    // Delay between sections
    if (i < orderedSections.length - 1) {
      console.log(`    ⏱️  Waiting 1s...\n`);
      await new Promise(resolve => setTimeout(resolve, CONFIG.DELAY_BETWEEN_SECTIONS));
    } else {
      console.log('');
    }
  }

  console.log('═'.repeat(70));
  console.log('🎉 MISSING ARTICLES GENERATION COMPLETE!\n');
  console.log('📊 Final Results:');
  console.log(`  ✅ Flashcards generated: ${totalGenerated}`);
  console.log(`  ❌ Sections failed: ${totalFailed}`);
  console.log(`  📝 Sections processed: ${orderedSections.length - totalFailed}\n`);

  // Get updated total count
  const { data: allFlashcards } = await supabase
    .from('ai_flashcards')
    .select('id, article_number, difficulty');

  if (allFlashcards) {
    console.log('📈 Updated Database Summary:');
    console.log(`  Total flashcards: ${allFlashcards.length.toLocaleString()}`);
    
    // Count by missing articles
    const missingArticleCards = allFlashcards.filter(f => 
      MISSING_ARTICLES.includes(f.article_number)
    );
    
    console.log(`  From missing articles: ${missingArticleCards.length}`);
    
    if (missingArticleCards.length > 0) {
      console.log('\n  Missing Articles Generated:');
      MISSING_ARTICLES.forEach(article => {
        const count = missingArticleCards.filter(f => f.article_number === article).length;
        const critical = article === 'XXXVI' ? ' ⭐ CRITICAL' : '';
        if (count > 0) {
          console.log(`    Article ${article}${critical}: ${count} flashcards`);
        }
      });
    }
  }

  // Get final article coverage
  console.log('\n📋 Checking Article Coverage...');
  const { data: articleStats } = await supabase
    .from('ai_flashcards')
    .select('article_number');

  if (articleStats) {
    const uniqueArticles = [...new Set(articleStats.map(f => f.article_number))];
    console.log(`✅ Articles now covered: ${uniqueArticles.length} articles`);
    console.log(`  Articles: ${uniqueArticles.sort().join(', ')}`);
    
    // Check if we have all 42 articles
    const totalPossibleArticles = 42;
    const coverage = (uniqueArticles.length / totalPossibleArticles * 100).toFixed(1);
    console.log(`  Coverage: ${coverage}% of CBA articles`);
    
    if (uniqueArticles.length === totalPossibleArticles) {
      console.log('\n🎉 PERFECT! 100% CBA article coverage achieved!');
    } else {
      const stillMissing = totalPossibleArticles - uniqueArticles.length;
      console.log(`\n📝 Still missing ${stillMissing} articles for complete coverage`);
    }
  }

  console.log('\n✅ Missing articles generation complete!');
  console.log('🎯 AgentPrep now has comprehensive NBA CBA flashcard coverage!\n');
}

// Run the script
if (require.main === module) {
  generateMissingArticles()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('\n❌ Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { generateMissingArticles };