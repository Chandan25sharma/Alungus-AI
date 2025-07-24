'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function ChatAssistant() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([])
  const [loading, setLoading] = useState(false)

  const handleSend = () => {
    if (!message.trim()) return
    
    setMessages(prev => [...prev, { role: 'user', content: message }])
    setLoading(true)
    setMessage('')
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'This is a placeholder response. The AI chat will be connected to Ollama for real conversations.' 
      }])
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-4">
      <Card className="h-96 overflow-y-auto">
        <CardContent className="p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              Start a conversation with your AI assistant
            </div>
          )}
          
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg ${
                msg.role === 'user' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                <div className="spinner"></div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 p-3 border rounded-md"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button onClick={handleSend} disabled={loading || !message.trim()}>
          Send
        </Button>
      </div>
    </div>
  )
}
