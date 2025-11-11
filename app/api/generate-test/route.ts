import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'placeholder-key',
});

export async function POST(request: NextRequest) {
  try {
    const { topic, difficulty, questionCount, questionFormat } = await request.json();

    // Validate inputs
    if (!topic || !difficulty || !questionCount || !questionFormat) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Build the prompt based on question format
    const prompt = buildPrompt(topic, difficulty, questionCount, questionFormat);

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract the response text
    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';

    // Parse the JSON response
    const questions = JSON.parse(responseText);

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error generating test:', error);
    return NextResponse.json(
      { error: 'Failed to generate test', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function buildPrompt(
  topic: string,
  difficulty: string,
  questionCount: number,
  questionFormat: string
): string {
  const formatInstructions = getFormatInstructions(questionFormat);
  
  return `You are an expert NBA Collective Bargaining Agreement (CBA) educator creating practice test questions for aspiring sports agents studying for their NBPA certification exam.

**Topic**: ${topic}
**Difficulty**: ${difficulty}
**Number of Questions**: ${questionCount}
**Question Format**: ${questionFormat}

${formatInstructions}

**Requirements**:
1. Questions must be accurate and based on actual NBA CBA rules
2. Difficulty level should be ${difficulty}:
   - Easy: Basic definitions and straightforward concepts
   - Medium: Application of rules to common scenarios
   - Hard: Complex multi-part scenarios requiring deep CBA knowledge
3. Each question should test practical knowledge an agent would need
4. Explanations should be clear, detailed, and educational
5. Use realistic NBA examples (teams, salary figures, scenarios)

**Critical**: Return ONLY valid JSON, no additional text before or after. The response must be parseable by JSON.parse().

Generate ${questionCount} high-quality test questions now.`;
}

function getFormatInstructions(format: string): string {
  switch (format) {
    case 'multiple_choice':
      return `**Format Instructions for Multiple Choice**:
Return a JSON array of objects with this exact structure:
[
  {
    "question": "Clear, specific question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "explanation": "Detailed explanation of why the answer is correct and why other options are wrong"
  }
]

- "correct" is the index (0-3) of the correct answer in the options array
- Include 4 options for each question
- Make incorrect options plausible but clearly wrong
- Explanations should reference specific CBA rules/articles when possible`;

    case 'true_false':
      return `**Format Instructions for True/False**:
Return a JSON array of objects with this exact structure:
[
  {
    "question": "Statement that is either true or false",
    "options": ["True", "False"],
    "correct": 0,
    "explanation": "Detailed explanation of why the statement is true or false, with CBA references"
  }
]

- "correct" is either 0 (True) or 1 (False)
- Statements should be clear and unambiguous
- Avoid trick questions; focus on testing knowledge
- Explanations should clarify the rule and common misconceptions`;

    case 'scenario':
      return `**Format Instructions for Scenario Questions**:
Return a JSON array of objects with this exact structure:
[
  {
    "question": "Detailed scenario describing a realistic NBA situation, followed by a specific question about how CBA rules apply",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "explanation": "Step-by-step analysis of the scenario, explaining which CBA rules apply and why the correct answer is right"
  }
]

- Scenarios should be 2-4 sentences setting up a realistic situation
- Include specific details (salary amounts, dates, team situations)
- Question should require applying multiple CBA concepts
- Explanations should walk through the CBA logic step-by-step`;

    default:
      return '';
  }
}
