'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Image, Video, Music, Box, MessageSquare, Zap } from 'lucide-react'

const features = [
  {
    icon: Image,
    title: 'Image Generation',
    description: 'Create stunning images with Stable Diffusion SDXL. Text-to-image, image-to-image, and character generation.',
    features: ['Stable Diffusion SDXL', 'ControlNet Support', 'LoRA Models', 'Custom Styles']
  },
  {
    icon: Video,
    title: 'Video Creation',
    description: 'Generate animated videos and realistic scenes with AnimateDiff and ModelScope.',
    features: ['AnimateDiff', 'ModelScope T2V', 'Image-to-Video', 'Custom Motion']
  },
  {
    icon: Music,
    title: 'Audio Synthesis',
    description: 'Create voice synthesis and music with Bark TTS and MusicGen.',
    features: ['Bark TTS', 'Voice Cloning', 'MusicGen', 'Multi-language']
  },
  {
    icon: Box,
    title: '3D Modeling',
    description: 'Generate 3D characters, products, and objects from text descriptions.',
    features: ['Threestudio', 'Character Gen', 'Product Models', 'Multiple Formats']
  },
  {
    icon: MessageSquare,
    title: 'AI Assistant',
    description: 'Chat with intelligent AI powered by Ollama with LLaMA 3, Mistral, and more.',
    features: ['LLaMA 3', 'Mistral', 'Phi-3', 'Code Assistant']
  },
  {
    icon: Zap,
    title: 'Open Source',
    description: 'All models are open-source and can run locally or in Google Colab.',
    features: ['Local Hosting', 'Colab Support', 'No Vendor Lock-in', 'Full Control']
  }
]

export function Features() {
  return (
    <section className="py-24 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful AI <span className="gradient-text">Features</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to create amazing content with AI, all in one platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.features.map((item, i) => (
                    <li key={i} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
