import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Links',
  description: '天体観測・天体写真に関連するリンク集。',
};

const linkGroups = [
  {
    category: '天文情報',
    links: [
      {
        title: '国立天文台 (NAOJ)',
        url:   'https://www.nao.ac.jp/',
        desc:  '日本の天文学研究の中核機関。天文情報・天文現象の情報源。',
        icon:  '🔭',
      },
      {
        title: 'Stellarium',
        url:   'https://stellarium.org/',
        desc:  '無料のプラネタリウムソフトウェア。天体の位置を確認できる。',
        icon:  '🌌',
      },
      {
        title: 'Clear Outside',
        url:   'https://clearoutside.com/',
        desc:  '天体観測向けの天気予報サービス。雲量・シーイング・透明度など。',
        icon:  '🌤️',
      },
    ],
  },
  {
    category: '画像処理・撮影',
    links: [
      {
        title: 'Astropixelprocessor',
        url:   'https://www.astropixelprocessor.com/',
        desc:  '天体写真のスタッキング・前処理を行う専用ソフト。',
        icon:  '🖼️',
      },
      {
        title: 'PixInsight',
        url:   'https://pixinsight.com/',
        desc:  '天体写真処理のデファクトスタンダード。高機能な画像処理ソフト。',
        icon:  '⚙️',
      },
    ],
  },
  {
    category: 'コミュニティ',
    links: [
      {
        title: '天文・宇宙板 (5ch)',
        url:   'https://rio2016.5ch.net/galileo/',
        desc:  '天体観測・天体写真に関する情報交換の場。',
        icon:  '💬',
      },
      {
        title: 'Cloudy Nights',
        url:   'https://www.cloudynights.com/',
        desc:  '海外の天文ファーラム。機材・観測技術の議論が豊富。',
        icon:  '🌐',
      },
    ],
  },
];

export default function LinksPage() {
  return (
    <div style={{ paddingTop: '100px', paddingBottom: '5rem', position: 'relative', zIndex: 1 }}>
      <div className="container-site">

        <header style={{ marginBottom: '3rem' }}>
          <h1 className="section-title">Links</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>リンク集</p>
          <div className="section-divider" style={{ marginTop: '1rem' }} />
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {linkGroups.map(({ category, links }) => (
            <section key={category}>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.8rem',
                  color: 'var(--color-star-purple)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginBottom: '1rem',
                }}
              >
                {category}
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1rem',
                }}
              >
                {links.map(({ title, url, desc, icon }) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none' }}
                  >
                    <div
                      className="glass-card"
                      style={{ padding: '1.25rem 1.5rem', height: '100%' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{icon}</span>
                        <div>
                          <p
                            style={{
                              fontFamily: 'var(--font-display)',
                              fontWeight: 600,
                              color: 'var(--color-star-blue)',
                              marginBottom: '0.3rem',
                              fontSize: '0.95rem',
                            }}
                          >
                            {title}
                            <span
                              style={{
                                display: 'inline-block',
                                marginLeft: '0.3rem',
                                fontSize: '0.65rem',
                                opacity: 0.5,
                              }}
                            >
                              ↗
                            </span>
                          </p>
                          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', lineHeight: 1.6 }}>
                            {desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
