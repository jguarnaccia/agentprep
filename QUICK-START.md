# 🚀 Quick Start Guide - AI Flashcard Generation

## ⚡ 3-Step Setup (5 minutes)

### Step 1: Create Database Table (2 min)

1. Open Supabase SQL Editor:
   ```
   https://supabase.com/dashboard/project/wxidxpqdbhlchqxlapdv/sql/new
   ```

2. Copy contents from `scripts/create-ai-flashcards-table.sql`

3. Click "Run" to execute

4. You should see "Success. No rows returned"

### Step 2: Verify Setup (1 min)

Run this in your terminal:

```bash
cd /Users/jeremiahg/Desktop/agentprep
node scripts/verify-setup.js
```

You should see:
```
🔍 Verifying AgentPrep Setup
✅ Found 283 CBA sections
✅ Table exists with 0 flashcards
✅ API key found: sk-proj-...
✅ Ready to generate flashcards!
```

### Step 3: Generate Test Flashcards (2 min)

First, let's test with just 5 sections:

```bash
# The script is already in TEST_MODE by default
node scripts/generate-flashcards.js
```

You should see:
```
🚀 AgentPrep Flashcard Generator
⚠️  TEST MODE: Processing only 5 sections
[1/5] Article I, Section 1
  ✅ Generated 4 flashcards
[2/5] Article I, Section 2
  ✅ Generated 4 flashcards
...
✅ Done! 20 flashcards ready to use.
```

---

## 🎯 Full Generation (30-45 min)

Once test works, generate all flashcards:

### Step 1: Enable Full Mode

Open `scripts/generate-flashcards.js` and change line 23:

```javascript
// Change this:
TEST_MODE: true,

// To this:
TEST_MODE: false,
```

### Step 2: Run Full Generation

```bash
node scripts/generate-flashcards.js
```

This will:
- Process all 283 CBA sections
- Generate ~1,132 flashcards
- Take 30-45 minutes
- Auto-retry on failures
- Skip already-completed sections

### Step 3: Check Results

```bash
node scripts/check-flashcards.js
```

You should see:
```
🃏 Checking AI-Generated Flashcards
📊 Total Flashcards: 1132

📈 By Difficulty:
  medium    :  453 (40.0%)
  easy      :  452 (39.9%)
  hard      :  227 (20.1%)

📚 By Topic:
  salary-cap          :  240 (21.2%)
  player-contracts    :  180 (15.9%)
  free-agency         :  160 (14.1%)
  ...

✅ All quality checks passed!
✅ All sections have flashcards!
```

---

## 🔧 Troubleshooting

### "Table does not exist"

Run the SQL in Supabase:
```bash
# Open and copy this file:
cat scripts/create-ai-flashcards-table.sql
```

### "Rate limit exceeded"

The script handles this automatically. If it persists:
1. Reduce batch size in config (line 21): `BATCH_SIZE: 3`
2. Increase delay (line 22): `DELAY_BETWEEN_BATCHES: 5000`

### Generation stopped/crashed

No problem! Just run again:
```bash
node scripts/generate-flashcards.js
```

The script automatically:
- Skips sections that already have flashcards
- Only processes remaining sections
- Picks up where it left off

### Check which sections are missing

```bash
node scripts/check-flashcards.js
```

Look for "Sections missing flashcards" in the output.

---

## 📊 What You Get

### Statistics (Expected)

- **Total Flashcards**: ~1,132
- **Difficulty Mix**: 40% easy, 40% medium, 20% hard
- **Topics**: All 42 CBA articles covered
- **Quality**: Professionally written with citations

### Sample Flashcard

**Front (Question):**
> "What is the maximum salary for a player with 7-9 years of service?"

**Back (Answer):**
> "A player with 7-9 years of NBA service can earn up to 30% of the salary cap as their maximum salary. This is the middle tier between the 25% for 0-6 years and 35% for 10+ years of service."

**Citation:** Article VII, Section 7(a)  
**Topic:** salary-cap  
**Difficulty:** medium

---

## 🎨 Next: UI Integration

After generation is complete, the flashcards are ready to integrate into your study interface!

### What's Been Built
✅ Database table with flashcards  
✅ Generation scripts  
✅ Verification tools  
✅ Quality checks

### What's Next (Phase 2C)
- [ ] Flashcard display component with flip animation
- [ ] Filter by article/topic/difficulty
- [ ] Search flashcards
- [ ] Mark cards as "studied"
- [ ] Mix AI cards with Bobby Marks flashcards
- [ ] Study session tracking
- [ ] Spaced repetition algorithm

---

## 📝 Files Created

```
scripts/
├── create-ai-flashcards-table.sql   # Database schema
├── create-flashcards-table.js       # Table creation script
├── generate-flashcards.js           # Main generation script ⭐
├── verify-setup.js                  # Setup checker
├── check-flashcards.js              # Results analyzer
└── run-flashcard-generation.sh      # Complete workflow

AI-FLASHCARDS-README.md              # Full documentation
QUICK-START.md                       # This guide
```

---

## ✅ Checklist

Use this to track your progress:

- [ ] Created `ai_flashcards` table in Supabase
- [ ] Verified setup with `verify-setup.js`
- [ ] Ran test mode (5 sections)
- [ ] Reviewed test flashcards in database
- [ ] Switched to full mode (`TEST_MODE: false`)
- [ ] Generated all flashcards (~30-45 min)
- [ ] Checked results with `check-flashcards.js`
- [ ] Verified all sections covered
- [ ] Ready for UI integration!

---

## 💡 Pro Tips

1. **Run overnight**: Full generation takes 30-45 min - start it before bed
2. **Check progress**: Open another terminal and run `check-flashcards.js` while generating
3. **Quality first**: Review the first 10-20 flashcards before full generation
4. **Adjust difficulty**: Edit `CONFIG.PRIORITY_ARTICLES` to emphasize certain articles
5. **More cards**: Change `FLASHCARDS_PER_SECTION: 4` to `5` for more coverage

---

## 🚀 Ready to Start?

Run these commands in order:

```bash
# 1. Verify everything is ready
node scripts/verify-setup.js

# 2. Generate test flashcards (5 sections)
node scripts/generate-flashcards.js

# 3. Check the results
node scripts/check-flashcards.js

# 4. If good, switch to full mode and run again
# (Edit TEST_MODE: false in generate-flashcards.js)
node scripts/generate-flashcards.js
```

**Let's build the best NBA agent study platform! 🏀💪**
