import { NextRequest, NextResponse } from 'next/server';
import { chat } from '@/lib/ai/gemini';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { prompt, imageBase64, imageMimeType } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const reply = await chat(prompt, imageBase64, imageMimeType);

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('[BaoBao AI] Chat error:', error);
    return NextResponse.json(
      { error: error.message || 'Chat failed' },
      { status: 500 },
    );
  }
}
