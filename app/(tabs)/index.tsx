import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome{user ? `, ${user.name}` : ''}!</ThemedText>
        <HelloWave />
      </ThemedView>

      {/* User Status */}
      {isAuthenticated && user && (
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Your Account</ThemedText>
          <ThemedView style={styles.userInfoContainer}>
            <ThemedText>✅ Signed in as {user.email}</ThemedText>
            {user.email_verified && (
              <ThemedText style={styles.verifiedText}>✓ Email verified</ThemedText>
            )}
          </ThemedView>
        </ThemedView>
      )}

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">📦 Signal Packages</ThemedText>
        <ThemedText>
          Browse our available signal packages in the{' '}
          <ThemedText type="defaultSemiBold">Packages</ThemedText> tab below.
        </ThemedText>
        <ThemedText style={styles.infoText}>
          Choose from Forex, Crypto, and PSX stock signals tailored to your trading needs.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">🚀 Getting Started</ThemedText>
        <ThemedText>
          1. Check out the <ThemedText type="defaultSemiBold">Packages</ThemedText> tab
        </ThemedText>
        <ThemedText>
          2. Select a package that fits your needs
        </ThemedText>
        <ThemedText>
          3. Start receiving trading signals
        </ThemedText>
      </ThemedView>

      {isAuthenticated && (
        <ThemedView style={styles.stepContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <ThemedText style={styles.logoutButtonText}>Logout</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 16,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  userInfoContainer: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    gap: 4,
  },
  verifiedText: {
    fontSize: 12,
    opacity: 0.7,
  },
  infoText: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
