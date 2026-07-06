'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type RidgeStyle = {
  color: string;
  width: number;
  glowColor: string;
  glowWidth: number;
};

type MountainLayer = {
  id: string;
  baseYRatio: number;
  height: number;
  macroFreq: number;
  fineFreq: number;
  sharpness: number;
  fineAmp: number;
  parallaxX: number;
  parallaxY: number;
  swayAmp: number;
  swaySpeed: number;
  fill: string;
  ridge: RidgeStyle;
};

type Point = { x: number; y: number };

// 奥→手前の順。遠景ほど青く霞み、手前ほど暗く尖る（大気遠近法）
const LAYERS: MountainLayer[] = [
  {
    id: 'far',
    baseYRatio: 0.74,
    height: 150,
    macroFreq: 1.6,
    fineFreq: 11,
    sharpness: 2.2,
    fineAmp: 0.1,
    parallaxX: 7,
    parallaxY: 6,
    swayAmp: 1.4,
    swaySpeed: 0.00005,
    fill: 'url(#mtn-far)',
    ridge: {
      color: 'rgba(178, 200, 240, 0.2)',
      width: 1,
      glowColor: 'rgba(110, 168, 254, 0.08)',
      glowWidth: 4,
    },
  },
  {
    id: 'midfar',
    baseYRatio: 0.8,
    height: 140,
    macroFreq: 2.2,
    fineFreq: 14,
    sharpness: 2.7,
    fineAmp: 0.13,
    parallaxX: 15,
    parallaxY: 11,
    swayAmp: 1.8,
    swaySpeed: 0.00006,
    fill: 'url(#mtn-midfar)',
    ridge: {
      color: 'rgba(160, 190, 245, 0.24)',
      width: 1,
      glowColor: 'rgba(110, 168, 254, 0.1)',
      glowWidth: 4,
    },
  },
  {
    id: 'mid',
    baseYRatio: 0.86,
    height: 145,
    macroFreq: 2.8,
    fineFreq: 17,
    sharpness: 3.1,
    fineAmp: 0.16,
    parallaxX: 27,
    parallaxY: 18,
    swayAmp: 2.2,
    swaySpeed: 0.00007,
    fill: 'url(#mtn-mid)',
    ridge: {
      color: 'rgba(140, 180, 250, 0.28)',
      width: 1.2,
      glowColor: 'rgba(110, 168, 254, 0.12)',
      glowWidth: 5,
    },
  },
  {
    id: 'front',
    baseYRatio: 0.93,
    height: 165,
    macroFreq: 3.4,
    fineFreq: 21,
    sharpness: 3.5,
    fineAmp: 0.2,
    parallaxX: 42,
    parallaxY: 28,
    swayAmp: 2.6,
    swaySpeed: 0.00008,
    fill: 'url(#mtn-front)',
    ridge: {
      color: 'rgba(103, 232, 249, 0.4)',
      width: 1.4,
      glowColor: 'rgba(103, 232, 249, 0.14)',
      glowWidth: 6,
    },
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

// リッジノイズ: 谷を折り返して尖った稜線を作る（岩山らしいシルエット）
const ridgedFbm = (x: number, seed: number, octaves: number, sharpness: number) => {
  let total = 0;
  let amplitude = 0.55;
  let frequency = 1;
  let normalizer = 0;

  for (let i = 0; i < octaves; i += 1) {
    const n = valueNoise(x * frequency + seed * 11.7, seed + i * 17.3);
    total += Math.pow(1 - Math.abs(2 * n - 1), sharpness) * amplitude;
    normalizer += amplitude;
    amplitude *= 0.48;
    frequency *= 2.12;
  }

  return normalizer > 0 ? total / normalizer : 0;
};

const createLayerPaths = (
  width: number,
  height: number,
  layer: MountainLayer,
  seed: number,
) => {
  const step = Math.max(5, Math.floor(width / 150));
  const points: Point[] = [];
  const baseY = height * layer.baseYRatio;
  const minY = height * 0.42;
  const maxY = height * 0.98;

  for (let x = 0; x <= width + step; x += step) {
    const nx = x / width;
    const macro = ridgedFbm(nx * layer.macroFreq, seed + 11, 4, layer.sharpness);
    const fine = fbm(nx * layer.fineFreq, seed + 53, 3);

    const profile = (macro - 0.5) + (fine - 0.5) * layer.fineAmp;
    const y = clamp(baseY - profile * layer.height, minY, maxY);

    points.push({ x, y });
  }

  const [first] = points;
  let ridgePath = `M ${first.x} ${first.y}`;
  for (let i = 1; i < points.length; i += 1) {
    ridgePath += ` L ${points[i].x} ${points[i].y}`;
  }

  const fillPath = `M 0 ${height} L ${ridgePath.slice(2)} L ${width} ${height} Z`;

  return { fillPath, ridgePath };
};

export default function HeroMountainParallax() {
  const containerRef = useRef<HTMLDivElement>(null);
  const groupRefs = useRef<Record<string, SVGGElement | null>>({});
  const [size, setSize] = useState({ width: 1200, height: 800 });
  const [canUseMouse, setCanUseMouse] = useState(false);

  const pointer = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  const layers = useMemo(() => {
    return LAYERS.map((layer, index) => ({
      ...layer,
      ...createLayerPaths(size.width, size.height, layer, 100 + index * 37),
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
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let rafId = 0;

    const animate = (time: number) => {
      pointer.current.x = lerp(pointer.current.x, target.current.x, LERP);
      pointer.current.y = lerp(pointer.current.y, target.current.y, LERP);

      LAYERS.forEach((layer, index) => {
        const element = groupRefs.current[layer.id];
        if (!element) return;
        // マウスパララックス + 常時ゆっくり漂うアンビエントスウェイ
        const swayX = Math.sin(time * layer.swaySpeed + index * 1.7) * layer.swayAmp;
        const swayY = Math.cos(time * layer.swaySpeed * 0.8 + index * 2.3) * layer.swayAmp * 0.45;
        const tx = pointer.current.x * layer.parallaxX + swayX;
        const ty = pointer.current.y * layer.parallaxY + swayY;
        element.setAttribute('transform', `translate(${tx.toFixed(2)} ${ty.toFixed(2)})`);
      });

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
          <linearGradient id="mtn-far" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(90, 124, 178, 0.4)" />
            <stop offset="100%" stopColor="rgba(36, 54, 88, 0.55)" />
          </linearGradient>
          <linearGradient id="mtn-midfar" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(56, 80, 122, 0.62)" />
            <stop offset="100%" stopColor="rgba(24, 36, 60, 0.78)" />
          </linearGradient>
          <linearGradient id="mtn-mid" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(30, 44, 72, 0.82)" />
            <stop offset="100%" stopColor="rgba(13, 21, 37, 0.92)" />
          </linearGradient>
          <linearGradient id="mtn-front" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(12, 18, 30, 0.97)" />
            <stop offset="100%" stopColor="rgba(4, 7, 13, 1)" />
          </linearGradient>
          {/* 山あいに漂う霞 */}
          <linearGradient id="mtn-haze" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(110, 168, 254, 0)" />
            <stop offset="55%" stopColor="rgba(124, 158, 220, 0.1)" />
            <stop offset="100%" stopColor="rgba(60, 90, 140, 0.02)" />
          </linearGradient>
        </defs>

        {layers.map((layer, index) => (
          <g key={layer.id}>
            {index > 0 && (
              <rect
                x="0"
                y={size.height * (LAYERS[index - 1].baseYRatio - 0.05)}
                width={size.width}
                height={size.height * 0.16}
                fill="url(#mtn-haze)"
                opacity={1 - index * 0.22}
              />
            )}
            <g
              ref={(node) => {
                groupRefs.current[layer.id] = node;
              }}
            >
              <path d={layer.fillPath} fill={layer.fill} />
              {/* 稜線のリムライト（月明かり + 近未来アクセント） */}
              <path
                d={layer.ridgePath}
                fill="none"
                stroke={layer.ridge.glowColor}
                strokeWidth={layer.ridge.glowWidth}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <path
                d={layer.ridgePath}
                fill="none"
                stroke={layer.ridge.color}
                strokeWidth={layer.ridge.width}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}
