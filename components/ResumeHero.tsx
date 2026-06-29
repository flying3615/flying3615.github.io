'use client';

import { useState, useCallback } from 'react';
import MeshCanvas from './MeshCanvas';

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
          onClick={() => setPlaying(p => !p)}
        >
          {playing ? '❚❚' : '►'}
        </button>
      </div>

      <div className="resume-hero-content">
        <div>
          <div className="resume-hero-eyebrow">Senior Full Stack Developer · 10+ Years</div>
          <h1 className="resume-hero-h1">Yufei<br />Liu</h1>
          <p className="resume-hero-bio">
            Building resilient, high-throughput systems across banking, government, gaming and
            telecom — from the JVM to the modern frontend. Vibe coding lover.
          </p>
          <div className="resume-ctas">
            <a href="mailto:gabriel.liu3615@gmail.com" className="resume-cta-primary">
              Email <span style={{ fontSize: 14 }}>→</span>
            </a>
            <a
              href="https://www.linkedin.com/in/yufei-liu-92766a66"
              target="_blank"
              rel="noopener noreferrer"
              className="resume-cta-secondary"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
