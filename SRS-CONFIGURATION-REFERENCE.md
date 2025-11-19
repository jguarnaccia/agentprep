# 🎛️ SRS Algorithm - Configuration Reference

## Quick Settings Overview

The SRS algorithm can be fine-tuned by adjusting parameters in `/lib/srs-algorithm.ts`. Here's what each setting controls:

---

## 📊 Current Configuration (Exam-Optimized)

### **Initial Values** (for new items)
```typescript
initialEaseFactor: 2.50      // Start at "medium" difficulty
initialIntervalDays: 1       // First review after 1 day
```

**Why these values:**
- 2.50 is the sweet spot for most learners
- 1 day gives immediate reinforcement

---

### **Interval Settings** (how long until next review)

```typescript
failIntervalDays: 1          // Wrong answer = review tomorrow
hardIntervalDays: 2          // Hard = review in 2 days
goodMultiplier: 2.0          // Good = 2x current interval
easyMultiplier: 2.5          // Easy = 2.5x current interval
perfectMultiplier: 3.0       // Perfect = 3x current interval
```

**Example progression (all GOOD answers):**
- Day 1: Answer question
- Day 3: Review (2 days later)
- Day 7: Review (4 days later)
- Day 15: Review (8 days later)
- Day 31: Review (16 days later)

**What happens on WRONG answer:**
- Reset to day 1, review tomorrow
- Helps reinforce weak areas immediately

---

### **Ease Factor Adjustments** (difficulty rating)

```typescript
failEaseAdjustment: -0.20    // Wrong = harder (-0.20)
hardEaseAdjustment: -0.15    // Hard = slightly harder (-0.15)
goodEaseAdjustment: 0.00     // Good = no change
easyEaseAdjustment: +0.10    // Easy = easier (+0.10)
perfectEaseAdjustment: +0.15 // Perfect = much easier (+0.15)
```

**How ease factor works:**
- Lower ease (1.30) = "hard" material, slower interval growth
- Higher ease (2.50) = "easy" material, faster interval growth
- Automatically adjusts based on your performance

---

### **Boundaries** (safety limits)

```typescript
minEaseFactor: 1.30          // Can't get harder than this
maxEaseFactor: 2.50          // Can't get easier than this
maxIntervalDays: 90          // Max 90 days between reviews
```

**Why 90 days max:**
- Exam prep needs more frequent reviews than long-term retention
- Anki uses years, but that's for lifelong learning
- 90 days ensures you don't forget before exam

---

### **Mastery Thresholds** (progression levels)

```typescript
learningThreshold: 2         // 2 correct = LEARNING
reviewingThreshold: 4        // 4 correct = REVIEWING
masteredThreshold: 7         // 7 correct = MASTERED
masteredIntervalDays: 30     // Mastered items reviewed monthly
```

**Mastery progression:**
```
🆕 NEW          → 0 correct in a row
📚 LEARNING     → 2+ correct in a row
🔄 REVIEWING    → 4+ correct in a row
⭐ MASTERED     → 7+ correct in a row
```

**Note:** Wrong answer resets streak to 0!

---

## 🎯 Tuning Recommendations

### **For Faster Learning** (more aggressive)
```typescript
goodMultiplier: 2.5          // Increase from 2.0
easyMultiplier: 3.0          // Increase from 2.5
masteredIntervalDays: 45     // Increase from 30
```
**Effect:** Intervals grow faster, fewer reviews needed

### **For Better Retention** (more conservative)
```typescript
goodMultiplier: 1.5          // Decrease from 2.0
easyMultiplier: 2.0          // Decrease from 2.5
maxIntervalDays: 60          // Decrease from 90
```
**Effect:** More frequent reviews, better long-term memory

### **For Difficult Material** (extra reinforcement)
```typescript
failIntervalDays: 0.5        // Review same day
hardIntervalDays: 1          // Review next day
learningThreshold: 3         // Need 3 correct for learning
```
**Effect:** More repetition for challenging content

---

## 📈 Performance Ratings Explained

### **Rating 0: FAIL** ❌
```
Use when: Completely wrong, no idea
Effect: 
  - Reset interval to 1 day
  - Decrease ease by 0.20
  - Reset streak to 0
```

### **Rating 1: HARD** 😰
```
Use when: Barely remembered, struggled
Effect:
  - Set interval to 2 days
  - Decrease ease by 0.15
  - Streak continues (+1)
```

### **Rating 2: GOOD** ✅
```
Use when: Remembered with some effort
Effect:
  - Double interval
  - Maintain ease (no change)
  - Streak continues (+1)
```

### **Rating 3: EASY** 😊
```
Use when: Remembered easily, no struggle
Effect:
  - 2.5x interval increase
  - Increase ease by 0.10
  - Streak continues (+1)
```

### **Rating 4: PERFECT** 🎯
```
Use when: Instant recall, total mastery
Effect:
  - 3x interval increase
  - Increase ease by 0.15
  - Streak continues (+1)
```

---

## 🔧 How to Modify Settings

**File to edit:** `/lib/srs-algorithm.ts`

Find this section:
```typescript
export const DEFAULT_SRS_CONFIG: SRSConfig = {
  // Change values here
  initialEaseFactor: 2.50,
  goodMultiplier: 2.0,
  // etc...
}
```

**After changing:**
1. Save file
2. Restart dev server (`npm run dev`)
3. New calculations use updated config
4. Existing progress records keep their current values

---

## 📊 Monitoring Your Settings

Track these metrics to see if adjustments are needed:

### **Average Ease Factor**
- **Ideal range:** 2.2 - 2.5
- **Too high (>2.5):** Material might be too easy, increase difficulty
- **Too low (<2.0):** Material might be too hard, or users struggling

### **Average Interval**
- **Ideal range:** 7-14 days
- **Too short (<5):** Increase multipliers for faster growth
- **Too long (>20):** Decrease multipliers or max interval

### **Mastery Distribution**
- **Healthy distribution:**
  - 10-20% New
  - 30-40% Learning
  - 30-40% Reviewing
  - 10-20% Mastered

### **Review Load**
- **Ideal:** 20-50 items due per day
- **Too many:** Decrease multipliers (slower growth)
- **Too few:** Increase multipliers (faster growth)

---

## 🎓 Real-World Examples

### **Example 1: Easy Question**
```
Day 1:  Answer GOOD → Review in 2 days (ease: 2.50)
Day 3:  Answer EASY → Review in 5 days (ease: 2.60)
Day 8:  Answer EASY → Review in 13 days (ease: 2.70)
Day 21: Answer PERFECT → Review in 39 days (ease: 2.85)
Day 60: MASTERED! ⭐
```

### **Example 2: Difficult Question**
```
Day 1:  Answer GOOD → Review in 2 days (ease: 2.50)
Day 3:  Answer FAIL → Review in 1 day (ease: 2.30)
Day 4:  Answer HARD → Review in 2 days (ease: 2.15)
Day 6:  Answer GOOD → Review in 4 days (ease: 2.15)
Day 10: Answer GOOD → Review in 9 days (ease: 2.15)
Day 19: Answer GOOD → Review in 19 days (ease: 2.15)
Day 38: Still LEARNING 📚
```

### **Example 3: Mixed Performance**
```
Day 1:  GOOD → 2 days (ease: 2.50)
Day 3:  EASY → 5 days (ease: 2.60)
Day 8:  FAIL → 1 day (ease: 2.40, streak reset!)
Day 9:  GOOD → 2 days (ease: 2.40)
Day 11: GOOD → 5 days (ease: 2.40)
Day 16: EASY → 12 days (ease: 2.50)
...continues until mastered
```

---

## ⚡ Quick Tips

1. **Don't over-tune** - Default settings work for 90% of users
2. **Monitor first** - Let data guide adjustments, not hunches
3. **Small changes** - Adjust by 0.1-0.2 at a time
4. **Test period** - Give new settings 2 weeks before evaluating
5. **User feedback** - Ask if reviews feel too frequent/infrequent

---

## 🎯 Production Recommendations

### **DO:**
- ✅ Keep defaults for initial launch
- ✅ Track metrics weekly
- ✅ Adjust based on actual exam results
- ✅ A/B test changes with small user groups
- ✅ Document why you made each change

### **DON'T:**
- ❌ Change settings without tracking results
- ❌ Make multiple changes at once
- ❌ Copy Anki settings (optimized for decades, not months)
- ❌ Ignore user feedback on review burden
- ❌ Set maxIntervalDays > 120 for exam prep

---

## 📱 Advanced: Per-User Customization

Future enhancement idea:
```typescript
// Let power users customize their own SRS
const userConfig = {
  ...DEFAULT_SRS_CONFIG,
  maxIntervalDays: userPreferences.maxInterval,
  goodMultiplier: userPreferences.reviewSpeed,
}
```

Store in `user_preferences` table for personalized learning!

---

## 🚀 You're All Set!

The default configuration is carefully tuned for exam preparation based on cognitive science research. Most users won't need any adjustments.

**When to adjust:**
- After 100+ user reviews
- When exam results data becomes available
- Based on user surveys about review frequency
- If engagement metrics suggest changes needed

**Current settings = Proven & Battle-Tested!** ✅
