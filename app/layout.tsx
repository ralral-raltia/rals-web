import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import { Noto_Sans_JP } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto',
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default:  "ral's website",
    template: "%s | ral's website",
  },
  description:
    '天体写真の展示、観測記録の公開、天体活動の歴史を記録する趣味サイト。',
  openGraph: {
    siteName: "ral's website",
    locale: 'ja_JP',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ja"
      className={`${outfit.variable} ${notoSansJP.variable}`}
      style={{ scrollBehavior: 'smooth' }}
    >
      <body
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--color-space-black)',
          fontFamily: 'var(--font-noto), sans-serif',
        }}
      >
        {/* 全ページ共通: 星空背景アニメーション */}
        <StarBackground />

        {/* ヘッダー */}
        <Header />

        {/* メインコンテンツ */}
        <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
          {children}
        </main>

        {/* フッター */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Footer />
        </div>
      </body>
    </html>
  );
}
