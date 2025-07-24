'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function AudioGenerator() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Text or Music Description</label>
          <textarea
            className="w-full mt-1 p-3 border rounded-md"
            rows={3}
            placeholder="Enter text for speech or describe music..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Type</label>
            <select className="w-full mt-1 p-2 border rounded-md">
              <option>Text-to-Speech</option>
              <option>Music Generation</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Voice/Genre</label>
            <select className="w-full mt-1 p-2 border rounded-md">
              <option>Male</option>
              <option>Female</option>
              <option>Classical</option>
              <option>Electronic</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Duration</label>
            <select className="w-full mt-1 p-2 border rounded-md">
              <option>30 seconds</option>
              <option>60 seconds</option>
              <option>120 seconds</option>
            </select>
          </div>
        </div>

        <Button onClick={() => setLoading(!loading)} disabled={!text} className="w-full">
          {loading ? 'Generating Audio...' : 'Generate Audio'}
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
