import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Alungus AI - Multimodal AI Generation Platform',
  description: 'Generate images, videos, audio, 3D models, and chat with AI assistants using cutting-edge open-source models.',
  keywords: 'AI, image generation, video generation, audio generation, 3D modeling, stable diffusion, ollama, multimodal AI',
  authors: [{ name: 'Alungus AI Team' }],
  creator: 'Alungus AI',
  publisher: 'Alungus AI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://alungus-ai.vercel.app',
    title: 'Alungus AI - Multimodal AI Generation Platform',
    description: 'Generate images, videos, audio, 3D models, and chat with AI assistants using cutting-edge open-source models.',
    siteName: 'Alungus AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alungus AI - Multimodal AI Generation Platform',
    description: 'Generate images, videos, audio, 3D models, and chat with AI assistants using cutting-edge open-source models.',
    creator: '@alungus_ai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
