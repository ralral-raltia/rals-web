'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speed: number;
  phase: number;
}

export default function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let stars: Star[] = [];

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      generateStars();
    };

    const generateStars = () => {
      const count = Math.floor((canvas.width * canvas.height) / 4000);
      stars = Array.from({ length: count }, () => ({
        x:       Math.random() * canvas.width,
        y:       Math.random() * canvas.height,
        radius:  Math.random() * 1.2 + 0.2,
        opacity: Math.random() * 0.6 + 0.1,
        speed:   Math.random() * 0.8 + 0.3,
        phase:   Math.random() * Math.PI * 2,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        const flicker = s.opacity + Math.sin(t * 0.001 * s.speed + s.phase) * 0.3;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 255, ${Math.max(0, Math.min(1, flicker))})`;
        ctx.fill();

        // 明るい星には淡いグロー
        if (s.radius > 0.9) {
          const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.radius * 5);
          grd.addColorStop(0, `rgba(110, 168, 254, ${flicker * 0.3})`);
          grd.addColorStop(1, 'rgba(110, 168, 254, 0)');
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius * 5, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }
      });
      animId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
