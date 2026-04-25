// app/observations/[year]/layout.tsx
import Link from 'next/link';
import { formatObservationDate, getObservationDates, getObservationYears } from '../_lib/observation-data';

export async function generateStaticParams() {
  const years = await getObservationYears();
  return years.map(({ year }) => ({ year }));
}

export default async function ObservationYearLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  const dates = await getObservationDates(year);

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '5rem', position: 'relative', zIndex: 1 }}>
      <div className="container-site">
        <header style={{ marginBottom: '3rem' }}>
          <h1 className="section-title">{year}年</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>観測記録</p>
          <div className="section-divider" style={{ marginTop: '1rem' }} />
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem', alignItems: 'flex-start' }}>
          {/* サイドバー */}
          <aside className="glass-card" style={{ padding: '1.5rem', position: 'sticky', top: '100px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--color-text-primary)' }}>観測日リスト</h2>
            {dates.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {dates.map((date) => (
                  <li key={date}>
                    <Link
                      href={`/observations/${year}/${date}`}
                      style={{
                        display: 'block',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        color: 'var(--color-text-muted)',
                        transition: 'background-color 0.2s, color 0.2s',
                      }}
                    >
                      {formatObservationDate(year, date)}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-faint)' }}>記録がありません</p>
            )}
          </aside>

          {/* メインビュー */}
          <main className="glass-card" style={{ padding: '2rem' }}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
