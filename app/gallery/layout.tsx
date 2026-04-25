import Link from 'next/link';
import { formatActivityDate, getActivityEntriesSummary } from './_lib/activity-data';

export default async function GalleryLayout({ children }: LayoutProps<'/gallery'>) {
  const entries = await getActivityEntriesSummary();

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '5rem', position: 'relative', zIndex: 1 }}>
      <div className="container-site">
        <header style={{ marginBottom: '3rem' }}>
          <h1 className="section-title">Activities</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>天体活動</p>
          <div className="section-divider" style={{ marginTop: '1rem' }} />
        </header>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '240px minmax(0, 1fr)',
            gap: '2rem',
            alignItems: 'flex-start',
          }}
        >
          <aside className="glass-card activity-sidebar" style={{ padding: '1.5rem', position: 'sticky', top: '100px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
              活動日
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {entries.map((entry) => (
                <li key={`${entry.year}-${entry.date}`}>
                  <Link
                    href={`/gallery/${entry.year}/${entry.date}`}
                    style={{
                      display: 'block',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: 'var(--color-text-muted)',
                      background: 'rgba(255, 255, 255, 0.02)',
                      transition: 'background-color 0.2s, color 0.2s',
                    }}
                  >
                    <span style={{ display: 'block', color: 'var(--color-text-primary)', marginBottom: '0.2rem' }}>
                      {formatActivityDate(entry.year, entry.date)}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.78rem', lineHeight: 1.5 }}>
                      {entry.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          <main className="glass-card" style={{ padding: '2rem', minWidth: 0 }}>
            {children}
          </main>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .activity-sidebar {
            position: static !important;
          }
        }

        @media (max-width: 900px) {
          .container-site > div:last-of-type {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
