'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Volume2, BookOpen, Library, Plus } from 'lucide-react';
import type { Story, Chapter } from '@/types/database';

export default function StoryPage() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const storyId = params.id as string;

  const [story, setStory] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [choosing, setChoosing] = useState(false);
  const [error, setError] = useState('');
  const pageTopRef = useRef<HTMLDivElement>(null);

  const currentChapter = chapters[chapters.length - 1];

  const fetchStory = useCallback(async () => {
    try {
      const res = await fetch(`/tales-and-choices/api/stories/${storyId}`);
      if (!res.ok) throw new Error('Story not found');
      const data = await res.json();
      setStory(data.story);
      setChapters(data.chapters);
    } catch {
      setError('לא הצלחנו לטעון את הסיפור');
    } finally {
      setLoading(false);
    }
  }, [storyId]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }
    if (status === 'authenticated') {
      fetchStory();
    }
  }, [status, router, fetchStory]);

  async function handleChoice(choice: string) {
    if (choosing) return;
    setChoosing(true);
    setError('');
    pageTopRef.current?.scrollIntoView({ behavior: 'smooth' });

    try {
      const res = await fetch(`/tales-and-choices/api/stories/${storyId}/chapters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choiceMade: choice }),
      });

      if (!res.ok) throw new Error('Failed to generate chapter');
      const data = await res.json();
      setChapters((prev) => [...prev, data.chapter]);
    } catch {
      setError('שגיאה ביצירת הפרק הבא');
    } finally {
      setChoosing(false);
    }
  }

  function speakText(text: string) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'he-IL';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: 'linear-gradient(135deg, #f5e6c8 0%, #e8dff5 100%)' }}>
        <div className="text-5xl animate-bounce">📖</div>
        <p className="text-lg font-semibold" style={{ color: '#9b9bb0' }}>
          {loading ? 'טוענים את הסיפור...' : ''}
        </p>
      </div>
    );
  }

  if (error && !currentChapter) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f5e6c8 0%, #e8dff5 100%)' }}>
        <div className="text-center">
          <p className="text-xl font-bold text-red-400 mb-4">{error}</p>
          <button onClick={() => router.push('/library')} className="text-purple-500 underline">
            חזרה לספרייה
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #f5e6c8 0%, #e8dff5 100%)' }}>
      <div ref={pageTopRef} />
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/60 bg-white/40 backdrop-blur-sm">
        <button
          onClick={() => router.push('/library')}
          className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-xl transition-colors hover:bg-white/60"
          style={{ color: '#B2A4FF' }}
        >
          <Library className="w-4 h-4" />
          ספרייה
        </button>

        <div className="text-center">
          <p className="font-bold text-sm" style={{ color: '#2d2d2d' }}>
            {story?.hero_name}
          </p>
          <p className="text-xs" style={{ color: '#9b9bb0' }}>
            פרק {chapters.length}
          </p>
        </div>

        <button
          onClick={() => router.push('/create')}
          className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-xl transition-colors hover:bg-white/60"
          style={{ color: '#FFCF81' }}
        >
          <Plus className="w-4 h-4" />
          סיפור חדש
        </button>
      </div>

      {/* Chapter content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {choosing ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {/* Skeleton chapter text */}
              <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 relative">
                <div className="absolute top-4 left-4 text-2xl opacity-30">📖</div>
                <div className="space-y-3 animate-pulse">
                  <div className="h-5 bg-purple-100 rounded-full w-full" />
                  <div className="h-5 bg-purple-100 rounded-full w-11/12" />
                  <div className="h-5 bg-purple-100 rounded-full w-full" />
                  <div className="h-5 bg-purple-100 rounded-full w-4/5" />
                  <div className="h-5 bg-purple-100 rounded-full w-full" />
                  <div className="h-5 bg-purple-100 rounded-full w-3/4" />
                  <div className="h-5 bg-purple-100 rounded-full w-full" />
                  <div className="h-5 bg-purple-100 rounded-full w-5/6" />
                </div>
              </div>
              {/* Skeleton choices */}
              <div className="space-y-3 animate-pulse">
                <div className="h-16 bg-amber-100 rounded-2xl w-full" />
                <div className="h-16 bg-purple-100 rounded-2xl w-full" />
              </div>
            </motion.div>
          ) : currentChapter ? (
            <motion.div
              key={currentChapter.id}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="w-full"
            >
              {/* Chapter text */}
              <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 relative">
                <div className="absolute top-4 left-4 text-2xl opacity-30">📖</div>
                <p
                  className="text-xl leading-relaxed font-medium text-right"
                  style={{ color: '#2d2d2d', direction: 'rtl' }}
                >
                  {currentChapter.content}
                </p>
                <button
                  onClick={() => speakText(currentChapter.content)}
                  className="mt-4 flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:scale-105 mr-auto"
                  style={{ color: '#B2A4FF', background: '#f0ebff' }}
                >
                  <Volume2 className="w-4 h-4" />
                  קראו לי בקול
                </button>
              </div>

              {/* Choices */}
              {currentChapter.option_a && currentChapter.option_b && (
                <div className="space-y-3">
                  <p className="text-center font-bold text-lg mb-4" style={{ color: '#6b6b8a' }}>
                    {story?.hero_gender === 'female' ? 'מה תעשה' : 'מה יעשה'} {story?.hero_name}?
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleChoice(currentChapter.option_a!)}
                    disabled={choosing}
                    className="w-full py-5 px-6 rounded-2xl text-xl font-bold text-white shadow-lg disabled:opacity-60 text-right"
                    style={{ background: 'linear-gradient(135deg, #FFCF81, #ffb74d)', direction: 'rtl' }}
                  >
                    {`👉 ${currentChapter.option_a}`}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleChoice(currentChapter.option_b!)}
                    disabled={choosing}
                    className="w-full py-5 px-6 rounded-2xl text-xl font-bold text-white shadow-lg disabled:opacity-60 text-right"
                    style={{ background: 'linear-gradient(135deg, #B2A4FF, #9c88ff)', direction: 'rtl' }}
                  >
                    {`👉 ${currentChapter.option_b}`}
                  </motion.button>
                </div>
              )}

              {error && (
                <p className="text-center text-red-400 font-semibold mt-4">{error}</p>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Link to reader mode */}
        {chapters.length > 1 && (
          <button
            onClick={() => router.push(`/story/${storyId}/read`)}
            className="mt-8 flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:scale-105"
            style={{ color: '#9b9bb0', background: 'white' }}
          >
            <BookOpen className="w-4 h-4" />
            קראו את כל הסיפור מההתחלה
          </button>
        )}
      </div>
    </div>
  );
}
