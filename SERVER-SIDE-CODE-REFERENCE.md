# YOUR SERVER-SIDE CODE - Complete Reference

## 📁 ALL SERVER-SIDE FILES

Your server-side code lives in `/app/api/` - these are Next.js API routes that run on Vercel's servers.

---

## 🔐 API ROUTES (6 Total)

### 1. `/app/api/generate-ai-test/route.ts`
**Purpose:** Generate custom AI tests using OpenAI GPT-4o

**What it does:**
- Takes user preferences (topics, difficulty, question count, formats)
- Fetches relevant CBA content from Supabase
- Calls OpenAI GPT-4o to generate custom questions
- Validates and formats the questions
- Saves test session to database
- Returns questions to client

**API Keys Used:**
- `OPENAI_API_KEY` ✅ Server-only
- `SUPABASE_SERVICE_ROLE_KEY` ✅ Server-only

**Endpoint:** `POST /api/generate-ai-test`

**Request Body:**
```json
{
  "topics": ["salary-cap", "luxury-tax"],
  "difficulties": ["medium", "hard"],
  "formats": ["multiple-choice", "scenario"],
  "questionCount": 20
}
```

**Response:**
```json
{
  "sessionId": "uuid",
  "questions": [
    {
      "id": 1,
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correct": 2,
      "explanation": "...",
      "citation": "Article VII, Section 6",
      "topic": "salary-cap",
      "difficulty": "medium"
    }
  ]
}
```

---

### 2. `/app/api/study-guide/route.ts`
**Purpose:** Generate study guide content using Anthropic Claude

**What it does:**
- Checks if study guide content already exists in database
- If not, calls Claude API to generate comprehensive study guide
- Saves content to database for future use
- Returns formatted study content

**API Keys Used:**
- `ANTHROPIC_API_KEY` ✅ Server-only

**Endpoints:** 
- `POST /api/study-guide` - Generate new content
- `GET /api/study-guide?category=salary-cap` - Retrieve cached content

**Request Body (POST):**
```json
{
  "category": "salary-cap"
}
```

**Response:**
```json
{
  "content": {
    "overview": "Comprehensive overview...",
    "keyPoints": ["Point 1", "Point 2", ...],
    "rules": [
      {
        "title": "Rule name",
        "description": "...",
        "example": "..."
      }
    ],
    "calculations": [...],
    "realWorldExamples": [...],
    "commonMistakes": [...],
    "examTips": [...]
  }
}
```

---

### 3. `/app/api/cba-explain/route.ts`
**Purpose:** Generate AI explanations for CBA sections using Claude

**What it does:**
- Checks if explanation already exists for this content
- If not, calls Claude API to explain the CBA section in simple terms
- Saves explanation to database
- Returns beginner-friendly explanation

**API Keys Used:**
- `ANTHROPIC_API_KEY` ✅ Server-only

**Endpoint:** `POST /api/cba-explain`

**Request Body:**
```json
{
  "content_id": "uuid",
  "title": "Article VII, Section 6",
  "content": "Full CBA text..."
}
```

**Response:**
```json
{
  "explanation": "Here's what this means in plain English..."
}
```

---

### 4. `/app/api/generate-test/route.ts`
**Purpose:** Generate tests using Claude (alternative to OpenAI)

**What it does:**
- Takes test parameters (topic, difficulty, count, format)
- Builds custom prompt based on question format
- Calls Claude API to generate questions
- Returns formatted questions

**API Keys Used:**
- `ANTHROPIC_API_KEY` ✅ Server-only

**Endpoint:** `POST /api/generate-test`

**Request Body:**
```json
{
  "topic": "Salary Cap",
  "difficulty": "medium",
  "questionCount": 10,
  "questionFormat": "multiple_choice" | "true_false" | "scenario"
}
```

**Response:**
```json
{
  "questions": [
    {
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correct": 1,
      "explanation": "..."
    }
  ]
}
```

---

### 5. `/app/api/notes/route.ts`
**Purpose:** Full CRUD operations for user notes

**What it does:**
- **GET**: Fetch all notes with optional filters (search, category, tags)
- **POST**: Create new note
- **PATCH**: Update existing note
- **DELETE**: Delete note

**API Keys Used:**
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ⚠️ Public (but protected by RLS)

**Endpoints:**
- `GET /api/notes?search=luxury&category=salary-cap`
- `POST /api/notes`
- `PATCH /api/notes`
- `DELETE /api/notes?id=uuid`

**Request Body (POST):**
```json
{
  "title": "Luxury Tax Notes",
  "content": "Important details about luxury tax...",
  "category": "salary-cap",
  "tags": ["tax", "important"],
  "is_important": true
}
```

---

### 6. `/app/api/save-test-result/route.ts`
**Purpose:** Save completed test results to database

**What it does:**
- Validates test result data
- Saves to `ai_test_results` table
- Returns success confirmation

**API Keys Used:**
- `SUPABASE_SERVICE_ROLE_KEY` ✅ Server-only

**Endpoint:** `POST /api/save-test-result`

**Request Body:**
```json
{
  "sessionId": "uuid",
  "answers": [0, 2, 1, 3, ...],
  "score": 85,
  "totalQuestions": 20
}
```

**Response:**
```json
{
  "success": true,
  "resultId": "uuid"
}
```

---

## 🔑 ENVIRONMENT VARIABLES REQUIRED

### Server-Only (Never Exposed)
```bash
# OpenAI
OPENAI_API_KEY=sk-proj-...

# Anthropic Claude
ANTHROPIC_API_KEY=sk-ant-...

# Supabase Admin Key (full database access)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### Public (Sent to Browser)
```bash
# Supabase Public URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# Supabase Anonymous Key (limited permissions via RLS)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

---

## 📊 DATABASE TABLES USED

Your server code interacts with these Supabase tables:

```sql
-- CBA Content
cba_content (
  id UUID,
  article_number INTEGER,
  section_number VARCHAR,
  title TEXT,
  content TEXT,
  ai_explanation TEXT,
  type VARCHAR
)

-- AI Test Sessions
ai_test_sessions_v2 (
  id UUID,
  test_config JSONB,
  questions JSONB,
  user_id UUID,
  created_at TIMESTAMP
)

-- Test Results
ai_test_results (
  id UUID,
  session_id UUID,
  user_id UUID,
  answers JSONB,
  score INTEGER,
  total_questions INTEGER,
  created_at TIMESTAMP
)

-- Study Guide Content
study_guide_content (
  id UUID,
  category VARCHAR,
  content JSONB,
  created_at TIMESTAMP
)

-- Notes
notes (
  id UUID,
  user_id VARCHAR,
  title TEXT,
  content TEXT,
  category VARCHAR,
  tags TEXT[],
  is_important BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

---

## 🔄 HOW CLIENT CALLS SERVER

**Example Flow: Generating an AI Test**

```typescript
// CLIENT-SIDE (Browser)
// /app/ai-test/page.tsx

async function generateTest() {
  // 1. User clicks "Generate Test" button
  const response = await fetch('/api/generate-ai-test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topics: ['salary-cap'],
      difficulties: ['medium'],
      formats: ['multiple-choice'],
      questionCount: 10
    })
  });
  
  // 4. Receive generated questions
  const data = await response.json();
  setQuestions(data.questions);
}
```

```typescript
// SERVER-SIDE (Vercel)
// /app/api/generate-ai-test/route.ts

export async function POST(request: Request) {
  // 2. Server receives request
  const body = await request.json();
  
  // 3. Server calls OpenAI (API key safe on server!)
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }]
  });
  
  // Save to database and return
  return NextResponse.json({ questions: [...] });
}
```

---

## 🛡️ SECURITY MEASURES IN YOUR CODE

### 1. API Keys Protected
```typescript
// ✅ GOOD - Keys only on server
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY  // Never sent to browser
});
```

### 2. Input Validation
```typescript
// ✅ GOOD - Validates user input
if (!questionCount || questionCount < 5 || questionCount > 50) {
  return NextResponse.json(
    { error: 'Invalid question count' },
    { status: 400 }
  );
}
```

### 3. Error Handling
```typescript
// ✅ GOOD - Catches errors without exposing details
try {
  // ... code
} catch (error) {
  console.error('Error:', error);  // Log internally
  return NextResponse.json(
    { error: 'Failed to generate test' },  // Generic to user
    { status: 500 }
  );
}
```

### 4. Service Role Key Usage
```typescript
// ✅ GOOD - Uses service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  // Full database access, server-only
);
```

---

## 📈 API USAGE & COSTS

### OpenAI GPT-4o
- **Used in:** `/api/generate-ai-test`
- **Cost:** ~$0.01-0.05 per test generation
- **Rate Limit:** 10,000 requests/day (default)

### Anthropic Claude Sonnet 4
- **Used in:** `/api/study-guide`, `/api/cba-explain`, `/api/generate-test`
- **Cost:** ~$0.003-0.015 per request
- **Rate Limit:** Varies by tier

### Supabase
- **Used in:** All API routes
- **Cost:** Free tier: 500MB database, 2GB bandwidth/month
- **Paid:** $25/month for more

---

## 🚀 DEPLOYMENT

When you deploy to Vercel, these files become serverless functions:

```
/app/api/generate-ai-test/route.ts
  ↓ (builds to)
/.vercel/output/functions/api/generate-ai-test.func/

Becomes:
https://agentprep.vercel.app/api/generate-ai-test
```

**Each API route:**
- Runs on-demand when called
- Scales automatically
- Times out after 10 seconds (Hobby) or 60 seconds (Pro)
- Cold starts ~1-2 seconds

---

## 💡 KEY TAKEAWAYS FOR YOUR CODER

1. **All server code is in `/app/api/`**
   - 6 API routes total
   - Each handles specific functionality

2. **Two AI providers:**
   - OpenAI GPT-4o: Main test generation
   - Anthropic Claude: Study guides & explanations

3. **Database operations:**
   - Uses Supabase PostgreSQL
   - Service role key for server
   - Anon key for client (with RLS protection)

4. **Security is solid:**
   - API keys never exposed
   - Input validation on all routes
   - Error handling without info leakage

5. **To add new server functionality:**
   - Create new file: `/app/api/my-feature/route.ts`
   - Export async function: `export async function POST(request: Request) {}`
   - Client calls it: `fetch('/api/my-feature', { method: 'POST', ... })`

---

## 📝 SUMMARY

**Your server-side code consists of:**
- ✅ 6 API routes in `/app/api/`
- ✅ OpenAI integration for AI test generation
- ✅ Anthropic Claude for study guides & explanations
- ✅ Supabase database operations
- ✅ Proper security (API keys protected)
- ✅ Error handling and validation
- ✅ All running on Vercel serverless functions

**Total lines of server code:** ~800 lines across 6 files

**What it can do:**
- Generate custom AI tests
- Create study guide content
- Explain CBA sections in plain English
- Manage user notes (CRUD)
- Save test results
- Fetch CBA content from database

This is a solid, production-ready server architecture! 🎉
