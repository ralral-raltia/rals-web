import { promises as fs } from 'fs';
import path from 'path';

export type RichContentImageAlign = 'left' | 'right' | 'center';
export type RichContentTextAlign = 'left' | 'center' | 'right';
export type RichContentLine = {
  thickness: number;
  style: 'solid' | 'dotted';
};

export type RichContentSideImage = {
  alt: string;
  src: string;
  align: Exclude<RichContentImageAlign, 'center'>;
};

export type RichContentBlock =
  | {
    type: 'text';
    text: string;
    align: RichContentTextAlign;
  }
  | {
    type: 'clear';
    clear: 'both';
  }
  | {
    type: 'line';
    line: RichContentLine;
  }
  | {
    type: 'image';
    image: {
      alt: string;
      src: string;
    };
  };

export type RichContentFlow = {
  sideImages: RichContentSideImage[];
  blocks: RichContentBlock[];
};

type ParseRichContentOptions = {
  rawText: string;
  mediaDir: string;
  mediaUrlBase: string;
  defaultAlt: string;
};

export function normalizeLineBreaks(text: string) {
  return text.replace(/\r\n/g, '\n');
}

export function stripQuotes(value: string) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
    || (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

export function parseFrontmatter(markdown: string) {
  const normalized = normalizeLineBreaks(markdown);
  if (!normalized.startsWith('---\n')) {
    return { frontmatter: {}, body: normalized };
  }

  const endIndex = normalized.indexOf('\n---\n', 4);
  if (endIndex < 0) {
    return { frontmatter: {}, body: normalized };
  }

  const frontmatterText = normalized.slice(4, endIndex);
  const body = normalized.slice(endIndex + 5);
  const frontmatter: Record<string, string | string[] | boolean> = {};
  const lines = frontmatterText.split('\n');
  let pendingArrayKey: string | null = null;

  for (const line of lines) {
    if (!line.trim()) {
      continue;
    }

    const arrayItemMatch = line.match(/^\s*-\s+(.+)\s*$/);
    if (arrayItemMatch && pendingArrayKey) {
      const currentValue = frontmatter[pendingArrayKey];
      const currentArray: string[] = Array.isArray(currentValue) ? [...currentValue] : [];
      currentArray.push(stripQuotes(arrayItemMatch[1]));
      frontmatter[pendingArrayKey] = currentArray;
      continue;
    }

    const keyValueMatch = line.match(/^([A-Za-z0-9_]+)\s*:\s*(.*)$/);
    if (!keyValueMatch) {
      pendingArrayKey = null;
      continue;
    }

    const key = keyValueMatch[1];
    const rawValue = keyValueMatch[2];
    if (!rawValue.trim()) {
      frontmatter[key] = [];
      pendingArrayKey = key;
      continue;
    }

    const normalizedValue = rawValue.trim().toLowerCase();
    if (normalizedValue === 'true' || normalizedValue === 'false') {
      frontmatter[key] = normalizedValue === 'true';
    } else {
      frontmatter[key] = stripQuotes(rawValue);
    }
    pendingArrayKey = null;
  }

  return { frontmatter, body };
}

export function extractSection(markdownBody: string, heading: string) {
  const normalized = normalizeLineBreaks(markdownBody);
  const lines = normalized.split('\n');
  const headingPattern = new RegExp(`^##\\s+${heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`);
  const nextHeadingPattern = /^##\s+/;

  let start = -1;
  for (let i = 0; i < lines.length; i += 1) {
    if (headingPattern.test(lines[i].trim())) {
      start = i + 1;
      break;
    }
  }

  if (start < 0) {
    return '';
  }

  const sectionLines: string[] = [];
  for (let i = start; i < lines.length; i += 1) {
    if (nextHeadingPattern.test(lines[i].trim())) {
      break;
    }
    sectionLines.push(lines[i]);
  }

  return sectionLines.join('\n').trim();
}

function parseImageAlign(value: string | undefined): RichContentImageAlign {
  const normalized = value?.trim().toLowerCase();
  if (normalized === 'left' || normalized === 'center') {
    return normalized;
  }
  return 'right';
}

function parseTextAlign(value: string | undefined): RichContentTextAlign {
  const normalized = value?.trim().toLowerCase();
  if (normalized === 'center' || normalized === 'right') {
    return normalized;
  }
  return 'left';
}

export function parseRichContentLine(value: string): RichContentLine | null {
  const normalized = value.trim().toLowerCase();
  const match = normalized.match(/^(\d+)?\s*(solid|dot|dotted)$/i);
  if (!match) {
    return null;
  }

  const thickness = Number.parseInt(match[1] ?? '1', 10);
  return {
    thickness: Number.isFinite(thickness) ? Math.min(Math.max(thickness, 1), 6) : 1,
    style: match[2] === 'solid' ? 'solid' : 'dotted',
  };
}

async function fileExists(filePath: string) {
  try {
    const stats = await fs.stat(filePath);
    return stats.isFile();
  } catch {
    return false;
  }
}

export async function parseRichContent({
  rawText,
  mediaDir,
  mediaUrlBase,
  defaultAlt,
}: ParseRichContentOptions): Promise<RichContentFlow> {
  const normalized = normalizeLineBreaks(rawText);
  const lines = normalized.split('\n');
  const sideImages: RichContentSideImage[] = [];
  const blocks: RichContentBlock[] = [];
  let pendingImageAlign: RichContentImageAlign | null = null;
  let pendingTextAlign: RichContentTextAlign = 'left';
  let pendingImageDefaultAlign: RichContentImageAlign = 'right';
  let pendingImage:
    | {
      alt: string;
      src: string;
    }
    | null = null;
  let textBuffer: string[] = [];

  const flushTextBuffer = () => {
    const text = textBuffer.join('\n').trim();
    if (text) {
      blocks.push({
        type: 'text',
        text,
        align: pendingTextAlign,
      });
    }
    textBuffer = [];
  };

  const commitPendingImage = () => {
    if (!pendingImage) {
      return;
    }

    const imageAlign = pendingImageAlign ?? pendingImageDefaultAlign;
    if (imageAlign === 'center') {
      flushTextBuffer();
      blocks.push({
        type: 'image',
        image: pendingImage,
      });
    } else {
      sideImages.push({
        ...pendingImage,
        align: imageAlign,
      });
    }

    pendingImage = null;
    pendingImageAlign = null;
    pendingImageDefaultAlign = 'right';
  };

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    const imageDirectiveMatch = trimmed.match(/^image\s*:\s*(.+)$/i);
    if (imageDirectiveMatch) {
      commitPendingImage();
      const imageName = imageDirectiveMatch[1].trim();
      const imagePath = path.join(mediaDir, imageName);
      if (await fileExists(imagePath)) {
        pendingImage = {
          alt: defaultAlt,
          src: `${mediaUrlBase}/${encodeURIComponent(imageName)}`,
        };
        pendingImageDefaultAlign = 'right';
      } else {
        pendingImage = null;
      }
      continue;
    }

    const markdownImageMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)\s*$/);
    if (markdownImageMatch) {
      commitPendingImage();
      const alt = markdownImageMatch[1].trim() || defaultAlt;
      const imageName = markdownImageMatch[2].trim();
      const imagePath = path.join(mediaDir, imageName);
      if (await fileExists(imagePath)) {
        pendingImage = {
          alt,
          src: `${mediaUrlBase}/${encodeURIComponent(imageName)}`,
        };
        pendingImageDefaultAlign = 'center';
      } else {
        pendingImage = null;
      }
      continue;
    }

    const imageAlignMatch = trimmed.match(/^imageAlign\s*:\s*(.+)$/i);
    if (imageAlignMatch) {
      pendingImageAlign = parseImageAlign(imageAlignMatch[1]);
      continue;
    }

    const textAlignMatch = trimmed.match(/^align\s*:\s*(.+)$/i);
    if (textAlignMatch) {
      flushTextBuffer();
      pendingTextAlign = parseTextAlign(textAlignMatch[1]);
      continue;
    }

    const clearMatch = trimmed.match(/^clear\s*:\s*both\s*$/i);
    if (clearMatch) {
      flushTextBuffer();
      commitPendingImage();
      blocks.push({
        type: 'clear',
        clear: 'both',
      });
      continue;
    }

    const lineMatch = trimmed.match(/^line\s*:\s*(.+)$/i);
    if (lineMatch) {
      const parsedLine = parseRichContentLine(lineMatch[1]);
      if (parsedLine) {
        flushTextBuffer();
        commitPendingImage();
        blocks.push({
          type: 'line',
          line: parsedLine,
        });
        continue;
      }
    }

    commitPendingImage();
    textBuffer.push(rawLine);
  }

  commitPendingImage();
  flushTextBuffer();

  return { sideImages, blocks };
}
