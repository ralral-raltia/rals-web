'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speed: number;
  phase: number;
  color: string;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  born: number;
  life: number;
  len: number;
  width: number;
}

// 実際の星の色味に近い青白〜暖色のバリエーション
const STAR_COLORS = [
  '200, 220, 255',
  '170, 200, 255',
  '240, 248, 255',
  '255, 244, 214',
];

type StarBackgroundProps = {
  /**
   * page: 全ページ共通の固定背景（従来動作）
   * hero: 親要素内に重ねるオーバーレイ。ヒーロー写真の手前で
   *       メテオを高頻度・高輝度で流す（写真にすでに星があるため点描は控えめ）
   */
  variant?: 'page' | 'hero';
};

export default function StarBackground({ variant = 'page' }: StarBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isHero = variant === 'hero';
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // バリアント別チューニング
    const starDivisor     = isHero ? 14000 : 3800; // heroは写真の星があるので控えめ
    const meteorDelayMin  = isHero ? 1400 : 3500;  // ms
    const meteorDelayRand = isHero ? 2600 : 5500;
    const meteorBaseWidth = isHero ? 2.4 : 1.6;
    const meteorHeadR     = isHero ? 9 : 6;
    const meteorAlphaMax  = isHero ? 1 : 0.9;

    let animId = 0;
    let stars: Star[] = [];
    let meteors: Meteor[] = [];
    let nextMeteorAt = 0;
    let width = 0;
    let height = 0;

    const generateStars = () => {
      const count = Math.floor((width * height) / starDivisor);
      stars = Array.from({ length: count }, () => ({
        x:       Math.random() * width,
        y:       Math.random() * height,
        radius:  Math.random() * 1.3 + 0.2,
        opacity: Math.random() * 0.55 + 0.15,
        speed:   Math.random() * 0.9 + 0.3,
        phase:   Math.random() * Math.PI * 2,
        color:   STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      }));
    };

    const drawStars = (t: number) => {
      stars.forEach((s) => {
        const flicker = reducedMotion
          ? s.opacity + 0.2
          : s.opacity + Math.sin(t * 0.001 * s.speed + s.phase) * 0.3;
        const alpha = Math.max(0, Math.min(1, flicker));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color}, ${alpha})`;
        ctx.fill();

        // 明るい星には淡いグロー
        if (s.radius > 0.9) {
          const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.radius * 5);
          grd.addColorStop(0, `rgba(110, 168, 254, ${alpha * 0.3})`);
          grd.addColorStop(1, 'rgba(110, 168, 254, 0)');
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius * 5, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }
      });
    };

    const spawnMeteor = (t: number) => {
      const towardRight = Math.random() < 0.5;
      const angle = (Math.PI / 180) * (30 + Math.random() * 25);
      const speed = 0.55 + Math.random() * 0.45; // px/ms
      meteors.push({
        x:     width * (0.05 + Math.random() * 0.9),
        y:     height * Math.random() * (isHero ? 0.45 : 0.35),
        vx:    Math.cos(angle) * speed * (towardRight ? 1 : -1),
        vy:    Math.sin(angle) * speed,
        born:  t,
        life:  800 + Math.random() * 500,
        len:   130 + Math.random() * 120,
        width: meteorBaseWidth * (0.8 + Math.random() * 0.5),
      });
    };

    const drawMeteors = (t: number) => {
      meteors = meteors.filter((m) => t - m.born < m.life);
      meteors.forEach((m) => {
        const progress = (t - m.born) / m.life;
        const alpha = Math.sin(Math.PI * progress) * meteorAlphaMax;
        const headX = m.x + m.vx * (t - m.born);
        const headY = m.y + m.vy * (t - m.born);
        const norm = Math.hypot(m.vx, m.vy);
        const tailX = headX - (m.vx / norm) * m.len;
        const tailY = headY - (m.vy / norm) * m.len;

        const trail = ctx.createLinearGradient(headX, headY, tailX, tailY);
        trail.addColorStop(0, `rgba(240, 248, 255, ${alpha})`);
        trail.addColorStop(0.3, `rgba(110, 168, 254, ${alpha * 0.6})`);
        trail.addColorStop(1, 'rgba(110, 168, 254, 0)');
        ctx.strokeStyle = trail;
        ctx.lineWidth = m.width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(headX, headY);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        const head = ctx.createRadialGradient(headX, headY, 0, headX, headY, meteorHeadR);
        head.addColorStop(0, `rgba(240, 248, 255, ${alpha})`);
        head.addColorStop(1, 'rgba(240, 248, 255, 0)');
        ctx.beginPath();
        ctx.arc(headX, headY, meteorHeadR, 0, Math.PI * 2);
        ctx.fillStyle = head;
        ctx.fill();
      });
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      drawStars(t);

      if (t > nextMeteorAt) {
        spawnMeteor(t);
        // heroでは時々2本目を続けて流し「流星群」感を出す
        if (isHero && Math.random() < 0.3) spawnMeteor(t + 120);
        nextMeteorAt = t + meteorDelayMin + Math.random() * meteorDelayRand;
      }
      drawMeteors(t);

      animId = requestAnimationFrame(draw);
    };

    const applySize = (w: number, h: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width  = w;
      height = h;
      canvas.width  = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width  = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      generateStars();

      // reduced-motion 時はアニメーションせず1フレームだけ描画
      if (reducedMotion) {
        ctx.clearRect(0, 0, width, height);
        drawStars(0);
      }
    };

    let cleanupSize: () => void;

    if (isHero) {
      // 親要素サイズに追従
      const parent = canvas.parentElement ?? canvas;
      const observer = new ResizeObserver((entries) => {
        const rect = entries[0].contentRect;
        applySize(Math.max(1, rect.width), Math.max(1, rect.height));
      });
      observer.observe(parent);
      const rect = parent.getBoundingClientRect();
      applySize(Math.max(1, rect.width), Math.max(1, rect.height));
      cleanupSize = () => observer.disconnect();
    } else {
      const onResize = () => applySize(window.innerWidth, window.innerHeight);
      onResize();
      window.addEventListener('resize', onResize);
      cleanupSize = () => window.removeEventListener('resize', onResize);
    }

    if (!reducedMotion) {
      nextMeteorAt = performance.now() + (isHero ? 900 : 2500);
      animId = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(animId);
      cleanupSize();
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      style={
        variant === 'hero'
          ? {
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }
          : {
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 0,
            }
      }
    />
  );
}
