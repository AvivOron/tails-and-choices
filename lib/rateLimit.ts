import { createServiceClient } from '@/lib/supabase';

export const DAILY_CHAPTER_LIMIT = 5;
export const DAILY_CHAPTER_LIMIT_PRO = 30;

export async function getDailyChapterCount(
  userId: string,
  supabase: ReturnType<typeof createServiceClient>
): Promise<number> {
  const { data: userStories } = await supabase
    .from('stories')
    .select('id')
    .eq('user_id', userId);

  const storyIds = userStories?.map((s) => s.id) ?? [];
  if (storyIds.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from('chapters')
    .select('id', { count: 'exact', head: true })
    .in('story_id', storyIds)
    .gte('created_at', today.toISOString());

  return count ?? 0;
}
