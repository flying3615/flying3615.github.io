'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-logo">YUFEI LIU</Link>
        <div className="nav-links">
          <Link href="/projects">Work</Link>
          <Link href="/">Resume</Link>
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
            <Link href="/projects" className="nav-mobile-link" onClick={close}>Work</Link>
            <Link href="/" className="nav-mobile-link" onClick={close}>Resume</Link>
            <a href="mailto:gabriel.liu3615@gmail.com" className="nav-mobile-link" onClick={close}>Contact</a>
          </div>
        </div>
      )}
    </>
  );
}
