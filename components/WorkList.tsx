'use client';

import { useState } from 'react';
import { PROJECTS, type Project, type ProjectLink } from '@/lib/projects';
import StaggerCard from './animation/StaggerCard';
import WordsPullUp from './animation/WordsPullUp';
import WordsPullUpMultiStyle from './animation/WordsPullUpMultiStyle';

export default function WorkList() {
  const [open, setOpen] = useState<Record<number, boolean>>({});

  function toggle(i: number) {
    setOpen((prev) => ({ ...prev, [i]: !prev[i] }));
  }

  return (
    <div id="work" className="work-list">
      <div className="work-inner">
        <div className="section-header section-header--lg">
          <div className="section-num">05</div>
          <h2 className="section-title"><WordsPullUp text="Work" /></h2>
        </div>
        <p className="summary-text" style={{ marginBottom: 40 }}>
          <WordsPullUpMultiStyle
            segments={[
              { text: "Systems I've shipped across banking, government, gaming and telecom — and" },
              { text: 'open-source work on the side.', className: 'italic-accent' },
              { text: 'Click any project to expand the detail.' },
            ]}
          />
        </p>
        {PROJECTS.map((p, i) => (
          <StaggerCard key={p.name} index={i} staggerStep={0.2} y={20} className="project-row">
            <ProjectRow project={p} index={i} isOpen={!!open[i]} onToggle={() => toggle(i)} />
          </StaggerCard>
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
        <div className="project-role italic-accent">{p.role}</div>
        <p className="project-desc">{p.desc}</p>

        <div className="project-tags">
          {p.tags.map((t) => (
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
          {links.map((l) => (
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
