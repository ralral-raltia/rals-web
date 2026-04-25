import { promises as fs } from 'fs';
import path from 'path';

export type ObservationYearSummary = {
  year: string;
  count: number;
  summary: string;
};

export type ObservationImage = {
  alt: string;
  src: string;
};

export type ObservationTarget = {
  id: string;
  label: string;
  title: string;
  images: ObservationImage[];
  captureData: string[];
  notes: string;
};

export type ObservationEntry = {
  year: string;
  date: string;
  title: string;
  diaryTitle: string;
  location?: string;
  weather?: string;
  tags: string[];
  diary?: string;
  targets: ObservationTarget[];
};

const uploadRootDir = path.join(process.cwd(), 'upload');

function normalizeLineBreaks(text: string) {
  return text.replace(/\r\n/g, '\n');
}

function stripQuotes(value: string) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
    || (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function extractSection(markdownBody: string, heading: string) {
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

function extractObservationSection(markdownBody: string) {
  const strict = extractSection(markdownBody, '観測記録');
  if (strict) {
    return strict;
  }

  const normalized = normalizeLineBreaks(markdownBody);
  const lines = normalized.split('\n');
  let start = -1;

  for (let i = 0; i < lines.length; i += 1) {
    if (/^##\s*観測記録\s*$/.test(lines[i].trim())) {
      start = i + 1;
      break;
    }
  }

  if (start < 0) {
    return '';
  }

  const sectionLines: string[] = [];
  for (let i = start; i < lines.length; i += 1) {
    if (/^##\s+/.test(lines[i].trim())) {
      break;
    }
    sectionLines.push(lines[i]);
  }

  return sectionLines.join('\n').trim();
}

function extractSubSection(block: string, heading: string) {
  const normalized = normalizeLineBreaks(block);
  const lines = normalized.split('\n');
  const headingPattern = new RegExp(`^####\\s+${heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`);
  const nextHeadingPattern = /^(####|###)\s+/;

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

function parseFrontmatter(markdown: string) {
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
  const frontmatter: Record<string, string | string[]> = {};
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

    frontmatter[key] = stripQuotes(rawValue);
    pendingArrayKey = null;
  }

  return { frontmatter, body };
}

function parseObservationTargets(year: string, date: string, section: string) {
  const normalized = normalizeLineBreaks(section);
  const chunks = normalized
    .split(/\n(?=###\s+)/)
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.startsWith('### '));

  return chunks.map((chunk, index): ObservationTarget => {
    const headingMatch = chunk.match(/^###\s+(.+)$/m);
    const label = headingMatch ? headingMatch[1].trim() : `target-${index + 1}`;

    const titleText = extractSubSection(chunk, 'タイトル')
      .split('\n')
      .map((line) => line.trim())
      .find(Boolean) ?? label;

    const photoSection = extractSubSection(chunk, '天体写真');
    const imageMatches = Array.from(photoSection.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g));
    const images = imageMatches.map((match) => ({
      alt: match[1]?.trim() || titleText,
      src: `/upload/${year}/${date}/${encodeURIComponent(match[2].trim())}`,
    }));

    const captureData = extractSubSection(chunk, '撮影データ')
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('- '))
      .map((line) => line.slice(2).trim());

    const notes = extractSubSection(chunk, '所感');

    return {
      id: `${date}-${index}`,
      label,
      title: titleText,
      images,
      captureData,
      notes,
    };
  });
}

async function getYearDirectories() {
  try {
    const entries = await fs.readdir(uploadRootDir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory() && /^\d{4}$/.test(entry.name))
      .map((entry) => entry.name)
      .sort((a, b) => b.localeCompare(a));
  } catch {
    return [];
  }
}

export async function getObservationDates(year: string) {
  if (!/^\d{4}$/.test(year)) {
    return [];
  }

  try {
    const yearDir = path.join(uploadRootDir, year);
    const entries = await fs.readdir(yearDir, { withFileTypes: true });
    const dateDirs = entries
      .filter((entry) => entry.isDirectory() && /^\d{6}$/.test(entry.name))
      .map((entry) => entry.name);

    const validDates: string[] = [];
    for (const date of dateDirs) {
      const markdownPath = path.join(yearDir, date, 'index.md');
      try {
        const stats = await fs.stat(markdownPath);
        if (stats.isFile()) {
          validDates.push(date);
        }
      } catch {
        // index.md がない日付ディレクトリは無視する
      }
    }

    return validDates.sort((a, b) => b.localeCompare(a));
  } catch {
    return [];
  }
}

export async function getObservationYears(): Promise<ObservationYearSummary[]> {
  const years = await getYearDirectories();
  const summaries: ObservationYearSummary[] = [];

  for (const year of years) {
    const dates = await getObservationDates(year);
    if (!dates.length) {
      continue;
    }

    summaries.push({
      year,
      count: dates.length,
      summary: `${year}年の観測記録`,
    });
  }

  return summaries;
}

export async function getObservationEntry(year: string, date: string): Promise<ObservationEntry | null> {
  if (!/^\d{4}$/.test(year) || !/^\d{6}$/.test(date)) {
    return null;
  }

  const markdownPath = path.join(uploadRootDir, year, date, 'index.md');

  let rawMarkdown = '';
  try {
    rawMarkdown = await fs.readFile(markdownPath, 'utf8');
  } catch {
    return null;
  }

  const { frontmatter, body } = parseFrontmatter(rawMarkdown);
  const diary = extractSection(body, '日記');
  const observations = extractObservationSection(body);

  const targets = parseObservationTargets(year, date, observations || body);
  if (!targets.length) {
    return null;
  }

  const title = typeof frontmatter.title === 'string'
    ? frontmatter.title
    : `${year}/${date.slice(2, 4)}/${date.slice(4, 6)} 観測記録`;
  const diaryTitle = typeof frontmatter.diaryTitle === 'string' && frontmatter.diaryTitle.trim()
    ? frontmatter.diaryTitle
    : '日記';
  const location = typeof frontmatter.location === 'string' ? frontmatter.location : undefined;
  const weather = typeof frontmatter.weather === 'string' ? frontmatter.weather : undefined;
  const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];

  return {
    year,
    date,
    title,
    diaryTitle,
    location,
    weather,
    tags,
    diary: diary || undefined,
    targets,
  };
}

export async function getAllObservationDateParams() {
  const years = await getYearDirectories();
  const params: Array<{ year: string; date: string }> = [];

  for (const year of years) {
    const dates = await getObservationDates(year);
    for (const date of dates) {
      params.push({ year, date });
    }
  }

  return params;
}

export function formatObservationDate(year: string, date: string) {
  if (!/^\d{6}$/.test(date)) {
    return `${year}/${date}`;
  }
  return `${year}/${date.slice(2, 4)}/${date.slice(4, 6)}`;
}
