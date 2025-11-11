# 📁 AgentPrep Project Structure - Phase 2B

## 🆕 New Files Created (Phase 2B)

```
agentprep/
│
├── 📄 PHASE-2B-SUMMARY.md              ⭐ START HERE - Complete overview
├── 📄 QUICK-START.md                   🚀 Step-by-step instructions
├── 📄 AI-FLASHCARDS-README.md          📖 Full technical documentation
│
└── scripts/
    ├── 📄 create-ai-flashcards-table.sql      # Database schema
    ├── 📄 create-flashcards-table.js          # Table creation helper
    ├── 📄 generate-flashcards.js              # Main generation engine ⭐⭐⭐
    ├── 📄 verify-setup.js                     # Pre-flight checks
    ├── 📄 check-flashcards.js                 # Results analyzer
    ├── 📄 test-flashcard-system.sh            # Quick test script
    └── 📄 run-flashcard-generation.sh         # Full workflow automation
```

---

## 📂 Complete Project Structure

```
agentprep/
│
├── 📄 .env.local                       # API keys (OpenAI, Supabase)
├── 📄 package.json                     # Dependencies
├── 📄 README.md                        # Main project README
│
├── 📚 DOCUMENTATION (Phase 2B - NEW)
│   ├── 📄 PHASE-2B-SUMMARY.md          ⭐ What we built
│   ├── 📄 QUICK-START.md               🚀 How to use it
│   └── 📄 AI-FLASHCARDS-README.md      📖 Technical details
│
├── 📚 PREVIOUS DOCUMENTATION
│   ├── 📄 CBA-DATABASE-GUIDE.md        # Phase 1: CBA parsing
│   ├── 📄 STUDY_GUIDE_SETUP.MD         # Phase 1: Study UI
│   ├── 📄 AI-TEST-GENERATOR-README.md  # Phase 2A: Test generator
│   └── 📄 TEST-HISTORY-README.md       # Phase 2A: Test history
│
├── 📂 app/                             # Next.js app directory
│   ├── page.tsx                        # Homepage
│   ├── 📂 study/                       # Study platform
│   │   └── page.tsx                    # CBA study guide
│   ├── 📂 flashcards/                  # Flashcard UI (coming in Phase 2C)
│   ├── 📂 ai-generator/                # AI test generator
│   │   └── page.tsx                    # Test creation interface
│   ├── 📂 test-history/                # Test history
│   │   └── page.tsx                    # Past tests & retakes
│   └── 📂 api/
│       └── 📂 generate-ai-test/
│           └── route.ts                # OpenAI integration
│
├── 📂 components/                      # React components
│   ├── FlashcardSet.tsx                # (If exists)
│   └── ...other components
│
├── 📂 lib/                             # Utilities
│   └── supabase.ts                     # Supabase client
│
├── 📂 scripts/                         # Backend scripts
│   │
│   ├── 🆕 PHASE 2B - FLASHCARD GENERATION
│   ├── create-ai-flashcards-table.sql        # DB schema
│   ├── create-flashcards-table.js            # Table setup
│   ├── generate-flashcards.js                # Main generator ⭐⭐⭐
│   ├── verify-setup.js                       # Pre-flight check
│   ├── check-flashcards.js                   # Results analyzer
│   ├── test-flashcard-system.sh              # Quick test
│   ├── run-flashcard-generation.sh           # Full workflow
│   │
│   ├── 📚 PHASE 1 - CBA PARSING
│   ├── parse-cba-complete.js           # CBA parser
│   ├── import-cba-to-supabase.js       # Import to DB
│   ├── create_cba_table.sql            # CBA table schema
│   ├── check-articles.js               # Verify CBA data
│   │
│   ├── 📝 PHASE 1 - BOBBY MARKS FLASHCARDS
│   ├── import-bobby-marks-flashcards.js      # Import existing cards
│   ├── import-bobby-marks-part2.js           # More Bobby Marks
│   ├── import-scenario-*.js                  # Scenario questions
│   │
│   ├── 🧪 PHASE 2A - TEST GENERATOR
│   ├── create-ai-test-tables.sql       # Test sessions table
│   ├── test-ai-generator.js            # Test OpenAI integration
│   │
│   └── 🔧 UTILITIES
│       ├── check-database.js           # DB inspection
│       ├── check-line-2379.js          # Debugging
│       └── debug-parser.js             # CBA parser debug
│
├── 📂 cba-parsed/                      # Parsed CBA content
│   └── *.json files
│
└── 📂 public/                          # Static assets
    └── images, fonts, etc.
```

---

## 🎯 How Files Work Together

### Generation Flow

```
1. USER RUNS:
   node scripts/verify-setup.js
   
2. CHECKS:
   ✓ CBA content exists (283 sections)
   ✓ ai_flashcards table exists
   ✓ OpenAI API key configured
   
3. USER RUNS:
   node scripts/generate-flashcards.js
   
4. PROCESS:
   ┌─────────────────────────────────────┐
   │ Fetch CBA sections from database    │
   └──────────────┬──────────────────────┘
                  ↓
   ┌─────────────────────────────────────┐
   │ For each section (batches of 5):    │
   │ - Call OpenAI GPT-4o                │
   │ - Generate 4 flashcards             │
   │ - Parse JSON response               │
   │ - Save to ai_flashcards table       │
   └──────────────┬──────────────────────┘
                  ↓
   ┌─────────────────────────────────────┐
   │ Log progress & handle errors        │
   └──────────────┬──────────────────────┘
                  ↓
   ┌─────────────────────────────────────┐
   │ ~1,132 flashcards generated!        │
   └─────────────────────────────────────┘
   
5. USER RUNS:
   node scripts/check-flashcards.js
   
6. SHOWS:
   ✓ Total count
   ✓ Difficulty distribution
   ✓ Topic breakdown
   ✓ Quality metrics
   ✓ Sample flashcards
```

### Database Relationships

```
┌─────────────────┐         ┌──────────────────┐
│  cba_content    │         │  ai_flashcards   │
├─────────────────┤         ├──────────────────┤
│ id (PK)         │◄────────│ cba_section_id   │
│ type            │         │ id (PK)          │
│ article_number  │         │ question         │
│ article_title   │         │ answer           │
│ section_number  │         │ citation         │
│ title           │         │ topic            │
│ content         │         │ difficulty       │
└─────────────────┘         └──────────────────┘
     283 rows                   ~1,132 rows
                              (4 per section)
```

### Configuration Files

```
.env.local
├── OPENAI_API_KEY              → Used by generate-flashcards.js
├── NEXT_PUBLIC_SUPABASE_URL    → Used by all scripts
└── SUPABASE_SERVICE_ROLE_KEY   → Used for DB operations

scripts/generate-flashcards.js (CONFIG object)
├── FLASHCARDS_PER_SECTION: 4   → Cards per section
├── BATCH_SIZE: 5                → Sections per batch
├── DELAY_BETWEEN_BATCHES: 2000  → Rate limit handling
├── MAX_RETRIES: 3               → Error recovery
├── TEST_MODE: true/false        → Safe testing
└── PRIORITY_ARTICLES: [...]     → Emphasis articles
```

---

## 📊 Data Flow

### Input: CBA Content
```
Table: cba_content
Rows: 283 sections
Example:
  article_number: "VII"
  article_title: "Salary Cap System"
  section_number: "6(e)"
  title: "Mid-Level Exception"
  content: "Teams may sign players..."
```

### Processing: OpenAI Generation
```
For each section:
  Prompt: Section content + instructions
  Model: GPT-4o
  Output: 4 flashcards in JSON format
```

### Output: Flashcards
```
Table: ai_flashcards
Rows: ~1,132 flashcards
Example:
  question: "What is the mid-level exception?"
  answer: "The MLE allows teams to sign..."
  citation: "Article VII, Section 6(e)"
  topic: "salary-cap"
  difficulty: "medium"
```

---

## 🎯 Key Files Explained

### ⭐ generate-flashcards.js (The Heart)
**What it does:**
- Fetches all 283 CBA sections
- Calls OpenAI for each section
- Generates 4 flashcards per section
- Saves to database with citations
- Handles errors & retries
- Tracks progress

**Key functions:**
```javascript
generateFlashcardsForSection()  // Call OpenAI
generateAllFlashcards()         // Main orchestrator
delay()                         // Rate limiting
```

### 🔍 verify-setup.js
**What it does:**
- Checks CBA content exists
- Verifies ai_flashcards table
- Confirms OpenAI API key
- Shows current status

**Run before generation!**

### 📊 check-flashcards.js
**What it does:**
- Counts total flashcards
- Shows difficulty breakdown
- Shows topic distribution
- Displays samples
- Quality checks
- Coverage analysis

**Run after generation!**

---

## 🚀 Quick Reference Commands

```bash
# Navigate to project
cd /Users/jeremiahg/Desktop/agentprep

# Pre-flight check
node scripts/verify-setup.js

# Generate test flashcards (5 sections)
node scripts/generate-flashcards.js  # TEST_MODE: true

# Generate ALL flashcards (283 sections)
# Edit generate-flashcards.js: TEST_MODE: false
node scripts/generate-flashcards.js

# Check results
node scripts/check-flashcards.js

# Quick test (automated)
chmod +x scripts/test-flashcard-system.sh
./scripts/test-flashcard-system.sh
```

---

## 📖 Documentation Priority

**Read in this order:**

1. **PHASE-2B-SUMMARY.md** ← Start here for overview
2. **QUICK-START.md** ← Step-by-step instructions
3. **AI-FLASHCARDS-README.md** ← Deep technical details
4. **generate-flashcards.js** ← Well-commented code

---

## ✅ Phase Status

- ✅ **Phase 1**: CBA Database & Study Guide
- ✅ **Phase 2A**: AI Test Generator & History
- ✅ **Phase 2B**: AI Flashcard Generation (COMPLETE!)
- ⏭️ **Phase 2C**: Flashcard UI Integration (NEXT)

---

## 🎨 What's Coming Next (Phase 2C)

### Flashcard Display Component
```typescript
app/flashcards/page.tsx
  - Card flip animation
  - Swipe gestures
  - Keyboard shortcuts
  - Progress indicator
```

### Filters & Search
```typescript
components/FlashcardFilters.tsx
  - Filter by article
  - Filter by topic
  - Filter by difficulty
  - Search questions/answers
```

### Study Session Tracking
```typescript
  - Cards studied today
  - Known vs unknown
  - Spaced repetition
  - Study streaks
```

---

**Ready to generate flashcards? Start with PHASE-2B-SUMMARY.md! 🚀**
