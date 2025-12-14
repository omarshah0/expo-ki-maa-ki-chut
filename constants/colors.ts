/**
 * Black & Gold Color Theme
 * Based on oklch color system from web app
 */

// Primary Gold Colors (converted from oklch)
export const AppColors = {
  // Gold variations
  gold: '#D4AF37',       // oklch(0.7 0.15 85) - Main gold
  goldLight: '#E5C158',  // oklch(0.75 0.18 85) - Lighter gold for highlights
  goldDark: '#B8941E',   // oklch(0.65 0.12 85) - Darker gold for depth
  
  // Black & Background
  black: '#000000',
  background: '#0A0A0A',
  backgroundElevated: '#141414',
  cardBackground: '#141414',
  
  // Text colors
  text: '#FFFFFF',
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textTertiary: '#707070',
  
  // UI Elements
  border: '#2A2A2A',
  borderGold: '#D4AF37',
  
  // Status colors
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  // Opacity variants for gold
  goldOpacity: {
    10: 'rgba(212, 175, 55, 0.1)',
    20: 'rgba(212, 175, 55, 0.2)',
    30: 'rgba(212, 175, 55, 0.3)',
    50: 'rgba(212, 175, 55, 0.5)',
    70: 'rgba(212, 175, 55, 0.7)',
  },
};

// Gradient definitions for use with LinearGradient
export const Gradients = {
  gold: [AppColors.goldLight, AppColors.gold, AppColors.goldDark],
  goldHorizontal: [AppColors.goldDark, AppColors.gold],
  darkBackground: [AppColors.background, AppColors.backgroundElevated],
};

// Shadow styles for elevated elements
export const Shadows = {
  small: {
    shadowColor: AppColors.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: AppColors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: AppColors.gold,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

