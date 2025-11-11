const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateMissingArticles() {
  console.log('Generating Articles XXXIV-XXXIX for complete CBA coverage...\n');
  
  const articles = ['XXXIV', 'XXXV', 'XXXVI', 'XXXVII', 'XXXVIII', 'XXXIX'];
  let totalGenerated = 0;
  
  for (const article of articles) {
    console.log(`Processing Article ${article}...`);
    
    const { data: sections } = await supabase
      .from('cba_content')
      .select('*')
      .eq('article_number', `Article ${article}`)
      .in('type', ['section', 'article']);
    
    if (!sections || sections.length === 0) {
      console.log(`  No content found for Article ${article}`);
      continue;
    }
    
    console.log(`  Found ${sections.length} sections`);
    
    for (const section of sections) {
      try {
        const isPlayerAgents = article === 'XXXVI';
        const topic = isPlayerAgents ? 'player-agents' : 'general';
        
        const prompt = `Create 4 NBA CBA study flashcards for ${section.article_number}.

Content: ${section.content.substring(0, 2000)}

${isPlayerAgents ? 'FOCUS: Agent certification, 4% fee limit, prohibited conduct, NBAPA rules.' : 'Create comprehensive flashcards covering key concepts.'}

JSON format:
{
  "flashcards": [
    {
      "question": "Your question here?",
      "answer": "Your answer here.",
      "difficulty": "medium"
    }
  ]
}`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: 'You are an NBA CBA expert. Output only valid JSON.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 1500,
        });

        const responseText = completion.choices[0]?.message?.content || '';
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        
        if (!jsonMatch) {
          console.log(`    No valid JSON found`);
          continue;
        }
        
        const data = JSON.parse(jsonMatch[0]);
        
        if (!data.flashcards || !Array.isArray(data.flashcards)) {
          console.log(`    Invalid flashcard format`);
          continue;
        }
        
        const flashcards = data.flashcards.map(card => ({
          cba_section_id: section.id,
          article_number: section.article_number,
          article_title: section.article_title,
          section_number: section.section_number || 'Main',
          section_title: section.title || section.article_title,
          question: card.question,
          answer: card.answer,
          citation: `${section.article_number}`,
          topic: topic,
          difficulty: card.difficulty || 'medium',
        }));

        const { error: insertError } = await supabase
          .from('ai_flashcards')
          .insert(flashcards);

        if (insertError) {
          console.log(`    Database error: ${insertError.message}`);
        } else {
          console.log(`    Generated ${flashcards.length} flashcards`);
          totalGenerated += flashcards.length;
          
          if (isPlayerAgents) {
            console.log(`    Sample: "${flashcards[0].question}"`);
          }
        }

      } catch (error) {
        console.log(`    Failed: ${error.message}`);
      }
      
      await new Promise(r => setTimeout(r, 1000));
    }
    
    console.log('');
  }

  console.log(`Generation complete! Created ${totalGenerated} new flashcards\n`);
  
  // Check final status
  const { data: finalArticles } = await supabase
    .from('ai_flashcards')
    .select('article_number');

  if (finalArticles) {
    const uniqueArticles = [...new Set(finalArticles.map(f => f.article_number.replace('Article ', '')))];
    console.log(`Final Status:`);
    console.log(`   Articles covered: ${uniqueArticles.length}/42 (${(uniqueArticles.length/42*100).toFixed(1)}%)`);
    
    const hasPlayerAgents = uniqueArticles.includes('XXXVI');
    console.log(`   Article XXXVI (Player Agents): ${hasPlayerAgents ? 'COVERED' : 'MISSING'}`);
    
    if (uniqueArticles.length >= 42) {
      console.log('\nPERFECT! 100% NBA CBA coverage achieved!');
    }
  }
}

generateMissingArticles();