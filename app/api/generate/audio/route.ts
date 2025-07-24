import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const audioGenerationSchema = z.object({
  text: z.string().min(1, 'Text is required'),
  voice_id: z.string().default('21m00Tcm4TlvDq8ikWAM'), // Default ElevenLabs voice
  model_id: z.string().default('eleven_monolingual_v1'),
  voice_settings: z.object({
    stability: z.number().min(0).max(1).default(0.5),
    similarity_boost: z.number().min(0).max(1).default(0.5),
    style: z.number().min(0).max(1).default(0),
    use_speaker_boost: z.boolean().default(true)
  }).optional()
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = audioGenerationSchema.parse(body)

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      );
    }

    // Call ElevenLabs Text-to-Speech API
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${validatedData.voice_id}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: validatedData.text,
          model_id: validatedData.model_id,
          voice_settings: validatedData.voice_settings || {
            stability: 0.5,
            similarity_boost: 0.5,
            style: 0,
            use_speaker_boost: true
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', errorText);
      return NextResponse.json(
        { error: 'Audio generation failed', details: errorText },
        { status: 500 }
      );
    }

    // Get the audio blob
    const audioBlob = await response.blob();
    const arrayBuffer = await audioBlob.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');

    return NextResponse.json({
      success: true,
      audio_url: `data:audio/mpeg;base64,${base64Audio}`,
      generation_id: `el_${Date.now()}`,
      metadata: {
        text: validatedData.text,
        voice_id: validatedData.voice_id,
        model_id: validatedData.model_id,
        generated_at: new Date().toISOString(),
        user_id: session.user.email || 'anonymous',
        provider: 'elevenlabs'
      }
    })

  } catch (error) {
    console.error('Audio generation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to generate audio' },
      { status: 500 }
    )
  }
}
