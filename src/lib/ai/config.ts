/* ═══════════════════════════════════════════
   AI Service Configuration  —  March 2026
   ═══════════════════════════════════════════ */

export const AI_CONFIG = {
  /** Model identifiers */
  models: {
    /** Gemini 2.0 Flash — chat, review, prompt enhancement (fast & cheap) */
    chat: 'gemini-2.0-flash',
    /**
     * Nano Banana Pro  (Gemini 3 Pro Image Preview)
     * State-of-the-art image generation via generateContent.
     * Inputs: Text + Images  |  Outputs: Text + Images
     * Max input images: 14  |  Max output: 32 768 tokens
     */
    image: 'gemini-3-pro-image-preview',
    /**
     * Veo 3.1 — video generation via SDK generateVideos.
     * 8s 720p/1080p/4K, native audio, portrait & landscape.
     */
    video: 'veo-3.1-generate-preview',
  },

  /** Generation defaults */
  generation: {
    /** Max images per prompt (limited by 32 768 output tokens) */
    maxImages: 4,
    defaultAspectRatio: '16:9' as const,
    videoDurationSeconds: 8,
    videoPollIntervalMs: 10_000,
    maxVideoPolls: 60, // ~10 min ceiling
  },

  /** Gemini 3 Pro Image constraints */
  imageModel: {
    maxInputImages: 14,
    maxInputTokens: 65_536,
    maxOutputTokens: 32_768,
    maxFileSizeInline: 7, // MB
    supportedMimeTypes: [
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/heic',
      'image/heif',
    ] as const,
    supportedAspectRatios: [
      '1:1', '3:2', '2:3', '3:4', '4:3',
      '4:5', '5:4', '9:16', '16:9', '21:9',
    ] as const,
  },

  /** API base URLs */
  api: {
    gemini: 'https://generativelanguage.googleapis.com/v1beta',
    gamma: 'https://public-api.gamma.app',
  },
} as const;

export type AspectRatio =
  | '1:1' | '3:2' | '2:3' | '3:4' | '4:3'
  | '4:5' | '5:4' | '9:16' | '16:9' | '21:9';
export type LightingMode = 'day' | 'night' | 'golden';
export type PresentationFormat = 'pptx' | 'pdf' | 'keynote';
