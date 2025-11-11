# 🃏 AgentPrep AI Flashcard Generator

Generate comprehensive study flashcards from the NBA CBA using OpenAI GPT-4o.

## 📋 Overview

This system automatically generates 500-1000+ flashcards by analyzing every section of the NBA Collective Bargaining Agreement. Each flashcard includes:

- **Question**: Clear, testable question front
- **Answer**: Concise but complete answer back
- **Citation**: Specific Article & Section reference
- **Topic**: Categorized by subject (salary-cap, free-agency, etc.)
- **Difficulty**: Easy, Medium, or Hard

## 🚀 Quick Start

### Step 1: Create Database Table

Run this SQL in your Supabase SQL Editor:
```
https://supabase.com/dashboard/project/wxidxpqdbhlchqxlapdv/sql/new
```

Copy and paste the contents of:
```
scripts/create-ai-flashcards-table.sql
```

**OR** try running:
```bash
node scripts/create-flashcards-table.js
```

### Step 2: Verify Setup

Check that everything is configured:
```bash
node scripts/verify-setup.js
```

This will check:
- ✅ CBA content is loaded
- ✅ ai_flashcards table exists
- ✅ OpenAI API key is configured

### Step 3: Generate Flashcards (Test Mode)

Start with test mode to generate flashcards for just 5 sections:

1. Open `scripts/generate-flashcards.js`
2. Set `TEST_MODE: true` (line 23)
3. Run:
```bash
node scripts/generate-flashcards.js
```

You should see:
```
🚀 AgentPrep Flashcard Generator
✅ Found 283 CBA sections
⚠️  TEST MODE: Processing only 5 sections
...
✅ Generated 20 flashcards
```

### Step 4: Generate All Flashcards

Once test mode works:

1. Open `scripts/generate-flashcards.js`
2. Set `TEST_MODE: false` (line 23)
3. Run:
```bash
node scripts/generate-flashcards.js
```

This will:
- Process all 283 CBA sections
- Generate ~1,132 flashcards (4 per section)
- Take approximately 30-45 minutes
- Show progress for each batch
- Handle errors and retries automatically

## ⚙️ Configuration

Edit `scripts/generate-flashcards.js`:

```javascript
const CONFIG = {
  FLASHCARDS_PER_SECTION: 4,      // Flashcards per section
  BATCH_SIZE: 5,                   // Sections per batch
  DELAY_BETWEEN_BATCHES: 2000,     // 2 seconds between batches
  MAX_RETRIES: 3,                  // Retry failed generations
  TEST_MODE: false,                // true = only first 5 sections
  PRIORITY_ARTICLES: [             // Articles to emphasize
    'II',    // Uniform Player Contract
    'VII',   // Salary Cap
    'VIII',  // Rookie Scale
    'XI',    // Free Agency
    'XXII'   // Player Health
  ],
};
```

## 📊 Database Structure

### ai_flashcards Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| cba_section_id | UUID | Links to cba_content table |
| article_number | TEXT | e.g., "VII" or "VII-6" |
| article_title | TEXT | e.g., "Salary Cap System" |
| section_number | TEXT | e.g., "6(e)" |
| section_title | TEXT | Section heading |
| question | TEXT | Front of flashcard |
| answer | TEXT | Back of flashcard |
| citation | TEXT | "Article VII, Section 6(e)" |
| topic | TEXT | Category (salary-cap, trades, etc.) |
| difficulty | TEXT | easy, medium, or hard |
| created_at | TIMESTAMP | When generated |
| updated_at | TIMESTAMP | Last modified |

### Sample Flashcard

```json
{
  "question": "What is the maximum salary for a player with 7-9 years of service?",
  "answer": "A player with 7-9 years of NBA service can earn up to 30% of the salary cap as their maximum salary. This is the middle tier between the 25% for 0-6 years and 35% for 10+ years of service.",
  "citation": "Article VII, Section 7(a)",
  "topic": "salary-cap",
  "difficulty": "medium",
  "article_number": "VII",
  "section_number": "7(a)"
}
```

## 🤖 How It Works

### Generation Process

1. **Fetch CBA Sections**: Load all 283 sections from database
2. **Skip Existing**: Check which sections already have flashcards
3. **Process in Batches**: Generate 5 sections at a time
4. **Call OpenAI**: For each section:
   - Send section content to GPT-4o
   - Request 4 flashcards with specific format
   - Parse JSON response
5. **Save to Database**: Insert flashcards with proper citations
6. **Track Progress**: Log success/failure for each section
7. **Handle Errors**: Retry up to 3 times on failures

### AI Prompt Strategy

The system uses a carefully crafted prompt that:
- Provides full section content for context
- Requests specific number of flashcards (4)
- Suggests difficulty based on article importance
- Requires proper JSON format
- Asks for varied question types (facts, applications, scenarios)

### Topic Categorization

Flashcards are automatically categorized by article:

| Article | Topic |
|---------|-------|
| I | definitions |
| II | player-contracts |
| VII | salary-cap |
| VIII | rookie-scale |
| X | player-movement |
| XI | free-agency |
| XII | trades |
| XIII | draft |
| XXII | health-safety |
| XXIII | conduct |
| XXIX | arbitration |
| Others | general |

### Difficulty Assignment

Difficulty is determined by:
- **Priority Articles** (II, VII, VIII, XI, XXII) → Higher difficulty
- **Content Length** (>1000 chars) → Higher difficulty
- **Both factors** → Hard
- **One factor** → Medium
- **Neither** → Easy

## 📈 Expected Output

### Statistics

Based on 283 CBA sections with 4 flashcards each:

- **Total Flashcards**: ~1,132
- **Generation Time**: 30-45 minutes
- **Difficulty Distribution**:
  - Easy: ~40% (450 cards)
  - Medium: ~40% (450 cards)
  - Hard: ~20% (230 cards)

### Topics Covered

All 42 CBA articles including:
- Player Contracts (Article II)
- Salary Cap System (Article VII)
- Rookie Scale Contracts (Article VIII)
- Free Agency (Article XI)
- Trade Rules (Article XII)
- Draft Rules (Article XIII)
- Player Health & Safety (Article XXII)
- And 35 more articles...

## 🔍 Monitoring Progress

While running, you'll see:

```
🚀 AgentPrep Flashcard Generator

Configuration:
  - Flashcards per section: 4
  - Batch size: 5
  - Test mode: OFF
  - Priority articles: II, VII, VIII, XI, XXII

📚 Fetching CBA sections from database...

✅ Found 283 CBA sections

📊 Status:
  - Total sections: 283
  - Already processed: 0
  - Need processing: 283

🎯 Starting generation: 57 batches

═══════════════════════════════════════════════════════════

📦 Batch 1/57 (Sections 1-5)
────────────────────────────────────────────────────────────

[1/283] Article I, Section 1
  "Definitions"
  ✅ Generated 4 flashcards

[2/283] Article I, Section 2
  "Additional Definitions"
  ✅ Generated 4 flashcards

...
```

## 🚨 Troubleshooting

### Error: "Table does not exist"

**Solution**: Run the SQL to create the table:
1. Open Supabase SQL Editor
2. Copy contents of `scripts/create-ai-flashcards-table.sql`
3. Execute the SQL
4. Run `node scripts/verify-setup.js` to confirm

### Error: "OpenAI API key not found"

**Solution**: Check `.env.local` has:
```
OPENAI_API_KEY=sk-proj-...
```

### Error: "Rate limit exceeded"

**Solution**: The script handles this automatically with:
- Batch processing (5 sections at a time)
- 2 second delays between batches
- 500ms delays within batches
- Automatic retries (up to 3 attempts)

If still hitting limits, adjust in `CONFIG`:
```javascript
BATCH_SIZE: 3,              // Reduce from 5 to 3
DELAY_BETWEEN_BATCHES: 5000, // Increase from 2s to 5s
```

### Error: "No JSON found in response"

**Solution**: This usually means OpenAI returned unexpected format. The script automatically retries 3 times. If it persists:
1. Check OpenAI API status
2. Try reducing batch size
3. Check if specific sections are causing issues

### Some Sections Failed

**Solution**: No problem! The script tracks which sections succeeded. Simply run again and it will:
- Skip sections that already have flashcards
- Only process failed sections
- Keep trying until all are complete

## 📁 File Structure

```
agentprep/
├── scripts/
│   ├── create-ai-flashcards-table.sql  # Database table definition
│   ├── create-flashcards-table.js      # Script to create table
│   ├── generate-flashcards.js          # Main generation script ⭐
│   ├── verify-setup.js                 # Setup verification
│   └── check-flashcards.js             # Check generated cards
└── AI-FLASHCARDS-README.md             # This file
```

## 🎯 Next Steps

After generating flashcards:

### 1. Verify Generation
```bash
node scripts/verify-setup.js
```

### 2. Check Sample Flashcards

Query database to see examples:
```sql
SELECT question, answer, citation, difficulty, topic
FROM ai_flashcards
ORDER BY created_at DESC
LIMIT 10;
```

### 3. Update UI

The flashcards are ready to use! Next phase will integrate them into the study interface:
- Display flashcards with flip animation
- Filter by article/topic
- Filter by difficulty
- Track which cards user has studied
- Mix with existing Bobby Marks flashcards

## 💡 Tips for Success

### For Best Results:

1. **Start with Test Mode**: Always test with 5 sections first
2. **Monitor First Batch**: Watch the first batch complete successfully
3. **Check Database**: Verify flashcards are being saved correctly
4. **Let It Run**: Generation takes 30-45 minutes - don't interrupt
5. **Re-run if Needed**: Script is idempotent - safe to run multiple times

### Quality Control:

The AI generates high-quality flashcards because:
- ✅ Uses full section content (not summaries)
- ✅ Enforces specific JSON format
- ✅ Requests varied question types
- ✅ Includes detailed answers (2-4 sentences)
- ✅ Cites exact article and section
- ✅ Categorizes by topic automatically
- ✅ Assigns appropriate difficulty levels

### Performance:

To optimize generation speed:
- Increase `BATCH_SIZE` to 10 (but watch rate limits)
- Reduce `DELAY_BETWEEN_BATCHES` to 1000ms (1 second)
- Use `gpt-4o-mini` instead of `gpt-4o` (faster, cheaper, slightly lower quality)

## 🎓 Understanding the Output

### Flashcard Quality

Each flashcard is designed for exam prep:

**Good Question Examples:**
- "What is the minimum team salary requirement?"
- "When can a team use the Mid-Level Exception?"
- "How long must a player be on a team before being traded with another player?"

**Good Answer Examples:**
- Clear, concise (2-4 sentences)
- Cites specific numbers, percentages, timeframes
- Explains the "why" when relevant
- References the rule's purpose or exceptions

**Difficulty Calibration:**
- **Easy**: Direct facts you can memorize
- **Medium**: Requires understanding and application
- **Hard**: Complex scenarios with multiple rules

## 🚀 Ready to Generate?

Let's do this! Run:

```bash
# Step 1: Verify everything is ready
node scripts/verify-setup.js

# Step 2: Test with 5 sections (set TEST_MODE: true first)
node scripts/generate-flashcards.js

# Step 3: Generate all flashcards (set TEST_MODE: false)
node scripts/generate-flashcards.js
```

---

**Questions or Issues?**
- Check the troubleshooting section above
- Review the script configuration
- Verify database permissions in Supabase

**Let's make AgentPrep the #1 NBA agent study platform!** 🏀💪🔥
