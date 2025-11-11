# 🚀 AI TEST GENERATOR - INSTALLATION & SETUP GUIDE

## ✅ WHAT WE JUST BUILT

The **AI Test Generator** is now fully integrated into AgentPrep! Here's what you can do:

1. **Generate Custom Tests**: Create practice tests on any of the 17 CBA topics
2. **Customize Parameters**: Choose difficulty (easy/medium/hard), question count (5-50), and format (multiple choice/true-false/scenario)
3. **Take AI-Generated Tests**: Complete tests with timer and instant feedback
4. **Review Performance**: See detailed results with explanations for each question
5. **Track Progress**: View scores, time spent, and question-by-question breakdown

---

## 📋 INSTALLATION STEPS

### Step 1: Install Anthropic SDK

Open your terminal and run:

```bash
cd /Users/jeremiahg/Desktop/agentprep
npm install @anthropic-ai/sdk
```

### Step 2: Create Database Table

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to: **SQL Editor**
3. Copy and paste the contents of: `scripts/create-ai-test-sessions-table.sql`
4. Click **Run** to execute the SQL

Alternatively, if you have the Supabase CLI installed:

```bash
supabase db push --file scripts/create-ai-test-sessions-table.sql
```

### Step 3: Restart Dev Server

```bash
npm run dev
```

Your app will now be running at: **http://localhost:3000/study**

---

## 🎯 HOW TO USE THE AI TEST GENERATOR

### From the Study Page:

1. Open http://localhost:3000/study
2. You'll see a new **AI Test Generator** banner at the top (blue/purple gradient)
3. Click **"Try it now →"**

### Or Navigate Directly:

Go to: **http://localhost:3000/ai-test**

### Generate a Test:

1. **Select Topic**: Choose from 17 CBA categories (Salary Cap, Trades, etc.)
2. **Set Question Count**: Use the slider (5-50 questions)
3. **Choose Difficulty**: Easy, Medium, or Hard
4. **Pick Format**: 
   - Multiple Choice (4 options)
   - True/False (quick recall)
   - Scenarios (real-world cases)
5. Click **"Generate Test"**

### Take the Test:

- Answer each question
- Click **"Submit Answer"** to see if you're correct
- Read the detailed explanation
- Click **"Next Question"** to continue
- Timer runs automatically

### Review Results:

- See your score percentage
- View stats: correct/incorrect/time spent
- Click on any question to expand and review
- Generate a new test or return to study mode

---

## 🗂️ FILE STRUCTURE

Here's what was added:

```
agentprep/
├── .env.local                              # ✅ Updated (API key added)
├── app/
│   ├── api/
│   │   └── generate-test/
│   │       └── route.ts                    # ✨ NEW - API route for Claude
│   ├── ai-test/
│   │   ├── page.tsx                        # ✨ NEW - Test configuration page
│   │   ├── take/
│   │   │   └── page.tsx                    # ✨ NEW - Test taking interface
│   │   └── results/
│   │       └── page.tsx                    # ✨ NEW - Results page
│   └── study/
│       └── page.tsx                        # ✅ Updated (AI Test link added)
└── scripts/
    └── create-ai-test-sessions-table.sql   # ✨ NEW - Database schema
```

---

## 🔧 TECHNICAL DETAILS

### API Route (`/api/generate-test`)

- **Model**: `claude-sonnet-4-20250514` (Latest Claude Sonnet)
- **Max Tokens**: 4096 (can generate up to 50 questions)
- **Input**: Topic, difficulty, question count, format
- **Output**: JSON array of questions with explanations

### Database Table (`ai_test_sessions`)

Stores:
- Test configuration (topic, difficulty, format, etc.)
- Generated questions (as JSONB)
- User answers and progress
- Results and timing data

### State Management

- Uses `sessionStorage` for test data (no localStorage, as per your requirements)
- React state for UI management
- Supabase for persistent storage (optional - table is ready but not currently used)

---

## 🎨 UI FEATURES

### Configuration Page
- Clean gradient design (slate-50 to blue-50 background)
- Topic dropdown with all 17 categories
- Slider for question count
- Button grid for difficulty selection
- Card-based format selector
- Loading states during generation

### Test Taking Page
- Timer in header
- Progress bar showing completion
- Answer options with hover states
- Instant feedback (green for correct, red for incorrect)
- Detailed explanations after each answer
- Navigation between questions

### Results Page
- Score display with color coding (green >80%, yellow 60-80%, red <60%)
- Stats grid (total/correct/incorrect/time)
- Expandable question review
- Color-coded question cards
- Action buttons (new test / back to study)

---

## 🚀 NEXT STEPS (OPTIONAL ENHANCEMENTS)

Want to take it further? Here are some ideas:

1. **Save AI Tests to Database**: Store generated questions for future review
2. **Test History**: Show past AI test scores and performance trends
3. **Favorite Questions**: Let users save their favorite AI-generated questions
4. **Export Results**: Download test results as PDF
5. **Leaderboard**: Compare scores with other users (requires authentication)
6. **Adaptive Difficulty**: AI adjusts difficulty based on performance
7. **Custom Topics**: Let users enter free-text topics beyond the 17 categories

---

## ⚡ QUICK START CHECKLIST

- [ ] Run `npm install @anthropic-ai/sdk`
- [ ] Execute SQL script in Supabase
- [ ] Restart dev server with `npm run dev`
- [ ] Navigate to http://localhost:3000/study
- [ ] Click "AI Test Generator" banner
- [ ] Generate your first AI test!

---

## 🎉 YOU'RE READY!

The AI Test Generator is fully integrated and ready to use. It's a powerful addition to AgentPrep that lets users practice on ANY CBA topic they want, not just the questions in the database.

Questions? Issues? Let's keep building! 💪🏀
