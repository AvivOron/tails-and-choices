import type { Metadata } from 'next';
import { Heebo } from 'next/font/google';
import './globals.css';
import SessionProvider from '@/components/SessionProvider';
import PaddleProvider from '@/components/PaddleProvider';
import { Analytics } from '@vercel/analytics/next';

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  variable: '--font-heebo',
  display: 'swap',
});

const baseUrl = 'https://www.avivo.dev/tales-and-choices';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'סיפורים ובחירות | Tales & Choices',
    template: '%s | סיפורים ובחירות',
  },
  description: 'אפליקציית סיפורים אינטראקטיביים בעברית לילדים קטנים. צרו סיפור ייחודי עם הגיבור שלכם ובחרו את המסע! Interactive Hebrew storytelling for toddlers.',
  keywords: ['סיפורים לילדים', 'עברית', 'סיפור אינטראקטיבי', 'ילדים', 'Hebrew stories for kids', 'interactive storytelling', 'toddlers'],
  authors: [{ name: 'Aviv Oron', url: 'https://www.avivo.dev' }],
  creator: 'Aviv Oron',
  openGraph: {
    type: 'website',
    url: baseUrl,
    siteName: 'סיפורים ובחירות',
    title: 'סיפורים ובחירות | Tales & Choices',
    description: 'אפליקציית סיפורים אינטראקטיביים בעברית לילדים קטנים. צרו סיפור ייחודי עם הגיבור שלכם ובחרו את המסע!',
    locale: 'he_IL',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'סיפורים ובחירות | Tales & Choices' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'סיפורים ובחירות | Tales & Choices',
    description: 'אפליקציית סיפורים אינטראקטיביים בעברית לילדים קטנים.',
    images: ['/opengraph-image'],
  },
  alternates: {
    canonical: baseUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} h-full`}>
      <body className="min-h-full flex flex-col font-[var(--font-heebo)]" style={{ fontFamily: 'var(--font-heebo), Arial, sans-serif' }}>
        <PaddleProvider>
          <SessionProvider>{children}</SessionProvider>
        </PaddleProvider>
        <Analytics />
      </body>
    </html>
  );
}
