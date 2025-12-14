/**
 * Dashboard Screen
 * Main dashboard displaying packages with black & gold theme
 */

import { AppColors } from '@/constants/colors';
import { getPackages } from '@/services/packages-api';
import { useAuthStore } from '@/store/auth-store';
import { Package } from '@/types/packages';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function DashboardScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async (isRefresh = false) => {
    try {
      if (!isRefresh) {
        setIsLoading(true);
      }

      const response = await getPackages(100, 0);
      setPackages(response.data.packages);
    } catch (error) {
      console.error('Error loading packages:', error);
      Alert.alert('Error', 'Failed to load packages. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadPackages(true);
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/login');
        },
      },
    ]);
  };

  const renderPackageCard = ({ item }: { item: Package }) => {
    // Format price
    const formattedPrice = `$${item.price}`;
    
    // Get asset class color
    const assetColor =
      item.asset_class === 'FOREX'
        ? '#3B82F6'
        : item.asset_class === 'CRYPTO'
        ? '#F59E0B'
        : '#22C55E';

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.assetBadge, { backgroundColor: assetColor }]}>
            <Text style={styles.assetBadgeText}>{item.asset_class}</Text>
          </View>
          <Text style={styles.cardPrice}>{formattedPrice}</Text>
        </View>

        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>

        <View style={styles.cardFooter}>
          <View style={styles.cardDetail}>
            <Text style={styles.cardDetailLabel}>Duration:</Text>
            <Text style={styles.cardDetailValue}>{item.duration_days} days</Text>
          </View>
          <View style={styles.cardDetail}>
            <Text style={styles.cardDetailLabel}>Type:</Text>
            <Text style={styles.cardDetailValue}>
              {item.duration_type.replace('_', ' ')}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={AppColors.gold} />
        <Text style={styles.loadingText}>Loading packages...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
          </View>
          {user?.profile_picture && (
            <Image
              source={{ uri: user.profile_picture }}
              style={styles.profileImage}
            />
          )}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Packages List */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Available Packages</Text>
        <Text style={styles.sectionSubtitle}>
          {packages.length} packages available
        </Text>

        <FlatList
          data={packages}
          renderItem={renderPackageCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={AppColors.gold}
              colors={[AppColors.gold]}
            />
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: AppColors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: AppColors.textSecondary,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: AppColors.backgroundElevated,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 14,
    color: AppColors.textSecondary,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.gold,
    marginTop: 4,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: AppColors.gold,
  },
  logoutButton: {
    backgroundColor: AppColors.backgroundElevated,
    borderWidth: 1,
    borderColor: AppColors.gold,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  logoutButtonText: {
    color: AppColors.gold,
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: AppColors.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: AppColors.backgroundElevated,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: AppColors.borderGold,
    shadowColor: AppColors.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  assetBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  assetBadgeText: {
    color: AppColors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  cardPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.gold,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.textPrimary,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
  },
  cardDetail: {
    flex: 1,
  },
  cardDetailLabel: {
    fontSize: 12,
    color: AppColors.textTertiary,
    marginBottom: 2,
  },
  cardDetailValue: {
    fontSize: 14,
    color: AppColors.textPrimary,
    fontWeight: '500',
  },
});

