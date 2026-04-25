import type { Metadata } from 'next';
import { RichContentFlow } from '../_components/RichContentFlow';
import { renderDecoratedLines } from '../_lib/inline-decorations';
import { getHistoryEntries } from './_lib/history-data';

export const metadata: Metadata = {
  title: 'History',
  description: '天体観測・天体写真活動の歴史をタイムライン形式で記録。',
};

export default async function HistoryPage() {
  const timelineItems = await getHistoryEntries();

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '5rem', position: 'relative', zIndex: 1 }}>
      <div className="container-site" style={{ maxWidth: '760px' }}>

        <header style={{ marginBottom: '3rem' }}>
          <h1 className="section-title">History</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>天体活動歴史</p>
          <div className="section-divider" style={{ marginTop: '1rem' }} />
        </header>

        {/* タイムライン */}
        <div style={{ position: 'relative' }}>

          {/* 縦線 */}
          <div
            style={{
              position: 'absolute',
              left: '28px',
              top: '0',
              bottom: '0',
              width: '2px',
              background: 'linear-gradient(to bottom, var(--color-star-blue) 0%, var(--color-star-purple) 70%, transparent 100%)',
              opacity: 0.3,
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {timelineItems.map(({ year, monthLabel, title, summary, icon, isCurrent, content }, i) => (
              <div
                key={`${year}-${monthLabel}-${title}`}
                style={{
                  display: 'flex',
                  gap: '1.5rem',
                  animation: `fadeInUp 0.5s ease ${i * 0.1}s both`,
                }}
              >
                {/* ドット */}
                <div
                  style={{
                    flexShrink: 0,
                    width: '58px',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: isCurrent
                        ? 'linear-gradient(135deg, var(--color-star-blue), var(--color-star-purple))'
                        : 'var(--color-space-mid)',
                      border: `2px solid ${isCurrent ? 'var(--color-star-blue)' : 'var(--color-border)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                        fontSize: '1.1rem',
                        boxShadow: isCurrent
                          ? '0 0 16px rgba(110, 168, 254, 0.5)'
                          : 'none',
                    }}
                  >
                    {icon ?? '✦'}
                  </div>
                </div>

                {/* コンテンツ */}
                <div className="glass-card" style={{ flex: 1, padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.75rem',
                        color: isCurrent ? 'var(--color-star-blue)' : 'var(--color-text-faint)',
                        letterSpacing: '0.1em',
                      }}
                    >
                      {year} {monthLabel}
                    </span>
                    {isCurrent && (
                      <span
                        style={{
                          fontSize: '0.65rem',
                          background: 'rgba(110, 168, 254, 0.15)',
                          color: 'var(--color-star-blue)',
                          padding: '1px 8px',
                          borderRadius: '4px',
                          fontFamily: 'var(--font-display)',
                        }}
                      >
                        現在
                      </span>
                    )}
                  </div>
                  <h2
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.05rem',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {renderDecoratedLines(title)}
                  </h2>
                  {summary ? (
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: content ? '1rem' : 0 }}>
                      {renderDecoratedLines(summary)}
                    </p>
                  ) : null}
                  {content && content.blocks.length + content.sideImages.length > 0 ? (
                    <RichContentFlow flow={content} titleLevel="h3" />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
