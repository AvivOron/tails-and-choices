'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Wand2, Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';

const SETTINGS = [
  { value: 'forest', label: '🌲 יער קסום' },
  { value: 'space', label: '🚀 חלל' },
  { value: 'sea', label: '🌊 ים' },
  { value: 'city', label: '🏙️ עיר' },
  { value: 'castle', label: '🏰 טירה' },
  { value: 'farm', label: '🐄 חווה' },
];

export default function CreatePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [heroName, setHeroName] = useState('');
  const [heroGender, setHeroGender] = useState<'male' | 'female'>('male');
  const [companionInput, setCompanionInput] = useState('');
  const [companions, setCompanions] = useState<string[]>([]);
  const [setting, setSetting] = useState('forest');
  const [customSetting, setCustomSetting] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (status === 'unauthenticated') {
    router.push('/');
    return null;
  }

  function addCompanion() {
    const name = companionInput.trim();
    if (name && !companions.includes(name)) {
      setCompanions([...companions, name]);
      setCompanionInput('');
    }
  }

  function removeCompanion(name: string) {
    setCompanions(companions.filter((c) => c !== name));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!heroName.trim()) {
      setError('נא להזין שם לגיבור/ה');
      return;
    }
    if (setting === 'custom' && !customSetting.trim()) {
      setError('נא להזין מיקום מותאם אישית');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/tales-and-choices/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heroName: heroName.trim(),
          heroGender,
          companionNames: companions,
          setting: setting === 'custom' ? customSetting.trim() : setting,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'שגיאה ביצירת הסיפור');
      }

      const { storyId } = await res.json();
      router.push(`/story/${storyId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'שגיאה ביצירת הסיפור');
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen px-4 py-10"
      style={{ background: 'linear-gradient(135deg, #f5e6c8 0%, #e8dff5 100%)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto"
      >
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md"
            style={{ background: 'linear-gradient(135deg, #FFCF81, #B2A4FF)' }}
          >
            <Wand2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold" style={{ color: '#2d2d2d' }}>
            בואו ניצור סיפור!
          </h1>
          <p className="text-base mt-1" style={{ color: '#9b9bb0' }}>
            ספרו לנו על הגיבור שלכם
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-6 space-y-6">
          {/* Hero Name */}
          <div>
            <label className="block text-lg font-bold mb-2" style={{ color: '#2d2d2d' }}>
              שם הגיבור/ה
            </label>
            <input
              type="text"
              value={heroName}
              onChange={(e) => setHeroName(e.target.value)}
              placeholder="לדוגמה: אריאל, יוני..."
              className="w-full border-2 rounded-2xl px-4 py-3 text-lg focus:outline-none transition-colors"
              style={{ borderColor: heroName ? '#B2A4FF' : '#e5e7eb', textAlign: 'right' }}
              dir="rtl"
            />
          </div>

          {/* Gender Toggle */}
          <div>
            <label className="block text-lg font-bold mb-2" style={{ color: '#2d2d2d' }}>
              הגיבור/ה הוא/היא
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setHeroGender('male')}
                className="flex-1 py-3 rounded-2xl text-lg font-bold transition-all duration-200"
                style={{
                  background: heroGender === 'male' ? 'linear-gradient(135deg, #FFCF81, #ffb74d)' : '#f3f4f6',
                  color: heroGender === 'male' ? 'white' : '#6b7280',
                  boxShadow: heroGender === 'male' ? '0 4px 12px rgba(255,183,77,0.4)' : 'none',
                }}
              >
                בן 👦
              </button>
              <button
                type="button"
                onClick={() => setHeroGender('female')}
                className="flex-1 py-3 rounded-2xl text-lg font-bold transition-all duration-200"
                style={{
                  background: heroGender === 'female' ? 'linear-gradient(135deg, #B2A4FF, #9c88ff)' : '#f3f4f6',
                  color: heroGender === 'female' ? 'white' : '#6b7280',
                  boxShadow: heroGender === 'female' ? '0 4px 12px rgba(178,164,255,0.4)' : 'none',
                }}
              >
                בת 👧
              </button>
            </div>
          </div>

          {/* Companions */}
          <div>
            <label className="block text-lg font-bold mb-2" style={{ color: '#2d2d2d' }}>
              חברים שמצטרפים (אופציונלי)
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={companionInput}
                onChange={(e) => setCompanionInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCompanion(); } }}
                placeholder="הוסיפו חבר/ה..."
                className="flex-1 border-2 rounded-2xl px-4 py-2.5 text-base focus:outline-none"
                style={{ borderColor: '#e5e7eb', textAlign: 'right' }}
                dir="rtl"
              />
              <button
                type="button"
                onClick={addCompanion}
                className="w-11 h-11 rounded-full flex items-center justify-center text-white shadow-md"
                style={{ background: 'linear-gradient(135deg, #B2A4FF, #9c88ff)' }}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {companions.map((name) => (
                <span
                  key={name}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #B2A4FF, #9c88ff)' }}
                >
                  {name}
                  <button type="button" onClick={() => removeCompanion(name)}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Setting */}
          <div>
            <label className="block text-lg font-bold mb-2" style={{ color: '#2d2d2d' }}>
              איפה הסיפור קורה?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SETTINGS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSetting(s.value)}
                  className="py-3 px-2 rounded-2xl text-sm font-semibold transition-all duration-200 text-center"
                  style={{
                    background: setting === s.value ? 'linear-gradient(135deg, #FFCF81, #ffb74d)' : '#f3f4f6',
                    color: setting === s.value ? 'white' : '#6b7280',
                    boxShadow: setting === s.value ? '0 4px 12px rgba(255,183,77,0.3)' : 'none',
                  }}
                >
                  {s.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setSetting('custom')}
                className="py-3 px-2 rounded-2xl text-sm font-semibold transition-all duration-200 text-center"
                style={{
                  background: setting === 'custom' ? 'linear-gradient(135deg, #FFCF81, #ffb74d)' : '#f3f4f6',
                  color: setting === 'custom' ? 'white' : '#6b7280',
                  boxShadow: setting === 'custom' ? '0 4px 12px rgba(255,183,77,0.3)' : 'none',
                }}
              >
                ✏️ אחר...
              </button>
            </div>
            {setting === 'custom' && (
              <input
                type="text"
                value={customSetting}
                onChange={(e) => setCustomSetting(e.target.value)}
                placeholder="לדוגמה: ממלכת הקרח, פארק שעשועים..."
                className="mt-3 w-full border-2 rounded-2xl px-4 py-3 text-base focus:outline-none transition-colors"
                style={{ borderColor: customSetting ? '#FFCF81' : '#e5e7eb', textAlign: 'right' }}
                dir="rtl"
                autoFocus
              />
            )}
          </div>

          {error && (
            <p className="text-red-500 text-center font-semibold">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl text-xl font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-60 disabled:scale-100 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #FFCF81, #ffb74d)' }}
          >
            {loading ? (
              <>
                <span className="animate-spin">✨</span>
                יוצרים את הסיפור...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                צרו את הסיפור!
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
