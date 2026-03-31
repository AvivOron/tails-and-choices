'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

export default function HomePage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/library');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f5e6c8 0%, #e8dff5 100%)' }}>
        <div className="text-4xl animate-bounce">✨</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #f5e6c8 0%, #e8dff5 100%)' }}
    >
      <div className="absolute top-8 left-8 text-4xl opacity-40 animate-pulse">⭐</div>
      <div className="absolute top-16 right-12 text-3xl opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }}>🌙</div>
      <div className="absolute bottom-16 left-16 text-3xl opacity-40 animate-pulse" style={{ animationDelay: '1s' }}>🌟</div>
      <div className="absolute bottom-8 right-8 text-4xl opacity-40 animate-pulse" style={{ animationDelay: '0.3s' }}>✨</div>

      <div className="max-w-lg w-full relative z-10">
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          style={{ background: 'linear-gradient(135deg, #FFCF81, #B2A4FF)' }}
        >
          <BookOpen className="w-14 h-14 text-white" />
        </div>

        <h1 className="text-5xl font-bold mb-3" style={{ color: '#2d2d2d' }}>
          Tales &amp; Choices
        </h1>
        <p className="text-xl mb-2" style={{ color: '#6b6b8a' }}>
          סיפורים אינטראקטיביים לילדים
        </p>
        <p className="text-base mb-10" style={{ color: '#9b9bb0' }}>
          צרו סיפורים קסומים עם הגיבור שלכם
        </p>

        <button
          onClick={() => window.location.href = '/tales-and-choices/api/auth/signin/google'}
          className="w-full py-4 px-8 rounded-2xl text-xl font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #FFCF81, #ffb74d)' }}
        >
          <Sparkles className="w-6 h-6" />
          התחילו סיפור חדש
        </button>

        <p className="mt-5 text-sm" style={{ color: '#aaaacc' }}>
          כניסה עם חשבון Google
        </p>
      </div>
    </div>
  );
}
