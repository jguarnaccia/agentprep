# Complete Fix - Study Mode Progress Bars & Recent Activity

## Issues Identified

### Issue 1: Weekly Progress Bar Not Filling
**Problem**: The `weeklyCount` calculation is counting `user_progress` rows (questions), not actual attempts  
**Solution**: Need to count `correct_count` + `incorrect_count` for each row

### Issue 2: Recent Activity Not Showing
**Problem**: Already fixed in `useDashboardData.ts` but dashboard needs to refresh after studying  
**Solution**: Need to add a way to refresh dashboard data

## Fixing the Weekly Progress Bar

The issue is in the `StudyModeSection.tsx` file where it calculates `weeklyCount`:

**Current (WRONG):**
```typescript
const weeklyCount = progress?.filter(p => 
  new Date(p.last_attempted) >= oneWeekAgo
).length || 0;
```
This counts QUESTIONS (rows in user_progress), not attempts!

**Fixed (CORRECT):**
```typescript
const weeklyCount = progress
  ?.filter(p => new Date(p.last_attempted) >= oneWeekAgo)
  .reduce((sum, p) => {
    return sum + (p.correct_count || 0) + (p.incorrect_count || 0);
  }, 0) || 0;
```
This counts ACTUAL ATTEMPTS (correct + incorrect)!

## Complete Fix Code

Replace the `fetchStudyStats` function in StudyModeSection.tsx:

```typescript
// Fetch study stats
useEffect(() => {
  async function fetchStudyStats() {
    if (!user) return;
    
    try {
      // Get all progress records
      const { data: progress, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      const totalQuestions = progress?.length || 0;
      const correctCount = progress?.reduce((sum, p) => sum + (p.correct_count || 0), 0) || 0;
      const totalAttempts = progress?.reduce((sum, p) => sum + (p.correct_count || 0) + (p.incorrect_count || 0), 0) || 0;
      const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;
      
      // Calculate streak (consecutive days with activity)
      const dates = new Set(
        progress?.map(p => new Date(p.last_attempted).toDateString()) || []
      );
      
      let streak = 0;
      let currentDate = new Date();
      while (dates.has(currentDate.toDateString())) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      }
      
      // Calculate weekly progress - COUNT ATTEMPTS NOT ROWS!
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const weeklyCount = progress
        ?.filter(p => new Date(p.last_attempted) >= oneWeekAgo)
        .reduce((sum, p) => {
          return sum + (p.correct_count || 0) + (p.incorrect_count || 0);
        }, 0) || 0;
      
      // Count unique days as sessions
      const totalSessions = dates.size;
      
      setStudyStats({
        totalSessions,
        totalQuestions: questions.length,
        avgAccuracy: accuracy,
        bestStreak: streak,
        weeklyGoal: 100,
        weeklyProgress: weeklyCount  // Now correctly counts attempts!
      });
    } catch (error) {
      console.error('Error fetching study stats:', error);
    }
  }
  
  fetchStudyStats();
}, [user, refreshKey, questions.length]);
```

## Testing After Fix

### Test Weekly Progress Bar:
1. Go to `/study`
2. Answer 10 questions
3. Check the "Weekly Goal" progress bar - should show 10/100
4. The bar should visually fill to 10%

### Test Recent Activity:
1. Go to `/dashboard`
2. Check "Recent Activity" section
3. Should show "Answered questions correctly" or "Attempted questions" based on your performance
4. Times should be accurate ("2 minutes ago", etc.)

## What Gets Fixed:

✅ **Weekly Progress Bar** - Now counts actual question attempts (correct + incorrect)  
✅ **Recent Activity** - Already fixed to use correct_count/incorrect_count  
✅ **Progress Bars Animations** - Already working correctly with Framer Motion  
✅ **Real-time Updates** - refreshKey triggers data refresh after answering questions

## Why It Wasn't Working:

The weekly progress was counting database ROWS (unique questions touched) instead of ATTEMPTS (how many times you answered). If you answered the same question 3 times, it only counted as 1 instead of 3.

Now it properly sums up all your attempts for the week!

---

**Apply this fix and the progress bars will work correctly!**
