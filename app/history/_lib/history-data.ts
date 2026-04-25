import { promises as fs } from 'fs';
import path from 'path';
import { normalizeLineBreaks, parseFrontmatter, parseRichContent } from '../../_lib/rich-content';
import type { RichContentFlow } from '../../_lib/rich-content';

export type HistoryEntry = {
  year: string;
  date: string;
  title: string;
  summary: string;
  monthLabel: string;
  icon?: string;
  isCurrent: boolean;
  content?: RichContentFlow;
};

const uploadRootDir = path.join(process.cwd(), 'upload', 'history');

async function fileExists(filePath: string) {
  try {
    const stats = await fs.stat(filePath);
    return stats.isFile();
  } catch {
    return false;
  }
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

async function getHistoryDates(year: string) {
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

function deriveMonthLabel(date: string) {
  if (!/^\d{6}$/.test(date)) {
    return '—';
  }

  const month = Number(date.slice(2, 4));
  return Number.isFinite(month) && month > 0 ? `${month}月` : '—';
}

function summarizeBody(text: string) {
  const normalized = normalizeLineBreaks(text).trim();
  if (!normalized) {
    return '';
  }

  const firstParagraph = normalized
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .find(Boolean);

  if (!firstParagraph) {
    return '';
  }

  return firstParagraph.replace(/\s+/g, ' ').slice(0, 120);
}

export async function getHistoryEntries(): Promise<HistoryEntry[]> {
  const years = await getYearDirectories();
  const entries: HistoryEntry[] = [];

  for (const year of years) {
    const dates = await getHistoryDates(year);
    for (const date of dates) {
      const markdownPath = path.join(uploadRootDir, year, date, 'index.md');

      let rawMarkdown = '';
      try {
        rawMarkdown = await fs.readFile(markdownPath, 'utf8');
      } catch {
        continue;
      }

      const { frontmatter, body } = parseFrontmatter(rawMarkdown);
      const title = typeof frontmatter.title === 'string'
        ? frontmatter.title
        : `${year}/${date.slice(2, 4)}/${date.slice(4, 6)} の記録`;
      const summary = typeof frontmatter.summary === 'string' && frontmatter.summary.trim()
        ? frontmatter.summary
        : summarizeBody(body);
      const monthLabel = typeof frontmatter.month === 'string' && frontmatter.month.trim()
        ? frontmatter.month
        : deriveMonthLabel(date);
      const icon = typeof frontmatter.icon === 'string' && frontmatter.icon.trim()
        ? frontmatter.icon
        : undefined;
      const isCurrent = frontmatter.current === true;
      const content = body.trim()
        ? await parseRichContent({
          rawText: body,
          mediaDir: path.join(uploadRootDir, year, date),
          mediaUrlBase: `/upload/history/${year}/${date}`,
          defaultAlt: title,
        })
        : undefined;

      entries.push({
        year,
        date,
        title,
        summary,
        monthLabel,
        icon,
        isCurrent,
        content,
      });
    }
  }

  return entries.sort((a, b) => `${b.year}${b.date}`.localeCompare(`${a.year}${a.date}`));
}
