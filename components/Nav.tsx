'use client';

import { useState } from 'react';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <nav className="nav">
        <a href="/" className="nav-logo">YUFEI LIU</a>
        <div className="nav-links">
          <a href="#summary">Summary</a>
          <a href="#experience">Experience</a>
          <a href="#skills">Skills</a>
          <a href="#education">Education</a>
          <a href="#work">Work</a>
          <a href="mailto:gabriel.liu3615@gmail.com">Contact</a>
        </div>
        <button className="nav-hamburger" onClick={() => setOpen(true)} aria-label="Open menu">
          ≡
        </button>
      </nav>

      {open && (
        <div className="nav-mobile-overlay" onClick={close}>
          <div className="nav-mobile-menu" onClick={e => e.stopPropagation()}>
            <button className="nav-mobile-close" onClick={close} aria-label="Close menu">✕</button>
            <a href="#summary" className="nav-mobile-link" onClick={close}>Summary</a>
            <a href="#experience" className="nav-mobile-link" onClick={close}>Experience</a>
            <a href="#skills" className="nav-mobile-link" onClick={close}>Skills</a>
            <a href="#education" className="nav-mobile-link" onClick={close}>Education</a>
            <a href="#work" className="nav-mobile-link" onClick={close}>Work</a>
            <a href="mailto:gabriel.liu3615@gmail.com" className="nav-mobile-link" onClick={close}>Contact</a>
          </div>
        </div>
      )}
    </>
  );
}
