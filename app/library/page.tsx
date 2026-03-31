'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, BookOpen, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import type { Story } from '@/types/database';

const SETTING_EMOJIS: Record<string, string> = {
  forest: '🌲',
  space: '🚀',
  sea: '🌊',
  city: '🏙️',
  castle: '🏰',
  farm: '🐄',
};

export default function LibraryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }
    if (status === 'authenticated') {
      fetch('/api/stories')
        .then((r) => r.json())
        .then((d) => setStories(d.stories ?? []))
        .finally(() => setLoading(false));
    }
  }, [status, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fff9ed 0%, #f0ebff 100%)' }}>
        <div className="text-5xl animate-bounce">📚</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fff9ed 0%, #f0ebff 100%)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/60 bg-white/40 backdrop-blur-sm">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-xl hover:bg-white/60 transition-colors"
          style={{ color: '#9b9bb0' }}
        >
          <LogOut className="w-4 h-4" />
          יציאה
        </button>

        <h1 className="text-xl font-bold" style={{ color: '#2d2d2d' }}>
          הסיפורים שלי 📚
        </h1>

        <button
          onClick={() => router.push('/create')}
          className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl text-white shadow-md transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #FFCF81, #ffb74d)' }}
        >
          <Plus className="w-4 h-4" />
          סיפור חדש
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Welcome */}
        <p className="text-center mb-8 text-base" style={{ color: '#9b9bb0' }}>
          שלום, {session?.user?.name?.split(' ')[0]} 👋
        </p>

        {stories.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📖</div>
            <p className="text-xl font-bold mb-2" style={{ color: '#2d2d2d' }}>
              עדיין אין סיפורים
            </p>
            <p className="text-base mb-8" style={{ color: '#9b9bb0' }}>
              בואו ניצור את הסיפור הראשון שלכם!
            </p>
            <button
              onClick={() => router.push('/create')}
              className="py-4 px-8 rounded-2xl text-lg font-bold text-white shadow-lg transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #FFCF81, #ffb74d)' }}
            >
              ✨ התחילו עכשיו
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {stories.map((story, i) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-white rounded-3xl shadow-md p-5 cursor-pointer hover:shadow-xl transition-all hover:scale-[1.01]"
                onClick={() => router.push(`/story/${story.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm"
                      style={{ background: 'linear-gradient(135deg, #fff9ed, #f0ebff)' }}
                    >
                      {SETTING_EMOJIS[story.setting ?? 'forest'] ?? '📖'}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg" style={{ color: '#2d2d2d' }}>
                        {story.hero_name}
                      </p>
                      <p className="text-sm" style={{ color: '#9b9bb0' }}>
                        {story.hero_gender === 'male' ? 'בן' : 'בת'}
                        {story.companion_names && story.companion_names.length > 0
                          ? ` • עם ${story.companion_names.join(', ')}`
                          : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); router.push(`/story/${story.id}/read`); }}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all hover:scale-105"
                      style={{ color: '#B2A4FF', background: '#f0ebff' }}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      קראו
                    </button>
                    <p className="text-xs" style={{ color: '#c8c8d8' }}>
                      {new Date(story.created_at).toLocaleDateString('he-IL')}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
