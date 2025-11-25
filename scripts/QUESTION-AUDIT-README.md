# Question Audit & Fix Scripts

## 🚨 Problem Identified

The NBA Draft Combine question has the wrong answer marked as correct. This needs to be fixed, and we need to check if other questions have the same issue.

## 📋 Available Scripts

### 1. **Quick Fix** (Recommended First Step)
```bash
node scripts/find-and-fix-all.js
```

**What it does:**
- ✅ Checks all questions for structural issues (invalid answer indices)
- ✅ Analyzes user performance data to find questions with >70% miss rate
- ✅ Automatically fixes the NBA Draft Combine question
- ✅ Shows top 10 most suspicious questions that need manual review

**Use this first!** It will fix the known issue and identify other potential problems.

---

### 2. **Comprehensive Audit**
```bash
node scripts/comprehensive-audit.js
```

**What it does:**
- Lists all questions with invalid answer indices
- Shows top 20 most commonly missed questions
- Helps identify patterns in wrong answers

---

### 3. **Fix Draft Combine (Specific)**
```bash
node scripts/fix-draft-combine-quick.js
```

**What it does:**
- Finds and fixes ONLY the NBA Draft Combine question
- Shows before/after comparison
- Simple, targeted fix

---

## 🎯 Recommended Process

**Step 1:** Run the comprehensive fix
```bash
cd /Users/jeremiahg/Desktop/agentprep
node scripts/find-and-fix-all.js
```

**Step 2:** Review the output
- Look at questions with high miss rates (>70%)
- Check if the marked answer makes sense
- Verify with your CBA knowledge

**Step 3:** Manual fixes (if needed)
If the script identifies questions that need review, you can fix them manually:

```javascript
// Example manual fix in Supabase SQL editor or Node script:
UPDATE questions 
SET correct_answer = 1  -- The correct index
WHERE id = 123;  -- The question ID
```

---

## 🔍 Understanding the Output

### High Miss Rate Questions
Questions where users get it wrong >70% of the time likely have incorrect answer keys.

Example output:
```
📝 Question ID 123 (85% miss rate, 20 attempts)
   What is the NBA Draft Combine?
   
   Options:
   ✓ [MARKED CORRECT] [0] A required workout for all draft prospects
     [1] An optional pre-draft event where players can showcase skills...
     [2] Only for international players
     [3] A post-draft training camp
```

In this case, option 1 is clearly correct, but option 0 is marked. The script will suggest this needs fixing.

---

## 🛠️ After Fixes

After running the scripts and making fixes:

1. **Clear user progress** (optional, if you want to reset data):
```sql
DELETE FROM user_progress WHERE question_id IN (123, 456, ...);
```

2. **Test the questions** in the app to verify fixes

3. **Monitor performance** - watch for questions that still have high miss rates

---

## ⚡ Quick Reference

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `find-and-fix-all.js` | Complete audit + auto-fix | **Start here!** |
| `comprehensive-audit.js` | Analysis only | For review/investigation |
| `fix-draft-combine-quick.js` | Single question fix | If you just want to fix one |

---

## 📝 Notes

- All scripts use your `.env.local` file for Supabase credentials
- Scripts are safe - they won't delete data, only update `correct_answer` field
- Always review suspicious questions manually before fixing
- The high miss rate threshold (70%) can be adjusted in the script

---

## 🐛 Troubleshooting

**Script won't run?**
```bash
# Make sure you're in the project directory
cd /Users/jeremiahg/Desktop/agentprep

# Check Node.js is installed
node --version

# Install dependencies if needed
npm install @supabase/supabase-js dotenv
```

**Can't connect to database?**
- Check your `.env.local` file has correct Supabase credentials
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set

---

## ✅ Success Checklist

After running the scripts, you should see:
- [x] NBA Draft Combine question fixed
- [x] No questions with invalid answer indices
- [x] List of high-miss-rate questions reviewed
- [x] All identified issues resolved
- [x] App tested and working correctly
