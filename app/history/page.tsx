import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'History',
  description: '天体観測・天体写真活動の歴史をタイムライン形式で記録。',
};

const timelineItems = [
  {
    year:  '2023',
    month: '10月',
    title: '天体写真を始める',
    desc:  'プレアデス星団を初めて撮影。双眼鏡と一眼レフカメラで天体撮影に入門。',
    icon:  '🌟',
  },
  {
    year:  '2023',
    month: '12月',
    title: '月面撮影',
    desc:  '望遠鏡を使った月面撮影を行い、クレーターの詳細を記録。',
    icon:  '🌕',
  },
  {
    year:  '2024',
    month: '08月',
    title: '暗天サイトへの遠征',
    desc:  '山間部へ初遠征。天の川の撮影に成功。星空の広大さを体感。',
    icon:  '🏔️',
  },
  {
    year:  '2024',
    month: '10月',
    title: '惑星観测（木星）',
    desc:  '大赤斑・ガリレオ衛星を肉眼で確認。惑星観測の面白さに目覚める。',
    icon:  '🪐',
  },
  {
    year:  '2024',
    month: '12月',
    title: 'オリオン大星雲の撮影',
    desc:  'コンポジット合成を初めて試行。星雲の色彩を初めて写し出せた。',
    icon:  '✨',
  },
  {
    year:  '2025',
    month: '—',
    title: '活動継続中',
    desc:  '新しい機材や撮影技法を研究しながら観測を続けています。',
    icon:  '🔭',
    isCurrent: true,
  },
];

export default function HistoryPage() {
  return (
    <div style={{ paddingTop: '100px', paddingBottom: '5rem', position: 'relative', zIndex: 1 }}>
      <div className="container-site" style={{ maxWidth: '760px' }}>

        <header style={{ marginBottom: '3rem' }}>
          <h1 className="section-title">History</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>天体活動歴史</p>
          <div className="section-divider" style={{ marginTop: '1rem' }} />
        </header>

        {/* タイムライン */}
        <div style={{ position: 'relative' }}>

          {/* 縦線 */}
          <div
            style={{
              position: 'absolute',
              left: '28px',
              top: '0',
              bottom: '0',
              width: '2px',
              background: 'linear-gradient(to bottom, var(--color-star-blue) 0%, var(--color-star-purple) 70%, transparent 100%)',
              opacity: 0.3,
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {timelineItems.map(({ year, month, title, desc, icon, isCurrent }, i) => (
              <div
                key={`${year}-${month}`}
                style={{
                  display: 'flex',
                  gap: '1.5rem',
                  animation: `fadeInUp 0.5s ease ${i * 0.1}s both`,
                }}
              >
                {/* ドット */}
                <div
                  style={{
                    flexShrink: 0,
                    width: '58px',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: isCurrent
                        ? 'linear-gradient(135deg, var(--color-star-blue), var(--color-star-purple))'
                        : 'var(--color-space-mid)',
                      border: `2px solid ${isCurrent ? 'var(--color-star-blue)' : 'var(--color-border)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem',
                      boxShadow: isCurrent
                        ? '0 0 16px rgba(110, 168, 254, 0.5)'
                        : 'none',
                    }}
                  >
                    {icon}
                  </div>
                </div>

                {/* コンテンツ */}
                <div className="glass-card" style={{ flex: 1, padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.75rem',
                        color: isCurrent ? 'var(--color-star-blue)' : 'var(--color-text-faint)',
                        letterSpacing: '0.1em',
                      }}
                    >
                      {year} {month}
                    </span>
                    {isCurrent && (
                      <span
                        style={{
                          fontSize: '0.65rem',
                          background: 'rgba(110, 168, 254, 0.15)',
                          color: 'var(--color-star-blue)',
                          padding: '1px 8px',
                          borderRadius: '4px',
                          fontFamily: 'var(--font-display)',
                        }}
                      >
                        現在
                      </span>
                    )}
                  </div>
                  <h2
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.05rem',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {title}
                  </h2>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
