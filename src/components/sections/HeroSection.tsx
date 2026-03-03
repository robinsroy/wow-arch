'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TextReveal from '@/components/animations/TextReveal';
import MagneticButton from '@/components/animations/MagneticButton';
import Button from '@/components/ui/Button';
import { SERVICES } from '@/lib/constants';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.3, 0.7]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <motion.div
        style={{ scale: imageScale, opacity: imageOpacity }}
        className="absolute inset-0"
      >
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
          alt="Modern architectural masterpiece"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={90}
        />
      </motion.div>

      {/* Warm Gradient Overlay */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-charcoal/20 to-cream"
      />

      {/* Decorative Circle (WOW "O" element) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full border-2 border-gold/30"
        />
      </div>

      {/* Content */}
      <motion.div
        style={{ y: textY }}
        className="relative z-10 container-wide text-center"
      >
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="label text-soft-white/80 mb-6"
        >
          Architecture · Interior Design · AI
        </motion.p>

        {/* Main Title */}
        <div className="mb-8 space-y-1">
          <TextReveal
            text="Design Beyond"
            as="h1"
            className="font-heading text-[clamp(2.8rem,8vw,7rem)] text-soft-white font-normal leading-[1.1] tracking-[-0.02em]"
            delay={0.3}
          />
          <TextReveal
            text="Imagination"
            as="h1"
            className="font-heading text-[clamp(2.8rem,8vw,7rem)] text-gold italic font-normal leading-[1.1] tracking-[-0.02em]"
            delay={0.5}
          />
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-soft-white/70 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed"
        >
          AI-powered tools for architects and designers to visualize,
          generate, and present extraordinary spaces.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <MagneticButton strength={0.15}>
            <Button href="/projects" variant="secondary" size="lg" icon>
              Explore Projects
            </Button>
          </MagneticButton>
          <MagneticButton strength={0.15}>
            <Button href="/ai-tools" variant="outline" size="lg" className="border-soft-white/30 text-soft-white hover:bg-soft-white hover:text-charcoal">
              Try AI Studio
            </Button>
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase text-soft-white/50">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[1px] h-8 bg-gradient-to-b from-soft-white/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}
