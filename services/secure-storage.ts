/**
 * Secure Storage Service
 * Handles secure storage of authentication tokens using Expo SecureStore
 * Uses hardware-backed encryption (Keychain on iOS, Keystore on Android)
 */

import * as SecureStore from 'expo-secure-store';

// Storage keys
const KEYS = {
  REFRESH_TOKEN: 'refresh_token',
} as const;


/**
 * Get refresh token from secure storage
 */
export async function getRefreshToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
}

/**
 * Save only refresh token (for when access token is managed in Zustand)
 */
export async function saveRefreshToken(refreshToken: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, refreshToken);
  } catch (error) {
    console.error('Error saving refresh token:', error);
    throw new Error('Failed to save refresh token securely');
  }
}

/**
 * Clear all stored data
 */
export async function clearAllData(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw new Error('Failed to clear storage');
  }
}

