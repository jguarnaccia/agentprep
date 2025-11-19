# AgentPrep LMS Integration Guide

## 🎯 INTEGRATION OPTIONS

### Option 1: LTI Integration (Learning Tools Interoperability) ⭐⭐⭐⭐⭐
**Best for:** Enterprise customers (NBA teams, agencies using LearnDash/Canvas/Moodle)

#### What is LTI?
Industry-standard protocol that lets your app integrate with ANY LMS:
- LearnDash (WordPress)
- Canvas
- Moodle  
- Blackboard
- Brightspace
- Any LTI-compliant LMS

#### How It Works:
```
User in LearnDash
    ↓
Clicks "AgentPrep Quiz" 
    ↓
LMS sends secure request to your server
    ↓
Your app authenticates via OAuth
    ↓
User sees embedded AgentPrep content in iframe
    ↓
User completes quiz
    ↓
Your app sends grade back to LMS
    ↓
Grade appears in LearnDash gradebook
```

#### Implementation:

1. **Add LTI Provider Endpoints**

Create: `/app/api/lti/launch/route.ts`
```typescript
// /app/api/lti/launch/route.ts
import { NextResponse } from 'next/server';
import { verifyLTIRequest } from '@/lib/lti';
import { createJWT } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.formData();
    
    // 1. Verify LTI signature (security check)
    const isValid = await verifyLTIRequest(body);
    if (!isValid) {
      return new Response('Invalid LTI signature', { status: 401 });
    }
    
    // 2. Extract LMS user info
    const lmsUserId = body.get('user_id');
    const lmsUserEmail = body.get('lis_person_contact_email_primary');
    const lmsCourseId = body.get('context_id');
    const returnUrl = body.get('launch_presentation_return_url');
    
    // 3. Create or find AgentPrep user
    const { data: user } = await supabase
      .from('lti_users')
      .upsert({
        lms_user_id: lmsUserId,
        lms_email: lmsUserEmail,
        lms_course_id: lmsCourseId,
        lms_return_url: returnUrl
      })
      .select()
      .single();
    
    // 4. Create session token
    const token = await createJWT({ userId: user.id, lmsUserId });
    
    // 5. Redirect to embedded AgentPrep interface
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/lti/study?token=${token}`
    );
    
  } catch (error) {
    console.error('LTI launch error:', error);
    return new Response('LTI launch failed', { status: 500 });
  }
}
```

2. **Grade Passback Endpoint**

Create: `/app/api/lti/grade-passback/route.ts`
```typescript
// /app/api/lti/grade-passback/route.ts
import { NextResponse } from 'next/server';
import { sendLTIGrade } from '@/lib/lti';

export async function POST(request: Request) {
  try {
    const { userId, score, maxScore } = await request.json();
    
    // 1. Get LTI connection info
    const { data: ltiUser } = await supabase
      .from('lti_users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (!ltiUser.lms_outcome_service_url) {
      return NextResponse.json({ 
        error: 'No grade passback URL configured' 
      }, { status: 400 });
    }
    
    // 2. Calculate grade (0.0 - 1.0)
    const grade = score / maxScore;
    
    // 3. Send grade back to LMS
    const success = await sendLTIGrade({
      serviceUrl: ltiUser.lms_outcome_service_url,
      sourcedId: ltiUser.lms_result_sourcedid,
      grade: grade,
      consumerKey: process.env.LTI_CONSUMER_KEY,
      consumerSecret: process.env.LTI_CONSUMER_SECRET
    });
    
    if (success) {
      return NextResponse.json({ 
        message: 'Grade sent to LMS successfully' 
      });
    } else {
      throw new Error('Failed to send grade');
    }
    
  } catch (error) {
    console.error('Grade passback error:', error);
    return NextResponse.json({ 
      error: 'Failed to send grade to LMS' 
    }, { status: 500 });
  }
}
```

3. **LTI Helper Library**

Create: `/lib/lti.ts`
```typescript
// /lib/lti.ts
import crypto from 'crypto';
import OAuth from 'oauth-1.0a';

// Verify LTI request signature
export async function verifyLTIRequest(formData: FormData): Promise<boolean> {
  const consumerKey = formData.get('oauth_consumer_key');
  const signature = formData.get('oauth_signature');
  
  // Get consumer secret from database
  const { data: consumer } = await supabase
    .from('lti_consumers')
    .select('secret')
    .eq('key', consumerKey)
    .single();
  
  if (!consumer) return false;
  
  // Verify OAuth signature
  const oauth = new OAuth({
    consumer: {
      key: consumerKey as string,
      secret: consumer.secret
    },
    signature_method: 'HMAC-SHA1',
    hash_function: (baseString, key) => {
      return crypto
        .createHmac('sha1', key)
        .update(baseString)
        .digest('base64');
    }
  });
  
  // Compare signatures
  const requestData = {
    url: formData.get('launch_url') as string,
    method: 'POST',
    data: Object.fromEntries(formData.entries())
  };
  
  const expectedSignature = oauth.getSignature(requestData, consumer.secret);
  return signature === expectedSignature;
}

// Send grade back to LMS
export async function sendLTIGrade(params: {
  serviceUrl: string;
  sourcedId: string;
  grade: number;
  consumerKey: string;
  consumerSecret: string;
}): Promise<boolean> {
  const { serviceUrl, sourcedId, grade, consumerKey, consumerSecret } = params;
  
  // Build XML payload
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<imsx_POXEnvelopeRequest xmlns="http://www.imsglobal.org/services/ltiv1p1/xsd/imsoms_v1p0">
  <imsx_POXHeader>
    <imsx_POXRequestHeaderInfo>
      <imsx_version>V1.0</imsx_version>
      <imsx_messageIdentifier>${Date.now()}</imsx_messageIdentifier>
    </imsx_POXRequestHeaderInfo>
  </imsx_POXHeader>
  <imsx_POXBody>
    <replaceResultRequest>
      <resultRecord>
        <sourcedGUID>
          <sourcedId>${sourcedId}</sourcedId>
        </sourcedGUID>
        <result>
          <resultScore>
            <language>en</language>
            <textString>${grade.toFixed(2)}</textString>
          </resultScore>
        </result>
      </resultRecord>
    </replaceResultRequest>
  </imsx_POXBody>
</imsx_POXEnvelopeRequest>`;

  // Sign request with OAuth
  const oauth = new OAuth({
    consumer: { key: consumerKey, secret: consumerSecret },
    signature_method: 'HMAC-SHA1',
    hash_function: (baseString, key) => {
      return crypto
        .createHmac('sha1', key)
        .update(baseString)
        .digest('base64');
    }
  });
  
  const authHeader = oauth.toHeader(
    oauth.authorize({ url: serviceUrl, method: 'POST' })
  );
  
  // Send to LMS
  const response = await fetch(serviceUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/xml',
      'Authorization': authHeader.Authorization
    },
    body: xml
  });
  
  return response.ok;
}
```

4. **Database Schema for LTI**

```sql
-- LTI Consumers (each LMS installation)
CREATE TABLE lti_consumers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(255) UNIQUE NOT NULL,
  secret VARCHAR(255) NOT NULL,
  name VARCHAR(200),
  created_at TIMESTAMP DEFAULT NOW()
);

-- LTI Users (mapped to LMS users)
CREATE TABLE lti_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lms_user_id VARCHAR(255) NOT NULL,
  lms_email VARCHAR(255),
  lms_course_id VARCHAR(255),
  lms_outcome_service_url TEXT,
  lms_result_sourcedid VARCHAR(255),
  lms_return_url TEXT,
  agentprep_user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  last_launch_at TIMESTAMP,
  UNIQUE(lms_user_id, lms_course_id)
);

-- LTI Sessions
CREATE TABLE lti_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lti_user_id UUID REFERENCES lti_users(id),
  session_token VARCHAR(500),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- LTI Grade Events (audit log)
CREATE TABLE lti_grade_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lti_user_id UUID REFERENCES lti_users(id),
  score DECIMAL,
  max_score DECIMAL,
  grade_sent DECIMAL,
  success BOOLEAN,
  response_body TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

5. **Embedded Interface**

Create: `/app/lti/study/page.tsx`
```typescript
// /app/lti/study/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function LTIStudyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [questions, setQuestions] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState(null);
  
  // Load questions
  useEffect(() => {
    loadQuestions();
  }, []);
  
  async function loadQuestions() {
    const response = await fetch('/api/lti/get-questions', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    setQuestions(data.questions);
  }
  
  async function submitAnswer(questionId: number, answer: number) {
    // Save answer
    setCurrentAnswer(answer);
  }
  
  async function finishQuiz() {
    // Calculate score
    const score = calculateScore(questions, answers);
    
    // Send grade back to LMS
    await fetch('/api/lti/grade-passback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        score: score,
        maxScore: questions.length
      })
    });
    
    // Show completion message
    alert('Quiz complete! Your grade has been sent to your LMS.');
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">AgentPrep CBA Quiz</h1>
        
        {/* Render questions */}
        {questions.map((q, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow-lg mb-4">
            <h3 className="font-semibold mb-4">{q.question}</h3>
            {q.options.map((opt, optIdx) => (
              <button
                key={optIdx}
                onClick={() => submitAnswer(q.id, optIdx)}
                className="block w-full text-left p-3 mb-2 rounded hover:bg-blue-50"
              >
                {opt}
              </button>
            ))}
          </div>
        ))}
        
        <button
          onClick={finishQuiz}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
        >
          Submit Quiz
        </button>
      </div>
    </div>
  );
}
```

#### Benefits of LTI:
✅ Works with ANY LMS (LearnDash, Canvas, Moodle, etc.)
✅ Automatic grade sync
✅ Single sign-on (SSO)
✅ Users stay in their LMS
✅ Industry standard (trusted by enterprises)

#### Pricing Model:
- **Setup fee:** $5,000-10,000 per organization
- **Annual license:** $25,000-50,000 per year
- **Per-seat pricing:** $100-200 per user/year

---

### Option 2: LearnDash Plugin (WordPress) ⭐⭐⭐⭐
**Best for:** Agencies/consultants using WordPress + LearnDash

#### How It Works:
Build a WordPress plugin that:
1. Adds AgentPrep content to LearnDash courses
2. Embeds your quizzes/flashcards
3. Syncs grades to LearnDash
4. Uses LearnDash's existing user system

#### Implementation:

Create WordPress plugin: `agentprep-learndash/`

```php
<?php
/**
 * Plugin Name: AgentPrep for LearnDash
 * Description: Integrate AgentPrep CBA training into LearnDash courses
 * Version: 1.0.0
 */

// Register AgentPrep quiz type in LearnDash
add_action('learndash_quiz_content', 'agentprep_quiz_content', 10, 2);

function agentprep_quiz_content($quiz_id, $quiz) {
    // Check if this is an AgentPrep quiz
    $is_agentprep = get_post_meta($quiz_id, '_agentprep_enabled', true);
    
    if ($is_agentprep) {
        $api_key = get_option('agentprep_api_key');
        $quiz_config = get_post_meta($quiz_id, '_agentprep_config', true);
        
        // Embed AgentPrep iframe
        echo '<div id="agentprep-quiz-container">';
        echo '<iframe 
            src="' . AGENTPREP_API_URL . '/embed/quiz?config=' . urlencode($quiz_config) . '" 
            width="100%" 
            height="800px"
            frameborder="0">
        </iframe>';
        echo '</div>';
        
        // Listen for completion
        echo '<script>
            window.addEventListener("message", function(event) {
                if (event.data.type === "agentprep_quiz_complete") {
                    // Send grade to LearnDash
                    submitGradeToLearnDash(event.data.score);
                }
            });
        </script>';
    }
}

// Handle grade submission
add_action('wp_ajax_agentprep_submit_grade', 'agentprep_submit_grade');

function agentprep_submit_grade() {
    $user_id = get_current_user_id();
    $quiz_id = $_POST['quiz_id'];
    $score = $_POST['score'];
    
    // Save to LearnDash
    learndash_update_user_activity([
        'user_id' => $user_id,
        'post_id' => $quiz_id,
        'activity_type' => 'quiz',
        'activity_status' => 'completed',
        'activity_score' => $score
    ]);
    
    wp_send_json_success();
}

// Add settings page
add_action('admin_menu', 'agentprep_add_admin_menu');

function agentprep_add_admin_menu() {
    add_options_page(
        'AgentPrep Settings',
        'AgentPrep',
        'manage_options',
        'agentprep',
        'agentprep_settings_page'
    );
}

function agentprep_settings_page() {
    ?>
    <div class="wrap">
        <h1>AgentPrep for LearnDash</h1>
        <form method="post" action="options.php">
            <?php settings_fields('agentprep'); ?>
            <table class="form-table">
                <tr>
                    <th>API Key</th>
                    <td>
                        <input 
                            type="text" 
                            name="agentprep_api_key" 
                            value="<?php echo get_option('agentprep_api_key'); ?>"
                            class="regular-text"
                        />
                    </td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}
?>
```

#### Benefits:
✅ Native LearnDash integration
✅ Familiar WordPress interface
✅ Easy for agencies to install
✅ Can sell on WordPress.org plugin directory

#### Pricing:
- **Plugin:** $297 one-time or $97/year subscription
- **Enterprise License:** $997/year (unlimited sites)

---

### Option 3: API-First Integration ⭐⭐⭐
**Best for:** Custom integrations, flexibility

#### Create API Endpoints for LMS Consumption:

1. **Authentication Endpoint**
```typescript
// /app/api/lms/auth/route.ts
export async function POST(request: Request) {
  const { api_key, lms_user_id } = await request.json();
  
  // Verify API key
  const { data: org } = await supabase
    .from('lms_organizations')
    .select('*')
    .eq('api_key', api_key)
    .single();
  
  if (!org) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }
  
  // Create session token
  const token = await createJWT({ orgId: org.id, lmsUserId: lms_user_id });
  
  return NextResponse.json({ token });
}
```

2. **Get Questions Endpoint**
```typescript
// /app/api/lms/questions/route.ts
export async function GET(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  const { orgId } = await verifyJWT(token);
  
  // Get questions for this org
  const { data: questions } = await supabase
    .from('questions')
    .select('*')
    .eq('organization_id', orgId)
    .limit(20);
  
  return NextResponse.json({ questions });
}
```

3. **Submit Results Endpoint**
```typescript
// /app/api/lms/submit-results/route.ts
export async function POST(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  const { lmsUserId, orgId } = await verifyJWT(token);
  
  const { answers, quiz_id } = await request.json();
  
  // Calculate score
  const score = calculateScore(answers);
  
  // Save result
  await supabase.from('lms_results').insert({
    organization_id: orgId,
    lms_user_id: lmsUserId,
    quiz_id,
    score,
    answers
  });
  
  return NextResponse.json({ score, passed: score >= 70 });
}
```

#### Documentation for LMS Admins:

```markdown
# AgentPrep API Documentation

## Authentication
POST /api/lms/auth
Body: { "api_key": "your_key", "lms_user_id": "user123" }
Returns: { "token": "jwt_token" }

## Get Questions
GET /api/lms/questions?topic=salary-cap&count=20
Headers: Authorization: Bearer {token}
Returns: { "questions": [...] }

## Submit Results
POST /api/lms/submit-results
Headers: Authorization: Bearer {token}
Body: { "quiz_id": "123", "answers": [0,2,1,3...] }
Returns: { "score": 85, "passed": true }
```

---

### Option 4: SCORM Packages ⭐⭐⭐⭐
**Best for:** Maximum LMS compatibility

#### What is SCORM?
Standard format that works with 99% of LMS platforms.

#### How to Create SCORM Packages:

1. **Install SCORM library:**
```bash
npm install scorm-again
```

2. **Generate SCORM package:**
```typescript
// /scripts/generate-scorm.ts
import { SCORM12 } from 'scorm-again';

export async function generateSCORMPackage(quizId: string) {
  // Get quiz questions
  const { data: quiz } = await supabase
    .from('quizzes')
    .select('*, questions(*)')
    .eq('id', quizId)
    .single();
  
  // Create SCORM-compliant HTML
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <script src="SCORM_API_wrapper.js"></script>
      <script>
        // Initialize SCORM
        var scorm = new SCORM12();
        scorm.initialize();
        
        // Track completion
        function completeQuiz(score) {
          scorm.set('cmi.core.score.raw', score);
          scorm.set('cmi.core.lesson_status', score >= 70 ? 'passed' : 'failed');
          scorm.commit();
          scorm.terminate();
        }
      </script>
    </head>
    <body>
      <!-- Quiz content -->
      ${generateQuizHTML(quiz)}
    </body>
    </html>
  `;
  
  // Package as ZIP
  const zip = await createSCORMZip(html, quiz);
  return zip;
}
```

3. **LMS Admin Downloads SCORM:**
- Goes to AgentPrep dashboard
- Clicks "Export as SCORM"
- Uploads ZIP to their LMS
- Users take quiz in LMS, grades sync automatically

#### Benefits:
✅ Works with ALL LMS platforms
✅ Offline capable
✅ Standard compliance
✅ Easy for LMS admins

---

## 💰 PRICING MODELS

### For LearnDash Plugin:
- **Individual:** $97/year
- **Agency (5 sites):** $297/year
- **Enterprise (unlimited):** $997/year

### For LTI Integration:
- **Setup:** $10,000 one-time
- **Per Organization:** $25,000-50,000/year
- **Per User:** $100-200/year

### For API Access:
- **Starter:** $500/month (1,000 API calls)
- **Professional:** $2,000/month (10,000 API calls)
- **Enterprise:** Custom pricing

### For SCORM Packages:
- **Per Package:** $499 one-time
- **Unlimited:** $2,997/year
- **White-label:** $9,997/year

---

## 🚀 GO-TO-MARKET STRATEGY

### Phase 1: LearnDash Plugin (Month 1-2)
1. Build WordPress plugin
2. List on WordPress.org
3. Target sports agencies using LearnDash
4. **Revenue Goal:** 50 customers × $97/year = $4,850/year

### Phase 2: LTI Integration (Month 3-6)
1. Build LTI provider
2. Get LTI certification
3. Target enterprise customers
4. **Revenue Goal:** 5 orgs × $30,000/year = $150,000/year

### Phase 3: SCORM Packages (Month 6-12)
1. Build SCORM generator
2. Target all LMS platforms
3. Self-service downloads
4. **Revenue Goal:** 100 packages × $499 = $49,900/year

---

## 📊 TOTAL ADDRESSABLE MARKET

**Organizations Using LMS:**
- 200+ sports agencies
- 30 NBA teams
- 32 NFL teams
- 30 MLB teams
- Universities with sports management programs

**Conservative Estimates:**
- 50 agencies × $1,000/year = $50,000
- 10 teams × $50,000/year = $500,000
- 20 universities × $10,000/year = $200,000

**Total: $750,000/year from LMS integrations alone**

---

## 🎯 RECOMMENDATION

**Start with LearnDash Plugin** because:
1. Fastest to build (2-4 weeks)
2. Lowest barrier to entry
3. Large WordPress/LearnDash market
4. Proves concept before LTI investment

**Then add LTI** for enterprise deals with NBA/NFL teams.

Want me to help you build the LearnDash plugin first?
