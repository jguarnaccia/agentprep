const fs = require('fs');

const CBA_FILE = '/Users/jeremiahg/Downloads/25da5eb0-15eb-11ee-b5b3-fbd321202bdf-Final-2023-NBA-Collective-Bargaining-Agreement-6-28-23.txt';

const content = fs.readFileSync(CBA_FILE, 'utf-8');
const lines = content.split('\n');

const ARTICLE_PATTERN = /^ARTICLE ([IVXLCDM]+)$/;

console.log('Checking lines 2379-2450 for ARTICLE pattern matches:\n');

for (let i = 2379; i < 2450; i++) {
  const line = lines[i].trim();
  const match = line.match(ARTICLE_PATTERN);
  
  if (match || line.includes('ARTICLE')) {
    console.log(`Line ${i}: "${line}"`);
    if (match) {
      console.log(`  ✅ MATCHES PATTERN! Article ${match[1]}`);
    } else {
      console.log(`  ❌ Contains ARTICLE but doesn't match pattern`);
    }
    console.log('');
  }
}
