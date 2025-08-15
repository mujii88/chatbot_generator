/**
 * React Query hook for creating chatbots
 */
import { useMutation } from '@tanstack/react-query'
import { createChatbot, mockCreateChatbot } from '@/services/chatbot'
import { getErrorMessage } from '@/services/api'
import type { CreateChatbotRequest, CreateChatbotResponse } from '@/types'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export const useCreateChatbot = () => {
  return useMutation<CreateChatbotResponse, Error, CreateChatbotRequest>({
    mutationFn: USE_MOCK ? mockCreateChatbot : createChatbot,
    onError: (error) => {
      console.error('Failed to create chatbot:', getErrorMessage(error))
    },
    onSuccess: (data) => {
      console.log('✅ Chatbot created successfully:', data)
    },
  })
}

export default useCreateChatbot