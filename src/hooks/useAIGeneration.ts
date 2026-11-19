'use client';

import { useState, useCallback, useRef } from 'react';

/* ── Types ─────────────────────────────────── */

export type OutputMode = 'image' | 'video' | 'presentation';

export type GenerationPhase =
  | 'idle'
  | 'reviewing'
  | 'generating'
  | 'complete'
  | 'error';

export interface GeneratedImage {
  data: string; // base64
  mimeType: string;
}

export interface PresentationSlide {
  title: string;
  content: string;
  type: string;
}

export interface GenerationResult {
  aiReview?: string;
  enhancedPrompt?: string;
  // Image output
  images?: GeneratedImage[];
  // Video output
  videoData?: string;
  videoMimeType?: string;
  // Presentation output
  presentationUrl?: string;
  exportUrl?: string;
  outline?: { title: string; subtitle: string; slides: PresentationSlide[] };
  slides?: number;
  gammaError?: string;
}

export interface GenerateParams {
  mode: OutputMode;
  prompt: string;
  imageBase64?: string;
  imageMimeType?: string;
  style?: string;
  aspectRatio?: string;
  lighting?: string;
  format?: string;
}

/* ── Hook ──────────────────────────────────── */

export function useAIGeneration() {
  const [phase, setPhase] = useState<GenerationPhase>('idle');
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  /* ── Main generate function ── */
  const generate = useCallback(async (params: GenerateParams) => {
    setPhase('reviewing');
    setResult(null);
    setError(null);
    setProgress('BaoBao AI is reviewing your design concept…');

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const endpoint = `/api/ai/generate-${params.mode}`;

      setPhase('generating');
      setProgress(
        params.mode === 'image'
          ? 'Generating photorealistic renders…'
          : params.mode === 'video'
            ? 'Rendering cinematic walkthrough… this may take a minute'
            : 'Crafting your presentation…',
      );

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: params.prompt,
          imageBase64: params.imageBase64,
          imageMimeType: params.imageMimeType,
          style: params.style,
          aspectRatio: params.aspectRatio,
          lighting: params.lighting,
          format: params.format,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.error || `Generation failed (${res.status})`);
      }

      const data: GenerationResult = await res.json();
      setResult(data);

      setPhase('complete');
      setProgress('');
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setPhase('error');
      setError(err.message || 'An unexpected error occurred');
      setProgress('');
    }
  }, []);

  /* ── Reset / Cancel ── */
  const reset = useCallback(() => {
    abortRef.current?.abort();
    setPhase('idle');
    setResult(null);
    setError(null);
    setProgress('');
  }, []);

  return {
    phase,
    result,
    error,
    progress,
    generate,
    reset,
    isGenerating: phase === 'reviewing' || phase === 'generating',
  };
}
