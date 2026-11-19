/* ═══════════════════════════════════════════
   AI Service Configuration  —  November 2026
   ═══════════════════════════════════════════ */

export const AI_CONFIG = {
  /** Model identifiers */
  models: {
    /** Gemini 3.8 Flash — chat, review, prompt enhancement (fast & cheap) */
    chat: 'gemini-3.8-flash',
    /**
     * Nano Banana Pro  (Gemini 3 Pro Image, stable)
     * State-of-the-art image generation via generateContent.
     * Inputs: Text + Images  |  Outputs: Text + Images
     * Max input images: 14  |  Max output: 32 768 tokens
     */
    image: 'gemini-3-pro-image',
    /**
     * Gemini Omni 1.2 Flash — video generation via the Interactions API.
     * 3–15s, 360p/720p (1080p/4K upscaled), 16:9 or 9:16.
     * Replaces Veo 3.1, which was shut down on 22 Oct 2026.
     */
    video: 'gemini-omni-1.2-flash',
    /** Image model Gamma uses for AI-generated slide images (Nano Banana Pro) */
    gammaImage: 'gemini-3-pro-image',
  },

  /** Generation defaults */
  generation: {
    /** Max images per prompt (limited by 32 768 output tokens) */
    maxImages: 4,
    defaultAspectRatio: '16:9' as const,
    videoDurationSeconds: 8,
    /** 720p keeps the video under the 4 MB inline-response limit */
    videoResolution: '720p' as const,
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
