import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: '趣味で天体観測・天体写真を楽しんでいます。機材や観測スタイルなどの自己紹介。',
};

const specs = [
  { label: '主な機材',     value: '— （準備中）' },
  { label: '観測スタイル', value: '眼視・写真' },
  { label: '住まい',       value: '日本' },
  { label: '趣味歴',       value: '— 年目' },
];

export default function AboutPage() {
  return (
    <div style={{ paddingTop: '100px', paddingBottom: '5rem', position: 'relative', zIndex: 1 }}>
      <div className="container-site">

        {/* ページタイトル */}
        <header style={{ marginBottom: '3rem' }}>
          <h1 className="section-title">About</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>自己紹介</p>
          <div className="section-divider" style={{ marginTop: '1rem' }} />
        </header>

        {/* プロフィールカード */}
        <div
          className="glass-card"
          style={{
            padding: 'clamp(2rem, 5vw, 3rem)',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '2.5rem',
            alignItems: 'start',
            marginBottom: '2rem',
          }}
        >
          {/* アバター */}
          <div
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-star-blue), var(--color-star-purple))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              flexShrink: 0,
              boxShadow: '0 0 24px rgba(110, 168, 254, 0.35)',
            }}
          >
            🔭
          </div>

          {/* テキスト */}
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.6rem',
                color: 'var(--color-star-white)',
                marginBottom: '0.75rem',
              }}
            >
              ral
            </h2>
            <p
              style={{
                color: 'var(--color-text-muted)',
                lineHeight: 1.8,
                marginBottom: '1.5rem',
                maxWidth: '600px',
              }}
            >
              趣味で天体観測・天体撮影を楽しんでいます。
              このサイトでは、撮影した天体写真や観測記録、活動の歴史を公開しています。
              （詳細は随時更新予定）
            </p>
          </div>
        </div>

        {/* スペック一覧 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          {specs.map(({ label, value }) => (
            <div
              key={label}
              className="glass-card"
              style={{ padding: '1.25rem 1.5rem' }}
            >
              <p
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-star-blue)',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '0.35rem',
                }}
              >
                {label}
              </p>
              <p style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
