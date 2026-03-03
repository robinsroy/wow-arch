'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { MOCK_PROJECTS } from '@/lib/data';
import ScrollReveal from '@/components/animations/ScrollReveal';
import TextReveal from '@/components/animations/TextReveal';
import Button from '@/components/ui/Button';
import { ArrowUpRight } from 'lucide-react';

export default function FeaturedProjects() {
  const featured = MOCK_PROJECTS.filter((p) => p.featured);

  return (
    <section className="section-padding bg-cream">
      <div className="container-wide">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <ScrollReveal>
              <p className="label mb-4">Selected Works</p>
            </ScrollReveal>
            <TextReveal
              text="Featured Projects"
              as="h2"
              className="font-heading text-[clamp(2rem,5vw,3.5rem)] text-charcoal leading-[1.15]"
            />
          </div>
          <ScrollReveal delay={0.3}>
            <Button href="/projects" variant="ghost" icon className="mt-6 md:mt-0">
              View All Projects
            </Button>
          </ScrollReveal>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {featured.map((project, i) => (
            <FeaturedCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedCard({
  project,
  index,
}: {
  project: (typeof MOCK_PROJECTS)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  // First card spans full width, others alternate
  const gridClass =
    index === 0
      ? 'md:col-span-12'
      : index % 2 === 1
        ? 'md:col-span-7'
        : 'md:col-span-5';

  return (
    <motion.div
      ref={ref}
      className={gridClass}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.25, 1, 0.5, 1],
      }}
    >
      <Link href={`/projects/${project.slug}`} className="group block">
        <div
          className={`relative overflow-hidden rounded-xl ${
            index === 0 ? 'aspect-[16/8]' : 'aspect-[4/3]'
          }`}
        >
          <motion.div style={{ y }} className="absolute inset-[-10%] w-[100%] h-[120%]">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              sizes={index === 0 ? '100vw' : '(max-width: 768px) 100vw, 60vw'}
              quality={85}
            />
          </motion.div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent" />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-soft-white/60 mb-2">
                {project.category} · {project.location}
              </p>
              <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl text-soft-white">
                {project.title}
              </h3>
            </div>
            <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full border border-soft-white/30 text-soft-white group-hover:bg-gold group-hover:border-gold transition-all duration-300">
              <ArrowUpRight size={18} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
