# Resume Site — Prisma-Style Restyle Design

## Overview
Restyle the existing Next.js resume/portfolio site (`flying3615/resume`, deployed to `flying3615.github.io/resume` via GitHub Pages) to match the dark, moody, cinematic, warm-cream visual language of the "Prisma" creative-studio landing page prototype (built separately at `/Users/yufei/Documents/Resume`), while preserving all existing content, section structure, and both pages (main resume + `/projects`).

This is a **visual and animation restyle**, not a content or architecture rewrite:
- Same pages: `app/page.tsx` (resume) and `app/projects/page.tsx` (projects).
- Same section order and content on both pages.
- Same component file names/boundaries where possible; only their internals and CSS change.
- Existing hand-written CSS approach (`app/globals.css`, no Tailwind) is preserved and extended — introducing Tailwind here would be an unrelated architecture change with no benefit, since the current CSS system already works and isn't the bottleneck.

## Current State (baseline, for reference)
- Font: `D-DIN` (loaded via `@import url('https://fonts.cdnfonts.com/css/d-din')` in `globals.css`), uppercase + wide letter-spacing used throughout headings, nav, labels, tags, buttons.
- Palette: pure black (`#000`) background, white/near-white text (`#fff`, `#f0f0fa`), muted gray (`#5a5a5f`), borders (`#3a3a3f`), alt-section background (`#0a0a0a`).
- Hero background: `MeshCanvas.tsx`, a canvas-based animated node/link network with a live "UPTIME / NODES / LINKS" HUD and play/pause control — used identically on both the resume hero (`ResumeHero.tsx`) and the projects hero (`Hero.tsx`).
- No animation library — one hand-rolled `IntersectionObserver` scroll-reveal in `WorkList.tsx` (manually toggling inline `style.opacity`/`transform`).
- No `framer-motion`, no `lucide-react` in `package.json`.

## Design Tokens & Fonts
- Fonts loaded via `next/font/google` in `app/layout.tsx` (idiomatic for Next.js App Router — replaces the raw `@import` in `globals.css`):
  - `Almarai` — weights 300, 400, 700, 800 — global default body/heading font.
  - `Instrument Serif` — italic only — accent font for exactly one phrase per page (see "Italic accent placement" below).
- Each `next/font` loader exposes a CSS variable (e.g. `--font-almarai`, `--font-instrument-serif`) applied on the `<html>`/`<body>` element; `globals.css` references these variables instead of hardcoded font-family strings.
- New CSS custom properties in `:root` (added to `globals.css`, existing `--text`/`--bg`/etc. variables are replaced, not kept side-by-side, to avoid two competing token systems):
  ```css
  --cream: #E1E0CC;       /* primary text/accent, inline-style-equivalent value */
  --cream-alt: #DEDBC8;   /* secondary cream tone, e.g. 70%-opacity body copy, "primary" utility equivalent */
  --bg: #000000;
  --bg-card: #101010;     /* credential strip, summary card */
  --bg-card-alt: #212121; /* skills/project cards */
  --muted: #6b6b63;       /* replaces --text muted gray, warmed to match cream family */
  --border: rgba(225, 224, 204, 0.12); /* replaces #3a3a3f, cream-tinted hairline borders */
  ```
- Remove `text-transform: uppercase` and the large tracked-out `letter-spacing` values from headings, nav links, tags, buttons, labels — Almarai reads as a normal mixed-case sans-serif, matching Prisma.
- Add the two noise-texture utility classes to `globals.css`, ported verbatim from the Prisma prototype's `index.css`:
  - `.noise-overlay` (`baseFrequency: 0.85`, `numOctaves: 3`) — placed over hero canvases.
  - `.bg-noise` (`baseFrequency: 0.9`, `numOctaves: 4`) — placed as a faint background wash behind Experience/Skills sections.

## New Shared Components
Location: `components/animation/` (all `'use client'`, framer-motion-powered, styled via plain CSS classes passed through `className` — no Tailwind).

1. **`WordsPullUp.tsx`** — splits text on spaces, each word is a `motion.span` sliding `y: 20 → 0` with opacity, staggered 0.08s/word, triggered once via `useInView`. Props: `text`, `className`.
2. **`WordsPullUpMultiStyle.tsx`** — takes `{ text, className }[]` segments, preserves per-word className, same stagger/animation. Used to italicize one phrase inline within an otherwise-normal heading/paragraph.
3. **`AnimatedLetter.tsx`** — per-character `motion.span` whose opacity is driven by a shared `scrollYProgress` (from `useScroll`), same `[0.2, 1]` progressive-reveal mapping as the Prisma About section. Used only on the two/three bio-style paragraphs called out below.
4. **`StaggerCard.tsx`** (new — generalizes the Prisma Features-card entrance into a reusable wrapper) — wraps arbitrary children in a `motion.div` that animates `scale: 0.95 → 1` + fade-in when scrolled into view (`once: true`, `margin: '-100px'`), taking an `index` prop for 0.15s stagger delay and ease `[0.22, 1, 0.36, 1]`. Used for: credential-strip cells, each experience company row, the skills/certifications block, each education row, each project card.

`WorkList.tsx`'s existing hand-rolled `IntersectionObserver` reveal effect is removed and replaced by wrapping each `ProjectRow` in `StaggerCard` — same visual effect, one shared implementation instead of two.

## Dependencies
Add to `package.json`: `framer-motion`, `lucide-react` (for the arrow/check icon accents already used in Prisma's CTA/checklist patterns, applied here to CTA buttons and any bullet/check-style lists). No Tailwind, no new CSS framework.

## Page-by-Page Changes

### Shared: Nav (`ResumeNav.tsx` / `Nav.tsx`)
Same links and layout; link color becomes `rgba(225, 224, 204, 0.8)` → hover `var(--cream)`; font switches to Almarai; drop uppercase.

### Resume page (`app/page.tsx`)
- **`ResumeHero.tsx`**: keep `MeshCanvas`, retint its node/link/packet colors from white-based `rgba(255,255,255,*)` to cream-based `rgba(225,224,204,*)` so the animated network matches the new palette (MeshCanvas gains a `tint` prop or the rgba constants are updated directly — implementation detail decided at plan time). Name "Yufei Liu" renders as a large `WordsPullUp` heading (scaled for two words, not Prisma's single-word 26vw — exact sizing decided at plan/implementation time to avoid overflow). Bio paragraph renders via `WordsPullUpMultiStyle` with one italic-serif accent phrase: *"a vibe coding lover"*. CTA buttons (Email, LinkedIn) restyled as cream pill + trailing black circle with a `lucide-react` `ArrowRight`/`ExternalLink` icon, hover gap/scale interaction matching Prisma's "Join the lab" button.
- **`CredentialStrip.tsx`**: background becomes `var(--bg-card)`, each cell wrapped in `StaggerCard`.
- **`ResumeSummary.tsx`**: heading via `WordsPullUpMultiStyle` (one italic accent phrase, e.g. *"pragmatic, delivery-focused"*); body paragraph via per-character `AnimatedLetter` scroll reveal, identical mechanism to Prisma's About section.
- **`ResumeExperience.tsx`**: each company/role block wrapped in `StaggerCard`; role titles via `WordsPullUp`; bullets recolored to `var(--cream-alt)`/`var(--muted)`, no structural change.
- **`ResumeSkills.tsx`**: skill-tag groups and certification list wrapped in `StaggerCard`; tags restyled as `var(--cream)`-bordered pills on `var(--bg-card-alt)`.
- **`ResumeEducation.tsx`**: each entry wrapped in `StaggerCard`, same visual treatment as Experience rows.
- **`ResumeFooter.tsx`** (shared with Projects page): heading via `WordsPullUp`, contact links recolored, background stays `var(--bg)`.

### Projects page (`app/projects/page.tsx`)
- **`Hero.tsx`**: same `MeshCanvas` retint as the resume hero. "Selected Work" heading via `WordsPullUp`; description paragraph via `WordsPullUpMultiStyle` with one italic accent phrase, e.g. *"open-source work on the side"*.
- **`WorkList.tsx`**: manual `IntersectionObserver` reveal removed; each `ProjectRow` wrapped in `StaggerCard`. Card background becomes `var(--bg-card-alt)`. Project name gets one italic-serif word via `WordsPullUpMultiStyle` (e.g. the tagline, not the project name itself, to keep names scannable/searchable as plain text).
- **`Footer.tsx`**: same component/treatment as resume footer (already shared).

## Italic Accent Placement (exactly one phrase per page, not overused)
1. Resume hero bio: *"a vibe coding lover"*.
2. Resume summary heading: one phrase, e.g. *"pragmatic, delivery-focused"*.
3. Projects hero description: *"open-source work on the side"*.

All other text stays in Almarai's normal (non-italic) style.

## Out of Scope
- No content changes (no new copy, no reordering of experience/education entries).
- No new pages or routes.
- No changes to the GitHub Pages deployment workflow (`next.config.ts`'s `output: 'export'` / `basePath` and `.github/workflows/*.yml` stay as-is).
- No background videos (MeshCanvas is kept instead, per decision above).
- No Tailwind migration.
