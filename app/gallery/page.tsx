import type { Metadata } from 'next';
import { ActivityEntryView } from './ActivityEntryView';
import { getLatestActivity } from './_lib/activity-data';

export const metadata: Metadata = {
  title: 'Activities',
  description: 'ralの天体活動ログ。機材導入、観望、撮影、遠征の記録など。',
};

export default async function GalleryPage() {
  const latestEntry = await getLatestActivity();

  if (!latestEntry) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        <p>表示できる天体活動ログがまだありません。</p>
      </div>
    );
  }

  return <ActivityEntryView entry={latestEntry} leadLabel="Latest Activity" />;
}
