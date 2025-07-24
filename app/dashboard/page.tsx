'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageGenerator } from '@/components/generators/image-generator'
import { VideoGenerator } from '@/components/generators/video-generator'
import { AudioGenerator } from '@/components/generators/audio-generator'
import { ThreeDGenerator } from '@/components/generators/3d-generator'
import { ChatAssistant } from '@/components/chat/chat-assistant'
import { GenerationHistory } from '@/components/dashboard/generation-history'
import { StatsOverview } from '@/components/dashboard/stats-overview'
import { 
  Image, 
  Video, 
  Music, 
  Box, 
  MessageSquare, 
  History, 
  BarChart3 
} from 'lucide-react'

export default function DashboardPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="spinner"></div>
    </div>
  }

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold gradient-text">AI Creation Studio</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {session.user?.name}! What will you create today?
          </p>
        </div>
      </div>

      <div className="grid gap-6 mb-8">
        <StatsOverview />
      </div>

      <Tabs defaultValue="image" className="space-y-6">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="image" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Images
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex items-center gap-2">
            <Music className="h-4 w-4" />
            Audio
          </TabsTrigger>
          <TabsTrigger value="3d" className="flex items-center gap-2">
            <Box className="h-4 w-4" />
            3D Models
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            AI Chat
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="image" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Image Generation
              </CardTitle>
              <CardDescription>
                Create stunning images from text prompts using Stable Diffusion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageGenerator />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="video" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Video Generation
              </CardTitle>
              <CardDescription>
                Generate animated videos and realistic scenes with AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VideoGenerator />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audio" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Audio Generation
              </CardTitle>
              <CardDescription>
                Create voice synthesis and music with AI models
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AudioGenerator />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="3d" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Box className="h-5 w-5" />
                3D Model Generation
              </CardTitle>
              <CardDescription>
                Generate 3D characters, products, and objects from text
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ThreeDGenerator />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                AI Assistant
              </CardTitle>
              <CardDescription>
                Chat with your AI assistant powered by Ollama
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChatAssistant />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Generation History
              </CardTitle>
              <CardDescription>
                View and manage your previous AI generations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GenerationHistory />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
