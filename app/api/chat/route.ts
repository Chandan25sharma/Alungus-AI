import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const chatSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  conversation_id: z.string().optional(),
  model: z.string().default('llama3'),
  temperature: z.number().min(0).max(2).default(0.7),
  max_tokens: z.number().min(1).max(4000).default(1000),
  system_prompt: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = chatSchema.parse(body)

    // Try local Ollama first, fallback to Colab
    let response
    
    try {
      // Local Ollama endpoint
      response = await fetch(`${process.env.OLLAMA_ENDPOINT}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: validatedData.model,
          prompt: validatedData.message,
          system: validatedData.system_prompt,
          options: {
            temperature: validatedData.temperature,
            num_predict: validatedData.max_tokens,
          },
          stream: false,
        }),
      })
    } catch (error) {
      // Fallback to Colab Ollama
      response = await fetch(`${process.env.COLAB_API_BASE_URL}/api/ollama/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.COLAB_API_TOKEN}`,
        },
        body: JSON.stringify({
          message: validatedData.message,
          model: validatedData.model,
          temperature: validatedData.temperature,
          max_tokens: validatedData.max_tokens,
          system_prompt: validatedData.system_prompt,
        }),
      })
    }

    if (!response.ok) {
      throw new Error(`Chat API error: ${response.statusText}`)
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      message: result.response || result.message,
      conversation_id: validatedData.conversation_id || `conv_${Date.now()}`,
      metadata: {
        model: validatedData.model,
        generated_at: new Date().toISOString(),
        user_id: session.user.id,
      }
    })

  } catch (error) {
    console.error('Chat error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}
