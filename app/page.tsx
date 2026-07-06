import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import HeroMountainParallax from '@/components/HeroMountainParallax';
import Reveal from '@/components/Reveal';
import StarBackground from '@/components/StarBackground';

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
    title: 'Activities',
    desc:  '天体活動',
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

        {/* オーロラ状のアンビエント光 */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-25%',
              left: '-15%',
              width: '65vmax',
              height: '65vmax',
              background: 'radial-gradient(circle, rgba(110, 168, 254, 0.13), transparent 60%)',
              filter: 'blur(48px)',
              animation: 'aurora-drift 26s ease-in-out infinite alternate',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '-15%',
              right: '-20%',
              width: '55vmax',
              height: '55vmax',
              background: 'radial-gradient(circle, rgba(167, 139, 250, 0.11), transparent 60%)',
              filter: 'blur(48px)',
              animation: 'aurora-drift 32s ease-in-out -14s infinite alternate-reverse',
            }}
          />
        </div>

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

        {/* 流星・またたきレイヤー（写真の手前・山の背後） */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          <StarBackground variant="hero" />
        </div>

        {/* 前景の山シルエット */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
          }}
        >
          <HeroMountainParallax />
        </div>

        {/* Hero テキスト */}
        <div
          style={{
            position: 'relative',
            zIndex: 3,
            textAlign: 'center',
            padding: '0 1.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '1rem',
              animation: 'fadeInUp 0.7s ease 0.1s both',
            }}
          >
            <span
              aria-hidden
              style={{
                width: 'clamp(24px, 6vw, 56px)',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, var(--color-star-cyan))',
              }}
            />
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(0.75rem, 2vw, 0.9rem)',
                color: 'var(--color-star-cyan)',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
              }}
            >
              Welcome to the cosmos
            </p>
            <span
              aria-hidden
              style={{
                width: 'clamp(24px, 6vw, 56px)',
                height: '1px',
                background: 'linear-gradient(90deg, var(--color-star-cyan), transparent)',
              }}
            />
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.8rem, 8vw, 6rem)',
              fontWeight: 700,
              lineHeight: 1.05,
              marginBottom: '1.2rem',
              background: 'linear-gradient(135deg, #f0f4ff 0%, #a78bfa 60%, #6ea8fe 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'title-in 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.25s both',
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
                height: '44px',
                background: 'linear-gradient(to bottom, var(--color-star-cyan), var(--color-star-blue), transparent)',
                transformOrigin: 'top',
                animation: 'scroll-beam 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
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
          <Reveal>
            <p className="section-eyebrow" style={{ textAlign: 'center' }}>
              Explore
            </p>
            <h2 className="section-title" style={{ textAlign: 'center' }}>
              Contents
            </h2>
            <div className="section-divider" style={{ margin: '0 auto 3rem' }} />
          </Reveal>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {navCards.map(({ href, icon, title, desc }, i) => (
              <Reveal key={href} delay={i * 0.08}>
                <Link href={href} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                  <div
                    className="glass-card"
                    style={{
                      padding: '1.8rem 1.25rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      height: '100%',
                    }}
                  >
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        margin: '0 auto 0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.9rem',
                        borderRadius: '50%',
                        border: '1px solid var(--color-border)',
                        background: 'radial-gradient(circle at 35% 30%, rgba(110, 168, 254, 0.12), rgba(5, 8, 16, 0.2))',
                        boxShadow: 'inset 0 0 16px rgba(110, 168, 254, 0.08)',
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
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
