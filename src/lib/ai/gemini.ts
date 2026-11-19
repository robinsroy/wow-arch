/* ═══════════════════════════════════════════
   BaoBao AI — Service Layer  (November 2026)
   ═══════════════════════════════════════════
   Uses:
     • Gemini 3.8 Flash  — chat, review, prompt enhancement
     • Nano Banana Pro (gemini-3-pro-image)
       — state-of-the-art image gen via generateContent
     • Gemini Omni 1.2 Flash — video generation via the Interactions API

   Server-only — never import from client components.
*/

import { GoogleGenAI, type GenerateContentResponse } from '@google/genai';
import { AI_CONFIG } from './config';
import {
  BAOBAO_SYSTEM_PROMPT,
  IMAGE_ENHANCEMENT_PROMPT,
  VIDEO_ENHANCEMENT_PROMPT,
  PRESENTATION_OUTLINE_PROMPT,
} from './system-prompt';

/* ── Singleton client ─────────────────────── */

let _client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!_client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');
    _client = new GoogleGenAI({ apiKey });
  }
  return _client;
}

function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY is not configured');
  return key;
}

/* ═══════════════════════════════════════════
   Chat / Review  (Gemini 3.8 Flash)
   ═══════════════════════════════════════════ */

/**
 * General-purpose BaoBao AI chat.
 * Supports optional inline image for multimodal queries.
 */
export async function chat(
  prompt: string,
  imageBase64?: string,
  imageMimeType?: string,
): Promise<string> {
  const ai = getClient();

  const parts: any[] = [{ text: prompt }];
  if (imageBase64 && imageMimeType) {
    parts.push({ inlineData: { mimeType: imageMimeType, data: imageBase64 } });
  }

  const result = await ai.models.generateContent({
    model: AI_CONFIG.models.chat,
    contents: [{ role: 'user', parts }],
    config: { systemInstruction: BAOBAO_SYSTEM_PROMPT },
  });

  return result.text ?? '';
}

/**
 * BaoBao AI reviews the user's design concept and returns
 * expert architectural feedback (2-4 paragraphs).
 */
export async function reviewPrompt(
  prompt: string,
  imageBase64?: string,
  imageMimeType?: string,
): Promise<string> {
  const ai = getClient();

  const parts: any[] = [
    {
      text: `Review the following architectural design request. Provide concise expert feedback — what's strong, what could be improved, and any suggestions to elevate the concept.\n\nUser request: "${prompt}"`,
    },
  ];
  if (imageBase64 && imageMimeType) {
    parts.push({ inlineData: { mimeType: imageMimeType, data: imageBase64 } });
  }

  const result = await ai.models.generateContent({
    model: AI_CONFIG.models.chat,
    contents: [{ role: 'user', parts }],
    config: { systemInstruction: BAOBAO_SYSTEM_PROMPT },
  });

  return result.text ?? '';
}

/* ═══════════════════════════════════════════
   Image Analysis  (Gemini 3.8 Flash)
   ═══════════════════════════════════════════ */

/**
 * Analyse an uploaded architectural image and return a
 * detailed text description suitable for downstream generation.
 */
export async function analyzeImage(
  imageBase64: string,
  imageMimeType: string,
): Promise<string> {
  const ai = getClient();

  const result = await ai.models.generateContent({
    model: AI_CONFIG.models.chat,
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: 'Analyse this architectural image in detail. Describe the architecture, style, materials, spatial qualities, lighting, colours, and notable design features. Use professional architectural terminology. Be specific and thorough.',
          },
          { inlineData: { mimeType: imageMimeType, data: imageBase64 } },
        ],
      },
    ],
    config: { systemInstruction: BAOBAO_SYSTEM_PROMPT },
  });

  return result.text ?? '';
}

/* ═══════════════════════════════════════════
   Prompt Enhancement  (Gemini 3.8 Flash)
   ═══════════════════════════════════════════ */

export async function enhancePromptForImage(
  userPrompt: string,
  style?: string,
  imageAnalysis?: string,
  lighting?: string,
): Promise<string> {
  const ai = getClient();

  let context = IMAGE_ENHANCEMENT_PROMPT;
  if (imageAnalysis) context += `\n\nReference image analysis:\n${imageAnalysis}`;
  if (style) context += `\n\nDesired architectural style: ${style}`;
  if (lighting) context += `\n\nLighting condition: ${lighting}`;
  context += `\n\nUser's request: "${userPrompt}"`;

  const result = await ai.models.generateContent({
    model: AI_CONFIG.models.chat,
    contents: context,
    config: { systemInstruction: BAOBAO_SYSTEM_PROMPT },
  });

  return result.text ?? userPrompt;
}

export async function enhancePromptForVideo(
  userPrompt: string,
  style?: string,
  imageAnalysis?: string,
): Promise<string> {
  const ai = getClient();

  let context = VIDEO_ENHANCEMENT_PROMPT;
  if (imageAnalysis) context += `\n\nReference image analysis:\n${imageAnalysis}`;
  if (style) context += `\n\nDesired architectural style: ${style}`;
  context += `\n\nUser's request: "${userPrompt}"`;

  const result = await ai.models.generateContent({
    model: AI_CONFIG.models.chat,
    contents: context,
    config: { systemInstruction: BAOBAO_SYSTEM_PROMPT },
  });

  return result.text ?? userPrompt;
}

/* ═══════════════════════════════════════════
   Image Generation  —  Nano Banana Pro
   ═══════════════════════════════════════════
   Uses gemini-3-pro-image (Nano Banana Pro) via
   generateContent endpoint with responseModalities: IMAGE.

   Model limits (per the March 2026 docs):
     • Max 14 input images
     • Output capped at 32 768 tokens
     • Supported aspect ratios: 1:1 3:2 2:3 3:4 4:3
       4:5 5:4 9:16 16:9 21:9
     • Max inline file: 7 MB
*/

export interface GeneratedImage {
  data: string; // base64
  mimeType: string;
}

/**
 * Generate architectural images using Gemini 3 Pro Image.
 *
 * @param prompt         Enhanced text prompt
 * @param count          Number of variations to request (1-4)
 * @param aspectRatio    One of the supported ratios
 * @param referenceImage Optional reference image (base64 + mime)
 */
export async function generateImages(
  prompt: string,
  count: number = AI_CONFIG.generation.maxImages,
  aspectRatio: string = AI_CONFIG.generation.defaultAspectRatio,
  referenceImage?: { base64: string; mimeType: string },
): Promise<GeneratedImage[]> {
  const ai = getClient();

  // Build the user content parts
  const parts: any[] = [];

  // If a reference image is provided, include it
  if (referenceImage) {
    parts.push({
      inlineData: {
        mimeType: referenceImage.mimeType,
        data: referenceImage.base64,
      },
    });
    parts.push({
      text: `Using the reference image above as inspiration, generate a high-quality photorealistic architectural render. ${prompt}. Output the image in ${aspectRatio} aspect ratio.`,
    });
  } else {
    parts.push({
      text: `Generate a high-quality photorealistic architectural render. ${prompt}. Output the image in ${aspectRatio} aspect ratio.`,
    });
  }

  // ── Collect images across multiple calls (Gemini 3 Pro Image
  //    typically outputs one image per generateContent call) ──
  const images: GeneratedImage[] = [];
  const totalCalls = Math.min(count, 4);

  for (let i = 0; i < totalCalls; i++) {
    try {
      // Add variation instruction for subsequent calls
      const callParts =
        i === 0
          ? parts
          : [
              ...parts,
              {
                text: `Create variation ${i + 1} — a different camera angle, perspective, or time of day while keeping the architectural concept consistent.`,
              },
            ];

      const result: GenerateContentResponse = await ai.models.generateContent({
        model: AI_CONFIG.models.image,
        contents: [{ role: 'user', parts: callParts }],
        config: {
          responseModalities: ['IMAGE', 'TEXT'],
        } as any,
      });

      // Extract images from the response
      const extracted = extractImagesFromResponse(result);
      images.push(...extracted);
    } catch (err: any) {
      console.warn(`[BaoBao AI] Image generation call ${i + 1} failed:`, err.message);
      // If the first call fails, throw — otherwise return partial results
      if (i === 0 && images.length === 0) throw err;
    }
  }

  if (images.length === 0) {
    throw new Error(
      'Image generation failed — Gemini 3 Pro Image returned no images. ' +
      `Please check your API key has access to ${AI_CONFIG.models.image}.`,
    );
  }

  return images;
}

/**
 * Extract base64 images from a Gemini generateContent response.
 */
function extractImagesFromResponse(result: GenerateContentResponse): GeneratedImage[] {
  const images: GeneratedImage[] = [];

  // Try the official SDK response structure
  const candidates = (result as any).candidates ?? [];
  for (const candidate of candidates) {
    const parts = candidate?.content?.parts ?? [];
    for (const part of parts) {
      if (part.inlineData?.data) {
        images.push({
          data: part.inlineData.data,
          mimeType: part.inlineData.mimeType ?? 'image/png',
        });
      }
    }
  }

  // Also check if the SDK exposes images at the top level
  if (images.length === 0) {
    const topParts = (result as any).parts ?? (result as any).content?.parts ?? [];
    for (const part of topParts) {
      if (part.inlineData?.data) {
        images.push({
          data: part.inlineData.data,
          mimeType: part.inlineData.mimeType ?? 'image/png',
        });
      }
    }
  }

  return images;
}

/* ═══════════════════════════════════════════
   Video Generation — Gemini Omni 1.2 Flash
   ═══════════════════════════════════════════
   Uses the Interactions API over REST:
     POST /v1beta/interactions — generates the video synchronously
     and returns it inline as base64.

   The docs recommend synchronous, unstored calls for Omni, so there
   is no operation to poll. REST is used instead of the SDK because
   the installed @google/genai (1.43) predates the `steps` response
   shape that Omni returns.

   Omni features: 3–15s, 16:9 or 9:16, native audio, image-to-video,
   first/last frame control, reference images, editing & extension.
*/

export interface GeneratedVideo {
  data: string; // base64
  mimeType: string;
}

/**
 * Generate an architectural walkthrough video with Gemini Omni Flash.
 * Blocks until the video is ready and returns it as base64.
 * An optional reference image is used as the opening frame.
 */
export async function generateVideo(
  prompt: string,
  imageBase64?: string,
  imageMimeType?: string,
): Promise<GeneratedVideo> {
  const input =
    imageBase64 && imageMimeType
      ? [
          { type: 'image', data: imageBase64, mime_type: imageMimeType },
          { type: 'text', text: prompt },
        ]
      : prompt;

  const res = await fetch(`${AI_CONFIG.api.gemini}/interactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': getApiKey(),
    },
    body: JSON.stringify({
      model: AI_CONFIG.models.video,
      input,
      store: false,
      response_format: {
        type: 'video',
        aspect_ratio: AI_CONFIG.generation.defaultAspectRatio,
        resolution: AI_CONFIG.generation.videoResolution,
        duration: `${AI_CONFIG.generation.videoDurationSeconds}s`,
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Video generation failed (${res.status}): ${body.slice(0, 500)}`);
  }

  const interaction: InteractionResponse = await res.json();
  const video = extractVideoFromInteraction(interaction);

  if (!video) {
    throw new Error(
      `Video generation returned no video (status: ${interaction.status ?? 'unknown'}). ` +
      'The prompt or reference image may have been blocked by safety filters.',
    );
  }

  return video;
}

/** The parts of the Interactions API REST response we read. */
interface InteractionResponse {
  status?: string;
  steps?: {
    type?: string;
    content?: { type?: string; data?: string; mime_type?: string }[];
  }[];
}

/**
 * Pull the base64 video out of an Interactions API response.
 * REST shape: steps[type=model_output].content[type=video].data
 */
function extractVideoFromInteraction(interaction: InteractionResponse): GeneratedVideo | undefined {
  const outputs = (interaction.steps ?? [])
    .filter((step) => step.type === 'model_output')
    .flatMap((step) => step.content ?? []);

  const video = outputs.find((item) => item.type === 'video' && item.data);
  return video?.data ? { data: video.data, mimeType: video.mime_type ?? 'video/mp4' } : undefined;
}

/* ═══════════════════════════════════════════
   Presentation Outline  (Gemini 3.8 Flash)
   ═══════════════════════════════════════════ */

export interface PresentationSlide {
  title: string;
  content: string;
  type: string;
}

export interface PresentationOutline {
  title: string;
  subtitle: string;
  slides: PresentationSlide[];
}

/**
 * Use Gemini to create a structured slide deck outline (JSON)
 * from the user's architectural concept.
 */
export async function generatePresentationOutline(
  userPrompt: string,
  style?: string,
  imageAnalysis?: string,
): Promise<PresentationOutline> {
  const ai = getClient();

  let context = PRESENTATION_OUTLINE_PROMPT;
  if (imageAnalysis) context += `\n\nReference image analysis:\n${imageAnalysis}`;
  if (style) context += `\n\nDesired style direction: ${style}`;
  context += `\n\nUser's concept: "${userPrompt}"`;

  const result = await ai.models.generateContent({
    model: AI_CONFIG.models.chat,
    contents: context,
    config: { systemInstruction: BAOBAO_SYSTEM_PROMPT },
  });

  const text = (result.text ?? '').trim();

  // Strip markdown code fences if present
  const jsonStr = text.replace(/^```json?\s*/i, '').replace(/```\s*$/i, '').trim();

  try {
    return JSON.parse(jsonStr) as PresentationOutline;
  } catch {
    // If JSON parsing fails, construct a minimal outline
    return {
      title: 'Design Presentation',
      subtitle: userPrompt.slice(0, 100),
      slides: [
        { title: 'Overview', content: text, type: 'content' },
      ],
    };
  }
}

/* ═══════════════════════════════════════════
   Gamma API — Presentation Generation
   ═══════════════════════════════════════════
   v1.0 endpoints:
     POST /v1.0/generations             — Generate from scratch
     POST /v1.0/generations/from-template — Create from a template
     GET  /v1.0/generations/:id          — Poll status

   If GAMMA_TEMPLATE_ID env-var is set, the from-template
   endpoint is used; otherwise a fresh generation is created.
*/

export interface GammaResult {
  url?: string;
  exportUrl?: string;
  id?: string;
}

/**
 * Send a structured outline to the Gamma public API and poll
 * until the presentation is ready (or timeout after ~100 s).
 */
export async function sendToGamma(
  outline: PresentationOutline,
  format: string = 'pptx',
): Promise<GammaResult> {
  const gammaKey = process.env.GAMMA_API_KEY;
  if (!gammaKey) {
    throw new Error(
      'GAMMA_API_KEY is not configured. Add GAMMA_API_KEY=sk-gamma-xxxx to your .env file. ' +
      'Get your key at https://gamma.app/developers',
    );
  }

  const templateId = (process.env.GAMMA_TEMPLATE_ID || '').trim();

  // Build a text representation of the outline
  const inputText = [
    `# ${outline.title}`,
    outline.subtitle,
    '',
    ...outline.slides.map(
      (s, i) => `## Slide ${i + 1}: ${s.title}\n${s.content}`,
    ),
  ].join('\n');

  // Gamma only supports "pdf" or "pptx" for exportAs
  const exportAs = format === 'pdf' ? 'pdf' : 'pptx';

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-API-KEY': gammaKey,
  };

  let generationId: string;

  if (templateId) {
    // ── Create from template ──
    const res = await fetch(
      `${AI_CONFIG.api.gamma}/v1.0/generations/from-template`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          gammaId: templateId,
          prompt: inputText,
          exportAs,
          imageOptions: {
            model: AI_CONFIG.models.gammaImage,
            style: 'photorealistic architectural visualization',
          },
        }),
      },
    );

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Gamma template API error (${res.status}): ${body}`);
    }

    const data = await res.json();
    generationId = data.id ?? data.generationId;
  } else {
    // ── Generate from scratch ──
    const res = await fetch(
      `${AI_CONFIG.api.gamma}/v1.0/generations`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          inputText,
          textMode: 'generate',
          format: 'presentation',
          numCards: outline.slides.length || 10,
          exportAs,
          imageOptions: {
            model: AI_CONFIG.models.gammaImage,
            style: 'photorealistic architectural visualization',
          },
        }),
      },
    );

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Gamma generate API error (${res.status}): ${body}`);
    }

    const data = await res.json();
    generationId = data.id ?? data.generationId;
  }

  if (!generationId) {
    throw new Error('Gamma API did not return a generation ID');
  }

  // ── Poll until completed (~5 s intervals, max 20 polls = ~100 s) ──
  const POLL_INTERVAL = 5_000;
  const MAX_POLLS = 20;

  for (let i = 0; i < MAX_POLLS; i++) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL));

    const pollRes = await fetch(
      `${AI_CONFIG.api.gamma}/v1.0/generations/${generationId}`,
      { headers: { 'X-API-KEY': gammaKey, accept: 'application/json' } },
    );

    if (!pollRes.ok) continue; // transient error — retry

    const poll = await pollRes.json();

    if (poll.status === 'completed' || poll.status === 'complete') {
      return {
        url: poll.url ?? poll.gammaUrl ?? poll.link,
        exportUrl: poll.exportUrl ?? poll.pdfUrl ?? poll.pptxUrl ?? poll.downloadUrl,
        id: generationId,
      };
    }

    if (poll.status === 'failed' || poll.status === 'error') {
      throw new Error(poll.error ?? poll.message ?? 'Gamma generation failed');
    }

    // still pending — continue polling
  }

  throw new Error('Gamma generation timed out (exceeded 100 s)');
}
