# Scroll-Scrub Hero + Glassmorphism Design

## Overview
Upgrade the resume site's hero from a looping autoplay background video to a scroll-driven "scrubbing" video (à la Apple product pages), where scroll position controls video playback position within a pinned hero section. Additionally, replace the entrance animation on the Skills and Experience sections with a warm-toned glassmorphism (frosted glass) card treatment using a blur-to-clear reveal, in place of the current `StaggerCard` scale/fade effect.

This is a desktop-only enhancement. Mobile keeps the existing autoplay/loop hero video unchanged (already fixed for iOS autoplay and re-encoded for size in prior work this session).

## Out of Scope
- No canvas/frame-extraction approach (rejected during brainstorming — see "Rejected Approach" below).
- No changes to Summary, Education, Work, or Footer sections' existing animations.
- No changes to the `/projects`-equivalent Work section content.
- No new dependencies (no GSAP, no scroll libraries) — plain requestAnimationFrame + native APIs only, matching the explicit request.

## Rejected Approach: Canvas + Frame Extraction
The originally-requested technique (extract every video frame via `createImageBitmap` into an array, redraw the matching frame on a `<canvas>` per scroll position) was rejected after inspecting the actual hero video's encoding: `ffprobe` shows the current `hero-bg.mp4` has only **1 keyframe (I-frame) in its entire 241-frame sequence** (the rest are P/B frames). Seeking to arbitrary frames on such a stream is unreliable in browsers (seeks snap toward keyframes) and caching all frames as decoded `ImageBitmap`s would require roughly 240 × ~3.7MB ≈ 880MB of memory at 720p — likely to crash or severely lag mobile browsers, and risky even on desktop. Directly scrubbing a `<video>` element's `currentTime` (letting the browser's own decoder handle seeking) is the standard, reliable technique used in production scrollytelling sites, and is the approach this spec uses instead.

**Precondition:** `public/videos/hero-bg.mp4` must be re-encoded with a short keyframe interval (e.g. `-g 12`, a keyframe roughly every 0.5s at 24fps) before scrubbing will feel smooth — this is a required implementation step, not optional polish.

## Architecture

### Pinned scroll-scrub container
- The hero section's outer wrapper becomes tall (`height: 300vh`) to give scroll room to "play through" the video.
- An inner viewport layer (`position: sticky; top: 0; height: 100vh`) holds the actual video/text/gradient content — it stays pinned in view while the outer wrapper's extra height is scrolled through, then releases naturally once the outer wrapper is fully scrolled past, continuing to the Summary section beneath it.
- A `scroll` listener (attached once, not re-bound) computes `targetProgress` — the fraction of the outer wrapper's own scrollable range that's been scrolled, clamped to `[0, 1]`. This is a *local* progress relative to the hero wrapper's position, not total page scroll.
- A `requestAnimationFrame` loop runs a damped linear interpolation each frame:
  ```
  currentProgress += (targetProgress - currentProgress) * damping   // damping ≈ 0.08–0.1
  video.currentTime = currentProgress * (video.duration - 0.1)      // -0.1s safety margin, see below
  ```
  This produces the "silk-smooth inertia" scrubbing feel used on Apple's product pages, rather than snapping `currentTime` directly to the raw scroll position.
- **Safety clamp:** `targetTime` never reaches exactly `video.duration` — capped to `video.duration - 0.1` — because seeking a `<video>` to its exact duration is known to trigger Safari's `ended` event or a black-frame flash in some browsers.
- **Idle pause:** when `Math.abs(targetProgress - currentProgress)` drops below a small epsilon (e.g. `0.0001`), the rAF loop stops scheduling itself (rather than running forever) and only resumes when a new scroll event moves `targetProgress` again — avoids an always-on rAF loop draining battery on desktop when the user isn't scrolling.

### Hero text fade layer
- The existing hero text block (name, bio, CTAs) sits in its own layer within the pinned viewport.
- As `currentProgress` moves through the first 30% of the *first 30vh of scroll distance into the pin* (not 30% of the full 300vh — specifically the first 30vh of scroll, matching the original request), the text layer's `opacity` linearly interpolates to `0` and its `transform: translateY(...)` moves it upward, so it visually exits before the rest of the scrub plays out.
- Implemented as plain CSS custom properties driven by the same scroll-progress calculation already computed for the video (no separate observer needed) — set via inline style from the same scroll handler, not a second listener.

### Mobile / reduced-motion fallback
- At viewport widths below `768px`, or when `prefers-reduced-motion: reduce` is set, the scroll-scrub mechanism is skipped entirely — no pinned wrapper, no scroll listener, no rAF loop. The hero renders with the existing `autoPlay loop muted playsInline` video exactly as it does today (already fixed for iOS autoplay in a prior session and re-encoded to ~575KB for size).
- This is a build-time/mount-time branch (checked once on mount via `matchMedia`), not a runtime performance-detection fallback — reliably detecting "is scrubbing too janky" at runtime was explicitly considered and rejected as fragile.

## Glassmorphism cards (Skills + Experience only)
- Replaces the current `StaggerCard` wrapper on these two sections' content blocks. Other sections (Summary, Education, Work, Footer) are untouched.
- Card style (warm-toned, matching the existing cream/black palette rather than a neutral white glass):
  ```css
  background: rgba(225, 224, 204, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(225, 224, 204, 0.08);
  ```
- Entrance animation via `IntersectionObserver` (native, no framer-motion): when a card enters the viewport, it transitions `filter: blur(8px) → blur(0)` and `opacity: 0 → 1` over a short duration (e.g. 0.6s ease-out), then the observer unobserves that element (fires once, matching existing `StaggerCard`'s `once: true` convention).
- This is implemented as a small new reusable component (e.g. `components/animation/GlassReveal.tsx`) rather than inline per-section logic, so both Skills and Experience share one implementation — consistent with how `StaggerCard` itself was factored out earlier this session.

## File-Level Changes (for planning reference)
- `public/videos/hero-bg.mp4`: re-encoded with short keyframe interval.
- `components/ResumeHero.tsx`: restructured for the pinned-wrapper + sticky-viewport pattern; scroll listener + rAF damping loop; mobile/reduced-motion branch retains today's simple `<video>` markup.
- `app/globals.css`: new classes for the pinned wrapper, sticky viewport, hero text fade layer, and the glass card style.
- `components/animation/GlassReveal.tsx` (new): the blur-to-clear `IntersectionObserver`-driven wrapper.
- `components/ResumeSkills.tsx`, `components/ResumeExperience.tsx`: swap `StaggerCard` for `GlassReveal` on their content blocks.

## Testing / Verification
No automated test suite in this project (consistent with the rest of the site). Verification is manual: desktop browser scroll-scrub smoothness and text fade timing, Skills/Experience glass card appearance and reveal animation, mobile-width and `prefers-reduced-motion` fallback rendering the plain autoplay video, and confirming no console errors or layout shift when the pinned hero releases into the Summary section.
