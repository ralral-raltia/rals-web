'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type MountainLayer = {
  id: string;
  baseYRatio: number;
  height: number;
  macroFreq: number;
  midFreq: number;
  fineFreq: number;
  parallaxX: number;
  parallaxY: number;
  fill: string;
};

type Point = { x: number; y: number };

const LAYERS: MountainLayer[] = [
  {
    id: 'far',
    baseYRatio: 0.79,
    height: 72,
    macroFreq: 2.1,
    midFreq: 5.8,
    fineFreq: 13.5,
    parallaxX: 9,
    parallaxY: 10,
    fill: 'url(#mountain-far)',
  },
  {
    id: 'mid',
    baseYRatio: 0.84,
    height: 98,
    macroFreq: 2.7,
    midFreq: 7.4,
    fineFreq: 17,
    parallaxX: 25,
    parallaxY: 20,
    fill: 'url(#mountain-mid)',
  },
  {
    id: 'front',
    baseYRatio: 0.9,
    height: 128,
    macroFreq: 3.3,
    midFreq: 8.5,
    fineFreq: 20.5,
    parallaxX: 40,
    parallaxY: 30,
    fill: 'url(#mountain-front)',
  },
];

const MOBILE_MEDIA_QUERY = '(pointer: fine)';
const LERP = 0.08;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const lerp = (current: number, target: number, amount: number) =>
  current + (target - current) * amount;

const fract = (value: number) => value - Math.floor(value);

const seededHash = (value: number) => fract(Math.sin(value * 127.1 + 311.7) * 43758.5453123);

const smoothstep = (value: number) => value * value * (3 - 2 * value);

const valueNoise = (x: number, seed: number) => {
  const i = Math.floor(x);
  const f = x - i;
  const a = seededHash(i + seed * 73.1);
  const b = seededHash(i + 1 + seed * 73.1);
  return a + (b - a) * smoothstep(f);
};

const fbm = (x: number, seed: number, octaves: number) => {
  let total = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let normalizer = 0;

  for (let i = 0; i < octaves; i += 1) {
    total += valueNoise(x * frequency + seed * 11.7, seed + i * 17.3) * amplitude;
    normalizer += amplitude;
    amplitude *= 0.52;
    frequency *= 2.08;
  }

  return normalizer > 0 ? total / normalizer : 0;
};

const createLayerPath = (
  width: number,
  height: number,
  layer: MountainLayer,
  seed: number,
) => {
  const step = Math.max(8, Math.floor(width / 90));
  const points: Point[] = [];
  const baseY = height * layer.baseYRatio;
  const minY = height * 0.5;
  const maxY = height * 0.95;

  for (let x = 0; x <= width + step; x += step) {
    const nx = x / width;
    const macro = fbm(nx * layer.macroFreq, seed + 11, 3);
    const mid = fbm(nx * layer.midFreq, seed + 29, 4);
    const fine = fbm(nx * layer.fineFreq, seed + 53, 2);

    const profile = (macro - 0.5) * 0.82 + (mid - 0.5) * 0.34 + (fine - 0.5) * 0.12;
    const y = clamp(baseY - profile * layer.height, minY, maxY);

    points.push({ x, y });
  }

  const [first] = points;
  let path = `M 0 ${height} L ${first.x} ${first.y}`;
  for (let i = 1; i < points.length; i += 1) {
    const p = points[i];
    path += ` L ${p.x} ${p.y}`;
  }
  path += ` L ${width} ${height} Z`;

  return path;
};

export default function HeroMountainParallax() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<Record<string, SVGPathElement | null>>({});
  const [size, setSize] = useState({ width: 1200, height: 800 });
  const [canUseMouse, setCanUseMouse] = useState(false);

  const pointer = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  const layers = useMemo(() => {
    return LAYERS.map((layer, index) => ({
      ...layer,
      d: createLayerPath(size.width, size.height, layer, 100 + index * 37),
    }));
  }, [size.height, size.width]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      const width = Math.max(320, Math.floor(entry.contentRect.width));
      const height = Math.max(240, Math.floor(entry.contentRect.height));
      setSize({ width, height });
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    const updateMedia = () => setCanUseMouse(mediaQuery.matches);

    updateMedia();
    mediaQuery.addEventListener('change', updateMedia);

    return () => {
      mediaQuery.removeEventListener('change', updateMedia);
    };
  }, []);

  useEffect(() => {
    let rafId = 0;

    const animate = () => {
      pointer.current.x = lerp(pointer.current.x, target.current.x, LERP);
      pointer.current.y = lerp(pointer.current.y, target.current.y, LERP);

      for (const layer of LAYERS) {
        const element = pathRefs.current[layer.id];
        if (!element) continue;
        const tx = pointer.current.x * layer.parallaxX;
        const ty = pointer.current.y * layer.parallaxY;
        element.setAttribute('transform', `translate(${tx} ${ty})`);
      }

      rafId = window.requestAnimationFrame(animate);
    };

    rafId = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    if (!canUseMouse) {
      target.current = { x: 0, y: 0 };
      return;
    }

    const onMove = (event: MouseEvent) => {
      const x = event.clientX / window.innerWidth;
      const y = event.clientY / window.innerHeight;
      target.current = {
        x: (x - 0.5) * 2,
        y: (y - 0.5) * 2,
      };
    };

    const onLeave = () => {
      target.current = { x: 0, y: 0 };
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, [canUseMouse]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <svg
        viewBox={`0 0 ${size.width} ${size.height}`}
        preserveAspectRatio="none"
        role="presentation"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      >
        <defs>
          <linearGradient id="mountain-far" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(34, 51, 80, 0.46)" />
            <stop offset="100%" stopColor="rgba(15, 24, 42, 0.62)" />
          </linearGradient>
          <linearGradient id="mountain-mid" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(26, 38, 62, 0.68)" />
            <stop offset="100%" stopColor="rgba(11, 19, 33, 0.8)" />
          </linearGradient>
          <linearGradient id="mountain-front" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(14, 20, 33, 0.85)" />
            <stop offset="100%" stopColor="rgba(6, 10, 16, 0.96)" />
          </linearGradient>
        </defs>

        {layers.map((layer) => (
          <path
            key={layer.id}
            ref={(node) => {
              pathRefs.current[layer.id] = node;
            }}
            d={layer.d}
            fill={layer.fill}
          />
        ))}
      </svg>
    </div>
  );
}
