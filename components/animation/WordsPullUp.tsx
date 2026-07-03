'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

interface WordsPullUpProps {
  text: string;
  className?: string;
}

export default function WordsPullUp({ text, className = '' }: WordsPullUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(' ');

  return (
    <span ref={ref} className={className} style={{ display: 'inline-flex', flexWrap: 'wrap' }}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          style={{ overflow: 'hidden', display: 'inline-block', marginRight: '0.25em' }}
        >
          <motion.span
            style={{ display: 'inline-block' }}
            initial={shouldReduceMotion ? false : { y: 20, opacity: 0 }}
            animate={shouldReduceMotion || isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
