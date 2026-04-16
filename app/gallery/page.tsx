import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'ralが撮影した天体写真のギャラリー。銀河・星雲・惑星など。',
};

// 仮データ（将来はCMSやファイルシステムから取得する想定）
const placeholderItems = Array.from({ length: 9 }, (_, i) => ({
  id:       i + 1,
  title:    ['アンドロメダ銀河', 'オリオン大星雲', 'プレアデス星団', '木星', '土星', 'さんかく座銀河', '蟹星雲', 'バラ星雲', '球状星団M13'][i],
  category: ['銀河', '星雲', '星団', '惑星', '惑星', '銀河', '星雲', '星雲', '星団'][i],
  emoji:    ['🌌', '✨', '⭐', '🪐', '🪐', '🌌', '💫', '🌸', '✨'][i],
}));

export default function GalleryPage() {
  return (
    <div style={{ paddingTop: '100px', paddingBottom: '5rem', position: 'relative', zIndex: 1 }}>
      <div className="container-site">

        <header style={{ marginBottom: '3rem' }}>
          <h1 className="section-title">Gallery</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>天体写真</p>
          <div className="section-divider" style={{ marginTop: '1rem' }} />
        </header>

        {/* 写真グリッド */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {placeholderItems.map((item, i) => (
            <div
              key={item.id}
              className="glass-card"
              style={{
                overflow: 'hidden',
                animation: `fadeInUp 0.5s ease ${i * 0.06}s both`,
                cursor: 'pointer',
              }}
            >
              {/* 画像プレースホルダー */}
              <div
                style={{
                  height: '200px',
                  background: `linear-gradient(135deg,
                    hsl(${220 + i * 15}, 60%, ${8 + (i % 3) * 3}%) 0%,
                    hsl(${260 + i * 10}, 50%, ${12 + (i % 2) * 4}%) 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3.5rem',
                  position: 'relative',
                }}
              >
                {item.emoji}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at 30% 30%, rgba(110,168,254,0.08) 0%, transparent 70%)',
                  }}
                />
                {/* Placeholder badge */}
                <span
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    fontSize: '0.65rem',
                    background: 'rgba(0,0,0,0.5)',
                    color: 'var(--color-text-faint)',
                    padding: '2px 7px',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '0.05em',
                  }}
                >
                  PLACEHOLDER
                </span>
              </div>

              {/* キャプション */}
              <div style={{ padding: '1rem 1.25rem' }}>
                <span
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--color-star-purple)',
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  {item.category}
                </span>
                <p
                  style={{
                    color: 'var(--color-text-primary)',
                    fontWeight: 600,
                    marginTop: '0.25rem',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 今後の予告 */}
        <div
          className="glass-card"
          style={{
            marginTop: '3rem',
            padding: '1.5rem 2rem',
            textAlign: 'center',
            borderColor: 'rgba(167, 139, 250, 0.25)',
          }}
        >
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            📷 実際の天体写真は順次追加予定です
          </p>
        </div>
      </div>
    </div>
  );
}
