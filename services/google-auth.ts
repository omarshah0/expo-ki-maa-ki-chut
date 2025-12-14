/**
 * Google OAuth Service
 * Handles Google OAuth flow using expo-auth-session
 */

import { ENV } from '@/config/env'
import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'

// Complete web browser session on Android
WebBrowser.maybeCompleteAuthSession()

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: ENV.GOOGLE_CLIENT_ID_WEB, // Web client ID for expo-auth-session
    redirectUri: 'http://localhost:5173/auth/google/callback',
  })

  return {
    request,
    response,
    promptAsync,
  }
}

/**
 * Extract ID token from Google auth response
 */
export function extractIdToken(response: any): string | null {
  if (response?.type === 'success') {
    return response.params.id_token || null
  }
  return null
}
