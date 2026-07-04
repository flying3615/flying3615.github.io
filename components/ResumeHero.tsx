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
const FADE_OUT_START = 0.75;

function ScrubHero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const blackFadeRef = useRef<HTMLDivElement>(null);
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const rafRunning = useRef(false);
  const ticking = useRef(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const video = videoRef.current;
    const textEl = textRef.current;
    const blackFadeEl = blackFadeRef.current;
    if (!wrapper || !video || !textEl || !blackFadeEl) return;

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

    function applyProgress(progress: number) {
      const duration = video!.duration;
      if (duration && !Number.isNaN(duration)) {
        video!.currentTime = progress * (duration - 0.1);
      }
      const fadeT = Math.min(Math.max((progress - FADE_OUT_START) / (1 - FADE_OUT_START), 0), 1);
      blackFadeEl!.style.opacity = String(fadeT);
    }

    function loop() {
      const diff = targetProgress.current - currentProgress.current;
      if (Math.abs(diff) > EPSILON) {
        currentProgress.current += diff * DAMPING;
        applyProgress(currentProgress.current);
        requestAnimationFrame(loop);
      } else {
        currentProgress.current = targetProgress.current;
        applyProgress(currentProgress.current);
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
        <div ref={blackFadeRef} className="hero-black-fade" />
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
