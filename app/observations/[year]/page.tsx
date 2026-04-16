import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ year: string }> };

// 仮データ
const observationData: Record<string, { date: string; target: string; weather: string }[]> = {
  '2024': [
    { date: '20241215', target: 'オリオン大星雲 (M42)',  weather: '晴れ' },
    { date: '20241120', target: 'アンドロメダ銀河 (M31)', weather: '晴れ' },
    { date: '20241005', target: '木星',                  weather: '晴れ' },
    { date: '20240820', target: 'さそり座付近',           weather: '快晴' },
  ],
  '2023': [
    { date: '20231210', target: '月面撮影',              weather: '晴れ' },
    { date: '20231010', target: 'プレアデス星団',         weather: '快晴' },
  ],
  '2025': [],
};

const validYears = Object.keys(observationData);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year } = await params;
  return {
    title: `${year}年の観測記録`,
    description: `${year}年に行った天体観測の記録一覧。`,
  };
}

export default async function ObservationYearPage({ params }: Props) {
  const { year } = await params;

  if (!validYears.includes(year)) notFound();

  const records = observationData[year];

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '5rem', position: 'relative', zIndex: 1 }}>
      <div className="container-site">

        {/* パンくず */}
        <nav style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Link
            href="/observations"
            style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textDecoration: 'none' }}
          >
            Observations
          </Link>
          <span style={{ color: 'var(--color-text-faint)', fontSize: '0.875rem' }}>/</span>
          <span style={{ color: 'var(--color-star-blue)', fontSize: '0.875rem' }}>{year}</span>
        </nav>

        <header style={{ marginBottom: '3rem' }}>
          <h1 className="section-title">{year}年</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>観測記録一覧</p>
          <div className="section-divider" style={{ marginTop: '1rem' }} />
        </header>

        {records.length === 0 ? (
          <div
            className="glass-card"
            style={{ padding: '3rem', textAlign: 'center' }}
          >
            <p style={{ color: 'var(--color-text-muted)' }}>この年の観測記録はまだありません</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {records.map(({ date, target, weather }, i) => {
              const d = date;
              const displayDate = `${d.slice(0, 4)}/${d.slice(4, 6)}/${d.slice(6, 8)}`;
              return (
                <Link
                  key={date}
                  href={`/observations/${year}/${date}`}
                  style={{
                    textDecoration: 'none',
                    animation: `fadeInUp 0.4s ease ${i * 0.07}s both`,
                  }}
                >
                  <div
                    className="glass-card"
                    style={{
                      padding: '1.1rem 1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '0.85rem',
                          color: 'var(--color-text-muted)',
                          minWidth: '90px',
                        }}
                      >
                        {displayDate}
                      </span>
                      <span
                        style={{
                          color: 'var(--color-text-primary)',
                          fontWeight: 500,
                        }}
                      >
                        {target}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--color-star-cyan)',
                          fontFamily: 'var(--font-display)',
                        }}
                      >
                        {weather}
                      </span>
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none"
                        style={{ color: 'var(--color-star-blue)', opacity: 0.5 }}>
                        <path d="M7 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8"
                          strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
