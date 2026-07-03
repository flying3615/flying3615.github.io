'use client';

import { useState, useCallback } from 'react';
import MeshCanvas from './MeshCanvas';
import WordsPullUp from './animation/WordsPullUp';
import WordsPullUpMultiStyle from './animation/WordsPullUpMultiStyle';

export default function Hero() {
  const [playing, setPlaying] = useState(true);
  const [hudText, setHudText] = useState('UPTIME 00:00:00  ·  NODES 00  ·  LINKS 00');
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
          onClick={() => setPlaying((p) => !p)}
        >
          {playing ? '❚❚' : '►'}
        </button>
      </div>

      <div className="hero-content">
        <div className="hero-eyebrow">Portfolio · Selected Work</div>
        <h1 className="hero-h1">
          <div><WordsPullUp text="Selected" /></div>
          <div><WordsPullUp text="Work" /></div>
        </h1>
        <p className="hero-desc">
          <WordsPullUpMultiStyle
            segments={[
              { text: "Systems I've shipped across banking, government, gaming and telecom — and" },
              { text: 'open-source work on the side.', className: 'italic-accent' },
              { text: 'Click any project to expand the detail.' },
            ]}
          />
        </p>
      </div>
    </div>
  );
}
