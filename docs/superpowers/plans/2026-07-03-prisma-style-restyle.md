# Prisma-Style Resume Restyle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle both pages of the `flying3615/resume` Next.js site (main resume + `/projects`) to match the dark/cream/cinematic Prisma visual language — new fonts, colors, noise textures, and framer-motion animations — while preserving all existing content, section structure, and the GitHub Pages static-export deploy.

**Architecture:** Pure visual/animation restyle. `app/globals.css` gets new design tokens (colors, fonts) and two noise-texture utility classes; `app/layout.tsx` loads `Almarai` + `Instrument Serif` via `next/font/google`; four new shared animation components (`components/animation/`) wrap existing content with pull-up and scroll-reveal effects, replacing several hand-rolled `IntersectionObserver` reveal effects already in the codebase. No Tailwind is introduced — the project's existing hand-written CSS approach is kept and extended.

**Tech Stack:** Next.js 15, React 19, TypeScript, framer-motion (new dependency), lucide-react (new dependency), hand-written CSS (no Tailwind).

**Reference:** Full design rationale in `docs/superpowers/specs/2026-07-03-prisma-style-restyle-design.md`.

---

## Task 1: Dependencies and font setup

**Files:**
- Modify: `package.json`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Install framer-motion and lucide-react**

Run (from repo root `/Users/yufei/Documents/git/resume`): `npm install framer-motion lucide-react`
Expected: both added under `"dependencies"` in `package.json`.

- [ ] **Step 2: Replace `app/layout.tsx` contents entirely**

```tsx
import type { Metadata } from 'next';
import { Almarai, Instrument_Serif } from 'next/font/google';
import './globals.css';

const almarai = Almarai({
  subsets: ['latin'],
  weight: ['300', '400', '700', '800'],
  variable: '--font-almarai',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
  variable: '--font-instrument-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Yufei Liu — Portfolio',
  description: 'Senior Full Stack Developer in Wellington, NZ.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${almarai.variable} ${instrumentSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

(These are the confirmed exact export names and option shapes from `node_modules/next/dist/compiled/@next/font/dist/google/index.d.ts` in this project — `Almarai` supports weights `'300'|'400'|'700'|'800'`, normal style only; `Instrument_Serif` supports weight `'400'` only, with `'italic'` as a valid `style` value.)

- [ ] **Step 3: Verify the project still type-checks and builds**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json app/layout.tsx
git commit -m "chore: add framer-motion/lucide-react, load Almarai + Instrument Serif fonts"
```

---

## Task 2: Global design tokens, fonts, and noise textures

**Files:**
- Modify: `app/globals.css` (full-file rewrite)

- [ ] **Step 1: Replace `app/globals.css` contents entirely**

```css
:root {
  --cream: #E1E0CC;
  --cream-alt: #DEDBC8;
  --bg: #000000;
  --bg-card: #101010;
  --bg-card-alt: #212121;
  --muted: #6b6b63;
  --border: rgba(225, 224, 204, 0.12);
}

*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--cream);
  font-family: var(--font-almarai), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  min-height: 100vh;
  overflow-x: hidden;
}
::selection { background: var(--cream); color: var(--bg); }
a { color: inherit; }

.italic-accent {
  font-family: var(--font-instrument-serif), serif;
  font-style: italic;
}

.noise-overlay {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}

.bg-noise {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}

@keyframes livePulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.25; transform: scale(0.7); }
}
@keyframes detailIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: none; }
}

/* ── Nav ── */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 50;
  display: flex; align-items: center; justify-content: space-between;
  padding: 24px 32px;
  background: linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0));
}
.nav-logo {
  font-weight: 700; font-size: 18px; letter-spacing: 0.5px;
  color: var(--cream); text-decoration: none;
}
.nav-links { display: flex; gap: 32px; align-items: center; }
.nav-links a {
  font-size: 14px; font-weight: 400; line-height: 1;
  color: rgba(225, 224, 204, 0.8); text-decoration: none;
  transition: color 0.2s;
}
.nav-links a:hover { color: var(--cream); }

/* ── Hero ── */
.hero {
  position: relative; height: 72vh; min-height: 560px;
  display: flex; flex-direction: column; justify-content: flex-end; overflow: hidden;
}
.hero-grad-1 {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(120% 90% at 72% 8%, rgba(225,224,204,0.12), rgba(0,0,0,0) 55%);
}
.hero-grad-2 {
  position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0) 62%);
}
.hero-status {
  position: absolute; top: 96px; right: 32px; z-index: 3;
  display: flex; align-items: center; gap: 10px;
}
.status-dot {
  width: 8px; height: 8px; border-radius: 9999px; background: var(--cream);
  animation: livePulse 1.8s ease-in-out infinite;
}
.status-label {
  font-size: 12px; font-weight: 700; line-height: 2; letter-spacing: 0.4px; color: var(--cream-alt);
}
.hero-hud {
  position: absolute; bottom: 32px; right: 32px; z-index: 3;
  display: flex; align-items: center; gap: 16px;
}
.hud-time {
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 11px; letter-spacing: 1px; color: var(--cream-alt); white-space: nowrap;
}
.hud-btn {
  width: 40px; height: 40px; border: 1px solid rgba(225, 224, 204, 0.5); border-radius: 9999px;
  background: transparent; color: var(--cream); display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: 13px; line-height: 1; padding: 0; transition: border-color 0.2s;
}
.hud-btn:hover { border-color: rgba(225, 224, 204, 0.9); }
.hero-content {
  position: relative; z-index: 2; max-width: 1200px; margin: 0 auto;
  width: 100%; padding: 0 32px 72px;
}
.hero-eyebrow {
  font-size: 12px; font-weight: 400; line-height: 2; letter-spacing: 0.4px;
  color: var(--cream-alt); opacity: 0.7; margin-bottom: 18px;
}
.hero-h1 {
  font-weight: 700; font-size: 80px; line-height: 0.95; letter-spacing: -0.02em;
  margin: 0 0 24px; color: var(--cream);
}
.hero-desc {
  font-size: 16px; font-weight: 400; line-height: 1.7; letter-spacing: 0.1px;
  color: var(--cream-alt); max-width: 560px; margin: 0; opacity: 0.85;
}

/* ── Credential strip ── */
.cred-strip {
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  background: var(--bg-card);
}
.cred-grid {
  max-width: 1200px; margin: 0 auto;
  display: grid; grid-template-columns: repeat(5, 1fr);
}
.cred-cell {
  padding: 32px; border-right: 1px solid var(--border);
}
.cred-cell:last-child { border-right: none; }
.cred-label {
  font-size: 12px; letter-spacing: 0.4px; line-height: 2;
  color: var(--muted); margin-bottom: 8px;
}
.cred-value {
  font-weight: 700; font-size: 24px; letter-spacing: 0.2px;
  line-height: 1.1; color: var(--cream);
}

/* ── Work list ── */
.work-list { border-top: 1px solid var(--border); scroll-margin-top: 80px; }
.work-inner { max-width: 1200px; margin: 0 auto; padding: 0 32px; }
.project-row { padding: 64px 0; border-bottom: 1px solid var(--border); }
.project-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: start; }
.project-media {
  position: relative; height: 340px; border: 1px solid var(--border); border-radius: 8px; overflow: hidden;
  background: var(--bg-card-alt);
}
.media-num {
  position: absolute; top: 20px; left: 20px; font-weight: 700; font-size: 48px;
  line-height: 1; letter-spacing: 0.4px; color: rgba(225, 224, 204, 0.18);
}
.media-shot {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
}
.media-shot span {
  font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 11px;
  letter-spacing: 2px; color: var(--muted);
}
.media-iframe {
  position: absolute; inset: 0; width: 100%; height: 100%;
  border: 0; pointer-events: none; border-radius: 7px;
}
.media-iframe-overlay {
  position: absolute; inset: 0; cursor: pointer; border-radius: 7px;
  transition: background 0.2s;
}
.media-iframe-overlay:hover { background: rgba(225, 224, 204, 0.06); }
.media-iframe-overlay::after {
  content: '↗ Open'; position: absolute; bottom: 14px; right: 16px;
  font-size: 12px; font-weight: 700; letter-spacing: 0.3px;
  color: rgba(225, 224, 204, 0); transition: color 0.2s;
}
.media-iframe-overlay:hover::after { color: rgba(225, 224, 204, 0.7); }
.project-eyebrow {
  font-size: 12px; font-weight: 400; line-height: 2; letter-spacing: 0.4px;
  color: var(--muted); margin-bottom: 14px;
}
.project-name {
  font-weight: 700; font-size: 48px; line-height: 1.05; letter-spacing: -0.01em;
  margin: 0 0 8px; color: var(--cream);
}
.project-role {
  font-size: 14px; font-weight: 700; line-height: 1.5; letter-spacing: 0.2px;
  color: var(--cream-alt); opacity: 0.7; margin-bottom: 20px;
}
.project-desc {
  font-size: 16px; line-height: 1.6; letter-spacing: 0.1px;
  color: var(--cream-alt); opacity: 0.9; margin: 0 0 24px; max-width: 520px;
}
.project-tags { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 28px; }
.tag {
  padding: 9px 16px; border: 1px solid var(--border); border-radius: 32px;
  font-size: 12px; font-weight: 700; letter-spacing: 0.2px; color: var(--cream-alt);
}
.project-btn {
  display: inline-flex; align-items: center; gap: 10px; padding: 14px 22px;
  border: 1px solid var(--cream); border-radius: 32px; background: transparent; color: var(--cream);
  font-family: var(--font-almarai), Arial, sans-serif; font-size: 14px; font-weight: 700;
  line-height: 1; letter-spacing: 0.2px; cursor: pointer;
  transition: background 0.2s;
}
.project-btn:hover { background: rgba(225, 224, 204, 0.08); }
.project-detail {
  margin-top: 32px; padding-top: 28px; border-top: 1px solid var(--border);
  animation: detailIn 0.5s ease;
}
.detail-label {
  font-size: 12px; letter-spacing: 0.4px; line-height: 2;
  color: var(--muted); margin-bottom: 16px;
}
.detail-item { display: flex; gap: 16px; margin-bottom: 12px; }
.detail-bullet { color: var(--muted); flex-shrink: 0; font-weight: 700; }
.detail-text {
  font-size: 16px; line-height: 1.5; letter-spacing: 0.1px;
  color: var(--cream-alt); opacity: 0.85; max-width: 560px;
}
.detail-links { display: flex; flex-wrap: wrap; gap: 28px; margin-top: 24px; }
.detail-link {
  display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700;
  letter-spacing: 0.2px; color: var(--cream); text-decoration: none;
  border-bottom: 1px solid var(--cream); padding-bottom: 3px; transition: opacity 0.2s;
}
.detail-link:hover { opacity: 0.7; }

/* ── Footer ── */
.footer { background: var(--bg); }
.footer-inner { max-width: 1200px; margin: 0 auto; padding: 80px 32px; }
.footer-h2 {
  font-weight: 700; font-size: 60px; line-height: 1.2; letter-spacing: -0.01em;
  margin: 0 0 36px; color: var(--cream);
}
.footer-contacts { display: flex; gap: 48px; flex-wrap: wrap; margin-bottom: 64px; }
.fc-label {
  font-size: 12px; letter-spacing: 0.4px; line-height: 2; color: var(--muted); margin-bottom: 8px;
}
.fc-value { font-size: 16px; line-height: 1.5; color: var(--cream); text-decoration: underline; }
.footer-bar {
  border-top: 1px solid var(--border); padding-top: 24px;
  display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;
}
.footer-name { font-weight: 700; font-size: 14px; letter-spacing: 0.3px; color: var(--cream); }
.footer-tagline { font-size: 14px; line-height: 1.5; color: var(--muted); }
.contact-item { display: flex; flex-direction: column; }
.contact-label {
  font-size: 12px; letter-spacing: 0.4px; line-height: 2; color: var(--muted); margin-bottom: 8px;
}
.contact-link { font-size: 16px; line-height: 1.5; color: var(--cream); text-decoration: underline; }

/* ── Resume Nav ── */
.resume-nav-links a { opacity: 1; }

/* ── Resume Hero ── */
.resume-hero {
  position: relative; height: 100vh; min-height: 680px;
  display: flex; flex-direction: column; justify-content: flex-end; overflow: hidden;
}
.resume-hero-content {
  position: relative; z-index: 2; max-width: 1200px; margin: 0 auto; width: 100%;
  padding: 0 32px 80px; display: flex; align-items: flex-end;
  justify-content: space-between; gap: 48px; flex-wrap: wrap;
}
.resume-hero-eyebrow {
  font-size: 12px; font-weight: 400; line-height: 2; letter-spacing: 0.4px;
  color: var(--cream-alt); opacity: 0.7; margin-bottom: 18px;
}
.resume-hero-h1 {
  font-weight: 700; font-size: 100px; line-height: 0.9; letter-spacing: -0.03em;
  margin: 0 0 28px; color: var(--cream);
}
.resume-hero-bio {
  font-size: 16px; font-weight: 400; line-height: 1.7; letter-spacing: 0.1px;
  color: var(--cream-alt); max-width: 520px; margin: 0 0 36px; opacity: 0.85;
}
.resume-ctas { display: flex; gap: 16px; flex-wrap: wrap; align-items: center; }
.resume-cta-primary {
  display: inline-flex; align-items: center; gap: 10px; padding: 8px 8px 8px 24px;
  border-radius: 32px; background: var(--cream); color: var(--bg);
  font-family: var(--font-almarai), Arial, sans-serif; font-size: 15px; font-weight: 700;
  line-height: 1; text-decoration: none; transition: gap 0.3s;
}
.resume-cta-primary:hover { gap: 16px; }
.resume-cta-primary-icon {
  width: 36px; height: 36px; border-radius: 9999px; background: var(--bg); color: var(--cream);
  display: flex; align-items: center; justify-content: center; transition: transform 0.3s;
}
.resume-cta-primary:hover .resume-cta-primary-icon { transform: scale(1.1); }
.resume-cta-secondary {
  display: inline-flex; align-items: center; gap: 10px; padding: 18px 24px;
  border: 1px solid var(--border); border-radius: 32px; background: transparent; color: var(--cream-alt);
  font-family: var(--font-almarai), Arial, sans-serif; font-size: 15px; font-weight: 700;
  line-height: 1; text-decoration: none; transition: border-color 0.2s;
}
.resume-cta-secondary:hover { border-color: var(--cream); }

/* ── Resume sections ── */
.resume-section { max-width: 1200px; margin: 0 auto; padding: 96px 32px; scroll-margin-top: 80px; }
.resume-section-alt { border-top: 1px solid var(--border); background: var(--bg-card); scroll-margin-top: 80px; }
.resume-section-alt-inner { max-width: 1200px; margin: 0 auto; padding: 96px 32px; }
.section-header { display: flex; align-items: baseline; gap: 18px; margin-bottom: 40px; }
.section-header--lg { margin-bottom: 56px; }
.section-num { font-size: 12px; letter-spacing: 0.4px; line-height: 2; color: var(--muted); }
.section-title { font-weight: 700; font-size: 48px; line-height: 1.25; letter-spacing: -0.01em; margin: 0; color: var(--cream); }
.summary-text {
  font-size: 16px; line-height: 1.7; letter-spacing: 0.1px;
  color: var(--cream-alt); max-width: 760px; margin: 0; opacity: 0.9;
}

/* ── Experience ── */
.exp-row {
  display: grid; grid-template-columns: 300px 1fr; gap: 48px;
  padding: 40px 0; border-top: 1px solid var(--border);
}
.exp-company-name {
  font-weight: 700; font-size: 24px; letter-spacing: 0.2px;
  line-height: 1.15; margin-bottom: 12px; color: var(--cream);
}
.exp-meta { font-size: 12px; font-weight: 400; line-height: 2; letter-spacing: 0.4px; color: var(--muted); }
.exp-role { margin-bottom: 28px; }
.exp-role-header {
  display: flex; align-items: baseline; justify-content: space-between;
  gap: 24px; flex-wrap: wrap; margin-bottom: 14px;
}
.exp-role-title { font-weight: 700; font-size: 24px; letter-spacing: 0.2px; color: var(--cream); }
.exp-role-dates { font-size: 14px; line-height: 1.5; color: var(--muted); white-space: nowrap; }
.exp-bullet { display: flex; gap: 16px; margin-bottom: 10px; }
.exp-bullet-dot { color: var(--muted); flex-shrink: 0; font-weight: 700; }
.exp-bullet-text { font-size: 16px; line-height: 1.5; letter-spacing: 0.1px; color: var(--cream-alt); opacity: 0.85; }

/* ── Skills ── */
.skills-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; }
.skill-category-label {
  font-size: 12px; letter-spacing: 0.4px; line-height: 2;
  color: var(--muted); margin-bottom: 24px;
}
.skill-category-label--gap { margin-top: 32px; }
.skill-tags { display: flex; flex-wrap: wrap; gap: 12px; }
.skill-tag {
  padding: 12px 20px; border: 1px solid var(--border); border-radius: 32px; background: var(--bg-card-alt);
  font-size: 14px; font-weight: 700; letter-spacing: 0.2px; color: var(--cream-alt);
}
.skill-tag--ai { border-color: var(--cream); color: var(--cream); }
.cert-list { margin: 0; }
.cert-item { display: flex; gap: 16px; padding: 16px 0; border-bottom: 1px solid var(--border); }
.cert-plus { color: var(--cream); font-weight: 700; flex-shrink: 0; }
.cert-text { font-size: 16px; line-height: 1.5; letter-spacing: 0.1px; color: var(--cream-alt); opacity: 0.9; }

/* ── Education ── */
.edu-row {
  display: grid; grid-template-columns: 300px 1fr; gap: 48px;
  padding: 40px 0; border-top: 1px solid var(--border); align-items: baseline;
}
.edu-years { font-size: 12px; font-weight: 400; line-height: 2; letter-spacing: 0.4px; color: var(--muted); }
.edu-school { font-weight: 700; font-size: 24px; letter-spacing: 0.2px; margin-bottom: 10px; color: var(--cream); }
.edu-degree { font-size: 16px; line-height: 1.5; letter-spacing: 0.1px; color: var(--cream-alt); opacity: 0.85; }
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no errors (CSS isn't type-checked, but this confirms the rest of the project still compiles).

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: replace design tokens with Prisma cream/black palette, drop uppercase styling"
```

---

## Task 3: Shared animation components

**Files:**
- Create: `components/animation/WordsPullUp.tsx`
- Create: `components/animation/WordsPullUpMultiStyle.tsx`
- Create: `components/animation/AnimatedLetter.tsx`
- Create: `components/animation/StaggerCard.tsx`

- [ ] **Step 1: Create `components/animation/WordsPullUp.tsx`**

```tsx
'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface WordsPullUpProps {
  text: string;
  className?: string;
}

export default function WordsPullUp({ text, className = '' }: WordsPullUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(' ');

  return (
    <span ref={ref} className={className} style={{ display: 'inline-flex', flexWrap: 'wrap' }}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          style={{ overflow: 'hidden', display: 'inline-block', marginRight: '0.25em' }}
        >
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
```

- [ ] **Step 2: Create `components/animation/WordsPullUpMultiStyle.tsx`**

```tsx
'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export interface TextSegment {
  text: string;
  className?: string;
}

interface WordsPullUpMultiStyleProps {
  segments: TextSegment[];
  className?: string;
}

export default function WordsPullUpMultiStyle({ segments, className = '' }: WordsPullUpMultiStyleProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  const words = segments.flatMap((segment) =>
    segment.text.split(' ').map((word) => ({ word, className: segment.className ?? '' }))
  );

  return (
    <span ref={ref} className={className} style={{ display: 'inline-flex', flexWrap: 'wrap' }}>
      {words.map((item, i) => (
        <span
          key={`${item.word}-${i}`}
          style={{ overflow: 'hidden', display: 'inline-block', marginRight: '0.3em' }}
        >
          <motion.span
            className={item.className}
            style={{ display: 'inline-block' }}
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            {item.word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
```

- [ ] **Step 3: Create `components/animation/AnimatedLetter.tsx`**

```tsx
'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';

interface AnimatedLetterProps {
  char: string;
  index: number;
  totalChars: number;
  scrollYProgress: MotionValue<number>;
  italic?: boolean;
}

export default function AnimatedLetter({
  char,
  index,
  totalChars,
  scrollYProgress,
  italic = false,
}: AnimatedLetterProps) {
  const charProgress = index / totalChars;
  const opacity = useTransform(scrollYProgress, [charProgress - 0.1, charProgress + 0.05], [0.2, 1]);

  return (
    <motion.span
      style={{
        opacity,
        fontFamily: italic ? 'var(--font-instrument-serif), serif' : undefined,
        fontStyle: italic ? 'italic' : undefined,
      }}
    >
      {char === ' ' ? ' ' : char}
    </motion.span>
  );
}
```

- [ ] **Step 4: Create `components/animation/StaggerCard.tsx`**

```tsx
'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

interface StaggerCardProps {
  index: number;
  className?: string;
  children: ReactNode;
}

export default function StaggerCard({ index, className, children }: StaggerCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add components/animation
git commit -m "feat: add WordsPullUp, WordsPullUpMultiStyle, AnimatedLetter, StaggerCard animation primitives"
```

---

## Task 4: Retint MeshCanvas and normalize nav wordmark casing

**Files:**
- Modify: `components/MeshCanvas.tsx:106,114,117,133`
- Modify: `components/Nav.tsx:6`
- Modify: `components/ResumeNav.tsx:6`

- [ ] **Step 1: Retint the link lines in `components/MeshCanvas.tsx`**

Find (line 106):
```tsx
            ctx.strokeStyle = `rgba(255,255,255,${((1 - Math.sqrt(d2) / D) * 0.20).toFixed(3)})`;
```
Replace with:
```tsx
            ctx.strokeStyle = `rgba(225,224,204,${((1 - Math.sqrt(d2) / D) * 0.20).toFixed(3)})`;
```

- [ ] **Step 2: Retint the node dots (line 114)**

Find:
```tsx
        ctx.fillStyle = n.hub ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.42)';
```
Replace with:
```tsx
        ctx.fillStyle = n.hub ? 'rgba(225,224,204,0.92)' : 'rgba(225,224,204,0.42)';
```

- [ ] **Step 3: Retint the hub pulse ring (line 117)**

Find:
```tsx
          ctx.strokeStyle = `rgba(255,255,255,${(0.10 + 0.10 * (0.5 + 0.5 * Math.sin(n.pulse))).toFixed(3)})`;
```
Replace with:
```tsx
          ctx.strokeStyle = `rgba(225,224,204,${(0.10 + 0.10 * (0.5 + 0.5 * Math.sin(n.pulse))).toFixed(3)})`;
```

- [ ] **Step 4: Retint the packet dot (line 133)**

Find:
```tsx
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
```
Replace with:
```tsx
        ctx.fillStyle = 'rgba(225,224,204,0.95)';
```

- [ ] **Step 5: Normalize the nav wordmark casing**

In `components/Nav.tsx:6`, change:
```tsx
      <Link href="/" className="nav-logo">YUFEI LIU</Link>
```
to:
```tsx
      <Link href="/" className="nav-logo">Yufei Liu</Link>
```

In `components/ResumeNav.tsx:6`, change:
```tsx
      <Link href="/" className="nav-logo">YUFEI LIU</Link>
```
to:
```tsx
      <Link href="/" className="nav-logo">Yufei Liu</Link>
```

- [ ] **Step 6: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add components/MeshCanvas.tsx components/Nav.tsx components/ResumeNav.tsx
git commit -m "feat: retint MeshCanvas network to cream palette, normalize nav wordmark casing"
```

---

## Task 5: Resume Hero

**Files:**
- Modify: `components/ResumeHero.tsx` (full-file rewrite)

- [ ] **Step 1: Replace `components/ResumeHero.tsx` contents entirely**

**Note:** the originally-planned code below imported a `Linkedin` icon from `lucide-react`, but the installed version (`lucide-react@1.23.0`) no longer exports brand/social icons at all (confirmed by inspecting `node_modules/lucide-react` directly — only generic icons like `Link`/`ExternalLink` remain). The code block below has already been corrected to use a small local inline SVG (`LinkedInIcon`) instead — use this version, not a `lucide-react` import, for the LinkedIn icon.

```tsx
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
```

- [ ] **Step 2: Verify types**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Verify in browser**

Run: `npm run dev`, open `http://localhost:3000/resume/` (note the `/resume/` `basePath` from `next.config.ts`). Confirm:
- MeshCanvas network renders in cream tones, not white
- "Yufei" / "Liu" pull up on load, stacked on two lines
- Bio paragraph pulls up word-by-word with "Vibe coding lover." in italic serif
- Email button is a cream pill with a black circle + arrow that widens/scales on hover; LinkedIn button shows the inline LinkedIn SVG icon

Stop the dev server after confirming (`Ctrl+C`).

- [ ] **Step 4: Commit**

```bash
git add components/ResumeHero.tsx
git commit -m "feat: restyle ResumeHero with WordsPullUp name, italic bio accent, cream CTA buttons"
```

---

## Task 6: Credential strip

**Files:**
- Modify: `components/CredentialStrip.tsx` (full-file rewrite)

- [ ] **Step 1: Replace `components/CredentialStrip.tsx` contents entirely**

```tsx
import StaggerCard from './animation/StaggerCard';

const CREDENTIALS = [
  { label: 'Experience', value: '10+ Years' },
  { label: 'Java', value: 'OCP SE 11' },
  { label: 'Kubernetes', value: 'CKAD · CKA' },
  { label: 'AWS', value: 'SA Pro · Dev' },
  { label: 'Agentic AI', value: 'Harness Eng.' },
];

export default function CredentialStrip() {
  return (
    <div className="cred-strip">
      <div className="cred-grid">
        {CREDENTIALS.map((c, i) => (
          <StaggerCard key={c.label} index={i} className="cred-cell">
            <div className="cred-label">{c.label}</div>
            <div className="cred-value">{c.value}</div>
          </StaggerCard>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/CredentialStrip.tsx
git commit -m "feat: restyle CredentialStrip with StaggerCard entrance and cream card background"
```

---

## Task 7: Resume Summary

**Files:**
- Modify: `components/ResumeSummary.tsx` (full-file rewrite)

- [ ] **Step 1: Replace `components/ResumeSummary.tsx` contents entirely**

```tsx
'use client';

import { useRef } from 'react';
import { useScroll } from 'framer-motion';
import { SUMMARY } from '@/lib/resume';
import WordsPullUp from './animation/WordsPullUp';
import AnimatedLetter from './animation/AnimatedLetter';

const ITALIC_PHRASE = 'a vibe coding lover at heart';
const ITALIC_START = SUMMARY.indexOf(ITALIC_PHRASE);
const ITALIC_END = ITALIC_START + ITALIC_PHRASE.length;

export default function ResumeSummary() {
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: paragraphRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  const chars = SUMMARY.split('');

  return (
    <div id="summary" className="resume-section">
      <div className="section-header">
        <div className="section-num">01</div>
        <h2 className="section-title"><WordsPullUp text="Summary" /></h2>
      </div>
      <p ref={paragraphRef} className="summary-text">
        {chars.map((char, i) => (
          <AnimatedLetter
            key={i}
            char={char}
            index={i}
            totalChars={chars.length}
            scrollYProgress={scrollYProgress}
            italic={i >= ITALIC_START && i < ITALIC_END}
          />
        ))}
      </p>
    </div>
  );
}
```

(`ITALIC_START`/`ITALIC_END` locate the literal substring `"a vibe coding lover at heart"` inside the `SUMMARY` constant from `lib/resume.ts:21`, which ends in exactly that phrase — confirmed by inspection, so no fallback for a missing match is needed.)

- [ ] **Step 2: Verify types**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Verify in browser**

Run: `npm run dev`, open `http://localhost:3000/resume/`, scroll to the Summary section. Confirm:
- "Summary" heading pulls up
- Body paragraph reveals progressively character-by-character while scrolling through the section
- The trailing phrase "a vibe coding lover at heart" renders in italic serif while still following the same opacity reveal as the rest of the paragraph

Stop the dev server after confirming.

- [ ] **Step 4: Commit**

```bash
git add components/ResumeSummary.tsx
git commit -m "feat: restyle ResumeSummary with scroll-linked letter reveal and italic accent phrase"
```

---

## Task 8: Resume Experience

**Files:**
- Modify: `components/ResumeExperience.tsx` (full-file rewrite)

- [ ] **Step 1: Replace `components/ResumeExperience.tsx` contents entirely**

```tsx
import { EXPERIENCES } from '@/lib/resume';
import StaggerCard from './animation/StaggerCard';
import WordsPullUp from './animation/WordsPullUp';

export default function ResumeExperience() {
  return (
    <div id="experience" className="resume-section-alt">
      <div className="resume-section-alt-inner">
        <div className="section-header">
          <div className="section-num">02</div>
          <h2 className="section-title"><WordsPullUp text="Experience" /></h2>
        </div>

        {EXPERIENCES.map((exp, i) => (
          <StaggerCard key={exp.company} index={i} className="exp-row">
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
          </StaggerCard>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/ResumeExperience.tsx
git commit -m "feat: restyle ResumeExperience with StaggerCard rows and WordsPullUp heading"
```

---

## Task 9: Resume Skills

**Files:**
- Modify: `components/ResumeSkills.tsx` (full-file rewrite)

- [ ] **Step 1: Replace `components/ResumeSkills.tsx` contents entirely**

```tsx
import { CORE_SKILLS, AI_SKILLS, CERTIFICATIONS } from '@/lib/resume';
import StaggerCard from './animation/StaggerCard';
import WordsPullUp from './animation/WordsPullUp';

export default function ResumeSkills() {
  return (
    <div id="skills" className="resume-section">
      <div className="section-header">
        <div className="section-num">03</div>
        <h2 className="section-title"><WordsPullUp text="Skills" /></h2>
      </div>

      <div className="skills-cols">
        <StaggerCard index={0}>
          <div className="skill-category-label">Core Stack</div>
          <div className="skill-tags">
            {CORE_SKILLS.map((s) => (
              <span key={s} className="skill-tag">{s}</span>
            ))}
          </div>

          <div className="skill-category-label skill-category-label--gap">AI &amp; Agentic</div>
          <div className="skill-tags">
            {AI_SKILLS.map((s) => (
              <span key={s} className="skill-tag skill-tag--ai">{s}</span>
            ))}
          </div>
        </StaggerCard>

        <StaggerCard index={1}>
          <div className="skill-category-label">Certifications</div>
          <div className="cert-list">
            {CERTIFICATIONS.map((c, i) => (
              <div key={i} className="cert-item">
                <span className="cert-plus">+</span>
                <span className="cert-text">{c}</span>
              </div>
            ))}
          </div>
        </StaggerCard>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/ResumeSkills.tsx
git commit -m "feat: restyle ResumeSkills with StaggerCard columns"
```

---

## Task 10: Resume Education

**Files:**
- Modify: `components/ResumeEducation.tsx` (full-file rewrite)

- [ ] **Step 1: Replace `components/ResumeEducation.tsx` contents entirely**

```tsx
import { EDUCATION } from '@/lib/resume';
import StaggerCard from './animation/StaggerCard';
import WordsPullUp from './animation/WordsPullUp';

export default function ResumeEducation() {
  return (
    <div id="education" className="resume-section-alt">
      <div className="resume-section-alt-inner">
        <div className="section-header">
          <div className="section-num">04</div>
          <h2 className="section-title"><WordsPullUp text="Education" /></h2>
        </div>

        {EDUCATION.map((edu, i) => (
          <StaggerCard key={edu.school} index={i} className="edu-row">
            <div className="edu-years">{edu.years}</div>
            <div>
              <div className="edu-school">{edu.school}</div>
              <div className="edu-degree">{edu.degree}</div>
            </div>
          </StaggerCard>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/ResumeEducation.tsx
git commit -m "feat: restyle ResumeEducation with StaggerCard rows"
```

---

## Task 11: Footers (resume + projects page)

**Files:**
- Modify: `components/ResumeFooter.tsx` (full-file rewrite)
- Modify: `components/Footer.tsx` (full-file rewrite)

- [ ] **Step 1: Replace `components/ResumeFooter.tsx` contents entirely**

```tsx
import WordsPullUp from './animation/WordsPullUp';

export default function ResumeFooter() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <h2 className="footer-h2"><WordsPullUp text="Let's Build Something" /></h2>
        <div className="footer-contacts">
          <div className="contact-item">
            <div className="contact-label">Email</div>
            <a href="mailto:gabriel.liu3615@gmail.com" className="contact-link">gabriel.liu3615@gmail.com</a>
          </div>
          <div className="contact-item">
            <div className="contact-label">LinkedIn</div>
            <a
              href="https://www.linkedin.com/in/yufei-liu-92766a66"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              in/yufei-liu →
            </a>
          </div>
          <div className="contact-item">
            <div className="contact-label">Location</div>
            <div className="contact-link" style={{ cursor: 'default' }}>Paraparaumu, Wellington, NZ</div>
          </div>
        </div>
        <div className="footer-bar">
          <span className="footer-name">Yufei Liu</span>
          <span className="footer-tagline">Senior Full Stack Developer · Wellington, NZ</span>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Replace `components/Footer.tsx` contents entirely**

```tsx
import Link from 'next/link';
import WordsPullUp from './animation/WordsPullUp';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <h2 className="footer-h2">
          <div><WordsPullUp text="Let's Build" /></div>
          <div><WordsPullUp text="Something" /></div>
        </h2>
        <div className="footer-contacts">
          <div>
            <div className="fc-label">Email</div>
            <a href="mailto:gabriel.liu3615@gmail.com" className="fc-value">
              gabriel.liu3615@gmail.com
            </a>
          </div>
          <div>
            <div className="fc-label">LinkedIn</div>
            <a
              href="https://www.linkedin.com/in/yufei-liu-92766a66"
              target="_blank"
              rel="noopener noreferrer"
              className="fc-value"
            >
              in/yufei-liu
            </a>
          </div>
          <div>
            <div className="fc-label">Resume</div>
            <Link href="/" className="fc-value">Full résumé →</Link>
          </div>
        </div>
        <div className="footer-bar">
          <div className="footer-name">Yufei Liu</div>
          <div className="footer-tagline">Senior Full Stack Developer · Wellington, NZ</div>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/ResumeFooter.tsx components/Footer.tsx
git commit -m "feat: restyle footers with WordsPullUp heading, drop manual IntersectionObserver reveal"
```

---

## Task 12: Projects page Hero

**Files:**
- Modify: `components/Hero.tsx` (full-file rewrite)

- [ ] **Step 1: Replace `components/Hero.tsx` contents entirely**

```tsx
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
```

- [ ] **Step 2: Verify types**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat: restyle Projects Hero with WordsPullUp heading and italic accent description"
```

---

## Task 13: Projects WorkList

**Files:**
- Modify: `components/WorkList.tsx` (full-file rewrite)

- [ ] **Step 1: Replace `components/WorkList.tsx` contents entirely**

```tsx
'use client';

import { useState } from 'react';
import { PROJECTS, type Project, type ProjectLink } from '@/lib/projects';
import StaggerCard from './animation/StaggerCard';

export default function WorkList() {
  const [open, setOpen] = useState<Record<number, boolean>>({});

  function toggle(i: number) {
    setOpen((prev) => ({ ...prev, [i]: !prev[i] }));
  }

  return (
    <div id="work" className="work-list">
      <div className="work-inner">
        {PROJECTS.map((p, i) => (
          <StaggerCard key={p.name} index={i} className="project-row">
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
```

(The project's own `italic-accent` treatment lands on `project-role`, e.g. *Creator & Maintainer* — short, deterministic, and doesn't require fragile substring-matching inside five different hand-written descriptions the way the Summary paragraph's `indexOf` approach does.)

- [ ] **Step 2: Verify types**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Verify in browser**

Run: `npm run dev`, open `http://localhost:3000/resume/projects/`. Confirm:
- Each project row wrapped in the same scale+fade `StaggerCard` entrance as the resume page's cards, staggered as you scroll down
- Role label (e.g. "Creator & Maintainer") renders in italic serif
- "View details" / "Hide details" toggle still works, detail panel still expands

Stop the dev server after confirming.

- [ ] **Step 4: Commit**

```bash
git add components/WorkList.tsx
git commit -m "feat: restyle WorkList with StaggerCard entrance, drop manual IntersectionObserver reveal"
```

---

## Task 14: Final full-site build and verification

**Files:** none (verification only)

- [ ] **Step 1: Full production build (matches the GitHub Pages CI step)**

Run: `npm run build`
Expected: builds successfully with no TypeScript or Next.js errors, `out/` directory generated.

- [ ] **Step 2: Full browser walkthrough — resume page**

Run: `npm run dev`, open `http://localhost:3000/resume/`. At mobile (~375px), tablet (~768px), and desktop (~1440px) widths, confirm top to bottom:
- Nav: cream links, hover changes color, "Yufei Liu" wordmark not all-caps
- Hero, Credential strip, Summary, Experience, Skills, Education, Footer all render with the cream-on-black palette, no leftover pure-white (`#fff`) or `#3a3a3f` gray from the old palette
- No layout overflow/clipping at any width
- No console errors (check devtools console)

- [ ] **Step 3: Full browser walkthrough — projects page**

Open `http://localhost:3000/resume/projects/`. Confirm:
- Nav, Hero, WorkList, Footer all match the same palette and animation language as the resume page
- No console errors

Stop the dev server after confirming.

- [ ] **Step 4: Commit**

Only if Steps 1-3 required fixes; otherwise there's nothing new to commit for this task (it's a verification-only pass — skip if the working tree is clean).

---

## Self-Review Notes

- **Spec coverage:** design tokens/fonts (Task 1-2), noise textures (Task 2), animation primitives (Task 3), MeshCanvas retint + nav casing (Task 4), Resume Hero/CredentialStrip/Summary/Experience/Skills/Education/Footer (Tasks 5-11), Projects Hero/WorkList/Footer (Tasks 11-13), full build+browser verification (Task 14) — every section of the spec has a corresponding task.
- **Type consistency:** `StaggerCard`'s `index`/`className`/`children` props, `AnimatedLetter`'s `italic` prop, and `WordsPullUpMultiStyle`'s `TextSegment` type are defined once in Task 3 and used identically in every later task.
- **No placeholders:** every step has complete, runnable code or an exact shell command with expected output. The one deferred-sounding note (MeshCanvas retint "implementation detail" from the spec) is resolved here as four exact string replacements, confirmed against the actual file contents.
- **Deviation from spec, resolved during planning:** the spec described the Summary section as "heading via WordsPullUpMultiStyle with an italic accent, body via AnimatedLetter" — but the actual heading is just the single word "Summary" (nothing to split stylistically). Task 7 resolves this by keeping the heading plain (`WordsPullUp`, no italic) and instead giving `AnimatedLetter` an `italic` flag so the one accent phrase ("a vibe coding lover at heart") renders in italic serif *within* the per-character scroll reveal, rather than forcing an artificial split on a two-word heading.
