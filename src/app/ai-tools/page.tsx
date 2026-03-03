'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Sparkles,
  Video,
  FileText,
  Upload,
  Wand2,
  ArrowRight,
  Check,
  Image as ImageIcon,
  SlidersHorizontal,
  Sun,
  Moon,
  Download,
  RotateCcw,
  Maximize2,
  X,
  ChevronRight,
  Play,
  Presentation,
  Camera,
  Lightbulb,
  PenTool,
} from 'lucide-react';
import TextReveal from '@/components/animations/TextReveal';
import ScrollReveal from '@/components/animations/ScrollReveal';

/* ─────────────────────────────────────────────
   Data & Types
   ───────────────────────────────────────────── */
type OutputMode = 'image' | 'video' | 'presentation';

interface StylePreset {
  id: string;
  name: string;
  preview: string;
  description: string;
}

const OUTPUT_MODES: {
  id: OutputMode;
  label: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    id: 'image',
    label: 'Image',
    icon: <ImageIcon size={22} />,
    description: 'Photorealistic renders & visualizations',
  },
  {
    id: 'video',
    label: 'Video',
    icon: <Video size={22} />,
    description: 'Cinematic walkthroughs & flythroughs',
  },
  {
    id: 'presentation',
    label: 'Presentation',
    icon: <Presentation size={22} />,
    description: 'Client-ready decks & mood boards',
  },
];

const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    preview:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80',
    description: 'Clean lines, neutral palette',
  },
  {
    id: 'warm-organic',
    name: 'Warm Organic',
    preview:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80',
    description: 'Natural materials, earthy tones',
  },
  {
    id: 'art-deco',
    name: 'Art Deco',
    preview:
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80',
    description: 'Geometric elegance, rich textures',
  },
  {
    id: 'japanese-zen',
    name: 'Japanese Zen',
    preview:
      'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&q=80',
    description: 'Wabi-sabi, timber, serenity',
  },
  {
    id: 'mediterranean',
    name: 'Mediterranean',
    preview:
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&q=80',
    description: 'Warm stone, terracotta, light',
  },
  {
    id: 'brutalist',
    name: 'Brutalist',
    preview:
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80',
    description: 'Raw concrete, bold geometry',
  },
];

const SAMPLE_OUTPUTS = [
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
];

const PROMPT_SUGGESTIONS = [
  'A modern villa with floor-to-ceiling windows overlooking the ocean...',
  'Minimalist concrete interior with natural light and timber accents...',
  'Luxury penthouse with panoramic city views at golden hour...',
  'Zen garden courtyard with water features and stepping stones...',
];

/* ─────────────────────────────────────────────
   Animated Background Orbs
   ───────────────────────────────────────────── */
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.06]"
        style={{
          background: 'radial-gradient(circle, var(--color-gold), transparent)',
          top: '-10%',
          right: '-10%',
        }}
        animate={{ x: [0, 80, -40, 0], y: [0, -60, 40, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-[0.04]"
        style={{
          background:
            'radial-gradient(circle, var(--color-terracotta), transparent)',
          bottom: '10%',
          left: '-5%',
        }}
        animate={{ x: [0, -60, 30, 0], y: [0, 50, -30, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full blur-[80px] opacity-[0.03]"
        style={{
          background:
            'radial-gradient(circle, var(--color-olive), transparent)',
          top: '40%',
          left: '30%',
        }}
        animate={{ x: [0, 40, -20, 0], y: [0, -30, 50, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Page Component
   ───────────────────────────────────────────── */
export default function AIStudioPage() {
  const [activeMode, setActiveMode] = useState<OutputMode>('image');
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const handleGenerate = useCallback(() => {
    if (!prompt && !uploadedFile) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowOutput(true);
    }, 3000);
  }, [prompt, uploadedFile]);

  const handleReset = () => {
    setPrompt('');
    setUploadedFile(null);
    setShowOutput(false);
    setSelectedStyle(null);
    setIsGenerating(false);
  };

  const cyclePlaceholder = () => {
    setPromptIndex((prev) => (prev + 1) % PROMPT_SUGGESTIONS.length);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* ═══════════════════════════════════
          Hero
         ═══════════════════════════════════ */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-[70vh] flex items-center justify-center pt-32 pb-20 overflow-hidden"
      >
        <FloatingOrbs />

        {/* Grain */}
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="container-wide relative z-10 text-center">
          <ScrollReveal>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-charcoal/5 border border-charcoal/8 mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles size={14} className="text-gold" />
              <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-graphite">
                AI Creation Studio
              </span>
            </motion.div>
          </ScrollReveal>

          <TextReveal
            text="Create with"
            as="h1"
            className="font-heading text-[clamp(2.5rem,7vw,5.5rem)] text-charcoal font-normal leading-[1.1] tracking-[-0.02em]"
            delay={0.1}
          />
          <TextReveal
            text="Intelligence"
            as="h1"
            className="font-heading text-[clamp(2.5rem,7vw,5.5rem)] text-gold italic font-normal leading-[1.1] tracking-[-0.02em] mb-8"
            delay={0.3}
          />

          <ScrollReveal delay={0.5}>
            <p className="text-graphite text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-4">
              Upload your sketches, describe your vision, or choose a style —
              and let AI generate stunning renders, cinematic walkthroughs, and
              client-ready presentations.
            </p>
          </ScrollReveal>

          {/* Scroll indicator */}
          <motion.div
            className="mt-12"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-[1px] h-12 bg-gradient-to-b from-gold/0 via-gold/40 to-gold/0 mx-auto" />
          </motion.div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════
          Output Mode Selector
         ═══════════════════════════════════ */}
      <section className="container-wide mb-12">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {OUTPUT_MODES.map((mode) => (
              <motion.button
                key={mode.id}
                onClick={() => {
                  setActiveMode(mode.id);
                  setShowOutput(false);
                }}
                className={`group relative flex items-center gap-4 px-6 py-5 rounded-2xl border cursor-pointer transition-all duration-500 text-left min-w-[240px] ${
                  activeMode === mode.id
                    ? 'bg-charcoal border-charcoal text-soft-white shadow-lg'
                    : 'bg-soft-white border-charcoal/8 text-charcoal hover:border-charcoal/20 hover:shadow-md'
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                layout
              >
                <div
                  className={`flex-shrink-0 p-2.5 rounded-xl transition-colors duration-300 ${
                    activeMode === mode.id
                      ? 'bg-gold/20 text-gold'
                      : 'bg-charcoal/5 text-graphite group-hover:text-gold'
                  }`}
                >
                  {mode.icon}
                </div>
                <div>
                  <p
                    className={`text-sm font-semibold tracking-wide ${
                      activeMode === mode.id
                        ? 'text-soft-white'
                        : 'text-charcoal'
                    }`}
                  >
                    {mode.label}
                  </p>
                  <p
                    className={`text-[11px] leading-snug mt-0.5 ${
                      activeMode === mode.id
                        ? 'text-soft-white/60'
                        : 'text-muted'
                    }`}
                  >
                    {mode.description}
                  </p>
                </div>
                {activeMode === mode.id && (
                  <motion.div
                    layoutId="mode-indicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-gold rounded-full"
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ═══════════════════════════════════
          Creation Studio
         ═══════════════════════════════════ */}
      <section className="container-wide mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ── Left Panel: Input ── */}
          <div className="lg:col-span-5 space-y-6">
            {/* Upload Zone */}
            <motion.div
              layout
              className={`relative rounded-2xl border-2 border-dashed transition-all duration-500 overflow-hidden ${
                isDragOver
                  ? 'border-gold bg-gold/5 scale-[1.01]'
                  : uploadedFile
                    ? 'border-gold/30 bg-gold/5'
                    : 'border-charcoal/10 bg-soft-white hover:border-charcoal/20'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                setUploadedFile('sketch.png');
              }}
            >
              <AnimatePresence mode="wait">
                {uploadedFile ? (
                  <motion.div
                    key="uploaded"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                          <Check size={18} className="text-gold" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-charcoal">
                            {uploadedFile}
                          </p>
                          <p className="text-[11px] text-muted">
                            Ready for processing
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setUploadedFile(null)}
                        className="p-1.5 rounded-lg hover:bg-charcoal/5 text-muted hover:text-charcoal transition-colors cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    {/* Preview placeholder */}
                    <div className="w-full h-32 rounded-xl bg-gradient-to-br from-warm-beige to-sand flex items-center justify-center">
                      <PenTool size={28} className="text-charcoal/20" />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-10 md:p-14 text-center cursor-pointer"
                    onClick={() => setUploadedFile('concept-sketch.png')}
                  >
                    <motion.div
                      className="w-16 h-16 rounded-2xl bg-charcoal/5 flex items-center justify-center mx-auto mb-5"
                      animate={
                        isDragOver
                          ? { scale: 1.1, rotate: 5 }
                          : { scale: 1, rotate: 0 }
                      }
                    >
                      <Upload
                        size={24}
                        className={isDragOver ? 'text-gold' : 'text-muted'}
                      />
                    </motion.div>
                    <p className="text-charcoal font-medium text-sm mb-1">
                      Drop your sketch here
                    </p>
                    <p className="text-[12px] text-muted">
                      or click to browse · JPG, PNG, PDF, DWG
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-[1px] bg-charcoal/8" />
              <span className="text-[10px] text-muted uppercase tracking-[0.2em] font-medium">
                or describe your vision
              </span>
              <div className="flex-1 h-[1px] bg-charcoal/8" />
            </div>

            {/* Prompt Input */}
            <div className="relative">
              <div className="bg-soft-white rounded-2xl border border-charcoal/8 overflow-hidden transition-all duration-300 focus-within:border-gold/40 focus-within:shadow-lg focus-within:shadow-gold/5">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={PROMPT_SUGGESTIONS[promptIndex]}
                  rows={4}
                  className="w-full px-5 pt-5 pb-2 bg-transparent text-charcoal text-sm placeholder:text-muted/60 focus:outline-none resize-none leading-relaxed"
                />
                <div className="flex items-center justify-between px-4 pb-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={cyclePlaceholder}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] text-muted hover:text-charcoal hover:bg-charcoal/5 transition-all uppercase tracking-wider cursor-pointer"
                    >
                      <Lightbulb size={12} />
                      Inspire me
                    </button>
                  </div>
                  <span className="text-[10px] text-muted/50">
                    {prompt.length}/500
                  </span>
                </div>
              </div>
            </div>

            {/* Style Presets */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-graphite">
                  Style Preset
                </p>
                {selectedStyle && (
                  <button
                    onClick={() => setSelectedStyle(null)}
                    className="text-[10px] text-muted hover:text-charcoal transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {STYLE_PRESETS.map((style) => (
                  <motion.button
                    key={style.id}
                    onClick={() =>
                      setSelectedStyle(
                        style.id === selectedStyle ? null : style.id
                      )
                    }
                    className={`group relative rounded-xl overflow-hidden cursor-pointer aspect-[4/3] ${
                      selectedStyle === style.id
                        ? 'ring-2 ring-gold ring-offset-2 ring-offset-cream'
                        : ''
                    }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <img
                      src={style.preview}
                      alt={style.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2.5">
                      <p className="text-[10px] font-medium text-soft-white leading-tight">
                        {style.name}
                      </p>
                    </div>
                    {selectedStyle === style.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gold flex items-center justify-center"
                      >
                        <Check size={10} className="text-soft-white" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Output Settings */}
            <div className="bg-soft-white rounded-2xl border border-charcoal/8 p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-graphite">
                  Output Settings
                </p>
                <SlidersHorizontal size={14} className="text-muted" />
              </div>
              <div className="space-y-4">
                {/* Resolution */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-charcoal">Resolution</span>
                    <span className="text-[10px] text-gold font-medium">
                      {activeMode === 'video' ? '4K' : '8K'}
                    </span>
                  </div>
                  <div className="h-1.5 bg-charcoal/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-gold/60 to-gold rounded-full"
                      initial={{ width: '60%' }}
                      animate={{
                        width: activeMode === 'video' ? '75%' : '100%',
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Lighting */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-charcoal">Lighting</span>
                  </div>
                  <div className="flex gap-2">
                    {[
                      { icon: <Sun size={14} />, label: 'Day' },
                      { icon: <Moon size={14} />, label: 'Night' },
                      { icon: <Camera size={14} />, label: 'Golden' },
                    ].map((opt) => (
                      <button
                        key={opt.label}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-medium uppercase tracking-wider border border-charcoal/8 text-graphite hover:border-gold/30 hover:text-gold transition-all cursor-pointer"
                      >
                        {opt.icon}
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Presentation format */}
                {activeMode === 'presentation' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-charcoal">Format</span>
                    </div>
                    <div className="flex gap-2">
                      {['PPT', 'PDF', 'Keynote'].map((fmt) => (
                        <button
                          key={fmt}
                          className="flex-1 py-2 rounded-lg text-[10px] font-medium uppercase tracking-wider border border-charcoal/8 text-graphite hover:border-gold/30 hover:text-gold transition-all cursor-pointer"
                        >
                          {fmt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Generate Button */}
            <motion.button
              onClick={handleGenerate}
              disabled={isGenerating || (!prompt && !uploadedFile)}
              className={`w-full relative flex items-center justify-center gap-3 py-[1.125rem] rounded-2xl text-sm font-semibold tracking-[0.08em] uppercase transition-all duration-500 cursor-pointer overflow-hidden ${
                isGenerating
                  ? 'bg-charcoal text-soft-white'
                  : prompt || uploadedFile
                    ? 'bg-charcoal text-soft-white hover:bg-charcoal/90 shadow-lg shadow-charcoal/10'
                    : 'bg-charcoal/10 text-muted cursor-not-allowed'
              }`}
              whileHover={
                !isGenerating && (prompt || uploadedFile)
                  ? { scale: 1.01 }
                  : {}
              }
              whileTap={
                !isGenerating && (prompt || uploadedFile)
                  ? { scale: 0.99 }
                  : {}
              }
            >
              {isGenerating && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/20 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}
              <span className="relative z-10 flex items-center gap-3">
                {isGenerating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    >
                      <Sparkles size={18} />
                    </motion.div>
                    Generating{' '}
                    {activeMode === 'image'
                      ? 'Renders'
                      : activeMode === 'video'
                        ? 'Video'
                        : 'Deck'}
                    ...
                  </>
                ) : (
                  <>
                    <Wand2 size={18} />
                    Generate{' '}
                    {activeMode === 'image'
                      ? 'Renders'
                      : activeMode === 'video'
                        ? 'Walkthrough'
                        : 'Presentation'}
                  </>
                )}
              </span>
            </motion.button>
          </div>

          {/* ── Right Panel: Output ── */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {showOutput ? (
                /* ── Generated Output ── */
                <motion.div
                  key="output"
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-4"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-graphite">
                        Generated Output
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleReset}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] text-muted hover:text-charcoal hover:bg-charcoal/5 transition-all cursor-pointer"
                      >
                        <RotateCcw size={12} />
                        Reset
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] bg-gold/10 text-gold hover:bg-gold/20 transition-all cursor-pointer">
                        <Download size={12} />
                        Export
                      </button>
                    </div>
                  </div>

                  {/* Main Image */}
                  <motion.div
                    className="relative aspect-[16/10] rounded-2xl overflow-hidden group"
                    whileHover={{ scale: 1.005 }}
                  >
                    <img
                      src={SAMPLE_OUTPUTS[0]}
                      alt="Generated render"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {activeMode === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          className="w-16 h-16 rounded-full bg-soft-white/90 flex items-center justify-center backdrop-blur-sm shadow-xl"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Play size={24} className="text-charcoal ml-1" />
                        </motion.div>
                      </div>
                    )}

                    {activeMode === 'presentation' && (
                      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-soft-white/90 backdrop-blur-sm">
                        <FileText size={14} className="text-gold" />
                        <span className="text-[11px] font-medium text-charcoal">
                          12 Slides Generated
                        </span>
                      </div>
                    )}

                    <button className="absolute top-3 right-3 p-2 rounded-xl bg-soft-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-soft-white cursor-pointer">
                      <Maximize2 size={14} className="text-charcoal" />
                    </button>
                  </motion.div>

                  {/* Variation Thumbnails */}
                  <div className="grid grid-cols-4 gap-2.5">
                    {SAMPLE_OUTPUTS.map((img, i) => (
                      <motion.div
                        key={i}
                        className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group/thumb"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <img
                          src={img}
                          alt={`Variation ${i + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/thumb:scale-110"
                        />
                        <div className="absolute inset-0 bg-charcoal/0 group-hover/thumb:bg-charcoal/20 transition-colors duration-300" />
                        {i === 0 && (
                          <div className="absolute top-1.5 left-1.5 w-4 h-4 rounded-full bg-gold flex items-center justify-center">
                            <Check size={8} className="text-soft-white" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <motion.button
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-charcoal text-soft-white text-xs font-medium tracking-wider uppercase cursor-pointer"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Download size={14} />
                      Download{' '}
                      {activeMode === 'presentation'
                        ? 'PPT'
                        : activeMode === 'video'
                          ? 'MP4'
                          : 'PNG'}
                    </motion.button>
                    <motion.button
                      className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-charcoal/10 text-xs font-medium tracking-wider uppercase text-charcoal hover:border-charcoal/20 transition-colors cursor-pointer"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Sparkles size={14} />
                      Variations
                    </motion.button>
                  </div>
                </motion.div>
              ) : isGenerating ? (
                /* ── Generating Loader ── */
                <motion.div
                  key="generating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center min-h-[500px] lg:min-h-[600px]"
                >
                  {/* Orbital loader */}
                  <div className="relative w-28 h-28 mb-8">
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-dashed border-gold/20"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                    <motion.div
                      className="absolute inset-3 rounded-full border-2 border-dashed border-terracotta/15"
                      animate={{ rotate: -360 }}
                      transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                    <motion.div
                      className="absolute inset-6 rounded-full border-2 border-dashed border-olive/10"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.6, 1, 0.6],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Wand2 size={24} className="text-gold" />
                      </motion.div>
                    </div>
                  </div>

                  <motion.p
                    className="font-heading text-xl text-charcoal mb-2"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Creating your{' '}
                    {activeMode === 'image'
                      ? 'renders'
                      : activeMode === 'video'
                        ? 'walkthrough'
                        : 'presentation'}
                  </motion.p>
                  <p className="text-xs text-muted">
                    This usually takes 15-30 seconds
                  </p>

                  {/* Progress steps */}
                  <div className="mt-8 space-y-3">
                    {[
                      'Analyzing input',
                      'Applying style',
                      'Rendering output',
                      'Final touches',
                    ].map((step, i) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.7, duration: 0.3 }}
                        className="flex items-center gap-3"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.7 + 0.3 }}
                          className="w-4 h-4 rounded-full bg-gold/20 flex items-center justify-center"
                        >
                          <Check size={8} className="text-gold" />
                        </motion.div>
                        <span className="text-xs text-graphite">{step}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                /* ── Empty State ── */
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative flex flex-col items-center justify-center min-h-[500px] lg:min-h-[600px] rounded-2xl border border-dashed border-charcoal/8 bg-gradient-to-br from-soft-white to-warm-beige/30 overflow-hidden"
                >
                  {/* Decorative grid */}
                  <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage:
                        'linear-gradient(var(--color-charcoal) 1px, transparent 1px), linear-gradient(90deg, var(--color-charcoal) 1px, transparent 1px)',
                      backgroundSize: '50px 50px',
                    }}
                  />

                  <div className="relative text-center px-8">
                    <motion.div
                      className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gold/10 to-terracotta/10 flex items-center justify-center mx-auto mb-6 border border-gold/10"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      {activeMode === 'image' && (
                        <ImageIcon size={32} className="text-gold/50" />
                      )}
                      {activeMode === 'video' && (
                        <Video size={32} className="text-gold/50" />
                      )}
                      {activeMode === 'presentation' && (
                        <Presentation size={32} className="text-gold/50" />
                      )}
                    </motion.div>

                    <h3 className="font-heading text-2xl text-charcoal mb-3">
                      {activeMode === 'image' &&
                        'Your renders will appear here'}
                      {activeMode === 'video' &&
                        'Your walkthrough will appear here'}
                      {activeMode === 'presentation' &&
                        'Your presentation will appear here'}
                    </h3>
                    <p className="text-sm text-muted max-w-sm mx-auto leading-relaxed">
                      Upload a sketch, describe your vision, or choose a style
                      preset — then hit generate to see the magic unfold.
                    </p>

                    {/* Hints */}
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
                      {['Upload sketch', 'Describe vision', 'Pick a style'].map(
                        (hint, i) => (
                          <motion.span
                            key={hint}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-charcoal/5 text-[10px] text-graphite uppercase tracking-wider"
                          >
                            <ChevronRight size={10} />
                            {hint}
                          </motion.span>
                        )
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          Capabilities (Dark Section)
         ═══════════════════════════════════ */}
      <section className="section-padding bg-charcoal relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-soft-white) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="container-wide relative">
          <div className="text-center mb-16">
            <ScrollReveal>
              <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-gold mb-4">
                Capabilities
              </p>
            </ScrollReveal>
            <TextReveal
              text="What You Can Create"
              as="h2"
              className="font-heading text-[clamp(2rem,5vw,3.5rem)] text-soft-white leading-[1.15]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <ImageIcon size={28} />,
                title: 'Photorealistic Renders',
                description:
                  'Transform sketches into stunning 8K architectural visualizations with AI-powered material, lighting, and atmosphere control.',
                features: [
                  'Sketch-to-render',
                  'Material control',
                  'Up to 8K resolution',
                ],
                gradient: 'from-gold/20 to-gold/5',
              },
              {
                icon: <Video size={28} />,
                title: 'Cinematic Walkthroughs',
                description:
                  'Generate immersive video flythroughs with intelligent camera pathing, ambient sound design, and cinematic transitions.',
                features: [
                  'AI camera paths',
                  'Sound design',
                  '4K video export',
                ],
                gradient: 'from-terracotta/20 to-terracotta/5',
              },
              {
                icon: <Presentation size={28} />,
                title: 'Client Presentations',
                description:
                  'Auto-generate polished design decks with mood boards, material specs, and project narratives in PPT, PDF, or Keynote.',
                features: [
                  'Mood boards',
                  'Material specs',
                  'Brand templates',
                ],
                gradient: 'from-olive/20 to-olive/5',
              },
            ].map((cap, i) => (
              <ScrollReveal key={cap.title} delay={i * 0.15}>
                <motion.div
                  className="group relative p-8 rounded-2xl bg-soft-white/5 border border-soft-white/8 backdrop-blur-sm h-full"
                  whileHover={{
                    y: -4,
                    borderColor: 'rgba(250, 250, 248, 0.15)',
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r ${cap.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  <div className="text-gold/70 mb-6 group-hover:text-gold transition-colors duration-300">
                    {cap.icon}
                  </div>
                  <h3 className="font-heading text-xl text-soft-white mb-3 group-hover:text-gold transition-colors duration-300">
                    {cap.title}
                  </h3>
                  <p className="text-sm text-soft-white/50 leading-relaxed mb-6">
                    {cap.description}
                  </p>
                  <ul className="space-y-2">
                    {cap.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2 text-xs text-soft-white/40"
                      >
                        <div className="w-1 h-1 rounded-full bg-gold/50" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          Workflow Steps
         ═══════════════════════════════════ */}
      <section className="section-padding bg-warm-beige relative overflow-hidden">
        <div className="container-wide">
          <div className="text-center mb-16">
            <ScrollReveal>
              <p className="label mb-4">How It Works</p>
            </ScrollReveal>
            <TextReveal
              text="From Concept to Reality"
              as="h2"
              className="font-heading text-[clamp(2rem,5vw,3.5rem)] text-charcoal leading-[1.15]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                step: '01',
                title: 'Upload & Describe',
                description:
                  'Share your sketches, floor plans, or mood boards — or simply describe your vision with text prompts.',
                icon: <Upload size={24} />,
              },
              {
                step: '02',
                title: 'AI Creates',
                description:
                  'Choose your output — image, video, or presentation. Select a style, adjust settings, and let AI do the heavy lifting.',
                icon: <Wand2 size={24} />,
              },
              {
                step: '03',
                title: 'Refine & Export',
                description:
                  'Fine-tune with variations, iterate on styles, and export in presentation-ready formats for your clients.',
                icon: <ArrowRight size={24} />,
              },
            ].map((item, i) => (
              <ScrollReveal key={item.step} delay={i * 0.15}>
                <div className="relative p-8 bg-soft-white rounded-2xl group hover:shadow-lg transition-shadow duration-500">
                  <span className="font-heading text-6xl text-gold/10 absolute top-4 right-6 group-hover:text-gold/20 transition-colors duration-500">
                    {item.step}
                  </span>
                  <div className="text-gold mb-6 group-hover:scale-110 transition-transform duration-300 inline-block">
                    {item.icon}
                  </div>
                  <h3 className="font-heading text-xl text-charcoal mb-3">
                    {item.title}
                  </h3>
                  <p className="text-graphite text-sm leading-relaxed">
                    {item.description}
                  </p>
                  {i < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-[1px] bg-gold/20" />
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          CTA
         ═══════════════════════════════════ */}
      <section className="section-padding bg-cream">
        <div className="container-wide">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto">
              <p className="label mb-4">Ready to Create?</p>
              <h2 className="font-heading text-[clamp(2rem,5vw,3rem)] text-charcoal mb-6 leading-[1.15]">
                Transform your design workflow today
              </h2>
              <p className="text-graphite text-sm leading-relaxed mb-8">
                Join hundreds of architects and designers already using WOW AI
                Studio to bring their visions to life faster than ever.
              </p>
              <motion.button
                className="inline-flex items-center gap-3 px-10 py-4 bg-charcoal text-soft-white rounded-full text-xs font-semibold tracking-[0.1em] uppercase cursor-pointer hover:bg-charcoal/90 transition-colors"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Sparkles size={16} />
                Start Creating
                <ArrowRight size={16} />
              </motion.button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
