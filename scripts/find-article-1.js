const fs = require('fs');

const CBA_FILE = '/Users/jeremiahg/Downloads/25da5eb0-15eb-11ee-b5b3-fbd321202bdf-Final-2023-NBA-Collective-Bargaining-Agreement-6-28-23.txt';

const content = fs.readFileSync(CBA_FILE, 'utf-8');
const lines = content.split('\n');

console.log('Searching from the BEGINNING of the file for Article I...\n');

// Search from line 0 to 500
for (let i = 0; i < 500; i++) {
  const line = lines[i].trim();
  
  if (line === 'ARTICLE I' || line.startsWith('ARTICLE I')) {
    console.log(`✅ FOUND Article I at line ${i}`);
    console.log('Context:');
    for (let j = i; j < i + 10; j++) {
      console.log(`  ${j}: "${lines[j].trim()}"`);
    }
    console.log('\n');
    break;
  }
}

// Also find Article II to understand the structure
console.log('Also checking where Article II is...\n');
for (let i = 0; i < 3000; i++) {
  const line = lines[i].trim();
  
  if (line === 'ARTICLE II') {
    console.log(`✅ FOUND Article II at line ${i}`);
    console.log('Context:');
    for (let j = i; j < i + 10; j++) {
      console.log(`  ${j}: "${lines[j].trim()}"`);
    }
    break;
  }
}
