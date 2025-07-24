'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function ImageGenerator() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    // TODO: Implement actual image generation
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Prompt</label>
          <textarea
            className="w-full mt-1 p-3 border rounded-md"
            rows={3}
            placeholder="Describe the image you want to generate..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium">Width</label>
            <select className="w-full mt-1 p-2 border rounded-md">
              <option>512</option>
              <option>768</option>
              <option>1024</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Height</label>
            <select className="w-full mt-1 p-2 border rounded-md">
              <option>512</option>
              <option>768</option>
              <option>1024</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Steps</label>
            <input type="number" className="w-full mt-1 p-2 border rounded-md" defaultValue={30} min={1} max={100} />
          </div>
          <div>
            <label className="text-sm font-medium">CFG Scale</label>
            <input type="number" className="w-full mt-1 p-2 border rounded-md" defaultValue={7} min={1} max={30} />
          </div>
        </div>

        <Button onClick={handleGenerate} disabled={loading || !prompt} className="w-full">
          {loading ? 'Generating...' : 'Generate Image'}
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
