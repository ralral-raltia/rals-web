import { promises as fs } from 'fs';
import path from 'path';
import {
  extractSection,
  normalizeLineBreaks,
  parseFrontmatter,
  parseRichContent,
} from '../../_lib/rich-content';
import type { RichContentFlow } from '../../_lib/rich-content';

export type ActivitySection = {
  id: string;
  title: string;
  content: RichContentFlow;
};

export type ActivityEntry = {
  year: string;
  date: string;
  title: string;
  category?: string;
  summary: string;
  location?: string;
  tags: string[];
  sections: ActivitySection[];
};

export type ActivityEntrySummary = Pick<ActivityEntry, 'year' | 'date' | 'title' | 'summary'>;

const uploadRootDir = path.join(process.cwd(), 'upload', 'activities');

async function fileExists(filePath: string) {
  try {
    const stats = await fs.stat(filePath);
    return stats.isFile();
  } catch {
    return false;
  }
}

async function parseActivitySections(year: string, date: string, sectionText: string) {
  const normalized = normalizeLineBreaks(sectionText);
  const chunks = normalized
    .split(/\n(?=###\s+)/)
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.startsWith('### '));

  const sections: ActivitySection[] = [];

  for (let index = 0; index < chunks.length; index += 1) {
    const chunk = chunks[index];
    const lines = chunk.split('\n');
    const title = lines[0].replace(/^###\s+/, '').trim() || `section-${index + 1}`;
    const content = await parseRichContent({
      rawText: lines.slice(1).join('\n'),
      mediaDir: path.join(uploadRootDir, year, date),
      mediaUrlBase: `/upload/activities/${year}/${date}`,
      defaultAlt: title,
    });

    sections.push({
      id: `${year}-${date}-${index}`,
      title,
      content,
    });
  }

  return sections;
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

async function getActivityDates(year: string) {
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
      if (await fileExists(markdownPath)) {
        validDates.push(date);
      }
    }

    return validDates.sort((a, b) => b.localeCompare(a));
  } catch {
    return [];
  }
}

export async function getActivityEntriesSummary(): Promise<ActivityEntrySummary[]> {
  const years = await getYearDirectories();
  const entries: ActivityEntrySummary[] = [];

  for (const year of years) {
    const dates = await getActivityDates(year);
    for (const date of dates) {
      const entry = await getActivityEntry(year, date);
      if (!entry) {
        continue;
      }

      entries.push({
        year: entry.year,
        date: entry.date,
        title: entry.title,
        summary: entry.summary,
      });
    }
  }

  return entries.sort((a, b) => `${b.year}${b.date}`.localeCompare(`${a.year}${a.date}`));
}

export async function getActivityEntry(year: string, date: string): Promise<ActivityEntry | null> {
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
  const activitySection = extractSection(body, '活動記録') || body;
  const sections = await parseActivitySections(year, date, activitySection);

  if (!sections.length) {
    return null;
  }

  const title = typeof frontmatter.title === 'string' && frontmatter.title.trim()
    ? frontmatter.title
    : `${year}/${date.slice(0, 2)}/${date.slice(2, 4)} 活動記録`;
  const firstTextBlock = sections[0]?.content.blocks.find((block) => block.type === 'text');
  const summary = typeof frontmatter.summary === 'string' && frontmatter.summary.trim()
    ? frontmatter.summary
    : firstTextBlock?.type === 'text'
      ? firstTextBlock.text.split('\n')[0]?.trim() ?? '天体活動の記録'
      : '天体活動の記録';
  const category = typeof frontmatter.category === 'string' ? frontmatter.category : undefined;
  const location = typeof frontmatter.location === 'string' ? frontmatter.location : undefined;
  const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];

  return {
    year,
    date,
    title,
    category,
    summary,
    location,
    tags,
    sections,
  };
}

export async function getLatestActivity() {
  const entries = await getActivityEntriesSummary();
  const latest = entries[0];
  if (!latest) {
    return null;
  }
  return getActivityEntry(latest.year, latest.date);
}

export async function findActivityEntryByDate(date: string) {
  if (!/^\d{6}$/.test(date)) {
    return null;
  }

  const entries = await getActivityEntriesSummary();
  const matched = entries.find((entry) => entry.date === date);
  if (!matched) {
    return null;
  }

  return getActivityEntry(matched.year, matched.date);
}

export async function getAllActivityDateParams() {
  const years = await getYearDirectories();
  const params: Array<{ year: string; date: string }> = [];

  for (const year of years) {
    const dates = await getActivityDates(year);
    for (const date of dates) {
      params.push({ year, date });
    }
  }

  return params;
}

export function formatActivityDate(year: string, date: string) {
  if (!/^\d{6}$/.test(date)) {
    return `${year}/${date}`;
  }
  return `${year}/${date.slice(0, 2)}/${date.slice(2, 4)}`;
}
