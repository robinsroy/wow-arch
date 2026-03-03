import { NextRequest, NextResponse } from 'next/server';
import { pollVideoOperation } from '@/lib/ai/gemini';

export const maxDuration = 60; // Allow extra time for video file download when done

export async function GET(req: NextRequest) {
  try {
    const operationName = req.nextUrl.searchParams.get('operation');

    if (!operationName) {
      return NextResponse.json(
        { error: 'Missing "operation" query parameter' },
        { status: 400 },
      );
    }

    const status = await pollVideoOperation(operationName);

    return NextResponse.json(status);
  } catch (error: any) {
    console.error('[BaoBao AI] Video status poll error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check video status' },
      { status: 500 },
    );
  }
}
