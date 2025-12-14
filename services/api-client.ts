/**
 * API Client with Auto Token Refresh
 * Axios instance configured with interceptors for automatic token refresh on 401
 */

import { ENV } from '@/config/env'
import { AuthResponse } from '@/types/auth'
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import * as SecureStorage from './secure-storage'

// Create axios instance
export const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Request interceptor - Add access token to requests
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Skip auth endpoints
    if (
      config.url?.includes('/auth/google/verify') ||
      config.url?.includes('/auth/refresh')
    ) {
      return config
    }

    // Get access token from Zustand store
    const { useAuthStore } = await import('@/store/auth-store')
    const accessToken = useAuthStore.getState().accessToken
    
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  error => Promise.reject(error)
)

// Response interceptor - Handle 401 and auto-refresh
apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // If not 401 or already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    // Don't retry auth endpoints
    if (
      originalRequest.url?.includes('/auth/google/verify') ||
      originalRequest.url?.includes('/auth/refresh')
    ) {
      return Promise.reject(error)
    }

    // If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then(() => apiClient(originalRequest))
        .catch(err => Promise.reject(err))
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      // Get refresh token from SecureStore
      const refreshToken = await SecureStorage.getRefreshToken()

      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      // Call refresh endpoint
      const response = await axios.post<AuthResponse>(
        `${ENV.API_BASE_URL}/auth/refresh`,
        {
          refresh_token: refreshToken,
          device_type: 'mobile',
        }
      )

      const { access_token, refresh_token: newRefreshToken, user, is_admin } = response.data.data

      // Update Zustand store
      const { useAuthStore } = await import('@/store/auth-store')
      useAuthStore.getState().setAccessToken(access_token)
      useAuthStore.getState().setUser(user)
      useAuthStore.getState().setIsAdmin(is_admin)

      // Update refresh token in SecureStore
      await SecureStorage.saveRefreshToken(newRefreshToken)

      console.log('✅ Token auto-refreshed successfully')

      // Update authorization header for retry
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${access_token}`
      }

      // Process queued requests
      processQueue(null, access_token)
      isRefreshing = false

      // Retry original request
      return apiClient(originalRequest)
    } catch (refreshError: any) {
      console.error('❌ Token refresh failed:', refreshError)
      
      // Clear queued requests
      processQueue(refreshError, null)
      isRefreshing = false

      // If refresh also fails with 401, clear everything and logout
      if (refreshError.response?.status === 401) {
        console.log('🔓 Session expired, logging out')
        await SecureStorage.clearAllData()

        const { useAuthStore } = await import('@/store/auth-store')
        await useAuthStore.getState().logout()
        
        // Redirect handled by AuthGuard in _layout.tsx
      }

      return Promise.reject(refreshError)
    }
  }
)

export default apiClient
