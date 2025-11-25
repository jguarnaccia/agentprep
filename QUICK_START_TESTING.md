# 🚀 QUICK START - Smart Algorithm Testing

## ⚡ 3 Commands to Test

```bash
# 1. Go to project directory
cd /Users/jeremiahg/Desktop/agentprep

# 2. Start dev server
npm run dev

# 3. Open browser
# Go to: http://localhost:3000/study
```

---

## ✅ What You Should See

### **On Landing Page:**
1. **"Priority Questions"** - Shows count of high-priority questions
2. **"New Material"** - Shows count of never-attempted questions
3. **"Needs Review"** - Shows count of previously incorrect questions
4. **"Focus Areas"** - Shows your actual weak topics with percentages
5. **"Smart Study Recommendation"** - Personalized message based on your data
6. **Button:** "Begin Smart Study Session (50 priority questions)"

---

## 🎯 Quick Test Scenarios

### **Scenario 1: First Time User**
- **Expected:** "New Material" count = total questions (814)
- **Expected:** "Needs Review" = 0
- **Expected:** No weak topics yet
- **Expected:** Recommendation mentions exploring new questions

### **Scenario 2: User With History**
- **Expected:** "New Material" count < total questions
- **Expected:** "Needs Review" > 0 if you got some wrong
- **Expected:** "Focus Areas" shows topics with < 70% accuracy
- **Expected:** Recommendation mentions your weakest topic by name

---

## 🐛 If Something Looks Wrong

### **Check 1: Are You Logged In?**
- Make sure you're signed in to your account
- Smart algorithm needs user ID

### **Check 2: Browser Console**
- Press F12 (or Cmd+Option+I on Mac)
- Look for red error messages
- Send me screenshot if you see errors

### **Check 3: Network Tab**
- In dev tools, click "Network" tab
- Refresh page
- Look for failed requests (red)

---

## ✅ Files Modified (Already Done)

1. `/lib/hooks/useStudyData.ts` - Added smart algorithm ✅
2. `/components/study-sections/StudyModeSection.tsx` - Updated UI ✅

**No database changes needed!**

---

## 💡 What Makes This Special

### **Old Way (Random):**
```
Questions: 814 available
[Shows random questions]
```

### **New Way (Smart):**
```
Priority Questions: 45 (focus on these!)
New Material: 120 (never seen)
Needs Review: 28 (got wrong before)

Focus Areas:
- Trade Exceptions (45% accuracy) ⚠️
- Luxury Tax (68% accuracy) 📊

[Shows prioritized questions first!]
```

---

## 🎊 Success = All These Work

- [ ] Stats show real numbers (not "-" or 0)
- [ ] "Focus Areas" shows topics OR "No weak areas"
- [ ] Recommendation is personalized
- [ ] Button says "Smart Study Session"
- [ ] Questions work normally when you start session
- [ ] No console errors

---

## 🔥 That's It!

**3 commands. 1 test. Done!**

Questions? Issues? Let me know and I'll help debug! 🚀
