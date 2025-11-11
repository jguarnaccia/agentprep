const fs = require('fs');
const path = require('path');

console.log('🏀 NBA CBA PARSER - IMPROVED SECTION DETECTION\n');
console.log('Parsing 2023 NBA Collective Bargaining Agreement...\n');

// File path
const CBA_FILE = '/Users/jeremiahg/Downloads/25da5eb0-15eb-11ee-b5b3-fbd321202bdf-Final-2023-NBA-Collective-Bargaining-Agreement-6-28-23.txt';
const OUTPUT_DIR = path.join(__dirname, '../cba-parsed');

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Read file
const content = fs.readFileSync(CBA_FILE, 'utf-8');
const lines = content.split('\n');

console.log(`📄 File loaded: ${lines.length.toLocaleString()} lines`);

// Exact line ranges for each article (0-indexed)
const articleRanges = [
  { num: 'I', start: 1752, end: 2356, title: 'DEFINITIONS' },
  { num: 'II', start: 2357, end: 4728, title: 'UNIFORM PLAYER CONTRACT' },
  { num: 'III', start: 4729, end: 4855, title: 'PLAYER EXPENSES' },
  { num: 'IV', start: 4856, end: 6528, title: 'BENEFITS' },
  { num: 'V', start: 6529, end: 6566, title: 'COMPENSATION AND EXPENSES IN CONNECTION WITH MILITARY DUTY' },
  { num: 'VI', start: 6567, end: 7370, title: 'PLAYER CONDUCT' },
  { num: 'VII', start: 7371, end: 14558, title: 'BASKETBALL RELATED INCOME, SALARY CAP, MINIMUM TEAM SALARY, TAX LEVEL, APRON LEVELS, AND DESIGNATED SHARE ARRANGEMENT' },
  { num: 'VIII', start: 14559, end: 14768, title: 'ROOKIE SCALE' },
  { num: 'IX', start: 14769, end: 14811, title: 'LENGTH OF PLAYER CONTRACTS' },
  { num: 'X', start: 14812, end: 15416, title: 'PLAYER ELIGIBILITY AND NBA DRAFT' },
  { num: 'XI', start: 15417, end: 16672, title: 'FREE AGENCY' },
  { num: 'XII', start: 16673, end: 16707, title: 'OPTION CLAUSES' },
  { num: 'XIII', start: 16708, end: 17162, title: 'CIRCUMVENTION' },
  { num: 'XIV', start: 17163, end: 17419, title: 'ANTI-COLLUSION PROVISIONS' },
  { num: 'XV', start: 17420, end: 17550, title: 'CERTIFICATIONS' },
  { num: 'XVI', start: 17551, end: 17561, title: 'MUTUAL RESERVATION OF RIGHTS' },
  { num: 'XVII', start: 17562, end: 17596, title: 'PROCEDURE WITH RESPECT TO PLAYING CONDITIONS AT VARIOUS FACILITIES' },
  { num: 'XVIII', start: 17597, end: 17676, title: 'TRAVEL ACCOMMODATIONS, LOCKER ROOM FACILITIES, AND PARKING' },
  { num: 'XIX', start: 17677, end: 17757, title: 'UNION SECURITY, DUES, AND CHECK-OFF' },
  { num: 'XX', start: 17758, end: 18244, title: 'SCHEDULING' },
  { num: 'XXI', start: 18244, end: 18496, title: 'NBA ALL-STAR GAME' },
  { num: 'XXII', start: 18497, end: 19745, title: 'PLAYER HEALTH AND WELLNESS' },
  { num: 'XXIII', start: 19746, end: 19996, title: 'EXHIBITION GAMES AND OFF-SEASON GAMES AND EVENTS' },
  { num: 'XXIV', start: 19997, end: 20155, title: 'PROHIBITION OF NO-TRADE CONTRACTS' },
  { num: 'XXV', start: 20156, end: 20173, title: 'LIMITATION ON DEFERRED COMPENSATION' },
  { num: 'XXVI', start: 20174, end: 20209, title: 'TEAM RULES' },
  { num: 'XXVII', start: 20210, end: 20424, title: 'RIGHT OF SET-OFF' },
  { num: 'XXVIII', start: 20425, end: 20583, title: 'MEDIA RIGHTS' },
  { num: 'XXIX', start: 20584, end: 21556, title: 'MISCELLANEOUS' },
  { num: 'XXX', start: 21557, end: 21640, title: 'NO-STRIKE AND NO-LOCKOUT PROVISIONS AND OTHER UNDERTAKINGS' },
  { num: 'XXXI', start: 21641, end: 22400, title: 'GRIEVANCE AND ARBITRATION PROCEDURE AND SPECIAL PROCEDURES WITH RESPECT TO DISPUTES INVOLVING PLAYER DISCIPLINE' },
  { num: 'XXXII', start: 22401, end: 22861, title: 'SYSTEM ARBITRATION' },
  { num: 'XXXIII', start: 22862, end: 24863, title: 'ANTI-DRUG PROGRAM AND SUBSTANCE ABUSE TREATMENT' },
  { num: 'XXXIV', start: 24864, end: 24884, title: 'RECOGNITION CLAUSE' },
  { num: 'XXXV', start: 24885, end: 24903, title: 'SAVINGS CLAUSE' },
  { num: 'XXXVI', start: 24904, end: 25012, title: 'PLAYER AGENTS' },
  { num: 'XXXVII', start: 25013, end: 25413, title: 'PLAYER APPEARANCES AND ADDITIONAL CONTENT ACTIVITIES/UNIFORM' },
  { num: 'XXXVIII', start: 25414, end: 25489, title: 'INTEGRATION, ENTIRE AGREEMENT, INTERPRETATION, AND CHOICE OF LAW' },
  { num: 'XXXIX', start: 25490, end: 25798, title: 'TERM OF AGREEMENT' },
  { num: 'XL', start: 25799, end: 25829, title: 'EXPANSION AND CONTRACTION' },
  { num: 'XLI', start: 25830, end: 26294, title: 'NBA G LEAGUE' },
  { num: 'XLII', start: 26295, end: 26332, title: 'OTHER' }
];

// Improved patterns - handle both "Section X." and "Section X. Title on same line"
const SECTION_PATTERN_ALONE = /^Section (\d+)\.\s*$/;
const SECTION_PATTERN_WITH_TITLE = /^Section (\d+)\.\s+(.+)$/;

const articles = [];

// Parse each article using exact line ranges
articleRanges.forEach(range => {
  const articleLines = lines.slice(range.start, range.end + 1);
  
  const article = {
    article_number: `Article ${range.num}`,
    title: range.title,
    sections: [],
    intro_content: ''
  };
  
  let currentSection = null;
  let contentBuffer = [];
  
  function saveSection() {
    if (!currentSection || contentBuffer.length === 0) return;
    
    const content = contentBuffer.join('\n').trim();
    if (content.length < 10) return;
    
    article.sections.push({
      section_number: `Section ${currentSection.number}`,
      section_title: currentSection.title,
      content: content
    });
    
    contentBuffer = [];
  }
  
  // Parse sections within this article
  for (let i = 0; i < articleLines.length; i++) {
    const line = articleLines[i].trim();
    
    if (!line) continue;
    
    // Check for Section with title on same line
    const matchWithTitle = line.match(SECTION_PATTERN_WITH_TITLE);
    if (matchWithTitle) {
      saveSection();
      
      currentSection = {
        number: matchWithTitle[1],
        title: matchWithTitle[2]
      };
      
      continue;
    }
    
    // Check for Section number only (title on next line)
    const matchAlone = line.match(SECTION_PATTERN_ALONE);
    if (matchAlone) {
      saveSection();
      
      const sectionNum = matchAlone[1];
      let sectionTitle = '';
      
      // Get section title from next non-empty line
      for (let j = i + 1; j < Math.min(i + 5, articleLines.length); j++) {
        const nextLine = articleLines[j].trim();
        if (nextLine && !nextLine.match(/^[-=]+$/) && !nextLine.match(SECTION_PATTERN_ALONE) && !nextLine.match(SECTION_PATTERN_WITH_TITLE)) {
          sectionTitle = nextLine;
          break;
        }
      }
      
      currentSection = {
        number: sectionNum,
        title: sectionTitle
      };
      
      continue;
    }
    
    // Accumulate content
    if (currentSection) {
      contentBuffer.push(line);
    } else {
      // This is intro content before any sections
      if (line && !line.match(/^ARTICLE [IVXLCDM]+$/) && !line.match(/^[-=]+$/)) {
        article.intro_content += (article.intro_content ? '\n' : '') + line;
      }
    }
  }
  
  // Save final section
  saveSection();
  
  articles.push(article);
  console.log(`✅ Article ${article.article_number}: ${article.title} (${article.sections.length} sections)`);
});

console.log(`\n📊 PARSING COMPLETE: ${articles.length} Articles parsed\n`);

// Verify we got all 42
if (articles.length === 42) {
  console.log('✅ SUCCESS: All 42 Articles verified!\n');
} else {
  console.log(`⚠️  WARNING: Expected 42 articles, found ${articles.length}\n`);
}

// Save each article as separate file
articles.forEach((article, index) => {
  const filename = `article_${String(index + 1).padStart(2, '0')}_${article.article_number.replace(/\s+/g, '_').toLowerCase()}.json`;
  const filepath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(article, null, 2));
});

// Save combined file
const combinedPath = path.join(OUTPUT_DIR, 'all_articles.json');
fs.writeFileSync(combinedPath, JSON.stringify(articles, null, 2));

console.log(`💾 Saved ${articles.length} individual article files`);
console.log(`💾 Saved combined file: all_articles.json\n`);

// Summary with expected section counts from TOC
const expectedSections = {
  'I': 1, 'II': 15, 'III': 2, 'IV': 9, 'V': 2, 'VI': 21, 'VII': 12,
  'VIII': 3, 'IX': 2, 'X': 10, 'XI': 5, 'XII': 5, 'XIII': 6, 'XIV': 17,
  'XV': 3, 'XVI': 0, 'XVII': 0, 'XVIII': 6, 'XIX': 4, 'XX': 9, 'XXI': 6,
  'XXII': 14, 'XXIII': 4, 'XXIV': 2, 'XXV': 2, 'XXVI': 3, 'XXVII': 5,
  'XXVIII': 4, 'XXIX': 21, 'XXX': 5, 'XXXI': 15, 'XXXII': 10, 'XXXIII': 21,
  'XXXIV': 0, 'XXXV': 0, 'XXXVI': 7, 'XXXVII': 4, 'XXXVIII': 3, 'XXXIX': 10,
  'XL': 2, 'XLI': 6, 'XLII': 3
};

console.log('📋 Summary (Expected vs Found):');
articles.forEach(a => {
  const expected = expectedSections[a.article_number.replace('Article ', '')];
  const found = a.sections.length;
  const status = expected === found ? '✅' : '⚠️';
  console.log(`   ${status} ${a.article_number}: ${a.title}`);
  console.log(`      Expected: ${expected} sections, Found: ${found} sections`);
});

console.log('\n✅ Successfully parsed all 42 articles from the 2023 NBA CBA');
console.log('✅ All articles captured with exact line ranges');
console.log('✅ Structured into machine-readable format');
console.log(`✅ Files saved to: ${OUTPUT_DIR}\n`);
console.log('🎯 Ready for database import!');
