import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createServiceClient } from '@/lib/supabase';
import { generateChapter } from '@/lib/gemini';

// POST /api/stories — create new story + generate chapter 1
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as typeof session.user & { id: string }).id;
  const { heroName, heroGender, companionNames, setting } = await req.json();

  if (!heroName || !heroGender) {
    return NextResponse.json({ error: 'heroName and heroGender are required' }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Generate first chapter
  const chapter = await generateChapter({
    heroName,
    heroGender,
    companionNames: companionNames ?? [],
    setting: setting ?? 'forest',
    rollingSummary: '',
  });

  // Create story
  const { data: story, error: storyError } = await supabase
    .from('stories')
    .insert({
      user_id: userId,
      hero_name: heroName,
      hero_gender: heroGender,
      companion_names: companionNames ?? [],
      setting: setting ?? 'forest',
      rolling_summary: chapter.newSummary,
    })
    .select()
    .single();

  if (storyError || !story) {
    return NextResponse.json({ error: 'Failed to create story' }, { status: 500 });
  }

  // Save chapter 1
  const { error: chapterError } = await supabase.from('chapters').insert({
    story_id: story.id,
    chapter_number: 1,
    content: chapter.chapterText,
    option_a: chapter.optionA,
    option_b: chapter.optionB,
  });

  if (chapterError) {
    return NextResponse.json({ error: 'Failed to save chapter' }, { status: 500 });
  }

  return NextResponse.json({ storyId: story.id });
}

// GET /api/stories — list user's stories
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as typeof session.user & { id: string }).id;
  const supabase = createServiceClient();

  const { data: stories, error } = await supabase
    .from('stories')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 });
  }

  return NextResponse.json({ stories });
}
