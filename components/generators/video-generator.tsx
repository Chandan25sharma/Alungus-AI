'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function VideoGenerator() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Video Description</label>
          <textarea
            className="w-full mt-1 p-3 border rounded-md"
            rows={3}
            placeholder="Describe the video you want to generate..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Duration</label>
            <select className="w-full mt-1 p-2 border rounded-md">
              <option>3 seconds</option>
              <option>5 seconds</option>
              <option>10 seconds</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Type</label>
            <select className="w-full mt-1 p-2 border rounded-md">
              <option>Animation</option>
              <option>Realistic</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">FPS</label>
            <select className="w-full mt-1 p-2 border rounded-md">
              <option>24</option>
              <option>30</option>
            </select>
          </div>
        </div>

        <Button onClick={() => setLoading(!loading)} disabled={!prompt} className="w-full">
          {loading ? 'Generating Video...' : 'Generate Video'}
        </Button>
      </div>

      {loading && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="spinner"></div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
