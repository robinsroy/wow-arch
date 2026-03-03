'use client';

import { motion } from 'framer-motion';
import { SERVICES } from '@/lib/constants';
import ScrollReveal from '@/components/animations/ScrollReveal';

export default function ServicesStrip() {
  return (
    <section className="section-padding bg-soft-white">
      <div className="container-wide">
        <ScrollReveal>
          <p className="label text-center mb-12">What We Do</p>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: [0.25, 1, 0.5, 1],
              }}
              className="text-center group cursor-default"
            >
              {/* Decorative line */}
              <div className="w-8 h-[1px] bg-gold mx-auto mb-6 group-hover:w-16 transition-all duration-500" />

              <h3 className="text-xs md:text-sm font-medium tracking-[0.15em] uppercase text-charcoal group-hover:text-gold transition-colors duration-300">
                {service}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
