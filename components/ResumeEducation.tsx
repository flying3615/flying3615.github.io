'use client';

import { useEffect, useRef } from 'react';
import { EDUCATION } from '@/lib/resume';

export default function ResumeEducation() {
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
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div id="education" className="resume-section-alt" ref={ref}>
      <div className="resume-section-alt-inner">
        <div data-reveal className="section-header">
          <div className="section-num">04</div>
          <h2 className="section-title">Education</h2>
        </div>

        {EDUCATION.map((edu, i) => (
          <div key={i} data-reveal className="edu-row">
            <div className="edu-years">{edu.years}</div>
            <div>
              <div className="edu-school">{edu.school}</div>
              <div className="edu-degree">{edu.degree}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
