import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ year: string; date: string }> };

/* ─── 仮データ（将来はMDXやDBに移行） ─── */
type ObservationRecord = {
  datetime:   string;
  location:   string;
  target:     string;
  targetInfo: string;
  equipment:  string;
  result:     string;
  notes:      string;
};

const records: Record<string, ObservationRecord> = {
  '20241215': {
    datetime:   '2024年12月15日 21:00〜23:30',
    location:   '自宅庭',
    target:     'オリオン大星雲 (M42)',
    targetInfo: 'オリオン座にある散光星雲。地球から約1,344光年。肉眼でも確認できる。',
    equipment:  '8cm屈折望遠鏡、EOS Kiss X10i、ISO1600、露出30s×20枚',
    result:     '透明度が高く、中心部のトラペジウムまで確認できた。淡い青緑色の広がりがよく写った。',
    notes:      '次回はダーク補正とフラット補正を徹底すること。コンポジット枚数を増やしたい。',
  },
  '20241120': {
    datetime:   '2024年11月20日 20:00〜22:00',
    location:   '近隣の公園',
    target:     'アンドロメダ銀河 (M31)',
    targetInfo: 'アンドロメダ座の系外銀河。地球から約254万光年。局部銀河群最大の銀河。',
    equipment:  '双眼鏡 10×50、EOS Kiss X10i、ISO800、露出60s×15枚',
    result:     '光害があり周辺部が飛んでしまった。コアは綺麗に写った。',
    notes:      '次回は空の暗い場所で撮影したい。フィルターの使用を検討。',
  },
  '20241005': {
    datetime:   '2024年10月05日 22:00〜24:00',
    location:   '自宅庭',
    target:     '木星',
    targetInfo: '太陽系最大の惑星。現在の視直径は約44秒角。衝近く。',
    equipment:  '8cm屈折望遠鏡、スマートフォン拡大撮影、×160',
    result:     '大赤斑が見えた。衛星もイオ・エウロパを確認。シーイングは3/5。',
    notes:      '拡大撮影にはデジタルズームではなくバローレンズを使うべきだった。',
  },
  '20240820': {
    datetime:   '2024年08月20日 21:30〜23:00',
    location:   '山間部（標高800m）',
    target:     'さそり座付近・天の川',
    targetInfo: 'さそり座のアンタレス周辺の天の川中心部。夏の好シーズン。',
    equipment:  '広角レンズ 24mm、EOS Kiss X10i、ISO3200、露出25s×30枚',
    result:     '天の川が非常に明瞭に撮影できた。暗天サイトの効果を実感。',
    notes:      '三脚のセッティングに手間取った。次回は極軸合わせを事前に練習。',
  },
  '20231210': {
    datetime:   '2023年12月10日 22:00〜23:00',
    location:   '自宅庭',
    target:     '月面',
    targetInfo: '月齢26。細い三日月。海・クレーターの観察。',
    equipment:  '8cm屈折望遠鏡、スマートフォン撮影',
    result:     'コペルニクス・ティコクレーターを確認。月の山地も確認できた。',
    notes:      'ピント合わせが難しかった。ピントスケールのメモを取るようにする。',
  },
  '20231010': {
    datetime:   '2023年10月10日 22:30〜24:00',
    location:   '自宅近くの高台',
    target:     'プレアデス星団 (M45)',
    targetInfo: 'おうし座にある散開星団。和名「すばる」。地球から約444光年。',
    equipment:  '双眼鏡 8×42、EOS Kiss X10i、ISO1600、露出45s×10枚',
    result:     '双眼鏡での眺めは絶品。写真では青い反射星雲が写った。',
    notes:      '初めて星雲が写せた！より長時間露出を試したい。',
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year, date } = await params;
  const r = records[date];
  return {
    title: r ? `${r.target} (${year}/${date.slice(4, 6)}/${date.slice(6, 8)})` : '観測記録',
    description: r ? r.result.slice(0, 80) : '',
  };
}

const Section = ({
  label, value, icon,
}: {
  label: string; value: string; icon: string;
}) => (
  <div className="glass-card" style={{ padding: '1.25rem 1.5rem' }}>
    <p
      style={{
        fontSize: '0.72rem',
        color: 'var(--color-star-blue)',
        fontFamily: 'var(--font-display)',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        marginBottom: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
      }}
    >
      <span>{icon}</span> {label}
    </p>
    <p style={{ color: 'var(--color-text-primary)', lineHeight: 1.7 }}>{value}</p>
  </div>
);

export default async function ObservationDetailPage({ params }: Props) {
  const { year, date } = await params;
  const record = records[date];
  if (!record) notFound();

  const displayDate = `${date.slice(0, 4)}/${date.slice(4, 6)}/${date.slice(6, 8)}`;

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '5rem', position: 'relative', zIndex: 1 }}>
      <div className="container-site" style={{ maxWidth: '760px' }}>

        {/* パンくず */}
        <nav style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Link href="/observations"
            style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textDecoration: 'none' }}>
            Observations
          </Link>
          <span style={{ color: 'var(--color-text-faint)' }}>/</span>
          <Link href={`/observations/${year}`}
            style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textDecoration: 'none' }}>
            {year}
          </Link>
          <span style={{ color: 'var(--color-text-faint)' }}>/</span>
          <span style={{ color: 'var(--color-star-blue)', fontSize: '0.875rem' }}>{displayDate}</span>
        </nav>

        {/* タイトル */}
        <header style={{ marginBottom: '2.5rem' }}>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.8rem',
              color: 'var(--color-star-cyan)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
            }}
          >
            {displayDate}
          </p>
          <h1 className="section-title">{record.target}</h1>
          <div className="section-divider" style={{ marginTop: '1rem' }} />
        </header>

        {/* フィールド一覧 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Section label="観測日時"   icon="🕐" value={record.datetime} />
          <Section label="観測場所"   icon="📍" value={record.location} />
          <Section label="天体情報"   icon="🌌" value={record.targetInfo} />
          <Section label="観測方法・機材" icon="🔭" value={record.equipment} />
          <Section label="観測結果"   icon="✅" value={record.result} />
          <div
            className="glass-card"
            style={{
              padding: '1.25rem 1.5rem',
              borderColor: 'rgba(167, 139, 250, 0.3)',
            }}
          >
            <p
              style={{
                fontSize: '0.72rem',
                color: 'var(--color-star-purple)',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span>📝</span> 反省点・メモ
            </p>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>{record.notes}</p>
          </div>
        </div>

        {/* 前後ナビ */}
        <div style={{ marginTop: '3rem' }}>
          <Link
            href={`/observations/${year}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-star-blue)',
              textDecoration: 'none',
              fontFamily: 'var(--font-display)',
              fontSize: '0.875rem',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M13 15l-5-5 5-5" stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {year}年の観測記録一覧へ戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
