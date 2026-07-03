'use client';

import { useState, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import MeshCanvas from './MeshCanvas';
import WordsPullUp from './animation/WordsPullUp';
import WordsPullUpMultiStyle from './animation/WordsPullUpMultiStyle';

function LinkedInIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.114 20.452H3.558V9h3.556v11.452z" />
    </svg>
  );
}

export default function ResumeHero() {
  const [playing, setPlaying] = useState(true);
  const [hudText, setHudText] = useState('UPTIME 00:00:00  ·  NODES 00  ·  LINKS 00');
  const handleHudUpdate = useCallback((t: string) => setHudText(t), []);

  return (
    <div className="resume-hero">
      <MeshCanvas playing={playing} onHudUpdate={handleHudUpdate} />
      <div className="hero-grad-1" />
      <div className="hero-grad-2" />

      <div className="hero-status">
        <span className="status-dot" />
        <span className="status-label">Online</span>
      </div>

      <div className="hero-hud">
        <span className="hud-time">{hudText}</span>
        <button
          className="hud-btn"
          aria-label={playing ? 'Pause' : 'Play'}
          onClick={() => setPlaying((p) => !p)}
        >
          {playing ? '❚❚' : '►'}
        </button>
      </div>

      <div className="resume-hero-content">
        <div>
          <div className="resume-hero-eyebrow">Senior Full Stack Developer · 10+ Years</div>
          <h1 className="resume-hero-h1">
            <div><WordsPullUp text="Yufei" /></div>
            <div><WordsPullUp text="Liu" /></div>
          </h1>
          <p className="resume-hero-bio">
            <WordsPullUpMultiStyle
              segments={[
                {
                  text: 'Building resilient, high-throughput systems across banking, government, gaming and telecom — from the JVM to the modern frontend.',
                },
                { text: 'Vibe coding lover.', className: 'italic-accent' },
              ]}
            />
          </p>
          <div className="resume-ctas">
            <a href="mailto:gabriel.liu3615@gmail.com" className="resume-cta-primary">
              Email
              <span className="resume-cta-primary-icon">
                <ArrowRight size={16} />
              </span>
            </a>
            <a
              href="https://www.linkedin.com/in/yufei-liu-92766a66"
              target="_blank"
              rel="noopener noreferrer"
              className="resume-cta-secondary"
            >
              <LinkedInIcon size={16} />
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
