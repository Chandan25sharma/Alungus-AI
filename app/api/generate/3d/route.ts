import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const threeDGenerationSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  type: z.enum(['character', 'product', 'object']).default('object'),
  style: z.enum(['realistic', 'stylized', 'low_poly']).default('realistic'),
  complexity: z.enum(['simple', 'medium', 'detailed']).default('medium'),
  base_image: z.string().optional(), // For image-to-3D
  reference_images: z.array(z.string()).optional(), // Multiple reference angles
  output_format: z.enum(['glb', 'obj', 'gltf']).default('glb'),
  texture_quality: z.enum(['low', 'medium', 'high']).default('medium'),
  polycount: z.enum(['low', 'medium', 'high']).default('medium'),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = threeDGenerationSchema.parse(body)

    // Choose endpoint based on type
    const endpoint = validatedData.type === 'character' 
      ? '/api/threestudio/character'
      : '/api/threestudio/object'

    const colabResponse = await fetch(`${process.env.COLAB_API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.COLAB_API_TOKEN}`,
      },
      body: JSON.stringify({
        prompt: validatedData.prompt,
        type: validatedData.type,
        style: validatedData.style,
        complexity: validatedData.complexity,
        base_image: validatedData.base_image,
        reference_images: validatedData.reference_images,
        output_format: validatedData.output_format,
        texture_quality: validatedData.texture_quality,
        polycount: validatedData.polycount,
      }),
    })

    if (!colabResponse.ok) {
      throw new Error(`Colab API error: ${colabResponse.statusText}`)
    }

    const result = await colabResponse.json()

    return NextResponse.json({
      success: true,
      model_url: result.model_url,
      preview_url: result.preview_url,
      generation_id: result.id,
      metadata: {
        prompt: validatedData.prompt,
        settings: validatedData,
        generated_at: new Date().toISOString(),
        user_id: session.user.email || 'anonymous',
      }
    })

  } catch (error) {
    console.error('3D generation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to generate 3D model' },
      { status: 500 }
    )
  }
}
