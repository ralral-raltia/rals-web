import { promises as fs } from 'fs';
import path from 'path';
import {
  extractSection,
  parseFrontmatter,
  parseRichContent,
  parseRichContentLine,
  type RichContentFlow,
  type RichContentLine,
} from '../../_lib/rich-content';

const contentDir = path.resolve(process.cwd(), 'upload', 'about');
const contentFilePath = path.join(contentDir, 'index.md');
const mediaDir = contentDir;
const mediaUrlBase = '/upload/about';

const sectionDefinitions = [
  { id: 'scopes', label: '鏡筒', heading: '鏡筒' },
  { id: 'mounts', label: '赤道儀', heading: '赤道儀' },
  { id: 'imaging', label: '撮影関係', heading: '撮影関係' },
] as const;

type SectionDefinition = (typeof sectionDefinitions)[number];

export type AboutTitleLine = RichContentLine;

export type AboutSectionEntry = {
  title: string;
  titleLine: AboutTitleLine | null;
  summary: string;
  content: RichContentFlow;
};

export type AboutSection = {
  id: SectionDefinition['id'];
  label: SectionDefinition['label'];
  entries: AboutSectionEntry[];
};

function parseTitleLine(value: string): AboutTitleLine | null {
  return parseRichContentLine(value);
}

function parseSectionEntries(rawSection: string, fallbackTitle: string) {
  const lines = rawSection.split(/\r?\n/);
  const entries: Array<{
    title: string;
    titleLine: AboutTitleLine | null;
    summary: string;
    body: string;
  }> = [];

  let title: string | null = null;
  let titleLine: AboutTitleLine | null = null;
  let summary = '';
  let pendingNextTitleLine: AboutTitleLine | null = null;
  let bodyLines: string[] = [];

  const hasBodyText = () => bodyLines.some((line) => line.trim().length > 0);
  const hasCurrentEntry = () => title !== null || titleLine !== null || summary.length > 0 || hasBodyText();
  const beginFallbackEntry = () => {
    if (title === null) {
      title = fallbackTitle;
      titleLine = pendingNextTitleLine;
      pendingNextTitleLine = null;
    }
  };

  const flushEntry = () => {
    if (!hasCurrentEntry()) {
      return;
    }

    entries.push({
      title: title ?? fallbackTitle,
      titleLine,
      summary,
      body: bodyLines.join('\n').trim(),
    });

    title = null;
    titleLine = null;
    summary = '';
    bodyLines = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    const titleMatch = trimmed.match(/^title\s*:\s*(.+)$/i);
    if (titleMatch) {
      flushEntry();
      title = titleMatch[1].trim().replace(/^["']|["']$/g, '');
      titleLine = pendingNextTitleLine;
      pendingNextTitleLine = null;
      summary = '';
      bodyLines = [];
      continue;
    }

    const lineMatch = trimmed.match(/^line\s*:\s*(.+)$/i);
    if (lineMatch) {
      const parsedLine = parseTitleLine(lineMatch[1]);
      if (title !== null && !hasBodyText()) {
        titleLine = parsedLine;
      } else {
        flushEntry();
        pendingNextTitleLine = parsedLine;
      }
      continue;
    }

    const summaryMatch = trimmed.match(/^summary\s*:\s*(.+)$/i);
    if (summaryMatch && title !== null && !hasBodyText()) {
      summary = summaryMatch[1].trim().replace(/^["']|["']$/g, '');
      continue;
    }

    if (!trimmed && !hasBodyText() && title === null) {
      continue;
    }

    beginFallbackEntry();
    bodyLines.push(line);
  }

  flushEntry();
  return entries.length
    ? entries
    : [
      {
        title: fallbackTitle,
        titleLine: pendingNextTitleLine,
        summary: '',
        body: '',
      },
    ];
}

async function loadSection(definition: SectionDefinition, markdownBody: string): Promise<AboutSection> {
  const rawSection = extractSection(markdownBody, definition.heading);
  const rawEntries = parseSectionEntries(rawSection, definition.label);
  const entries = await Promise.all(rawEntries.map(async (entry) => ({
    title: entry.title,
    titleLine: entry.titleLine,
    summary: entry.summary,
    content: await parseRichContent({
      rawText: entry.body,
      mediaDir,
      mediaUrlBase,
      defaultAlt: entry.title,
    }),
  })));

  return {
    id: definition.id,
    label: definition.label,
    entries,
  };
}

export async function getAboutSections() {
  const markdown = await fs.readFile(contentFilePath, 'utf8');
  const { body } = parseFrontmatter(markdown);
  return Promise.all(sectionDefinitions.map((definition) => loadSection(definition, body)));
}
