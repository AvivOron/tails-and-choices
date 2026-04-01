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
    default: 'Tales & Choices | סיפורים אינטראקטיביים בעברית לילדים',
    template: '%s | Tales & Choices',
  },
  description:
    'Tales & Choices — אפליקציית סיפורים אינטראקטיביים בעברית לילדים בגיל 3–8. הכניסו את שם הילד, בחרו עולם פנטסטי, ו-AI יצור סיפור ייחודי שבו הילד בוחר את המסע. Interactive AI-powered Hebrew stories for kids.',
  keywords: [
    'סיפורים לילדים',
    'סיפורים בעברית',
    'סיפור אינטראקטיבי',
    'AI לילדים',
    'עברית',
    'ילדים גיל 3',
    'ילדים גיל 4',
    'ילדים גיל 5',
    'ילדים גיל 6',
    'סיפור לפני שינה',
    'Hebrew stories for kids',
    'interactive storytelling',
    'AI stories for toddlers',
    'kids app Hebrew',
    'stories for children',
  ],
  authors: [{ name: 'Aviv Oron', url: 'https://www.avivo.dev' }],
  creator: 'Aviv Oron',
  openGraph: {
    type: 'website',
    url: baseUrl,
    siteName: 'Tales & Choices',
    title: 'Tales & Choices | סיפורים אינטראקטיביים בעברית לילדים',
    description:
      'אפליקציית סיפורים אינטראקטיביים בעברית לילדים. AI יוצר סיפור ייחודי עם הגיבור שלכם — ובכל פרק הילד בוחר את המסע!',
    locale: 'he_IL',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Tales & Choices — סיפורים אינטראקטיביים בעברית לילדים' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tales & Choices | סיפורים אינטראקטיביים בעברית לילדים',
    description: 'AI יוצר סיפורים ייחודיים בעברית לילדים — הגיבור הוא הילד שלכם!',
    images: ['/opengraph-image'],
  },
  alternates: {
    canonical: baseUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Tales & Choices',
  alternateName: 'סיפורים ובחירות',
  url: baseUrl,
  description:
    'אפליקציית סיפורים אינטראקטיביים בעברית לילדים בגיל 3–8. AI יוצר סיפורים ייחודיים עם הגיבור שלכם.',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Web',
  inLanguage: 'he',
  audience: {
    '@type': 'PeopleAudience',
    suggestedMinAge: 3,
    suggestedMaxAge: 8,
  },
  author: {
    '@type': 'Person',
    name: 'Aviv Oron',
    url: 'https://www.avivo.dev',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'ILS',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} h-full`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-[var(--font-heebo)]" style={{ fontFamily: 'var(--font-heebo), Arial, sans-serif' }}>
        <PaddleProvider>
          <SessionProvider>{children}</SessionProvider>
        </PaddleProvider>
        <Analytics />
      </body>
    </html>
  );
}
