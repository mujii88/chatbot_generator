/**
 * TypeScript interfaces for the Chatbot Generator API
 */

export interface BusinessInfo {
  name: string
  description: string
  website_url?: string
  tone: 'friendly' | 'professional' | 'casual'
  faqs: FAQ[]
  bot_display_name?: string
  knowledge_files?: File[]
}

export interface FAQ {
  q: string
  a: string
}

export interface CreateChatbotRequest {
  name: string
  description: string
  website_url?: string
  tone: 'friendly' | 'professional' | 'casual'
  faqs: FAQ[]
  knowledge_files?: File[]
}


export interface CreateChatbotResponse {
  chatbot_id: string
  embed_script_url: string
  created_at: string
  config: BusinessInfo
}

export interface ChatRequest {
  chatbot_id: string
  message: string
}

export interface ChatResponse {
  reply: string
  meta?: {
    confidence?: number
  }
}

export interface ChatbotInfo {
  chatbot_id: string
  name: string
  description: string
  tone: string
  faqs: FAQ[]
}

export interface ApiError {
  message: string
  status?: number
  details?: any
}

// Form validation types
export interface FormErrors {
  [key: string]: string | undefined
}

// Widget types
export interface WidgetConfig {
  chatbotId: string
  apiBaseUrl: string
  theme?: 'light' | 'dark'
  position?: 'bottom-right' | 'bottom-left'
}

export interface ChatMessage {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export interface WidgetState {
  isOpen: boolean
  isLoading: boolean
  messages: ChatMessage[]
  inputValue: string
}

// File upload types
export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  lastModified: number
}

export interface FileValidationResult {
  isValid: boolean
  error?: string
}