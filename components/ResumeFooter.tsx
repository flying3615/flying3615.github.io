'use client';

import { useEffect, useRef } from 'react';

export default function ResumeFooter() {
  const h2Ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = h2Ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(22px)';
    el.style.transition = 'opacity 0.7s cubic-bezier(.22,.7,.25,1), transform 0.7s cubic-bezier(.22,.7,.25,1)';
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.style.opacity = '1'; el.style.transform = 'none'; observer.disconnect(); }
    }, { rootMargin: '0px 0px -8% 0px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <footer className="footer">
      <div className="footer-inner">
        <h2 className="footer-h2" ref={h2Ref}>Let&apos;s Build Something</h2>
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
          <span className="footer-name">YUFEI LIU</span>
          <span className="footer-tagline">Senior Full Stack Developer · Wellington, NZ</span>
        </div>
      </div>
    </footer>
  );
}
