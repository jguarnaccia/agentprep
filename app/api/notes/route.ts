import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
);

const USER_ID = 'default_user';

// GET - Fetch all notes or search notes
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const important = searchParams.get('important');
    const tag = searchParams.get('tag');

    let query = supabase
      .from('notes')
      .select('*')
      .eq('user_id', USER_ID)
      .order('updated_at', { ascending: false });

    // Apply filters
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }
    if (category) {
      query = query.eq('category', category);
    }
    if (important === 'true') {
      query = query.eq('is_important', true);
    }
    if (tag) {
      query = query.contains('tags', [tag]);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching notes:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/notes:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

// POST - Create a new note
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, category, tags, context_type, context_id, is_important } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('notes')
      .insert({
        user_id: USER_ID,
        title,
        content,
        category: category || null,
        tags: tags || [],
        context_type: context_type || 'general',
        context_id: context_id || null,
        is_important: is_important || false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating note:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in POST /api/notes:', error);
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}

// PATCH - Update an existing note
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, title, content, category, tags, is_important } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Note ID is required' },
        { status: 400 }
      );
    }

    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (content !== undefined) updates.content = content;
    if (category !== undefined) updates.category = category;
    if (tags !== undefined) updates.tags = tags;
    if (is_important !== undefined) updates.is_important = is_important;

    const { data, error } = await supabase
      .from('notes')
      .update(updates)
      .eq('id', id)
      .eq('user_id', USER_ID)
      .select()
      .single();

    if (error) {
      console.error('Error updating note:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in PATCH /api/notes:', error);
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}

// DELETE - Delete a note
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Note ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)
      .eq('user_id', USER_ID);

    if (error) {
      console.error('Error deleting note:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/notes:', error);
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}