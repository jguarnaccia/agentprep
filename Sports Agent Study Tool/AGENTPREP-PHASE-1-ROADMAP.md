# 🚀 AgentPrep - Phase 1 Development Roadmap

**Project Start Date:** October 7, 2025  
**Target MVP Completion:** November 15, 2025 (4-6 weeks)  
**Platform:** Next.js Web Application for Sports Agent Certification Prep

---

## 📊 PROJECT STATUS

### ✅ COMPLETED (October 7, 2025)
- [x] All 500 NBA CBA study questions created and organized
- [x] 17 batch files covering every major CBA article
- [x] Master consolidated question file created
- [x] Question structure standardized (ID, question, options, correct, explanation, category, difficulty, source)
- [x] File organization complete in `/Users/jeremiahg/Desktop/Sports Agent Study Tool/`

### 🎯 CURRENT PHASE: Setup & Development

---

## 🏗️ PHASE 1: MVP DEVELOPMENT (Weeks 1-6)

### **Week 1: Project Setup & Foundation**
**Goal:** Get the development environment ready and project structure in place

#### Day 1-2: Development Environment
- [ ] Install Node.js (v18+) and npm
- [ ] Install VS Code or preferred IDE
- [ ] Set up Next.js 14 project with App Router
  ```bash
  npx create-next-app@latest agentprep --typescript --tailwind --app
  ```
- [ ] Install core dependencies:
  - [ ] Tailwind CSS (for styling)
  - [ ] Lucide React (for icons)
  - [ ] Supabase client (for database)
  - [ ] React Hook Form (for forms)
  - [ ] Zustand (for state management)

#### Day 3-4: Database Setup
- [ ] Create Supabase account (free tier)
- [ ] Design database schema:
  - [ ] `questions` table (id, question, options, correct, explanation, category, difficulty, source, batch)
  - [ ] `users` table (id, email, name, created_at)
  - [ ] `user_progress` table (user_id, question_id, answered_correctly, attempts, last_attempted)
  - [ ] `quiz_sessions` table (user_id, start_time, end_time, score, questions_answered)
  - [ ] `categories` table (id, name, description, article_reference)
- [ ] Create tables in Supabase
- [ ] Set up Row Level Security (RLS) policies

#### Day 5-7: Data Import
- [ ] Create data import script
- [ ] Import all 500 questions from JSON files into Supabase
- [ ] Verify data integrity
- [ ] Create seed data for testing

**Week 1 Deliverable:** Running Next.js app connected to Supabase with all questions imported

---

### **Week 2: Core UI Components**
**Goal:** Build reusable components for the quiz interface

#### Day 1-3: Component Library
- [ ] Create base UI components:
  - [ ] Button component (primary, secondary, ghost variants)
  - [ ] Card component (for questions and results)
  - [ ] Badge component (for categories and difficulty)
  - [ ] Progress bar component
  - [ ] Modal/Dialog component
  - [ ] Loading spinner
  - [ ] Navigation bar
  - [ ] Footer

#### Day 4-7: Quiz Components
- [ ] QuestionCard component
  - Displays question text
  - Shows 4 multiple choice options
  - Handles answer selection
  - Shows correct/incorrect feedback
  - Displays explanation after answer
- [ ] QuizTimer component (optional for timed mode)
- [ ] ScoreDisplay component
- [ ] CategoryFilter component
- [ ] DifficultyFilter component

**Week 2 Deliverable:** Complete component library with Storybook or component showcase page

---

### **Week 3: Quiz Functionality**
**Goal:** Build the core quiz experience

#### Day 1-3: Study Mode
- [ ] Create `/study` page
- [ ] Fetch random questions from database
- [ ] Display one question at a time
- [ ] Handle answer selection
- [ ] Show immediate feedback (correct/incorrect)
- [ ] Display detailed explanation
- [ ] "Next Question" navigation
- [ ] Track questions answered in session

#### Day 4-5: Filtering & Navigation
- [ ] Add category filtering (by CBA article)
- [ ] Add difficulty filtering (easy/medium/hard)
- [ ] Add "Review Incorrect" mode
- [ ] Implement question bookmarking
- [ ] Add pagination/question counter

#### Day 6-7: Test Mode
- [ ] Create `/test` page
- [ ] Timed quiz option (60 minutes, 50 questions)
- [ ] No feedback until test completion
- [ ] Submit and score test
- [ ] Show test results with breakdown

**Week 3 Deliverable:** Fully functional quiz system with study and test modes

---

### **Week 4: User System & Progress Tracking**
**Goal:** Add user accounts and progress tracking

#### Day 1-3: Authentication
- [ ] Implement Supabase Auth
- [ ] Create login page
- [ ] Create signup page
- [ ] Add "Continue as Guest" option
- [ ] Implement protected routes
- [ ] Add logout functionality

#### Day 4-5: Progress Tracking
- [ ] Track answered questions per user
- [ ] Store correct/incorrect attempts
- [ ] Calculate success rate by category
- [ ] Store quiz session history
- [ ] Create user dashboard

#### Day 6-7: Dashboard Page
- [ ] Create `/dashboard` page
- [ ] Show overall stats (questions answered, success rate)
- [ ] Display category performance breakdown
- [ ] Show weak areas
- [ ] Display recent quiz history
- [ ] Visualize progress with charts

**Week 4 Deliverable:** User authentication and personalized dashboard

---

### **Week 5: Analytics & Polish**
**Goal:** Add analytics and improve user experience

#### Day 1-2: Analytics Features
- [ ] Implement performance charts:
  - Success rate over time
  - Category performance radar chart
  - Difficulty breakdown
- [ ] Add "Study Recommendations" based on weak areas
- [ ] Create "Mastery" badges for categories
- [ ] Implement spaced repetition algorithm (show difficult questions more often)

#### Day 3-4: UI/UX Polish
- [ ] Responsive design for mobile/tablet
- [ ] Add animations and transitions
- [ ] Improve loading states
- [ ] Add keyboard shortcuts (arrows for navigation, number keys for answers)
- [ ] Dark mode toggle
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)

#### Day 5-7: Content Pages
- [ ] Create homepage with value proposition
- [ ] Create `/about` page
- [ ] Add FAQ section
- [ ] Create study guide/resources page
- [ ] Add terms of service and privacy policy placeholders

**Week 5 Deliverable:** Polished, responsive application with analytics

---

### **Week 6: Testing, Optimization & Launch Prep**
**Goal:** Test thoroughly and prepare for deployment

#### Day 1-2: Testing
- [ ] Test all quiz functionality
- [ ] Test user authentication flows
- [ ] Test on multiple devices/browsers
- [ ] Fix bugs and edge cases
- [ ] Get feedback from 3-5 beta testers

#### Day 3-4: Performance Optimization
- [ ] Optimize images
- [ ] Implement lazy loading
- [ ] Minimize bundle size
- [ ] Optimize database queries
- [ ] Add caching where appropriate
- [ ] Run Lighthouse audit

#### Day 5-6: Deployment
- [ ] Deploy to Vercel (free tier)
- [ ] Configure custom domain (optional)
- [ ] Set up environment variables
- [ ] Configure Supabase for production
- [ ] Test production deployment
- [ ] Set up error monitoring (Sentry or similar)

#### Day 7: Launch
- [ ] Final testing in production
- [ ] Create launch checklist
- [ ] **GO LIVE!** 🚀

**Week 6 Deliverable:** Live, functional MVP at agentprep.com (or similar)

---

## 🎨 DESIGN SYSTEM

### Color Palette
```css
/* Primary Colors - NBA-inspired */
--primary: #1D428A (Navy Blue)
--secondary: #C8102E (Red)
--accent: #FDB927 (Gold)

/* Neutrals */
--background: #FFFFFF
--surface: #F8F9FA
--text: #212529
--text-light: #6C757D

/* Semantic Colors */
--success: #198754
--error: #DC3545
--warning: #FFC107
--info: #0DCAF0
```

### Typography
- **Headings:** Inter or Poppins (bold, modern)
- **Body:** Inter or System Font Stack
- **Code/Technical:** JetBrains Mono or Fira Code

### Key UI Patterns
- **Cards:** Rounded corners (12px), subtle shadow
- **Buttons:** Rounded (8px), bold text, hover states
- **Quiz Interface:** Clean, distraction-free, large touch targets
- **Feedback:** Instant visual feedback (green=correct, red=incorrect)

---

## 📱 KEY FEATURES (MVP)

### Core Features
✅ **Quiz Modes:**
- Study Mode (immediate feedback + explanations)
- Test Mode (timed, no feedback until end)

✅ **Filtering:**
- By CBA Article/Category
- By Difficulty Level
- By Previously Incorrect

✅ **Progress Tracking:**
- Questions answered
- Success rate overall and by category
- Quiz history
- Weak areas identification

✅ **User System:**
- Email/password authentication
- Guest mode (no account needed)
- Personal dashboard
- Progress persistence

### Nice-to-Have (Post-MVP)
- [ ] Mobile app (React Native)
- [ ] Flashcard mode
- [ ] Community features (leaderboards, forums)
- [ ] Spaced repetition algorithm
- [ ] Export progress to PDF
- [ ] Additional content (NFL, MLB CBAs)

---

## 🗂️ FILE STRUCTURE

```
agentprep/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (main)/
│   │   ├── dashboard/page.tsx
│   │   ├── study/page.tsx
│   │   ├── test/page.tsx
│   │   └── results/[id]/page.tsx
│   ├── about/page.tsx
│   ├── layout.tsx
│   └── page.tsx (homepage)
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   └── ...
│   ├── quiz/
│   │   ├── QuestionCard.tsx
│   │   ├── QuizTimer.tsx
│   │   ├── ScoreDisplay.tsx
│   │   └── ...
│   ├── dashboard/
│   │   ├── StatsCard.tsx
│   │   ├── PerformanceChart.tsx
│   │   └── ...
│   ├── Navbar.tsx
│   └── Footer.tsx
├── lib/
│   ├── supabase.ts
│   ├── utils.ts
│   └── types.ts
├── public/
│   ├── logo.svg
│   └── images/
└── styles/
    └── globals.css
```

---

## 🔧 TECH STACK FINAL DECISIONS

### Frontend
- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State:** Zustand (lightweight, simple)
- **Forms:** React Hook Form

### Backend/Database
- **Database:** Supabase (PostgreSQL + Auth + Storage)
- **API:** Next.js API Routes + Supabase Edge Functions (if needed)

### Hosting/Deployment
- **Frontend:** Vercel (auto-deploy from GitHub)
- **Database:** Supabase Cloud (free tier)
- **Domain:** TBD (GoDaddy or Namecheap)

### Development Tools
- **Version Control:** Git + GitHub
- **Package Manager:** npm
- **Code Editor:** VS Code
- **Testing:** Jest + React Testing Library (optional for MVP)

---

## 💰 COST BREAKDOWN (FREE MVP)

| Service | Plan | Monthly Cost |
|---------|------|--------------|
| Vercel Hosting | Hobby (Free) | $0 |
| Supabase Database | Free Tier | $0 |
| Domain Name | N/A (use vercel.app) | $0 |
| **TOTAL** | | **$0/month** |

**Scale-up costs (future):**
- Vercel Pro: $20/month (when you need more)
- Supabase Pro: $25/month (500K+ users)
- Custom Domain: ~$15/year
- Google Analytics: Free

---

## 📈 SUCCESS METRICS (MVP)

**Week 1-2 Post-Launch:**
- [ ] 10+ beta users testing
- [ ] 1,000+ questions answered
- [ ] <500ms average page load time
- [ ] <5 critical bugs reported

**Month 1:**
- [ ] 50+ active users
- [ ] 10,000+ questions answered
- [ ] 70%+ user retention (return visit)
- [ ] 4.5+ star feedback rating

---

## 🚨 CRITICAL PATH ITEMS

**Must-haves for MVP:**
1. ✅ All 500 questions in database
2. ⬜ Working quiz interface with instant feedback
3. ⬜ Basic user authentication
4. ⬜ Progress tracking (which questions answered)
5. ⬜ Category/difficulty filtering
6. ⬜ Deployed and accessible online

**Can wait for v1.1:**
- Advanced analytics
- Spaced repetition
- Social features
- Mobile app
- Additional content (other sports)

---

## 📞 NEXT STEPS (START NOW)

1. **Install Node.js** if not already installed
2. **Choose project directory** for development
3. **Run:** `npx create-next-app@latest agentprep --typescript --tailwind --app`
4. **Create Supabase account** at supabase.com
5. **Start Week 1 tasks**

**Ready to build? Let's go! 🏀💼**

---

*Document created: October 7, 2025*  
*Last updated: October 7, 2025*
