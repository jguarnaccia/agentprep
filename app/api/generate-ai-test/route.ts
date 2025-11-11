import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'placeholder-key',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
);

// CBA Topics for test generation
const CBA_TOPICS = {
  'salary-cap': 'Salary Cap System',
  'luxury-tax': 'Luxury Tax',
  'aprons': 'Apron Restrictions',
  'exceptions': 'Salary Cap Exceptions',
  'free-agency': 'Free Agency Rules',
  'trades': 'Trade Rules',
  'rookie-scale': 'Rookie Contracts',
  'max-salary': 'Maximum Salaries',
  'min-salary': 'Minimum Salaries',
  'extensions': 'Contract Extensions',
  'two-way': 'Two-Way Contracts',
  'draft': 'NBA Draft',
  'health': 'Player Health & Safety',
  'conduct': 'Player Conduct',
  'g-league': 'G League',
  'arbitration': 'Dispute Resolution',
  'benefits': 'Player Benefits'
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topics, difficulties, formats, questionCount } = body;

    // Validate inputs
    if (!topics || !Array.isArray(topics) || topics.length === 0) {
      return NextResponse.json(
        { error: 'Topics are required' },
        { status: 400 }
      );
    }

    if (!questionCount || questionCount < 5 || questionCount > 50) {
      return NextResponse.json(
        { error: 'Question count must be between 5 and 50' },
        { status: 400 }
      );
    }

    // Handle multiple difficulties (default to medium if not provided)
    const selectedDifficulties = difficulties && difficulties.length > 0 ? difficulties : ['medium'];
    const difficultyText = selectedDifficulties.length === 1 
      ? selectedDifficulties[0]
      : `mix of ${selectedDifficulties.join(', ')}`;

    // Handle multiple formats (default to multiple-choice if not provided)
    const selectedFormats = formats && formats.length > 0 ? formats : ['multiple-choice'];
    const formatText = selectedFormats.join(', ');

    // Fetch relevant CBA content from database
    let query = supabase
      .from('cba_content')
      .select('*')
      .eq('type', 'section');

    const { data: cbaContent, error: fetchError } = await query;

    if (fetchError) {
      console.error('Error fetching CBA content:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch CBA content' },
        { status: 500 }
      );
    }

    // Build context from CBA content
    const contextText = cbaContent
      ?.slice(0, 20) // Limit to first 20 sections to stay within token limits
      .map(section => `
Article ${section.article_number} - ${section.article_title}
Section ${section.section_number}: ${section.title}
${section.content.substring(0, 500)}...
      `)
      .join('\n\n');

    // Generate prompt for OpenAI
    const prompt = `You are an expert NBA agent educator creating practice test questions for the NBPA certification exam.

**Test Configuration:**
- Topics: ${topics.map((t: string) => CBA_TOPICS[t as keyof typeof CBA_TOPICS] || t).join(', ')}
- Difficulty: ${difficultyText}
- Question Formats: ${formatText}
- Number of Questions: ${questionCount}

**CBA Reference Content:**
${contextText}

**Instructions:**
Generate exactly ${questionCount} questions for the NBPA agent certification exam.

**Question Format Guidelines:**
${selectedFormats.includes('multiple-choice') ? '- **Multiple Choice**: 4 options (A, B, C, D), one correct answer' : ''}
${selectedFormats.includes('true-false') ? '- **True/False**: 2 options (True, False), one correct answer' : ''}
${selectedFormats.includes('scenario') ? '- **Scenario**: Real-world situation with 4 multiple choice options analyzing the scenario' : ''}

**Difficulty Guidelines:**
${selectedDifficulties.includes('easy') ? '- **Easy**: Direct facts, simple definitions, straightforward rules' : ''}
${selectedDifficulties.includes('medium') ? '- **Medium**: Calculations, multi-step reasoning, application of rules' : ''}
${selectedDifficulties.includes('hard') ? '- **Hard**: Complex scenarios, multiple rule interactions, edge cases' : ''}

**Requirements:**
1. Distribute questions across selected formats: ${formatText}
2. Distribute questions across selected difficulties: ${difficultyText}
3. Each question must have proper options based on format
4. Wrong answers should be plausible but clearly incorrect
5. Include detailed explanation citing specific CBA articles and sections
6. Test real exam concepts
7. For True/False questions, use options array: ["True", "False"]
8. For Scenario questions, start with a situation description

**Topics to cover:** ${topics.map((t: string) => CBA_TOPICS[t as keyof typeof CBA_TOPICS] || t).join(', ')}

**Output Format (JSON only, no markdown):**
{
  "questions": [
    {
      "question": "Clear, specific question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_index": 0,
      "explanation": "Detailed explanation citing Article and Section",
      "citation": "Article VII, Section 6(e)",
      "topic": "salary-cap",
      "difficulty": "medium",
      "format": "multiple-choice"
    }
  ]
}

Generate exactly ${questionCount} questions with a good mix of the selected formats and difficulties. Output ONLY valid JSON, no other text.`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert NBA agent educator. Always respond with valid JSON only, no markdown or additional text.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 8000
    });

    // Parse OpenAI's response
    const responseText = completion.choices[0]?.message?.content || '';
    
    // Extract JSON from response (might include markdown)
    let jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in response:', responseText);
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

    const generatedData = JSON.parse(jsonMatch[0]);
    const questions = generatedData.questions;

    // Validate and format questions
    const formattedQuestions = questions.map((q: any, index: number) => ({
      id: index + 1,
      question: q.question,
      options: q.options,
      correct: q.correct_index,
      explanation: q.explanation,
      citation: q.citation || 'CBA Reference',
      topic: q.topic || topics[0],
      difficulty: q.difficulty || selectedDifficulties[0],
      format: q.format || selectedFormats[0],
      source: q.citation || 'AI Generated'
    }));

    // Save test session to database
    const testConfig = {
      topics,
      difficulties: selectedDifficulties,
      difficulty: selectedDifficulties[0], // For backward compatibility
      formats: selectedFormats,
      question_count: questionCount
    };

    const { data: session, error: sessionError } = await supabase
      .from('ai_test_sessions_v2')
      .insert([
        {
          test_config: testConfig,
          questions: formattedQuestions,
          user_id: null
        }
      ])
      .select()
      .single();

    if (sessionError) {
      console.error('Error saving test session:', sessionError);
      console.error('Test config:', testConfig);
      console.error('Formatted questions:', formattedQuestions.length, 'questions');
      return NextResponse.json(
        { 
          error: 'Failed to save test session',
          details: sessionError.message,
          hint: sessionError.hint || 'Check database schema'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      sessionId: session.id,
      questions: formattedQuestions
    });

  } catch (error) {
    console.error('Error generating AI test:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json(
      { 
        error: 'Failed to generate test', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
