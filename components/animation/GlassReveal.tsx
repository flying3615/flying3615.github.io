'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

interface GlassRevealProps {
  className?: string;
  children: ReactNode;
}

export default function GlassReveal({ className, children }: GlassRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`glass-card${visible ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  );
}
