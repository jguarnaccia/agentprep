// Fixed script to generate ALL missing articles (including both 'section' and 'article' types)
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

// ALL missing articles (now confirmed to exist!)
const MISSING_ARTICLES = ['XVI', 'XVII', 'XXXIV', 'XXXV', 'XXXVI', 'XXXVII', 'XXXVIII', 'XXXIX'];

// Configuration
const CONFIG = {
  FLASHCARDS_PER_SECTION: 4,
  DELAY_BETWEEN_SECTIONS: 1000,
  MAX_RETRIES: 3,
};

// Topic mapping
const TOPIC_MAP = {
  'XVI': 'general',         // Mutual Reservation of Rights
  'XVII': 'facilities',     // Playing Conditions at Facilities  
  'XXXIV': 'general',       // Recognition Clause
  'XXXV': 'general',        // Savings Clause
  'XXXVI': 'player-agents', // Player Agents ⭐ CRITICAL
  'XXXVII': 'general',
  'XXXVIII': 'general',
  'XXXIX': 'general',
};

// Generate flashcards for a section
async function generateFlashcardsForSection(section, retryCount = 0) {
  const topic = TOPIC_MAP[section.article_number] || 'general';
  const isPlayerAgents = section.article_number === 'XXXVI';
  
  const specialInstructions = isPlayerAgents ? 
    `🎯 CRITICAL: This is Article XXXVI about PLAYER AGENTS - the most important article for NBA agent certification!

Focus on these key areas:
- Agent certification requirements and process
- Maximum 4% fee limitation for agents
- Prohibited conduct and violations  
- NBAPA regulations and oversight
- Agent responsibilities to players
- Contract negotiation rules for agents
- Disciplinary procedures for agents
- Player-agent agreement requirements

Make these flashcards comprehensive and exam-focused since this article is essential for passing the NBPA agent certification.` :
    `Generate comprehensive flashcards covering the key concepts and requirements from this ${section.article_title} section.`;

  const prompt = `You are an expert NBA agent educator creating study flashcards for the NBPA certification exam.

**CBA Section:**
Article ${section.article_number} - ${section.article_title}
${section.section_number ? `Section ${section.section_number}: ${section.title}` : ''}

Content:
${section.content}

**Special Instructions:**
${specialInstructions}

**Generate EXACTLY ${CONFIG.FLASHCARDS_PER_SECTION} high-quality flashcards.**

**Requirements:**
1. Questions should be exam-focused and testable
2. Answers should be complete but concise (2-4 sentences)
3. Mix question types: facts, applications, scenarios, definitions
4. Difficulty should be appropriate for professional certification
5. Focus on practical knowledge agents need to know

**Output Format (JSON only):**
{
  "flashcards": [
    {
      "question": "What is the maximum fee a player agent can charge under Article XXXVI?",
      "answer": "Player agents are limited to a maximum fee of 4% of the player's total compensation under their NBA player contract, as specified in Article XXXVI of the CBA.",
      "difficulty": "medium"
    }
  ]
}

Generate EXACTLY ${CONFIG.FLASHCARDS_PER_SECTION} flashcards. Output ONLY valid JSON.`;

  try {
    console.log(`    🤖 Generating flashcards...`);
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert NBA agent educator. Always respond with valid JSON only.'
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
    let jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const data = JSON.parse(jsonMatch[0]);
    
    if (!data.flashcards || !Array.isArray(data.flashcards)) {
      throw new Error('Invalid flashcard format');
    }

    // Format for database
    const formattedFlashcards = data.flashcards.map(card => ({
      cba_section_id: section.id,
      article_number: section.article_number,
      article_title: section.article_title,
      section_number: section.section_number || 'Main',
      section_title: section.title || section.article_title,
      question: card.question,
      answer: card.answer,
      citation: section.section_number ? 
        `Article ${section.article_number}, Section ${section.section_number}` :
        `Article ${section.article_number}`,
      topic: topic,
      difficulty: card.difficulty || 'medium',
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

// Main generation function
async function generateAllMissingArticles() {
  console.log('🎯 GENERATING ALL MISSING ARTICLES FOR 100% CBA COVERAGE\n');
  
  console.log('🏆 Target: 42/42 Articles (100% NBA CBA Coverage)\n');
  
  console.log('Missing Articles (ALL CONFIRMED TO EXIST):');
  MISSING_ARTICLES.forEach(article => {
    const topic = TOPIC_MAP[article];
    const critical = article === 'XXXVI' ? ' ⭐ CRITICAL (Player Agents)' : '';
    console.log(`  - Article ${article}: ${topic}${critical}`);
  });
  console.log('');

  // Fetch sections for missing articles - FIXED QUERY to include both types
  console.log('📚 Fetching CBA sections (both article and section types)...');
  
  const { data: sections, error } = await supabase
    .from('cba_content')
    .select('*')
    .in('article_number', MISSING_ARTICLES.map(a => `Article ${a}`))
    .in('type', ['section', 'article'])
    .not('article_number', 'like', 'Exhibit%')
    .order('article_number')
    .order('section_number');

  if (error) {
    console.error('❌ Error fetching sections:', error);
    return;
  }

  console.log(`✅ Found ${sections.length} CBA entries\n`);

  if (sections.length === 0) {
    console.log('⚠️  No sections found. This should not happen!\n');
    return;
  }

  // Group by article
  const sectionsByArticle = sections.reduce((acc, section) => {
    const articleNum = section.article_number.replace('Article ', '');
    if (!acc[articleNum]) acc[articleNum] = [];
    acc[articleNum].push(section);
    return acc;
  }, {});

  console.log('📋 Content Found by Article:');
  MISSING_ARTICLES.forEach(article => {
    const articleSections = sectionsByArticle[article] || [];
    const critical = article === 'XXXVI' ? ' ⭐ CRITICAL' : '';
    const types = [...new Set(articleSections.map(s => s.type))].join(', ');
    console.log(`  Article ${article}${critical}: ${articleSections.length} entries (${types})`);
  });
  console.log('');

  // Check which articles already have flashcards
  const { data: existingFlashcards } = await supabase
    .from('ai_flashcards')
    .select('article_number')
    .in('article_number', MISSING_ARTICLES.map(a => `Article ${a}`));

  const existingArticles = new Set(
    existingFlashcards?.map(f => f.article_number.replace('Article ', '')) || []
  );

  const sectionsToProcess = sections.filter(s => {
    const articleNum = s.article_number.replace('Article ', '');
    return !existingArticles.has(articleNum);
  });

  console.log(`📊 Generation Status:`);
  console.log(`  - Total entries found: ${sections.length}`);
  console.log(`  - Already have flashcards: ${existingArticles.size} articles`);
  console.log(`  - Need to generate: ${sectionsToProcess.length} entries\n`);

  if (sectionsToProcess.length === 0) {
    console.log('✅ All missing articles already have flashcards!\n');
    return;
  }

  // Generate flashcards - Article XXXVI first
  console.log('🚀 Starting generation (Article XXXVI priority)...\n');

  let totalGenerated = 0;
  let totalFailed = 0;

  // Process Article XXXVI first
  const xxxviSections = sectionsToProcess.filter(s => s.article_number === 'Article XXXVI');
  const otherSections = sectionsToProcess.filter(s => s.article_number !== 'Article XXXVI');
  const orderedSections = [...xxxviSections, ...otherSections];

  for (let i = 0; i < orderedSections.length; i++) {
    const section = orderedSections[i];
    const articleNum = section.article_number.replace('Article ', '');
    const critical = articleNum === 'XXXVI' ? ' ⭐ CRITICAL' : '';
    
    console.log(`[${i + 1}/${orderedSections.length}] ${section.article_number}${critical}`);
    console.log(`  Type: ${section.type}`);
    console.log(`  Title: "${section.article_title}"`);
    if (section.section_number) {
      console.log(`  Section: ${section.section_number} - "${section.title}"`);
    }

    try {
      const flashcards = await generateFlashcardsForSection(section);
      
      console.log(`  ✅ Generated ${flashcards.length} flashcards`);
      
      if (articleNum === 'XXXVI') {
        console.log(`  📝 Sample: "${flashcards[0].question}"`);
      }
      
      // Save to database
      const { error: insertError } = await supabase
        .from('ai_flashcards')
        .insert(flashcards);

      if (insertError) {
        console.error(`  ❌ Database error:`, insertError.message);
        totalFailed++;
      } else {
        console.log(`  💾 Saved to database`);
        totalGenerated += flashcards.length;
      }

    } catch (error) {
      console.error(`  ❌ Generation failed:`, error.message);
      totalFailed++;
    }

    // Delay between sections
    if (i < orderedSections.length - 1) {
      await new Promise(resolve => setTimeout(resolve, CONFIG.DELAY_BETWEEN_SECTIONS));
    }
    console.log('');
  }

  console.log('🎉 GENERATION COMPLETE!\n');
  console.log('📊 Results:');
  console.log(`  ✅ Flashcards generated: ${totalGenerated}`);
  console.log(`  ❌ Failed entries: ${totalFailed}`);
  console.log(`  📝 Entries processed: ${orderedSections.length - totalFailed}\n`);

  // Final summary
  const { data: finalCount } = await supabase
    .from('ai_flashcards')
    .select('id', { count: 'exact', head: true });

  const { data: articleCheck } = await supabase
    .from('ai_flashcards')
    .select('article_number');

  if (finalCount && articleCheck) {
    const uniqueArticles = [...new Set(articleCheck.map(f => f.article_number.replace('Article ', '')))];
    
    console.log('🏆 FINAL STATUS:');
    console.log(`  📊 Total flashcards: ${finalCount.toLocaleString()}`);
    console.log(`  📚 Articles covered: ${uniqueArticles.length}/42`);
    console.log(`  🎯 Coverage: ${(uniqueArticles.length/42*100).toFixed(1)}%`);
    
    const hasPlayerAgents = uniqueArticles.includes('XXXVI');
    console.log(`  ⭐ Article XXXVI (Player Agents): ${hasPlayerAgents ? 'COVERED ✅' : 'MISSING ❌'}`);
    
    if (uniqueArticles.length >= 42) {
      console.log('\n🎊 PERFECT! 100% NBA CBA coverage achieved!');
      console.log('🏀 AgentPrep is now the ultimate NBA agent study platform!');
    } else {
      console.log(`\n📝 Still missing: ${42 - uniqueArticles.length} articles for complete coverage`);
    }
  }

  console.log('\n✅ Missing articles generation complete!');
  console.log('🎯 Your flashcard database now has comprehensive NBA CBA coverage!\n');
}

// Run the script
if (require.main === module) {
  generateAllMissingArticles()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('\n❌ Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { generateAllMissingArticles };