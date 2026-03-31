import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createServiceClient } from '@/lib/supabase';

// GET /api/stories/[id] — get story with all chapters
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as typeof session.user & { id: string }).id;
  const { id } = await params;
  const supabase = createServiceClient();

  const { data: story, error: storyError } = await supabase
    .from('stories')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (storyError || !story) {
    return NextResponse.json({ error: 'Story not found' }, { status: 404 });
  }

  const { data: chapters, error: chaptersError } = await supabase
    .from('chapters')
    .select('*')
    .eq('story_id', id)
    .order('chapter_number', { ascending: true });

  if (chaptersError) {
    return NextResponse.json({ error: 'Failed to fetch chapters' }, { status: 500 });
  }

  return NextResponse.json({ story, chapters });
}

// DELETE /api/stories/[id] — delete story and all its chapters
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as typeof session.user & { id: string }).id;
  const { id } = await params;
  const supabase = createServiceClient();

  // Verify ownership
  const { data: story } = await supabase
    .from('stories')
    .select('id')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (!story) {
    return NextResponse.json({ error: 'Story not found' }, { status: 404 });
  }

  // Delete chapters first (foreign key), then story
  await supabase.from('chapters').delete().eq('story_id', id);
  await supabase.from('stories').delete().eq('id', id);

  return NextResponse.json({ ok: true });
}
