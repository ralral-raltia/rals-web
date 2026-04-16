import type { Metadata } from 'next';
import Image from 'next/image';

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
            <div
              style={{
                color: 'var(--color-text-muted)',
                lineHeight: 1.8,
                marginBottom: '1.5rem',
                maxWidth: '600px',
              }}
            >
              <p style={{ marginBottom: '1em' }}>
                私、HNをらると申します。
                静岡県内で内科開業医として地域医療をこなしながら、色々な趣味に勤しんでいます。
              </p>
              <p style={{ marginBottom: '1em' }}>
                大学時代は水泳、社会人になってからランニングを趣味としてきました。そして、2012年にトレイルランニングとの衝撃の出会いがあり、以降は山を走ることを趣味の第一としてきました。年に数回の大会出場で、最長100kmのレースも完走。日々のトレーニングも、週2回の20kmランを課して鍛えてきました。
              </p>
              <p style={{ marginBottom: '1em' }}>
                しかし、徐々に歳を重ね、2019年には大きな怪我で膝を手術、更にコロナ業務による疲労...。山を駆け回るだけで心を満たし切れなくなってきたこともあり、これから歳をとっても続けられるなにか別の趣味を...と、色々思い悩んだのが2022年春。そして、そこで選択したのが、子供の頃からの夢であった天体観測でした。
              </p>
              <p>
                いずれは、山を走ることができなくなるときが来るでしょう。その時は、山で星を見ることを第一の楽しみとしていきたいと考えています。
              </p>
            </div>
          </div>
        </div>
        
        {/* 画像ギャラリー1 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <Image src="/images/about/landscape.jpg" alt="山の風景" width={500} height={300} style={{ borderRadius: '12px', objectFit: 'cover', width: '100%', height: 'auto', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)' }} />
          <Image src="/images/about/telescope.jpg" alt="夜空と望遠鏡" width={500} height={300} style={{ borderRadius: '12px', objectFit: 'cover', width: '100%', height: 'auto', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)' }} />
        </div>

        {/* HNの由来 */}
        <div
          className="glass-card"
          style={{
            padding: 'clamp(2rem, 5vw, 3rem)',
            marginBottom: '2rem',
          }}
        >
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--color-star-white)', marginBottom: '1rem' }}>
            HN「らる」の由来
          </h3>
          <div style={{ color: 'var(--color-text-muted)', lineHeight: 1.8, maxWidth: '600px' }}>
            <p>
              昔ドはまりしたネットゲーム"マビノギ”の自キャラの名前(らるてぃあ) からとったものです。ゲーム内の仲間やギルメンからは、らるさんと呼ばれてました。
              <br />
              なぜこの名前にしたかは...覚えてませんw
            </p>
          </div>
        </div>

        {/* 画像ギャラリー2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
           <Image src="/images/about/game.jpg" alt="ゲームのスクリーンショット" width={500} height={300} style={{ borderRadius: '12px', objectFit: 'cover', width: '100%', height: 'auto', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)' }} />
           <Image src="/images/about/character.jpg" alt="キャラクターのイラスト" width={500} height={300} style={{ borderRadius: '12px', objectFit: 'cover', width: '100%', height: 'auto', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)' }} />
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
