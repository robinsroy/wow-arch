'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_PROJECTS } from '@/lib/data';
import ProjectCard from '@/components/projects/ProjectCard';
import TextReveal from '@/components/animations/TextReveal';
import ScrollReveal from '@/components/animations/ScrollReveal';
import type { ProjectCategory } from '@/types';

const categories: ('All' | ProjectCategory)[] = [
  'All',
  'Architecture',
  'Interior Design',
  'Landscape Design',
  'Master Planning',
];

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<'All' | ProjectCategory>('All');

  const filteredProjects =
    activeCategory === 'All'
      ? MOCK_PROJECTS
      : MOCK_PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <div className="pt-24 md:pt-32">
      {/* Page Header */}
      <section className="container-wide mb-12">
        <ScrollReveal>
          <p className="label mb-4">Portfolio</p>
        </ScrollReveal>
        <TextReveal
          text="Our Projects"
          as="h1"
          className="font-heading text-[clamp(2.5rem,6vw,4.5rem)] text-charcoal mb-6 leading-[1.1]"
        />
        <ScrollReveal delay={0.3}>
          <p className="text-graphite text-lg max-w-2xl leading-relaxed">
            A curated collection of architectural and design works that embody our
            commitment to conceptual unity, material honesty, and experiential richness.
          </p>
        </ScrollReveal>
      </section>

      {/* Filter Bar */}
      <section className="container-wide mb-16">
        <ScrollReveal delay={0.4}>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 text-xs font-medium tracking-[0.1em] uppercase rounded-full border transition-all duration-300 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-charcoal text-soft-white border-charcoal'
                    : 'bg-transparent text-graphite border-charcoal/15 hover:border-charcoal/40'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Projects Grid */}
      <section className="container-wide pb-24 md:pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredProjects.length === 0 && (
          <div className="text-center py-24">
            <p className="text-muted text-lg">No projects found in this category.</p>
          </div>
        )}
      </section>
    </div>
  );
}
