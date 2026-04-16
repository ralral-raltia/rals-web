// app/observations/[year]/layout.tsx
import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';

async function getObservationDates(year: string) {
  try {
    const yearPath = path.join(process.cwd(), 'app', 'observations', year);
    const entries = await fs.readdir(yearPath, { withFileTypes: true });
    const dates = entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .sort((a, b) => b.localeCompare(a)); // 日付の降順にソート
    return dates;
  } catch (error) {
    console.error(`Error reading observation dates for year ${year}:`, error);
    return [];
  }
}

export default async function ObservationYearLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { year: string };
}) {
  const dates = await getObservationDates(params.year);

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '5rem', position: 'relative', zIndex: 1 }}>
      <div className="container-site">
        <header style={{ marginBottom: '3rem' }}>
          <h1 className="section-title">{params.year}年</h1>
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
                      href={`/observations/${params.year}/${date}`}
                      style={{
                        display: 'block',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        color: 'var(--color-text-muted)',
                        transition: 'background-color 0.2s, color 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {`${date.slice(0, 2)}/${date.slice(2, 4)}/${date.slice(4, 6)}`}
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
