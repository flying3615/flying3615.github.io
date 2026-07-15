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

function GitHubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-1.99-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.75 2.7 1.25 3.36.96.1-.74.4-1.25.73-1.54-2.56-.29-5.25-1.28-5.25-5.71 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.24 2.75.12 3.04.74.81 1.18 1.84 1.18 3.1 0 4.44-2.7 5.42-5.27 5.7.42.36.78 1.07.78 2.16 0 1.56-.01 2.81-.01 3.19 0 .31.21.67.8.56A10.51 10.51 0 0 0 23.5 12c0-6.27-5.23-11.5-11.5-11.5z" />
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
          <a
            href="https://github.com/flying3615"
            target="_blank"
            rel="noopener noreferrer"
            className="resume-cta-secondary"
          >
            <GitHubIcon size={16} />
            GitHub
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
        src="/videos/hero-bg.mp4"
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
          src="/videos/hero-bg.mp4"
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
