'use client';

import { useState, useEffect, useRef } from 'react';
import { PROJECTS, type Project, type ProjectLink } from '@/lib/projects';

export default function WorkList() {
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll reveal — runs once; survives re-renders since styles are applied directly to DOM
  useEffect(() => {
    const container = containerRef.current;
    if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rows = Array.from(container.querySelectorAll<HTMLElement>('.project-row'));
    rows.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.7s cubic-bezier(.22,.7,.25,1), transform 0.7s cubic-bezier(.22,.7,.25,1)';
    });

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.opacity = '1';
            el.style.transform = 'none';
            observer.unobserve(el);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px' }
    );
    rows.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function toggle(i: number) {
    setOpen(prev => ({ ...prev, [i]: !prev[i] }));
  }

  return (
    <div id="work" className="work-list">
      <div ref={containerRef} className="work-inner">
        {PROJECTS.map((p, i) => (
          <ProjectRow
            key={i}
            project={p}
            index={i}
            isOpen={!!open[i]}
            onToggle={() => toggle(i)}
          />
        ))}
      </div>
    </div>
  );
}

// ── ProjectRow ────────────────────────────────────────────────────────────────

interface RowProps {
  project: Project;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

function ProjectRow({ project: p, index, isOpen, onToggle }: RowProps) {
  const num = String(index + 1).padStart(2, '0');

  return (
    <div className="project-row">
      <div className="project-grid">
        {/* media */}
        <div className="project-media">
          <div className="media-num">{num}</div>
          {p.shotIframeSrc ? (
            <>
              <iframe
                src={p.shotIframeSrc}
                className="media-iframe"
                title={`${p.name} preview`}
                loading="lazy"
              />
              <a
                href={p.shotIframeSrc}
                target="_blank"
                rel="noopener noreferrer"
                className="media-iframe-overlay"
                aria-label={`Open ${p.name} full screen`}
              />
            </>
          ) : (
            <div className="media-shot">
              <span>{p.shot}</span>
            </div>
          )}
        </div>

        {/* content */}
        <div>
          <div className="project-eyebrow">{p.eyebrow}</div>
          <h2 className="project-name">{p.name}</h2>
          <div className="project-role">{p.role}</div>
          <p className="project-desc">{p.desc}</p>

          <div className="project-tags">
            {p.tags.map(t => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>

          <button className="project-btn" onClick={onToggle}>
            {isOpen ? 'Hide details' : 'View details'}
            <span style={{ fontSize: 14 }}>{isOpen ? '–' : '+'}</span>
          </button>

          {isOpen && <DetailPanel details={p.details} links={p.links} />}
        </div>
      </div>
    </div>
  );
}

// ── DetailPanel ───────────────────────────────────────────────────────────────

function DetailPanel({ details, links }: { details: string[]; links: ProjectLink[] }) {
  return (
    <div className="project-detail">
      <div className="detail-label">Highlights</div>
      {details.map((d, i) => (
        <div key={i} className="detail-item">
          <span className="detail-bullet">·</span>
          <span className="detail-text">{d}</span>
        </div>
      ))}
      {links.length > 0 && (
        <div className="detail-links">
          {links.map(l => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="detail-link"
            >
              {l.label} <span style={{ fontSize: 13 }}>↗</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
