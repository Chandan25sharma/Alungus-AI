'use client'

import { signIn, getProviders } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, Github, Mail } from 'lucide-react'
import Link from 'next/link'

export default function SignIn() {
  const [providers, setProviders] = useState<any>(null)

  useEffect(() => {
    const setUpProviders = async () => {
      const response = await getProviders()
      setProviders(response)
    }
    setUpProviders()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 px-4">
      <div className="absolute inset-0 bg-black/20"></div>
      
      <Card className="relative z-10 w-full max-w-md glass-morphism border-white/20">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Brain className="h-12 w-12 text-white" />
          </div>
          <CardTitle className="text-2xl text-white">Welcome to Alungus AI</CardTitle>
          <CardDescription className="text-white/80">
            Sign in to  creating amazing content with AI
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {providers && Object.values(providers).map((provider: any) => {
            if (provider.id === 'credentials') return null
            
            let icon = <Mail className="w-4 h-4" />
            if (provider.id === 'google') icon = <Mail className="w-4 h-4" />
            if (provider.id === 'github') icon = <Github className="w-4 h-4" />
            
            return (
              <Button
                key={provider.name}
                onClick={() => signIn(provider.id, { callbackUrl: '/dashboard' })}
                className="w-full bg-white text-black hover:bg-gray-100"
              >
                {icon}
                <span className="ml-2">Continue with {provider.name}</span>
              </Button>
            )
          })}
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-2 text-white/60">Or</span>
            </div>
          </div>
          
          <Button
            onClick={() => signIn('credentials', { callbackUrl: '/dashboard' })}
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white hover:text-black"
          >
            <Mail className="w-4 h-4 mr-2" />
            Continue with Email
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-white/60">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-white hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
