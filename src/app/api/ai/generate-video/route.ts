import { NextRequest, NextResponse } from 'next/server';
import {
  reviewPrompt,
  analyzeImage,
  enhancePromptForVideo,
  generateVideo,
} from '@/lib/ai/gemini';

// Gemini Omni generates the video synchronously within this request,
// so allow enough time for analysis + review + rendering.
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, imageBase64, imageMimeType, style } = body as {
      prompt?: string;
      imageBase64?: string;
      imageMimeType?: string;
      style?: string;
    };

    if (!prompt && !imageBase64) {
      return NextResponse.json(
        { error: 'A prompt or an uploaded image is required' },
        { status: 400 },
      );
    }

    const userPrompt =
      prompt || 'Generate a cinematic architectural walkthrough based on the uploaded reference image';

    // ── Steps 1 & 2: Analyse image + AI review in parallel ──
    const [imageAnalysis, aiReview] = await Promise.all([
      imageBase64 && imageMimeType
        ? analyzeImage(imageBase64, imageMimeType)
        : Promise.resolve(undefined),
      reviewPrompt(userPrompt, imageBase64, imageMimeType),
    ]);

    // ── Step 3: Enhance prompt for video ──
    const enhancedPrompt = await enhancePromptForVideo(userPrompt, style, imageAnalysis);

    // ── Step 4: Generate the video (Gemini Omni Flash) ──
    const video = await generateVideo(enhancedPrompt, imageBase64, imageMimeType);

    return NextResponse.json({
      aiReview,
      enhancedPrompt,
      videoData: video.data,
      videoMimeType: video.mimeType,
    });
  } catch (error: any) {
    console.error('[BaoBao AI] Video generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Video generation failed' },
      { status: 500 },
    );
  }
}
