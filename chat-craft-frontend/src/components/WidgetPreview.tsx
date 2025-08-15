/**
 * Preview component for the chatbot widget
 */
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface WidgetPreviewProps {
  chatbotId: string
  className?: string
}

export const WidgetPreview: React.FC<WidgetPreviewProps> = ({ 
  chatbotId, 
  className 
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  
  const widgetUrl = `/demo?id=${chatbotId}&embedded=true`
  
  return (
    <Card className={cn('w-full shadow-card', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Widget Preview
            </CardTitle>
            <CardDescription>
              See how your chatbot will look on your website
            </CardDescription>
          </div>
          <Badge variant="secondary">
            Live Preview
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isPreviewOpen ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center shadow-primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                <path 
                  d="M8 12H16M8 8H16M12 16H16M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="font-medium mb-2">Ready to Preview</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Click below to see your chatbot widget in action
            </p>
            <Button
              onClick={() => setIsPreviewOpen(true)}
              className="gradient-primary hover:opacity-90 transition-smooth text-white shadow-primary"
            >
              🔍 Launch Preview
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Live Widget Preview</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewOpen(false)}
              >
                ✕ Close
              </Button>
            </div>
            
            {/* Mock Website Preview */}
            <div className="border rounded-lg overflow-hidden bg-white">
              {/* Mock Website Header */}
              <div className="bg-gray-50 p-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-300 rounded"></div>
                  <div>
                    <div className="w-24 h-4 bg-gray-300 rounded mb-1"></div>
                    <div className="w-16 h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
              
              {/* Mock Website Content */}
              <div className="p-6 relative min-h-[400px]">
                <div className="space-y-4">
                  <div className="w-48 h-6 bg-gray-300 rounded"></div>
                  <div className="space-y-2">
                    <div className="w-full h-4 bg-gray-200 rounded"></div>
                    <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                    <div className="w-5/6 h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="h-24 bg-gray-100 rounded-lg"></div>
                    <div className="h-24 bg-gray-100 rounded-lg"></div>
                  </div>
                </div>
                
                {/* Floating Chat Widget */}
                <div className="absolute bottom-4 right-4">
                  <iframe
                    src={widgetUrl}
                    width="80"
                    height="80"
                    frameBorder="0"
                    title="Chatbot Widget Preview"
                    className="rounded-full shadow-widget"
                  />
                </div>
              </div>
            </div>
            
            {/* Preview Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(widgetUrl, '_blank')}
                className="flex-1"
              >
                🔗 Open in New Tab
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const fullDemoUrl = `/demo?id=${chatbotId}`
                  window.open(fullDemoUrl, '_blank')
                }}
                className="flex-1"
              >
                📱 Full Demo
              </Button>
            </div>
          </div>
        )}
        
        {/* Widget Information */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2 text-sm">Widget Features:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Responsive Design
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Mobile Friendly
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Floating Position
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Auto-sizing
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default WidgetPreview