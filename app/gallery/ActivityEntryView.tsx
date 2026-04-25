import { RichContentFlow } from '../_components/RichContentFlow';
import { renderDecoratedLines } from '../_lib/inline-decorations';
import type { ActivityEntry } from './_lib/activity-data';
import { formatActivityDate } from './_lib/activity-data';

type Props = {
  entry: ActivityEntry;
  leadLabel?: string;
};

export function ActivityEntryView({ entry, leadLabel = 'Activity Log' }: Props) {
  const displayDate = formatActivityDate(entry.year, entry.date);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <header style={{ marginBottom: '0.5rem' }}>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.8rem',
            color: 'var(--color-star-cyan)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
          }}
        >
          {leadLabel}
        </p>
        <h2
          style={{
            color: 'var(--color-text-primary)',
            fontSize: 'clamp(1.6rem, 4vw, 2.3rem)',
            marginBottom: '0.75rem',
          }}
        >
          {renderDecoratedLines(entry.title)}
        </h2>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.8, margin: 0 }}>{renderDecoratedLines(entry.summary)}</p>
      </header>

      <section className="glass-card" style={{ padding: '1.25rem 1.5rem' }}>
        <p
          style={{
            fontSize: '0.72rem',
            color: 'var(--color-star-blue)',
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}
        >
          Overview
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
          <div>
            <p style={{ color: 'var(--color-text-faint)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>日付</p>
            <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>{displayDate}</p>
          </div>
          {entry.category && (
            <div>
              <p style={{ color: 'var(--color-text-faint)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>区分</p>
              <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>{entry.category}</p>
            </div>
          )}
          {entry.location && (
            <div>
              <p style={{ color: 'var(--color-text-faint)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>場所</p>
              <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>{entry.location}</p>
            </div>
          )}
          {entry.tags.length > 0 && (
            <div>
              <p style={{ color: 'var(--color-text-faint)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>タグ</p>
              <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>{entry.tags.join(' / ')}</p>
            </div>
          )}
        </div>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {entry.sections.map((section) => {
          return (
            <article
              key={section.id}
              className="glass-card activity-section-card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                alignItems: 'flex-start',
              }}
            >
              <RichContentFlow
                flow={section.content}
                title={section.title}
                titleStyle={{
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.04em',
                  color: 'var(--color-text-primary)',
                  fontSize: 'clamp(1.25rem, 3vw, 1.9rem)',
                  margin: 0,
                }}
              />
            </article>
          );
        })}
      </section>

      <style>{`
        @media (max-width: 900px) {
          .activity-section-main {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
}
