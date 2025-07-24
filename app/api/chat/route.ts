import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const chatSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  conversation_id: z.string().optional(),
  model: z.string().default('meta-llama/llama-3-8b-instruct:free'),
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

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      );
    }

    // Prepare messages array for OpenRouter
    const messages = [];
    
    if (validatedData.system_prompt) {
      messages.push({
        role: 'system',
        content: validatedData.system_prompt
      });
    }
    
    messages.push({
      role: 'user',
      content: validatedData.message
    });

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Alungus AI'
      },
      body: JSON.stringify({
        model: validatedData.model,
        messages: messages,
        temperature: validatedData.temperature,
        max_tokens: validatedData.max_tokens,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', errorText);
      return NextResponse.json(
        { error: 'Chat API failed', details: errorText },
        { status: 500 }
      );
    }

    const result = await response.json();
    const chatMessage = result.choices?.[0]?.message?.content || 'No response generated';

    return NextResponse.json({
      success: true,
      message: chatMessage,
      conversation_id: validatedData.conversation_id || `conv_${Date.now()}`,
      metadata: {
        model: validatedData.model,
        generated_at: new Date().toISOString(),
        user_id: session.user.email || 'anonymous',
        provider: 'openrouter',
        usage: result.usage
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
