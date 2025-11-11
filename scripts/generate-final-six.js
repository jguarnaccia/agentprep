// Generate the final 6 missing articles including critical Article XXXVI
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// The final 6 missing articles
const FINAL_MISSING = ['XXXIV', 'XXXV', 'XXXVI', 'XXXVII', 'XXXVIII', 'XXXIX'];

const CONFIG = {
  FLASHCARDS_PER_SECTION: 5, // Generous for these final articles
  MAX_RETRIES: 3,
};

const TOPIC_MAP = {
  'XXXIV': 'general',       // Recognition Clause
  'XXXV': 'general',        // Savings Clause
  'XXXVI': 'player-agents', // Player Agents ⭐ CRITICAL
  'XXXVII': 'general',
  'XXXVIII': 'general', 
  'XXXIX': 'general',
};

async function generateFinalMissingArticles() {
  console.log('🎯 GENERATING FINAL 6 MISSING ARTICLES FOR 100% CBA COVERAGE\n');
  console.log('🏆 Target: Complete 42/42 Articles (100% NBA CBA Coverage)\n');
  
  console.log('Final Missing Articles:');
  FINAL_MISSING.forEach(article => {
    const topic = TOPIC_MAP[article];
    const critical = article === 'XXXVI' ? ' ⭐ CRITICAL (Player Agents)' : '';
    console.log(`  - Article ${article}: ${topic}${critical}`);
  });
  console.log('');

  // Fetch content for final missing articles
  console.log('📚 Fetching final missing articles...');
  
  const { data: sections, error } = await supabase
    .from('cba_content')
    .select('*')
    .in('article_number', FINAL_MISSING.map(a => `Article ${a}`))
    .in('type', ['section', 'article'])
    .order('article_number')
    .order('section_number');

  if (error) {
    console.error('❌ Error fetching sections:', error);
    return;
  }

  console.log(`✅ Found ${sections.length} entries for final articles\n`);

  // Group by article
  const sectionsByArticle = sections.reduce((acc, section) => {
    const articleNum = section.article_number.replace('Article ', '');
    if (!acc[articleNum]) acc[articleNum] = [];
    acc[articleNum].push(section);
    return acc;
  }, {});

  console.log('📋 Content Found:');
  FINAL_MISSING.forEach(article => {
    const articleSections = sectionsByArticle[article] || [];
    const critical = article === 'XXXVI' ? ' ⭐ CRITICAL' : '';
    console.log(`  Article ${article}${critical}: ${articleSections.length} entries`);
  });
  console.log('');

  // Check which don't already have flashcards
  const { data: existingFlashcards } = await supabase
    .from('ai_flashcards')
    .select('article_number')
    .in('article_number', FINAL_MISSING.map(a => `Article ${a}`));

  const existingArticles = new Set(
    existingFlashcards?.map(f => f.article_number.replace('Article ', '')) || []
  );

  const sectionsToProcess = sections.filter(s => {
    const articleNum = s.article_number.replace('Article ', '');
    return !existingArticles.has(articleNum);
  });

  console.log(`📊 Generation Status:`);
  console.log(`  - Total entries available: ${sections.length}`);
  console.log(`  - Already have flashcards: ${existingArticles.size} articles`);
  console.log(`  - Need to generate: ${sectionsToProcess.length} entries\n`);

  if (sectionsToProcess.length === 0) {
    console.log('✅ All final articles already have flashcards!\n');
    return;
  }

  // Generate flashcards - Article XXXVI priority
  console.log('🚀 Generating final articles (Article XXXVI first)...\n');

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
    console.log(`  Title: "${section.article_title}"`);
    if (section.section_number) {
      console.log(`  Section: ${section.section_number} - "${section.title}"`);
    }

    try {
      const topic = TOPIC_MAP[articleNum] || 'general';
      const isPlayerAgents = articleNum === 'XXXVI';
      
      const specialPrompt = isPlayerAgents ? 
        `🎯 CRITICAL: Article XXXVI - PLAYER AGENTS
This is THE MOST IMPORTANT article for NBA agent certification!
Focus on: agent certification, 4% fee limit, prohibited conduct, NBAPA rules, agent responsibilities.` :
        `Generate comprehensive flashcards for this ${section.article_title} content.`;

      const prompt = `You are an expert NBA agent educator creating study flashcards.

**CBA Content:**
Article ${section.article_number} - ${section.article_title}
${section.section_number ? `Section ${section.section_number}: ${section.title}` : ''}

Content: ${section.content}

**Instructions:** ${specialPrompt}

Generate EXACTLY ${CONFIG.FLASHCARDS_PER_SECTION} flashcards.

**Output JSON:**
{
  "flashcards": [
    {
      "question": "What does Article ${articleNum} establish?",
      "answer": "Detailed answer here.",
      "difficulty": "medium"
    }
  ]
}

Output ONLY valid JSON.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Expert NBA agent educator. Respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const responseText = completion.choices[0]?.message?.content || '';
      let jsonMatch = responseText.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) throw new Error('No JSON found');
      
      const data = JSON.parse(jsonMatch[0]);
      if (!data.flashcards) throw new Error('Invalid format');

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

      console.log(`  ✅ Generated ${formattedFlashcards.length} flashcards`);
      
      if (isPlayerAgents) {
        console.log(`  📝 Player Agent Sample: "${formattedFlashcards[0].question}"`);
      }
      
      const { error: insertError } = await supabase
        .from('ai_flashcards')
        .insert(formattedFlashcards);

      if (insertError) {
        console.error(`  ❌ Database error:`, insertError.message);
        totalFailed++;
      } else {
        console.log(`  💾 Saved to database`);
        totalGenerated += formattedFlashcards.length;
      }

    } catch (error) {
      console.error(`  ❌ Generation failed:`, error.message);
      totalFailed++;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('');
  }

  console.log('🎉 FINAL ARTICLES GENERATION COMPLETE!\n');
  console.log('📊 Results:');
  console.log(`  ✅ Flashcards generated: ${totalGenerated}`);
  console.log(`  ❌ Failed entries: ${totalFailed}\n`);

  // Final status check
  const { data: finalCount } = await supabase
    .from('ai_flashcards')
    .select('id', { count: 'exact', head: true });

  const { data: finalArticles } = await supabase
    .from('ai_flashcards')
    .select('article_number');

  if (finalCount && finalArticles) {
    const uniqueArticles = [...new Set(finalArticles.map(f => f.article_number.replace('Article ', '')))];
    
    console.log('🏆 FINAL STATUS:');
    console.log(`  📊 Total flashcards: ${finalCount.toLocaleString()}`);
    console.log(`  📚 Articles covered: ${uniqueArticles.length}/42`);
    console.log(`  🎯 Coverage: ${(uniqueArticles.length/42*100).toFixed(1)}%`);
    
    const hasPlayerAgents = uniqueArticles.includes('XXXVI');
    console.log(`  ⭐ Article XXXVI (Player Agents): ${hasPlayerAgents ? 'COVERED ✅' : 'STILL MISSING ❌'}`);
    
    if (uniqueArticles.length >= 42) {
      console.log('\n🎊 PERFECT! 100% NBA CBA coverage achieved!');
      console.log('🏀 AgentPrep is now the ultimate NBA agent study platform!');
    }
  }

  console.log('\n✅ Final missing articles generation complete!\n');
}

if (require.main === module) {
  generateFinalMissingArticles()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('\n❌ Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { generateFinalMissingArticles };