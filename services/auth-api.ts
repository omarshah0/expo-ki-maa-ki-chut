/**
 * Authentication API Service
 * Handles authentication-related API calls
 */

import { ENV } from '@/config/env'
import {
  AuthResponse,
  GoogleVerifyPayload,
  RefreshTokenPayload,
} from '@/types/auth'
import axios from 'axios'

const API_BASE_URL = ENV.API_BASE_URL

/**
 * Verify Google ID token with backend
 */
export async function verifyGoogleToken(
  idToken: string
): Promise<AuthResponse> {
  const payload: GoogleVerifyPayload = {
    id_token: idToken,
    device_type: 'mobile',
  }

  const response = await axios.post<AuthResponse>(
    `${API_BASE_URL}/auth/google/verify`,
    payload
  )

  return response.data
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(
  refreshToken: string
): Promise<AuthResponse> {
  const payload: RefreshTokenPayload = {
    refresh_token: refreshToken,
    device_type: 'mobile',
  }

  const response = await axios.post<AuthResponse>(
    `${API_BASE_URL}/auth/refresh`,
    payload
  )

  return response.data
}
