import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createServiceClient } from '@/lib/supabase';
import { generateChapter } from '@/lib/gemini';
import { getDailyChapterCount, DAILY_CHAPTER_LIMIT, DAILY_CHAPTER_LIMIT_PRO } from '@/lib/rateLimit';
import { hasActivePaddleSubscription } from '@/lib/paddle';

// POST /api/stories/[id]/chapters — generate next chapter based on a choice
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as typeof session.user & { id: string }).id;
  const { id } = await params;
  const { choiceMade } = await req.json();
  const supabase = createServiceClient();

  // Check daily chapter limit (pro users get a higher limit)
  const userEmail = session.user.email!;
  const [todayCount, isPro] = await Promise.all([
    getDailyChapterCount(userId, supabase),
    hasActivePaddleSubscription(userEmail),
  ]);
  const limit = isPro ? DAILY_CHAPTER_LIMIT_PRO : DAILY_CHAPTER_LIMIT;
  if (todayCount >= limit) {
    return NextResponse.json({ error: 'Daily chapter limit reached', isPro, limit }, { status: 429 });
  }

  // Verify story ownership
  const { data: story, error: storyError } = await supabase
    .from('stories')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (storyError || !story) {
    return NextResponse.json({ error: 'Story not found' }, { status: 404 });
  }

  // Get latest chapter number
  const { data: lastChapter } = await supabase
    .from('chapters')
    .select('chapter_number')
    .eq('story_id', id)
    .order('chapter_number', { ascending: false })
    .limit(1)
    .single();

  const nextChapterNumber = (lastChapter?.chapter_number ?? 0) + 1;

  // Update the previous chapter's choice_made
  if (choiceMade && lastChapter) {
    await supabase
      .from('chapters')
      .update({ choice_made: choiceMade })
      .eq('story_id', id)
      .eq('chapter_number', lastChapter.chapter_number);
  }

  // Generate next chapter
  const chapter = await generateChapter({
    heroName: story.hero_name,
    heroGender: story.hero_gender,
    companionNames: story.companion_names ?? [],
    setting: story.setting ?? 'forest',
    rollingSummary: story.rolling_summary ?? '',
    choiceMade,
  });

  // Save new chapter
  const { data: newChapter, error: chapterError } = await supabase
    .from('chapters')
    .insert({
      story_id: id,
      chapter_number: nextChapterNumber,
      content: chapter.chapterText,
      option_a: chapter.optionA,
      option_b: chapter.optionB,
    })
    .select()
    .single();

  if (chapterError || !newChapter) {
    return NextResponse.json({ error: 'Failed to save chapter' }, { status: 500 });
  }

  // Update rolling summary
  await supabase
    .from('stories')
    .update({ rolling_summary: chapter.newSummary })
    .eq('id', id);

  return NextResponse.json({ chapter: newChapter });
}
