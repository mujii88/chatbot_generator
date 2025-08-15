/**
 * 404 Not Found page
 */
import React from 'react'
import { Link } from 'react-router-dom'
import Layout from '@/components/Layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const NotFound: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto text-center">
        <Card className="shadow-card">
          <CardContent className="p-12">
            <div className="space-y-6">
              {/* 404 Icon */}
              <div className="w-20 h-20 mx-auto rounded-full gradient-primary flex items-center justify-center">
                <span className="text-3xl text-white">❓</span>
              </div>
              
              {/* Error Message */}
              <div className="space-y-3">
                <h1 className="text-4xl font-bold text-foreground">404</h1>
                <h2 className="text-xl font-semibold text-muted-foreground">
                  Page Not Found
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Oops! The page you're looking for doesn't exist. 
                  It might have been moved, deleted, or you entered the wrong URL.
                </p>
              </div>
              
              {/* Actions */}
              <div className="space-y-4 pt-4">
                <Button asChild className="gradient-primary hover:opacity-90 transition-smooth text-white">
                  <Link to="/">
                    🏠 Go Home
                  </Link>
                </Button>
                
                <div className="flex gap-4 justify-center">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/demo">
                      🔍 View Demo
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.history.back()}
                  >
                    ← Go Back
                  </Button>
                </div>
              </div>
              
              {/* Help Links */}
              <div className="border-t pt-6">
                <p className="text-sm text-muted-foreground mb-3">
                  Need help? Try these popular pages:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Link 
                    to="/" 
                    className="text-xs px-3 py-1 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-smooth"
                  >
                    Create Chatbot
                  </Link>
                  <Link 
                    to="/demo" 
                    className="text-xs px-3 py-1 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-smooth"
                  >
                    Widget Demo
                  </Link>
                  <a 
                    href="#docs" 
                    className="text-xs px-3 py-1 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-smooth"
                  >
                    Documentation
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default NotFound