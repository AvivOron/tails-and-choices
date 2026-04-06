import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { BookOpen, Sparkles, Wand2, Heart, Star } from 'lucide-react';
import GoogleSignInButton from '@/components/GoogleSignInButton';
import { authOptions } from '@/lib/auth';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/library');
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center px-6 text-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #f5e6c8 0%, #e8dff5 100%)' }}
    >
      {/* Decorative background elements */}
      <div className="absolute top-8 left-8 text-4xl opacity-40 animate-pulse">⭐</div>
      <div className="absolute top-16 right-12 text-3xl opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }}>🌙</div>
      <div className="absolute bottom-16 left-16 text-3xl opacity-40 animate-pulse" style={{ animationDelay: '1s' }}>🌟</div>
      <div className="absolute bottom-8 right-8 text-4xl opacity-40 animate-pulse" style={{ animationDelay: '0.3s' }}>✨</div>

      {/* Hero section */}
      <section className="max-w-lg w-full relative z-10 pt-20 pb-16">
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          style={{ background: 'linear-gradient(135deg, #FFCF81, #B2A4FF)' }}
        >
          <BookOpen className="w-14 h-14 text-white" />
        </div>

        <h1 className="text-5xl font-bold mb-3" style={{ color: '#2d2d2d' }}>
          Tales &amp; Choices
        </h1>
        <p className="text-2xl font-bold mb-2" style={{ color: '#4a4a6a' }}>
          סיפורים אינטראקטיביים לילדים
        </p>
        <p className="text-lg mb-4" style={{ color: '#6b6b8a' }}>
          צרו סיפורים קסומים בעברית עם הגיבור שלכם — ובחרו איך המסע ממשיך
        </p>
        <p className="text-base mb-10" style={{ color: '#9b9bb0' }}>
          AI-powered Hebrew interactive stories for kids aged 3–8
        </p>

        <GoogleSignInButton
          className="w-full py-4 px-8 rounded-2xl text-xl font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #FFCF81, #ffb74d)' }}
        >
          <Sparkles className="w-6 h-6" />
          התחילו סיפור חדש
        </GoogleSignInButton>

        <p className="mt-5 text-sm" style={{ color: '#aaaacc' }}>
          כניסה חינמית עם חשבון Google
        </p>
      </section>

      {/* How it works */}
      <section className="max-w-2xl w-full relative z-10 pb-16" aria-labelledby="how-it-works-title">
        <h2 id="how-it-works-title" className="text-3xl font-bold mb-8" style={{ color: '#2d2d2d' }}>
          איך זה עובד?
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            {
              icon: <Wand2 className="w-8 h-8 text-white" />,
              bg: 'linear-gradient(135deg, #FFCF81, #ffb74d)',
              title: 'בוחרים גיבור',
              desc: 'נותנים שם לגיבור, בוחרים חברים ומקום פנטסטי',
            },
            {
              icon: <BookOpen className="w-8 h-8 text-white" />,
              bg: 'linear-gradient(135deg, #B2A4FF, #8b7dff)',
              title: 'הסיפור מתחיל',
              desc: 'בינה מלאכותית יוצרת סיפור ייחודי בעברית רק בשביל הילד שלכם',
            },
            {
              icon: <Star className="w-8 h-8 text-white" />,
              bg: 'linear-gradient(135deg, #a8e6cf, #5cb85c)',
              title: 'בוחרים את המסע',
              desc: 'בכל פרק בוחרים מה יקרה — הסיפור משתנה בהתאם לבחירה',
            },
          ].map(({ icon, bg, title, desc }) => (
            <div key={title} className="bg-white bg-opacity-60 rounded-2xl p-6 shadow-sm flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full flex items-center justify-center shadow" style={{ background: bg }}>
                {icon}
              </div>
              <h3 className="text-lg font-bold" style={{ color: '#2d2d2d' }}>{title}</h3>
              <p className="text-sm" style={{ color: '#6b6b8a' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-2xl w-full relative z-10 pb-16" aria-labelledby="features-title">
        <h2 id="features-title" className="text-3xl font-bold mb-8" style={{ color: '#2d2d2d' }}>
          למה Tales &amp; Choices?
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-right">
          {[
            { emoji: '🇮🇱', title: 'עברית מלאה', desc: 'כל הסיפורים כתובים בעברית תקנית ומותאמת לגיל' },
            { emoji: '🤖', title: 'AI חכם', desc: 'Gemini 2.5 יוצר סיפורים ייחודיים בכל פעם — אף סיפור לא חוזר על עצמו' },
            { emoji: '🎭', title: 'גיבור מותאם אישית', desc: 'הכניסו את שם הילד, חבריו ועולם הדמיון שלו לתוך הסיפור' },
            { emoji: '📚', title: 'ספריית סיפורים', desc: 'כל הסיפורים נשמרים ואפשר לחזור ולקרוא אותם מחדש' },
            { emoji: '🌟', title: 'חינוכי ומהנה', desc: 'פיתוח קריאה, חשיבה ביקורתית וכישורי בחירה דרך משחק' },
            { emoji: '🔒', title: 'בטוח לילדים', desc: 'תוכן מסונן ומותאם לגיל, ללא פרסומות' },
          ].map(({ emoji, title, desc }) => (
            <div key={title} className="bg-white bg-opacity-60 rounded-2xl p-5 shadow-sm flex gap-4 items-start">
              <span className="text-3xl">{emoji}</span>
              <div>
                <h3 className="font-bold mb-1" style={{ color: '#2d2d2d' }}>{title}</h3>
                <p className="text-sm" style={{ color: '#6b6b8a' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA bottom */}
      <section className="max-w-lg w-full relative z-10 pb-20">
        <div className="bg-white bg-opacity-60 rounded-3xl p-8 shadow-sm">
          <Heart className="w-10 h-10 mx-auto mb-4" style={{ color: '#B2A4FF' }} />
          <h2 className="text-2xl font-bold mb-3" style={{ color: '#2d2d2d' }}>
            מוכנים להרפתקה?
          </h2>
          <p className="mb-6 text-sm" style={{ color: '#6b6b8a' }}>
            הצטרפו לאלפי משפחות שכבר יוצרות סיפורים קסומים בעברית
          </p>
          <GoogleSignInButton
            className="w-full py-4 px-8 rounded-2xl text-xl font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #FFCF81, #ffb74d)' }}
          >
            <Sparkles className="w-6 h-6" />
            התחילו בחינם
          </GoogleSignInButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full relative z-10 py-6 border-t border-white border-opacity-40" style={{ color: '#aaaacc' }}>
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Tales &amp; Choices &nbsp;·&nbsp;
          <a href="https://www.avivo.dev" className="underline hover:opacity-70" rel="author">Aviv Oron</a>
        </p>
      </footer>
    </div>
  );
}
