/**
 * Component to display and copy embed code for the chatbot
 */
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { copyToClipboard, showCopyNotification } from '@/utils/copyToClipboard'
import type { CreateChatbotResponse } from '@/types'
import { cn } from '@/lib/utils'

interface EmbedCodeCardProps {
  chatbotData: CreateChatbotResponse
  className?: string
}

export const EmbedCodeCard: React.FC<EmbedCodeCardProps> = ({ 
  chatbotData, 
  className 
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  
  const scriptEmbedCode = `<script src="${chatbotData.embed_script_url}" data-chatbot-id="${chatbotData.chatbot_id}"></script>`
  
  const iframeEmbedCode = `<iframe 
  src="${window.location.origin}/widget.html?id=${chatbotData.chatbot_id}" 
  width="400" 
  height="600" 
  frameborder="0"
  title="Chatbot Widget"
></iframe>`

  const manualEmbedCode = `<!-- Add this div where you want the chat button to appear -->
<div id="chatbot-widget-${chatbotData.chatbot_id}"></div>

<!-- Add this script before closing </body> tag -->
<script>
  window.ChatbotConfig = {
    chatbotId: "${chatbotData.chatbot_id}",
    apiUrl: "${chatbotData.embed_script_url.replace('/widget.js', '')}"
  };
</script>
<script src="${chatbotData.embed_script_url}"></script>`

  const handleCopy = async (code: string, type: string) => {
    const success = await copyToClipboard(code)
    showCopyNotification(success, code)
    
    if (success) {
      setCopiedCode(type)
      setTimeout(() => setCopiedCode(null), 2000)
    }
  }
  
  const demoUrl = `/demo?id=${chatbotData.chatbot_id}`
  
  return (
    <Card className={cn('w-full shadow-card', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-foreground">
              🎉 Chatbot Created Successfully!
            </CardTitle>
            <CardDescription className="mt-2">
              Your chatbot is ready to be embedded on your website
            </CardDescription>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            ID: {chatbotData.chatbot_id.slice(-8)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => window.open(demoUrl, '_blank')}
            className="transition-smooth hover:border-primary hover:text-primary"
          >
            🔗 Test Demo
          </Button>
          <Button
            variant="outline"
            onClick={() => handleCopy(scriptEmbedCode, 'script')}
            className="transition-smooth hover:border-primary hover:text-primary"
          >
            {copiedCode === 'script' ? '✅ Copied!' : '📋 Copy Script'}
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open('#docs', '_blank')}
            className="transition-smooth hover:border-primary hover:text-primary"
          >
            📚 View Docs
          </Button>
        </div>
        
        {/* Embed Code Options */}
        <Tabs defaultValue="script" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="script">Script Tag</TabsTrigger>
            <TabsTrigger value="iframe">iFrame</TabsTrigger>
            <TabsTrigger value="manual">Manual</TabsTrigger>
          </TabsList>
          
          <TabsContent value="script" className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Simple Script Embed (Recommended)</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Add this single line to your website's HTML to enable the floating chat widget.
              </p>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto border">
                  <code>{scriptEmbedCode}</code>
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(scriptEmbedCode, 'script')}
                  className="absolute top-2 right-2 h-8"
                >
                  {copiedCode === 'script' ? '✅' : '📋'}
                </Button>
              </div>
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> Place this in your website's <code>&lt;head&gt;</code> or before the closing <code>&lt;/body&gt;</code> tag.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="iframe" className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">iFrame Embed</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Embed the chatbot as an iframe for more control over positioning.
              </p>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto border">
                  <code>{iframeEmbedCode}</code>
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(iframeEmbedCode, 'iframe')}
                  className="absolute top-2 right-2 h-8"
                >
                  {copiedCode === 'iframe' ? '✅' : '📋'}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="manual" className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Manual Integration</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Full control over the widget placement and configuration.
              </p>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto border">
                  <code>{manualEmbedCode}</code>
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(manualEmbedCode, 'manual')}
                  className="absolute top-2 right-2 h-8"
                >
                  {copiedCode === 'manual' ? '✅' : '📋'}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Important Notes */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Important Notes:</h4>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>The widget will appear as a floating chat button in the bottom-right corner</li>
            <li>Make sure your website allows scripts from <code>{chatbotData.embed_script_url.startsWith('http') ? new URL(chatbotData.embed_script_url).origin : window.location.origin}</code></li>
            <li>The chatbot will automatically use your business information and FAQs</li>
            <li>For HTTPS websites, ensure the embed script URL is also HTTPS</li>
          </ul>
        </div>
        
        {/* Debug Info (Collapsible) */}
        <details className="border rounded-lg">
          <summary className="p-3 cursor-pointer hover:bg-muted transition-smooth">
            <strong>Debug Information</strong> (click to expand)
          </summary>
          <div className="p-3 border-t bg-muted/50">
            <pre className="text-xs overflow-x-auto">
              {JSON.stringify(chatbotData, null, 2)}
            </pre>
          </div>
        </details>
      </CardContent>
    </Card>
  )
}

export default EmbedCodeCard