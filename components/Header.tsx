'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const navLinks = [
  { href: '/',             label: 'Top' },
  { href: '/about',        label: 'About' },
  { href: '/gallery',      label: 'Gallery' },
  { href: '/observations', label: 'Observations' },
  { href: '/history',      label: 'History' },
  { href: '/links',        label: 'Links' },
];

export default function Header() {
  const pathname  = usePathname();
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [scrolled,   setScrolled]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // メニュー開いているときはスクロール禁止
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'background var(--transition-slow), backdrop-filter var(--transition-slow), box-shadow var(--transition-slow)',
        background: scrolled
          ? 'rgba(5, 8, 16, 0.85)'
          : 'rgba(5, 8, 16, 0)',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        boxShadow: scrolled
          ? '0 1px 0 rgba(110, 168, 254, 0.12)'
          : 'none',
      }}
    >
      <div
        className="container-site"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            background: 'var(--gradient-text)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          ral&apos;s website
        </Link>

        {/* Desktop Nav */}
        <nav
          style={{ display: 'flex', gap: '0.25rem' }}
          className="desktop-nav"
        >
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                padding: '0.4rem 0.9rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.875rem',
                fontFamily: 'var(--font-display)',
                fontWeight: isActive(href) ? 600 : 400,
                color: isActive(href)
                  ? 'var(--color-star-blue)'
                  : 'var(--color-text-muted)',
                textDecoration: 'none',
                transition: 'color var(--transition-base), background var(--transition-base)',
                background: isActive(href)
                  ? 'rgba(110, 168, 254, 0.1)'
                  : 'transparent',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!isActive(href)) {
                  (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-primary)';
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(href)) {
                  (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-muted)';
                  (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                }
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Hamburger Button (mobile) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="メニューを開く"
          className="hamburger-btn"
          style={{
            display: 'none',
            flexDirection: 'column',
            gap: '5px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: 'block',
                width: '22px',
                height: '2px',
                background: 'var(--color-star-blue)',
                borderRadius: '2px',
                transition: 'transform var(--transition-base), opacity var(--transition-base)',
                transform:
                  menuOpen && i === 0 ? 'translateY(7px) rotate(45deg)'  :
                  menuOpen && i === 2 ? 'translateY(-7px) rotate(-45deg)' : 'none',
                opacity: menuOpen && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          top: '64px',
          background: 'rgba(5, 8, 16, 0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          display: menuOpen ? 'flex' : 'none',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          zIndex: 99,
        }}
      >
        {navLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              fontWeight: 600,
              color: isActive(href)
                ? 'var(--color-star-blue)'
                : 'var(--color-text-primary)',
              textDecoration: 'none',
              letterSpacing: '0.05em',
            }}
          >
            {label}
          </Link>
        ))}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
