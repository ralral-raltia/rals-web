'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ObservationImage } from '../../_lib/observation-data';

type Props = {
  images: ObservationImage[];
};

export function ObservationImageGallery({ images }: Props) {
  const [activeImageSrc, setActiveImageSrc] = useState<string | null>(null);

  const activeImage = useMemo(
    () => images.find((image) => image.src === activeImageSrc) ?? null,
    [activeImageSrc, images],
  );
  const portalTarget = typeof document !== 'undefined' ? document.body : null;

  useEffect(() => {
    if (!activeImage) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeImage]);

  useEffect(() => {
    if (!activeImage) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveImageSrc(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeImage]);

  const closeViewer = () => {
    setActiveImageSrc(null);
  };

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '0.75rem',
          marginBottom: '1.25rem',
        }}
      >
        {images.map((image) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setActiveImageSrc(image.src)}
            style={{
              padding: 0,
              margin: 0,
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.03)',
              cursor: 'pointer',
              overflow: 'hidden',
            }}
          >
            <img
              src={image.src}
              alt={image.alt}
              style={{
                width: '100%',
                height: '220px',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </button>
        ))}
      </div>

      {portalTarget && activeImage && createPortal(
        <div
          role="button"
          tabIndex={0}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeViewer();
            }
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
              closeViewer();
            }
          }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2147483647,
            padding: '2rem',
          }}
        >
          <img
            src={activeImage.src}
            alt={activeImage.alt}
            onClick={(event) => event.stopPropagation()}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          />
        </div>,
        portalTarget,
      )}
    </>
  );
}
