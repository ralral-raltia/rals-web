import type { Metadata } from 'next';
import Link from 'next/link';
import { getObservationYears } from './_lib/observation-data';

export const metadata: Metadata = {
  title: 'Observations',
  description: '年ごとの天体観測記録。観測日時・場所・天体名・観測結果など。',
};

export default async function ObservationsPage() {
  const observationYears = await getObservationYears();

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '5rem', position: 'relative', zIndex: 1 }}>
      <div className="container-site">

        <header style={{ marginBottom: '3rem' }}>
          <h1 className="section-title">Observations</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>観測記録</p>
          <div className="section-divider" style={{ marginTop: '1rem' }} />
        </header>

        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2.5rem', fontSize: '0.9rem' }}>
          観測年を選択して、各日の観測記録を確認できます。
        </p>

        {/* 年別カード */}
        {observationYears.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {observationYears.map(({ year, count, summary }, i) => (
              <Link
                key={year}
                href={`/observations/${year}`}
                style={{
                  textDecoration: 'none',
                  animation: `fadeInUp 0.5s ease ${i * 0.1}s both`,
                }}
              >
                <div
                  className="glass-card"
                  style={{
                    padding: '1.5rem 2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: 'var(--color-star-blue)',
                        minWidth: '80px',
                      }}
                    >
                      {year}
                    </span>
                    <div>
                      <p
                        style={{
                          color: 'var(--color-text-primary)',
                          fontWeight: 500,
                          marginBottom: '0.2rem',
                        }}
                      >
                        {summary}
                      </p>
                      <p style={{ color: 'var(--color-text-faint)', fontSize: '0.8rem' }}>
                        {count > 0 ? `${count} 件の観測記録` : '記録なし'}
                      </p>
                    </div>
                  </div>

                  {/* 矢印 */}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    style={{ flexShrink: 0, color: 'var(--color-star-blue)', opacity: 0.6 }}
                  >
                    <path
                      d="M7 5l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>表示可能な観測記録がまだありません。</p>
          </div>
        )}
      </div>
    </div>
  );
}
