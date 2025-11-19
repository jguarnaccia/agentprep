# 🧪 Smart Algorithm Testing Guide

## Quick Test Plan for Jeremiah

### 🎯 **5-Minute Verification Test**

#### **Step 1: Start Development Server**
```bash
cd /Users/jeremiahg/Desktop/agentprep
npm run dev
```

#### **Step 2: Navigate to Study Mode**
- Open browser: `http://localhost:3000/study`
- Login with your account

#### **Step 3: Check Landing Page**
Look for these NEW elements:

✅ **Hero Section Stats:**
- "Priority Questions" count (should show a number)
- "New Material" count (should show # never attempted)
- "Needs Review" count (should show # previously incorrect)

✅ **Focus Areas Card:**
- Should show your actual weak topics
- Each with real accuracy percentage
- OR "No weak areas identified yet" if you're doing well

✅ **Smart Study Recommendation:**
- Should mention your weakest topic by name
- OR mention new questions if no weak topics
- OR congratulate you if doing well

✅ **Start Button:**
- Should say "Begin Smart Study Session (X priority questions)"
- Not just "Begin Study Session"

#### **Step 4: Start a Session**
Click "Begin Smart Study Session"

✅ **First Question:**
- Should be one you haven't seen (if you have new questions)
- OR one you got wrong recently
- OR from a weak topic

✅ **Answer a Few Questions:**
- Answer 3-5 questions correctly and incorrectly
- Mix it up to create varied progress

✅ **Return to Landing Page:**
- Go back to `/study` main page
- Stats should update immediately
- Weak topics should reflect your recent performance

---

## 🔍 **Detailed Testing Scenarios**

### **Scenario A: Brand New User (Never Studied)**

**Expected Behavior:**
1. "New Material" = Total questions (814)
2. "Needs Review" = 0
3. "Priority Questions" = High number (most questions)
4. No weak topics shown yet
5. Recommendation: "You have X new questions ready to explore!"
6. First question in session: Random new question

**How to Test:**
- Create a new test account
- Go to Study Mode
- Verify all stats match expectations

---

### **Scenario B: User with Some Progress**

**Expected Behavior:**
1. "New Material" = Questions never attempted
2. "Needs Review" = Questions with more incorrect than correct
3. "Priority Questions" = Mix of new + needs review + weak topics
4. "Focus Areas" shows topics with < 70% accuracy
5. Recommendation mentions weakest topic
6. First question: From weak topic OR never seen

**How to Test:**
- Use your main account (with some progress)
- Verify stats reflect your actual history
- Check that weak topics match your performance

---

### **Scenario C: Advanced User (Most Questions Mastered)**

**Expected Behavior:**
1. "New Material" = Small number
2. "Needs Review" = Only truly difficult questions
3. "Priority Questions" = Smaller number
4. Few or no weak topics
5. Recommendation: Congratulatory message
6. First question: Challenging or new material

**How to Test:**
- Answer many questions correctly
- Return to landing page
- Should see fewer priority questions

---

## 🐛 **Common Issues to Check**

### **Issue 1: Stats Show "-" or 0 for Everything**
**Possible Causes:**
- User not logged in
- Database connection issue
- No questions in database

**Fix:**
- Verify you're logged in
- Check Supabase connection
- Verify questions table has data

---

### **Issue 2: "Focus Areas" Shows "Loading..." Forever**
**Possible Causes:**
- API error
- User ID not passing correctly

**Fix:**
- Check browser console for errors
- Verify `user?.id` is defined
- Check Supabase permissions

---

### **Issue 3: Questions Not Sorted by Priority**
**Possible Causes:**
- Algorithm not calculating scores
- Sort not working

**Fix:**
- Check console for `calculateQuestionPriority` errors
- Verify `user_progress` table structure
- Check that `question_id` is TEXT type

---

## 📊 **Visual Inspection Checklist**

### **Landing Page:**
- [ ] Hero section has 3 stats (not "Today's Goal", "Current Streak", "Avg Accuracy")
- [ ] Stats show actual numbers (not hardcoded)
- [ ] "Focus Areas" card shows real topics with percentages
- [ ] Study recommendation is personalized (not generic)
- [ ] Button says "Smart Study Session"

### **During Session:**
- [ ] Questions appear one at a time
- [ ] Progress tracking works (correct/incorrect counts)
- [ ] Can finish full session
- [ ] Stats update after session

### **After Session:**
- [ ] Return to `/study` shows updated stats
- [ ] "Needs Review" increases if answered wrong
- [ ] "New Material" decreases as questions attempted
- [ ] Weak topics reflect recent performance

---

## 🎯 **Success Indicators**

You'll know it's working when:

1. ✅ Stats on landing page are **dynamic and real**
2. ✅ "Focus Areas" shows **your actual weak topics**
3. ✅ Recommendation is **personalized to your data**
4. ✅ Questions in session feel **relevant and challenging**
5. ✅ Stats **update immediately** after studying
6. ✅ No console errors in browser DevTools

---

## 🚨 **If Something Breaks**

### **Quick Debug Steps:**

1. **Open Browser Console** (F12 or Cmd+Option+I)
   - Look for red error messages
   - Check network tab for failed requests

2. **Check Supabase Connection**
   - Go to: `https://app.supabase.com`
   - Verify `user_progress` table exists
   - Check that `question_id` is TEXT type

3. **Verify User Authentication**
   - Make sure you're logged in
   - Try logging out and back in

4. **Check File Changes**
   - Verify `/lib/hooks/useStudyData.ts` was updated
   - Verify `/components/study-sections/StudyModeSection.tsx` was updated

---

## 📱 **Mobile Testing** (Optional)

If testing on mobile:
- [ ] Stats cards stack vertically (3 columns → 1 column)
- [ ] "Focus Areas" card is readable
- [ ] Recommendation text wraps nicely
- [ ] All buttons are tappable

---

## 💪 **Expected User Experience**

### **What Users Will Notice:**

1. **Immediate Relevance**
   - "Wow, these questions are exactly what I need to practice!"
   - No more wasting time on easy/mastered questions

2. **Clear Focus**
   - "I can see exactly where I'm struggling"
   - Weak topics displayed with percentages

3. **Personalized Guidance**
   - Recommendations based on actual performance
   - Not generic advice

4. **Progress Visibility**
   - See priority question count decrease
   - Watch weak topics improve

5. **Confidence Boost**
   - "The platform knows what I need to study"
   - Feels intelligent and adaptive

---

## 🎊 **Testing Complete When:**

- [x] All visual elements present
- [x] Stats show real data
- [x] Questions prioritized correctly
- [x] No console errors
- [x] Sessions complete successfully
- [x] Progress updates after studying

---

## 🚀 **Next Steps After Testing:**

1. ✅ If everything works → Deploy to production!
2. 🐛 If issues found → Report them with screenshots/errors
3. 💡 If want enhancements → Prioritize for next sprint

---

**Good luck with testing! This is going to be AMAZING! 🔥**
