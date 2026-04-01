import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createServiceClient } from '@/lib/supabase';
import { generateChapterImage } from '@/lib/gemini';

// POST /api/stories/[id]/chapters/[chapterId]/image — generate and save chapter illustration
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; chapterId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as typeof session.user & { id: string }).id;
  const { id: storyId, chapterId } = await params;
  const supabase = createServiceClient();

  // Verify story ownership and get story details
  const { data: story, error: storyError } = await supabase
    .from('stories')
    .select('hero_name, setting, rolling_summary')
    .eq('id', storyId)
    .eq('user_id', userId)
    .single();

  if (storyError || !story) {
    return NextResponse.json({ error: 'Story not found' }, { status: 404 });
  }

  // Check if image already exists
  const { data: chapter, error: chapterError } = await supabase
    .from('chapters')
    .select('id, image_url')
    .eq('id', chapterId)
    .eq('story_id', storyId)
    .single();

  if (chapterError || !chapter) {
    return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
  }

  if (chapter.image_url) {
    return NextResponse.json({ imageUrl: chapter.image_url });
  }

  // Generate image
  const imageUrl = await generateChapterImage({
    heroName: story.hero_name,
    setting: story.setting ?? 'forest',
    rollingSummary: story.rolling_summary ?? '',
  });

  // Save to DB
  await supabase
    .from('chapters')
    .update({ image_url: imageUrl })
    .eq('id', chapterId);

  return NextResponse.json({ imageUrl });
}
