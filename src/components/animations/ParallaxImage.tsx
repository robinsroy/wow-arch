'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
  overlay?: boolean;
}

export default function ParallaxImage({
  src,
  alt,
  className,
  speed = 0.3,
  overlay = false,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [`-${speed * 100}%`, `${speed * 100}%`]);

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      <motion.div style={{ y }} className="absolute inset-[-20%] w-[100%] h-[140%]">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="100vw"
          quality={85}
        />
      </motion.div>
      {overlay && (
        <div className="absolute inset-0 bg-charcoal/30" />
      )}
    </div>
  );
}
