'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TextRevealProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  delay?: number;
  staggerDelay?: number;
  once?: boolean;
}

export default function TextReveal({
  text,
  className,
  as: Component = 'h2',
  delay = 0,
  staggerDelay = 0.03,
  once = true,
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '-50px' });

  const words = text.split(' ');

  return (
    <Component ref={ref as React.RefObject<HTMLHeadingElement>} className={cn(className)}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.3em] pb-[0.08em]">
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: '110%', opacity: 0 }}
            animate={isInView ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 }}
            transition={{
              duration: 0.7,
              delay: delay + i * staggerDelay,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Component>
  );
}
