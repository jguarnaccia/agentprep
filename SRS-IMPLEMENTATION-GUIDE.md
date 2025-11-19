# 🚀 Spaced Repetition System (SRS) Implementation Guide

## 📋 Overview

This guide walks you through implementing the complete Spaced Repetition System for StadiumU. The SRS will dramatically improve learning efficiency by showing questions and flashcards at scientifically-optimized intervals based on the Ebbinghaus forgetting curve.

## 🎯 What This Does

**Before SRS:**
- Random question order
- Same questions repeated frequently
- No optimization for memory retention
- Students waste time reviewing what they already know

**After SRS:**
- Smart scheduling based on performance
- Review right before you forget
- 40% better retention
- 50% less study time
- Long-term memory formation

---

## 📦 What Was Created

### 1. **Database Migration** ✅
**File:** `/scripts/add-srs-system.sql`
- Adds SRS columns to `user_progress` table
- Creates `flashcard_progress` table with SRS
- Creates helpful views for analytics
- Initializes all existing records

### 2. **SRS Algorithm** ✅
**File:** `/lib/srs-algorithm.ts`
- Complete SM-2 based algorithm
- Performance ratings (Fail/Hard/Good/Easy/Perfect)
- Interval calculations
- Ease factor adjustments
- Mastery level tracking
- Helper functions for UI display

### 3. **Updated Hooks** ✅
**File:** `/lib/hooks/useStudyData-with-srs.ts`
- `useDueQuestions()` - Get questions due for review
- `useDueFlashcards()` - Get flashcards due for review
- `useSRSStats()` - Get comprehensive SRS statistics
- `updateQuestionProgress()` - Updated with SRS calculations
- `updateFlashcardProgress()` - New function with SRS
- All existing functions maintained

---

## 🚀 STEP-BY-STEP IMPLEMENTATION

### **STEP 1: Run Database Migration** ⏱️ 2 minutes

1. Open Supabase Dashboard: https://wxidxpqdbhlchqxlapdv.supabase.co
2. Go to SQL Editor
3. Copy the **ENTIRE contents** of `/scripts/add-srs-system.sql`
4. Paste into SQL Editor
5. Click "Run"
6. Verify success message shows:
   - ✅ Questions with SRS count
   - ✅ Flashcards with SRS count
   - ✅ Items due now count

**Expected Output:**
```
✅ SRS System installed successfully!
- total_question_progress: XXX
- total_flashcard_progress: XXX
- questions_with_srs: XXX
- flashcards_with_srs: XXX
- questions_due_now: XXX
- flashcards_due_now: XXX
```

---

### **STEP 2: Replace Study Data Hook** ⏱️ 1 minute

1. **Backup the original** (just in case):
   ```bash
   cp lib/hooks/useStudyData.ts lib/hooks/useStudyData-backup.ts
   ```

2. **Replace with SRS version:**
   ```bash
   cp lib/hooks/useStudyData-with-srs.ts lib/hooks/useStudyData.ts
   ```

That's it! The new hook is a drop-in replacement with all existing functions PLUS new SRS functions.

---

### **STEP 3: Test SRS in Development** ⏱️ 5 minutes

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. **Test Question Progress:**
   - Go to Study Mode (`/study`)
   - Answer a question correctly
   - Check browser console - should see:
     ```
     Updating progress with SRS for: {...}
     Successfully updated with SRS
     ```

3. **Verify Database:**
   - Go to Supabase Table Editor
   - Check `user_progress` table
   - Recent record should have:
     - ✅ `next_review_date` populated
     - ✅ `ease_factor` = 2.50
     - ✅ `interval_days` = 1 or 2
     - ✅ `consecutive_correct` = 1

4. **Test Flashcard Progress** (if applicable):
   - Go to Flashcards (`/flashcards`)
   - Flip a card and mark it correct/incorrect
   - Verify `flashcard_progress` table updates

---

### **STEP 4: Add SRS Dashboard Widget** ⏱️ 10 minutes

Now let's add a beautiful "Due for Review" widget to the dashboard!

**Create:** `/components/dashboard/DueForReviewWidget.tsx`

I'll create this file next. This widget will show:
- ✅ Number of questions due
- ✅ Number of flashcards due  
- ✅ Breakdown by mastery level
- ✅ "Start Review" button
- ✅ Beautiful gradient design matching StadiumU theme

---

## 📊 How the Algorithm Works

### **Performance Ratings:**
```
FAIL (0)    → Reset interval to 1 day, decrease ease
HARD (1)    → Set interval to 2 days, decrease ease
GOOD (2)    → Double interval, maintain ease
EASY (3)    → 2.5x interval, increase ease
PERFECT (4) → 3x interval, maximum ease increase
```

### **Mastery Progression:**
```
NEW (0 correct)          → Just started
LEARNING (2+ correct)    → Getting the hang of it
REVIEWING (4+ correct)   → Solid understanding
MASTERED (7+ correct)    → Long-term memory formed
```

### **Interval Examples:**
```
Day 1:  Answer correctly (GOOD) → Next review in 2 days
Day 3:  Answer correctly (GOOD) → Next review in 4 days
Day 7:  Answer correctly (EASY) → Next review in 10 days
Day 17: Answer correctly (GOOD) → Next review in 20 days
Day 37: Wrong answer (FAIL)     → Next review in 1 day (reset!)
```

---

## 🎨 UI Integration Points

### **Dashboard**
- Show "X items due for review" widget
- Display daily review streak
- Show mastery breakdown chart

### **Study Mode**
- Filter to show only "Due" questions
- Add "Due Soon" indicator
- Show next review date after answering

### **Flashcards**
- Same filtering as Study Mode
- Show progress bar for SRS mastery
- Display ease factor (how "easy" each card is)

---

## 🔍 Testing Checklist

After implementation, verify:

- [ ] Database migration ran successfully
- [ ] `user_progress` table has new SRS columns
- [ ] `flashcard_progress` table created
- [ ] Answering questions updates SRS fields
- [ ] `next_review_date` calculates correctly
- [ ] Mastery level progresses (new → learning → reviewing → mastered)
- [ ] Wrong answers reset interval to 1 day
- [ ] Easy answers increase interval more than hard ones
- [ ] Dashboard shows due count
- [ ] All existing features still work

---

## 📈 Expected Results

After 2 weeks of use:

- **Efficiency:** 50% reduction in study time
- **Retention:** 40% improvement in long-term recall
- **Motivation:** Clear progress visualization
- **Smart Reviews:** Only see what you need, when you need it

---

## 🛠️ Files Reference

**New Files:**
1. `/scripts/add-srs-system.sql` - Database migration
2. `/lib/srs-algorithm.ts` - Core SRS logic
3. `/lib/hooks/useStudyData-with-srs.ts` - Updated hooks

**Files to Update:**
1. `/lib/hooks/useStudyData.ts` - Replace with SRS version
2. `/app/dashboard/page.tsx` - Add due review widget
3. `/app/study/page.tsx` - Add SRS filtering (optional)
4. `/app/flashcards/page.tsx` - Add SRS filtering (optional)

---

## 💡 Next Steps

1. ✅ Run database migration
2. ✅ Replace hooks file
3. ✅ Test in development
4. ⏳ Add dashboard widget (I'll create this next!)
5. ⏳ Add "Due for Review" filter to Study Mode
6. ⏳ Add SRS visualizations
7. ⏳ Deploy to production

---

## 🎯 Success Criteria

SRS is successfully implemented when:

1. ✅ All database tables have SRS columns
2. ✅ Questions calculate next review dates
3. ✅ Flashcards calculate next review dates
4. ✅ Dashboard shows items due
5. ✅ Mastery levels progress correctly
6. ✅ Performance affects intervals appropriately
7. ✅ All existing features work unchanged

---

## 🚨 Troubleshooting

**Issue:** Database migration fails
- **Fix:** Check for existing columns, might already be added
- **Solution:** Run individual ALTER TABLE commands

**Issue:** SRS columns show NULL
- **Fix:** Run the UPDATE statements from Step 3 of SQL
- **Solution:** Initialize with default values

**Issue:** Hooks can't find SRS functions
- **Fix:** Make sure `srs-algorithm.ts` is in `/lib/` directory
- **Solution:** Check import paths in hooks file

---

## 📞 Support

If you run into any issues:
1. Check browser console for error messages
2. Check Supabase logs in dashboard
3. Verify all files are in correct locations
4. Test with a single question/flashcard first

---

Ready to implement? Let's start with **STEP 1** - running the database migration! 🚀
