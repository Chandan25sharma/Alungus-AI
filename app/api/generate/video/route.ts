import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const videoGenerationSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  duration: z.number().min(1).max(10).default(3), // seconds
  fps: z.number().min(12).max(30).default(24),
  width: z.number().min(256).max(1024).default(512),
  height: z.number().min(256).max(1024).default(512),
  motion_strength: z.number().min(0).max(1).default(0.7),
  seed: z.number().optional(),
  type: z.enum(['animation', 'realistic']).default('animation'),
  base_image: z.string().optional(), // URL or base64 for img2video
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = videoGenerationSchema.parse(body)

    // Choose endpoint based on type
    const endpoint = validatedData.type === 'animation' 
      ? '/api/animatediff/generate'
      : '/api/modelscope/generate'

    const colabResponse = await fetch(`${process.env.COLAB_API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.COLAB_API_TOKEN}`,
      },
      body: JSON.stringify({
        prompt: validatedData.prompt,
        duration: validatedData.duration,
        fps: validatedData.fps,
        width: validatedData.width,
        height: validatedData.height,
        motion_strength: validatedData.motion_strength,
        seed: validatedData.seed || -1,
        base_image: validatedData.base_image,
      }),
    })

    if (!colabResponse.ok) {
      throw new Error(`Colab API error: ${colabResponse.statusText}`)
    }

    const result = await colabResponse.json()

    return NextResponse.json({
      success: true,
      video_url: result.video_url,
      generation_id: result.id,
      metadata: {
        prompt: validatedData.prompt,
        settings: validatedData,
        generated_at: new Date().toISOString(),
        user_id: session.user.id,
      }
    })

  } catch (error) {
    console.error('Video generation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to generate video' },
      { status: 500 }
    )
  }
}
