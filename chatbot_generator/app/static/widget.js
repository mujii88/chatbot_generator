(function() {
    const scriptTag = document.querySelector('script[data-chatbot-id]');
    const chatbotId = scriptTag ? scriptTag.getAttribute('data-chatbot-id') : null;
    
    if (!chatbotId) {
        console.error('Chatbot ID not found. Please add data-chatbot-id to your script tag.');
        return;
    }

    const API_BASE = window.location.hostname === 'localhost' 
        ? 'http://localhost:8000' 
        : 'https://your-backend-domain.com';

    const widgetHTML = `
        <div id="chatbot-widget" style="position: fixed; bottom: 20px; right: 20px; z-index: 99999; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <!-- Chat Button -->
            <div id="chat-button" style="
                width: 60px; 
                height: 60px; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                border-radius: 50%; 
                cursor: pointer; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                border: none;
                outline: none;
            " onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 8px 25px rgba(102, 126, 234, 0.5)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 20px rgba(102, 126, 234, 0.4)'">
                <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                </svg>
            </div>

            <!-- Chat Window -->
            <div id="chat-window" style="
                display: none;
                width: 350px;
                max-width: calc(100vw - 40px);
                height: 550px;
                max-height: calc(100vh - 100px);
                background: white;
                border-radius: 16px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.1), 0 8px 25px rgba(0,0,0,0.1);
                position: fixed;
                bottom: 90px;
                right: 20px;
                overflow: hidden;
                border: 1px solid rgba(0,0,0,0.1);
                animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            ">
                <!-- Header -->
                <div id="chat-header" style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 20px;
                    font-weight: 600;
                    position: relative;
                    font-size: 16px;
                ">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 8px; height: 8px; background: #4ade80; border-radius: 50%; animation: pulse 2s infinite;"></div>
                        <span>Chat Support</span>
                    </div>
                    <div id="close-chat" style="
                        position: absolute;
                        top: 50%;
                        right: 20px;
                        transform: translateY(-50%);
                        cursor: pointer;
                        font-size: 24px;
                        line-height: 1;
                        width: 32px;
                        height: 32px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 50%;
                        transition: background-color 0.2s;
                    " onmouseover="this.style.backgroundColor='rgba(255,255,255,0.2)'" onmouseout="this.style.backgroundColor='transparent'">&times;</div>
                </div>

                <!-- Messages -->
                <div id="chat-messages" style="
                    height: calc(100% - 140px);
                    overflow-y: auto;
                    padding: 20px;
                    background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                ">
                    <div class="bot-message" style="
                        background: white;
                        padding: 12px 16px;
                        border-radius: 18px 18px 18px 4px;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        max-width: 85%;
                        align-self: flex-start;
                        font-size: 14px;
                        line-height: 1.4;
                        border: 1px solid rgba(0,0,0,0.05);
                    ">
                        👋 Hi! I'm here to help. How can I assist you today?
                    </div>
                </div>

                <!-- Input -->
                <div id="chat-input-container" style="
                    padding: 20px;
                    background: white;
                    border-top: 1px solid rgba(0,0,0,0.1);
                    display: flex;
                    gap: 12px;
                    align-items: flex-end;
                ">
                    <input type="text" id="chat-input" placeholder="Type your message..." style="
                        flex: 1;
                        padding: 12px 16px;
                        border: 2px solid #e2e8f0;
                        border-radius: 24px;
                        outline: none;
                        font-size: 14px;
                        transition: border-color 0.2s;
                        background: #f8fafc;
                    " onfocus="this.style.borderColor='#667eea'; this.style.backgroundColor='white'" onblur="this.style.borderColor='#e2e8f0'; this.style.backgroundColor='#f8fafc'">
                    <button id="send-button" style="
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border: none;
                        border-radius: 50%;
                        width: 44px;
                        height: 44px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.2s;
                        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" disabled>
                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <style>
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
            
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
            
            #chat-messages::-webkit-scrollbar {
                width: 6px;
            }
            
            #chat-messages::-webkit-scrollbar-track {
                background: transparent;
            }
            
            #chat-messages::-webkit-scrollbar-thumb {
                background: rgba(0,0,0,0.2);
                border-radius: 3px;
            }
            
            #chat-messages::-webkit-scrollbar-thumb:hover {
                background: rgba(0,0,0,0.3);
            }
            
            @media (max-width: 480px) {
                #chat-window {
                    width: calc(100vw - 20px) !important;
                    height: calc(100vh - 120px) !important;
                    right: 10px !important;
                    bottom: 80px !important;
                    border-radius: 12px !important;
                }
                
                #chatbot-widget {
                    right: 15px !important;
                    bottom: 15px !important;
                }
            }
        </style>
    `;

    document.body.insertAdjacentHTML('beforeend', widgetHTML);

    const chatButton = document.getElementById('chat-button');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');

    let isOpen = false;

    // Enable/disable send button based on input
    function toggleSendButton() {
        const hasText = chatInput.value.trim().length > 0;
        sendButton.disabled = !hasText;
        sendButton.style.opacity = hasText ? '1' : '0.5';
        sendButton.style.cursor = hasText ? 'pointer' : 'not-allowed';
    }

    chatInput.addEventListener('input', toggleSendButton);
    toggleSendButton(); // Initial state

    function toggleChat() {
        isOpen = !isOpen;
        if (isOpen) {
            chatWindow.style.display = 'block';
            setTimeout(() => chatInput.focus(), 100);
        } else {
            chatWindow.style.display = 'none';
        }
    }

    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        const borderRadius = isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px';
        const alignment = isUser ? 'flex-end' : 'flex-start';
        
        messageDiv.style.cssText = `
            background: ${isUser ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white'};
            color: ${isUser ? 'white' : '#1a202c'};
            padding: 12px 16px;
            border-radius: ${borderRadius};
            max-width: 85%;
            align-self: ${alignment};
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.4;
            border: 1px solid ${isUser ? 'transparent' : 'rgba(0,0,0,0.05)'};
        `;
        messageDiv.textContent = message;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function sendMessage(message) {
        if (!message.trim()) return;

        addMessage(message, true);
        chatInput.value = '';
        toggleSendButton();

        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.style.cssText = `
            background: white;
            padding: 12px 16px;
            border-radius: 18px 18px 18px 4px;
            max-width: 85%;
            align-self: flex-start;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            color: #64748b;
            font-style: italic;
            font-size: 14px;
            border: 1px solid rgba(0,0,0,0.05);
        `;
        typingDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <div style="display: flex; gap: 4px;">
                    <div style="width: 6px; height: 6px; background: #94a3b8; border-radius: 50%; animation: bounce 1.4s infinite ease-in-out both; animation-delay: -0.32s;"></div>
                    <div style="width: 6px; height: 6px; background: #94a3b8; border-radius: 50%; animation: bounce 1.4s infinite ease-in-out both; animation-delay: -0.16s;"></div>
                    <div style="width: 6px; height: 6px; background: #94a3b8; border-radius: 50%; animation: bounce 1.4s infinite ease-in-out both;"></div>
                </div>
                <span>Thinking...</span>
            </div>
            <style>
                @keyframes bounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1); }
                }
            </style>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const response = await fetch(`${API_BASE}/chatbot/respond`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chatbot_id: chatbotId,
                    message: message
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            const typing = document.getElementById('typing-indicator');
            if (typing) typing.remove();

            addMessage(data.reply, false);

        } catch (error) {
            console.error('Error sending message:', error);
            
            const typing = document.getElementById('typing-indicator');
            if (typing) typing.remove();

            addMessage('Sorry, I encountered an error. Please check that the backend is running and try again.', false);
        }
    }

    chatButton.addEventListener('click', toggleChat);
    closeChat.addEventListener('click', toggleChat);
    sendButton.addEventListener('click', () => {
        if (!sendButton.disabled) {
            sendMessage(chatInput.value);
        }
    });
    
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !sendButton.disabled) {
            sendMessage(chatInput.value);
        }
    });

})();