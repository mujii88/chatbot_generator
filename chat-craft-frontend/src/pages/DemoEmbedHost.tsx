/**
 * Demo page showing how the widget works when embedded
 */
import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Layout from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

const DemoEmbedHost: React.FC = () => {
  const [searchParams] = useSearchParams()
  const [isWidgetLoaded, setIsWidgetLoaded] = useState(false)
  const chatbotId = searchParams.get('id') || 'demo-123'
  const isEmbedded = searchParams.get('embedded') === 'true'
  const apiBaseUrl = 'http://localhost:8000' // Backend API URL

  useEffect(() => {
    // Dynamically load the widget script from backend
    const script = document.createElement('script')
    script.src = `${apiBaseUrl}/widget.js`
    script.setAttribute('data-chatbot-id', chatbotId)
    script.onload = () => setIsWidgetLoaded(true)
    script.onerror = () => console.error('Failed to load widget script')
    document.body.appendChild(script)

    return () => {
      // Cleanup: remove script and widget
      const existingScript = document.querySelector('script[data-chatbot-id]')
      if (existingScript) {
        existingScript.remove()
      }
      
      const widget = document.querySelector('.chatbot-widget')
      if (widget) {
        widget.remove()
      }
    }
  }, [chatbotId, apiBaseUrl])

  if (isEmbedded) {
    // Minimal embedded view
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-lg">Widget Demo</CardTitle>
              <Badge variant="secondary">ID: {chatbotId.slice(-8)}</Badge>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                This is how your chatbot widget will appear on your website.
              </p>
              <div className="space-y-2">
                <div className="w-full h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-3/4 h-8 bg-gray-200 rounded animate-pulse mx-auto"></div>
                <div className="w-5/6 h-8 bg-gray-200 rounded animate-pulse mx-auto"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-3xl font-bold">Widget Demo</h1>
            <Badge variant="secondary" className="text-sm">
              ID: {chatbotId.slice(-8)}
            </Badge>
          </div>
          <p className="text-lg text-muted-foreground">
            Experience how your chatbot widget will work on your website
          </p>
        </div>

        {/* Widget Status */}
        <Alert className={isWidgetLoaded ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}>
          <AlertDescription className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isWidgetLoaded ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            {isWidgetLoaded ? 'Widget loaded successfully!' : 'Loading widget...'}
            {isWidgetLoaded && (
              <span className="text-sm">Look for the chat button in the bottom-right corner.</span>
            )}
          </AlertDescription>
        </Alert>

        {/* Demo Website Content */}
        <div className="space-y-8">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Demo Business Website</CardTitle>
              <CardDescription>
                This simulates how your chatbot would appear on a real website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mock Website Header */}
              <div className="border rounded-lg p-6 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg"></div>
                  <div>
                    <h2 className="text-xl font-bold">ABC Company</h2>
                    <p className="text-sm text-muted-foreground">Quality Products & Services</p>
                  </div>
                </div>
                <nav className="flex gap-6 text-sm">
                  <span className="font-medium text-primary">Home</span>
                  <span className="text-muted-foreground">Products</span>
                  <span className="text-muted-foreground">About</span>
                  <span className="text-muted-foreground">Contact</span>
                </nav>
              </div>

              {/* Mock Website Content */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Welcome to Our Store</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We provide high-quality products and exceptional customer service. 
                    Our team is dedicated to helping you find exactly what you need. 
                    If you have any questions, our AI assistant is here to help 24/7!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <div className="w-full h-32 bg-gray-200 rounded mb-3"></div>
                    <h4 className="font-medium">Product Category A</h4>
                    <p className="text-sm text-muted-foreground">Browse our selection of premium items</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="w-full h-32 bg-gray-200 rounded mb-3"></div>
                    <h4 className="font-medium">Product Category B</h4>
                    <p className="text-sm text-muted-foreground">Discover our latest offerings</p>
                  </div>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <p className="font-medium text-primary">💬 Try the Chat Widget!</p>
                  <p className="text-sm text-muted-foreground">
                    Click the chat button in the bottom-right corner to test the chatbot. 
                    Ask questions like "What are your business hours?" or "Do you offer shipping?"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Integration Examples */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Script Tag Method</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`<script 
  src="${apiBaseUrl}/widget.js" 
  data-chatbot-id="${chatbotId}">
</script>`}
                </pre>
                <p className="text-xs text-muted-foreground mt-2">
                  Add this to your website's HTML to enable the floating chat widget
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Manual Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`<div id="chatbot-${chatbotId}"></div>
<script>
  // Custom initialization
  new ChatbotWidget({
    chatbotId: "${chatbotId}",
    position: "bottom-right"
  });
</script>`}
                </pre>
                <p className="text-xs text-muted-foreground mt-2">
                  For more control over widget placement and behavior
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild variant="outline">
              <Link to="/">← Create New Chatbot</Link>
            </Button>
            <Button asChild>
              <Link to={`/?edit=${chatbotId}`}>Edit This Chatbot</Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              🔄 Reload Demo
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default DemoEmbedHost