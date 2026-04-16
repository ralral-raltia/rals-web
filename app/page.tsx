import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "ral's website",
  description:
    '天体写真の展示、観測記録の公開、天体活動の歴史を記録する趣味サイト。',
};

const navCards = [
  {
    href:  '/about',
    icon:  '🌠',
    title: 'About',
    desc:  '自己紹介',
  },
  {
    href:  '/gallery',
    icon:  '🔭',
    title: 'Gallery',
    desc:  '天体写真',
  },
  {
    href:  '/observations',
    icon:  '📓',
    title: 'Observations',
    desc:  '観測記録',
  },
  {
    href:  '/history',
    icon:  '🪐',
    title: 'History',
    desc:  '天体活動歴史',
  },
  {
    href:  '/links',
    icon:  '🔗',
    title: 'Links',
    desc:  'リンク集',
  },
];

export default function HomePage() {
  return (
    <>
      {/* ===== Hero ===== */}
      <section
        style={{
          position: 'relative',
          height: '100svh',
          minHeight: '560px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* 背景画像 */}
        <Image
          src="/images/hero/hero-starfield.png"
          alt="天体写真ヒーロー背景"
          fill
          priority
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />

        {/* グラデーションオーバーレイ */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--gradient-hero)',
            zIndex: 1,
          }}
        />
        {/* 左右の暗化 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(5,8,16,0.6) 100%)',
            zIndex: 1,
          }}
        />

        {/* Hero テキスト */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            padding: '0 1.5rem',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(0.75rem, 2vw, 0.9rem)',
              color: 'var(--color-star-cyan)',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              marginBottom: '1rem',
              animation: 'fadeInUp 0.7s ease 0.1s both',
            }}
          >
            Welcome to the cosmos
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.8rem, 8vw, 6rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              marginBottom: '1.2rem',
              background: 'linear-gradient(135deg, #f0f4ff 0%, #a78bfa 60%, #6ea8fe 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'fadeInUp 0.7s ease 0.25s both',
            }}
          >
            ral&apos;s website
          </h1>
          <p
            style={{
              color: 'var(--color-text-muted)',
              fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
              maxWidth: '480px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.7,
              animation: 'fadeInUp 0.7s ease 0.4s both',
            }}
          >
            天体写真・観測記録・活動の歴史
          </p>

          {/* スクロールヒント */}
          <div
            style={{
              animation: 'fadeIn 1s ease 1s both',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-faint)',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.15em',
              }}
            >
              SCROLL
            </span>
            <div
              style={{
                width: '1px',
                height: '40px',
                background: 'linear-gradient(to bottom, var(--color-star-blue), transparent)',
                animation: 'drift 1.5s ease-in-out infinite alternate',
              }}
            />
          </div>
        </div>
      </section>

      {/* ===== Navigation Cards ===== */}
      <section
        style={{
          padding: 'clamp(4rem, 8vw, 7rem) 0',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div className="container-site">
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            Contents
          </h2>
          <div className="section-divider" style={{ margin: '0 auto 3rem' }} />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {navCards.map(({ href, icon, title, desc }, i) => (
              <Link
                key={href}
                href={href}
                style={{
                  textDecoration: 'none',
                  animation: `fadeInUp 0.6s ease ${i * 0.08}s both`,
                }}
              >
                <div
                  className="glass-card"
                  style={{
                    padding: '1.8rem 1.25rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      fontSize: '2.2rem',
                      marginBottom: '0.75rem',
                      display: 'block',
                    }}
                  >
                    {icon}
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'var(--color-star-blue)',
                      marginBottom: '0.3rem',
                    }}
                  >
                    {title}
                  </p>
                  <p
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    {desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
