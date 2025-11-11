// Investigate what articles actually exist in the cba_content table
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function investigateCBAContent() {
  console.log('🔍 INVESTIGATING CBA_CONTENT DATABASE\n');

  try {
    // 1. Get all unique article numbers
    console.log('1. Getting all unique article numbers...');
    const { data: allContent, error } = await supabase
      .from('cba_content')
      .select('article_number, article_title, type')
      .order('article_number');

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log(`✅ Found ${allContent.length} total CBA content entries\n`);

    // 2. Analyze unique article numbers
    const uniqueArticles = [...new Set(allContent.map(item => item.article_number))];
    console.log('2. All unique article numbers in database:');
    uniqueArticles.sort().forEach(article => {
      const count = allContent.filter(item => item.article_number === article).length;
      const types = [...new Set(allContent.filter(item => item.article_number === article).map(item => item.type))];
      console.log(`   ${article}: ${count} entries (${types.join(', ')})`);
    });
    console.log('');

    // 3. Check specifically for the "missing" articles
    const targetArticles = ['XVI', 'XVII', 'XXXIV', 'XXXV'];
    console.log('3. Checking for specific "missing" articles:');
    
    for (const target of targetArticles) {
      console.log(`\n   Article ${target}:`);
      
      // Check various possible formats
      const patterns = [
        target,
        `Article ${target}`,
        target.toLowerCase(),
        `article ${target.toLowerCase()}`,
        `Article ${target.toLowerCase()}`,
        `ARTICLE ${target}`,
      ];

      let found = false;
      for (const pattern of patterns) {
        const matches = allContent.filter(item => 
          item.article_number === pattern ||
          item.article_number.includes(pattern) ||
          pattern.includes(item.article_number)
        );
        
        if (matches.length > 0) {
          console.log(`     ✅ Found as "${matches[0].article_number}": ${matches.length} entries`);
          found = true;
          break;
        }
      }
      
      if (!found) {
        console.log(`     ❌ Not found in any format`);
      }
    }

    // 4. Look for articles containing XVI, XVII, etc.
    console.log('\n4. Searching for partial matches:');
    const searchTerms = ['XVI', 'XVII', 'XXXIV', 'XXXV'];
    
    for (const term of searchTerms) {
      const partialMatches = allContent.filter(item => 
        item.article_number.includes(term) ||
        item.article_title?.includes(term)
      );
      
      if (partialMatches.length > 0) {
        console.log(`\n   Contains "${term}":`);
        partialMatches.slice(0, 5).forEach(match => {
          console.log(`     "${match.article_number}" - ${match.article_title} (${match.type})`);
        });
        if (partialMatches.length > 5) {
          console.log(`     ... and ${partialMatches.length - 5} more`);
        }
      }
    }

    // 5. Look for Roman numeral patterns
    console.log('\n5. All articles with Roman numerals:');
    const romanArticles = uniqueArticles.filter(article => {
      const cleaned = article.replace(/Article\s*/gi, '').trim();
      return /^[IVXLCDM]+$/i.test(cleaned);
    });

    console.log('   Roman numeral articles found:');
    romanArticles.sort((a, b) => {
      const romanToNum = (roman) => {
        const cleaned = roman.replace(/Article\s*/gi, '').trim().toUpperCase();
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
    }).forEach(article => {
      const count = allContent.filter(item => item.article_number === article).length;
      console.log(`     ${article}: ${count} entries`);
    });

    // 6. Check the highest numbered articles
    console.log('\n6. Highest numbered articles (checking for XXX patterns):');
    const xxxArticles = uniqueArticles.filter(article => 
      article.toUpperCase().includes('XXX')
    );

    if (xxxArticles.length > 0) {
      console.log('   Articles containing XXX:');
      xxxArticles.forEach(article => {
        const count = allContent.filter(item => item.article_number === article).length;
        console.log(`     ${article}: ${count} entries`);
      });
    }

    // 7. Sample content to understand structure
    console.log('\n7. Sample CBA content structure:');
    const sampleEntries = allContent.slice(0, 5);
    sampleEntries.forEach((entry, i) => {
      console.log(`\n   Entry ${i + 1}:`);
      console.log(`     Article Number: "${entry.article_number}"`);
      console.log(`     Article Title: "${entry.article_title}"`);
      console.log(`     Type: "${entry.type}"`);
    });

  } catch (error) {
    console.error('❌ Investigation failed:', error);
  }
}

investigateCBAContent();