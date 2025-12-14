/**
 * Environment Configuration Example
 * 
 * Instructions:
 * 1. Copy this file to config/env.ts
 * 2. Replace the placeholder values with your actual configuration
 * 3. Get Google OAuth credentials from: https://console.cloud.google.com/
 * 
 * For Google OAuth Setup:
 * - Create OAuth 2.0 Client IDs for Web, Android, and iOS
 * - For iOS: Also update the reversedClientId in app.json
 * - For Android: Add SHA-1 fingerprint to Google Console
 */

export const ENV = {
  // API Configuration
  // For iOS Simulator: Use your Mac's IP address (not localhost)
  // For Android Emulator: Use 10.0.2.2:8080
  API_BASE_URL: 'http://localhost:8080',

  // Google OAuth Client IDs
  GOOGLE_CLIENT_ID_WEB: 'your-web-client-id.apps.googleusercontent.com',
  GOOGLE_CLIENT_ID_ANDROID: 'your-android-client-id.apps.googleusercontent.com',
  GOOGLE_CLIENT_ID_IOS: 'your-ios-client-id.apps.googleusercontent.com',

  // Google Refresh Token (for development/testing only)
  // In production, users will get refresh tokens through OAuth login
  GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN || '',
};

