const fs = require('fs');

const CBA_FILE = '/Users/jeremiahg/Downloads/25da5eb0-15eb-11ee-b5b3-fbd321202bdf-Final-2023-NBA-Collective-Bargaining-Agreement-6-28-23.txt';

const content = fs.readFileSync(CBA_FILE, 'utf-8');
const lines = content.split('\n');

console.log('Searching entire file for ARTICLE I, II, III patterns...\n');

// Look for the FIRST occurrence of each article after line 2000
const articlesToFind = ['ARTICLE I', 'ARTICLE II', 'ARTICLE III'];

articlesToFind.forEach(searchTerm => {
  console.log(`\nSearching for "${searchTerm}"...`);
  let found = false;
  
  for (let i = 2000; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line === searchTerm) {
      console.log(`  ✅ FOUND at line ${i}`);
      console.log(`  Context:`);
      for (let j = i; j < i + 5; j++) {
        console.log(`    ${j}: "${lines[j].trim()}"`);
      }
      found = true;
      break;
    }
  }
  
  if (!found) {
    console.log(`  ❌ NOT FOUND in format "${searchTerm}"`);
    
    // Try alternative formats
    for (let i = 2000; i < lines.length && i < 5000; i++) {
      const line = lines[i].trim();
      if (line.startsWith(searchTerm)) {
        console.log(`  ⚠️  Found variant at line ${i}: "${line}"`);
        console.log(`  Context:`);
        for (let j = i; j < i + 5; j++) {
          console.log(`    ${j}: "${lines[j].trim()}"`);
        }
        break;
      }
    }
  }
});
