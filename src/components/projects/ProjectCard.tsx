'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Project } from '@/types';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  index?: number;
  variant?: 'default' | 'featured';
}

export default function ProjectCard({
  project,
  index = 0,
  variant = 'default',
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 1, 0.5, 1],
      }}
    >
      <Link href={`/projects/${project.slug}`} className="group block">
        <div
          className={cn(
            'relative overflow-hidden rounded-2xl',
            variant === 'featured' ? 'aspect-[16/10]' : 'aspect-[4/3]'
          )}
        >
          {/* Image */}
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
            sizes={variant === 'featured' ? '100vw' : '(max-width: 768px) 100vw, 50vw'}
            quality={85}
          />

          {/* Warm overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-charcoal/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Category pill */}
          <div className="absolute top-4 left-4">
            <span className="inline-block px-3 py-1.5 text-[10px] font-medium tracking-[0.15em] uppercase bg-soft-white/90 backdrop-blur-md text-charcoal rounded-full shadow-sm">
              {project.category}
            </span>
          </div>

          {/* Bottom Info (appears on hover) */}
          <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]">
            <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-soft-white/70 mb-1">
              {project.location} · {project.year}
            </p>
            <h3 className="font-heading text-xl md:text-2xl text-soft-white">
              {project.title}
            </h3>
          </div>
        </div>

        {/* Card Footer (static) */}
        <div className="mt-4 flex items-start justify-between">
          <div>
            <h3 className="font-heading text-lg md:text-xl text-charcoal group-hover:text-gold transition-colors duration-300">
              {project.title}
            </h3>
            <p className="text-xs text-muted mt-1 tracking-wide uppercase">
              {project.location}
            </p>
          </div>
          <span className="text-xs text-muted mt-1">{project.year}</span>
        </div>
      </Link>
    </motion.div>
  );
}
