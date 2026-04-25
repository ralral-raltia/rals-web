import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { CSSProperties, ReactNode } from 'react';
import {
  formatObservationDate,
  getAllObservationDateParams,
  getObservationEntry,
} from '../../_lib/observation-data';
import { ObservationImageGallery } from './ObservationImageGallery';

type Props = { params: Promise<{ year: string; date: string }> };

const inlineTagStyles: Record<string, CSSProperties> = {
  red: { color: '#ff8f9b' },
  blue: { color: 'var(--color-star-blue)' },
  cyan: { color: 'var(--color-star-cyan)' },
  purple: { color: 'var(--color-star-purple)' },
  muted: { color: 'var(--color-text-muted)' },
  small: { fontSize: '0.86em' },
  large: { fontSize: '1.15em' },
};

const inlineTagNames = Object.keys(inlineTagStyles) as Array<keyof typeof inlineTagStyles>;
const inlineTagAliasMap: Record<string, keyof typeof inlineTagStyles> = {
  big: 'large',
  tiny: 'small',
  gray: 'muted',
  grey: 'muted',
};

function resolveInlineTagName(rawName: string): keyof typeof inlineTagStyles | null {
  const normalized = rawName.toLowerCase();
  if (inlineTagNames.includes(normalized as keyof typeof inlineTagStyles)) {
    return normalized as keyof typeof inlineTagStyles;
  }
  return inlineTagAliasMap[normalized] ?? null;
}

function readInlineTagToken(source: string, start: number) {
  if (source[start] !== '{') {
    return null;
  }
  const closeIndex = source.indexOf('}', start + 1);
  if (closeIndex < 0) {
    return null;
  }
  const raw = source.slice(start, closeIndex + 1);
  const match = raw.match(/^\{\s*(\/?)\s*([a-zA-Z][a-zA-Z0-9_-]*)\s*\}$/);
  if (!match) {
    return null;
  }
  return {
    raw,
    isClosing: match[1] === '/',
    name: match[2],
    length: raw.length,
  };
}

function renderPlainTextSegment(text: string, keyPrefix: string): ReactNode[] {
  const tokens: ReactNode[] = [];
  let cursor = 0;
  let partIndex = 0;

  while (cursor < text.length) {
    const open = text.indexOf('**', cursor);
    if (open < 0) {
      tokens.push(text.slice(cursor));
      break;
    }

    if (open > cursor) {
      tokens.push(text.slice(cursor, open));
    }

    const close = text.indexOf('**', open + 2);
    if (close < 0) {
      tokens.push(text.slice(open));
      break;
    }

    const boldText = text.slice(open + 2, close);
    tokens.push(
      <strong key={`${keyPrefix}-b-${partIndex}`}>
        {boldText}
      </strong>,
    );
    partIndex += 1;
    cursor = close + 2;
  }

  const withBreaks: ReactNode[] = [];
  tokens.forEach((token, tokenIndex) => {
    if (typeof token !== 'string') {
      withBreaks.push(token);
      return;
    }
    const lines = token.split('\n');
    lines.forEach((line, lineIndex) => {
      if (line) {
        withBreaks.push(line);
      }
      if (lineIndex < lines.length - 1) {
        withBreaks.push(<br key={`${keyPrefix}-br-${tokenIndex}-${lineIndex}`} />);
      }
    });
  });

  return withBreaks;
}

function parseDecoratedText(
  source: string,
  start: number,
  endTag?: keyof typeof inlineTagStyles,
): { nodes: ReactNode[]; index: number; closed: boolean } {
  const nodes: ReactNode[] = [];
  let cursor = start;

  while (cursor < source.length) {
    const token = readInlineTagToken(source, cursor);
    if (token) {
      const resolvedTag = resolveInlineTagName(token.name);
      if (token.isClosing) {
        if (endTag && resolvedTag === endTag) {
          return { nodes, index: cursor + token.length, closed: true };
        }
        nodes.push(...renderPlainTextSegment(token.raw, `raw-close-${cursor}`));
        cursor += token.length;
        continue;
      }

      if (resolvedTag) {
        const innerResult = parseDecoratedText(source, cursor + token.length, resolvedTag);
        if (innerResult.closed) {
          nodes.push(
            <span key={`dec-${cursor}-${resolvedTag}`} style={inlineTagStyles[resolvedTag]}>
              {innerResult.nodes}
            </span>,
          );
          cursor = innerResult.index;
          continue;
        }

        nodes.push(...renderPlainTextSegment(token.raw, `raw-open-${cursor}`));
        nodes.push(...innerResult.nodes);
        return { nodes, index: innerResult.index, closed: false };
      }
    }

    const nextBrace = source.indexOf('{', cursor);
    if (nextBrace < 0) {
      nodes.push(...renderPlainTextSegment(source.slice(cursor), `t-${cursor}`));
      return { nodes, index: source.length, closed: false };
    }

    if (nextBrace > cursor) {
      nodes.push(...renderPlainTextSegment(source.slice(cursor, nextBrace), `t-${cursor}`));
      cursor = nextBrace;
    }

    nodes.push(...renderPlainTextSegment(source[cursor], `c-${cursor}`));
    cursor += 1;
  }

  return { nodes, index: cursor, closed: false };
}

function renderInlineDecorations(text: string): ReactNode[] {
  const parsed = parseDecoratedText(text, 0);
  return parsed.nodes.length > 0 ? parsed.nodes : [text];
}

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
              {record.diary.split('\n\n').map((paragraph) => (
                <p key={paragraph} style={{ color: 'var(--color-text-muted)', lineHeight: 1.9, marginBottom: '0.9rem' }}>
                  {renderInlineDecorations(paragraph)}
                </p>
              ))}
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
                target.notes.split('\n\n').map((paragraph) => (
                  <p key={`${target.id}-${paragraph.slice(0, 20)}`} style={{ color: 'var(--color-text-muted)', lineHeight: 1.9, marginBottom: '0.75rem' }}>
                    {renderInlineDecorations(paragraph)}
                  </p>
                ))
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
