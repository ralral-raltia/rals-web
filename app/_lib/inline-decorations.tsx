import type { CSSProperties, ReactNode } from 'react';

const inlineTagStyles: Record<string, CSSProperties> = {
  red: { color: '#ff8f9b' },
  green: { color: '#8fdc8f' },
  yellow: { color: '#ffd76a' },
  orange: { color: '#ffb26b' },
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
  lime: 'green',
  gold: 'yellow',
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
    tokens.push(<strong key={`${keyPrefix}-b-${partIndex}`}>{boldText}</strong>);
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
      continue;
    }

    nodes.push(...renderPlainTextSegment(source[cursor], `c-${cursor}`));
    cursor += 1;
  }

  return { nodes, index: cursor, closed: false };
}

export function renderInlineDecorations(text: string): ReactNode[] {
  const parsed = parseDecoratedText(text, 0);
  return parsed.nodes.length > 0 ? parsed.nodes : [text];
}

export function renderDecoratedLines(text: string): ReactNode[] {
  return text.split('\n').flatMap((line, index) => {
    const nodes: ReactNode[] = [];
    if (index > 0) {
      nodes.push(<br key={`line-br-${index}`} />);
    }
    nodes.push(
      <span key={`line-${index}`}>
        {renderInlineDecorations(line)}
      </span>,
    );
    return nodes;
  });
}
