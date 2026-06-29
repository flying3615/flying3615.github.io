'use client';

import { useEffect, useRef } from 'react';
import { CORE_SKILLS, AI_SKILLS, CERTIFICATIONS } from '@/lib/resume';

export default function ResumeSkills() {
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
    <div id="skills" className="resume-section" ref={ref}>
      <div data-reveal className="section-header">
        <div className="section-num">03</div>
        <h2 className="section-title">Skills</h2>
      </div>

      <div data-reveal className="skills-cols">
        <div>
          <div className="skill-category-label">Core Stack</div>
          <div className="skill-tags">
            {CORE_SKILLS.map(s => (
              <span key={s} className="skill-tag">{s}</span>
            ))}
          </div>

          <div className="skill-category-label skill-category-label--gap">AI &amp; Agentic</div>
          <div className="skill-tags">
            {AI_SKILLS.map(s => (
              <span key={s} className="skill-tag skill-tag--ai">{s}</span>
            ))}
          </div>
        </div>

        <div>
          <div className="skill-category-label">Certifications</div>
          <div className="cert-list">
            {CERTIFICATIONS.map((c, i) => (
              <div key={i} className="cert-item">
                <span className="cert-plus">+</span>
                <span className="cert-text">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
