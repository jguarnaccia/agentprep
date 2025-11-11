// Aggressive fix for the persistent "Article Article" issue
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function aggressiveFix() {
  console.log('🔨 AGGRESSIVE FIX FOR ARTICLE NAMING\n');

  try {
    // Get ALL flashcards and examine the actual data
    console.log('1. Examining ALL flashcard data...');
    
    const { data: allCards, error } = await supabase
      .from('ai_flashcards')
      .select('id, article_number, citation')
      .limit(10);

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log('Sample of current data:');
    allCards.forEach((card, i) => {
      console.log(`   ${i + 1}. article_number: "${card.article_number}"`);
      console.log(`      citation: "${card.citation}"`);
    });

    // Update ALL records to ensure clean article numbers
    console.log('\n2. Updating ALL records with clean article numbers...');

    // Get all unique article numbers first
    const { data: uniqueData } = await supabase
      .from('ai_flashcards')
      .select('article_number')
      .order('article_number');

    if (uniqueData) {
      const uniqueArticles = [...new Set(uniqueData.map(f => f.article_number))];
      
      console.log('\nUnique article numbers found:');
      uniqueArticles.forEach(article => {
        console.log(`   "${article}"`);
      });

      // Fix each article type
      for (const article of uniqueArticles) {
        // Determine what the clean version should be
        let cleanArticle = article;
        
        // Remove any duplicate "Article" text
        if (article.includes('Article Article')) {
          cleanArticle = article.replace('Article Article', 'Article');
        }
        
        // Ensure proper format "Article X"
        const romanPart = cleanArticle.replace(/^Article\s+/, '').trim();
        cleanArticle = `Article ${romanPart}`;

        if (cleanArticle !== article) {
          console.log(`   Fixing: "${article}" → "${cleanArticle}"`);
          
          // Update all cards with this article number
          const { data: cardsToUpdate } = await supabase
            .from('ai_flashcards')
            .select('id, citation')
            .eq('article_number', article);

          if (cardsToUpdate) {
            for (const card of cardsToUpdate) {
              // Also fix citation
              let cleanCitation = card.citation || '';
              if (cleanCitation.includes('Article Article')) {
                cleanCitation = cleanCitation.replace('Article Article', 'Article');
              }

              await supabase
                .from('ai_flashcards')
                .update({ 
                  article_number: cleanArticle,
                  citation: cleanCitation
                })
                .eq('id', card.id);
            }
            
            console.log(`     Updated ${cardsToUpdate.length} cards`);
          }
        }
      }
    }

    // 3. Verify the fix
    console.log('\n3. Verifying the fix...');
    
    const { data: verifyData } = await supabase
      .from('ai_flashcards')
      .select('article_number')
      .limit(10);

    if (verifyData) {
      console.log('Sample after fix:');
      verifyData.forEach((card, i) => {
        console.log(`   ${i + 1}. "${card.article_number}"`);
      });
    }

    // 4. Get final unique articles in sorted order
    const { data: finalData } = await supabase
      .from('ai_flashcards')
      .select('article_number');

    if (finalData) {
      const finalUnique = [...new Set(finalData.map(f => f.article_number))];
      
      // Sort them properly
      const sorted = finalUnique.sort((a, b) => {
        const romanToNum = (roman) => {
          const cleaned = roman.replace('Article ', '').trim();
          const values = { 'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000 };
          let total = 0;
          for (let i = 0; i < cleaned.length; i++) {
            const current = values[cleaned[i]];
            const next = values[cleaned[i + 1]];
            if (next && current < next) {
              total += next - current;
              i++;
            } else {
              total += current;
            }
          }
          return total;
        };
        return romanToNum(a) - romanToNum(b);
      });

      console.log('\n✅ Final sorted article list:');
      sorted.forEach(article => {
        console.log(`   ${article}`);
      });
      
      console.log(`\nTotal articles: ${sorted.length}`);
    }

    console.log('\n🎉 Aggressive fix complete! Clear your browser cache and refresh the page.');

  } catch (error) {
    console.error('❌ Aggressive fix failed:', error);
  }
}

aggressiveFix();