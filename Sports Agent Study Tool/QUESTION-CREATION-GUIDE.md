# Question Creation Guide for AgentPrep

## Purpose
This guide will help you systematically create high-quality questions from the NBA CBA to build the comprehensive 500+ question database.

## Question Template

```json
{
  "id": "[article]-q[###]",
  "question": "[Clear, specific question based on CBA content]",
  "options": [
    "[Option A - could be correct]",
    "[Option B - could be correct]",
    "[Option C - correct answer]",
    "[Option D - could be correct]"
  ],
  "correct": 2,
  "explanation": "[Why this is correct, with specific CBA reference and context]",
  "category": "[salary-cap|contracts|free-agency|draft|agent-regulations|benefits|conduct|health|arbitration|drugs]",
  "difficulty": "[easy|medium|hard]",
  "source": "Article [Roman Numeral], Section [#]"
}
```

## Step-by-Step Process

### 1. Choose an Article to Cover
Start with high-priority articles:
- Article II (Contracts)
- Article X (Draft)  
- Article XI (Free Agency)
- Article XXXVI (Player Agents)

### 2. Read the Article Section by Section
Don't try to read everything at once. Go section by section.

### 3. Identify Testable Concepts
Look for:
- ✅ Specific numbers (percentages, dollar amounts, time periods)
- ✅ Requirements or conditions ("must," "cannot," "shall")
- ✅ Exceptions to rules
- ✅ Definitions of terms
- ✅ Timelines and deadlines
- ✅ Comparison between different types (e.g., RFA vs UFA)

### 4. Create Questions Using These Patterns

#### Pattern 1: Definition Questions (EASY)
**Format**: "What is [term]?"
**Example**:
```
Q: What is a Restricted Free Agent?
A: A player whose current team has the right to match any offer sheet he receives
```

#### Pattern 2: Numerical Questions (EASY-MEDIUM)
**Format**: "What is the [percentage/amount/time period] for [thing]?"
**Example**:
```
Q: What is the maximum percentage an NBAPA certified agent can charge?
A: 4%
```

#### Pattern 3: Comparison Questions (MEDIUM)
**Format**: "What is the difference between [X] and [Y]?"
**Example**:
```
Q: What is the difference between Restricted and Unrestricted Free Agency?
A: Restricted FA allows current team to match offers; Unrestricted has no such restriction
```

#### Pattern 4: Conditional Questions (MEDIUM-HARD)
**Format**: "When can [action] happen?" or "Under what circumstances..."
**Example**:
```
Q: When can a team use the Disabled Player Exception?
A: When a physician certifies a player is substantially likely unable to play through June 15
```

#### Pattern 5: Calculation Questions (HARD)
**Format**: "How much/how many [thing] in [scenario]?"
**Example**:
```
Q: If a team over the cap trades away $10M in salary, how much can they receive back?
A: Up to $12.5M + $100,000 (125% + $100K rule)
```

#### Pattern 6: Scenario Questions (HARD)
**Format**: "In [complex scenario], what happens?"
**Example**:
```
Q: A team above the Second Apron wants to trade 3 players. Can they?
A: No, Second Apron teams cannot aggregate salaries - only one player at a time
```

## Quality Checklist

Before adding a question to the database, verify:

- [ ] Question is clear and unambiguous
- [ ] Only ONE answer is definitively correct
- [ ] Wrong answers are plausible (not obviously incorrect)
- [ ] Explanation includes WHY it's correct
- [ ] Source citation is specific (Article X, Section Y)
- [ ] Difficulty rating is accurate
- [ ] Category is appropriate
- [ ] No spelling or grammar errors
- [ ] ID follows naming convention

## Common Mistakes to Avoid

❌ **Vague Questions**
Bad: "What are the rules about contracts?"
Good: "What is the maximum contract length using Full Bird Rights?"

❌ **Obviously Wrong Options**
Bad: Options include "unlimited" when clearly there's a limit
Good: All options are reasonable numbers

❌ **No Explanation**
Bad: Just saying "The answer is C"
Good: "The answer is C because Article VII, Section 6(b) states..."

❌ **Generic Categories**
Bad: Category: "General"
Good: Category: "salary-cap"

## Difficulty Guidelines

### EASY (30% of questions)
- Basic definitions
- Simple yes/no determinations
- Widely known facts
- Single-step reasoning
**Example**: "What type of salary cap does the NBA use? Hard cap or soft cap?"

### MEDIUM (50% of questions)
- Application of rules
- Comparisons between concepts
- Multi-step reasoning
- Conditional situations
**Example**: "If a player has been with a team for 2 years, does he qualify for Full Bird Rights or Early Bird Rights?"

### HARD (20% of questions)
- Complex calculations
- Multiple exception interactions
- Edge cases
- Combining multiple rules
**Example**: "A team above the Second Apron wants to use a sign-and-trade to acquire a player. Can they, and if not, why?"

## Example: Creating Questions from a CBA Section

**CBA Text**: 
"The Non-Taxpayer Mid-Level Salary Exception allows a team to sign one or more players for up to four (4) seasons, with the first year salary not to exceed the amount calculated in Section 6(e)(1)."

**Questions to Create**:

1. EASY - What is it?
```
Q: What is the Non-Taxpayer Mid-Level Exception?
A: A salary cap exception allowing over-the-cap teams to sign players
```

2. EASY - How long?
```
Q: What is the maximum contract length using the Non-Taxpayer MLE?
A: 4 years
```

3. MEDIUM - Can they use it?
```
Q: Can a team above the First Apron use the full Non-Taxpayer MLE?
A: No, First Apron teams are limited to the Taxpayer MLE
```

4. HARD - Complex scenario
```
Q: A team at $5M below the cap uses the Non-Taxpayer MLE. What happens?
A: They lose their cap room and are treated as an over-the-cap team
```

## Batch Creation Workflow

1. **Choose Article** - Pick one article to focus on
2. **Set Goal** - Decide how many questions (20-50 depending on article length)
3. **Read Section** - Read one section at a time
4. **Extract Facts** - List 5-10 testable facts per section
5. **Write Questions** - Create 1-2 questions per fact
6. **Review** - Check quality against checklist
7. **Format** - Convert to JSON format
8. **Test** - Read questions aloud to check clarity
9. **Save** - Add to batch file

## Productivity Tips

- Set a goal: 10 questions per work session
- Use voice dictation for faster writing
- Keep the CBA document open for reference
- Take breaks every 30 minutes
- Review previous questions for consistency
- Don't aim for perfection on first draft
- Batch similar questions together

## JSON Formatting Helper

Use this Python script to validate JSON:
```python
import json

with open('questions.json', 'r') as f:
    data = json.load(f)
    print(f"Valid JSON! Total questions: {len(data['questions'])}")
```

## Next Article Recommendations

**Easiest to Hardest**:
1. Article XXXVI (Player Agents) - Short, straightforward
2. Article X (Draft) - Clear rules, numbers
3. Article VIII (Rookie Scale) - Mostly tables and calculations
4. Article XI (Free Agency) - Well-defined categories
5. Article II (Contracts) - Longest, most detailed

Start with easier articles to build momentum!

---

**Pro Tip**: Aim for 10-15 high-quality questions per work session. Quality over quantity. It's better to have 50 excellent questions than 100 mediocre ones.

**Remember**: These questions will help real people pass their agent certification exams and start their careers. Make them count! 🎯
