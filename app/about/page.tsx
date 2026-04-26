import type { Metadata } from 'next';
import { AboutSectionBrowser } from './AboutSectionBrowser';
import { getAboutSections } from './_lib/about-data';

export const metadata: Metadata = {
  title: 'About',
  description: '自己紹介と機材紹介。鏡筒、赤道儀、撮影関係を左サイドバーから切り替えて確認できます。',
};

export default async function AboutPage() {
  const sections = await getAboutSections();

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '5rem', position: 'relative', zIndex: 1 }}>
      <div className="container-site" style={{ maxWidth: '1120px' }}>
        <AboutSectionBrowser sections={sections} />
      </div>
    </div>
  );
}
