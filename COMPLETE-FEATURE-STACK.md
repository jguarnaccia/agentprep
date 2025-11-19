# AgentPrep: Complete Feature Stack

## 🎯 THE FULL VISION

Transform AgentPrep from a study platform into the **complete ecosystem for aspiring sports agents**.

---

## 📊 FEATURE PRIORITY MATRIX

### **TIER 1: MVP - Launch Ready** (You Have These)
Core features needed to launch and start making money

### **TIER 2: Engagement Boosters** (Build Next 3 Months)
Features that increase retention and word-of-mouth

### **TIER 3: Moat Builders** (Build Months 4-12)
Features that make you impossible to compete with

### **TIER 4: Enterprise Features** (Build Year 2)
Features that unlock $50K+ contracts with teams/agencies

---

## 🚀 TIER 1: MVP - LAUNCH READY

### **✅ Core Study Features (YOU HAVE THESE)**

1. **Study Mode**
   - 3,000+ multiple choice questions
   - Question bank covering all 42 CBA articles
   - Immediate feedback on answers
   - Explanations for each question

2. **AI Test Generator** 🤖
   - Custom test generation via OpenAI GPT-4o
   - Topic selection (salary cap, luxury tax, etc.)
   - Difficulty levels (easy, medium, hard)
   - Multiple question formats

3. **Scenario Mode** 📋
   - 100+ expert-level scenarios
   - Real-world contract situations
   - Multi-step problem solving
   - Detailed explanations

4. **Flashcards** 🃏
   - 1,000+ AI-generated flashcards
   - Spaced repetition system
   - 99.8% CBA coverage
   - Mobile-optimized

5. **Study Guide**
   - AI-generated explanations (Claude)
   - Plain-English CBA breakdowns
   - Article-by-article coverage
   - Key concepts highlighted

6. **Notes System** 📝
   - Rich text editing
   - Categorization by topic
   - Search functionality
   - Tagged notes

7. **Progress Tracking**
   - Smart study pools (New → Review → Reinforce → Mastered)
   - Performance analytics
   - Topic mastery tracking
   - Test history

**Status:** ✅ Built and deployed
**What's Missing:** Marketing, packaging, pricing

---

## 🎮 TIER 2: ENGAGEMENT BOOSTERS (Next 3 Months)

### **1. Gamification System** 🏆

#### **A. Study Streaks** 🔥 (Week 1-2)
```sql
CREATE TABLE user_streaks (
  user_id UUID PRIMARY KEY,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  streak_freezes_remaining INTEGER DEFAULT 2
);
```

**Features:**
- Daily study streak counter
- Streak badges (7 days, 30 days, 100 days)
- Streak freeze (miss 1 day without penalty)
- Push notifications: "Don't break your 15-day streak!"
- Visual fire emoji 🔥 getting bigger

**Implementation:**
```typescript
// Display streak prominently in dashboard
<div className="streak-display">
  <span className="text-6xl">🔥</span>
  <h2 className="text-4xl font-bold">{currentStreak} Day Streak!</h2>
  <p>Your longest: {longestStreak} days</p>
</div>
```

**Why it works:** Fear of losing streak (Duolingo psychology)

---

#### **B. XP & Levels System** ⭐ (Week 3-4)
```sql
CREATE TABLE user_xp (
  user_id UUID PRIMARY KEY,
  total_xp INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  xp_to_next_level INTEGER DEFAULT 100
);

CREATE TABLE xp_events (
  id UUID PRIMARY KEY,
  user_id UUID,
  xp_earned INTEGER,
  action_type VARCHAR(50), -- 'question_correct', 'test_completed', etc.
  created_at TIMESTAMP
);
```

**XP Earning:**
```typescript
const XP_REWARDS = {
  question_correct_first_try: 10,
  question_correct_second_try: 5,
  test_completed: 50,
  perfect_score: 100,
  scenario_completed: 25,
  daily_login: 5,
  study_streak_milestone: 50,
  help_community_member: 15
};
```

**Level System:**
```typescript
const LEVELS = {
  1: 'Rookie Agent',
  5: 'Junior Associate',
  10: 'Associate Agent',
  15: 'Senior Agent',
  20: 'Elite Agent',
  25: 'Master Negotiator',
  30: 'CBA Expert'
};
```

**UI Display:**
```typescript
<div className="level-display">
  <div className="flex items-center gap-4">
    <div className="text-5xl">🎖️</div>
    <div>
      <h3 className="text-2xl font-bold">Level {level}: {levelTitle}</h3>
      <div className="progress-bar">
        <div className="progress" style={{width: `${xpProgress}%`}} />
      </div>
      <p>{currentXP} / {nextLevelXP} XP</p>
    </div>
  </div>
</div>
```

---

#### **C. Badges & Achievements** 🏅 (Week 5-6)
```sql
CREATE TABLE badges (
  id UUID PRIMARY KEY,
  badge_name VARCHAR(100),
  description TEXT,
  icon_url TEXT,
  rarity VARCHAR(20), -- 'common', 'rare', 'epic', 'legendary'
  requirement JSONB
);

CREATE TABLE user_badges (
  user_id UUID,
  badge_id UUID,
  earned_at TIMESTAMP,
  PRIMARY KEY (user_id, badge_id)
);
```

**Badge Examples:**
```typescript
const BADGES = [
  // Study-based
  { name: 'First Steps', description: 'Answered first question', icon: '👶' },
  { name: 'Century Club', description: 'Answered 100 questions', icon: '💯' },
  { name: 'Perfectionist', description: 'Scored 100% on a test', icon: '🎯' },
  { name: 'Night Owl', description: 'Studied after midnight', icon: '🦉' },
  { name: 'Early Bird', description: 'Studied before 6am', icon: '🌅' },
  
  // Mastery-based
  { name: 'Cap Master', description: 'Mastered all Salary Cap questions', icon: '💰' },
  { name: 'Tax Expert', description: 'Mastered Luxury Tax', icon: '📊' },
  { name: 'Exception Guru', description: 'Mastered all Exceptions', icon: '🎓' },
  
  // Streak-based
  { name: 'Week Warrior', description: '7-day study streak', icon: '🔥' },
  { name: 'Monthly Marathon', description: '30-day streak', icon: '🏃' },
  { name: 'Century Streak', description: '100-day streak', icon: '💎' },
  
  // Community-based
  { name: 'Helpful Hero', description: 'Helped 10 study buddies', icon: '🦸' },
  { name: 'Social Butterfly', description: 'Made 5 connections', icon: '🦋' },
  
  // Special
  { name: 'Founder', description: 'Early adopter (first 100 users)', icon: '🚀', rarity: 'legendary' },
  { name: 'Exam Slayer', description: 'Passed NBPA exam', icon: '👑', rarity: 'legendary' }
];
```

---

#### **D. Leaderboards** 🏆 (Week 7-8)
```sql
CREATE TABLE leaderboard_scores (
  user_id UUID,
  period VARCHAR(20), -- 'daily', 'weekly', 'monthly', 'all-time'
  metric VARCHAR(50), -- 'xp_earned', 'questions_answered', 'test_scores'
  score INTEGER,
  rank INTEGER,
  updated_at TIMESTAMP,
  PRIMARY KEY (user_id, period, metric)
);
```

**Leaderboard Types:**
```typescript
const LEADERBOARDS = {
  daily: {
    title: 'Today\'s Top Performers',
    metrics: ['xp_earned', 'questions_answered', 'perfect_scores']
  },
  weekly: {
    title: 'This Week\'s Leaders',
    metrics: ['total_xp', 'study_time', 'test_completion']
  },
  monthly: {
    title: 'Monthly Champions',
    metrics: ['mastery_progress', 'streak_days', 'community_helps']
  },
  allTime: {
    title: 'Hall of Fame',
    metrics: ['lifetime_xp', 'total_questions', 'exam_passes']
  }
};
```

**UI Display:**
```typescript
<div className="leaderboard">
  <h2>🏆 Weekly Leaderboard</h2>
  <div className="top-3">
    <div className="rank-2">🥈 #{2} Sarah - 2,450 XP</div>
    <div className="rank-1">🥇 #{1} Mike - 3,200 XP</div>
    <div className="rank-3">🥉 #{3} Alex - 2,100 XP</div>
  </div>
  <div className="other-ranks">
    <div>#{4} Jessica - 1,890 XP</div>
    <div>#{5} Chris - 1,750 XP</div>
    ...
    <div className="your-rank highlight">#{12} You - 1,420 XP</div>
  </div>
</div>
```

---

### **2. Social & Community Features** 👥

#### **A. Study Buddies / Partner Matching** (Week 9-10)
```sql
CREATE TABLE study_buddy_matches (
  id UUID PRIMARY KEY,
  user1_id UUID,
  user2_id UUID,
  match_score DECIMAL, -- compatibility 0-1
  status VARCHAR(20), -- 'pending', 'active', 'completed'
  created_at TIMESTAMP
);

CREATE TABLE study_buddy_preferences (
  user_id UUID PRIMARY KEY,
  study_schedule JSONB, -- ["Mon 7PM", "Wed 7PM"]
  timezone VARCHAR(50),
  exam_date DATE,
  strong_areas TEXT[],
  weak_areas TEXT[],
  communication_preference VARCHAR(20), -- 'zoom', 'discord', 'in-person'
  looking_for_buddy BOOLEAN DEFAULT true
);
```

**Matching Algorithm:**
```typescript
function calculateMatchScore(user1: User, user2: User): number {
  let score = 0;
  
  // Similar exam dates (+0.3)
  const dateDiff = Math.abs(user1.exam_date - user2.exam_date);
  if (dateDiff < 30) score += 0.3;
  
  // Complementary strengths/weaknesses (+0.4)
  const user1StrongInUser2Weak = user1.strong_areas.some(area => 
    user2.weak_areas.includes(area)
  );
  if (user1StrongInUser2Weak) score += 0.2;
  
  const user2StrongInUser1Weak = user2.strong_areas.some(area =>
    user1.weak_areas.includes(area)
  );
  if (user2StrongInUser1Weak) score += 0.2;
  
  // Overlapping study schedule (+0.3)
  const scheduleOverlap = findScheduleOverlap(
    user1.study_schedule,
    user2.study_schedule
  );
  if (scheduleOverlap.length > 0) score += 0.3;
  
  return score;
}
```

**UI:**
```typescript
<div className="study-buddy-finder">
  <h2>Find Your Study Buddy</h2>
  
  <div className="your-profile">
    <h3>Your Profile:</h3>
    <p>🎯 Exam Date: March 15, 2025</p>
    <p>💪 Strong: Salary Cap, Free Agency</p>
    <p>📚 Studying: Luxury Tax, Trade Rules</p>
    <p>📅 Available: Mon/Wed 7PM EST</p>
  </div>
  
  <div className="matches">
    <h3>Recommended Matches:</h3>
    
    <div className="match-card">
      <div className="match-score">95% Match</div>
      <h4>Sarah K.</h4>
      <p>🎯 Exam Date: March 20, 2025</p>
      <p>💪 Strong: Luxury Tax, Exceptions</p>
      <p>📚 Studying: Salary Cap basics</p>
      <p>📅 Available: Mon/Wed 7PM EST</p>
      <button>Connect</button>
    </div>
  </div>
</div>
```

---

#### **B. Study Groups** (Week 11-12)
```sql
CREATE TABLE study_groups (
  id UUID PRIMARY KEY,
  name VARCHAR(200),
  description TEXT,
  created_by UUID,
  max_members INTEGER DEFAULT 10,
  is_public BOOLEAN DEFAULT true,
  focus_topics TEXT[],
  meeting_schedule JSONB,
  created_at TIMESTAMP
);

CREATE TABLE study_group_members (
  group_id UUID,
  user_id UUID,
  role VARCHAR(20), -- 'admin', 'member'
  joined_at TIMESTAMP,
  PRIMARY KEY (group_id, user_id)
);

CREATE TABLE study_group_messages (
  id UUID PRIMARY KEY,
  group_id UUID,
  user_id UUID,
  message TEXT,
  created_at TIMESTAMP
);

CREATE TABLE study_group_sessions (
  id UUID PRIMARY KEY,
  group_id UUID,
  session_date TIMESTAMP,
  topic VARCHAR(200),
  attendees UUID[],
  notes TEXT
);
```

**Features:**
- Create/join study groups
- Group chat
- Scheduled study sessions
- Shared resources
- Group challenges
- Group leaderboards

**UI:**
```typescript
<div className="study-groups">
  <h2>Study Groups</h2>
  
  <button>Create New Group</button>
  
  <div className="group-list">
    <div className="group-card">
      <h3>🏀 NBA Cap Masters</h3>
      <p>6 members • Meets Mon/Wed 8PM EST</p>
      <p>Focus: Salary Cap & Luxury Tax</p>
      <div className="group-stats">
        <span>Avg Score: 87%</span>
        <span>Total XP: 15,420</span>
      </div>
      <button>Join Group</button>
    </div>
  </div>
  
  <div className="your-groups">
    <h3>Your Groups</h3>
    <div className="group-card active">
      <h3>⭐ March 2025 Exam Prep</h3>
      <p>8 members • Next session: Tonight 7PM</p>
      <div className="recent-activity">
        <p>Sarah: "Anyone struggle with Bird Rights?"</p>
        <p>Mike: "Check out Article VII Section 6..."</p>
      </div>
      <button>Open Chat</button>
    </div>
  </div>
</div>
```

---

#### **C. Discussion Forum / Q&A** (Week 13-14)
```sql
CREATE TABLE forum_categories (
  id UUID PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  icon VARCHAR(10)
);

CREATE TABLE forum_threads (
  id UUID PRIMARY KEY,
  category_id UUID,
  user_id UUID,
  title VARCHAR(200),
  content TEXT,
  is_pinned BOOLEAN DEFAULT false,
  is_solved BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP
);

CREATE TABLE forum_replies (
  id UUID PRIMARY KEY,
  thread_id UUID,
  user_id UUID,
  content TEXT,
  is_solution BOOLEAN DEFAULT false,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP
);

CREATE TABLE forum_votes (
  user_id UUID,
  post_id UUID, -- thread or reply
  vote_type VARCHAR(10), -- 'upvote', 'downvote'
  PRIMARY KEY (user_id, post_id)
);
```

**Categories:**
```typescript
const FORUM_CATEGORIES = [
  { name: 'Salary Cap Questions', icon: '💰' },
  { name: 'Luxury Tax Help', icon: '📊' },
  { name: 'Exception Confusion', icon: '🤔' },
  { name: 'Trade Scenarios', icon: '🔄' },
  { name: 'Study Tips', icon: '📚' },
  { name: 'Exam Preparation', icon: '🎯' },
  { name: 'Career Advice', icon: '💼' },
  { name: 'Success Stories', icon: '🎉' }
];
```

**Features:**
- Ask questions
- Expert answers (verified agents)
- Upvote/downvote
- Mark solution
- Search threads
- Tag threads
- Notification when answered

---

#### **D. Social Feed / Activity Stream** (Week 15-16)
```sql
CREATE TABLE activity_feed (
  id UUID PRIMARY KEY,
  user_id UUID,
  activity_type VARCHAR(50),
  activity_data JSONB,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP
);

CREATE TABLE user_follows (
  follower_id UUID,
  following_id UUID,
  created_at TIMESTAMP,
  PRIMARY KEY (follower_id, following_id)
);

CREATE TABLE activity_reactions (
  user_id UUID,
  activity_id UUID,
  reaction_type VARCHAR(20), -- 'like', 'celebrate', 'support'
  PRIMARY KEY (user_id, activity_id)
);
```

**Activity Types:**
```typescript
const ACTIVITY_TYPES = {
  badge_earned: 'earned the {badge_name} badge',
  level_up: 'reached Level {level}',
  perfect_score: 'scored 100% on {test_name}',
  streak_milestone: 'hit a {days}-day study streak',
  exam_passed: 'PASSED the NBPA exam! 🎉',
  helped_buddy: 'helped {buddy_name} with {topic}',
  joined_group: 'joined {group_name}',
  topic_mastered: 'mastered {topic}'
};
```

**Feed UI:**
```typescript
<div className="activity-feed">
  <h2>Recent Activity</h2>
  
  <div className="feed-item">
    <img src="/avatars/mike.jpg" />
    <div>
      <strong>Mike R.</strong> earned the Cap Master badge 🏆
      <span className="time">2 hours ago</span>
      <div className="reactions">
        <button>👏 12</button>
        <button>🔥 5</button>
      </div>
    </div>
  </div>
  
  <div className="feed-item highlight">
    <img src="/avatars/sarah.jpg" />
    <div>
      <strong>Sarah L.</strong> PASSED the NBPA exam! 🎉
      <span className="time">5 hours ago</span>
      <div className="reactions">
        <button>🎉 45</button>
        <button>👏 32</button>
      </div>
      <div className="comments">
        <p><strong>Alex:</strong> Congrats! Any tips?</p>
        <p><strong>Sarah:</strong> Focus on exceptions!</p>
      </div>
    </div>
  </div>
</div>
```

---

### **3. Advanced Learning Features** 🧠

#### **A. Adaptive Learning Paths** (Week 17-18)
```sql
CREATE TABLE learning_paths (
  user_id UUID PRIMARY KEY,
  recommended_next_topics TEXT[],
  weak_areas JSONB,
  strong_areas JSONB,
  study_velocity DECIMAL, -- questions per day
  predicted_exam_readiness DECIMAL, -- 0-100%
  recommended_exam_date DATE,
  updated_at TIMESTAMP
);
```

**Algorithm:**
```typescript
async function generateLearningPath(userId: string) {
  // Analyze user performance
  const performance = await analyzeUserPerformance(userId);
  
  // Identify weak areas
  const weakAreas = performance.topics.filter(t => t.accuracy < 70);
  
  // Identify prerequisites
  const prerequisites = await getPrerequisites(weakAreas);
  
  // Generate optimal study order
  const path = topologicalSort(prerequisites);
  
  // Estimate time to mastery
  const timeEstimate = calculateTimeToMastery(path, performance.study_velocity);
  
  return {
    next_topics: path.slice(0, 3),
    weak_areas: weakAreas,
    estimated_study_time: timeEstimate,
    recommended_exam_date: addDays(new Date(), timeEstimate)
  };
}
```

**UI:**
```typescript
<div className="learning-path">
  <h2>Your Personalized Learning Path</h2>
  
  <div className="readiness-score">
    <CircularProgress value={73} />
    <h3>73% Ready for Exam</h3>
    <p>Recommended exam date: March 15, 2025</p>
  </div>
  
  <div className="next-steps">
    <h3>Focus on These Next:</h3>
    <div className="topic-card priority">
      <span className="badge">Priority</span>
      <h4>Luxury Tax Aprons</h4>
      <p>Your accuracy: 62% (needs improvement)</p>
      <p>Est. time to master: 8 hours</p>
      <button>Start Learning</button>
    </div>
    
    <div className="topic-card">
      <h4>Trade Exceptions</h4>
      <p>Your accuracy: 71%</p>
      <p>Est. time to master: 5 hours</p>
      <button>Start Learning</button>
    </div>
  </div>
</div>
```

---

#### **B. Spaced Repetition System** (Week 19-20)
```sql
CREATE TABLE spaced_repetition_cards (
  user_id UUID,
  question_id UUID,
  ease_factor DECIMAL DEFAULT 2.5,
  interval INTEGER DEFAULT 1, -- days until next review
  repetitions INTEGER DEFAULT 0,
  next_review_date TIMESTAMP,
  last_reviewed_at TIMESTAMP,
  PRIMARY KEY (user_id, question_id)
);
```

**Algorithm (SM-2):**
```typescript
function updateSpacedRepetition(
  card: Card,
  performance: 0 | 1 | 2 | 3 | 4 | 5 // 0=total blackout, 5=perfect recall
) {
  if (performance < 3) {
    // Reset card
    card.repetitions = 0;
    card.interval = 1;
  } else {
    if (card.repetitions === 0) {
      card.interval = 1;
    } else if (card.repetitions === 1) {
      card.interval = 6;
    } else {
      card.interval = Math.round(card.interval * card.ease_factor);
    }
    
    card.repetitions += 1;
    card.ease_factor = card.ease_factor + (0.1 - (5 - performance) * (0.08 + (5 - performance) * 0.02));
  }
  
  card.next_review_date = addDays(new Date(), card.interval);
  return card;
}
```

**UI:**
```typescript
<div className="spaced-repetition">
  <h2>Daily Review</h2>
  <p>15 cards due for review today</p>
  
  <div className="review-card">
    <div className="question">
      What is the maximum salary for a player with 7-9 years of experience?
    </div>
    
    <button onClick={revealAnswer}>Show Answer</button>
    
    {/* After revealing */}
    <div className="answer">
      30% of the salary cap
    </div>
    
    <div className="difficulty-buttons">
      <button onClick={() => rate(0)}>Again</button>
      <button onClick={() => rate(3)}>Hard</button>
      <button onClick={() => rate(4)}>Good</button>
      <button onClick={() => rate(5)}>Easy</button>
    </div>
  </div>
  
  <div className="progress">
    Card 3 of 15 • Next review in 6 days
  </div>
</div>
```

---

#### **C. Mock Exam Simulator** (Week 21-22)
```sql
CREATE TABLE mock_exams (
  id UUID PRIMARY KEY,
  user_id UUID,
  exam_type VARCHAR(50), -- 'practice', 'final', 'timed'
  questions JSONB,
  time_limit INTEGER, -- minutes
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  score DECIMAL,
  passing_score DECIMAL DEFAULT 70
);
```

**Features:**
- Timed exam simulation (90 minutes)
- Real exam conditions
- No pausing
- Randomized questions
- Final score calculation
- Detailed performance report
- Areas needing improvement
- Retake recommendations

**UI:**
```typescript
<div className="mock-exam">
  <div className="exam-header">
    <h2>NBPA Certification Mock Exam</h2>
    <div className="timer">⏰ Time Remaining: 75:32</div>
    <div className="progress">Question 15 of 100</div>
  </div>
  
  <div className="question-display">
    {/* Full-screen, distraction-free */}
    <div className="question-text">
      A team over the second apron cannot use which exception?
    </div>
    
    <div className="options">
      <button>A) Bi-Annual Exception</button>
      <button>B) Mid-Level Exception</button>
      <button>C) Minimum Salary Exception</button>
      <button>D) Two-Way Player Exception</button>
    </div>
  </div>
  
  <div className="navigation">
    <button>← Previous</button>
    <button>Flag for Review</button>
    <button>Next →</button>
  </div>
</div>
```

---

#### **D. Video Lessons** (Week 23-24)
```sql
CREATE TABLE video_lessons (
  id UUID PRIMARY KEY,
  title VARCHAR(200),
  description TEXT,
  video_url TEXT,
  duration INTEGER, -- seconds
  topic VARCHAR(100),
  difficulty VARCHAR(20),
  instructor_id UUID,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP
);

CREATE TABLE video_progress (
  user_id UUID,
  video_id UUID,
  watched_duration INTEGER, -- seconds
  completed BOOLEAN DEFAULT false,
  last_watched_at TIMESTAMP,
  PRIMARY KEY (user_id, video_id)
);
```

**Content:**
- Expert agent explaining concepts
- Whiteboard style breakdowns
- Real contract examples
- Interview with veteran agents
- Case studies
- Salary cap math tutorials

---

### **4. Mini-Games** 🎮

#### **A. CBA Jeopardy** (Week 25)
```typescript
const categories = [
  'Salary Cap',
  'Luxury Tax',
  'Exceptions',
  'Free Agency',
  'Trades'
];

const questions = {
  100: 'Easy questions',
  200: 'Medium questions',
  300: 'Medium-hard questions',
  400: 'Hard questions',
  500: 'Expert questions'
};
```

**Multiplayer mode:**
- Compete against study buddy
- Real-time buzzer
- Timed responses
- Winner gets XP bonus

---

#### **B. Speed Quiz** (Week 26)
**Concept:** Answer as many questions correctly in 2 minutes

```typescript
<div className="speed-quiz">
  <div className="timer">⏱️ 1:47</div>
  <div className="score">Score: 12 correct</div>
  
  <div className="question">
    What's the rookie scale max for #1 pick?
  </div>
  
  <div className="quick-answers">
    <button>120%</button>
    <button>25%</button>
    <button>30%</button>
  </div>
</div>
```

---

#### **C. Contract Builder Challenge** (Week 27)
**Concept:** Build a legal contract under cap constraints

```typescript
<div className="contract-builder">
  <h2>Build a Legal Contract</h2>
  
  <div className="constraints">
    <p>Team: Lakers</p>
    <p>Available Cap: $15M</p>
    <p>Player: Anthony Davis extension</p>
    <p>Years Experience: 11</p>
  </div>
  
  <div className="builder">
    <label>Contract Years:</label>
    <input type="number" />
    
    <label>Starting Salary:</label>
    <input type="number" />
    
    <label>Annual Raises:</label>
    <select>
      <option>5%</option>
      <option>8%</option>
    </select>
    
    <button>Check Contract</button>
  </div>
  
  {/* Feedback */}
  <div className="result">
    ❌ Exceeds maximum salary (35%)
    Try reducing starting salary
  </div>
</div>
```

---

#### **D. Trade Machine** (Week 28)
**Concept:** Make legal trades

```typescript
<div className="trade-machine">
  <div className="team-a">
    <h3>Los Angeles Lakers</h3>
    <div className="trade-pieces">
      [Player cards to trade]
    </div>
    <div className="cap-status">
      Before: $5M under cap
      After: $2M over cap ❌
    </div>
  </div>
  
  <div className="arrows">⬌</div>
  
  <div className="team-b">
    <h3>Boston Celtics</h3>
    <div className="trade-pieces">
      [Player cards to trade]
    </div>
    <div className="cap-status">
      Before: $15M over cap
      After: $12M over cap ✅
    </div>
  </div>
  
  <button>Validate Trade</button>
</div>
```

---

## 🏢 TIER 3: MOAT BUILDERS (Months 4-12)

### **1. Predictive Analytics** 📊

#### **Exam Readiness Predictor**
```typescript
interface ExamPrediction {
  predicted_score: number; // 0-100
  pass_probability: number; // 0-1
  recommended_exam_date: Date;
  confidence_level: number; // 0-1
  weak_areas_critical: string[];
  study_hours_needed: number;
}
```

**Machine Learning Model:**
- Train on users who took real exam
- Correlate practice performance → exam results
- "You're 73% likely to pass"
- "Study 15 more hours on Luxury Tax"

---

### **2. Expert Content Marketplace**

#### **Agent Video Series**
- Veteran agents share tips
- "How I negotiated my first max contract"
- "Salary cap mistakes that cost millions"
- Premium content: $49-199

#### **Document Templates**
- Contract templates
- CBA cheat sheets
- Negotiation scripts
- Expert agents sell, you take 30%

---

### **3. 1-on-1 Mentorship Booking**
```sql
CREATE TABLE mentors (
  user_id UUID PRIMARY KEY,
  bio TEXT,
  experience TEXT,
  hourly_rate DECIMAL,
  availability JSONB,
  rating DECIMAL,
  sessions_completed INTEGER
);

CREATE TABLE mentorship_sessions (
  id UUID PRIMARY KEY,
  mentor_id UUID,
  mentee_id UUID,
  scheduled_at TIMESTAMP,
  duration INTEGER,
  price DECIMAL,
  status VARCHAR(20),
  notes TEXT
);
```

**Features:**
- Book 30min/60min calls with real agents
- Video sessions via Zoom
- Price: $99-299/session
- Platform takes 25% fee

---

### **4. Career Services**

#### **Resume Review**
- Upload resume
- AI + human review
- Specific feedback for agent roles
- Price: $49

#### **Mock Interview Prep**
- Practice agent interviews
- Common questions
- Feedback on answers
- Price: $99

#### **Job Board Integration**
- Agency job postings
- "Certified via AgentPrep" badge
- Direct apply

---

## 🏆 TIER 4: ENTERPRISE FEATURES (Year 2)

### **1. White-Label for Agencies**
```
CAA uses AgentPrep internally:
- caa.agentprep.com
- Custom branding
- Their content + yours
- $25,000/year
```

### **2. Team Dashboards**
```sql
CREATE TABLE team_analytics (
  team_id UUID,
  employee_id UUID,
  department VARCHAR(100),
  completion_rate DECIMAL,
  average_score DECIMAL,
  weak_areas JSONB,
  compliance_status VARCHAR(20)
);
```

**Features:**
- Track all employees
- Compliance reporting
- Identify knowledge gaps
- Mandatory training tracking

### **3. Custom Content Upload**
```
Lakers upload their internal policies:
- Team-specific scenarios
- Front office procedures
- Historical case studies
```

### **4. API Access**
```typescript
// For enterprises to integrate
GET /api/enterprise/user-progress
POST /api/enterprise/assign-training
GET /api/enterprise/team-analytics
```

---

## 📱 MOBILE APP (Year 2)

### **Features:**
- All web features
- Offline study mode
- Push notifications
- Faster flashcard swiping
- Camera for note-taking

**Tech Stack:**
- React Native
- Syncs with web app
- iOS + Android

---

## 🎯 IMPLEMENTATION PRIORITY

### **Launch Immediately (Week 1):**
1. Package existing features into Thinkific
2. Add pricing
3. Start marketing

### **Next 3 Months (Engagement):**
1. Study streaks (Week 1-2)
2. XP & Levels (Week 3-4)
3. Badges (Week 5-6)
4. Leaderboards (Week 7-8)
5. Study Buddy Matching (Week 9-10)
6. Study Groups (Week 11-12)

### **Months 4-6 (Retention):**
1. Discussion Forum
2. Social Feed
3. Adaptive Learning
4. Spaced Repetition
5. Mock Exams

### **Months 7-12 (Moat):**
1. Predictive analytics
2. Expert marketplace
3. Mentorship platform
4. Career services
5. Mini-games

### **Year 2 (Enterprise):**
1. White-label
2. Team dashboards
3. API access
4. Mobile app

---

## 💰 MONETIZATION PER TIER

### **Tier 1 (MVP):**
- $29/month individual
- Revenue: 100 users = $2,900/month

### **Tier 2 (Engagement):**
- $39/month (more features justify higher price)
- Premium badges: $4.99
- Revenue: 500 users = $19,500/month

### **Tier 3 (Moat):**
- $49/month subscription
- Expert content: 30% commission
- Mentorship: 25% commission
- Revenue: 1,000 users + marketplace = $60,000/month

### **Tier 4 (Enterprise):**
- $50,000-100,000/year per org
- Revenue: 5 enterprises = $350,000/year

---

## 🚀 FINAL FEATURE SET

**When fully built, AgentPrep will have:**

✅ 3,000+ practice questions
✅ AI test generator
✅ Expert scenarios
✅ Adaptive flashcards
✅ Study guide
✅ Notes system
✅ Progress tracking
✅ Study streaks
✅ XP & levels
✅ Badges & achievements
✅ Leaderboards
✅ Study buddy matching
✅ Study groups
✅ Discussion forum
✅ Social activity feed
✅ Adaptive learning paths
✅ Spaced repetition
✅ Mock exam simulator
✅ Video lessons
✅ Mini-games (Jeopardy, Speed Quiz, Contract Builder, Trade Machine)
✅ Exam readiness predictor
✅ Expert content marketplace
✅ 1-on-1 mentorship booking
✅ Career services (resume, interviews, job board)
✅ White-label for agencies
✅ Team dashboards
✅ API access
✅ Mobile app

**= The complete ecosystem for sports agent careers**

---

Want me to help you prioritize which features to build first based on your goals?
