# 🔧 Quick Fix Guide - Database Setup

## ❌ Current Errors

1. **Scenarios Error:** Table doesn't exist yet
2. **useAuth Error:** Fixed! ✅ (exported from useStudyData.ts)

---

## ✅ Solution - Run Database Setup

### Step 1: Create All Tables

**Option A - In Supabase Dashboard:**

1. Go to your Supabase project: https://wxidxpqdbhlchqxlapdv.supabase.co
2. Click "SQL Editor" in left sidebar
3. Click "New Query"
4. Copy the entire contents of: `/scripts/setup-complete-database.sql`
5. Paste into SQL Editor
6. Click "Run" (or press Cmd/Ctrl + Enter)

**Option B - Using Script:**
```bash
# From your project root
cd /Users/jeremiahg/Desktop/agentprep
# You'll need to manually run the SQL in Supabase dashboard
```

---

## 📋 What Gets Created

This creates all 6 required tables:

1. ✅ **scenarios** - Practice scenarios (NEW!)
2. ✅ **questions** - Question bank
3. ✅ **user_progress** - User answer tracking
4. ✅ **test_results** - Test history
5. ✅ **user_notes** - User notes
6. ✅ **cba_content** - CBA text

**Plus:**
- Row Level Security (RLS) policies
- Indexes for performance
- Proper permissions

---

## 🎯 After Running SQL

### Test the Scenarios Section:

1. **Refresh your app** (Cmd/Ctrl + R)
2. **Go to Scenarios section** (`/scenarios`)
3. **You should see:** Empty state (no scenarios yet)
4. **No more errors!** ✅

---

## 📊 Import Scenario Data (Optional)

If you want to populate scenarios:

```bash
cd /Users/jeremiahg/Desktop/agentprep/scripts

# Run any of these to import scenarios:
node import-scenario-batch-1.js
node import-scenario-batch-2.js
# ... etc
```

---

## ✅ Verification

After running the SQL, check in Supabase:

1. Go to "Table Editor"
2. Look for these tables:
   - scenarios ✅
   - questions ✅
   - user_progress ✅
   - test_results ✅
   - user_notes ✅
   - cba_content ✅

---

## 🚀 Quick Summary

**What we fixed:**
1. ✅ Exported `useAuth` from `useStudyData.ts`
2. ✅ Created complete database setup SQL
3. ✅ Added better error handling for missing tables

**What you need to do:**
1. Run `/scripts/setup-complete-database.sql` in Supabase SQL Editor
2. Refresh your app
3. All errors should be gone!

---

## 🆘 If Still Having Issues

**Check these:**

1. **Supabase connection:**
   - Make sure `.env.local` has correct keys
   - Check Supabase dashboard is accessible

2. **Auth issues:**
   - If not logged in, some sections show "Please Log In"
   - This is expected behavior

3. **Empty data:**
   - Tables exist but empty = normal
   - Sections will show "No data yet" states
   - This is correct!

---

## 📝 Files Created

1. `/scripts/setup-complete-database.sql` - Complete DB setup
2. `/scripts/create-scenarios-table.sql` - Just scenarios table
3. This guide file

---

**Next Step:** Run the SQL, then test your app! 🎉
