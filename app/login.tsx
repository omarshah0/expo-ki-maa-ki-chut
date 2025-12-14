/**
 * Login Screen
 * Google OAuth authentication screen with black & gold theme
 */

import { AppColors } from '@/constants/colors';
import { verifyGoogleToken } from '@/services/auth-api';
import { extractIdToken, useGoogleAuth } from '@/services/google-auth';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { request, response, promptAsync } = useGoogleAuth();
  // const { setUser, set, setIsAdmin } = useAuthStore();
  const { setUser, setIsAdmin } = useAuthStore();


  const handleGoogleResponse = useCallback(async () => {
    try {
      console.log('📱 Google OAuth response received');
      setIsLoading(true);

      const idToken = extractIdToken(response);

      console.log('ID Token ', idToken)

      if (!idToken) {
        throw new Error('No ID token received from Google');
      }

      console.log('✅ ID token extracted, verifying with backend...');

      // Verify token with backend
      const authResponse = await verifyGoogleToken(idToken);

      console.log('✅ Backend verification successful');

      // Save to Zustand (current session)
      setUser(authResponse.data.user);
      useAuthStore.getState().setAccessToken(authResponse.data.access_token);
      setIsAdmin(authResponse.data.is_admin);

      // Save refresh token to SecureStore
      await import('@/services/secure-storage').then(async (SecureStorage) => {
        await SecureStorage.saveRefreshToken(authResponse.data.refresh_token);
      });

      console.log('💾 Tokens saved successfully');

      // Navigate to packages
      router.replace('/(tabs)/packages');
    } catch (error) {
      console.error('❌ Login error:', error);
      Alert.alert(
        'Login Failed',
        'Unable to complete login. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [response, router, setUser, setIsAdmin]);

  // Handle Google OAuth response
  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleResponse();
    } else if (response?.type === 'error') {
      Alert.alert('Authentication Error', 'Failed to sign in with Google');
      setIsLoading(false);
    }
  }, [response, handleGoogleResponse]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await promptAsync();
    } catch (error) {
      console.error('Sign in error:', error);
      Alert.alert('Error', 'Failed to initiate Google sign in');
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* App Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Trading Signals</Text>
          <Text style={styles.subtitle}>
            Forex • Crypto • PSX
          </Text>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity
          style={[
            styles.googleButton,
            (!request || isLoading) && styles.googleButtonDisabled,
          ]}
          onPress={handleGoogleSignIn}
          disabled={!request || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={AppColors.black} size="small" />
          ) : (
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
          )}
        </TouchableOpacity>

        {/* Info Text */}
        <Text style={styles.infoText}>
          Secure authentication via Google
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: AppColors.gold,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: AppColors.textSecondary,
    textAlign: 'center',
  },
  googleButton: {
    backgroundColor: AppColors.gold,
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 280,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: AppColors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  googleButtonDisabled: {
    opacity: 0.6,
  },
  googleButtonText: {
    color: AppColors.black,
    fontSize: 18,
    fontWeight: '600',
  },
  infoText: {
    marginTop: 24,
    fontSize: 14,
    color: AppColors.textTertiary,
    textAlign: 'center',
  },
});

