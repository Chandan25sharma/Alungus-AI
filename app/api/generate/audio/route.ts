import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const audioGenerationSchema = z.object({
  text: z.string().min(1, 'Text is required'),
  type: z.enum(['tts', 'music']).default('tts'),
  voice: z.string().optional(), // For TTS: 'male', 'female', 'custom'
  voice_sample: z.string().optional(), // Base64 audio for voice cloning
  language: z.string().default('en'),
  speed: z.number().min(0.5).max(2.0).default(1.0),
  // Music generation specific
  genre: z.string().optional(), // 'pop', 'classical', 'electronic', etc.
  duration: z.number().min(5).max(120).default(30), // seconds
  bpm: z.number().min(60).max(200).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = audioGenerationSchema.parse(body)

    // Choose endpoint based on type
    const endpoint = validatedData.type === 'tts' 
      ? '/api/bark/generate'
      : '/api/musicgen/generate'

    const colabResponse = await fetch(`${process.env.COLAB_API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.COLAB_API_TOKEN}`,
      },
      body: JSON.stringify({
        text: validatedData.text,
        voice: validatedData.voice,
        voice_sample: validatedData.voice_sample,
        language: validatedData.language,
        speed: validatedData.speed,
        genre: validatedData.genre,
        duration: validatedData.duration,
        bpm: validatedData.bpm,
      }),
    })

    if (!colabResponse.ok) {
      throw new Error(`Colab API error: ${colabResponse.statusText}`)
    }

    const result = await colabResponse.json()

    return NextResponse.json({
      success: true,
      audio_url: result.audio_url,
      generation_id: result.id,
      metadata: {
        text: validatedData.text,
        type: validatedData.type,
        settings: validatedData,
        generated_at: new Date().toISOString(),
        user_id: session.user.id,
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
