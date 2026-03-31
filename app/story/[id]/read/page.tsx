'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Volume2 } from 'lucide-react';
import type { Story, Chapter } from '@/types/database';

export default function ReadPage() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const storyId = params.id as string;

  const [story, setStory] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStory = useCallback(async () => {
    try {
      const res = await fetch(`/api/stories/${storyId}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setStory(data.story);
      setChapters(data.chapters);
    } finally {
      setLoading(false);
    }
  }, [storyId]);

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/'); return; }
    if (status === 'authenticated') fetchStory();
  }, [status, router, fetchStory]);

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
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fff9ed 0%, #f0ebff 100%)' }}>
        <div className="text-5xl animate-bounce">📖</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fff9ed 0%, #f0ebff 100%)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/60 bg-white/40 backdrop-blur-sm sticky top-0 z-10">
        <button
          onClick={() => router.push(`/story/${storyId}`)}
          className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-xl hover:bg-white/60 transition-colors"
          style={{ color: '#B2A4FF' }}
        >
          <ArrowRight className="w-4 h-4" />
          המשך
        </button>
        <h1 className="text-lg font-bold" style={{ color: '#2d2d2d' }}>
          הסיפור של {story?.hero_name} 📖
        </h1>
        <div className="w-20" />
      </div>

      {/* Chapters */}
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {chapters.map((chapter, i) => (
          <motion.div
            key={chapter.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-3xl shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => speakText(chapter.content)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl"
                style={{ color: '#B2A4FF', background: '#f0ebff' }}
              >
                <Volume2 className="w-3.5 h-3.5" />
                הקשיבו
              </button>
              <span className="text-sm font-bold" style={{ color: '#c8c8d8' }}>
                פרק {chapter.chapter_number}
              </span>
            </div>

            <p
              className="text-lg leading-relaxed font-medium text-right"
              style={{ color: '#2d2d2d', direction: 'rtl' }}
            >
              {chapter.content}
            </p>

            {chapter.choice_made && (
              <div
                className="mt-4 px-4 py-2 rounded-xl text-sm font-semibold text-right"
                style={{ background: 'linear-gradient(135deg, #fff9ed, #f0ebff)', color: '#9b9bb0', direction: 'rtl' }}
              >
                ✅ {story?.hero_name} בחר{story?.hero_gender === 'female' ? 'ה' : ''}: {chapter.choice_made}
              </div>
            )}
          </motion.div>
        ))}

        <div className="text-center py-8">
          <p className="text-4xl mb-3">🌟</p>
          <p className="text-lg font-bold" style={{ color: '#9b9bb0' }}>
            הסיפור ממשיך...
          </p>
          <button
            onClick={() => router.push(`/story/${storyId}`)}
            className="mt-4 py-3 px-8 rounded-2xl text-base font-bold text-white shadow-md transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #B2A4FF, #9c88ff)' }}
          >
            המשיכו לפרק הבא
          </button>
        </div>
      </div>
    </div>
  );
}
