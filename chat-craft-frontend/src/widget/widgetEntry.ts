/**
 * Standalone chatbot widget entry point
 * This file gets compiled to public/widget.js for embedding on external websites
 */

interface WidgetConfig {
  chatbotId: string
  apiBaseUrl?: string
  theme?: 'light' | 'dark'
  position?: 'bottom-right' | 'bottom-left'
}

interface ChatMessage {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

class ChatbotWidget {
  private config: WidgetConfig
  private isOpen = false
  private messages: ChatMessage[] = []
  private container: HTMLElement | null = null
  private chatWindow: HTMLElement | null = null
  private isLoading = false

  constructor(config: WidgetConfig) {
    this.config = {
      apiBaseUrl: 'https://api.example.com',
      theme: 'light',
      position: 'bottom-right',
      ...config
    }
    
    this.init()
  }

  private init() {
    this.createStyles()
    this.createWidget()
    this.attachEventListeners()
  }

  private createStyles() {
    const style = document.createElement('style')
    style.textContent = `
      .chatbot-widget {
        position: fixed;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .chatbot-widget.bottom-right {
        bottom: 20px;
        right: 20px;
      }
      
      .chatbot-widget.bottom-left {
        bottom: 20px;
        left: 20px;
      }
      
      .chatbot-toggle {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #8b5cf6, #a855f7);
        border: none;
        color: white;
        cursor: pointer;
        box-shadow: 0 8px 32px rgba(139, 92, 246, 0.3);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
      }
      
      .chatbot-toggle:hover {
        transform: scale(1.1);
        box-shadow: 0 12px 40px rgba(139, 92, 246, 0.4);
      }
      
      .chatbot-window {
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 350px;
        height: 500px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        border: 1px solid #e5e7eb;
        display: none;
        flex-direction: column;
        overflow: hidden;
      }
      
      .chatbot-window.open {
        display: flex;
        animation: slideUp 0.3s ease-out;
      }
      
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .chatbot-header {
        background: linear-gradient(135deg, #8b5cf6, #a855f7);
        color: white;
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      
      .chatbot-title {
        font-weight: 600;
        font-size: 16px;
      }
      
      .chatbot-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        opacity: 0.8;
        font-size: 20px;
        line-height: 1;
      }
      
      .chatbot-close:hover {
        opacity: 1;
        background: rgba(255, 255, 255, 0.1);
      }
      
      .chatbot-messages {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
        background: #f9fafb;
      }
      
      .chatbot-message {
        padding: 12px 16px;
        border-radius: 12px;
        max-width: 80%;
        word-wrap: break-word;
        line-height: 1.4;
        font-size: 14px;
      }
      
      .chatbot-message.user {
        background: #8b5cf6;
        color: white;
        align-self: flex-end;
        border-bottom-right-radius: 4px;
      }
      
      .chatbot-message.bot {
        background: white;
        color: #374151;
        align-self: flex-start;
        border: 1px solid #e5e7eb;
        border-bottom-left-radius: 4px;
      }
      
      .chatbot-input-area {
        padding: 16px;
        border-top: 1px solid #e5e7eb;
        background: white;
        display: flex;
        gap: 8px;
      }
      
      .chatbot-input {
        flex: 1;
        padding: 12px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s;
      }
      
      .chatbot-input:focus {
        border-color: #8b5cf6;
      }
      
      .chatbot-send {
        padding: 12px 16px;
        background: #8b5cf6;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: background-color 0.2s;
      }
      
      .chatbot-send:hover {
        background: #7c3aed;
      }
      
      .chatbot-send:disabled {
        background: #d1d5db;
        cursor: not-allowed;
      }
      
      .chatbot-loading {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #6b7280;
        font-size: 14px;
        padding: 12px 16px;
      }
      
      .chatbot-loading-dots {
        display: flex;
        gap: 2px;
      }
      
      .chatbot-loading-dot {
        width: 4px;
        height: 4px;
        background: #6b7280;
        border-radius: 50%;
        animation: pulse 1.4s infinite ease-in-out;
      }
      
      .chatbot-loading-dot:nth-child(1) { animation-delay: -0.32s; }
      .chatbot-loading-dot:nth-child(2) { animation-delay: -0.16s; }
      
      @keyframes pulse {
        0%, 80%, 100% { opacity: 0.3; }
        40% { opacity: 1; }
      }
      
      @media (max-width: 480px) {
        .chatbot-window {
          width: calc(100vw - 40px);
          height: calc(100vh - 120px);
          bottom: 80px;
          right: 20px;
        }
      }
    `
    document.head.appendChild(style)
  }

  private createWidget() {
    // Create main container
    this.container = document.createElement('div')
    this.container.className = `chatbot-widget ${this.config.position}`
    
    // Create toggle button
    const toggleButton = document.createElement('button')
    toggleButton.className = 'chatbot-toggle'
    toggleButton.innerHTML = '💬'
    toggleButton.onclick = () => this.toggleChat()
    
    // Create chat window
    this.chatWindow = document.createElement('div')
    this.chatWindow.className = 'chatbot-window'
    this.chatWindow.innerHTML = `
      <div class="chatbot-header">
        <div class="chatbot-title">Chat with us</div>
        <button class="chatbot-close" onclick="this.parentElement.parentElement.classList.remove('open')">✕</button>
      </div>
      <div class="chatbot-messages" id="chatbot-messages-${this.config.chatbotId}">
        <div class="chatbot-message bot">
          👋 Hello! How can I help you today?
        </div>
      </div>
      <div class="chatbot-input-area">
        <input 
          type="text" 
          class="chatbot-input" 
          placeholder="Type your message..."
          id="chatbot-input-${this.config.chatbotId}"
          onkeypress="if(event.key==='Enter') this.nextElementSibling.click()"
        >
        <button class="chatbot-send" onclick="window.chatbotInstances['${this.config.chatbotId}'].sendMessage()">
          Send
        </button>
      </div>
    `
    
    this.container.appendChild(toggleButton)
    this.container.appendChild(this.chatWindow)
    document.body.appendChild(this.container)
    
    // Store instance globally for onclick handlers
    if (!window.chatbotInstances) {
      window.chatbotInstances = {}
    }
    window.chatbotInstances[this.config.chatbotId] = this
  }

  private attachEventListeners() {
    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.container?.contains(e.target as Node)) {
        this.closeChat()
      }
    })
    
    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeChat()
      }
    })
  }

  private toggleChat() {
    if (this.isOpen) {
      this.closeChat()
    } else {
      this.openChat()
    }
  }

  private openChat() {
    if (this.chatWindow) {
      this.chatWindow.classList.add('open')
      this.isOpen = true
      
      // Focus input
      const input = document.getElementById(`chatbot-input-${this.config.chatbotId}`) as HTMLInputElement
      if (input) {
        setTimeout(() => input.focus(), 300)
      }
    }
  }

  private closeChat() {
    if (this.chatWindow) {
      this.chatWindow.classList.remove('open')
      this.isOpen = false
    }
  }

  public async sendMessage() {
    const input = document.getElementById(`chatbot-input-${this.config.chatbotId}`) as HTMLInputElement
    const messagesContainer = document.getElementById(`chatbot-messages-${this.config.chatbotId}`)
    
    if (!input || !messagesContainer || !input.value.trim() || this.isLoading) {
      return
    }
    
    const userMessage = input.value.trim()
    input.value = ''
    
    // Add user message
    this.addMessage(userMessage, 'user')
    
    // Show loading
    this.showLoading()
    this.isLoading = true
    
    try {
      const response = await fetch(`${this.config.apiBaseUrl}/chatbot/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatbot_id: this.config.chatbotId,
          message: userMessage
        })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = await response.json()
      
      // Remove loading
      this.hideLoading()
      
      // Add bot response
      this.addMessage(data.reply || 'Sorry, I encountered an error. Please try again.', 'bot')
      
    } catch (error) {
      console.error('Chatbot API Error:', error)
      this.hideLoading()
      this.addMessage('Sorry, I\'m having trouble connecting right now. Please try again later.', 'bot')
    }
    
    this.isLoading = false
  }

  private addMessage(text: string, sender: 'user' | 'bot') {
    const messagesContainer = document.getElementById(`chatbot-messages-${this.config.chatbotId}`)
    if (!messagesContainer) return
    
    const messageElement = document.createElement('div')
    messageElement.className = `chatbot-message ${sender}`
    messageElement.textContent = text
    
    messagesContainer.appendChild(messageElement)
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }

  private showLoading() {
    const messagesContainer = document.getElementById(`chatbot-messages-${this.config.chatbotId}`)
    if (!messagesContainer) return
    
    const loadingElement = document.createElement('div')
    loadingElement.className = 'chatbot-loading'
    loadingElement.id = `chatbot-loading-${this.config.chatbotId}`
    loadingElement.innerHTML = `
      <span>Typing</span>
      <div class="chatbot-loading-dots">
        <div class="chatbot-loading-dot"></div>
        <div class="chatbot-loading-dot"></div>
        <div class="chatbot-loading-dot"></div>
      </div>
    `
    
    messagesContainer.appendChild(loadingElement)
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }

  private hideLoading() {
    const loadingElement = document.getElementById(`chatbot-loading-${this.config.chatbotId}`)
    if (loadingElement) {
      loadingElement.remove()
    }
  }
}

// Auto-initialize from script tag
function initChatbotWidget() {
  const scripts = document.querySelectorAll('script[data-chatbot-id]')
  
  scripts.forEach((script) => {
    const chatbotId = script.getAttribute('data-chatbot-id')
    const apiBaseUrl = script.getAttribute('data-api-url') || 
                       (script as HTMLScriptElement).src?.replace('/widget.js', '') ||
                       'https://api.example.com'
    
    if (chatbotId && !document.querySelector(`.chatbot-widget[data-chatbot-id="${chatbotId}"]`)) {
      new ChatbotWidget({
        chatbotId,
        apiBaseUrl,
      })
    }
  })
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChatbotWidget)
} else {
  initChatbotWidget()
}

// Export for manual initialization
if (typeof window !== 'undefined') {
  window.ChatbotWidget = ChatbotWidget
}

declare global {
  interface Window {
    ChatbotWidget: typeof ChatbotWidget
    chatbotInstances: Record<string, ChatbotWidget>
  }
}

export default ChatbotWidget