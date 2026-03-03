import { NextRequest, NextResponse } from 'next/server';
import {
  reviewPrompt,
  analyzeImage,
  generatePresentationOutline,
  sendToGamma,
} from '@/lib/ai/gemini';

export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, imageBase64, imageMimeType, style, format } = body as {
      prompt?: string;
      imageBase64?: string;
      imageMimeType?: string;
      style?: string;
      format?: string;
    };

    if (!prompt && !imageBase64) {
      return NextResponse.json(
        { error: 'A prompt or an uploaded image is required' },
        { status: 400 },
      );
    }

    const userPrompt =
      prompt || 'Create a professional design presentation based on the uploaded reference image';

    // ── Step 1: Analyse uploaded image (if any) ──
    let imageAnalysis: string | undefined;
    if (imageBase64 && imageMimeType) {
      imageAnalysis = await analyzeImage(imageBase64, imageMimeType);
    }

    // ── Step 2: BaoBao AI review ──
    const aiReview = await reviewPrompt(userPrompt, imageBase64, imageMimeType);

    // ── Step 3: Generate structured outline via Gemini ──
    const outline = await generatePresentationOutline(userPrompt, style, imageAnalysis);

    // ── Step 4: Send to Gamma for visual presentation ──
    let gammaResult;
    try {
      gammaResult = await sendToGamma(outline, format || 'pptx');
    } catch (gammaError: any) {
      // Gamma may not be configured — return outline so the user still gets value
      console.warn('[BaoBao AI] Gamma API failed, returning outline only:', gammaError.message);
      return NextResponse.json({
        aiReview,
        outline,
        slides: outline.slides.length,
        gammaError: gammaError.message,
      });
    }

    return NextResponse.json({
      aiReview,
      outline,
      slides: outline.slides.length,
      presentationUrl: gammaResult.url,
      exportUrl: gammaResult.exportUrl,
      presentationId: gammaResult.id,
    });
  } catch (error: any) {
    console.error('[BaoBao AI] Presentation generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Presentation generation failed' },
      { status: 500 },
    );
  }
}
