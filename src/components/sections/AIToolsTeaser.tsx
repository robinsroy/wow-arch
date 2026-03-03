'use client';

import { motion } from 'framer-motion';
import { Sparkles, Video, FileText, Palette, ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/animations/ScrollReveal';
import TextReveal from '@/components/animations/TextReveal';
import Button from '@/components/ui/Button';

const tools = [
  {
    icon: <Sparkles size={28} />,
    title: 'AI Image Generation',
    description: 'Transform sketches into photorealistic renders with a single prompt.',
    color: 'text-terracotta',
    bgColor: 'bg-terracotta/5',
    borderColor: 'border-terracotta/10 hover:border-terracotta/30',
  },
  {
    icon: <Video size={28} />,
    title: 'Video Walkthrough',
    description: 'Create cinematic flythrough videos from your architectural designs.',
    color: 'text-olive',
    bgColor: 'bg-olive/5',
    borderColor: 'border-olive/10 hover:border-olive/30',
  },
  {
    icon: <FileText size={28} />,
    title: 'Smart Documentation',
    description: 'Auto-generate design docs, mood boards, and presentation decks.',
    color: 'text-gold',
    bgColor: 'bg-gold/5',
    borderColor: 'border-gold/10 hover:border-gold/30',
  },
  {
    icon: <Palette size={28} />,
    title: 'Style Transfer',
    description: 'Apply any architectural style — Art Deco, Minimalism, Brutalist, and more.',
    color: 'text-graphite',
    bgColor: 'bg-charcoal/5',
    borderColor: 'border-charcoal/10 hover:border-charcoal/30',
  },
];

export default function AIToolsTeaser() {
  return (
    <section className="section-padding bg-warm-beige">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center mb-16">
          <ScrollReveal>
            <p className="label mb-4">Powered by AI</p>
          </ScrollReveal>
          <TextReveal
            text="Design with Intelligence"
            as="h2"
            className="font-heading text-[clamp(2rem,5vw,3.5rem)] text-charcoal mb-6 leading-[1.15]"
          />
          <ScrollReveal delay={0.3}>
            <p className="text-graphite text-base md:text-lg max-w-2xl mx-auto">
              Harness cutting-edge AI models to accelerate your design workflow.
              From concept to presentation, every tool you need in one studio.
            </p>
          </ScrollReveal>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: [0.25, 1, 0.5, 1],
              }}
              className={`group p-8 md:p-10 rounded-2xl border ${tool.borderColor} ${tool.bgColor} transition-all duration-500 cursor-pointer hover:shadow-lg`}
            >
              <div className={`${tool.color} mb-6`}>{tool.icon}</div>
              <h3 className="font-heading text-xl md:text-2xl text-charcoal mb-3">
                {tool.title}
              </h3>
              <p className="text-graphite text-sm leading-relaxed mb-6">
                {tool.description}
              </p>
              <div className="flex items-center gap-2 text-xs font-medium tracking-[0.1em] uppercase text-muted group-hover:text-charcoal transition-colors duration-300">
                <span>Learn More</span>
                <ArrowRight
                  size={12}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <ScrollReveal className="text-center mt-12">
          <Button href="/ai-tools" variant="primary" size="lg" icon>
            Explore AI Studio
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}
