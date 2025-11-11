import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { supabase } from '@/lib/supabase';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'placeholder-key',
});

export async function POST(request: NextRequest) {
  try {
    console.log('Study Guide API called - POST');
    
    const { category } = await request.json();
    console.log('Category:', category);

    if (!category) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      );
    }

    // Check API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not set');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    console.log('Checking for existing content...');
    // Check if content already exists in database
    const { data: existingContent, error: fetchError } = await supabase
      .from('study_guide_content')
      .select('content')
      .eq('category', category)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Supabase fetch error:', fetchError);
    }

    if (existingContent && !fetchError) {
      console.log('Found existing content, returning cached version');
      return NextResponse.json({ content: existingContent.content });
    }

    console.log('No existing content found, generating new content with Claude...');

    // Generate new content with Claude
    const prompt = `You are an expert on the NBA Collective Bargaining Agreement (CBA). Create a comprehensive study guide section for aspiring sports agents preparing for their NBPA certification exam.

Topic: ${category}

Create detailed study content in the following JSON structure:
{
  "overview": "A clear, comprehensive overview of this topic (2-3 paragraphs)",
  "keyPoints": [
    "Important point 1 with specific details",
    "Important point 2 with specific details",
    "Important point 3 with specific details",
    "Important point 4 with specific details",
    "Important point 5 with specific details"
  ],
  "rules": [
    {
      "title": "Rule name",
      "description": "Detailed explanation",
      "example": "Real-world example"
    },
    {
      "title": "Another rule name",
      "description": "Detailed explanation",
      "example": "Real-world example"
    },
    {
      "title": "Third rule name",
      "description": "Detailed explanation",
      "example": "Real-world example"
    }
  ],
  "calculations": [
    {
      "name": "Calculation name",
      "formula": "The formula",
      "example": "Worked example with numbers"
    }
  ],
  "realWorldExamples": [
    {
      "scenario": "Real NBA scenario",
      "explanation": "How the rule applies"
    },
    {
      "scenario": "Another real NBA scenario",
      "explanation": "How the rule applies"
    },
    {
      "scenario": "Third real NBA scenario",
      "explanation": "How the rule applies"
    }
  ],
  "commonMistakes": [
    "Common mistake 1",
    "Common mistake 2",
    "Common mistake 3"
  ],
  "examTips": [
    "Test-taking tip 1",
    "Test-taking tip 2",
    "Test-taking tip 3"
  ]
}

Make the content:
- Accurate and based on current NBA CBA rules
- Detailed enough for exam preparation
- Clear and easy to understand
- Practical with real-world examples
- Focused on what aspiring agents need to know

IMPORTANT: Return ONLY the JSON object, no additional text before or after.`;

    console.log('Calling Claude API...');
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    console.log('Claude API response received');
    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';

    console.log('Parsing JSON response...');
    // Parse the JSON response
    const content = JSON.parse(responseText);

    console.log('Storing content in database...');
    // Store in database for future use
    const { error: insertError } = await supabase
      .from('study_guide_content')
      .insert({
        category,
        content,
      });

    if (insertError) {
      console.error('Error storing content:', insertError);
      // Continue anyway - we can still return the content
    } else {
      console.log('Content stored successfully');
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error generating study guide:', error);
    return NextResponse.json(
      { error: 'Failed to generate study guide content', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('Study Guide API called - GET');
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    console.log('Category:', category);

    if (!category) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('study_guide_content')
      .select('content')
      .eq('category', category)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    console.log('Content found, returning cached version');
    return NextResponse.json({ content: data.content });
  } catch (error) {
    console.error('Error fetching study guide:', error);
    return NextResponse.json(
      { error: 'Failed to fetch study guide content', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}