import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'placeholder-key',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
);

export async function POST(request: NextRequest) {
  try {
    const { content_id, title, content } = await request.json();

    if (!content_id || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if explanation already exists
    const { data: existing } = await supabase
      .from('cba_content')
      .select('ai_explanation')
      .eq('id', content_id)
      .single();

    if (existing?.ai_explanation) {
      return NextResponse.json({ explanation: existing.ai_explanation });
    }

    // Generate explanation using Claude
    const prompt = `You are an expert NBA salary cap consultant helping aspiring sports agents study for their NBPA certification exam.

Your task is to explain the following NBA CBA section in simple, beginner-friendly terms. Make it easy to understand for someone studying to become a sports agent.

SECTION TITLE: ${title || 'Untitled'}

CBA TEXT:
${content}

Please provide a clear, concise explanation that:
1. Summarizes the key points in plain English
2. Explains why this matters for sports agents
3. Includes practical examples when helpful
4. Avoids legal jargon where possible
5. Is 2-4 paragraphs long

Your explanation:`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const explanation = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';

    // Save explanation to database
    await supabase
      .from('cba_content')
      .update({
        ai_explanation: explanation,
        ai_explanation_generated_at: new Date().toISOString(),
      })
      .eq('id', content_id);

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error('Error generating explanation:', error);
    return NextResponse.json(
      { error: 'Failed to generate explanation' },
      { status: 500 }
    );
  }
}
