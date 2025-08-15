/**
 * Main layout component with header and container
 */
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface LayoutProps {
  children: React.ReactNode
  className?: string
}

export const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  const location = useLocation()
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center gap-3 hover:opacity-80 transition-smooth"
            >
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-primary">
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  className="text-white"
                >
                  <path 
                    d="M8 12H16M8 8H16M12 16H16M8 20H16C17.1046 20 18 19.1046 18 18V6C18 4.89543 17.1046 4 16 4H8C6.89543 4 6 4.89543 6 6V18C6 19.1046 6.89543 20 8 20Z" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Chatbot Generator
                </h1>
                <p className="text-xs text-muted-foreground">
                  Create AI chatbots for your business
                </p>
              </div>
            </Link>
            
            <nav className="flex items-center gap-6">
              <Link
                to="/"
                className={cn(
                  'text-sm font-medium transition-smooth hover:text-primary',
                  location.pathname === '/' 
                    ? 'text-primary border-b-2 border-primary pb-1' 
                    : 'text-muted-foreground'
                )}
              >
                Create Bot
              </Link>
              <Link
                to="/demo"
                className={cn(
                  'text-sm font-medium transition-smooth hover:text-primary',
                  location.pathname === '/demo' 
                    ? 'text-primary border-b-2 border-primary pb-1' 
                    : 'text-muted-foreground'
                )}
              >
                Demo
              </Link>
              <a
                href="#docs"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-smooth"
              >
                Docs
              </a>
            </nav>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className={cn('container mx-auto px-4 py-8', className)}>
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border bg-card/30 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                © 2024 Chatbot Generator. Built with React + TypeScript.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <a 
                href="#privacy" 
                className="text-sm text-muted-foreground hover:text-primary transition-smooth"
              >
                Privacy
              </a>
              <a 
                href="#terms" 
                className="text-sm text-muted-foreground hover:text-primary transition-smooth"
              >
                Terms
              </a>
              <a 
                href="#support" 
                className="text-sm text-muted-foreground hover:text-primary transition-smooth"
              >
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout