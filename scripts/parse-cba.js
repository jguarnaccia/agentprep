const fs = require('fs');
const path = require('path');

// File paths
const CBA_FILE = '/Users/jeremiahg/Downloads/25da5eb0-15eb-11ee-b5b3-fbd321202bdf-Final-2023-NBA-Collective-Bargaining-Agreement-6-28-23.txt';
const OUTPUT_FILE = path.join(__dirname, 'cba-parsed.json');

console.log('🏀 NBA CBA PARSER V3 - Starting...\n');

// Read the entire CBA file
const content = fs.readFileSync(CBA_FILE, 'utf-8');
const lines = content.split('\n');

console.log(`📄 File loaded: ${lines.length.toLocaleString()} lines\n`);

// Data structure
const cbaData = [];
let orderIndex = 0;

// Helper function to generate UUID v4
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Patterns
const ARTICLE_PATTERN = /^ARTICLE ([IVXLCDM]+)$/;
const SECTION_PATTERN = /^Section (\d+)\.\s*$/;

// Skip the Table of Contents (first ~2500 lines)
const CONTENT_START = 2400; // Start looking after line 2400

// State tracking
let currentArticle = null;
let currentArticleTitle = '';
let currentSection = null;
let currentSectionTitle = '';
let contentBuffer = [];

console.log('⏭️  Skipping Table of Contents...\n');

// Helper to save content
function saveContent() {
  if (contentBuffer.length === 0) return;
  
  const fullContent = contentBuffer.join('\n').trim();
  if (fullContent.length < 100) return; // Skip very short content
  
  const entry = {
    id: generateUUID(),
    type: currentSection ? 'section' : 'article',
    article_number: currentArticle || null,
    article_title: currentArticleTitle || null,
    section_number: currentSection || null,
    section_title: currentSectionTitle || null,
    content: fullContent,
    order_index: orderIndex++
  };
  
  cbaData.push(entry);
}

// Process lines starting after TOC
for (let i = CONTENT_START; i < lines.length; i++) {
  const line = lines[i].trim();
  
  // Skip empty lines at boundaries
  if (!line) continue;
  
  // Check for Article header (e.g., "ARTICLE I")
  const articleMatch = line.match(ARTICLE_PATTERN);
  if (articleMatch) {
    // Save previous content
    saveContent();
    contentBuffer = [];
    
    currentArticle = articleMatch[1];
    currentSection = null;
    currentSectionTitle = '';
    
    // Get article title from next non-empty line
    for (let j = i + 1; j < i + 5; j++) {
      const nextLine = lines[j].trim();
      if (nextLine && !nextLine.match(/^[=-]+$/)) {
        currentArticleTitle = nextLine;
        break;
      }
    }
    
    console.log(`📖 Article ${currentArticle}: ${currentArticleTitle}`);
    continue;
  }
  
  // Check for Section header (e.g., "Section 1.")
  const sectionMatch = line.match(SECTION_PATTERN);
  if (sectionMatch && currentArticle) {
    // Save previous section
    saveContent();
    contentBuffer = [];
    
    currentSection = sectionMatch[1];
    
    // Get section title from next non-empty line
    currentSectionTitle = '';
    for (let j = i + 1; j < i + 5; j++) {
      const nextLine = lines[j].trim();
      if (nextLine && !nextLine.match(/^[=-]+$/) && !nextLine.match(SECTION_PATTERN)) {
        currentSectionTitle = nextLine;
        break;
      }
    }
    
    continue;
  }
  
  // Accumulate content
  if (currentArticle) {
    contentBuffer.push(line);
  }
}

// Save final content
saveContent();

// Save to JSON
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(cbaData, null, 2));

console.log('\n✅ PARSING COMPLETE!\n');
console.log(`📊 Total entries: ${cbaData.length.toLocaleString()}`);
console.log(`📝 Output: ${OUTPUT_FILE}\n`);

// Stats
const articles = new Set();
const sections = cbaData.filter(d => d.type === 'section').length;
cbaData.forEach(d => {
  if (d.article_number) articles.add(d.article_number);
});

console.log('📈 Summary:');
console.log(`   Articles: ${articles.size}`);
console.log(`   Sections: ${sections}`);
console.log(`   Avg content: ${Math.round(cbaData.reduce((sum, d) => sum + d.content.length, 0) / cbaData.length)} chars`);
console.log('\n🎯 Next: node scripts/import-cba-to-supabase.js');
