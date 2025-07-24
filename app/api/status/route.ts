import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check which API keys are configured
    const apiStatus = {
      huggingface: !!process.env.HUGGINGFACE_API_TOKEN,
      openrouter: !!process.env.OPENROUTER_API_KEY,
      replicate: !!process.env.REPLICATE_API_TOKEN,
      elevenlabs: !!process.env.ELEVENLABS_API_KEY,
    }

    const availableServices = Object.entries(apiStatus)
      .filter(([_, configured]) => configured)
      .map(([service]) => service)

    return NextResponse.json({
      success: true,
      services: apiStatus,
      available_services: availableServices,
      total_configured: availableServices.length,
      features: {
        image_generation: apiStatus.huggingface,
        chat: apiStatus.openrouter,
        video_generation: apiStatus.replicate,
        audio_generation: apiStatus.elevenlabs,
      }
    })

  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    )
  }
}
