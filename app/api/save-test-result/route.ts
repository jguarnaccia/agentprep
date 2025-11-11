import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, answers, score, totalQuestions } = body;

    // Validate inputs
    if (!sessionId || !answers || score === undefined || !totalQuestions) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save test result to database
    const { data, error } = await supabase
      .from('ai_test_results')
      .insert({
        session_id: sessionId,
        user_id: null, // Will add auth later
        answers: answers,
        score: score,
        total_questions: totalQuestions
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving test result:', error);
      return NextResponse.json(
        { error: 'Failed to save test result' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      resultId: data.id
    });

  } catch (error) {
    console.error('Error in save-test-result:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
