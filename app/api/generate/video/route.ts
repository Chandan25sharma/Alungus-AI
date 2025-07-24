import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const videoGenerationSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  duration: z.number().min(1).max(10).default(3), // seconds
  width: z.number().min(256).max(1024).default(768),
  height: z.number().min(256).max(1024).default(768),
  fps: z.number().min(8).max(24).default(8),
  motion_bucket_id: z.number().min(1).max(255).default(127),
  seed: z.number().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = videoGenerationSchema.parse(body)

    const apiToken = process.env.REPLICATE_API_TOKEN;
    if (!apiToken) {
      return NextResponse.json(
        { error: 'Replicate API token not configured' },
        { status: 500 }
      );
    }

    // Use Stable Video Diffusion model on Replicate
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: 'stable-video-diffusion-img2vid-xt-1-1',
        input: {
          image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', // 1x1 transparent pixel as placeholder
          video_length: validatedData.duration * validatedData.fps,
          sizing_strategy: 'maintain_aspect_ratio',
          frames_per_second: validatedData.fps,
          motion_bucket_id: validatedData.motion_bucket_id,
          cond_aug: 0.02,
          seed: validatedData.seed || Math.floor(Math.random() * 1000000),
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Replicate API error:', errorText);
      return NextResponse.json(
        { error: 'Video generation failed', details: errorText },
        { status: 500 }
      );
    }

    const result = await response.json();

    // Return prediction ID for polling
    return NextResponse.json({
      success: true,
      prediction_id: result.id,
      status: result.status,
      video_url: result.output?.[0] || null,
      metadata: {
        prompt: validatedData.prompt,
        settings: validatedData,
        generated_at: new Date().toISOString(),
        user_id: session.user.email || 'anonymous',
        provider: 'replicate',
        model: 'stable-video-diffusion'
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
