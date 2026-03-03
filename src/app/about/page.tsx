'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Award, Users, Briefcase, Globe } from 'lucide-react';
import TextReveal from '@/components/animations/TextReveal';
import ScrollReveal from '@/components/animations/ScrollReveal';
import Button from '@/components/ui/Button';

const stats = [
  { icon: <Briefcase size={20} />, value: '150+', label: 'Projects Completed' },
  { icon: <Globe size={20} />, value: '12', label: 'Countries' },
  { icon: <Users size={20} />, value: '35+', label: 'Team Members' },
  { icon: <Award size={20} />, value: '28', label: 'Awards Won' },
];

const values = [
  {
    title: 'Conceptual Unity',
    description:
      'Every design decision flows from a singular, powerful idea. We believe in coherence across all scales — from master plan to material detail.',
  },
  {
    title: 'Material Honesty',
    description:
      'We celebrate the inherent beauty of materials — stone, timber, glass, concrete — letting them speak authentically in every space we create.',
  },
  {
    title: 'Experiential Richness',
    description:
      'Architecture is lived, not just seen. We craft sequences of spatial experience that engage all senses and create lasting emotional connections.',
  },
  {
    title: 'AI Integration',
    description:
      'We embrace artificial intelligence not as a replacement for human creativity, but as a powerful amplifier that unlocks new possibilities in design.',
  },
];

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <div>
      {/* Hero */}
      <section ref={heroRef} className="relative h-[70vh] md:h-[80vh] overflow-hidden flex items-end">
        <motion.div style={{ scale: imageScale, y: imageY }} className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
            alt="Modern studio workspace"
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={90}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/20 to-charcoal/20" />

        <div className="relative z-10 container-wide pb-16 md:pb-24">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="label text-gold mb-4"
          >
            About Us
          </motion.p>
          <TextReveal
            text="Design Studio Reimagined"
            as="h1"
            className="font-heading text-[clamp(2.5rem,6vw,4.5rem)] text-charcoal leading-[1.1]"
            delay={0.3}
          />
        </div>
      </section>

      {/* Statement */}
      <section className="section-padding bg-cream">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
            <div className="md:col-span-5">
              <ScrollReveal>
                <p className="label mb-4">Our Practice</p>
                <h2 className="font-heading text-3xl md:text-4xl text-charcoal leading-[1.3]">
                  Where Creativity Meets
                  <span className="text-gold italic"> Intelligence</span>
                </h2>
              </ScrollReveal>
            </div>

            <div className="md:col-span-7">
              <ScrollReveal delay={0.2}>
                <p className="text-graphite text-lg leading-[1.9] mb-6">
                  WOW Studio is at the forefront of a design revolution — merging decades of
                  architectural expertise with cutting-edge artificial intelligence. We believe
                  that the future of design lies in the synergy between human intuition and
                  machine capability.
                </p>
                <p className="text-graphite text-lg leading-[1.9]">
                  Our team of architects, interior designers, technicians, and AI specialists
                  work as an efficient unit, delivering projects that embody conceptual clarity
                  and experiential strength. From master planning to material selection, every
                  decision is guided by a singular creative vision — amplified by AI.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-charcoal py-16 md:py-20">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.1}>
                <div className="text-center">
                  <div className="flex items-center justify-center text-gold mb-4">
                    {stat.icon}
                  </div>
                  <p className="font-heading text-4xl md:text-5xl text-soft-white mb-2">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted tracking-wider uppercase">
                    {stat.label}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-soft-white">
        <div className="container-wide">
          <div className="text-center mb-16">
            <ScrollReveal>
              <p className="label mb-4">Our Ethos</p>
            </ScrollReveal>
            <TextReveal
              text="Principles That Guide Us"
              as="h2"
              className="font-heading text-[clamp(2rem,5vw,3.5rem)] text-charcoal leading-[1.15]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, i) => (
              <ScrollReveal key={value.title} delay={i * 0.1}>
                <div className="p-8 md:p-10 bg-cream rounded-2xl group hover:bg-warm-beige transition-colors duration-500">
                  <div className="w-10 h-[2px] bg-gold mb-6 group-hover:w-16 transition-all duration-500" />
                  <h3 className="font-heading text-xl md:text-2xl text-charcoal mb-4">
                    {value.title}
                  </h3>
                  <p className="text-graphite text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team Photo */}
      <section className="section-padding bg-cream">
        <div className="container-wide">
          <div className="text-center mb-12">
            <ScrollReveal>
              <p className="label mb-4">Our People</p>
            </ScrollReveal>
            <TextReveal
              text="The Team Behind WOW"
              as="h2"
              className="font-heading text-[clamp(2rem,5vw,3.5rem)] text-charcoal mb-6 leading-[1.15]"
            />
            <ScrollReveal delay={0.3}>
              <p className="text-graphite max-w-2xl mx-auto">
                Our success is due to the talented architects, interior designers,
                technicians, and AI specialists working as an efficient team.
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal>
            <div className="relative aspect-[16/7] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80"
                alt="WOW Studio Team"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                sizes="100vw"
                quality={85}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 to-transparent" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-warm-beige">
        <div className="container-wide text-center">
          <ScrollReveal>
            <p className="label mb-4">Start Creating</p>
          </ScrollReveal>
          <TextReveal
            text="Ready to Transform Your Design Process?"
            as="h2"
            className="font-heading text-3xl md:text-5xl text-charcoal mb-8"
          />
          <ScrollReveal delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href="/ai-tools" variant="secondary" size="lg" icon>
                Try AI Studio
              </Button>
              <Button href="/projects" variant="outline" size="lg">
                View Projects
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
