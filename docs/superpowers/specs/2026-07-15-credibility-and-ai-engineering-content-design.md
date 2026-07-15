# Credibility Fixes + AI-Engineering Content Design

## Overview
A content and small-feature pass over the resume site: fix things that undermine trust when a visitor clicks around (a missing GitHub link on a developer portfolio, two case-study buttons that go nowhere), add a downloadable PDF résumé, and deepen the site's story around AI-driven engineering by giving the Pinakes work accurate framing and adding a second project card for the Pinakes plugin.

## Out of Scope
- No visual/animation redesign — this reuses all existing components and CSS classes as-is.
- No changes to the scroll-scrub hero, glassmorphism reveal, or any other prior design-doc's territory (`2026-07-03-prisma-style-restyle`, `2026-07-04-scroll-scrub-hero`).
- No SEO/social-metadata work (Open Graph, JSON-LD, sitemap) — flagged during review as a separate future round, not part of this pass.
- No a11y/CI-hardening work (nav focus trap, lint/typecheck in CI) — also deferred to a separate round.
- No repo links to the two internal knowledge-base/plugin repos behind the Pinakes work — both are private, internal-visibility repos owned by the employer's GitHub org; nothing about them is publicly linkable, and internal implementation details (the graph database schema, the code-parsing pipeline, cross-repo call-graph mechanics) are described only at the capability level, never named directly.

## 1. GitHub Link
**Problem:** The site has no link to the author's GitHub, despite being a developer portfolio hosted on GitHub Pages.

**Change:**
- Add a `GitHubIcon` inline SVG component in `components/ResumeHero.tsx`, following the exact pattern of the existing `LinkedInIcon` function (same `size` prop, `currentColor` fill, `aria-hidden`).
- Add a third CTA to `HeroContent`'s `.resume-ctas` block: a `resume-cta-secondary`-styled link to `https://github.com/flying3615`, `target="_blank"`, `rel="noopener noreferrer"`, positioned after the LinkedIn CTA.
- Add a matching entry to `ResumeFooter.tsx`'s `.footer-contacts` block (a `contact-item` with label `GitHub`, linking the same URL, styled like the existing LinkedIn contact item).

## 2. Dead Case-Study Links
**Problem:** `lib/projects.ts` gives "ANZ Internet Banking" and "Next-Gen Betting System" a `links: [{ label: 'Case Study', href: '#' }]`. Clicking does nothing — worse than showing no button, since "COM&XMC Network Mgmt" already demonstrates the correct pattern (`links: []`, and `WorkList.tsx`'s `DetailPanel` only renders the links block when `links.length > 0`).

**Change:** In `lib/projects.ts`, change both entries' `links` field from the `'#'` placeholder to `[]`. No component changes required.

## 3. Pinakes Reframe + New Pinakes Plugin Card
**Problem:** The existing "Pinakes" project card describes internal employer engineering tooling (confirmed via `gh api` that the underlying repo is private and org-owned — a graph-based knowledge base for a large multi-repo codebase) as `'Open Source · Personal Project'`. That framing is inaccurate given the repo's real ownership, and it also undersells a genuinely strong AI-engineering credential by burying it under vague "personal project" language. The related plugin work (also private/internal) isn't represented on the site at all.

**Change to the existing Pinakes entry** in `lib/projects.ts`:
- `eyebrow`: `'Open Source · Personal Project'` → `'Toitū Te Whenua LINZ · Internal Engineering Tooling'`
- `desc`: reworded to capability-level language — a graph-based knowledge base that maps a large multi-repo codebase (domain classification, code symbols, cross-repo dependency graphs), served to AI coding agents via MCP. No mention of specific repo names or internal technology names (implementation internals stay unnamed per Out of Scope).
- `links`: emptied to `[]` — the current `Demo Deck` link points at `public/works/pinakes.html`, which was written for the old personal-project framing and has no public equivalent under the new framing. The `shotIframeSrc` is removed along with it; the card falls back to the plain `shot` text treatment already used by non-demo projects (e.g. `'[ knowledge platform ]'`).
- `public/works/pinakes.html` itself is left in place but orphaned (no longer referenced) — deleting it is out of scope for this pass since it doesn't affect the live site once nothing links to it.

**New entry** added immediately after Pinakes in the `PROJECTS` array:
```
{
  name: 'Pinakes Plugin',
  eyebrow: 'Toitū Te Whenua LINZ · Internal Engineering Tooling',
  role: 'Creator',
  shot: '[ agent tooling ]',
  desc: 'A Claude Code plugin and marketplace that exposes the knowledge base as agent skills — turning "where is X defined, who calls it, which repo owns this" into single tool calls instead of ad-hoc grepping.',
  tags: ['Claude Code', 'MCP', 'Developer Tooling', 'AI Agents'],
  details: [
    'Packaged the knowledge graph as a set of Claude Code skills and MCP tools covering symbol lookup, call-graph navigation, and cross-repo dependency queries.',
    'Built a lightweight plugin-marketplace registry so the tooling can be installed without cloning the full knowledge-base source.',
    'Used daily across the engineering team to cut down on manual grepping and blind cross-repo exploration.',
  ],
  links: [],
}
```

This renumbers later project cards automatically (`WorkList.tsx` numbers by array index), which is expected and requires no code change.

## 4. PDF Résumé (build-time generation)
**Problem:** No downloadable résumé exists alongside the interactive site — a common recruiter/ATS expectation.

**Approaches considered:**
- *Headless-browser print* (Playwright/Puppeteer rendering a dedicated print route to PDF) — rejected: adds a Chromium download and browser-automation dependency to CI for what is otherwise a 5-dependency static site.
- *Hand-maintained PDF file* committed to `public/` — rejected: defeats the goal of staying in sync with `lib/resume.ts` without manual upkeep.
- **`@react-pdf/renderer`, generated at build time (chosen):** renders PDF vector output directly from React-like components in plain Node — no browser involved, no CI workflow changes needed.

**Change:**
- Add `@react-pdf/renderer` as a dependency, and `tsx` as a devDependency (the project has no existing script-runner; `tsx` is a single, zero-config dependency for running a `.tsx` script directly under Node, versus configuring `ts-node`'s module resolution to match `tsconfig.json`).
- New `scripts/generate-resume-pdf.tsx`: a Node script, run via `tsx scripts/generate-resume-pdf.tsx`, that imports `SUMMARY`, `EXPERIENCES`, `CORE_SKILLS`, `AI_SKILLS`, `CERTIFICATIONS`, `EDUCATION` from `lib/resume.ts` — the same data already rendered on the page — into a `<Document>`/`<Page>` layout (name/title header, summary, experience by role, skills, certifications, education), and writes the result to `public/resume-yufei-liu.pdf`.
- `package.json`: add a `"generate:resume-pdf": "tsx scripts/generate-resume-pdf.tsx"` script and a `"prebuild": "npm run generate:resume-pdf"` script, so `npm run build` (what `.github/workflows/deploy.yml` already runs) regenerates the PDF automatically before Next's static export — the generated file lands in `public/` before `next build` copies `public/` into `out/`.
- `public/resume-yufei-liu.pdf` is **gitignored, not committed** — CI's `prebuild` step regenerates it fresh on every deploy (the existing `deploy.yml` already runs `npm run build`, unchanged), so a committed copy would just be a stale binary that drifts from `lib/resume.ts` and produces noisy diffs on every content edit. Local `npm run build` also regenerates it, so `npm run dev` is the only path that won't have the PDF present locally unless `generate:resume-pdf` is run manually — acceptable since the download link only matters on the deployed/built site.
- Add a "Download Résumé (PDF)" link in `ResumeFooter.tsx`'s contact block, pointing at `/resume-yufei-liu.pdf`.
- The PDF's layout is a separate, simpler document design (not a pixel-for-pixel copy of the animated site) — standard for résumé PDFs, and avoids maintaining a second design system.

## File-Level Changes (for planning reference)
- `components/ResumeHero.tsx`: add `GitHubIcon`, add GitHub CTA to `HeroContent`.
- `components/ResumeFooter.tsx`: add GitHub contact item, add PDF download link/item.
- `lib/projects.ts`: fix two dead `links`, reframe Pinakes entry, add Pinakes Plugin entry.
- `scripts/generate-resume-pdf.tsx` (new): build-time PDF generator.
- `package.json`: new `@react-pdf/renderer` dependency, new `tsx` devDependency, new `generate:resume-pdf` and `prebuild` scripts.
- `.gitignore`: add `public/resume-yufei-liu.pdf` — generated artifact, not committed.

## Testing / Verification
No automated test suite in this project (consistent with prior specs). Manual verification: GitHub links render and open the correct profile in both hero and footer; both previously-dead Case Study buttons no longer appear; Pinakes and Pinakes Plugin cards render with correct copy and no dead links/iframes; `npm run build` successfully regenerates `public/resume-yufei-liu.pdf` and the file downloads correctly from the deployed site with sensible content (name, summary, experience, skills, certifications, education all present and legible).
