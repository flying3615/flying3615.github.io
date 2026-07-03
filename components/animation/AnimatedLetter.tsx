'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';

interface AnimatedLetterProps {
  char: string;
  index: number;
  totalChars: number;
  scrollYProgress: MotionValue<number>;
  italic?: boolean;
}

export default function AnimatedLetter({
  char,
  index,
  totalChars,
  scrollYProgress,
  italic = false,
}: AnimatedLetterProps) {
  const charProgress = index / totalChars;
  const opacity = useTransform(scrollYProgress, [charProgress - 0.1, charProgress + 0.05], [0.2, 1]);

  return (
    <motion.span
      style={{
        opacity,
        fontFamily: italic ? 'var(--font-instrument-serif), serif' : undefined,
        fontStyle: italic ? 'italic' : undefined,
      }}
    >
      {char === ' ' ? ' ' : char}
    </motion.span>
  );
}
