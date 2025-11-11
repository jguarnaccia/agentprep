// Priority script to generate Article XXXVI (Player Agents) flashcards
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
  FLASHCARDS_PER_SECTION: 6, // More flashcards for this critical article
  MAX_RETRIES: 3,
};

// Generate flashcards for Article XXXVI content
async function generateArticleXXXVIFlashcards(section, retryCount = 0) {
  const prompt = `You are an expert NBA agent educator creating study flashcards for the NBPA certification exam.

🎯 CRITICAL ARTICLE: Article XXXVI - PLAYER AGENTS
This is THE MOST IMPORTANT article for NBA agent certification!

**CBA Content:**
Article ${section.article_number} - ${section.article_title}
${section.section_number ? `Section ${section.section_number}: ${section.title}` : ''}

Content:
${section.content}

**FOCUS AREAS FOR AGENT CERTIFICATION:**
1. Agent certification requirements and process
2. Maximum 4% fee limitation 
3. Prohibited conduct and violations
4. NBAPA regulations and oversight
5. Agent responsibilities to players
6. Contract negotiation rules
7. Disciplinary procedures
8. Player-agent agreement requirements
9. Conflict of interest rules
10. Record keeping requirements

**Generate EXACTLY ${CONFIG.FLASHCARDS_PER_SECTION} comprehensive flashcards covering these essential topics.**

**Requirements:**
- Questions must be exam-focused and practical
- Cover fee limitations, conduct rules, certification requirements
- Include scenario-based questions for real-world application
- Answers should be detailed but concise (2-4 sentences)
- Difficulty should be medium to hard (this is advanced professional content)

**Output Format (JSON only):**
{
  "flashcards": [
    {
      "question": "What is the maximum fee a certified player agent can charge under Article XXXVI?",
      "answer": "Under Article XXXVI of the NBA CBA, certified player agents are limited to a maximum fee of 4% of the player's total compensation under their NBA player contract. This fee limitation is strictly enforced by the NBAPA.",
      "difficulty": "medium"
    },
    {
      "question": "What are the key requirements for NBA player agent certification?",
      "answer": "To become a certified NBA player agent, candidates must complete the NBAPA certification process, which includes passing an examination on the CBA, submitting required documentation, paying certification fees, and agreeing to comply with all NBAPA regulations and the CBA provisions in Article XXXVI.",
      "difficulty": "medium"
    }
  ]
}

Generate EXACTLY ${CONFIG.FLASHCARDS_PER_SECTION} flashcards. Output ONLY valid JSON.`;

  try {
    console.log(`    🎯 Generating Article XXXVI flashcards...`);
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert NBA agent educator specializing in Article XXXVI. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2500,
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
      topic: 'player-agents',
      difficulty: card.difficulty || 'medium',
    }));

    return formattedFlashcards;

  } catch (error) {
    if (retryCount < CONFIG.MAX_RETRIES) {
      console.log(`    ⚠️  Retry ${retryCount + 1}/${CONFIG.MAX_RETRIES}...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
      return generateArticleXXXVIFlashcards(section, retryCount + 1);
    }
    
    console.error(`    ❌ Failed after ${CONFIG.MAX_RETRIES} retries:`, error.message);
    throw error;
  }
}

// Main function to generate Article XXXVI flashcards
async function generatePlayerAgentFlashcards() {
  console.log('🎯 GENERATING ARTICLE XXXVI (PLAYER AGENTS) FLASHCARDS\n');
  console.log('⭐ CRITICAL: This is the most important article for NBA agent certification!\n');

  // Check if Article XXXVI already has flashcards
  const { data: existingCards } = await supabase
    .from('ai_flashcards')
    .select('id')
    .eq('article_number', 'Article XXXVI');

  if (existingCards && existingCards.length > 0) {
    console.log(`✅ Article XXXVI already has ${existingCards.length} flashcards!\n`);
    return;
  }

  // Fetch Article XXXVI content
  console.log('📚 Fetching Article XXXVI content...');
  
  const { data: sections, error } = await supabase
    .from('cba_content')
    .select('*')
    .eq('article_number', 'Article XXXVI')
    .in('type', ['section', 'article'])
    .order('section_number');

  if (error) {
    console.error('❌ Error fetching Article XXXVI:', error);
    return;
  }

  console.log(`✅ Found ${sections.length} Article XXXVI entries\n`);

  if (sections.length === 0) {
    console.log('❌ No Article XXXVI content found in database!\n');
    return;
  }

  // Show what we found
  console.log('📋 Article XXXVI Content:');
  sections.forEach((section, i) => {
    console.log(`  ${i + 1}. Type: ${section.type}`);
    console.log(`     Title: "${section.article_title}"`);
    if (section.section_number) {
      console.log(`     Section: ${section.section_number} - "${section.title}"`);
    }
    console.log(`     Content length: ${section.content?.length || 0} characters`);
    console.log('');
  });

  // Generate flashcards for each section
  console.log('🚀 Starting Article XXXVI flashcard generation...\n');

  let totalGenerated = 0;
  let totalFailed = 0;

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    
    console.log(`[${i + 1}/${sections.length}] Article XXXVI - Player Agents`);
    console.log(`  Type: ${section.type}`);
    if (section.section_number) {
      console.log(`  Section: ${section.section_number} - "${section.title}"`);
    }

    try {
      const flashcards = await generateArticleXXXVIFlashcards(section);
      
      console.log(`  ✅ Generated ${flashcards.length} flashcards`);
      console.log(`  📝 Sample: "${flashcards[0].question}"`);
      
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

    console.log('');
  }

  console.log('🎉 ARTICLE XXXVI GENERATION COMPLETE!\n');
  console.log('📊 Results:');
  console.log(`  ✅ Flashcards generated: ${totalGenerated}`);
  console.log(`  ❌ Failed sections: ${totalFailed}`);
  console.log(`  📝 Sections processed: ${sections.length - totalFailed}\n`);

  if (totalGenerated > 0) {
    console.log('⭐ SUCCESS! Article XXXVI (Player Agents) flashcards are now available!');
    console.log('🏀 Your students can now study the most critical NBA agent certification content!\n');
    
    // Get updated stats
    const { data: finalCount } = await supabase
      .from('ai_flashcards')
      .select('id', { count: 'exact', head: true });

    const { data: articleCheck } = await supabase
      .from('ai_flashcards')
      .select('article_number');

    if (finalCount && articleCheck) {
      const uniqueArticles = [...new Set(articleCheck.map(f => f.article_number.replace('Article ', '')))];
      
      console.log('📈 Updated Database Status:');
      console.log(`  📊 Total flashcards: ${finalCount.toLocaleString()}`);
      console.log(`  📚 Articles covered: ${uniqueArticles.length}/42 (${(uniqueArticles.length/42*100).toFixed(1)}%)`);
      console.log(`  ⭐ Article XXXVI (Player Agents): COVERED ✅`);
    }
  }

  console.log('\n✅ Article XXXVI generation complete!');
  console.log('🎯 NBA agent certification essential content is now available!\n');
}

// Run the script
if (require.main === module) {
  generatePlayerAgentFlashcards()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('\n❌ Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { generatePlayerAgentFlashcards };