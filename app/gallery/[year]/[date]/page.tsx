import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ActivityEntryView } from '../../ActivityEntryView';
import { formatActivityDate, getActivityEntry, getAllActivityDateParams } from '../../_lib/activity-data';

type Props = {
  params: Promise<{ year: string; date: string }>;
};

export async function generateStaticParams() {
  return getAllActivityDateParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year, date } = await params;
  const entry = await getActivityEntry(year, date);

  return {
    title: entry ? `${entry.title} (${formatActivityDate(year, date)})` : 'Activities',
    description: entry?.summary ?? '天体活動の記録ページ。',
  };
}

export default async function ActivityDetailPage({ params }: Props) {
  const { year, date } = await params;
  const entry = await getActivityEntry(year, date);

  if (!entry) {
    notFound();
  }

  return <ActivityEntryView entry={entry} />;
}
