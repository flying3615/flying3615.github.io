# Scroll-Scrub Hero + Glassmorphism Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the resume site's autoplay hero video with a desktop-only, scroll-driven "scrubbing" video (pinned hero, damped `video.currentTime` scrubbing), and replace the Skills/Experience sections' entrance animation with a warm-toned glassmorphism blur-to-clear reveal.

**Architecture:** `ResumeHero.tsx` splits into two variants chosen at mount via `matchMedia` — `ScrubHero` (desktop, no reduced-motion) uses a 300vh pinned wrapper with a `position: sticky` inner viewport, a passive `scroll` listener that computes target progress, and a `requestAnimationFrame` loop that damps `video.currentTime` toward that target; `SimpleAutoplayHero` (mobile, or reduced-motion) is the existing autoplay/loop video, unchanged. A new `GlassReveal` component (mirroring the existing `StaggerCard` pattern) wraps Skills/Experience content with an `IntersectionObserver`-driven blur→clear reveal.

**Tech Stack:** Next.js 15, React 19, TypeScript, plain CSS (no new dependencies — no GSAP, no scroll libraries, per explicit requirement), ffmpeg (video re-encode, one-time build step, not a runtime dependency).

**Reference:** Full design rationale in `docs/superpowers/specs/2026-07-04-scroll-scrub-hero-design.md`.

---

## Task 1: Re-encode the hero video with a short keyframe interval

**Files:**
- Modify: `public/videos/hero-bg.mp4` (binary replacement)

**Context:** `ffprobe` on the current `hero-bg.mp4` shows only 1 keyframe (I-frame) across all 241 frames — everything else is P/B frames. Seeking such a stream via `video.currentTime` for scrubbing is unreliable (seeks snap toward the nearest keyframe) and will look janky regardless of how good the JS damping math is. This must be fixed before Task 4's scrubbing code will look smooth. The original, higher-quality source download is still available at `/private/tmp/claude-501/-Users-yufei-Documents-Resume/6360ba07-6af8-4ba2-9161-66ef9c19fbf5/scratchpad/hero-bg.mp4` (15.3MB) — re-encode from that, not from the already-compressed 575KB version, to avoid double-compression quality loss.

- [ ] **Step 1: Re-encode with a keyframe every 12 frames (0.5s at 24fps)**

Run (from `/Users/yufei/Documents/git/resume`):
```bash
ffmpeg -y -i /private/tmp/claude-501/-Users-yufei-Documents-Resume/6360ba07-6af8-4ba2-9161-66ef9c19fbf5/scratchpad/hero-bg.mp4 \
  -vf "scale=-2:720" -c:v libx264 -preset slow -crf 26 \
  -g 12 -keyint_min 12 -sc_threshold 0 \
  -pix_fmt yuv420p -movflags +faststart -an \
  public/videos/hero-bg.mp4
```
Expected: ffmpeg exits 0, produces a new `public/videos/hero-bg.mp4`.

- [ ] **Step 2: Verify the keyframe interval actually changed**

Run:
```bash
ffprobe -v error -select_streams v:0 -show_entries frame=pict_type -of csv public/videos/hero-bg.mp4 | sort | uniq -c
```
Expected: the count of `frame,I` lines should be roughly `241 / 12 ≈ 20`, not `1`.

- [ ] **Step 3: Check the resulting file size is still reasonable**

Run: `ls -lh public/videos/hero-bg.mp4`
Expected: a few hundred KB to low single-digit MB (more keyframes increases size vs. the previous 575KB version, but should still be well under the original 15.3MB — if it's unexpectedly large, e.g. over 3MB, the `-crf 26` quality target may need revisiting, but don't change it without checking visually first).

- [ ] **Step 4: Commit**

```bash
git add public/videos/hero-bg.mp4
git commit -m "fix: re-encode hero video with short keyframe interval for scrub-seeking"
```

---

## Task 2: Add CSS for the scrub wrapper, sticky viewport, text fade layer, and glass cards

**Files:**
- Modify: `app/globals.css`

**Context:** `.resume-hero` already exists (defined for the simple/mobile hero: `position: relative; height: 100vh; ...`). This task adds new classes without touching that existing rule, plus a compound selector so `.resume-hero` becomes `position: sticky` *only* when nested inside the new wrapper (the mobile/simple hero keeps using it standalone, unaffected).

- [ ] **Step 1: Append these rules to `app/globals.css`** (add after the existing `.resume-hero-bio`/`.resume-ctas` block — exact insertion point doesn't matter, CSS is order-independent here since there's no selector overlap beyond the compound one below)

```css
/* ── Scroll-scrub hero (desktop only) ── */
.resume-hero-scrub-wrapper {
  position: relative;
  height: 300vh;
}
.resume-hero-scrub-wrapper .resume-hero {
  position: sticky;
  top: 0;
}
.resume-hero-text-layer {
  will-change: opacity, transform;
}

/* ── Glassmorphism reveal card ── */
.glass-card {
  background: rgba(225, 224, 204, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(225, 224, 204, 0.08);
  border-radius: 16px;
  padding: 32px;
  filter: blur(8px);
  opacity: 0;
  transition: filter 0.6s ease-out, opacity 0.6s ease-out;
}
.glass-card.is-visible {
  filter: blur(0);
  opacity: 1;
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no errors (CSS isn't type-checked, this just confirms nothing else broke).

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: add CSS for scroll-scrub hero wrapper and glassmorphism reveal cards"
```

---

## Task 3: Create the `GlassReveal` animation component

**Files:**
- Create: `components/animation/GlassReveal.tsx`

**Context:** Mirrors the existing `components/animation/StaggerCard.tsx` pattern (same file location, same reduced-motion handling convention: check `prefers-reduced-motion` once on mount and skip the animation, showing the final state immediately, matching how the framer-motion primitives already do this via `useReducedMotion`). This component intentionally does **not** take an `index`/stagger-delay prop — the design calls for each card to reveal independently when it individually enters the viewport, not a staggered sequence.

- [ ] **Step 1: Create `components/animation/GlassReveal.tsx`**

```tsx
'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

interface GlassRevealProps {
  className?: string;
  children: ReactNode;
}

export default function GlassReveal({ className, children }: GlassRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`glass-card${visible ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/animation/GlassReveal.tsx
git commit -m "feat: add GlassReveal blur-to-clear IntersectionObserver reveal component"
```

---

## Task 4: Rewrite `ResumeHero.tsx` with scrub/simple dual-mode

**Files:**
- Modify: `components/ResumeHero.tsx` (full-file rewrite)

**Context:** Splits into three pieces in one file: a shared `HeroContent` (the name/bio/CTA block, unchanged from today's markup), `SimpleAutoplayHero` (today's existing autoplay video, verbatim), and `ScrubHero` (the new pinned-scrub version). The exported `ResumeHero` picks between `SimpleAutoplayHero` and `ScrubHero` in a `useEffect` after mount (defaulting to `SimpleAutoplayHero` on first render so server-rendered/static-exported HTML always matches — this avoids a hydration mismatch and avoids a blank-hero flash; desktop users get upgraded to `ScrubHero` within the same tick, before any visible autoplay frame would render).

- [ ] **Step 1: Replace `components/ResumeHero.tsx` contents entirely**

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import WordsPullUp from './animation/WordsPullUp';
import WordsPullUpMultiStyle from './animation/WordsPullUpMultiStyle';

function LinkedInIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.114 20.452H3.558V9h3.556v11.452z" />
    </svg>
  );
}

function HeroContent() {
  return (
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
  );
}

function SimpleAutoplayHero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  return (
    <div className="resume-hero">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="hero-bg-video"
        src="/resume/videos/hero-bg.mp4"
      />
      <div className="noise-overlay hero-noise" />
      <div className="hero-grad-1" />
      <div className="hero-grad-2" />
      <HeroContent />
    </div>
  );
}

const DAMPING = 0.08;
const EPSILON = 0.0001;

function ScrubHero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const rafRunning = useRef(false);
  const ticking = useRef(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const video = videoRef.current;
    const textEl = textRef.current;
    if (!wrapper || !video || !textEl) return;

    function applyTextFade(scrolled: number) {
      const fadeDistance = window.innerHeight * 0.3;
      const t = Math.min(Math.max(scrolled / fadeDistance, 0), 1);
      textEl!.style.opacity = String(1 - t);
      textEl!.style.transform = `translateY(${-40 * t}px)`;
    }

    function startLoopIfNeeded() {
      if (!rafRunning.current) {
        rafRunning.current = true;
        requestAnimationFrame(loop);
      }
    }

    function computeTarget() {
      const rect = wrapper!.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      targetProgress.current = Math.min(Math.max(scrolled / scrollableDistance, 0), 1);
      applyTextFade(Math.max(scrolled, 0));
      ticking.current = false;
      startLoopIfNeeded();
    }

    function onScroll() {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(computeTarget);
      }
    }

    function loop() {
      const diff = targetProgress.current - currentProgress.current;
      if (Math.abs(diff) > EPSILON) {
        currentProgress.current += diff * DAMPING;
        const duration = video!.duration;
        if (duration && !Number.isNaN(duration)) {
          video!.currentTime = currentProgress.current * (duration - 0.1);
        }
        requestAnimationFrame(loop);
      } else {
        currentProgress.current = targetProgress.current;
        rafRunning.current = false;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    computeTarget();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="resume-hero-scrub-wrapper">
      <div className="resume-hero">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          className="hero-bg-video"
          src="/resume/videos/hero-bg.mp4"
        />
        <div className="noise-overlay hero-noise" />
        <div className="hero-grad-1" />
        <div className="hero-grad-2" />
        <div ref={textRef} className="resume-hero-text-layer">
          <HeroContent />
        </div>
      </div>
    </div>
  );
}

export default function ResumeHero() {
  const [useScrub, setUseScrub] = useState(false);

  useEffect(() => {
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setUseScrub(isDesktop && !reducedMotion);
  }, []);

  return useScrub ? <ScrubHero /> : <SimpleAutoplayHero />;
}
```

- [ ] **Step 2: Verify types**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Verify in browser — desktop scrub behavior**

Run `npm run dev` (or use the existing `resume-main-dev` launch config), open at a desktop viewport width (≥768px), navigate to `http://localhost:3001/resume/` (adjust port to whichever is running). Confirm:
- Page loads showing the hero (no blank flash).
- Scrolling down inside the hero's extra height feels smooth/inertial (not a hard jump) as the video visibly scrubs forward.
- The name/bio/CTA text fades to fully transparent and shifts upward within roughly the first 30% of one viewport height of scroll.
- After scrolling past the full pinned range, the page releases naturally into the Summary section — no stuck/jumpy transition.
- Scrolling back up reverses the video smoothly (damped, not instant).

- [ ] **Step 4: Verify in browser — mobile / reduced-motion fallback**

Resize to a mobile width (<768px) and reload. Confirm:
- No pinned/tall hero — the page behaves exactly as it did before this change (autoplay looping video, normal single-viewport hero, immediate scroll into Summary).
- Re-enable desktop width, then emulate `prefers-reduced-motion: reduce` (e.g. via `preview_resize`'s `colorScheme`-equivalent or your browser devtools' rendering emulation) and reload — confirm it also falls back to the simple autoplay hero, not the scrub version.

Check the browser console for errors in both modes.

- [ ] **Step 5: Commit**

```bash
git add components/ResumeHero.tsx
git commit -m "feat: add desktop scroll-scrub hero video with damped LERP, mobile/reduced-motion fallback"
```

---

## Task 5: Update `ResumeSkills.tsx` to use `GlassReveal`

**Files:**
- Modify: `components/ResumeSkills.tsx` (full-file rewrite)

- [ ] **Step 1: Replace `components/ResumeSkills.tsx` contents entirely**

```tsx
import { CORE_SKILLS, AI_SKILLS, CERTIFICATIONS } from '@/lib/resume';
import GlassReveal from './animation/GlassReveal';
import WordsPullUp from './animation/WordsPullUp';

export default function ResumeSkills() {
  return (
    <div id="skills" className="resume-section">
      <div className="section-header">
        <div className="section-num">03</div>
        <h2 className="section-title"><WordsPullUp text="Skills" /></h2>
      </div>

      <div className="skills-cols">
        <GlassReveal>
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
        </GlassReveal>

        <GlassReveal>
          <div className="skill-category-label">Certifications</div>
          <div className="cert-list">
            {CERTIFICATIONS.map((c, i) => (
              <div key={i} className="cert-item">
                <span className="cert-plus">+</span>
                <span className="cert-text">{c}</span>
              </div>
            ))}
          </div>
        </GlassReveal>
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
git commit -m "feat: replace ResumeSkills StaggerCard with GlassReveal"
```

---

## Task 6: Update `ResumeExperience.tsx` to use `GlassReveal`

**Files:**
- Modify: `components/ResumeExperience.tsx` (full-file rewrite)

- [ ] **Step 1: Replace `components/ResumeExperience.tsx` contents entirely**

```tsx
import { EXPERIENCES } from '@/lib/resume';
import GlassReveal from './animation/GlassReveal';
import WordsPullUp from './animation/WordsPullUp';

export default function ResumeExperience() {
  return (
    <div id="experience" className="resume-section-alt">
      <div className="resume-section-alt-inner">
        <div className="section-header">
          <div className="section-num">02</div>
          <h2 className="section-title"><WordsPullUp text="Experience" /></h2>
        </div>

        {EXPERIENCES.map((exp) => (
          <GlassReveal key={exp.company} className="exp-row">
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
          </GlassReveal>
        ))}
      </div>
    </div>
  );
}
```

Note: the `key` moves from an array-index-derived prop to `GlassReveal`'s own `key={exp.company}` — `GlassReveal` doesn't take an `index` prop (no stagger), so there's no longer a reason to thread `i` through at all here.

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/ResumeExperience.tsx
git commit -m "feat: replace ResumeExperience StaggerCard with GlassReveal"
```

---

## Task 7: Final build and full verification

**Files:** none (verification only)

- [ ] **Step 1: Full production build**

Run: `npm run build`
Expected: builds successfully, no TypeScript/Next.js errors.

- [ ] **Step 2: Full browser walkthrough**

Using the running dev server (or a `npx serve out` on the built export), check at desktop width:
- Hero scrub behaves smoothly end-to-end (repeat Task 4 Step 3's checks once more against the fully-integrated build).
- Scroll down into Experience — each row's glass card blurs into focus independently as it enters the viewport (not staggered as one batch).
- Scroll to Skills — same blur-to-clear behavior on both columns.
- No console errors anywhere on the page.

At mobile width:
- Hero is the plain autoplay video (no pinned scroll).
- Experience/Skills glass cards still appear (reduced-motion aside, mobile isn't reduced-motion by default, so they should still get the blur→clear reveal — only the *hero* scrub is gated by the desktop breakpoint, not the glass cards).

- [ ] **Step 3: Commit**

Only if Steps 1-2 required fixes; otherwise nothing new to commit for this verification-only task.

---

## Self-Review Notes

- **Spec coverage:** video re-encode (Task 1), pinned/sticky scrub wrapper + damped LERP + safety clamp (Task 4/`ScrubHero`), text fade layer (Task 4), mobile/reduced-motion fallback (Task 4's `ResumeHero` mount-time branch), glassmorphism card + blur-to-clear reveal (Tasks 2/3/5/6), final verification (Task 7) — every section of the spec has a corresponding task.
- **Type consistency:** `GlassReveal`'s `{ className?, children }` props are defined once in Task 3 and used identically in Tasks 5-6 (Task 6 additionally passes `key` at the call site, which is a React-reserved prop, not a `GlassReveal` prop — not part of its interface).
- **No placeholders:** every step has complete, runnable code or an exact command with expected output. The ffmpeg source path in Task 1 is a real, currently-existing file on this machine, not a placeholder.
- **Rejected canvas approach:** documented in the spec, intentionally not re-litigated in the plan — the plan only implements the approved `video.currentTime` approach.
