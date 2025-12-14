import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import 'react-native-reanimated';

import { AppColors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { refreshAccessToken } from '@/services/auth-api';
import * as SecureStorage from '@/services/secure-storage';
import { useAuthStore } from '@/store/auth-store';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isInitialized, setUser, setAccessToken, setIsAdmin, setInitialized } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  const initializeAuth = useCallback(async () => {
    try {
      // Check if refresh token exists in SecureStore
      const refreshToken = await SecureStorage.getRefreshToken();
      
      if (refreshToken) {
        // Try to refresh tokens and get user profile
        try {
          console.log('🔄 Refreshing access token...');
          const authResponse = await refreshAccessToken(refreshToken);
          
          console.log('✅ Token refreshed successfully');
          console.log('👤 User:', authResponse.data.user.email);
          
          // Save to Zustand (current session)
          setUser(authResponse.data.user);
          setIsAdmin(authResponse.data.is_admin);
          setAccessToken(authResponse.data.access_token);
          
          // Update refresh token in SecureStore
          await SecureStorage.saveRefreshToken(authResponse.data.refresh_token);
          
          console.log('💾 Tokens updated successfully');
        } catch (error: any) {
          console.error('❌ Token refresh failed:', error);
          
          // If refresh fails with 401, clear everything and go to login
          if (error.response?.status === 401) {
            console.log('🔓 Session expired, redirecting to login');
            await SecureStorage.clearAllData();
          }
        }
      } else {
        console.log('⚠️ No refresh token found - user needs to login');
      }
    } catch (error) {
      console.error('❌ Auth initialization error:', error);
    } finally {
      setInitialized(true);
      setIsChecking(false);
    }
  }, [setUser, setAccessToken, setIsAdmin, setInitialized]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isInitialized) return;

    console.log('🔍 Auth check - isAuthenticated:', isAuthenticated, 'segments:', segments);

    // Check if we're on a login screen (either standalone or in tabs)
    const isOnLoginScreen = 
      segments[0] === 'login' || 
      (segments[0] === '(tabs)' && segments[1] === 'login');

    if (!isAuthenticated && !isOnLoginScreen) {
      // User not authenticated, redirect to login immediately
      console.log('🔓 Not authenticated, redirecting to login from:', segments.join('/'));
      
      // Use setTimeout to ensure navigation happens after render
      setTimeout(() => {
        router.replace('/(tabs)/login');
      }, 0);
    } else if (isAuthenticated && isOnLoginScreen) {
      // User is authenticated but on login screen, redirect to packages
      console.log('✅ Authenticated, redirecting to packages');
      setTimeout(() => {
        router.replace('/(tabs)/packages');
      }, 0);
    }
  }, [isAuthenticated, isInitialized, segments, router]);

  if (isChecking || !isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={AppColors.gold} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthGuard>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="dashboard" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
      </AuthGuard>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: AppColors.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: AppColors.textSecondary,
    fontSize: 16,
  },
});
