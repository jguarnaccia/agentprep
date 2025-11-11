# 🛠️ AgentPrep - Quick Start Technical Guide

**For Developers Building AgentPrep MVP**

---

## ⚡ IMMEDIATE SETUP (15 minutes)

### Step 1: Install Prerequisites

```bash
# Check if you have Node.js installed
node --version  # Should be v18 or higher

# If not installed, download from nodejs.org
# macOS with Homebrew:
brew install node

# Windows: Download from nodejs.org
# Linux: Use your package manager
```

### Step 2: Create Next.js Project

```bash
# Navigate to your desired directory
cd ~/Desktop

# Create new Next.js project
npx create-next-app@latest agentprep

# When prompted, choose:
# ✅ TypeScript: Yes
# ✅ ESLint: Yes
# ✅ Tailwind CSS: Yes
# ✅ src/ directory: No
# ✅ App Router: Yes
# ✅ Import alias: Yes (@/*)

# Navigate into project
cd agentprep

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

### Step 3: Install Core Dependencies

```bash
# State management
npm install zustand

# UI Components
npm install lucide-react

# Database client
npm install @supabase/supabase-js

# Forms
npm install react-hook-form

# Utilities
npm install clsx tailwind-merge

# Optional: Date handling
npm install date-fns
```

---

## 🗄️ DATABASE SETUP (Supabase)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up for free account
3. Click "New Project"
4. Fill in:
   - Project name: `agentprep`
   - Database Password: (save this securely!)
   - Region: Choose closest to you
5. Click "Create Project" (takes ~2 minutes)

### Step 2: Get API Keys

1. In Supabase dashboard, go to Settings → API
2. Copy these values:
   - Project URL: `https://xxxxx.supabase.co`
   - anon/public key: `eyJhbGc...`

### Step 3: Add to Environment Variables

Create `.env.local` file in your project root:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 4: Create Database Schema

In Supabase SQL Editor, run:

```sql
-- Questions table
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  source TEXT NOT NULL,
  batch INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User progress table
CREATE TABLE user_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  question_id INTEGER REFERENCES questions(id),
  answered_correctly BOOLEAN,
  attempts INTEGER DEFAULT 1,
  last_attempted TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- Quiz sessions table
CREATE TABLE quiz_sessions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  mode TEXT NOT NULL,
  start_time TIMESTAMP DEFAULT NOW(),
  end_time TIMESTAMP,
  score INTEGER,
  total_questions INTEGER,
  category_filter TEXT,
  difficulty_filter TEXT
);

-- Categories table
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  article_reference TEXT,
  question_count INTEGER DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Questions are viewable by everyone" 
  ON questions FOR SELECT 
  USING (true);

CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can manage own progress" 
  ON user_progress FOR ALL 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own sessions" 
  ON quiz_sessions FOR ALL 
  USING (auth.uid() = user_id);
```

---

## 📦 DATA IMPORT

### Option 1: Manual Import (Simple)

1. Go to Supabase → Table Editor → questions
2. Click "Insert" → "Insert row"
3. Manually add questions (good for testing)

### Option 2: Bulk Import via Script (Recommended)

Create `scripts/import-questions.js`:

```javascript
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Get service key from Supabase Settings → API
const supabaseUrl = 'your-project-url';
const supabaseKey = 'your-service-key';
const supabase = createClient(supabaseUrl, supabaseKey);

async function importBatch(filePath, batchNumber) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  const questions = data.questions.map(q => ({
    question: q.question,
    options: q.options,
    correct: q.correct,
    explanation: q.explanation,
    category: q.category,
    difficulty: q.difficulty,
    source: q.source,
    batch: batchNumber
  }));

  const { error } = await supabase.from('questions').insert(questions);
  
  if (error) {
    console.error(`Error importing batch ${batchNumber}:`, error);
  } else {
    console.log(`✅ Imported ${questions.length} questions from batch ${batchNumber}`);
  }
}

// Run for all 17 batches
async function importAll() {
  const basePath = '/Users/jeremiahg/Desktop/Sports Agent Study Tool/';
  const files = [
    'NBA-CBA-Questions-Batch-1-Article-VII-COMPLETE.json',
    'NBA-CBA-Questions-Batch-2-Article-XXXVI-COMPLETE.json',
    'NBA-CBA-Questions-Batch-3-Article-X-COMPLETE.json',
    'NBA-CBA-Questions-Batch-4-Article-XI-COMPLETE.json',
    'NBA-CBA-Questions-Batch-5-Article-VIII-COMPLETE.json',
    'NBA-CBA-Questions-Batch-6-Article-II-COMPLETE.json',
    'NBA-CBA-Questions-Batch-7-Article-XXXIII-COMPLETE.json',
    'NBA-CBA-Questions-Batch-8-Article-VI-COMPLETE.json',
    'NBA-CBA-Questions-Batch-9-Article-IV-COMPLETE.json',
    'NBA-CBA-Questions-Batch-10-Article-XXII-COMPLETE.json',
    'NBA-CBA-Questions-Batch-11-Article-XIV-COMPLETE.json',
    'NBA-CBA-Questions-Batch-12-Article-VII-Part-2-COMPLETE.json',
    'NBA-CBA-Questions-Batch-13-Article-XV-COMPLETE.json',
    'NBA-CBA-Questions-Batch-14-Article-XII-COMPLETE.json',
    'NBA-CBA-Questions-Batch-15-Article-XIII-COMPLETE.json',
    'NBA-CBA-Questions-Batch-16-Article-XX-COMPLETE.json',
    'NBA-CBA-Questions-Batch-17-Article-XXV-COMPLETE.json'
  ];

  for (let i = 0; i < files.length; i++) {
    await importBatch(basePath + files[i], i + 1);
  }
  
  console.log('🎉 All 500 questions imported successfully!');
}

importAll();
```

Run with: `node scripts/import-questions.js`

---

## 🎨 STARTER CODE

### `lib/supabase.ts`
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### `lib/types.ts`
```typescript
export interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  source: string;
  batch: number;
}

export interface UserProgress {
  id: number;
  user_id: string;
  question_id: number;
  answered_correctly: boolean;
  attempts: number;
  last_attempted: string;
}

export interface QuizSession {
  id: number;
  user_id: string;
  mode: 'study' | 'test';
  start_time: string;
  end_time?: string;
  score?: number;
  total_questions: number;
}
```

### `app/page.tsx` (Homepage)
```typescript
import Link from 'next/link';
import { ArrowRight, BookOpen, Target, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            AgentPrep
          </h1>
          <p className="text-2xl text-gray-600 mb-4">
            Master the NBA CBA. Become a Certified Agent.
          </p>
          <p className="text-lg text-gray-500 mb-8">
            500 comprehensive questions covering every aspect of the NBA Collective Bargaining Agreement
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link
              href="/study"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2"
            >
              Start Studying <ArrowRight size={20} />
            </Link>
            <Link
              href="/test"
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 flex items-center gap-2"
            >
              Take Practice Test
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <FeatureCard
            icon={<BookOpen size={40} />}
            title="500 Questions"
            description="Comprehensive coverage of all NBA CBA articles and regulations"
          />
          <FeatureCard
            icon={<Target size={40} />}
            title="Targeted Practice"
            description="Filter by article, difficulty, or review incorrect answers"
          />
          <FeatureCard
            icon={<TrendingUp size={40} />}
            title="Track Progress"
            description="Monitor your performance and identify weak areas"
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: any) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
      <div className="text-blue-600 mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
```

### `app/study/page.tsx` (Study Mode)
```typescript
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Question } from '@/lib/types';
import { QuestionCard } from '@/components/QuestionCard';

export default function StudyPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, []);

  async function loadQuestions() {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .limit(10);

    if (data) {
      setQuestions(data);
    }
    setLoading(false);
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (questions.length === 0) {
    return <div className="text-center mt-20">No questions available</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Study Mode</h1>
        <p className="text-gray-600">
          Question {currentIndex + 1} of {questions.length}
        </p>
      </div>

      <QuestionCard 
        question={questions[currentIndex]}
        onNext={() => setCurrentIndex(prev => Math.min(prev + 1, questions.length - 1))}
        onPrevious={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
        showExplanation
      />
    </div>
  );
}
```

### `components/QuestionCard.tsx`
```typescript
'use client';

import { useState } from 'react';
import { Question } from '@/lib/types';
import { Check, X, ChevronRight, ChevronLeft } from 'lucide-react';

interface Props {
  question: Question;
  onNext?: () => void;
  onPrevious?: () => void;
  showExplanation?: boolean;
}

export function QuestionCard({ question, onNext, onPrevious, showExplanation = true }: Props) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleAnswerSelect = (index: number) => {
    if (hasAnswered) return;
    setSelectedAnswer(index);
    setHasAnswered(true);
  };

  const isCorrect = selectedAnswer === question.correct;

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      {/* Difficulty Badge */}
      <div className="mb-4">
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
          question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {question.difficulty.toUpperCase()}
        </span>
        <span className="ml-2 text-sm text-gray-500">{question.category}</span>
      </div>

      {/* Question */}
      <h2 className="text-xl font-bold mb-6">{question.question}</h2>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrectAnswer = index === question.correct;
          
          let bgColor = 'bg-gray-50 hover:bg-gray-100';
          if (hasAnswered) {
            if (isCorrectAnswer) {
              bgColor = 'bg-green-100 border-green-500';
            } else if (isSelected && !isCorrect) {
              bgColor = 'bg-red-100 border-red-500';
            }
          } else if (isSelected) {
            bgColor = 'bg-blue-50 border-blue-500';
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={hasAnswered}
              className={`w-full text-left p-4 rounded-lg border-2 border-transparent transition ${bgColor} ${
                hasAnswered ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{option}</span>
                {hasAnswered && isCorrectAnswer && <Check className="text-green-600" size={20} />}
                {hasAnswered && isSelected && !isCorrect && <X className="text-red-600" size={20} />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {hasAnswered && showExplanation && (
        <div className={`p-4 rounded-lg mb-6 ${isCorrect ? 'bg-green-50' : 'bg-blue-50'}`}>
          <h3 className="font-bold mb-2">
            {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
          </h3>
          <p className="text-gray-700 mb-2">{question.explanation}</p>
          <p className="text-sm text-gray-500">Source: {question.source}</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="px-6 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
          disabled={!onPrevious}
        >
          <ChevronLeft size={20} /> Previous
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          disabled={!onNext}
        >
          Next <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
```

---

## 🚀 DEVELOPMENT WORKFLOW

### Daily Development
```bash
# Start dev server
npm run dev

# Run in new terminal for type checking
npm run build

# Format code (if you add Prettier)
npm run format
```

### Git Workflow
```bash
# Initialize Git
git init
git add .
git commit -m "Initial commit"

# Create GitHub repo and push
git remote add origin https://github.com/yourusername/agentprep.git
git push -u origin main
```

### Deployment to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts to connect to your GitHub repo
# Future pushes to main will auto-deploy!
```

---

## 📚 HELPFUL RESOURCES

- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **TypeScript:** https://www.typescriptlang.org/docs
- **Lucide Icons:** https://lucide.dev

---

## 🆘 TROUBLESHOOTING

### "Module not found" errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Supabase connection issues
- Check `.env.local` file exists and has correct keys
- Verify keys are prefixed with `NEXT_PUBLIC_`
- Restart dev server after adding env variables

### TypeScript errors
```bash
# Regenerate types from Supabase
npx supabase gen types typescript --project-id your-project-id > lib/database.types.ts
```

---

## ✅ READY TO BUILD!

You now have:
- ✅ Next.js project set up
- ✅ Supabase database configured
- ✅ All 500 questions ready to import
- ✅ Basic components to start building
- ✅ Development environment ready

**Next steps:**
1. Import all questions to Supabase
2. Build out the quiz components
3. Add user authentication
4. Implement progress tracking
5. Deploy to Vercel

**Let's build AgentPrep! 🏀💼**

