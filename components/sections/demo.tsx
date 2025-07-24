'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function Demo() {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          See It In <span className="gradient-text">Action</span>
        </h2>
        <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
          Experience the power of our AI generation tools with live demos
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Image Generation Demo</CardTitle>
              <CardDescription>Create stunning images from text prompts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gradient-to-r from-purple-200 to-blue-200 rounded-lg flex items-center justify-center mb-4">
                <p className="text-gray-600">Image Demo Preview</p>
              </div>
              <Button>Try Image Generation</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Video Generation Demo</CardTitle>
              <CardDescription>Generate animated videos with AI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gradient-to-r from-green-200 to-cyan-200 rounded-lg flex items-center justify-center mb-4">
                <p className="text-gray-600">Video Demo Preview</p>
              </div>
              <Button>Try Video Generation</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
