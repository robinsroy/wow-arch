'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowRight, MapPin, Calendar, Maximize, Layers } from 'lucide-react';
import type { Project } from '@/types';
import ScrollReveal from '@/components/animations/ScrollReveal';
import TextReveal from '@/components/animations/TextReveal';
import Button from '@/components/ui/Button';

interface ProjectDetailClientProps {
  project: Project;
  nextProject: Project;
}

export default function ProjectDetailClient({
  project,
  nextProject,
}: ProjectDetailClientProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div>
      {/* Hero */}
      <section ref={heroRef} className="relative h-[70vh] md:h-[85vh] overflow-hidden">
        <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="absolute inset-0">
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={90}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-transparent to-charcoal/30" />

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-28 left-6 md:left-12 z-10"
        >
          <Link
            href="/projects"
            className="flex items-center gap-2 text-soft-white/80 hover:text-soft-white text-xs tracking-[0.1em] uppercase transition-colors"
          >
            <ArrowLeft size={14} />
            All Projects
          </Link>
        </motion.div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 container-wide pb-12 md:pb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[10px] font-medium tracking-[0.2em] uppercase text-gold mb-3"
          >
            {project.category}
          </motion.p>
          <TextReveal
            text={project.title}
            as="h1"
            className="font-heading text-4xl md:text-6xl lg:text-7xl text-charcoal"
            delay={0.3}
          />
        </div>
      </section>

      {/* Project Info */}
      <section className="container-wide py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
          {/* Meta */}
          <div className="md:col-span-4">
            <ScrollReveal>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-gold" />
                  <div>
                    <p className="label mb-1">Location</p>
                    <p className="text-charcoal font-medium">{project.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-gold" />
                  <div>
                    <p className="label mb-1">Year</p>
                    <p className="text-charcoal font-medium">{project.year}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Layers size={16} className="text-gold" />
                  <div>
                    <p className="label mb-1">Category</p>
                    <p className="text-charcoal font-medium">{project.category}</p>
                  </div>
                </div>
                {project.area && (
                  <div className="flex items-center gap-3">
                    <Maximize size={16} className="text-gold" />
                    <div>
                      <p className="label mb-1">Area</p>
                      <p className="text-charcoal font-medium">{project.area}</p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>

          {/* Description */}
          <div className="md:col-span-8">
            <ScrollReveal delay={0.2}>
              <p className="label mb-4">About the Project</p>
              <p className="text-graphite text-lg md:text-xl leading-[1.8]">
                {project.description}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="mt-8 p-8 bg-warm-beige/50 rounded-xl">
                <p className="font-heading text-xl md:text-2xl text-charcoal italic leading-[1.6]">
                  &ldquo;Every design decision was guided by the site&rsquo;s unique character,
                  creating spaces that are both timeless and deeply rooted in their context.&rdquo;
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="container-wide pb-16 md:pb-24">
        <ScrollReveal>
          <p className="label mb-8">Gallery</p>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {project.images.map((image, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <Image
                  src={image}
                  alt={`${project.title} - Image ${i + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={85}
                />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Next Project CTA */}
      <section className="border-t border-charcoal/5">
        <Link href={`/projects/${nextProject.slug}`} className="group block">
          <div className="container-wide py-20 md:py-28 flex flex-col md:flex-row items-center justify-between">
            <div>
              <p className="label mb-3">Next Project</p>
              <h3 className="font-heading text-3xl md:text-4xl text-charcoal group-hover:text-gold transition-colors duration-300">
                {nextProject.title}
              </h3>
              <p className="text-muted text-sm mt-2">{nextProject.location}</p>
            </div>
            <div className="mt-6 md:mt-0 flex items-center justify-center w-14 h-14 rounded-full border border-charcoal/15 text-charcoal group-hover:bg-gold group-hover:border-gold group-hover:text-soft-white transition-all duration-300">
              <ArrowRight size={20} />
            </div>
          </div>
        </Link>
      </section>
    </div>
  );
}
