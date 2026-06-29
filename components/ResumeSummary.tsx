'use client';

import { useEffect, useRef } from 'react';
import { SUMMARY } from '@/lib/resume';

export default function ResumeSummary() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>('[data-reveal]'));
    items.forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(22px)';
      item.style.transition = 'opacity 0.7s cubic-bezier(.22,.7,.25,1), transform 0.7s cubic-bezier(.22,.7,.25,1)';
    });
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement;
          el.style.opacity = '1'; el.style.transform = 'none';
          observer.unobserve(el);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    items.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div id="summary" className="resume-section" ref={ref}>
      <div data-reveal className="section-header">
        <div className="section-num">01</div>
        <h2 className="section-title">Summary</h2>
      </div>
      <p data-reveal className="summary-text">{SUMMARY}</p>
    </div>
  );
}
