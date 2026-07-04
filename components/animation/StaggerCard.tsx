'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

interface StaggerCardProps {
  index: number;
  className?: string;
  children: ReactNode;
  staggerStep?: number;
  y?: number;
}

export default function StaggerCard({ index, className, children, staggerStep = 0.15, y = 0 }: StaggerCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={shouldReduceMotion ? false : { scale: 0.95, opacity: 0, y }}
      animate={shouldReduceMotion || isInView ? { scale: 1, opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * staggerStep, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
