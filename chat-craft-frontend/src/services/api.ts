/**
 * Axios API client configuration and interceptors
 */
import axios, { AxiosError, AxiosResponse } from 'axios'

// Get base URL from environment variables
const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com'

// Create axios instance with default configuration
export const apiClient = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth headers (for future use)
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token here when authentication is implemented
    // const token = localStorage.getItem('auth_token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    
    // Log requests in development
    if (import.meta.env.DEV) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      })
    }
    
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling and logging
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log responses in development
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      })
    }
    
    return response
  },
  (error: AxiosError) => {
    // Log errors
    console.error('❌ API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data,
    })
    
    // Handle common error scenarios
    if (error.response?.status === 401) {
      // Handle authentication errors
      // TODO: Redirect to login when auth is implemented
      console.warn('Authentication required')
    }
    
    if (error.response?.status >= 500) {
      // Handle server errors
      console.error('Server error occurred')
    }
    
    if (!error.response && error.code === 'ECONNABORTED') {
      // Handle timeout errors
      console.error('Request timeout')
    }
    
    return Promise.reject(error)
  }
)

// Helper function to extract error messages
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    if (error.response?.data?.message) {
      return error.response.data.message
    }
    if (error.response?.data?.detail) {
      return error.response.data.detail
    }
    if (error.message) {
      return error.message
    }
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  return 'An unexpected error occurred'
}

export default apiClient