const fs = require('fs');

const CBA_FILE = '/Users/jeremiahg/Downloads/25da5eb0-15eb-11ee-b5b3-fbd321202bdf-Final-2023-NBA-Collective-Bargaining-Agreement-6-28-23.txt';

const content = fs.readFileSync(CBA_FILE, 'utf-8');
const lines = content.split('\n');

console.log('🔍 COMPREHENSIVE SEARCH: Finding all 42 Articles\n');

const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
                       'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX',
                       'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI', 'XXVII', 'XXVIII', 'XXIX', 'XXX',
                       'XXXI', 'XXXII', 'XXXIII', 'XXXIV', 'XXXV', 'XXXVI', 'XXXVII', 'XXXVIII', 'XXXIX', 'XL',
                       'XLI', 'XLII'];

const articleLocations = [];

// Search for each article
romanNumerals.forEach(numeral => {
  const searchTerm = `ARTICLE ${numeral}`;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line === searchTerm) {
      // Get the title from next line
      let title = '';
      for (let j = i + 1; j < i + 5; j++) {
        const nextLine = lines[j].trim();
        if (nextLine && !nextLine.match(/^[-=]+$/)) {
          title = nextLine;
          break;
        }
      }
      
      articleLocations.push({
        article: searchTerm,
        line: i,
        title: title
      });
      break; // Found this article, move to next
    }
  }
});

console.log(`Found ${articleLocations.length} articles:\n`);
articleLocations.forEach(loc => {
  console.log(`Line ${String(loc.line).padStart(5)}: ${loc.article.padEnd(15)} - ${loc.title}`);
});

// Determine the best CONTENT_START
if (articleLocations.length > 0) {
  const firstArticleLine = articleLocations[0].line;
  console.log(`\n✅ First article starts at line: ${firstArticleLine}`);
  console.log(`   Set CONTENT_START = ${firstArticleLine} in the parser`);
}
