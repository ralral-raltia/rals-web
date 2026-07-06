'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  /** アニメーション開始までの遅延（秒） */
  delay?: number;
  style?: CSSProperties;
};

// ビューポートに入ったタイミングでフェードイン + スライドアップさせるラッパー
export default function Reveal({ children, delay = 0, style }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // reduced-motion 時は閾値なしで即表示（トランジションはグローバルCSSで無効化される）
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      reducedMotion
        ? { threshold: 0 }
        : { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(28px)',
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
