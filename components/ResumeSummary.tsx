'use client';

import { useRef } from 'react';
import { useScroll } from 'framer-motion';
import { SUMMARY } from '@/lib/resume';
import WordsPullUp from './animation/WordsPullUp';
import AnimatedLetter from './animation/AnimatedLetter';

const ITALIC_PHRASE = 'a vibe coding lover at heart';
const ITALIC_START = SUMMARY.indexOf(ITALIC_PHRASE);
const ITALIC_END = ITALIC_START + ITALIC_PHRASE.length;

export default function ResumeSummary() {
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: paragraphRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  const chars = SUMMARY.split('');

  return (
    <div id="summary" className="resume-section">
      <div className="section-header">
        <div className="section-num">01</div>
        <h2 className="section-title"><WordsPullUp text="Summary" /></h2>
      </div>
      <p ref={paragraphRef} className="summary-text">
        {chars.map((char, i) => (
          <AnimatedLetter
            key={i}
            char={char}
            index={i}
            totalChars={chars.length}
            scrollYProgress={scrollYProgress}
            italic={i >= ITALIC_START && i < ITALIC_END}
          />
        ))}
      </p>
    </div>
  );
}
