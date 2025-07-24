'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function ThreeDGenerator() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">3D Model Description</label>
          <textarea
            className="w-full mt-1 p-3 border rounded-md"
            rows={3}
            placeholder="Describe the 3D model you want to create..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Type</label>
            <select className="w-full mt-1 p-2 border rounded-md">
              <option>Character</option>
              <option>Product</option>
              <option>Object</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Style</label>
            <select className="w-full mt-1 p-2 border rounded-md">
              <option>Realistic</option>
              <option>Stylized</option>
              <option>Low Poly</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Format</label>
            <select className="w-full mt-1 p-2 border rounded-md">
              <option>GLB</option>
              <option>OBJ</option>
              <option>GLTF</option>
            </select>
          </div>
        </div>

        <Button onClick={() => setLoading(!loading)} disabled={!prompt} className="w-full">
          {loading ? 'Generating 3D Model...' : 'Generate 3D Model'}
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
