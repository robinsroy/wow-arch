'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
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
  AlertCircle,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import TextReveal from '@/components/animations/TextReveal';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { useAIGeneration, type OutputMode, type GenerationResult } from '@/hooks/useAIGeneration';

/* ─────────────────────────────────────────────
   Static Data
   ───────────────────────────────────────────── */

interface StylePreset {
  id: string;
  name: string;
  preview: string;
}

const OUTPUT_MODES: {
  id: OutputMode;
  label: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  { id: 'image', label: 'Image', icon: <ImageIcon size={22} />, description: 'Photorealistic renders & visualizations' },
  { id: 'video', label: 'Video', icon: <Video size={22} />, description: 'Cinematic walkthroughs & flythroughs' },
  { id: 'presentation', label: 'Presentation', icon: <Presentation size={22} />, description: 'Client-ready decks & mood boards' },
];

const STYLE_PRESETS: StylePreset[] = [
  { id: 'modern-minimal', name: 'Modern Minimal', preview: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80' },
  { id: 'warm-organic', name: 'Warm Organic', preview: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80' },
  { id: 'art-deco', name: 'Art Deco', preview: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80' },
  { id: 'japanese-zen', name: 'Japanese Zen', preview: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&q=80' },
  { id: 'mediterranean', name: 'Mediterranean', preview: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&q=80' },
  { id: 'brutalist', name: 'Brutalist', preview: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80' },
];

const PROMPT_SUGGESTIONS = [
  'A modern villa with floor-to-ceiling windows overlooking the ocean…',
  'Minimalist concrete interior with natural light and timber accents…',
  'Luxury penthouse with panoramic city views at golden hour…',
  'Zen garden courtyard with water features and stepping stones…',
];

/* ─────────────────────────────────────────────
   Floating Orb Background
   ───────────────────────────────────────────── */
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.06]"
        style={{ background: 'radial-gradient(circle, var(--color-gold), transparent)', top: '-10%', right: '-10%' }}
        animate={{ x: [0, 80, -40, 0], y: [0, -60, 40, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-[0.04]"
        style={{ background: 'radial-gradient(circle, var(--color-terracotta), transparent)', bottom: '10%', left: '-5%' }}
        animate={{ x: [0, -60, 30, 0], y: [0, 50, -30, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────── */

/** Convert a File to { base64, mimeType } */
function readFileAsBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // strip "data:…;base64," prefix
      const base64 = result.split(',')[1];
      resolve({ base64, mimeType: file.type });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Trigger a browser download from base64 data */
function downloadBase64(data: string, mimeType: string, filename: string) {
  const link = document.createElement('a');
  link.href = `data:${mimeType};base64,${data}`;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/* ─────────────────────────────────────────────
   Page Component
   ───────────────────────────────────────────── */
export default function AIStudioPage() {
  // ── AI generation hook ──
  const { phase, result, error, progress, generate, reset: resetAI, isGenerating } = useAIGeneration();

  // ── Local UI state ──
  const [activeMode, setActiveMode] = useState<OutputMode>('image');
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; base64: string; mimeType: string; previewUrl: string } | null>(null);
  const [promptIndex, setPromptIndex] = useState(0);
  const [selectedLighting, setSelectedLighting] = useState<string>('day');
  const [selectedFormat, setSelectedFormat] = useState<string>('pptx');
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [showReview, setShowReview] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  // ── File handling ──
  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') return;
    const { base64, mimeType } = await readFileAsBase64(file);
    const previewUrl = URL.createObjectURL(file);
    setUploadedFile({ name: file.name, base64, mimeType, previewUrl });
  }, []);

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const removeFile = () => {
    if (uploadedFile?.previewUrl) URL.revokeObjectURL(uploadedFile.previewUrl);
    setUploadedFile(null);
  };

  // ── Generate ──
  const handleGenerate = useCallback(() => {
    if (!prompt && !uploadedFile) return;
    setSelectedImageIdx(0);
    setShowReview(false);

    const styleName = selectedStyle
      ? STYLE_PRESETS.find((s) => s.id === selectedStyle)?.name
      : undefined;

    generate({
      mode: activeMode,
      prompt: prompt || '',
      imageBase64: uploadedFile?.base64,
      imageMimeType: uploadedFile?.mimeType,
      style: styleName,
      lighting: selectedLighting,
      format: selectedFormat,
    });
  }, [prompt, uploadedFile, activeMode, selectedStyle, selectedLighting, selectedFormat, generate]);

  // ── Reset ──
  const handleReset = () => {
    resetAI();
    setPrompt('');
    removeFile();
    setSelectedStyle(null);
    setSelectedImageIdx(0);
    setShowReview(false);
  };

  const cyclePlaceholder = () => setPromptIndex((i) => (i + 1) % PROMPT_SUGGESTIONS.length);

  // ── Derived state ──
  const hasInput = !!(prompt || uploadedFile);
  const isComplete = phase === 'complete' && result;
  const hasImages = isComplete && result.images && result.images.length > 0;
  const hasVideo = isComplete && result.videoData;
  const hasPresentation = isComplete && (result.presentationUrl || result.outline);

  // Auto-download PPT when presentation is generated
  useEffect(() => {
    if (isComplete && hasPresentation && result?.exportUrl) {
      try {
        const link = document.createElement('a');
        link.href = result.exportUrl;
        link.download = `${result.outline?.title || 'presentation'}.pptx`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => { try { document.body.removeChild(link); } catch {} }, 200);
      } catch {}
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete, hasPresentation, result?.exportUrl]);

  return (
    <div className="min-h-screen bg-cream">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,.dwg"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* ═══════════════════════════════════
          Hero
         ═══════════════════════════════════ */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-[70vh] flex items-center justify-center pt-32 pb-20 overflow-hidden"
      >
        <FloatingOrbs />
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} />

        <div className="container-wide relative z-10 text-center">
          <TextReveal text="Create with" as="h1" className="font-heading text-[clamp(2.5rem,7vw,5.5rem)] text-charcoal font-normal leading-[1.1] tracking-[-0.02em]" delay={0.1} />
          <TextReveal text="Intelligence" as="h1" className="font-heading text-[clamp(2.5rem,7vw,5.5rem)] text-gold italic font-normal leading-[1.1] tracking-[-0.02em] mb-8" delay={0.3} />

          <ScrollReveal delay={0.5}>
            <p className="text-graphite text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-4">
              Upload your sketches, describe your vision, or choose a style — and let BaoBao AI
              generate stunning renders, cinematic walkthroughs, and client-ready presentations.
            </p>
          </ScrollReveal>

          <motion.div className="mt-12" animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
            <div className="w-[1px] h-12 bg-gradient-to-b from-gold/0 via-gold/40 to-gold/0 mx-auto" />
          </motion.div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════
          Output Mode Selector
         ═══════════════════════════════════ */}
      <section className="container-wide mb-16 mt-4">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row gap-5 justify-center pb-6">
            {OUTPUT_MODES.map((mode) => (
              <motion.button
                key={mode.id}
                onClick={() => { setActiveMode(mode.id); if (!isGenerating) resetAI(); }}
                className={`group relative flex items-center gap-4 px-6 py-5 rounded-2xl border cursor-pointer transition-all duration-500 text-left min-w-[240px] ${
                  activeMode === mode.id
                    ? 'bg-charcoal border-charcoal text-soft-white shadow-lg'
                    : 'bg-soft-white border-charcoal/8 text-charcoal hover:border-charcoal/20 hover:shadow-md'
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                layout
              >
                <div className={`flex-shrink-0 p-2.5 rounded-xl transition-colors duration-300 ${
                  activeMode === mode.id ? 'bg-gold/20 text-gold' : 'bg-charcoal/5 text-graphite group-hover:text-gold'
                }`}>
                  {mode.icon}
                </div>
                <div>
                  <p className={`text-sm font-semibold tracking-wide ${activeMode === mode.id ? 'text-soft-white' : 'text-charcoal'}`}>{mode.label}</p>
                  <p className={`text-[11px] leading-snug mt-0.5 ${activeMode === mode.id ? 'text-soft-white/60' : 'text-muted'}`}>{mode.description}</p>
                </div>
                {activeMode === mode.id && (
                  <motion.div layoutId="mode-indicator" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-gold rounded-full" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
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
                isDragOver ? 'border-gold bg-gold/5 scale-[1.01]'
                  : uploadedFile ? 'border-gold/30 bg-gold/5'
                  : 'border-charcoal/10 bg-soft-white hover:border-charcoal/20'
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleFileDrop}
            >
              <AnimatePresence mode="wait">
                {uploadedFile ? (
                  <motion.div key="uploaded" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                          <Check size={18} className="text-gold" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-charcoal">{uploadedFile.name}</p>
                          <p className="text-[11px] text-muted">Ready for processing</p>
                        </div>
                      </div>
                      <button onClick={removeFile} className="p-1.5 rounded-lg hover:bg-charcoal/5 text-muted hover:text-charcoal transition-colors cursor-pointer">
                        <X size={16} />
                      </button>
                    </div>
                    {uploadedFile.mimeType.startsWith('image/') ? (
                      <img src={uploadedFile.previewUrl} alt="Preview" className="w-full h-36 object-cover rounded-xl" />
                    ) : (
                      <div className="w-full h-32 rounded-xl bg-gradient-to-br from-warm-beige to-sand flex items-center justify-center">
                        <PenTool size={28} className="text-charcoal/20" />
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-8 md:p-10 text-center cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <motion.div
                      className="w-14 h-14 rounded-2xl bg-charcoal/5 flex items-center justify-center mx-auto mb-4"
                      animate={isDragOver ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                    >
                      <Upload size={22} className={isDragOver ? 'text-gold' : 'text-muted'} />
                    </motion.div>
                    <p className="text-charcoal font-medium text-sm mb-1">Drop your sketch here</p>
                    <p className="text-[12px] text-muted">or click to browse · JPG, PNG, PDF, DWG</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Divider */}
            <div className="flex items-center gap-4 py-1">
              <div className="flex-1 h-[1px] bg-charcoal/8" />
              <span className="text-[10px] text-muted uppercase tracking-[0.2em] font-medium">or describe your vision</span>
              <div className="flex-1 h-[1px] bg-charcoal/8" />
            </div>

            {/* Prompt Input */}
            <div className="relative">
              <div className="bg-soft-white rounded-2xl border border-charcoal/8 overflow-hidden transition-all duration-300 focus-within:border-gold/40 focus-within:shadow-lg focus-within:shadow-gold/5">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={PROMPT_SUGGESTIONS[promptIndex]}
                  rows={5}
                  className="w-full px-5 pt-5 pb-3 bg-transparent text-charcoal text-sm placeholder:text-muted/60 focus:outline-none resize-none leading-relaxed"
                />
                <div className="flex items-center justify-between px-4 pb-3">
                  <button onClick={cyclePlaceholder} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] text-muted hover:text-charcoal hover:bg-charcoal/5 transition-all uppercase tracking-wider cursor-pointer">
                    <Lightbulb size={12} />
                    Inspire me
                  </button>
                  <span className="text-[10px] text-muted/50">{prompt.length}/500</span>
                </div>
              </div>
            </div>

            {/* Style Presets */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-graphite">Style Preset</p>
                {selectedStyle && (
                  <button onClick={() => setSelectedStyle(null)} className="text-[10px] text-muted hover:text-charcoal transition-colors cursor-pointer">Clear</button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {STYLE_PRESETS.map((style) => (
                  <motion.button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id === selectedStyle ? null : style.id)}
                    className={`group relative rounded-xl overflow-hidden cursor-pointer aspect-[3/2] ${
                      selectedStyle === style.id ? 'ring-2 ring-gold ring-offset-2 ring-offset-cream' : ''
                    }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <img src={style.preview} alt={style.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-[11px] font-semibold text-soft-white leading-tight">{style.name}</p>
                    </div>
                    {selectedStyle === style.id && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gold flex items-center justify-center">
                        <Check size={10} className="text-soft-white" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Output Settings */}
            <div className="bg-soft-white rounded-2xl border border-charcoal/8 p-6">
              <div className="flex items-center justify-between mb-5">
                <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-graphite">Output Settings</p>
                <SlidersHorizontal size={14} className="text-muted" />
              </div>
              <div className="space-y-5">
                {/* Lighting */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-charcoal">Lighting</span>
                  </div>
                  <div className="flex gap-3">
                    {[
                      { icon: <Sun size={14} />, label: 'Day', value: 'day' },
                      { icon: <Moon size={14} />, label: 'Night', value: 'night' },
                      { icon: <Camera size={14} />, label: 'Golden', value: 'golden' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setSelectedLighting(opt.value)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-semibold uppercase tracking-wider border transition-all cursor-pointer ${
                          selectedLighting === opt.value
                            ? 'border-gold bg-gold/10 text-gold shadow-sm shadow-gold/10'
                            : 'border-charcoal/8 text-graphite hover:border-gold/30 hover:text-gold'
                        }`}
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
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-charcoal">Format</span>
                    </div>
                    <div className="flex gap-3">
                      {(['pptx', 'pdf', 'keynote'] as const).map((fmt) => (
                        <button
                          key={fmt}
                          onClick={() => setSelectedFormat(fmt)}
                          className={`flex-1 py-3 rounded-xl text-[11px] font-semibold uppercase tracking-wider border transition-all cursor-pointer ${
                            selectedFormat === fmt
                              ? 'border-gold bg-gold/10 text-gold'
                              : 'border-charcoal/8 text-graphite hover:border-gold/30 hover:text-gold'
                          }`}
                        >
                          {fmt === 'pptx' ? 'PPT' : fmt === 'pdf' ? 'PDF' : 'Keynote'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Generate Button */}
            <div className="pt-4 pb-2">
            <motion.button
              onClick={handleGenerate}
              disabled={isGenerating || !hasInput}
              className={`w-full relative flex items-center justify-center gap-3 py-[1.125rem] rounded-2xl text-sm font-semibold tracking-[0.08em] uppercase transition-all duration-500 cursor-pointer overflow-hidden ${
                isGenerating ? 'bg-charcoal text-soft-white'
                  : hasInput ? 'bg-charcoal text-soft-white hover:bg-charcoal/90 shadow-lg shadow-charcoal/10'
                  : 'bg-charcoal/10 text-muted cursor-not-allowed'
              }`}
              whileHover={!isGenerating && hasInput ? { scale: 1.01 } : {}}
              whileTap={!isGenerating && hasInput ? { scale: 0.99 } : {}}
            >
              {isGenerating && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/20 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
              <span className="relative z-10 flex items-center gap-3">
                {isGenerating ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                      <Sparkles size={18} />
                    </motion.div>
                    {progress || 'Generating…'}
                  </>
                ) : (
                  <>
                    <Wand2 size={18} />
                    Generate Procedure
                  </>
                )}
              </span>
            </motion.button>
            </div>
          </div>

          {/* ── Right Panel: Output ── */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {/* ── ERROR STATE ── */}
              {phase === 'error' && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center min-h-[500px] lg:min-h-[600px] rounded-2xl border border-red-200 bg-red-50/50"
                >
                  <AlertCircle size={40} className="text-red-400 mb-4" />
                  <h3 className="font-heading text-xl text-charcoal mb-2">Generation Failed</h3>
                  <p className="text-sm text-red-500 max-w-md text-center mb-6 px-4">{error}</p>
                  <motion.button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-charcoal text-soft-white text-xs font-medium tracking-wider uppercase cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RotateCcw size={14} />
                    Try Again
                  </motion.button>
                </motion.div>
              )}

              {/* ── COMPLETED: IMAGE OUTPUT ── */}
              {isComplete && hasImages && (
                <motion.div
                  key="images"
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-4"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-graphite">Generated Renders</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {result.aiReview && (
                        <button
                          onClick={() => setShowReview(!showReview)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] text-graphite hover:text-charcoal hover:bg-charcoal/5 transition-all cursor-pointer"
                        >
                          <MessageSquare size={12} />
                          AI Review
                        </button>
                      )}
                      <button onClick={handleReset} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] text-muted hover:text-charcoal hover:bg-charcoal/5 transition-all cursor-pointer">
                        <RotateCcw size={12} />
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* AI Review Panel */}
                  <AnimatePresence>
                    {showReview && result.aiReview && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 rounded-xl bg-gold/5 border border-gold/15 mb-2">
                          <div className="flex items-center gap-2 mb-3">
                            <Sparkles size={14} className="text-gold" />
                            <span className="text-[11px] font-medium tracking-[0.08em] uppercase text-gold">BaoBao AI Review</span>
                          </div>
                          <p className="text-sm text-graphite leading-relaxed whitespace-pre-wrap">{result.aiReview}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Main Image */}
                  <motion.div className="relative aspect-[16/10] rounded-2xl overflow-hidden group" whileHover={{ scale: 1.005 }}>
                    <img
                      src={`data:${result.images![selectedImageIdx].mimeType};base64,${result.images![selectedImageIdx].data}`}
                      alt={`Generated render ${selectedImageIdx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <button
                      onClick={() => downloadBase64(result.images![selectedImageIdx].data, result.images![selectedImageIdx].mimeType, `wow-render-${selectedImageIdx + 1}.png`)}
                      className="absolute top-3 right-3 p-2 rounded-xl bg-soft-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-soft-white cursor-pointer"
                    >
                      <Download size={14} className="text-charcoal" />
                    </button>
                  </motion.div>

                  {/* Variation Thumbnails */}
                  {result.images!.length > 1 && (
                    <div className="grid grid-cols-4 gap-2.5">
                      {result.images!.map((img, i) => (
                        <motion.div
                          key={i}
                          onClick={() => setSelectedImageIdx(i)}
                          className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer group/thumb ${
                            selectedImageIdx === i ? 'ring-2 ring-gold ring-offset-2 ring-offset-cream' : ''
                          }`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * i }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <img
                            src={`data:${img.mimeType};base64,${img.data}`}
                            alt={`Variation ${i + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/thumb:scale-110"
                          />
                          {selectedImageIdx === i && (
                            <div className="absolute top-1.5 left-1.5 w-4 h-4 rounded-full bg-gold flex items-center justify-center">
                              <Check size={8} className="text-soft-white" />
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Download all */}
                  <div className="flex gap-3">
                    <motion.button
                      onClick={() => downloadBase64(result.images![selectedImageIdx].data, result.images![selectedImageIdx].mimeType, `wow-render-${selectedImageIdx + 1}.png`)}
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-charcoal text-soft-white text-xs font-medium tracking-wider uppercase cursor-pointer"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Download size={14} />
                      Download PNG
                    </motion.button>
                    <motion.button
                      onClick={handleGenerate}
                      className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-charcoal/10 text-xs font-medium tracking-wider uppercase text-charcoal hover:border-charcoal/20 transition-colors cursor-pointer"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Sparkles size={14} />
                      Regenerate
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* ── COMPLETED: VIDEO OUTPUT ── */}
              {isComplete && hasVideo && (
                <motion.div
                  key="video"
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-graphite">Generated Walkthrough</p>
                    </div>
                    <button onClick={handleReset} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] text-muted hover:text-charcoal hover:bg-charcoal/5 transition-all cursor-pointer">
                      <RotateCcw size={12} />
                      Reset
                    </button>
                  </div>

                  {/* AI Review */}
                  {result.aiReview && (
                    <div className="p-5 rounded-xl bg-gold/5 border border-gold/15">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={14} className="text-gold" />
                        <span className="text-[11px] font-medium tracking-[0.08em] uppercase text-gold">BaoBao AI Review</span>
                      </div>
                      <p className="text-sm text-graphite leading-relaxed whitespace-pre-wrap">{result.aiReview}</p>
                    </div>
                  )}

                  {/* Video Player */}
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-charcoal">
                    {result.videoData?.startsWith('http') ? (
                      <video src={result.videoData} controls className="w-full h-full object-cover" />
                    ) : result.videoData ? (
                      <video
                        src={`data:${result.videoMimeType || 'video/mp4'};base64,${result.videoData}`}
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-soft-white/50">
                        <p className="text-sm">Video preview unavailable</p>
                      </div>
                    )}
                  </div>

                  <motion.button
                    onClick={() => {
                      if (result.videoData?.startsWith('http')) {
                        window.open(result.videoData, '_blank');
                      } else if (result.videoData) {
                        downloadBase64(result.videoData, result.videoMimeType || 'video/mp4', 'wow-walkthrough.mp4');
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-charcoal text-soft-white text-xs font-medium tracking-wider uppercase cursor-pointer"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Download size={14} />
                    Download MP4
                  </motion.button>
                </motion.div>
              )}

              {/* ── COMPLETED: PRESENTATION OUTPUT ── */}
              {isComplete && hasPresentation && (
                <PresentationPreview
                  result={result}
                  onReset={handleReset}
                  onRegenerate={handleGenerate}
                />
              )}

              {/* ── GENERATING STATE ── */}
              {isGenerating && (
                <motion.div
                  key="generating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center min-h-[500px] lg:min-h-[600px]"
                >
                  <div className="relative w-28 h-28 mb-8">
                    <motion.div className="absolute inset-0 rounded-full border-2 border-dashed border-gold/20" animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} />
                    <motion.div className="absolute inset-3 rounded-full border-2 border-dashed border-terracotta/15" animate={{ rotate: -360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }} />
                    <motion.div className="absolute inset-6 rounded-full border-2 border-dashed border-olive/10" animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }}>
                        <Wand2 size={24} className="text-gold" />
                      </motion.div>
                    </div>
                  </div>

                  <motion.p className="font-heading text-xl text-charcoal mb-2" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
                    {progress || 'Processing…'}
                  </motion.p>
                  <p className="text-xs text-muted">
                    {activeMode === 'video' ? 'Video generation typically takes 1-2 minutes' : 'This usually takes 15-30 seconds'}
                  </p>

                  <div className="mt-8 space-y-3">
                    {(activeMode === 'image'
                      ? ['Analysing input', 'Enhancing prompt', 'Rendering images', 'Final touches']
                      : activeMode === 'video'
                        ? ['Analysing concept', 'Planning camera path', 'Rendering frames', 'Compositing']
                        : ['Analysing concept', 'Building outline', 'Designing slides', 'Formatting']
                    ).map((step, i) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.8, duration: 0.3 }}
                        className="flex items-center gap-3"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.8 + 0.4 }}
                          className="w-4 h-4 rounded-full bg-gold/20 flex items-center justify-center"
                        >
                          <Check size={8} className="text-gold" />
                        </motion.div>
                        <span className="text-xs text-graphite">{step}</span>
                      </motion.div>
                    ))}
                  </div>

                  <motion.button
                    onClick={handleReset}
                    className="mt-8 text-[10px] text-muted hover:text-charcoal uppercase tracking-wider cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                  >
                    Cancel
                  </motion.button>
                </motion.div>
              )}

              {/* ── IDLE STATE ── */}
              {phase === 'idle' && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative flex flex-col items-center justify-center min-h-[500px] lg:min-h-[600px] rounded-2xl border border-dashed border-charcoal/8 bg-gradient-to-br from-soft-white to-warm-beige/30 overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: 'linear-gradient(var(--color-charcoal) 1px, transparent 1px), linear-gradient(90deg, var(--color-charcoal) 1px, transparent 1px)',
                    backgroundSize: '50px 50px',
                  }} />

                  <div className="relative text-center px-8">
                    <motion.div
                      className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gold/10 to-terracotta/10 flex items-center justify-center mx-auto mb-6 border border-gold/10"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      {activeMode === 'image' && <ImageIcon size={32} className="text-gold/50" />}
                      {activeMode === 'video' && <Video size={32} className="text-gold/50" />}
                      {activeMode === 'presentation' && <Presentation size={32} className="text-gold/50" />}
                    </motion.div>

                    <h3 className="font-heading text-2xl text-charcoal mb-3">
                      {activeMode === 'image' && 'Your renders will appear here'}
                      {activeMode === 'video' && 'Your walkthrough will appear here'}
                      {activeMode === 'presentation' && 'Your presentation will appear here'}
                    </h3>
                    <p className="text-sm text-muted max-w-sm mx-auto leading-relaxed">
                      Upload a sketch, describe your vision, or choose a style preset — then hit generate to let BaoBao AI work its magic.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
                      {['Upload sketch', 'Describe vision', 'Pick a style'].map((hint, i) => (
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
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          Capabilities
         ═══════════════════════════════════ */}
      <section className="section-padding bg-charcoal relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-soft-white) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
        <div className="container-wide relative">
          <div className="text-center mb-16">
            <ScrollReveal>
              <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-gold mb-4">Capabilities</p>
            </ScrollReveal>
            <TextReveal text="What You Can Create" as="h2" className="font-heading text-[clamp(2rem,5vw,3.5rem)] text-soft-white leading-[1.15]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <ImageIcon size={28} />, title: 'Photorealistic Renders', description: 'Transform sketches into stunning 8K architectural visualizations with AI-powered material, lighting, and atmosphere control.', features: ['Sketch-to-render', 'Material control', 'Up to 8K resolution'], gradient: 'from-gold/20 to-gold/5' },
              { icon: <Video size={28} />, title: 'Cinematic Walkthroughs', description: 'Generate immersive video flythroughs with intelligent camera pathing, ambient sound design, and cinematic transitions.', features: ['AI camera paths', 'Sound design', '4K video export'], gradient: 'from-terracotta/20 to-terracotta/5' },
              { icon: <Presentation size={28} />, title: 'Client Presentations', description: 'Auto-generate polished design decks with mood boards, material specs, and project narratives in PPT, PDF, or Keynote.', features: ['Mood boards', 'Material specs', 'Brand templates'], gradient: 'from-olive/20 to-olive/5' },
            ].map((cap, i) => (
              <ScrollReveal key={cap.title} delay={i * 0.15}>
                <motion.div
                  className="group relative p-8 rounded-2xl bg-soft-white/5 border border-soft-white/8 backdrop-blur-sm h-full"
                  whileHover={{ y: -4, borderColor: 'rgba(250, 250, 248, 0.15)' }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r ${cap.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="text-gold/70 mb-6 group-hover:text-gold transition-colors duration-300">{cap.icon}</div>
                  <h3 className="font-heading text-xl text-soft-white mb-3 group-hover:text-gold transition-colors duration-300">{cap.title}</h3>
                  <p className="text-sm text-soft-white/50 leading-relaxed mb-6">{cap.description}</p>
                  <ul className="space-y-2">
                    {cap.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-soft-white/40">
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
          Workflow
         ═══════════════════════════════════ */}
      <section className="section-padding bg-warm-beige relative overflow-hidden">
        <div className="container-wide">
          <div className="text-center mb-16">
            <ScrollReveal><p className="label mb-4">How It Works</p></ScrollReveal>
            <TextReveal text="From Concept to Reality" as="h2" className="font-heading text-[clamp(2rem,5vw,3.5rem)] text-charcoal leading-[1.15]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { step: '01', title: 'Upload & Describe', description: 'Share your sketches, floor plans, or mood boards — or simply describe your vision with text prompts.', icon: <Upload size={24} /> },
              { step: '02', title: 'BaoBao AI Creates', description: 'Choose your output — image, video, or presentation. BaoBao AI reviews your concept, enhances it, and generates.', icon: <Wand2 size={24} /> },
              { step: '03', title: 'Refine & Export', description: 'Fine-tune with variations, iterate on styles, and export in presentation-ready formats for your clients.', icon: <ArrowRight size={24} /> },
            ].map((item, i) => (
              <ScrollReveal key={item.step} delay={i * 0.15}>
                <div className="relative p-8 bg-soft-white rounded-2xl group hover:shadow-lg transition-shadow duration-500">
                  <span className="font-heading text-6xl text-gold/10 absolute top-4 right-6 group-hover:text-gold/20 transition-colors duration-500">{item.step}</span>
                  <div className="text-gold mb-6 group-hover:scale-110 transition-transform duration-300 inline-block">{item.icon}</div>
                  <h3 className="font-heading text-xl text-charcoal mb-3">{item.title}</h3>
                  <p className="text-graphite text-sm leading-relaxed">{item.description}</p>
                  {i < 2 && <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-[1px] bg-gold/20" />}
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
              <p className="label mb-4">Powered by BaoBao AI</p>
              <h2 className="font-heading text-[clamp(2rem,5vw,3rem)] text-charcoal mb-6 leading-[1.15]">Transform your design workflow today</h2>
              <p className="text-graphite text-sm leading-relaxed mb-8">
                Join hundreds of architects and designers already using BaoBao AI Studio
                to bring their visions to life faster than ever.
              </p>
              <motion.button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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

/* ═══════════════════════════════════════════
   Presentation Preview Component
   ═══════════════════════════════════════════ */

const SLIDE_COLORS = [
  { bg: 'bg-gradient-to-br from-charcoal to-charcoal/90', text: 'text-soft-white', sub: 'text-soft-white/60', accent: 'bg-gold' },
  { bg: 'bg-gradient-to-br from-soft-white to-warm-beige/30', text: 'text-charcoal', sub: 'text-graphite', accent: 'bg-gold' },
  { bg: 'bg-gradient-to-br from-gold/10 to-warm-beige/40', text: 'text-charcoal', sub: 'text-graphite', accent: 'bg-charcoal' },
  { bg: 'bg-gradient-to-br from-charcoal/95 to-charcoal/85', text: 'text-soft-white', sub: 'text-soft-white/50', accent: 'bg-gold' },
  { bg: 'bg-gradient-to-br from-warm-beige to-cream', text: 'text-charcoal', sub: 'text-graphite', accent: 'bg-terracotta' },
  { bg: 'bg-gradient-to-br from-soft-white to-soft-white', text: 'text-charcoal', sub: 'text-muted', accent: 'bg-gold' },
];

function PresentationPreview({
  result,
  onReset,
  onRegenerate,
}: {
  result: GenerationResult;
  onReset: () => void;
  onRegenerate: () => void;
}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [viewMode, setViewMode] = useState<'embed' | 'outline'>('embed');
  const [embedLoaded, setEmbedLoaded] = useState(false);
  const [embedError, setEmbedError] = useState(false);
  const slides = result.outline?.slides ?? [];
  const totalSlides = slides.length;
  const thumbsRef = useRef<HTMLDivElement>(null);

  const goToSlide = (idx: number) => {
    setActiveSlide(Math.max(0, Math.min(totalSlides - 1, idx)));
  };

  // Auto-scroll thumbnail strip to keep active visible
  useEffect(() => {
    if (thumbsRef.current) {
      const thumb = thumbsRef.current.children[activeSlide] as HTMLElement;
      if (thumb) {
        thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeSlide]);

  // Derive embed URL from Gamma presentation URL or export URL
  const embedUrl = useMemo(() => {
    if (result.presentationUrl) {
      // Gamma URLs like https://gamma.app/docs/xxx → convert to embed
      const url = result.presentationUrl;
      if (url.includes('gamma.app/docs/')) {
        return url.replace('/docs/', '/embed/');
      }
      // Already an embed URL or other format — use as is
      return url;
    }
    if (result.exportUrl) {
      // Use Microsoft Office Online viewer to render PPTX files
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(result.exportUrl)}`;
    }
    return null;
  }, [result.presentationUrl, result.exportUrl]);

  // If no embed URL available, force outline mode
  const effectiveMode = embedUrl ? viewMode : 'outline';

  const currentSlide = slides[activeSlide];
  const colorScheme = SLIDE_COLORS[activeSlide % SLIDE_COLORS.length];
  const isFirstSlide = activeSlide === 0;

  return (
    <motion.div
      key="presentation"
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-graphite">
            {result.outline?.title || 'Presentation'} · {totalSlides} slides
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          {embedUrl && (
            <div className="flex items-center gap-0.5 bg-charcoal/5 rounded-lg p-0.5 border border-charcoal/8">
              <button
                onClick={() => setViewMode('embed')}
                className={`px-2.5 py-1 text-[9px] font-medium tracking-[0.08em] uppercase rounded-md transition-all cursor-pointer ${
                  viewMode === 'embed'
                    ? 'bg-white text-charcoal shadow-sm'
                    : 'text-muted hover:text-charcoal'
                }`}
              >
                Preview
              </button>
              <button
                onClick={() => setViewMode('outline')}
                className={`px-2.5 py-1 text-[9px] font-medium tracking-[0.08em] uppercase rounded-md transition-all cursor-pointer ${
                  viewMode === 'outline'
                    ? 'bg-white text-charcoal shadow-sm'
                    : 'text-muted hover:text-charcoal'
                }`}
              >
                Outline
              </button>
            </div>
          )}
          <button onClick={onReset} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] text-muted hover:text-charcoal hover:bg-charcoal/5 transition-all cursor-pointer">
            <RotateCcw size={12} />
            Reset
          </button>
        </div>
      </div>

      {/* ── Embedded Presentation View ── */}
      {effectiveMode === 'embed' && embedUrl && (
        <div className="relative rounded-2xl overflow-hidden border border-charcoal/10 shadow-lg bg-white">
          {/* Loading state */}
          {!embedLoaded && !embedError && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-br from-soft-white to-warm-beige/30">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full mb-3"
              />
              <p className="text-xs text-graphite">Loading presentation…</p>
            </div>
          )}

          {/* Error state */}
          {embedError && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-br from-soft-white to-warm-beige/30 px-8">
              <p className="text-sm text-graphite mb-3 text-center">
                Unable to load embedded preview. You can still view the presentation online or download it.
              </p>
              <button
                onClick={() => setViewMode('outline')}
                className="text-xs text-gold font-medium hover:underline cursor-pointer"
              >
                View outline instead
              </button>
            </div>
          )}

          {/* The iframe showing the actual generated PPT */}
          <iframe
            src={embedUrl}
            className="w-full border-0"
            style={{ height: '520px', minHeight: '400px' }}
            title="Generated Presentation"
            allowFullScreen
            onLoad={() => setEmbedLoaded(true)}
            onError={() => setEmbedError(true)}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </div>
      )}

      {/* ── Outline / Slide Viewer (fallback or explicit) ── */}
      {effectiveMode === 'outline' && (
        <>
          {/* Main Slide Viewer */}
          <div className="relative rounded-2xl overflow-hidden border border-charcoal/10 shadow-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className={`relative aspect-[16/9] ${colorScheme.bg} flex flex-col justify-center px-12 py-10`}
              >
                <div className="absolute top-0 left-0 w-full h-[3px]">
                  <div className={`h-full ${colorScheme.accent} w-1/3`} />
                </div>
                <div className="absolute bottom-6 right-8 flex items-center gap-2 opacity-40">
                  <div className={`w-1.5 h-1.5 rounded-full ${colorScheme.accent}`} />
                  <span className={`text-[9px] font-medium tracking-wider ${colorScheme.sub}`}>
                    {String(activeSlide + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
                  </span>
                </div>

                {isFirstSlide ? (
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-12 h-[2px] ${colorScheme.accent} mb-6 rounded-full`} />
                    <h2 className={`font-heading text-2xl md:text-3xl ${colorScheme.text} leading-tight mb-3`}>
                      {result.outline?.title}
                    </h2>
                    <p className={`text-sm ${colorScheme.sub} max-w-lg leading-relaxed`}>
                      {result.outline?.subtitle}
                    </p>
                    <div className={`w-16 h-[1px] ${colorScheme.accent} opacity-30 mt-6`} />
                  </div>
                ) : (
                  <div className="max-w-xl">
                    <span className={`text-[9px] font-bold uppercase tracking-[0.2em] ${colorScheme.sub} mb-3 block`}>
                      {currentSlide?.type || `Section ${activeSlide}`}
                    </span>
                    <h3 className={`font-heading text-xl md:text-2xl ${colorScheme.text} leading-tight mb-4`}>
                      {currentSlide?.title}
                    </h3>
                    <p className={`text-sm ${colorScheme.sub} leading-relaxed`}>
                      {currentSlide?.content}
                    </p>
                  </div>
                )}

                {!isFirstSlide && (
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-2 opacity-10">
                    <div className={`w-20 h-16 rounded-lg ${colorScheme.accent}`} />
                    <div className={`w-20 h-10 rounded-lg ${colorScheme.accent}`} />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {totalSlides > 1 && (
              <>
                <button
                  onClick={() => goToSlide(activeSlide - 1)}
                  disabled={activeSlide === 0}
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-soft-white/90 backdrop-blur-sm flex items-center justify-center shadow-md transition-all cursor-pointer ${
                    activeSlide === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-soft-white hover:scale-105'
                  }`}
                >
                  <ChevronRight size={16} className="text-charcoal rotate-180" />
                </button>
                <button
                  onClick={() => goToSlide(activeSlide + 1)}
                  disabled={activeSlide === totalSlides - 1}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-soft-white/90 backdrop-blur-sm flex items-center justify-center shadow-md transition-all cursor-pointer ${
                    activeSlide === totalSlides - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-soft-white hover:scale-105'
                  }`}
                >
                  <ChevronRight size={16} className="text-charcoal" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          {totalSlides > 1 && (
            <div className="relative">
              <div ref={thumbsRef} className="flex gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth px-1">
                {slides.map((slide, i) => {
                  const thumbColor = SLIDE_COLORS[i % SLIDE_COLORS.length];
                  return (
                    <motion.button
                      key={i}
                      onClick={() => setActiveSlide(i)}
                      className={`shrink-0 relative w-[120px] aspect-[16/9] rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                        activeSlide === i
                          ? 'border-gold shadow-md shadow-gold/20 scale-[1.03]'
                          : 'border-charcoal/8 hover:border-charcoal/20'
                      }`}
                      whileHover={{ scale: activeSlide === i ? 1.03 : 1.05 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <div className={`absolute inset-0 ${thumbColor.bg} flex flex-col justify-center px-2.5 py-2`}>
                        <div className={`w-4 h-[1px] ${thumbColor.accent} mb-1.5 rounded-full`} />
                        <p className={`text-[7px] font-semibold ${thumbColor.text} line-clamp-1 leading-tight`}>
                          {i === 0 ? result.outline?.title : slide.title}
                        </p>
                        <p className={`text-[5px] ${thumbColor.sub} line-clamp-1 mt-0.5`}>
                          {i === 0 ? result.outline?.subtitle : slide.content}
                        </p>
                      </div>
                      {activeSlide === i && (
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Action Buttons ── */}
      <div className="flex gap-3 pt-1">
        {result.exportUrl && (
          <motion.a
            href={result.exportUrl}
            download
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-charcoal text-soft-white text-xs font-medium tracking-wider uppercase"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Download size={14} />
            Download PPT
          </motion.a>
        )}
        {result.presentationUrl && (
          <motion.a
            href={result.presentationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-charcoal/10 text-xs font-medium tracking-wider uppercase text-charcoal hover:border-charcoal/20 hover:bg-charcoal/5 transition-colors"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <ExternalLink size={14} />
            Open Online
          </motion.a>
        )}
        <motion.button
          onClick={onRegenerate}
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-charcoal/10 text-xs font-medium tracking-wider uppercase text-charcoal hover:border-charcoal/20 hover:bg-charcoal/5 transition-colors cursor-pointer"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <Sparkles size={14} />
          Regenerate
        </motion.button>
      </div>
    </motion.div>
  );
}
