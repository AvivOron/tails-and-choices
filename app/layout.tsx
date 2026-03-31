import type { Metadata } from 'next';
import { Heebo } from 'next/font/google';
import './globals.css';
import SessionProvider from '@/components/SessionProvider';

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  variable: '--font-heebo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Tales & Choices',
  description: 'Interactive Hebrew storytelling for toddlers',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} h-full`}>
      <body className="min-h-full flex flex-col font-[var(--font-heebo)]" style={{ fontFamily: 'var(--font-heebo), Arial, sans-serif' }}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
