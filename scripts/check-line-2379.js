const fs = require('fs');

const CBA_FILE = '/Users/jeremiahg/Downloads/25da5eb0-15eb-11ee-b5b3-fbd321202bdf-Final-2023-NBA-Collective-Bargaining-Agreement-6-28-23.txt';

const content = fs.readFileSync(CBA_FILE, 'utf-8');
const lines = content.split('\n');

console.log('What is actually at line 2379 and nearby?\n');

for (let i = 2375; i < 2385; i++) {
  console.log(`${i}: "${lines[i]}"`);
}

console.log('\n\nWhat about around line 2300-2365?\n');
for (let i = 2350; i < 2365; i++) {
  console.log(`${i}: "${lines[i].trim()}"`);
}
