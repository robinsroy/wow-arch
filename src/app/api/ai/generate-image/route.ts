import { NextRequest, NextResponse } from 'next/server';
import {
  reviewPrompt,
  analyzeImage,
  enhancePromptForImage,
  generateImages,
} from '@/lib/ai/gemini';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      prompt,
      imageBase64,
      imageMimeType,
      style,
      aspectRatio,
      lighting,
    } = body as {
      prompt?: string;
      imageBase64?: string;
      imageMimeType?: string;
      style?: string;
      aspectRatio?: string;
      lighting?: string;
    };

    if (!prompt && !imageBase64) {
      return NextResponse.json(
        { error: 'A prompt or an uploaded image is required' },
        { status: 400 },
      );
    }

    const userPrompt = prompt || 'Generate a photorealistic architectural visualization based on the uploaded reference image';

    // ── Step 1: Analyse uploaded image (if any) ──
    let imageAnalysis: string | undefined;
    if (imageBase64 && imageMimeType) {
      imageAnalysis = await analyzeImage(imageBase64, imageMimeType);
    }

    // ── Step 2: BaoBao AI review ──
    const aiReview = await reviewPrompt(userPrompt, imageBase64, imageMimeType);

    // ── Step 3: Enhance prompt for Imagen ──
    const enhancedPrompt = await enhancePromptForImage(
      userPrompt,
      style,
      imageAnalysis,
      lighting,
    );

    // ── Step 4: Generate images via Gemini 3 Pro Image ──
    const referenceImage =
      imageBase64 && imageMimeType
        ? { base64: imageBase64, mimeType: imageMimeType }
        : undefined;

    const images = await generateImages(
      enhancedPrompt,
      4,
      aspectRatio || '16:9',
      referenceImage,
    );

    return NextResponse.json({ aiReview, images, enhancedPrompt });
  } catch (error: any) {
    console.error('[BaoBao AI] Image generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Image generation failed' },
      { status: 500 },
    );
  }
}
