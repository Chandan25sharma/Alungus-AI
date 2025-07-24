import Link from 'next/link'
import { Brain } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-purple-600" />
              <span className="text-xl font-bold gradient-text">Alungus AI</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Create amazing content with cutting-edge AI technology. 
              All powered by open-source models.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Product</h3>
            <div className="space-y-2 text-sm">
              <Link href="/#features" className="block text-muted-foreground hover:text-foreground">
                Features
              </Link>
              <Link href="/#pricing" className="block text-muted-foreground hover:text-foreground">
                Pricing
              </Link>
              <Link href="/docs" className="block text-muted-foreground hover:text-foreground">
                Documentation
              </Link>
              <Link href="/api" className="block text-muted-foreground hover:text-foreground">
                API Reference
              </Link>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Company</h3>
            <div className="space-y-2 text-sm">
              <Link href="/about" className="block text-muted-foreground hover:text-foreground">
                About
              </Link>
              <Link href="/blog" className="block text-muted-foreground hover:text-foreground">
                Blog
              </Link>
              <Link href="/careers" className="block text-muted-foreground hover:text-foreground">
                Careers
              </Link>
              <Link href="/contact" className="block text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Legal</h3>
            <div className="space-y-2 text-sm">
              <Link href="/privacy" className="block text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
              <Link href="/cookies" className="block text-muted-foreground hover:text-foreground">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Alungus AI. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="https://twitter.com" className="text-muted-foreground hover:text-foreground">
              <span className="sr-only">Twitter</span>
              Twitter
            </Link>
            <Link href="https://github.com" className="text-muted-foreground hover:text-foreground">
              <span className="sr-only">GitHub</span>
              GitHub
            </Link>
            <Link href="https://discord.com" className="text-muted-foreground hover:text-foreground">
              <span className="sr-only">Discord</span>
              Discord
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
