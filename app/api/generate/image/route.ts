import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const imageGenerationSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  negative_prompt: z.string().optional(),
  width: z.number().min(256).max(1024).default(512),
  height: z.number().min(256).max(1024).default(512),
  guidance_scale: z.number().min(1).max(20).default(7.5),
  num_inference_steps: z.number().min(1).max(50).default(20),
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

    const apiToken = process.env.HUGGINGFACE_API_TOKEN;
    if (!apiToken) {
      return NextResponse.json(
        { error: 'HuggingFace API token not configured' },
        { status: 500 }
      );
    }

    // Enhanced prompt based on style
    let enhancedPrompt = validatedData.prompt;
    const stylePrompts = {
      realistic: `photorealistic, highly detailed, professional photography, ${validatedData.prompt}`,
      anime: `anime style, manga illustration, detailed artwork, ${validatedData.prompt}`,
      artistic: `artistic painting, creative illustration, vibrant colors, ${validatedData.prompt}`,
      cinematic: `cinematic shot, dramatic lighting, film photography, ${validatedData.prompt}`,
    };
    enhancedPrompt = stylePrompts[validatedData.style] || validatedData.prompt;

    // Add negative prompt
    if (validatedData.negative_prompt) {
      enhancedPrompt += `. Negative: ${validatedData.negative_prompt}`;
    }

    // Use FLUX.1-dev model via HuggingFace Inference API
    const response = await fetch(
      'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: enhancedPrompt,
          parameters: {
            guidance_scale: validatedData.guidance_scale,
            num_inference_steps: validatedData.num_inference_steps,
            width: validatedData.width,
            height: validatedData.height,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HuggingFace API error:', errorText);
      return NextResponse.json(
        { error: 'Image generation failed', details: errorText },
        { status: 500 }
      );
    }

    // Get the image blob
    const imageBlob = await response.blob();
    const arrayBuffer = await imageBlob.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');

    return NextResponse.json({
      success: true,
      image_url: `data:image/png;base64,${base64Image}`,
      generation_id: `hf_${Date.now()}`,
      metadata: {
        prompt: enhancedPrompt,
        settings: validatedData,
        generated_at: new Date().toISOString(),
        user_id: session.user.email || 'anonymous',
        provider: 'huggingface',
        model: 'FLUX.1-dev'
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
