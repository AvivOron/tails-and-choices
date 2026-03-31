'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, BookOpen, LogOut, Trash2 } from 'lucide-react';
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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

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

  async function handleDelete(storyId: string) {
    setDeletingId(storyId);
    try {
      await fetch(`/api/stories/${storyId}`, { method: 'DELETE' });
      setStories((prev) => prev.filter((s) => s.id !== storyId));
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f5e6c8 0%, #e8dff5 100%)' }}>
        <div className="text-5xl animate-bounce">📚</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f5e6c8 0%, #e8dff5 100%)' }}>
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
            <AnimatePresence>
              {stories.map((story, i) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-white rounded-3xl shadow-md p-5 hover:shadow-xl transition-all hover:scale-[1.01]"
                >
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => router.push(`/story/${story.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #f5e6c8, #e8dff5)' }}
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

                  {/* Delete */}
                  <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                    {confirmId === story.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm" style={{ color: '#9b9bb0' }}>למחוק את הסיפור?</span>
                        <button
                          onClick={() => handleDelete(story.id)}
                          disabled={deletingId === story.id}
                          className="text-xs font-bold px-3 py-1.5 rounded-xl text-white transition-all hover:scale-105 disabled:opacity-60"
                          style={{ background: '#ff6b6b' }}
                        >
                          {deletingId === story.id ? '...' : 'מחק'}
                        </button>
                        <button
                          onClick={() => setConfirmId(null)}
                          className="text-xs font-bold px-3 py-1.5 rounded-xl transition-all hover:scale-105"
                          style={{ color: '#9b9bb0', background: '#f3f4f6' }}
                        >
                          ביטול
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmId(story.id)}
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all hover:scale-105"
                        style={{ color: '#ffaaaa', background: '#fff5f5' }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        מחק סיפור
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
