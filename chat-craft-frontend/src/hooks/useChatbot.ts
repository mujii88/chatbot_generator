/**
 * React Query hooks for chatbot interactions
 */
import { useMutation, useQuery } from '@tanstack/react-query'
import { sendMessage, getChatbotInfo, mockSendMessage, mockGetChatbotInfo } from '@/services/chatbot'
import { getErrorMessage } from '@/services/api'
import type { ChatRequest, ChatResponse, ChatbotInfo } from '@/types'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * Hook for sending messages to a chatbot
 */
export const useSendMessage = () => {
  return useMutation<ChatResponse, Error, ChatRequest>({
    mutationFn: USE_MOCK ? mockSendMessage : sendMessage,
    onError: (error) => {
      console.error('Failed to send message:', getErrorMessage(error))
    },
  })
}

/**
 * Hook for getting chatbot information
 */
export const useChatbotInfo = (chatbotId: string | null) => {
  return useQuery<ChatbotInfo, Error>({
    queryKey: ['chatbot-info', chatbotId],
    queryFn: () => {
      if (!chatbotId) throw new Error('Chatbot ID is required')
      return USE_MOCK ? mockGetChatbotInfo(chatbotId) : getChatbotInfo(chatbotId)
    },
    enabled: !!chatbotId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime in v4)
  })
}