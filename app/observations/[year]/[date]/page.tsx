import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  formatObservationDate,
  getAllObservationDateParams,
  getObservationEntry,
} from '../../_lib/observation-data';
import { RichContentFlow } from '../../../_components/RichContentFlow';
import { renderInlineDecorations } from '../../../_lib/inline-decorations';
import { ObservationImageGallery } from './ObservationImageGallery';

type Props = { params: Promise<{ year: string; date: string }> };

export async function generateStaticParams() {
  return getAllObservationDateParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year, date } = await params;
  const record = await getObservationEntry(year, date);
  const displayDate = formatObservationDate(year, date);
  return {
    title: record ? `${record.title} (${displayDate})` : '観測記録',
    description: record
      ? `${record.location ? `${record.location} / ` : ''}${record.targets.map((target) => target.title).join(' / ')}`
      : '',
  };
}

export default async function ObservationDetailPage({ params }: Props) {
  const { year, date } = await params;
  const record = await getObservationEntry(year, date);
  if (!record) {
    notFound();
  }

  const displayDate = formatObservationDate(year, date);

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '5rem', position: 'relative', zIndex: 1 }}>
      <div className="container-site" style={{ maxWidth: '900px' }}>
        <nav style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Link
            href="/observations"
            style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textDecoration: 'none' }}
          >
            Observations
          </Link>
          <span style={{ color: 'var(--color-text-faint)' }}>/</span>
          <Link
            href={`/observations/${year}`}
            style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textDecoration: 'none' }}
          >
            {year}
          </Link>
          <span style={{ color: 'var(--color-text-faint)' }}>/</span>
          <span style={{ color: 'var(--color-star-blue)', fontSize: '0.875rem' }}>{displayDate}</span>
        </nav>

        <header style={{ marginBottom: '2rem' }}>
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
            {displayDate}
          </p>
          <h1 className="section-title">{record.title}</h1>
          <div className="section-divider" style={{ marginTop: '1rem' }} />
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {(record.location || record.weather || record.tags.length > 0) && (
            <div className="glass-card" style={{ padding: '1.25rem 1.5rem' }}>
              <p
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--color-star-blue)',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem',
                }}
              >
                Overview
              </p>
              {record.location && (
                <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '0.25rem' }}>
                  観測地: {record.location}
                </p>
              )}
              {record.weather && (
                <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '0.25rem' }}>
                  天候: {record.weather}
                </p>
              )}
              {record.tags.length > 0 && (
                <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0 }}>
                  タグ: {record.tags.join(', ')}
                </p>
              )}
            </div>
          )}

          {record.diary && (
            <section className="glass-card" style={{ padding: '1.5rem' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.1em',
                  color: 'var(--color-star-purple)',
                  marginBottom: '1rem',
                }}
              >
                {record.diaryTitle}
              </h2>
              <RichContentFlow flow={record.diary} titleLevel="h3" />
            </section>
          )}

          {record.targets.map((target) => (
            <section key={target.id} className="glass-card" style={{ padding: '1.5rem' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-star-cyan)',
                  marginBottom: '0.25rem',
                  letterSpacing: '0.08em',
                }}
              >
                {target.label}
              </h2>
              <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '1rem', fontSize: '1.3rem' }}>{target.title}</h3>

              {target.images.length > 0 ? (
                <ObservationImageGallery images={target.images} />
              ) : (
                <p style={{ color: 'var(--color-text-faint)', marginBottom: '1.25rem' }}>
                  画像が登録されていません。
                </p>
              )}

              <h4
                style={{
                  marginBottom: '0.6rem',
                  fontSize: '0.82rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--color-star-blue)',
                  fontFamily: 'var(--font-display)',
                }}
              >
                撮影データ
              </h4>
              {target.captureData.length > 0 ? (
                <ul style={{ margin: '0 0 1.25rem 1.2rem', color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
                  {target.captureData.map((line) => (
                    <li key={line}>{renderInlineDecorations(line)}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: 'var(--color-text-faint)', marginBottom: '1.25rem' }}>
                  撮影データが未記入です。
                </p>
              )}

              <h4
                style={{
                  marginBottom: '0.6rem',
                  fontSize: '0.82rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--color-star-purple)',
                  fontFamily: 'var(--font-display)',
                }}
              >
                所感
              </h4>
              {target.notes ? (
                <RichContentFlow flow={target.notes} titleLevel="h3" />
              ) : (
                <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.9, margin: 0 }}>
                  所感は未記入です。
                </p>
              )}
            </section>
          ))}
        </div>

        <div>
          <Link
            href={`/observations/${year}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-star-blue)',
              textDecoration: 'none',
              fontFamily: 'var(--font-display)',
              fontSize: '0.875rem',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path
                d="M13 15l-5-5 5-5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {year}年の観測記録一覧へ戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
