/**
 * Main page for creating chatbots
 */
import React, { useState } from 'react'
import Layout from '@/components/Layout'
import BusinessForm from '@/components/BusinessForm'
import EmbedCodeCard from '@/components/EmbedCodeCard'
import WidgetPreview from '@/components/WidgetPreview'
import { useCreateChatbot } from '@/hooks/useCreateChatbot'
import { getErrorMessage } from '@/services/api'
import type { CreateChatbotRequest, CreateChatbotResponse } from '@/types'

const CreateBotPage: React.FC = () => {
  const [chatbotData, setChatbotData] = useState<CreateChatbotResponse | null>(null)
  const createChatbotMutation = useCreateChatbot()

  const handleSubmit = (data: CreateChatbotRequest) => {
    console.log('🚀 Submitting form data:', data)
    createChatbotMutation.mutate(data, {
      onSuccess: (response) => {
        console.log('✅ Chatbot created successfully:', response)
        setChatbotData(response)
        // Scroll to results
        setTimeout(() => {
          document.getElementById('results-section')?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          })
        }, 100)
      },
      onError: (error) => {
        console.error('❌ Failed to create chatbot:', getErrorMessage(error))
      }
    })
  }

  const resetForm = () => {
    setChatbotData(null)
    createChatbotMutation.reset()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  console.log('🔄 Rendering CreateBotPage, chatbotData:', chatbotData)
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold gradient-hero bg-clip-text text-transparent">
              Create Your AI Chatbot
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Transform your business information into an intelligent chatbot that can answer customer questions 24/7
            </p>
          </div>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="glass-card p-6 rounded-xl">
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg gradient-primary flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">Get your chatbot up and running in under 2 minutes</p>
            </div>
            
            <div className="glass-card p-6 rounded-xl">
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg gradient-primary flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 14S9.5 16 12 16S16 14 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M9 9H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M15 9H15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Smart & Friendly</h3>
              <p className="text-sm text-muted-foreground">AI-powered responses tailored to your business tone</p>
            </div>
            
            <div className="glass-card p-6 rounded-xl">
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg gradient-primary flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M21 16V8A2 2 0 0 0 19 6H5A2 2 0 0 0 3 8V16A2 2 0 0 0 5 18H19A2 2 0 0 0 21 16Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M6 12H18" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Easy Integration</h3>
              <p className="text-sm text-muted-foreground">One-line embed code works on any website</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        {!chatbotData && (
          <div id="form-section">
            <BusinessForm
              onSubmit={handleSubmit}
              isLoading={createChatbotMutation.isPending}
              error={createChatbotMutation.error ? getErrorMessage(createChatbotMutation.error) : null}
            />
          </div>
        )}

        {/* Results Section */}
        {chatbotData && (
          <div id="results-section" className="space-y-8">
            <div className="text-center">
              <button
                onClick={resetForm}
                className="text-sm text-muted-foreground hover:text-primary transition-smooth underline"
              >
                ← Create Another Chatbot
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <EmbedCodeCard chatbotData={chatbotData} />
              <WidgetPreview chatbotId={chatbotData.chatbot_id} />
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="border-t pt-12">
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="w-8 h-8 mx-auto rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="font-medium">Fill Business Info</h3>
                <p className="text-sm text-muted-foreground">Tell us about your business, products, and common questions</p>
              </div>
              <div className="space-y-3">
                <div className="w-8 h-8 mx-auto rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="font-medium">Get Embed Code</h3>
                <p className="text-sm text-muted-foreground">Copy the simple script tag to add to your website</p>
              </div>
              <div className="space-y-3">
                <div className="w-8 h-8 mx-auto rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="font-medium">Start Chatting</h3>
                <p className="text-sm text-muted-foreground">Your customers can now chat with your AI assistant 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CreateBotPage