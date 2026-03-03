'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ScrollReveal from '@/components/animations/ScrollReveal';

export default function StudioStatement() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const lineWidth = useTransform(scrollYProgress, [0.2, 0.5], ['0%', '100%']);

  return (
    <section ref={ref} className="section-padding bg-cream relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-charcoal) 1px, transparent 0)`,
        backgroundSize: '40px 40px',
      }} />

      <div className="container-wide relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Decorative quote mark */}
          <ScrollReveal>
            <span className="font-heading text-7xl md:text-8xl text-gold/20 leading-none select-none block">
              &ldquo;
            </span>
          </ScrollReveal>

          {/* Statement */}
          <ScrollReveal delay={0.2}>
            <blockquote className="font-heading text-[clamp(1.4rem,3.5vw,2.5rem)] text-charcoal leading-[1.4] -mt-10 md:-mt-14 italic">
              We believe that the convergence of human creativity and artificial intelligence
              will redefine how spaces are conceived, visualized, and experienced —
              <span className="text-gold not-italic font-normal"> creating designs that inspire
              and endure.</span>
            </blockquote>
          </ScrollReveal>

          {/* Animated line */}
          <motion.div
            style={{ width: lineWidth }}
            className="h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-12"
          />

          {/* Attribution */}
          <ScrollReveal delay={0.4}>
            <p className="label mt-8">WOW Studio · Design Philosophy</p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
