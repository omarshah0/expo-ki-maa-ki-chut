/**
 * Packages Tab Screen
 * Displays available packages with black & gold theme
 */

import { AppColors } from '@/constants/colors';
import { getPackages } from '@/services/packages-api';
import { useAuthStore } from '@/store/auth-store';
import { Package } from '@/types/packages';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function PackagesScreen() {
  const { user, isAuthenticated } = useAuthStore();
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Only load packages if authenticated
    if (isAuthenticated) {
      loadPackages();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const loadPackages = async (isRefresh = false) => {
    try {
      if (!isRefresh) {
        setIsLoading(true);
      }

      const response = await getPackages(100, 0);
      setPackages(response.data.packages);
    } catch (error) {
      console.error('Error loading packages:', error);
      // Only show alert if user is still authenticated (not during logout/redirect)
      if (isAuthenticated) {
        Alert.alert('Error', 'Failed to load packages. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadPackages(true);
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
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.cardFooter}>
          <View style={styles.cardDetail}>
            <Text style={styles.cardDetailLabel}>Duration:</Text>
            <Text style={styles.cardDetailValue}>{item.duration_days} days</Text>
          </View>
          <View style={styles.cardDetail}>
            <Text style={styles.cardDetailLabel}>Signals/Day:</Text>
            <Text style={styles.cardDetailValue}>{item.signals_per_day}</Text>
          </View>
        </View>

        {item.features && item.features.length > 0 && (
          <View style={styles.featuresContainer}>
            {item.features.slice(0, 3).map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Text style={styles.featureBullet}>•</Text>
                <Text style={styles.featureText} numberOfLines={1}>
                  {feature}
                </Text>
              </View>
            ))}
            {item.features.length > 3 && (
              <Text style={styles.moreFeatures}>
                +{item.features.length - 3} more features
              </Text>
            )}
          </View>
        )}
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
        <View>
          <Text style={styles.headerTitle}>Signal Packages</Text>
          <Text style={styles.headerSubtitle}>
            Choose the perfect plan for your trading needs
          </Text>
        </View>
      </View>

      {/* Packages List */}
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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No packages available</Text>
          </View>
        }
      />
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
    gap: 16,
  },
  loadingText: {
    color: AppColors.textSecondary,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 70,
    backgroundColor: AppColors.background,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: AppColors.gold,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: AppColors.textSecondary,
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: AppColors.cardBackground,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
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
    paddingVertical: 6,
    borderRadius: 6,
  },
  assetBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  cardPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.gold,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.text,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: AppColors.border,
    marginBottom: 12,
  },
  cardDetail: {
    alignItems: 'center',
  },
  cardDetailLabel: {
    fontSize: 12,
    color: AppColors.textSecondary,
    marginBottom: 4,
  },
  cardDetailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.gold,
  },
  featuresContainer: {
    gap: 6,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureBullet: {
    color: AppColors.gold,
    fontSize: 16,
    fontWeight: 'bold',
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: AppColors.textSecondary,
  },
  moreFeatures: {
    fontSize: 12,
    color: AppColors.gold,
    fontStyle: 'italic',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: AppColors.textSecondary,
  },
});
