import { NextRequest, NextResponse } from 'next/server';
import {
  reviewPrompt,
  analyzeImage,
  enhancePromptForVideo,
  startVideoGeneration,
} from '@/lib/ai/gemini';

export const maxDuration = 60;

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

    // ── Step 1: Analyse uploaded image (if any) ──
    let imageAnalysis: string | undefined;
    if (imageBase64 && imageMimeType) {
      imageAnalysis = await analyzeImage(imageBase64, imageMimeType);
    }

    // ── Step 2: BaoBao AI review ──
    const aiReview = await reviewPrompt(userPrompt, imageBase64, imageMimeType);

    // ── Step 3: Enhance prompt for Veo ──
    const enhancedPrompt = await enhancePromptForVideo(userPrompt, style, imageAnalysis);

    // ── Step 4: Start Veo 3.1 generation ──
    const operation = await startVideoGeneration(
      enhancedPrompt,
      imageBase64,
      imageMimeType,
    );

    // If the operation completed immediately (unlikely but possible)
    if (operation.done && (operation.videoUri || operation.videoData)) {
      return NextResponse.json({
        aiReview,
        enhancedPrompt,
        done: true,
        videoUri: operation.videoUri,
        videoData: operation.videoData,
        mimeType: operation.mimeType,
      });
    }

    // Return operation name for polling
    return NextResponse.json({
      aiReview,
      enhancedPrompt,
      done: false,
      operationName: operation.operationName,
    });
  } catch (error: any) {
    console.error('[BaoBao AI] Video generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Video generation failed' },
      { status: 500 },
    );
  }
}
