// app/api/tts/sarvam/route.ts
import { NextRequest, NextResponse } from 'next/server';

const SARVAM_TTS_URL = 'https://api.sarvam.ai/text-to-speech';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'SARVAM_API_KEY not configured' },
        { status: 500 }
      );
    }

    const sarvamRes = await fetch(SARVAM_TTS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: 'bulbul:v1',
        speaker: 'vidya',      
        language: 'en-IN',
        format: 'wav',           
        sample_rate: 24000,
      }),
    });

    const contentType = sarvamRes.headers.get('content-type') || '';
    console.log('Sarvam status:', sarvamRes.status);
    console.log('Sarvam content-type:', contentType);

    if (!sarvamRes.ok) {
      const errText = await sarvamRes.text();
      console.error('Sarvam TTS error:', sarvamRes.status, errText);
      return NextResponse.json(
        { error: errText || `Sarvam TTS ${sarvamRes.status}` },
        { status: sarvamRes.status }
      );
    }

    // Sarvam returns JSON: { request_id: '...', audios: ['base64...', ...] }
    const json = await sarvamRes.json();
    if (!json.audios || !Array.isArray(json.audios) || !json.audios[0]) {
      console.error('No audios array in Sarvam JSON:', json);
      return NextResponse.json(
        { error: 'No audio data returned from Sarvam' },
        { status: 500 }
      );
    }

    const base64Audio: string = json.audios[0];
    const buffer = Buffer.from(base64Audio, 'base64');

    return new NextResponse(buffer, {
      headers: {
        // WAV works fine in browser audio; change to audio/mpeg if you request mp3
        'Content-Type': 'audio/wav',
        'Content-Length': buffer.byteLength.toString(),
      },
    });
  } catch (err: any) {
    console.error('Sarvam TTS route error:', err);
    return NextResponse.json(
      { error: err?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
