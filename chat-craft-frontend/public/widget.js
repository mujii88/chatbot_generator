/**
 * Chatbot Widget - Standalone Script
 * This is a built version of the widget for development/demo purposes
 * In production, this would be served by your backend at /widget.js
 */

(function() {
  'use strict';

  // Widget configuration
  const DEFAULT_CONFIG = {
    apiBaseUrl: 'https://api.example.com',
    theme: 'light',
    position: 'bottom-right'
  };

  class ChatbotWidget {
    constructor(config) {
      this.config = { ...DEFAULT_CONFIG, ...config };
      this.isOpen = false;
      this.messages = [];
      this.container = null;
      this.chatWindow = null;
      this.isLoading = false;
      
      this.init();
    }

    init() {
      this.createStyles();
      this.createWidget();
      this.attachEventListeners();
    }

    createStyles() {
      if (document.getElementById('chatbot-widget-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'chatbot-widget-styles';
      style.textContent = `
        .chatbot-widget {
          position: fixed;
          z-index: 9999;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          bottom: 20px;
          right: 20px;
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
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
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
          .chatbot-widget {
            bottom: 20px;
            right: 20px;
            left: 20px;
          }
          .chatbot-window {
            width: calc(100vw - 40px);
            height: calc(100vh - 120px);
            bottom: 80px;
            right: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    createWidget() {
      this.container = document.createElement('div');
      this.container.className = 'chatbot-widget';
      
      const toggleButton = document.createElement('button');
      toggleButton.className = 'chatbot-toggle';
      toggleButton.innerHTML = '💬';
      toggleButton.onclick = () => this.toggleChat();
      
      this.chatWindow = document.createElement('div');
      this.chatWindow.className = 'chatbot-window';
      this.chatWindow.innerHTML = `
        <div class="chatbot-header">
          <div class="chatbot-title">Chat with us</div>
          <button class="chatbot-close">✕</button>
        </div>
        <div class="chatbot-messages">
          <div class="chatbot-message bot">
            👋 Hello! How can I help you today?
          </div>
        </div>
        <div class="chatbot-input-area">
          <input type="text" class="chatbot-input" placeholder="Type your message...">
          <button class="chatbot-send">Send</button>
        </div>
      `;
      
      this.container.appendChild(toggleButton);
      this.container.appendChild(this.chatWindow);
      document.body.appendChild(this.container);
      
      // Attach event listeners
      this.chatWindow.querySelector('.chatbot-close').onclick = () => this.closeChat();
      this.chatWindow.querySelector('.chatbot-send').onclick = () => this.sendMessage();
      this.chatWindow.querySelector('.chatbot-input').onkeypress = (e) => {
        if (e.key === 'Enter') this.sendMessage();
      };
    }

    attachEventListeners() {
      document.addEventListener('click', (e) => {
        if (this.isOpen && !this.container.contains(e.target)) {
          this.closeChat();
        }
      });
      
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.closeChat();
        }
      });
    }

    toggleChat() {
      this.isOpen ? this.closeChat() : this.openChat();
    }

    openChat() {
      this.chatWindow.classList.add('open');
      this.isOpen = true;
      setTimeout(() => {
        this.chatWindow.querySelector('.chatbot-input').focus();
      }, 300);
    }

    closeChat() {
      this.chatWindow.classList.remove('open');
      this.isOpen = false;
    }

    async sendMessage() {
      const input = this.chatWindow.querySelector('.chatbot-input');
      const messagesContainer = this.chatWindow.querySelector('.chatbot-messages');
      
      if (!input.value.trim() || this.isLoading) return;
      
      const userMessage = input.value.trim();
      input.value = '';
      
      this.addMessage(userMessage, 'user');
      this.showLoading();
      this.isLoading = true;
      
      try {
        // Mock API response for demo
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const responses = [
          "Thank you for your message! I'm here to help with any questions about our business.",
          "I'd be happy to assist you. Can you provide more details about what you're looking for?",
          "That's a great question! Let me help you with that information.",
          "Hello! Welcome to our chat. How can I assist you today?",
          "Based on our business information, here's what I can tell you..."
        ];
        
        const reply = responses[Math.floor(Math.random() * responses.length)];
        
        this.hideLoading();
        this.addMessage(reply, 'bot');
        
      } catch (error) {
        console.error('Chatbot Error:', error);
        this.hideLoading();
        this.addMessage('Sorry, I\'m having trouble connecting right now. Please try again later.', 'bot');
      }
      
      this.isLoading = false;
    }

    addMessage(text, sender) {
      const messagesContainer = this.chatWindow.querySelector('.chatbot-messages');
      const messageElement = document.createElement('div');
      messageElement.className = `chatbot-message ${sender}`;
      messageElement.textContent = text;
      
      messagesContainer.appendChild(messageElement);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showLoading() {
      const messagesContainer = this.chatWindow.querySelector('.chatbot-messages');
      const loadingElement = document.createElement('div');
      loadingElement.className = 'chatbot-loading';
      loadingElement.innerHTML = `
        <span>Typing</span>
        <div class="chatbot-loading-dots">
          <div class="chatbot-loading-dot"></div>
          <div class="chatbot-loading-dot"></div>
          <div class="chatbot-loading-dot"></div>
        </div>
      `;
      
      messagesContainer.appendChild(loadingElement);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideLoading() {
      const loadingElement = this.chatWindow.querySelector('.chatbot-loading');
      if (loadingElement) {
        loadingElement.remove();
      }
    }
  }

  // Auto-initialize from script tag
  function initChatbotWidget() {
    const scripts = document.querySelectorAll('script[data-chatbot-id]');
    
    scripts.forEach((script) => {
      const chatbotId = script.getAttribute('data-chatbot-id');
      const apiBaseUrl = script.getAttribute('data-api-url') || 
                         script.src.replace('/widget.js', '') ||
                         'https://api.example.com';
      
      if (chatbotId && !document.querySelector('.chatbot-widget')) {
        new ChatbotWidget({
          chatbotId,
          apiBaseUrl,
        });
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbotWidget);
  } else {
    initChatbotWidget();
  }

  // Export for manual use
  window.ChatbotWidget = ChatbotWidget;

})();