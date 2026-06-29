'use client';

import { useRef, useEffect } from 'react';

interface MeshNode {
  x: number; y: number;
  vx: number; vy: number;
  r: number; pulse: number; hub: boolean;
}

interface Packet {
  a: number; b: number; t: number; sp: number;
}

interface Props {
  playing: boolean;
  onHudUpdate: (text: string) => void;
}

export default function MeshCanvas({ playing, onHudUpdate }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Refs let the stable animation loop always see the latest values
  const playingRef = useRef(playing);
  const hudRef = useRef(onHudUpdate);

  useEffect(() => { playingRef.current = playing; }, [playing]);
  useEffect(() => { hudRef.current = onHudUpdate; }, [onHudUpdate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let ctx: CanvasRenderingContext2D | null = null;
    let W = 0, H = 0, linkDist = 0;
    let nodes: MeshNode[] = [], packets: Packet[] = [];
    let elapsed = 0, last = performance.now();
    let rafId: number;

    function neighbor(i: number): number | null {
      const n = nodes[i], D = linkDist, cand: number[] = [];
      for (let j = 0; j < nodes.length; j++) {
        if (j === i) continue;
        const dx = nodes[j].x - n.x, dy = nodes[j].y - n.y;
        if (dx * dx + dy * dy < D * D) cand.push(j);
      }
      return cand.length ? cand[Math.floor(Math.random() * cand.length)] : null;
    }

    function spawnPacket(): Packet {
      const a = Math.floor(Math.random() * nodes.length);
      const b = neighbor(a);
      return { a, b: b ?? a, t: Math.random(), sp: 0.22 + Math.random() * 0.5 };
    }

    function buildMesh() {
      const count = Math.max(24, Math.min(58, Math.round((W * H) / 26000)));
      linkDist = Math.min(W, H) * 0.3;
      nodes = Array.from({ length: count }, () => {
        const hub = Math.random() < 0.18;
        return {
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6,
          r: hub ? 2.4 + Math.random() * 1.6 : 1 + Math.random(),
          pulse: Math.random() * Math.PI * 2, hub,
        };
      });
      packets = Array.from({ length: Math.max(8, Math.round(nodes.length * 0.55)) }, spawnPacket);
    }

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      W = r.width || 1200; H = r.height || 560;
      canvas.width = Math.max(1, Math.round(W * dpr));
      canvas.height = Math.max(1, Math.round(H * dpr));
      ctx = canvas.getContext('2d');
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildMesh();
    }

    function loop(now: number) {
      rafId = requestAnimationFrame(loop);
      if (!ctx) return;
      let dt = (now - last) / 1000; last = now;
      if (dt > 0.1) dt = 0.016;
      if (!playingRef.current) return;

      const D = linkDist;
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, W, H);

      for (const n of nodes) {
        n.x += n.vx * dt; n.y += n.vy * dt; n.pulse += dt * 1.6;
        if (n.x < 0) { n.x = 0; n.vx *= -1; } else if (n.x > W) { n.x = W; n.vx *= -1; }
        if (n.y < 0) { n.y = 0; n.vy *= -1; } else if (n.y > H) { n.y = H; n.vy *= -1; }
      }

      let links = 0;
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
          if (d2 < D * D) {
            ctx.strokeStyle = `rgba(255,255,255,${((1 - Math.sqrt(d2) / D) * 0.20).toFixed(3)})`;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            links++;
          }
        }
      }

      for (const n of nodes) {
        ctx.fillStyle = n.hub ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.42)';
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
        if (n.hub) {
          ctx.strokeStyle = `rgba(255,255,255,${(0.10 + 0.10 * (0.5 + 0.5 * Math.sin(n.pulse))).toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r + 5, 0, Math.PI * 2); ctx.stroke();
        }
      }

      for (const p of packets) {
        const a = nodes[p.a], b = nodes[p.b];
        if (!a || !b) { Object.assign(p, spawnPacket()); continue; }
        p.t += p.sp * dt;
        if (p.t >= 1) {
          const nb = neighbor(p.b);
          p.a = p.b; p.b = nb ?? Math.floor(Math.random() * nodes.length);
          p.t = 0; p.sp = 0.22 + Math.random() * 0.5; continue;
        }
        const px = a.x + (b.x - a.x) * p.t, py = a.y + (b.y - a.y) * p.t;
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.beginPath(); ctx.arc(px, py, 1.8, 0, Math.PI * 2); ctx.fill();
      }

      elapsed += dt;
      const e = elapsed, pad = (x: number) => String(Math.floor(x)).padStart(2, '0');
      hudRef.current(
        `UPTIME ${pad(e / 3600)}:${pad((e % 3600) / 60)}:${pad(e % 60)}  ·  NODES ${nodes.length}  ·  LINKS ${links}`
      );
    }

    resize();
    window.addEventListener('resize', resize);
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  );
}
