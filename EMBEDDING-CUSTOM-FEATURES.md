# Embedding Your Custom Features in Thinkific

## ✅ YES - You Keep 100% of Your Custom Features!

**What you've built:**
- AI Test Generator (OpenAI)
- Scenario Mode (100+ scenarios)
- Flashcards (1000+ cards)
- Study Guide (Claude explanations)
- Notes System
- Test History & Analytics

**All of these get embedded INTO Thinkific.**

---

## 🏗️ ARCHITECTURE

```
Thinkific Course Structure
│
├─ Module 1: Salary Cap Basics
│  ├─ Lesson 1: Introduction (Thinkific video/text)
│  ├─ Lesson 2: Basic Quiz (Thinkific's quiz engine)
│  └─ Lesson 3: 🤖 AI Test Generator (YOUR APP - embedded)
│
├─ Module 2: Luxury Tax
│  ├─ Lesson 1: Overview (Thinkific content)
│  ├─ Lesson 2: 📋 Scenario Practice (YOUR APP - embedded)
│  └─ Lesson 3: 🃏 Flashcards (YOUR APP - embedded)
│
└─ Module 3: Final Exam
   └─ 🤖 Adaptive AI Test (YOUR APP - embedded)
```

**Students see:** One seamless experience
**Behind the scenes:** Mix of Thinkific + your custom apps

---

## 💻 IMPLEMENTATION OPTIONS

### **Option 1: iFrame Embeds** ⭐⭐⭐⭐⭐ (RECOMMENDED)

**How it works:**
Your Next.js app runs on Vercel, Thinkific embeds it via iframe.

**Step 1: Add Embed Mode to Your App**

```typescript
// /app/ai-generator/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function AIGeneratorPage() {
  const searchParams = useSearchParams();
  const isEmbed = searchParams.get('embed') === 'true';
  const thinkificUserId = searchParams.get('user_id');
  
  const [testConfig, setTestConfig] = useState({
    topics: [],
    difficulty: 'medium',
    questionCount: 20
  });
  
  return (
    <div className={isEmbed ? 'min-h-screen p-4' : 'container mx-auto'}>
      {/* Hide navigation/header when embedded */}
      {!isEmbed && <Header />}
      
      {/* Your AI Test Generator UI */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">
          Generate Your Custom Test
        </h2>
        
        {/* Your existing UI */}
        <TopicSelector onChange={(topics) => setTestConfig({...testConfig, topics})} />
        <DifficultySelector onChange={(diff) => setTestConfig({...testConfig, difficulty: diff})} />
        <QuestionCountSelector onChange={(count) => setTestConfig({...testConfig, questionCount: count})} />
        
        <button 
          onClick={() => generateTest(testConfig)}
          className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6"
        >
          Generate Test
        </button>
      </div>
      
      {/* When embedded, send results to parent */}
      {isEmbed && (
        <script dangerouslySetInnerHTML={{__html: `
          window.addEventListener('test_complete', function(event) {
            // Send result to Thinkific
            window.parent.postMessage({
              type: 'agentprep_test_complete',
              score: event.detail.score,
              userId: '${thinkificUserId}'
            }, '*');
          });
        `}} />
      )}
    </div>
  );
}
```

**Step 2: Embed in Thinkific Lesson**

```html
<!-- In Thinkific Lesson HTML Content -->
<div class="agentprep-feature">
  <h2>🤖 AI-Powered Test Generator</h2>
  <p>Create a personalized practice test on any NBA CBA topic using AI.</p>
  
  <iframe 
    src="https://agentprep.vercel.app/ai-generator?embed=true&user_id={{user.id}}"
    width="100%"
    height="900px"
    frameborder="0"
    style="border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"
    allow="clipboard-write"
  ></iframe>
</div>

<style>
  .agentprep-feature {
    margin: 2rem 0;
    padding: 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    color: white;
  }
</style>
```

**Step 3: Same for Other Features**

```html
<!-- Scenario Mode -->
<iframe 
  src="https://agentprep.vercel.app/scenarios?embed=true&user_id={{user.id}}"
  width="100%"
  height="800px"
></iframe>

<!-- Flashcards -->
<iframe 
  src="https://agentprep.vercel.app/flashcards?embed=true&user_id={{user.id}}"
  width="100%"
  height="700px"
></iframe>

<!-- Study Guide -->
<iframe 
  src="https://agentprep.vercel.app/guide?embed=true&category=salary-cap"
  width="100%"
  height="1000px"
></iframe>

<!-- Notes -->
<iframe 
  src="https://agentprep.vercel.app/notes?embed=true&user_id={{user.id}}"
  width="100%"
  height="600px"
></iframe>
```

---

### **Option 2: Custom Domain + Direct Links** ⭐⭐⭐⭐

**How it works:**
Keep your app completely separate, just link to it from Thinkific.

**In Thinkific:**
```html
<div class="study-tools">
  <h3>Advanced Study Tools</h3>
  <div class="tool-grid">
    <a href="https://agentprep.vercel.app/ai-generator?user={{user.id}}" 
       target="_blank" 
       class="tool-card">
      <div class="icon">🤖</div>
      <h4>AI Test Generator</h4>
      <p>Create custom tests with AI</p>
    </a>
    
    <a href="https://agentprep.vercel.app/scenarios?user={{user.id}}" 
       target="_blank" 
       class="tool-card">
      <div class="icon">📋</div>
      <h4>Expert Scenarios</h4>
      <p>100+ real-world situations</p>
    </a>
    
    <a href="https://agentprep.vercel.app/flashcards?user={{user.id}}" 
       target="_blank" 
       class="tool-card">
      <div class="icon">🃏</div>
      <h4>AI Flashcards</h4>
      <p>1000+ adaptive flashcards</p>
    </a>
    
    <a href="https://agentprep.vercel.app/notes?user={{user.id}}" 
       target="_blank" 
       class="tool-card">
      <div class="icon">📝</div>
      <h4>My Notes</h4>
      <p>Study notes with AI explanations</p>
    </a>
  </div>
</div>

<style>
  .tool-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin-top: 1.5rem;
  }
  
  .tool-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    text-decoration: none;
    color: #333;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: transform 0.2s;
  }
  
  .tool-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 12px rgba(0,0,0,0.15);
  }
  
  .tool-card .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
</style>
```

**Pros:**
- Simplest implementation
- Students see your full app
- More screen space

**Cons:**
- Opens in new tab (slight friction)
- Less "seamless" feeling

---

### **Option 3: Custom JavaScript Integration** ⭐⭐⭐⭐⭐ (MOST POWERFUL)

**How it works:**
Inject JavaScript that dynamically loads your features into Thinkific pages.

**In Thinkific Site Settings → Code & Analytics:**

```html
<script>
// Detect if we're on a lesson with custom features
document.addEventListener('DOMContentLoaded', function() {
  const customFeatures = document.querySelectorAll('[data-agentprep-feature]');
  
  customFeatures.forEach(feature => {
    const featureType = feature.getAttribute('data-agentprep-feature');
    const userId = '{{user.id}}';
    
    // Dynamically load your custom app
    const container = document.createElement('div');
    container.className = 'agentprep-embed';
    
    if (featureType === 'ai-generator') {
      container.innerHTML = `
        <iframe 
          src="https://agentprep.vercel.app/ai-generator?embed=true&user_id=${userId}"
          width="100%"
          height="900px"
          frameborder="0"
        ></iframe>
      `;
    } else if (featureType === 'scenarios') {
      container.innerHTML = `
        <iframe 
          src="https://agentprep.vercel.app/scenarios?embed=true&user_id=${userId}"
          width="100%"
          height="800px"
          frameborder="0"
        ></iframe>
      `;
    } else if (featureType === 'flashcards') {
      container.innerHTML = `
        <iframe 
          src="https://agentprep.vercel.app/flashcards?embed=true&user_id=${userId}"
          width="100%"
          height="700px"
          frameborder="0"
        ></iframe>
      `;
    }
    
    feature.appendChild(container);
  });
  
  // Listen for messages from embedded apps
  window.addEventListener('message', function(event) {
    if (event.data.type === 'agentprep_test_complete') {
      // Mark lesson as complete in Thinkific
      markLessonComplete(event.data.score);
    }
  });
});

function markLessonComplete(score) {
  // Send completion to Thinkific API
  fetch('/api/v1/progress/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ score: score })
  });
}
</script>
```

**Then in lessons, just add:**
```html
<div data-agentprep-feature="ai-generator"></div>
```

**Pros:**
- Most flexible
- Can add custom logic
- Feels native to Thinkific

**Cons:**
- Requires more setup
- More complex to maintain

---

## 🔄 SYNCING DATA BETWEEN SYSTEMS

### **Pass User Context to Your App**

```typescript
// Your app receives Thinkific user ID via URL parameter
const thinkificUserId = searchParams.get('user_id');

// Map it to your Supabase users
const { data: user } = await supabase
  .from('users')
  .select('*')
  .eq('thinkific_id', thinkificUserId)
  .single();

// If no user exists, create one
if (!user) {
  await supabase.from('users').insert({
    thinkific_id: thinkificUserId,
    created_at: new Date()
  });
}
```

### **Send Completion Back to Thinkific**

```typescript
// /app/api/thinkific-complete/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { userId, lessonId, score } = await request.json();
  
  // Mark lesson complete in Thinkific
  const response = await fetch(
    `https://api.thinkific.com/api/public/v1/enrollments`,
    {
      method: 'POST',
      headers: {
        'X-Auth-API-Key': process.env.THINKIFIC_API_KEY!,
        'X-Auth-Subdomain': 'agentprep',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: userId,
        course_id: lessonId,
        percentage_completed: 100,
        activated_at: new Date().toISOString()
      })
    }
  );
  
  return NextResponse.json({ success: response.ok });
}
```

---

## 🎨 STYLING & BRANDING

### **Make Embedded Content Match Thinkific**

```typescript
// /app/embed/layout.tsx
export default function EmbedLayout({ children }: { children: React.Node }) {
  return (
    <div className="embed-container">
      <style>{`
        /* Match Thinkific's styles */
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background: transparent;
        }
        
        .embed-container {
          padding: 0;
          max-width: 100%;
        }
        
        /* Your custom AgentPrep branding */
        .btn-primary {
          background: linear-gradient(135deg, #1e3a8a 0%, #dc2626 100%);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
        }
      `}</style>
      {children}
    </div>
  );
}
```

---

## 📊 WHAT STUDENT SEES

### **Course Structure:**

```
📚 NBPA Certification Prep Course
│
├─ Welcome & Setup
│  └─ Introduction Video (Thinkific)
│
├─ 📖 Module 1: Salary Cap Fundamentals
│  ├─ Lesson 1.1: Salary Cap Overview (Thinkific text/video)
│  ├─ Lesson 1.2: Practice Quiz (Thinkific's quiz tool)
│  └─ Lesson 1.3: 🤖 AI Test Generator (YOUR EMBEDDED APP)
│     "Click here to generate a custom test on Salary Cap"
│
├─ 📖 Module 2: Luxury Tax
│  ├─ Lesson 2.1: Luxury Tax Explained (Thinkific)
│  ├─ Lesson 2.2: 📋 Expert Scenarios (YOUR EMBEDDED APP)
│  └─ Lesson 2.3: 🃏 Flashcards (YOUR EMBEDDED APP)
│
├─ 📖 Module 3: Exceptions & Rules
│  ├─ Lesson 3.1: All Exceptions (Thinkific)
│  ├─ Lesson 3.2: 📝 Study Notes (YOUR EMBEDDED APP)
│  └─ Lesson 3.3: 🤖 Adaptive Practice (YOUR EMBEDDED APP)
│
└─ 🎓 Final Exam
   └─ Comprehensive AI Test (YOUR EMBEDDED APP)
```

**Student Experience:**
1. Signs up on Thinkific → sees professional course platform
2. Watches intro videos → Thinkific handles this
3. Takes basic quizzes → Thinkific handles this
4. Clicks "AI Test Generator" → sees YOUR embedded app
5. Completes test → syncs back to Thinkific
6. Progress bar updates → automatic
7. Gets certificate → Thinkific handles this

**It's seamless!**

---

## ✅ WHAT YOU KEEP (100%)

**Your Custom Features:**
- ✅ AI Test Generator (OpenAI GPT-4o)
- ✅ Scenario Mode (100+ scenarios)
- ✅ Flashcards (1000+ AI-generated)
- ✅ Study Guide (Claude explanations)
- ✅ Notes System
- ✅ Test History
- ✅ Progress Analytics
- ✅ Your entire database (Supabase)
- ✅ Your AI integrations
- ✅ Your algorithms

**What Thinkific Adds:**
- ✅ User management
- ✅ Payment processing
- ✅ Course structure
- ✅ Certificates
- ✅ Mobile apps
- ✅ Email automation
- ✅ Basic quizzes (for simple stuff)

---

## 🎯 BEST PRACTICES

### **1. Use iFrames for Complex Features**
```html
<!-- Complex, interactive features -->
<iframe src="https://agentprep.vercel.app/ai-generator?embed=true"></iframe>
```

### **2. Use Direct Links for Standalone Tools**
```html
<!-- Tools students use repeatedly -->
<a href="https://agentprep.vercel.app/notes">Open My Notes</a>
```

### **3. Use Thinkific for Simple Content**
```
Videos, text lessons, simple multiple-choice = Thinkific
AI-powered, adaptive, complex = Your app
```

### **4. Cross-Platform Session Management**
```typescript
// Share authentication between systems
const sharedToken = createJWT({
  thinkificId: user.thinkific_id,
  agentprepId: user.id
});
```

---

## 💰 PRICING REMAINS THE SAME

**Students pay Thinkific:**
- $29/month for course access

**Thinkific charges you:**
- $149/month platform fee

**You keep:**
- $29 - $149/30 = $24 per student
- Or raise price to $39/month = $34 profit per student

---

## 🚀 IMPLEMENTATION TIMELINE

### **Week 1:**
- [ ] Sign up for Thinkific Pro
- [ ] Add embed mode to your existing app (add `?embed=true` parameter handling)
- [ ] Test embedding in Thinkific

### **Week 2:**
- [ ] Create course structure in Thinkific
- [ ] Embed all your custom features
- [ ] Set up user sync

### **Week 3:**
- [ ] Test with beta users
- [ ] Fix any iframe/embedding issues
- [ ] Polish student experience

### **Week 4:**
- [ ] Launch!

---

## 💡 KEY POINT

**You're NOT replacing your app.**
**You're just putting it INSIDE Thinkific.**

Your app = Engine
Thinkific = Car Body

Students see one beautiful car.
You focus on making the engine better.

---

Want me to help you add embed mode to your existing features this week? It's literally just adding this to each page:

```typescript
const isEmbed = searchParams.get('embed') === 'true';
if (isEmbed) {
  // Hide navigation
  // Adjust styling
  // Send results to parent window
}
```

That's it!
