import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const imageGenerationSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  negative_prompt: z.string().optional(),
  width: z.number().min(256).max(2048).default(1024),
  height: z.number().min(256).max(2048).default(1024),
  steps: z.number().min(1).max(100).default(30),
  cfg_scale: z.number().min(1).max(30).default(7),
  seed: z.number().optional(),
  sampler: z.string().default('DPM++ 2M Karras'),
  model: z.string().default('sdxl'),
  style: z.enum(['anime', 'realistic', 'artistic', 'cinematic']).default('realistic'),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = imageGenerationSchema.parse(body)

    // Call to Google Colab Stable Diffusion endpoint
    const colabResponse = await fetch(`${process.env.COLAB_API_BASE_URL}/api/sd/txt2img`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.COLAB_API_TOKEN}`,
      },
      body: JSON.stringify({
        prompt: validatedData.prompt,
        negative_prompt: validatedData.negative_prompt || 'blurry, low quality, distorted',
        width: validatedData.width,
        height: validatedData.height,
        steps: validatedData.steps,
        cfg_scale: validatedData.cfg_scale,
        seed: validatedData.seed || -1,
        sampler_name: validatedData.sampler,
        model: validatedData.model,
        style_preset: validatedData.style,
      }),
    })

    if (!colabResponse.ok) {
      throw new Error(`Colab API error: ${colabResponse.statusText}`)
    }

    const result = await colabResponse.json()

    // Log generation for user history
    // TODO: Save to MongoDB with user ID, prompt, settings, result URL

    return NextResponse.json({
      success: true,
      image_url: result.image_url,
      generation_id: result.id,
      metadata: {
        prompt: validatedData.prompt,
        settings: validatedData,
        generated_at: new Date().toISOString(),
        user_id: session.user.id,
      }
    })

  } catch (error) {
    console.error('Image generation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    )
  }
}
