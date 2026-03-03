'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  RotateCcw, ZoomIn, ZoomOut, Save, ChevronLeft, ChevronRight,
  Sun, Droplets, Leaf, Building2, Grid3X3, Layers, Eye, Sparkles,
  Download, ToggleLeft, ToggleRight, Star, Zap, SunDim, DollarSign,
  User, FileText, Share2, Settings, Maximize2, Move, Ruler, X, Loader2,
} from 'lucide-react';

/* ═══════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════ */

const BUILDING_IMAGES = [
  'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&q=90',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=90',
  'https://images.unsplash.com/photo-1431576901776-e539bd916ba2?w=1200&q=90',
  'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?w=1200&q=90',
];

const VIEW_TABS = ['3D View', 'Wireframe', 'Concept A', 'Concept B'] as const;
const NAV_TABS = ['Massing', 'Facade', 'Landscape', 'Interior'] as const;

type ViewTab = (typeof VIEW_TABS)[number];
type NavTab = (typeof NAV_TABS)[number];

interface SliderConfig {
  label: string;
  key: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  icon: React.ReactNode;
}

const SLIDER_CONFIGS: Record<NavTab, SliderConfig[]> = {
  Facade: [
    { label: 'Facade Depth', key: 'facadeDepth', min: 0.5, max: 5, step: 0.1, unit: 'm', icon: <Building2 size={14} /> },
    { label: 'Panel Rhythm', key: 'panelRhythm', min: 0.5, max: 3, step: 0.1, unit: 'm', icon: <Grid3X3 size={14} /> },
    { label: 'Balcony Size', key: 'balconySize', min: 0, max: 5, step: 0.1, unit: 'm', icon: <Layers size={14} /> },
    { label: 'Shading Angle', key: 'shadingAngle', min: 0, max: 90, step: 1, unit: '°', icon: <SunDim size={14} /> },
    { label: 'Glass Ratio', key: 'glassRatio', min: 10, max: 95, step: 1, unit: '%', icon: <Eye size={14} /> },
    { label: 'Greenery', key: 'greenery', min: 0, max: 80, step: 1, unit: '%', icon: <Leaf size={14} /> },
  ],
  Massing: [
    { label: 'Building Height', key: 'buildingHeight', min: 10, max: 200, step: 1, unit: 'm', icon: <Building2 size={14} /> },
    { label: 'Floor Count', key: 'floorCount', min: 1, max: 60, step: 1, unit: '', icon: <Layers size={14} /> },
    { label: 'Setback', key: 'setback', min: 0, max: 20, step: 0.5, unit: 'm', icon: <Grid3X3 size={14} /> },
    { label: 'Footprint W', key: 'footprintW', min: 10, max: 100, step: 1, unit: 'm', icon: <Building2 size={14} /> },
    { label: 'Footprint D', key: 'footprintD', min: 10, max: 100, step: 1, unit: 'm', icon: <Building2 size={14} /> },
    { label: 'Rotation', key: 'rotation', min: 0, max: 360, step: 1, unit: '°', icon: <RotateCcw size={14} /> },
  ],
  Landscape: [
    { label: 'Tree Coverage', key: 'treeCoverage', min: 0, max: 100, step: 1, unit: '%', icon: <Leaf size={14} /> },
    { label: 'Water Feature', key: 'waterFeature', min: 0, max: 100, step: 1, unit: '%', icon: <Droplets size={14} /> },
    { label: 'Path Width', key: 'pathWidth', min: 1, max: 10, step: 0.5, unit: 'm', icon: <Grid3X3 size={14} /> },
    { label: 'Lawn Area', key: 'lawnArea', min: 0, max: 100, step: 1, unit: '%', icon: <Leaf size={14} /> },
    { label: 'Elevation Rise', key: 'elevationRise', min: 0, max: 10, step: 0.5, unit: 'm', icon: <Layers size={14} /> },
    { label: 'Ambient Light', key: 'ambientLight', min: 0, max: 100, step: 1, unit: '%', icon: <Sun size={14} /> },
  ],
  Interior: [
    { label: 'Ceiling Height', key: 'ceilingHeight', min: 2.4, max: 6, step: 0.1, unit: 'm', icon: <Layers size={14} /> },
    { label: 'Open Plan', key: 'openPlan', min: 0, max: 100, step: 1, unit: '%', icon: <Grid3X3 size={14} /> },
    { label: 'Natural Light', key: 'naturalLight', min: 0, max: 100, step: 1, unit: '%', icon: <Sun size={14} /> },
    { label: 'Material Warm', key: 'materialWarmth', min: 0, max: 100, step: 1, unit: '%', icon: <Sparkles size={14} /> },
    { label: 'Partition %', key: 'partition', min: 0, max: 80, step: 1, unit: '%', icon: <Building2 size={14} /> },
    { label: 'Accent Color', key: 'accentColor', min: 0, max: 360, step: 1, unit: '°', icon: <Eye size={14} /> },
  ],
};

const DEFAULT_VALUES: Record<string, number> = {
  facadeDepth: 3.2, panelRhythm: 1.8, balconySize: 2.5, shadingAngle: 45, glassRatio: 65, greenery: 30,
  buildingHeight: 80, floorCount: 20, setback: 5, footprintW: 40, footprintD: 30, rotation: 0,
  treeCoverage: 40, waterFeature: 20, pathWidth: 3, lawnArea: 50, elevationRise: 2, ambientLight: 70,
  ceilingHeight: 3.2, openPlan: 60, naturalLight: 75, materialWarmth: 50, partition: 30, accentColor: 40,
};

const MATERIALS = [
  { name: 'Concrete', color: '#9E9E9E', gradient: 'linear-gradient(135deg, #B0B0B0 0%, #8A8A8A 40%, #6E6E6E 100%)', texture: 'repeating-conic-gradient(#9E9E9E 0% 25%, #8A8A8A 0% 50%) 0 0/6px 6px' },
  { name: 'Warm Oak', color: '#8B6914', gradient: 'linear-gradient(135deg, #C4923A 0%, #8B6914 40%, #6B4E0F 100%)', texture: 'repeating-linear-gradient(90deg, #8B6914 0px, #A07828 3px, #7C5C12 6px)' },
  { name: 'Brushed Steel', color: '#607D8B', gradient: 'linear-gradient(135deg, #90A4AE 0%, #607D8B 40%, #455A64 100%)', texture: 'repeating-linear-gradient(0deg, #607D8B 0px, #78909C 1px, #546E7A 2px)' },
  { name: 'Tinted Glass', color: '#B3E5FC', gradient: 'linear-gradient(135deg, #E1F5FE 0%, #B3E5FC 40%, #81D4FA 100%)', texture: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(179,229,252,0.6) 50%, rgba(129,212,250,0.3) 100%)' },
  { name: 'Limestone', color: '#BCAAA4', gradient: 'linear-gradient(135deg, #D7CCC8 0%, #BCAAA4 40%, #A1887F 100%)', texture: 'repeating-conic-gradient(#BCAAA4 0% 25%, #A69B95 0% 50%) 0 0/8px 8px' },
  { name: 'Dark Marble', color: '#37474F', gradient: 'linear-gradient(135deg, #546E7A 0%, #37474F 40%, #263238 100%)', texture: 'linear-gradient(135deg, #37474F 0%, #455A64 30%, #37474F 50%, #263238 100%)' },
];

/* ═══════════════════════════════════════════
   Configurator Page
   ═══════════════════════════════════════════ */

export default function ConfiguratorPage() {
  /* — State — */
  const [activeNav, setActiveNav] = useState<NavTab>('Facade');
  const [activeView, setActiveView] = useState<ViewTab>('3D View');
  const [values, setValues] = useState<Record<string, number>>(DEFAULT_VALUES);
  const [selectedImage, setSelectedImage] = useState(0);
  const [liveSimulation, setLiveSimulation] = useState(true);
  const [activeMaterial, setActiveMaterial] = useState(0);

  /* 3D transform state */
  const [rotateX, setRotateX] = useState(-8);
  const [rotateY, setRotateY] = useState(12);
  const [zoom, setZoom] = useState(1);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  /* carouselscroll */
  const carouselRef = useRef<HTMLDivElement>(null);

  /* Blueprint state */
  const [blueprintImage, setBlueprintImage] = useState<string | null>(null);
  const [blueprintLoading, setBlueprintLoading] = useState(false);
  const [showBlueprint, setShowBlueprint] = useState(false);

  /* — Derived metrics — */
  const sustainScore = Math.round(
    40 + (values.greenery ?? 30) * 0.3 + (values.glassRatio ?? 65) * 0.15 +
    (100 - (values.shadingAngle ?? 45)) * 0.12 + (values.treeCoverage ?? 40) * 0.1
  );
  const daylight = Math.min(99, Math.round(50 + (values.glassRatio ?? 65) * 0.45 + (values.naturalLight ?? 75) * 0.15));
  const energy = Math.max(10, Math.round(60 - (values.greenery ?? 30) * 0.4 - (100 - (values.glassRatio ?? 65)) * 0.15));
  const solarGain = Math.max(5, Math.round(50 - (values.shadingAngle ?? 45) * 0.5 + (values.glassRatio ?? 65) * 0.1));
  const costPerSqm = Math.round(1800 + (values.facadeDepth ?? 3.2) * 120 + (values.glassRatio ?? 65) * 5 + (values.greenery ?? 30) * 8);

  /* — Handlers — */
  const updateValue = useCallback((key: string, val: number) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  }, []);

  const resetValues = useCallback(() => {
    setValues(DEFAULT_VALUES);
    setRotateX(-8);
    setRotateY(12);
    setZoom(1);
  }, []);

  const aiOptimize = useCallback(() => {
    setValues({
      ...values,
      shadingAngle: 55,
      glassRatio: 72,
      greenery: 45,
      treeCoverage: 55,
      naturalLight: 85,
      balconySize: 3.2,
    });
  }, [values]);

  /* — Mouse drag for 3D — */
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    setRotateY((prev) => prev + dx * 0.3);
    setRotateX((prev) => Math.max(-40, Math.min(40, prev - dy * 0.3)));
    lastMouse.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  /* — Carousel scroll — */
  const scrollCarousel = (dir: number) => {
    carouselRef.current?.scrollBy({ left: dir * 220, behavior: 'smooth' });
  };

  /* — Blueprint generation via Nano Banana Pro — */
  const generateBlueprint = useCallback(async () => {
    if (blueprintLoading) return;
    setBlueprintLoading(true);
    setShowBlueprint(true);
    try {
      const imgUrl = BUILDING_IMAGES[selectedImage];
      const imgRes = await fetch(imgUrl);
      const blob = await imgRes.blob();
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(blob);
      });

      const res = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Transform this architectural photo into a precise technical blueprint drawing in Rhino 3D / AutoCAD style. Use a dark navy blue background (#001B36) with white and cyan technical line work. Show: orthographic elevations, section cuts, dimension lines with measurements in meters, grid lines labeled (A,B,C / 1,2,3), structural annotations, floor level marks, material hatching, scale bar, title block bottom-right, north arrow. Professional architectural construction document. Clean precise vector-like lines, no photorealism.',
          imageBase64: base64,
          imageMimeType: 'image/jpeg',
          style: 'Technical Blueprint',
          aspectRatio: '16:9',
        }),
      });

      if (!res.ok) throw new Error('Blueprint generation failed');
      const data = await res.json();

      if (data.images?.length > 0) {
        setBlueprintImage(`data:${data.images[0].mimeType};base64,${data.images[0].data}`);
      } else {
        throw new Error('No blueprint returned');
      }
    } catch (err) {
      console.error('Blueprint error:', err);
      setShowBlueprint(false);
    } finally {
      setBlueprintLoading(false);
    }
  }, [selectedImage, blueprintLoading]);

  /* — Image filter based on sliders — */
  const brightness = 0.6 + ((values.shadingAngle ?? 45) / 90) * 0.6;
  const contrast = 0.9 + ((values.glassRatio ?? 65) / 100) * 0.3;
  const saturate = 0.8 + ((values.greenery ?? 30) / 100) * 0.6;
  const hueRotate = values.accentColor ?? 0;

  const imageFilter =
    activeView === 'Wireframe'
      ? 'grayscale(1) contrast(2) brightness(0.3) invert(1)'
      : `brightness(${brightness.toFixed(2)}) contrast(${contrast.toFixed(2)}) saturate(${saturate.toFixed(2)}) hue-rotate(${hueRotate}deg)`;

  const imageOpacity = activeView === 'Wireframe' ? 0.7 : 1;

  /* — Keyboard zoom — */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '+' || e.key === '=') setZoom((z) => Math.min(2.5, z + 0.1));
      if (e.key === '-') setZoom((z) => Math.max(0.4, z - 0.1));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  /* ═══════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════ */

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white overflow-hidden select-none">
      {/* ── Top Bar ── */}
      <header className="relative z-50 flex items-center justify-between px-6 h-16 border-b border-white/[0.06] bg-[#111114]/90 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-1">
            <span className="font-heading text-xl font-bold text-white tracking-tight">W</span>
            <span className="font-heading text-xl font-bold text-[#C59B4A] tracking-tight">O</span>
            <span className="font-heading text-xl font-bold text-white tracking-tight">W</span>
            <span className="ml-2 text-xs font-medium tracking-[0.12em] text-white/50 uppercase">Architects</span>
          </Link>
          <div className="hidden md:flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-[11px] tracking-[0.1em] text-white/30 uppercase">
              Parametric Design Configurator
            </span>
          </div>
        </div>

        {/* Nav Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-white/[0.04] rounded-full p-1 border border-white/[0.06]">
          {NAV_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveNav(tab)}
              className={`px-5 py-2 text-[11px] font-medium tracking-[0.08em] uppercase rounded-full transition-all duration-300 ${
                activeNav === tab
                  ? 'bg-gradient-to-r from-[#C59B4A]/20 to-[#D4AF6A]/10 text-[#C59B4A] shadow-[0_0_12px_rgba(197,155,74,0.15)]'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-[11px] font-medium tracking-[0.08em] uppercase bg-white/[0.06] hover:bg-white/[0.1] rounded-lg border border-white/[0.06] transition-all hover:border-white/10">
            <Share2 size={13} /> Share
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-[11px] font-medium tracking-[0.08em] uppercase bg-white/[0.06] hover:bg-white/[0.1] rounded-lg border border-white/[0.06] transition-all hover:border-white/10">
            <Save size={13} /> Save
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C59B4A] to-[#8B6914] flex items-center justify-center text-[11px] font-bold shadow-lg shadow-[#C59B4A]/20">
            AW
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* ── LEFT PANEL — Design Controls ── */}
        <aside className="w-[340px] shrink-0 border-r border-white/[0.06] bg-[#111114]/80 backdrop-blur-sm flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
            <div>
              <h2 className="text-[12px] font-semibold tracking-[0.12em] uppercase text-white/90">
                Design Controls
              </h2>
              <p className="text-[10px] text-white/30 mt-0.5 tracking-wide">{SLIDER_CONFIGS[activeNav].length} parameters</p>
            </div>
            <button className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all">
              <Settings size={14} className="text-white/40" />
            </button>
          </div>

          {/* Sliders */}
          <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col scrollbar-thin">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeNav}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col justify-evenly"
              >
                {SLIDER_CONFIGS[activeNav].map((cfg) => (
                  <SliderControl
                    key={cfg.key}
                    config={cfg}
                    value={values[cfg.key] ?? 0}
                    onChange={(v) => updateValue(cfg.key, v)}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Quick Presets */}
          <div className="px-6 py-3 border-t border-white/[0.06]">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-white/50">Quick Presets</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Minimal', icon: '◻', preset: { facadeDepth: 1.5, glassRatio: 85, greenery: 10, shadingAngle: 30 } },
                { label: 'Green', icon: '◉', preset: { facadeDepth: 3.5, glassRatio: 55, greenery: 70, shadingAngle: 60, treeCoverage: 80 } },
                { label: 'Classic', icon: '◈', preset: { facadeDepth: 4.0, glassRatio: 40, greenery: 25, shadingAngle: 45 } },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() => setValues((prev) => ({ ...prev, ...p.preset }))}
                  className="py-2 text-[9px] font-semibold tracking-[0.08em] uppercase rounded-lg border border-white/[0.08] text-white/40 hover:text-[#C59B4A] hover:border-[#C59B4A]/30 transition-all hover:bg-[#C59B4A]/[0.05]"
                >
                  <span className="block text-sm mb-0.5 opacity-40">{p.icon}</span>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Shading Angle Curve Widget */}
          <div className="px-6 py-3 border-t border-white/[0.06]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-white/50">Shading Response</span>
              <span className="text-[10px] text-[#C59B4A] font-bold">{values.shadingAngle ?? 45}°</span>
            </div>
            <div className="relative h-16 bg-white/[0.03] rounded-xl border border-white/[0.06] overflow-hidden">
              <svg viewBox="0 0 200 60" className="w-full h-full" preserveAspectRatio="none">
                {/* Grid lines */}
                {[15, 30, 45].map((y) => (
                  <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="white" strokeWidth="0.3" strokeOpacity="0.06" />
                ))}
                {[40, 80, 120, 160].map((x) => (
                  <line key={x} x1={x} y1="0" x2={x} y2="60" stroke="white" strokeWidth="0.3" strokeOpacity="0.06" />
                ))}
                {/* Curve */}
                <path
                  d={`M 0 ${55 - ((values.shadingAngle ?? 45) / 90) * 45} Q 50 ${20 - ((values.shadingAngle ?? 45) / 90) * 15}, 100 ${30 - ((values.glassRatio ?? 65) / 100) * 20} T 200 ${50 - ((values.greenery ?? 30) / 80) * 35}`}
                  fill="none"
                  stroke="#C59B4A"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {/* Glow behind curve */}
                <path
                  d={`M 0 ${55 - ((values.shadingAngle ?? 45) / 90) * 45} Q 50 ${20 - ((values.shadingAngle ?? 45) / 90) * 15}, 100 ${30 - ((values.glassRatio ?? 65) / 100) * 20} T 200 ${50 - ((values.greenery ?? 30) / 80) * 35}`}
                  fill="none"
                  stroke="#C59B4A"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeOpacity="0.15"
                />
                {/* Control dots */}
                <circle cx="0" cy={55 - ((values.shadingAngle ?? 45) / 90) * 45} r="3" fill="#C59B4A" />
                <circle cx="100" cy={30 - ((values.glassRatio ?? 65) / 100) * 20} r="3" fill="#C59B4A" />
                <circle cx="200" cy={50 - ((values.greenery ?? 30) / 80) * 35} r="3" fill="#C59B4A" />
                {/* Dot glow */}
                <circle cx="0" cy={55 - ((values.shadingAngle ?? 45) / 90) * 45} r="6" fill="#C59B4A" fillOpacity="0.2" />
                <circle cx="100" cy={30 - ((values.glassRatio ?? 65) / 100) * 20} r="6" fill="#C59B4A" fillOpacity="0.2" />
                <circle cx="200" cy={50 - ((values.greenery ?? 30) / 80) * 35} r="6" fill="#C59B4A" fillOpacity="0.2" />
              </svg>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="px-6 pt-5 pb-6 border-t border-white/[0.06] space-y-3">
            <div className="flex gap-3">
              <button
                onClick={resetValues}
                className="flex-1 py-3 text-[11px] font-semibold tracking-[0.1em] uppercase rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all hover:bg-white/[0.04]"
              >
                Reset All
              </button>
              <button
                onClick={aiOptimize}
                className="flex-1 py-3 text-[11px] font-semibold tracking-[0.1em] uppercase rounded-xl bg-gradient-to-r from-[#C59B4A] to-[#D4AF6A] text-[#0D0D0F] hover:brightness-110 transition-all shadow-lg shadow-[#C59B4A]/20"
              >
                <span className="flex items-center justify-center gap-1.5">
                  <Sparkles size={13} /> AI Optimize
                </span>
              </button>
            </div>
            <p className="text-[9px] text-white/25 text-center tracking-wide">Adjust parameters above · AI Optimize for best performance</p>
          </div>
        </aside>

        {/* ── CENTER — 3D Viewport ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* View tabs */}
          <div className="flex items-center gap-3 px-6 py-3 border-b border-white/[0.06] bg-[#0E0E10]/50">
            <div className="flex items-center gap-1 bg-white/[0.04] rounded-full p-1 border border-white/[0.06]">
              {VIEW_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveView(tab)}
                  className={`px-4 py-1.5 text-[10px] font-medium tracking-[0.08em] uppercase rounded-full transition-all duration-300 ${
                    activeView === tab
                      ? 'bg-[#C59B4A]/20 text-[#C59B4A] border border-[#C59B4A]/30 shadow-[0_0_10px_rgba(197,155,74,0.1)]'
                      : 'text-white/40 hover:text-white/60'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-3">
              {/* Sun Position Indicator */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <Sun size={12} className="text-[#C59B4A]/60" />
                <span className="text-[10px] text-white/30 uppercase tracking-wider">Sun {values.shadingAngle ?? 45}°</span>
              </div>
              <div className="w-14 h-14 hidden lg:flex items-center justify-center">
                <svg viewBox="0 0 60 60" className="w-full h-full opacity-50">
                  <circle cx="30" cy="30" r="25" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="2 4" />
                  <circle cx="30" cy="30" r="18" fill="none" stroke="white" strokeWidth="0.3" strokeDasharray="2 4" />
                  <circle cx="30" cy="30" r="10" fill="none" stroke="white" strokeWidth="0.3" strokeDasharray="2 4" />
                  <line x1="30" y1="5" x2="30" y2="55" stroke="white" strokeWidth="0.2" />
                  <line x1="5" y1="30" x2="55" y2="30" stroke="white" strokeWidth="0.2" />
                  <circle
                    cx={30 + Math.cos(((values.shadingAngle ?? 45) * Math.PI) / 180) * 20}
                    cy={30 - Math.sin(((values.shadingAngle ?? 45) * Math.PI) / 180) * 20}
                    r="3"
                    fill="#C59B4A"
                  />
                  <circle
                    cx={30 + Math.cos(((values.shadingAngle ?? 45) * Math.PI) / 180) * 20}
                    cy={30 - Math.sin(((values.shadingAngle ?? 45) * Math.PI) / 180) * 20}
                    r="6"
                    fill="#C59B4A"
                    fillOpacity="0.2"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* 3D Viewport */}
          <div
            ref={containerRef}
            className="relative flex-1 overflow-hidden cursor-grab active:cursor-grabbing"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{ perspective: '1200px' }}
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#161619] via-[#0E0E10] to-[#0A0A0C]" />
            {/* Subtle grid */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }} />

            {/* The building image with 3D transforms */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                rotateX,
                rotateY,
                scale: zoom,
              }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Building Image */}
              <div className="relative w-full h-full">
                <img
                  src={BUILDING_IMAGES[selectedImage]}
                  alt="Building concept"
                  className="w-full h-full object-cover transition-all duration-700"
                  style={{
                    filter: imageFilter,
                    opacity: imageOpacity,
                  }}
                  draggable={false}
                />

                {/* Greenery overlay */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-green-900/40 to-transparent pointer-events-none transition-opacity duration-500"
                  style={{ opacity: (values.greenery ?? 30) / 200 }}
                />

                {/* Glass overlay shimmer */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-blue-300/10 via-transparent to-blue-400/5 pointer-events-none transition-opacity duration-500"
                  style={{ opacity: (values.glassRatio ?? 65) / 150 }}
                />

                {/* Wireframe grid overlay */}
                {activeView === 'Wireframe' && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage:
                        'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                      backgroundSize: '30px 30px',
                    }}
                  />
                )}

                {/* Concept overlays */}
                {activeView === 'Concept A' && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-600/20 to-transparent pointer-events-none" />
                )}
                {activeView === 'Concept B' && (
                  <div className="absolute inset-0 bg-gradient-to-tl from-sky-600/20 to-transparent pointer-events-none" />
                )}

                {/* Vignette */}
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,10,12,0.5) 100%)',
                }} />
              </div>
            </motion.div>

            {/* Info overlay — top left */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/[0.08]">
                <span className="text-[10px] text-white/50 uppercase tracking-wider">Concept {selectedImage + 1}</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/[0.08]">
                <span className="text-[10px] text-white/50 uppercase tracking-wider">{Math.round(zoom * 100)}%</span>
              </div>
            </div>

            {/* Blueprint overlay */}
            <AnimatePresence>
              {showBlueprint && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-30 bg-[#001B36] flex items-center justify-center"
                >
                  {blueprintLoading ? (
                    <div className="flex flex-col items-center gap-4">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                        <Loader2 size={32} className="text-cyan-400" />
                      </motion.div>
                      <div className="text-center">
                        <p className="text-cyan-300 text-sm font-medium tracking-wide">Generating Blueprint…</p>
                        <p className="text-cyan-500/50 text-[10px] mt-1 tracking-wider uppercase"> Rhino 3D Style</p>
                      </div>
                    </div>
                  ) : blueprintImage ? (
                    <img src={blueprintImage} alt="Blueprint" className="w-full h-full object-contain" draggable={false} />
                  ) : null}

                  <button
                    onClick={() => { setShowBlueprint(false); setBlueprintImage(null); }}
                    className="absolute top-4 right-4 z-40 p-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white/70 hover:text-white hover:bg-white/20 transition-all"
                  >
                    <X size={16} />
                  </button>

                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <div className="px-3 py-1.5 rounded-lg bg-cyan-500/20 backdrop-blur-md border border-cyan-400/30">
                      <span className="text-[10px] text-cyan-300 uppercase tracking-wider font-medium">Blueprint Mode</span>
                    </div>
                  </div>

                  {blueprintImage && (
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = blueprintImage!;
                        link.download = `blueprint-concept-${selectedImage + 1}.png`;
                        link.click();
                      }}
                      className="absolute bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/20 backdrop-blur-md border border-cyan-400/30 text-cyan-300 text-[10px] font-semibold tracking-wider uppercase hover:bg-cyan-500/30 transition-all"
                    >
                      <Download size={13} /> Download Blueprint
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* View controls — bottom center */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1.5 rounded-xl bg-black/50 backdrop-blur-xl border border-white/[0.08] z-20">
              <ViewControlButton icon={<Move size={13} />} label="Orbit" onClick={() => setRotateY((r) => r + 45)} />
              <ViewControlButton icon={<ZoomIn size={13} />} label="Zoom+" onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))} />
              <ViewControlButton icon={<ZoomOut size={13} />} label="Zoom−" onClick={() => setZoom((z) => Math.max(0.4, z - 0.2))} />
              <div className="w-px h-5 bg-white/10 mx-0.5" />
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={generateBlueprint}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[9px] font-semibold tracking-[0.08em] uppercase transition-all ${
                  showBlueprint
                    ? 'text-cyan-400 bg-cyan-500/20 border border-cyan-400/30'
                    : 'text-white/50 hover:text-cyan-400 hover:bg-white/[0.08]'
                }`}
              >
                <Ruler size={13} />
                <span className="hidden sm:inline">Blueprint</span>
              </motion.button>
              <div className="w-px h-5 bg-white/10 mx-0.5" />
              <ViewControlButton icon={<Maximize2 size={13} />} label="Fit" onClick={() => { setRotateX(-8); setRotateY(12); setZoom(1); }} />
              <ViewControlButton
                icon={<RotateCcw size={13} />}
                label="Reset"
                onClick={() => { setRotateX(-8); setRotateY(12); setZoom(1); }}
              />
            </div>
          </div>

          {/* ── Design Options Carousel ── */}
          <div className="relative h-[110px] border-t border-white/[0.06] bg-[#0E0E10]/60 flex items-center px-4">
            <button
              onClick={() => scrollCarousel(-1)}
              className="absolute left-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/[0.06] border border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.1] transition-all"
            >
              <ChevronLeft size={15} />
            </button>

            <div ref={carouselRef} className="flex gap-3 overflow-x-auto no-scrollbar px-10 scroll-smooth">
              {BUILDING_IMAGES.map((src, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedImage(i)}
                  className={`shrink-0 w-[140px] h-[80px] rounded-xl overflow-hidden border-2 transition-all duration-300 relative ${
                    selectedImage === i
                      ? 'border-[#C59B4A] shadow-[0_0_24px_rgba(197,155,74,0.25)]'
                      : 'border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  <img src={src} alt={`Concept ${i + 1}`} className="w-full h-full object-cover" draggable={false} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute bottom-1.5 left-2.5 text-[9px] font-medium tracking-wider text-white/70 uppercase">
                    Concept {i + 1}
                  </span>
                  {selectedImage === i && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#C59B4A] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>

            <button
              onClick={() => scrollCarousel(1)}
              className="absolute right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/[0.06] border border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.1] transition-all"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>

        {/* ── RIGHT PANEL — Performance Metrics ── */}
        <aside className="w-[320px] shrink-0 border-l border-white/[0.06] bg-[#111114]/80 backdrop-blur-sm flex flex-col overflow-hidden">
          {/* Generate Report CTA */}
          <div className="px-6 py-5 border-b border-white/[0.06]">
            <button className="w-full py-3.5 text-[11px] font-bold tracking-[0.12em] uppercase rounded-xl bg-gradient-to-r from-[#C59B4A] to-[#D4AF6A] text-[#0D0D0F] hover:brightness-110 transition-all shadow-lg shadow-[#C59B4A]/15 flex items-center justify-center gap-2">
              <FileText size={14} />
              Generate Report
            </button>
          </div>

          {/* Scrollable Metrics Area — uses justify-between to fill */}
          <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5 scrollbar-thin">
            {/* Score Gauge + Label */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-4">
                <ScoreGauge score={sustainScore} />
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-semibold text-white/85 leading-tight">Sustainability</p>
                  <p className="text-[10px] tracking-[0.1em] uppercase text-white/35 mt-1 mb-2">Overall Score</p>
                  <span className={`inline-block px-2.5 py-1 text-[9px] font-bold tracking-wider uppercase rounded-full ${
                    sustainScore >= 80
                      ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                      : sustainScore >= 60
                        ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20'
                        : 'bg-red-500/15 text-red-400 border border-red-500/20'
                  }`}>
                    {sustainScore >= 80 ? 'Excellent' : sustainScore >= 60 ? 'Good' : 'Needs Work'}
                  </span>
                </div>
              </div>
            </div>

            {/* Metric Rows */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/30 mb-2">Performance Metrics</h3>
              <MetricRow icon={<Star size={14} />} label="Daylight Factor" value={`${daylight}%`} barPercent={daylight} color="#C59B4A" />
              <MetricRow icon={<Zap size={14} />} label="Energy Efficiency" value={`${energy}%`} alert={energy > 40} barPercent={Math.min(100, energy)} color="#F87171" />
              <MetricRow icon={<Sun size={14} />} label="Solar Heat Gain" value={`${solarGain}%`} alert={solarGain > 35} barPercent={Math.min(100, solarGain)} color="#FACC15" />
            </div>

            {/* Cost + Simulation Row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Cost Estimate */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center gap-1.5 mb-2">
                  <DollarSign size={13} className="text-[#C59B4A]/50" />
                  <span className="text-[9px] font-semibold tracking-[0.1em] uppercase text-white/35">Cost</span>
                </div>
                <p className="text-xl font-heading font-bold text-white leading-tight">
                  ${costPerSqm.toLocaleString()}
                </p>
                <span className="text-[10px] text-white/25">/m²</span>
              </div>

              {/* Live Simulation */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center gap-1.5 mb-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${liveSimulation ? 'bg-green-400 animate-pulse shadow-[0_0_6px_rgba(74,222,128,0.4)]' : 'bg-white/20'}`} />
                  <span className="text-[9px] font-semibold tracking-[0.1em] uppercase text-white/35">Simulation</span>
                </div>
                <p className="text-[12px] font-semibold text-white/70 mb-2">{liveSimulation ? 'Active' : 'Paused'}</p>
                <button onClick={() => setLiveSimulation(!liveSimulation)}>
                  {liveSimulation ? (
                    <ToggleRight size={22} className="text-[#C59B4A]" />
                  ) : (
                    <ToggleLeft size={22} className="text-white/30" />
                  )}
                </button>
              </div>
            </div>

            {/* Material Palette */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/30">Material Palette</h4>
                <span className="text-[9px] text-[#C59B4A]/60 tracking-wider uppercase">{MATERIALS[activeMaterial].name}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {MATERIALS.map((mat, i) => (
                  <button
                    key={mat.name}
                    onClick={() => setActiveMaterial(i)}
                    className={`relative h-14 rounded-xl border-2 transition-all duration-300 overflow-hidden ${
                      activeMaterial === i
                        ? 'border-[#C59B4A] shadow-[0_0_10px_rgba(197,155,74,0.25)] scale-[1.04]'
                        : 'border-white/[0.06] hover:border-white/15'
                    }`}
                    style={{ background: mat.gradient }}
                    title={mat.name}
                  >
                    <div className="absolute inset-0 opacity-30" style={{ background: mat.texture }} />
                    <span className="absolute bottom-1 left-0 right-0 text-[7px] text-white/60 text-center font-medium tracking-wide uppercase">
                      {mat.name.split(' ')[0]}
                    </span>
                    {activeMaterial === i && (
                      <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#C59B4A] flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Design Summary */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2 mb-3">
                <Layers size={13} className="text-[#C59B4A]/50" />
                <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/35">Design Summary</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-white/45">Floor Area Ratio</span>
                  <span className="text-[12px] font-bold text-white tabular-nums">{((values.buildingHeight ?? 80) * (values.footprintW ?? 40) / 1000).toFixed(1)}</span>
                </div>
                <div className="w-full h-px bg-white/[0.05]" />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-white/45">Ventilation Score</span>
                  <span className="text-[12px] font-bold text-white tabular-nums">{Math.min(99, Math.round(30 + (values.openPlan ?? 60) * 0.4 + (values.naturalLight ?? 75) * 0.3))}%</span>
                </div>
                <div className="w-full h-px bg-white/[0.05]" />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-white/45">Gross Floor Area</span>
                  <span className="text-[12px] font-bold text-white tabular-nums">{((values.footprintW ?? 40) * (values.footprintD ?? 30) * (values.floorCount ?? 20)).toLocaleString()} m²</span>
                </div>
                <div className="w-full h-px bg-white/[0.05]" />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-white/45">Building Footprint</span>
                  <span className="text-[12px] font-bold text-white tabular-nums">{((values.footprintW ?? 40) * (values.footprintD ?? 30)).toLocaleString()} m²</span>
                </div>
                <div className="w-full h-px bg-white/[0.05]" />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-white/45">Facade Surface</span>
                  <span className="text-[12px] font-bold text-white tabular-nums">{(2 * ((values.footprintW ?? 40) + (values.footprintD ?? 30)) * (values.buildingHeight ?? 80)).toLocaleString()} m²</span>
                </div>
              </div>
            </div>

            {/* Environmental Rating */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2 mb-3">
                <Leaf size={13} className="text-green-400/50" />
                <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/35">Environmental</span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                {['A', 'B', 'C', 'D', 'E'].map((grade) => {
                  const current = sustainScore >= 85 ? 'A' : sustainScore >= 70 ? 'B' : sustainScore >= 55 ? 'C' : sustainScore >= 40 ? 'D' : 'E';
                  const isActive = grade === current;
                  const colors: Record<string, string> = { A: '#4ADE80', B: '#86EFAC', C: '#FACC15', D: '#FB923C', E: '#F87171' };
                  return (
                    <div
                      key={grade}
                      className={`flex-1 py-2 text-center rounded-lg text-[11px] font-bold tracking-wider transition-all ${
                        isActive
                          ? 'border-2 scale-110 shadow-lg'
                          : 'border border-white/[0.06] text-white/20'
                      }`}
                      style={isActive ? { borderColor: colors[grade], color: colors[grade], boxShadow: `0 0 12px ${colors[grade]}30` } : undefined}
                    >
                      {grade}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/35">CO₂ Reduction Est.</span>
                <span className="text-[11px] font-bold text-green-400 tabular-nums">-{Math.round(sustainScore * 0.6)}%</span>
              </div>
            </div>
          </div>

          {/* Export Footer */}
          <div className="px-6 py-5 border-t border-white/[0.06] space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <button className="py-2.5 text-[9px] font-semibold tracking-[0.08em] uppercase rounded-lg border border-white/[0.08] text-white/40 hover:text-white hover:border-white/15 transition-all hover:bg-white/[0.04]">
                DWG
              </button>
              <button className="py-2.5 text-[9px] font-semibold tracking-[0.08em] uppercase rounded-lg border border-white/[0.08] text-white/40 hover:text-white hover:border-white/15 transition-all hover:bg-white/[0.04]">
                3D
              </button>
              <button className="py-2.5 text-[9px] font-semibold tracking-[0.08em] uppercase rounded-lg border border-white/[0.08] text-white/40 hover:text-white hover:border-white/15 transition-all hover:bg-white/[0.04]">
                IFC
              </button>
            </div>
            <button className="w-full py-3.5 flex items-center justify-center gap-2 text-[11px] font-bold tracking-[0.12em] uppercase rounded-xl bg-gradient-to-r from-[#C45A3C] to-[#E47A5E] text-white transition-all shadow-lg shadow-[#C45A3C]/15 hover:brightness-110">
              <Download size={14} /> Export PDF
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Sub-Components
   ═══════════════════════════════════════════ */

function SliderControl({
  config,
  value,
  onChange,
}: {
  config: SliderConfig;
  value: number;
  onChange: (v: number) => void;
}) {
  const percentage = ((value - config.min) / (config.max - config.min)) * 100;

  return (
    <div className="group py-3 px-4 rounded-xl hover:bg-white/[0.02] transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-white/25 group-hover:text-[#C59B4A]/70 transition-colors duration-300">{config.icon}</span>
          <span className="text-[11px] font-medium text-white/50 group-hover:text-white/80 transition-colors duration-300">
            {config.label}
          </span>
        </div>
        <div className="flex items-center gap-1 bg-white/[0.04] rounded-md px-2 py-0.5">
          <span className="text-[12px] font-bold text-[#C59B4A] tabular-nums">
            {Number.isInteger(value) ? value : value.toFixed(1)}
          </span>
          <span className="text-[9px] text-white/25">{config.unit}</span>
        </div>
      </div>

      <div className="relative h-[6px] bg-white/[0.05] rounded-full overflow-visible">
        {/* Track fill */}
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#C59B4A]/50 to-[#C59B4A] rounded-full transition-all duration-100"
          style={{ width: `${percentage}%` }}
        />
        {/* Glow behind track */}
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#C59B4A]/0 to-[#C59B4A]/20 rounded-full blur-sm transition-all duration-100"
          style={{ width: `${percentage}%` }}
        />
        <input
          type="range"
          min={config.min}
          max={config.max}
          step={config.step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
        {/* Thumb indicator with glow */}
        <div
          className="absolute top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-100"
          style={{ left: `calc(${percentage}% - 7px)` }}
        >
          <div className="w-3.5 h-3.5 rounded-full bg-[#C59B4A] border-2 border-[#0A0A0C] shadow-[0_0_10px_rgba(197,155,74,0.5)]" />
        </div>
      </div>
    </div>
  );
}

function ViewControlButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[9px] font-semibold tracking-[0.08em] uppercase text-white/50 hover:text-white hover:bg-white/[0.08] transition-all"
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </motion.button>
  );
}

function ScoreGauge({ score }: { score: number }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#4ADE80' : score >= 60 ? '#FACC15' : '#F87171';

  return (
    <div className="relative w-[80px] h-[80px]">
      <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
        <circle cx="40" cy="40" r={radius} fill="none" stroke="white" strokeWidth="3" strokeOpacity="0.05" />
        <motion.circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        {/* Glow ring */}
        <motion.circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeOpacity="0.1"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white leading-none tabular-nums">{score}</span>
        <span className="text-[8px] text-white/30 mt-0.5">/100</span>
      </div>
    </div>
  );
}

function MetricRow({
  icon,
  label,
  value,
  alert,
  barPercent,
  color = '#C59B4A',
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  alert?: boolean;
  barPercent?: number;
  color?: string;
}) {
  return (
    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-white/25">{icon}</span>
          <span className="text-[11px] text-white/50">{label}</span>
        </div>
        <span className={`text-sm font-bold tabular-nums ${alert ? 'text-red-400' : 'text-white'}`}>
          {value}
          {alert && <span className="text-[9px] ml-0.5 text-red-400">▲</span>}
        </span>
      </div>
      {barPercent !== undefined && (
        <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: alert ? '#F87171' : color }}
            initial={{ width: 0 }}
            animate={{ width: `${barPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      )}
    </div>
  );
}
