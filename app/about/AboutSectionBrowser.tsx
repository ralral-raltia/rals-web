

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { RichContentFlow } from '../_components/RichContentFlow';

type Props = {
  sections: AboutSectionView[];
};

type AboutSectionView = {
  id: string;
  label: string;
  entries: Array<{
    title: string;
    titleLine: {
      thickness: number;
      style: 'solid' | 'dotted';
    } | null;
    summary: string;
    content: {
      sideImages: Array<{
        alt: string;
        src: string;
        align: 'left' | 'right';
      }>;
      blocks: Array<
        | {
          type: 'text';
          text: string;
          align: 'left' | 'center' | 'right';
        }
        | {
          type: 'clear';
          clear: 'both';
        }
        | {
          type: 'line';
          line: {
            thickness: number;
            style: 'solid' | 'dotted';
          };
        }
        | {
          type: 'image';
          image: {
            alt: string;
            src: string;
          };
        }
      >;
    };
  }>;
};

function stripHashPrefix(hash: string) {
  return hash.replace(/^#/, '');
}

function TitleLine({ thickness, style }: { thickness: number; style: 'solid' | 'dotted' }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'block',
        width: '100%',
        borderTop: `${thickness}px ${style} rgba(82, 99, 117, 0.7)`,
      }}
    />
  );
}

function AboutEntryBlock({ entry }: { entry: AboutSectionView['entries'][number] }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {entry.titleLine ? (
        <TitleLine thickness={entry.titleLine.thickness} style={entry.titleLine.style} />
      ) : null}

      <h3
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--color-text-primary)',
          fontSize: 'clamp(1.25rem, 3vw, 1.8rem)',
          margin: 0,
        }}
      >
        {entry.title}
      </h3>

      {entry.summary ? (
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.85, margin: 0 }}>
          {entry.summary}
        </p>
      ) : null}

      <RichContentFlow flow={entry.content} />
    </section>
  );
}

function AboutIntroPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div className="section-divider" />

      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            color: '#3f6c12',
            fontSize: 'clamp(1.7rem, 3.2vw, 2.25rem)',
            margin: 0,
          }}
        >
          <span aria-hidden="true" style={{ width: '0.8rem', height: '0.8rem', background: '#4d7b17', flexShrink: 0 }} />
          自己紹介
        </h2>

        <div className="about-intro-hero" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 310px', gap: '1.5rem', alignItems: 'start' }}>
          <div style={{ color: 'var(--color-text-muted)', lineHeight: 1.88, display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            <p style={{ margin: 0 }}>
              私、HNをらると申します。
              <br />
              静岡県内で内科開業医として地域医療をこなしながら、色々な趣味に勤しんでいます。
            </p>
            <p style={{ margin: 0 }}>
              大学時代は水泳、社会人になってからランニングを趣味としてきました。そして、2012年にトレイルランニングとの衝撃の出会いがあり、以降は山を走ることを趣味の第一としてきました。年に数回の大会出場で、最長100kmのレースも完走。日々のトレーニングも、週2回の20kmランを課して鍛えてきました。
            </p>
            <p style={{ margin: 0 }}>
              しかし、徐々に歳を重ね、2019年には大きな怪我で膝を手術、更にコロナ業務による疲労...。山を駆け回るだけで心を満たし切れなくなってきたこともあり、これから歳をとっても続けられるなにか別の趣味を...と、色々思い悩んだのが2022年春。そして、そこで選択したのが、子供の頃からの夢であった天体観測でした。
            </p>
            <p style={{ margin: 0 }}>
              いずれは、山を走ることができなくなるときが来るでしょう。その時は、山で星を見ることを第一の楽しみとしていきたいと考えています。
            </p>
          </div>

          <div style={{ display: 'grid', gap: '0.9rem' }}>
            <Image
              src="/images/about/landscape.jpg"
              alt="山の風景"
              width={620}
              height={360}
              style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
            />
            <Image
              src="/images/about/telescope.jpg"
              alt="夜空と望遠鏡"
              width={620}
              height={360}
              style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      <div className="section-divider" />

      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="about-origin-layout" style={{ display: 'grid', gridTemplateColumns: '1.05fr minmax(240px, 0.9fr)', gap: '1.5rem', alignItems: 'start' }}>
          <Image
            src="/images/about/game.jpg"
            alt="ゲームのスクリーンショット"
            width={720}
            height={430}
            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
          />
          <div style={{ color: 'var(--color-text-muted)', lineHeight: 1.9 }}>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.15rem',
                color: 'var(--color-text-primary)',
                marginBottom: '0.85rem',
              }}
            >
              HNらるの由来
            </h3>
            <p style={{ margin: 0 }}>
              昔ドはまりしたネットゲーム&quot;マビノギ&quot;の自キャラの名前（らるてぃあ）からとったものです。ゲーム内の仲間やギルメンからは、らるさんと呼ばれてました。
              <br />
              なぜこの名前にしたかは...
              <br />
              覚えてませんｗ
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Image
            src="/images/about/character.jpg"
            alt="キャラクターのイラスト"
            width={480}
            height={640}
            style={{ width: 'min(100%, 460px)', height: 'auto', objectFit: 'contain' }}
          />
        </div>
      </section>
    </div>
  );
}

export function AboutSectionBrowser({ sections }: Props) {
  const defaultSectionId = 'intro';
  const [selectedId, setSelectedId] = useState(defaultSectionId);

  useEffect(() => {
    if (!defaultSectionId) {
      return;
    }

    const applyHash = () => {
      const hashId = stripHashPrefix(window.location.hash);
      if (!hashId || hashId === defaultSectionId) {
        setSelectedId(defaultSectionId);
        if (window.location.hash !== `#${defaultSectionId}`) {
          window.history.replaceState(null, '', `#${defaultSectionId}`);
        }
        return;
      }

      const matchedSection = sections.find((section) => section.id === hashId);

      if (matchedSection) {
        setSelectedId(matchedSection.id);
        return;
      }

      setSelectedId(defaultSectionId);
      if (window.location.hash !== `#${defaultSectionId}`) {
        window.history.replaceState(null, '', `#${defaultSectionId}`);
      }
    };

    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, [defaultSectionId, sections]);

  const selectedSection = sections.find((section) => section.id === selectedId) ?? null;

  const handleSelect = (id: string) => {
    setSelectedId(id);
    window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <div className="about-section-layout" style={{ display: 'grid', gridTemplateColumns: '220px minmax(0, 1fr)', gap: '1.8rem', alignItems: 'flex-start' }}>
      <aside className="about-sidebar" style={{ paddingTop: '0.75rem', position: 'sticky', top: '96px' }}>
        <div className="about-sidebar-links" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <button
            type="button"
            onClick={() => handleSelect('intro')}
            aria-pressed={selectedId === 'intro'}
            style={{
              width: '100%',
              textAlign: 'left',
              border: 'none',
              padding: '0.55rem 0.7rem',
              background: selectedId === 'intro' ? 'rgba(255,255,255,0.18)' : 'transparent',
              color: selectedId === 'intro' ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
              cursor: 'pointer',
              borderRadius: '8px',
              fontSize: '0.98rem',
            }}
          >
            自己紹介
          </button>

          {sections.map((section) => {
            const isActive = section.id === selectedId;

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => handleSelect(section.id)}
                aria-pressed={isActive}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.55rem 0.7rem',
                  background: isActive ? 'rgba(255,255,255,0.18)' : 'transparent',
                  color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease, color 0.2s ease',
                  fontSize: '0.95rem',
                }}
              >
                私の機材： {section.label}
              </button>
            );
          })}
        </div>
      </aside>

      <main className="glass-card about-main-panel" style={{ padding: 'clamp(1.35rem, 3.5vw, 2.1rem)' }}>
        {selectedId === 'intro' ? (
          <AboutIntroPanel />
        ) : selectedSection ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <p style={{ color: 'var(--color-text-faint)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
              自己紹介 / 私の機材 / {selectedSection.label}
            </p>

            <div className="section-divider" />

            <h2
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: '#3f6c12',
                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                margin: 0,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: '0.95rem',
                  height: '0.95rem',
                  background: '#4d7b17',
                  flexShrink: 0,
                }}
              />
              {selectedSection.label}
            </h2>

            <article style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {selectedSection.entries.map((entry, index) => (
                <AboutEntryBlock key={`${selectedSection.id}-${index}-${entry.title}`} entry={entry} />
              ))}
            </article>
          </div>
        ) : null}
      </main>

      <style>{`
        @media (max-width: 900px) {
          .about-section-layout {
            grid-template-columns: 1fr !important;
          }

          .about-sidebar {
            position: static !important;
          }

          .about-intro-hero,
          .about-origin-layout {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 640px) {
          .about-sidebar-links {
            gap: 0.5rem !important;
          }

          .about-main-panel {
            padding: 1.25rem !important;
          }
        }

        @media (max-width: 900px) {
          .activity-section-main {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
}
