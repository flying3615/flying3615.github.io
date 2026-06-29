'use client';

import { useEffect, useRef } from 'react';
import { EXPERIENCES } from '@/lib/resume';

export default function ResumeExperience() {
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
    <div id="experience" className="resume-section-alt" ref={ref}>
      <div className="resume-section-alt-inner">
        <div data-reveal className="section-header">
          <div className="section-num">02</div>
          <h2 className="section-title">Experience</h2>
        </div>

        {EXPERIENCES.map((exp, i) => (
          <div key={i} data-reveal className="exp-row">
            <div>
              <div className="exp-company-name">{exp.company}</div>
              <div className="exp-meta">{exp.location}</div>
              <div className="exp-meta">{exp.span}</div>
            </div>
            <div>
              {exp.roles.map((role, j) => (
                <div key={j} className="exp-role">
                  <div className="exp-role-header">
                    <div className="exp-role-title">{role.title}</div>
                    <div className="exp-role-dates">{role.dates}</div>
                  </div>
                  {role.bullets.map((bullet, k) => (
                    <div key={k} className="exp-bullet">
                      <span className="exp-bullet-dot">—</span>
                      <span className="exp-bullet-text">{bullet}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
