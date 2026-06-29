'use client';

import { useRef, useEffect } from 'react';

export default function Footer() {
  const h2Ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = h2Ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.7s cubic-bezier(.22,.7,.25,1), transform 0.7s cubic-bezier(.22,.7,.25,1)';

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'none';
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <footer className="footer">
      <div className="footer-inner">
        <h2 ref={h2Ref} className="footer-h2">
          Let&apos;s Build<br />Something
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
            <a href="/resume" className="fc-value">Full résumé →</a>
          </div>
        </div>
        <div className="footer-bar">
          <div className="footer-name">YUFEI LIU</div>
          <div className="footer-tagline">Senior Full Stack Developer · Wellington, NZ</div>
        </div>
      </div>
    </footer>
  );
}
