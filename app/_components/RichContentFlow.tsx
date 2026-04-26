import Image from 'next/image';
import type { CSSProperties, ReactNode } from 'react';
import { renderDecoratedLines } from '../_lib/inline-decorations';
import type { RichContentFlow as RichContentFlowData } from '../_lib/rich-content';

type Props = {
  flow: RichContentFlowData;
  title?: ReactNode;
  titleLevel?: 'h2' | 'h3';
  titleStyle?: CSSProperties;
  textColor?: string;
};

function renderParagraphs(text: string, textColor: string) {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => (
      <p key={paragraph} style={{ color: textColor, lineHeight: 1.95, margin: 0 }}>
        {renderDecoratedLines(paragraph)}
      </p>
    ));
}

function getTextAlignStyle(align: 'left' | 'center' | 'right') {
  if (align === 'center') {
    return 'center';
  }
  if (align === 'right') {
    return 'right';
  }
  return 'left';
}

export function RichContentFlow({ flow, title, titleLevel = 'h3', titleStyle, textColor = 'var(--color-text-muted)' }: Props) {
  const leftImages = flow.sideImages.filter((image) => image.align === 'left');
  const rightImages = flow.sideImages.filter((image) => image.align === 'right');
  const clearIndex = flow.blocks.findIndex((block) => block.type === 'clear');
  const wrappedBlocks = clearIndex >= 0 ? flow.blocks.slice(0, clearIndex) : flow.blocks;
  const fullWidthBlocks = clearIndex >= 0 ? flow.blocks.slice(clearIndex + 1) : [];
  const useTopGalleryLayout = leftImages.length > 0 && rightImages.length > 0;
  const TitleTag = titleLevel;

  const renderImageColumn = (
    images: typeof flow.sideImages,
    sizes: string,
  ) => {
    if (!images.length) {
      return null;
    }

    return (
      <div style={{ flex: '0 0 min(280px, 100%)', maxWidth: '280px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {images.map((image) => (
          <div
            key={image.src}
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '4 / 3',
              overflow: 'hidden',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <Image src={image.src} alt={image.alt} fill sizes={sizes} style={{ objectFit: 'cover' }} />
          </div>
        ))}
      </div>
    );
  };

  const renderBlock = (block: RichContentFlowData['blocks'][number], key: string) => {
    if (block.type === 'text') {
      return (
        <div
          key={key}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            textAlign: getTextAlignStyle(block.align),
            alignItems: block.align === 'center' ? 'center' : block.align === 'right' ? 'flex-end' : 'stretch',
          }}
        >
          {renderParagraphs(block.text, textColor).map((paragraph, paragraphIndex) => (
            <div
              key={`${key}-${paragraphIndex}`}
              style={{ width: '100%', maxWidth: block.align === 'center' ? '42rem' : undefined }}
            >
              {paragraph}
            </div>
          ))}
        </div>
      );
    }

    if (block.type === 'image') {
      return (
        <div
          key={key}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '720px',
            aspectRatio: '16 / 10',
            overflow: 'hidden',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)',
            margin: '0 auto',
          }}
        >
          <Image
            src={block.image.src}
            alt={block.image.alt}
            fill
            sizes="(max-width: 900px) 100vw, 720px"
            style={{ objectFit: 'cover' }}
          />
        </div>
      );
    }

    if (block.type === 'line') {
      return (
        <div
          key={key}
          aria-hidden="true"
          style={{
            width: '100%',
            borderTop: `${block.line.thickness}px ${block.line.style} rgba(150, 163, 184, 0.55)`,
          }}
        />
      );
    }

    return null;
  };

  const contentColumn = (
    <div style={{ flex: '1 1 320px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {title ? <TitleTag style={titleStyle}>{title}</TitleTag> : null}
      {wrappedBlocks.map((block, index) => renderBlock(block, `wrapped-${index}`))}
    </div>
  );

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {useTopGalleryLayout ? (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {title ? <TitleTag style={titleStyle}>{title}</TitleTag> : null}
          <div
            className="activity-top-gallery"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1rem',
              width: '100%',
            }}
          >
            {[...leftImages, ...rightImages].map((image) => (
              <div
                key={image.src}
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '4 / 3',
                  overflow: 'hidden',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 900px) 100vw, 420px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
          {wrappedBlocks.map((block, index) => renderBlock(block, `top-${index}`))}
        </div>
      ) : (
        <div className="activity-section-main" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', width: '100%' }}>
          {renderImageColumn(leftImages, '(max-width: 900px) 100vw, 280px')}
          {contentColumn}
          {renderImageColumn(rightImages, '(max-width: 900px) 100vw, 280px')}
        </div>
      )}

      {fullWidthBlocks.length > 0 && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {fullWidthBlocks.map((block, index) => renderBlock(block, `full-${index}`))}
        </div>
      )}
    </div>
  );
}
