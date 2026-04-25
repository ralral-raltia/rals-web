'use client';

import Link from 'next/link';

const footerLinks = [
  { href: '/',             label: 'Top' },
  { href: '/about',        label: 'About' },
  { href: '/gallery',      label: 'Activities' },
  { href: '/observations', label: 'Observations' },
  { href: '/history',      label: 'History' },
  { href: '/links',        label: 'Links' },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      style={{
        borderTop: '1px solid var(--color-border)',
        background: 'rgba(5, 8, 16, 0.9)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding: '3rem 0 2rem',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div className="container-site">
        {/* Top row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '2rem',
            marginBottom: '2.5rem',
          }}
        >
          {/* Brand */}
          <div>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.2rem',
                fontWeight: 700,
                background: 'var(--gradient-text)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.5rem',
              }}
            >
              ral&apos;s website
            </p>
            <p
              style={{
                color: 'var(--color-text-muted)',
                fontSize: '0.875rem',
                lineHeight: 1.6,
              }}
            >
              天体写真・観測記録・天体活動の記録
            </p>
          </div>

          {/* Nav links */}
          <nav
            style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1.5rem' }}
          >
            {footerLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  color: 'var(--color-text-muted)',
                  fontSize: '0.875rem',
                  fontFamily: 'var(--font-display)',
                  textDecoration: 'none',
                  transition: 'color var(--transition-base)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-star-blue)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-muted)';
                }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--color-border)', marginBottom: '1.5rem' }} />

        {/* Bottom row */}
        <p
          style={{
            color: 'var(--color-text-faint)',
            fontSize: '0.8rem',
            textAlign: 'center',
            fontFamily: 'var(--font-display)',
          }}
        >
          © {year} ral&apos;s website — All rights reserved.
        </p>
      </div>
    </footer>
  );
}
