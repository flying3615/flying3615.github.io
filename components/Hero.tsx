'use client';

import { useState, useCallback } from 'react';
import MeshCanvas from './MeshCanvas';

export default function Hero() {
  const [playing, setPlaying] = useState(true);
  const [hudText, setHudText] = useState('UPTIME 00:00:00  ·  NODES 00  ·  LINKS 00');

  // useCallback keeps the reference stable so MeshCanvas's ref sync effect fires minimally
  const handleHudUpdate = useCallback((text: string) => setHudText(text), []);

  return (
    <div className="hero">
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

      <div className="hero-content">
        <div className="hero-eyebrow">Portfolio · Selected Work</div>
        <h1 className="hero-h1">Selected<br />Work</h1>
        <p className="hero-desc">
          Systems I&apos;ve shipped across banking, government, gaming and telecom — and
          open-source work on the side. Click any project to expand the detail.
        </p>
      </div>
    </div>
  );
}
