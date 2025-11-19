# 🚀 SRS System - Quick Command Reference

## Database Commands

### Run the SRS Migration
```bash
# Copy SQL to clipboard
cat scripts/add-srs-system.sql | pbcopy

# Then paste in Supabase SQL Editor at:
# https://wxidxpqdbhlchqxlapdv.supabase.co
```

### Verify Migration Success
```bash
# Run test script
node scripts/test-srs-system.js
```

---

## File Operations

### Backup Original Hooks (Safety First!)
```bash
cp lib/hooks/useStudyData.ts lib/hooks/useStudyData-backup-$(date +%Y%m%d).ts
```

### Install SRS Hooks
```bash
cp lib/hooks/useStudyData-with-srs.ts lib/hooks/useStudyData.ts
```

### Restore Original (If Needed)
```bash
cp lib/hooks/useStudyData-backup-YYYYMMDD.ts lib/hooks/useStudyData.ts
```

---

## Development

### Start Dev Server
```bash
npm run dev
```

### Watch Console for SRS Updates
Look for these messages:
- ✅ "Updating progress with SRS for: {...}"
- ✅ "Successfully updated with SRS"
- ❌ "Error updating question progress: ..."

### Check TypeScript Compilation
```bash
npx tsc --noEmit
```

---

## Testing Commands

### Test Question Progress Update
```javascript
// In browser console after answering a question:
// Check Network tab → Filter by "user_progress"
// Should see UPDATE with SRS fields
```

### Manual SRS Calculation Test
```javascript
// In browser console:
import { calculateNextReview, PerformanceRating } from '@/lib/srs-algorithm';

const initialState = {
  easeFactor: 2.50,
  intervalDays: 1,
  consecutiveCorrect: 0,
  nextReviewDate: new Date(),
  lastReviewDate: new Date(),
  masteryLevel: 'new'
};

const result = calculateNextReview(initialState, PerformanceRating.GOOD);
console.log(result);
```

### Query Database Directly
```sql
-- Check SRS columns exist
SELECT 
  next_review_date,
  ease_factor,
  interval_days,
  consecutive_correct,
  mastery_level
FROM user_progress
LIMIT 5;

-- Count items by mastery level
SELECT 
  mastery_level,
  COUNT(*) as count
FROM user_progress
GROUP BY mastery_level;

-- Find items due now
SELECT 
  COUNT(*) as due_now
FROM user_progress
WHERE next_review_date <= NOW();

-- Average ease factor
SELECT 
  AVG(ease_factor) as avg_ease,
  AVG(interval_days) as avg_interval
FROM user_progress
WHERE ease_factor IS NOT NULL;
```

---

## Debugging

### Check Database Logs
1. Go to Supabase Dashboard
2. Navigate to Logs → Database
3. Look for errors related to user_progress or flashcard_progress

### View Network Requests
```javascript
// In browser DevTools → Network tab
// Filter by: "supabase"
// Look for POST/PATCH requests to user_progress
// Check request payload has SRS fields
```

### Enable Verbose Logging
```javascript
// Add to top of useStudyData.ts
const DEBUG = true;

// Then add logging before database calls:
if (DEBUG) console.log('SRS Update:', updateData);
```

---

## Deployment

### Pre-Deploy Checklist
```bash
# 1. Run tests
node scripts/test-srs-system.js

# 2. Check TypeScript
npx tsc --noEmit

# 3. Build production
npm run build

# 4. Check build output
# Should see no SRS-related errors
```

### Deploy to Vercel
```bash
# If using Vercel CLI
vercel --prod

# Or push to GitHub (auto-deploys)
git add .
git commit -m "feat: Add spaced repetition system (SRS)"
git push origin main
```

### Post-Deploy Verification
```bash
# 1. Check production site works
# 2. Answer a question in Study Mode
# 3. Verify database updated with SRS data
# 4. Check dashboard shows "Due for Review" widget
```

---

## Maintenance

### Check SRS Performance
```sql
-- Daily review load
SELECT 
  DATE(next_review_date) as review_date,
  COUNT(*) as items_due
FROM user_progress
WHERE next_review_date BETWEEN NOW() AND NOW() + INTERVAL '7 days'
GROUP BY DATE(next_review_date)
ORDER BY review_date;

-- User engagement
SELECT 
  user_id,
  COUNT(*) as total_items,
  COUNT(CASE WHEN next_review_date <= NOW() THEN 1 END) as due_now,
  AVG(ease_factor) as avg_ease,
  AVG(interval_days) as avg_interval
FROM user_progress
GROUP BY user_id;
```

### Reset a User's SRS Data (If Needed)
```sql
-- Careful! This resets all progress for a user
UPDATE user_progress
SET 
  next_review_date = NOW(),
  ease_factor = 2.50,
  interval_days = 1,
  consecutive_correct = 0,
  mastery_level = 'new'
WHERE user_id = 'USER_ID_HERE';
```

### Bulk Update Configuration
```sql
-- Change max interval for all users
UPDATE user_progress
SET interval_days = LEAST(interval_days, 60)
WHERE interval_days > 60;
```

---

## Monitoring Queries

### Daily Stats Dashboard
```sql
SELECT 
  COUNT(*) FILTER (WHERE next_review_date <= NOW()) as due_now,
  COUNT(*) FILTER (WHERE next_review_date <= NOW() + INTERVAL '1 day') as due_tomorrow,
  COUNT(*) FILTER (WHERE mastery_level = 'mastered') as mastered,
  ROUND(AVG(ease_factor), 2) as avg_ease,
  ROUND(AVG(interval_days), 1) as avg_interval
FROM user_progress;
```

### User Retention Metrics
```sql
SELECT 
  user_id,
  COUNT(*) as questions_attempted,
  COUNT(*) FILTER (WHERE correct_count > incorrect_count) as success_rate,
  MAX(last_attempted) as last_active,
  EXTRACT(days FROM NOW() - MAX(last_attempted)) as days_since_active
FROM user_progress
GROUP BY user_id
ORDER BY last_active DESC;
```

---

## Common Issues & Solutions

### Issue: "Column does not exist"
```bash
# Solution: Run database migration
# Copy contents of scripts/add-srs-system.sql
# Paste in Supabase SQL Editor
```

### Issue: All items showing as due
```bash
# Solution: Initialize next_review_date
# Run this SQL:
UPDATE user_progress
SET next_review_date = NOW() + INTERVAL '1 day'
WHERE next_review_date IS NULL;
```

### Issue: TypeScript errors
```bash
# Solution: Make sure algorithm file is imported
# Check imports in useStudyData.ts:
import { calculateNextReview, ... } from '@/lib/srs-algorithm';
```

### Issue: Dashboard widget not showing
```bash
# 1. Check import in dashboard page
# 2. Verify useSRSStats hook working
# 3. Check browser console for errors
# 4. Verify user is authenticated
```

---

## Useful SQL Snippets

### Find Items Overdue
```sql
SELECT 
  q.question,
  up.next_review_date,
  EXTRACT(EPOCH FROM (NOW() - up.next_review_date)) / 3600 as hours_overdue
FROM user_progress up
JOIN questions q ON up.question_id = q.id
WHERE up.next_review_date < NOW()
ORDER BY hours_overdue DESC
LIMIT 20;
```

### Mastery Progression Over Time
```sql
SELECT 
  DATE(last_attempted) as date,
  COUNT(*) FILTER (WHERE mastery_level = 'mastered') as mastered,
  COUNT(*) FILTER (WHERE mastery_level = 'reviewing') as reviewing,
  COUNT(*) FILTER (WHERE mastery_level = 'learning') as learning,
  COUNT(*) FILTER (WHERE mastery_level = 'new') as new
FROM user_progress
WHERE last_attempted >= NOW() - INTERVAL '30 days'
GROUP BY DATE(last_attempted)
ORDER BY date;
```

### Performance by Article
```sql
SELECT 
  q.article,
  COUNT(*) as total_attempts,
  AVG(up.ease_factor) as avg_ease,
  AVG(up.interval_days) as avg_interval,
  COUNT(*) FILTER (WHERE up.mastery_level = 'mastered') as mastered_count
FROM user_progress up
JOIN questions q ON up.question_id = q.id
GROUP BY q.article
ORDER BY avg_ease DESC;
```

---

## Quick Links

- **Supabase Dashboard:** https://wxidxpqdbhlchqxlapdv.supabase.co
- **SQL Editor:** https://wxidxpqdbhlchqxlapdv.supabase.co/project/wxidxpqdbhlchqxlapdv/sql
- **Table Editor:** https://wxidxpqdbhlchqxlapdv.supabase.co/project/wxidxpqdbhlchqxlapdv/editor

---

## File Reference

```
agentprep/
├── scripts/
│   ├── add-srs-system.sql          # Database migration ⭐
│   └── test-srs-system.js          # Verification tests
├── lib/
│   ├── srs-algorithm.ts            # Core SRS logic ⭐
│   └── hooks/
│       ├── useStudyData.ts         # Replace this ⭐
│       └── useStudyData-with-srs.ts # With this ⭐
├── components/
│   └── dashboard/
│       └── DueForReviewWidget.tsx  # Dashboard widget ⭐
└── docs/
    ├── SRS-IMPLEMENTATION-GUIDE.md     # Step-by-step guide
    ├── SRS-SYSTEM-SUMMARY.md           # Overview
    ├── SRS-CONFIGURATION-REFERENCE.md  # Tuning guide
    └── SRS-QUICK-REFERENCE.md          # This file
```

---

## Support Checklist

Before asking for help:
- [ ] Ran database migration
- [ ] Checked browser console for errors
- [ ] Verified Supabase logs
- [ ] Tested with test script
- [ ] Checked file locations
- [ ] Restarted dev server

---

**You're all set! 🚀**

This reference card has everything you need for daily SRS operations. Bookmark it!
