// Generate flashcards for the specific missing articles
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

// Confirmed missing articles from diagnostic
const MISSING_ARTICLES = ['XVI', 'XVII', 'XXXIV', 'XXXV', 'XXXVI', 'XXXVII', 'XXXVIII', 'XXXIX'];

// Configuration
const CONFIG = {
  FLASHCARDS_PER_SECTION: 4,
  DELAY_BETWEEN_SECTIONS: 1000,
  MAX_RETRIES: 3,
};

// Topic mapping
const TOPIC_MAP = {
  'XVI': 'benefits',
  'XVII': 'benefits', 
  'XXXIV': 'conduct',
  'XXXV': 'general',
  'XXXVI': 'player-agents', // CRITICAL
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
- Maximum 4% fee limitation
- Prohibited conduct and violations  
- NBAPA regulations and oversight
- Agent responsibilities to players
- Contract negotiation rules
- Disciplinary procedures

Make these flashcards comprehensive and exam-focused since this article is essential for passing the NBPA certification.` :
    'Generate comprehensive flashcards covering the key concepts and requirements from this section.';

  const prompt = `You are an expert NBA agent educator creating study flashcards for the NBPA certification exam.

**CBA Section:**
Article ${section.article_number} - ${section.article_title}
Section ${section.section_number}: ${section.title}

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
      section_number: section.section_number,
      section_title: section.title,
      question: card.question,
      answer: card.answer,
      citation: `Article ${section.article_number}, Section ${section.section_number}`,
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
async function generateMissingArticles() {
  console.log('🎯 GENERATING MISSING ARTICLES FOR COMPLETE CBA COVERAGE\n');
  
  console.log('🏆 Target: 42/42 Articles (100% CBA Coverage)\n');
  
  console.log('Missing Articles:');
  MISSING_ARTICLES.forEach(article => {
    const topic = TOPIC_MAP[article];
    const critical = article === 'XXXVI' ? ' ⭐ CRITICAL (Player Agents)' : '';
    console.log(`  - Article ${article}: ${topic}${critical}`);
  });
  console.log('');

  // Fetch sections for missing articles
  console.log('📚 Fetching CBA sections...');
  
  const { data: sections, error } = await supabase
    .from('cba_content')
    .select('*')
    .eq('type', 'section')
    .in('article_number', MISSING_ARTICLES)
    .not('article_number', 'like', 'Exhibit%')
    .order('article_number')
    .order('section_number');

  if (error) {
    console.error('❌ Error fetching sections:', error);
    return;
  }

  console.log(`✅ Found ${sections.length} sections\n`);

  if (sections.length === 0) {
    console.log('⚠️  No sections found. Check if these articles exist in cba_content table.\n');
    return;
  }

  // Group by article
  const sectionsByArticle = sections.reduce((acc, section) => {
    if (!acc[section.article_number]) acc[section.article_number] = [];
    acc[section.article_number].push(section);
    return acc;
  }, {});

  console.log('📋 Sections by Article:');
  MISSING_ARTICLES.forEach(article => {
    const articleSections = sectionsByArticle[article] || [];
    const critical = article === 'XXXVI' ? ' ⭐ CRITICAL' : '';
    console.log(`  Article ${article}${critical}: ${articleSections.length} sections`);
  });
  console.log('');

  // Generate flashcards - Article XXXVI first
  console.log('🚀 Starting generation (Article XXXVI priority)...\n');

  let totalGenerated = 0;
  let totalFailed = 0;

  // Process Article XXXVI first
  const xxxviSections = sections.filter(s => s.article_number === 'XXXVI');
  const otherSections = sections.filter(s => s.article_number !== 'XXXVI');
  const orderedSections = [...xxxviSections, ...otherSections];

  for (let i = 0; i < orderedSections.length; i++) {
    const section = orderedSections[i];
    const critical = section.article_number === 'XXXVI' ? ' ⭐ CRITICAL' : '';
    
    console.log(`[${i + 1}/${orderedSections.length}] Article ${section.article_number}${critical}`);
    console.log(`  Section ${section.section_number}: "${section.title}"`);

    try {
      const flashcards = await generateFlashcardsForSection(section);
      
      console.log(`  ✅ Generated ${flashcards.length} flashcards`);
      
      if (section.article_number === 'XXXVI') {
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
  console.log(`  ❌ Failed sections: ${totalFailed}`);
  console.log(`  📝 Sections processed: ${orderedSections.length - totalFailed}\n`);

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
    
    if (uniqueArticles.length === 42) {
      console.log('\n🎊 PERFECT! 100% NBA CBA coverage achieved!');
      console.log('🏀 AgentPrep is now the ultimate NBA agent study platform!');
    }
  }

  console.log('\n✅ Missing articles generation complete!\n');
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