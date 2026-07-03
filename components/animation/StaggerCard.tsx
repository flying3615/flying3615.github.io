'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

interface StaggerCardProps {
  index: number;
  className?: string;
  children: ReactNode;
}

export default function StaggerCard({ index, className, children }: StaggerCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
