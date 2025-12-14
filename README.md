# Forex, Crypto & PSX Signals App

A React Native app built with Expo for delivering trading signals for Forex, Cryptocurrency, and Pakistan Stock Exchange (PSX).

## Features

- 🔐 **Authentication** - Automatic token refresh with secure storage
- 📦 **Packages** - Browse and view signal packages
- 🎨 **Black & Gold Theme** - Premium, elegant design
- 📱 **Tab Navigation** - Easy access to all features
- 🔄 **Pull to Refresh** - Stay updated with latest data

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 2. Configure Environment

Copy and update the environment configuration:

```bash
cp config/env.example.ts config/env.ts
```

Update `config/env.ts` with your settings:
- API base URL
- Google OAuth client IDs
- (Optional) Refresh token for testing

### 3. Start the App

```bash
pnpm start
# or
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app

## Project Structure

```
app/
  _layout.tsx           → Root layout with auth guard
  (tabs)/               → Bottom tab navigation
    index.tsx           → Home screen
    packages.tsx        → Packages list
    login.tsx           → Login screen
    explore.tsx         → Explore screen
  dashboard.tsx         → Dashboard (standalone)
  login.tsx             → Login (standalone)

services/
  auth-api.ts           → Authentication API
  packages-api.ts       → Packages API
  api-client.ts         → HTTP client
  secure-storage.ts     → Token storage
  google-auth.ts        → Google OAuth

store/
  auth-store.ts         → Global auth state (Zustand)

config/
  env.ts                → Environment configuration

constants/
  colors.ts             → App colors (Black & Gold theme)
  theme.ts              → Theme configuration
```

## Authentication

The app uses refresh token-based authentication:

1. **First Launch**: Uses refresh token from env (if provided)
2. **Subsequent Launches**: Uses stored refresh token from SecureStore
3. **Automatic Refresh**: Gets new access token on every launch
4. **Secure Storage**: Tokens encrypted with hardware-backed storage

See [AUTHENTICATION.md](./AUTHENTICATION.md) for details.

## Available Screens

### Tab Navigation

- **Home** 🏠 - Welcome screen with user info
- **Packages** 📦 - Browse signal packages
- **Login** 👤 - Authentication screen
- **Explore** ✈️ - Explore features

### Standalone Screens

- **Dashboard** - Full dashboard view (alternative to tabs)

## API Configuration

Update `config/env.ts`:

```typescript
export const ENV = {
  // For iOS Simulator: Use your Mac's IP (not localhost)
  // For Android Emulator: Use 10.0.2.2:8080
  API_BASE_URL: 'http://YOUR_IP:8080',
  
  // Google OAuth Client IDs
  GOOGLE_CLIENT_ID_WEB: 'your-client-id',
  GOOGLE_CLIENT_ID_ANDROID: 'your-client-id',
  GOOGLE_CLIENT_ID_IOS: 'your-client-id',
  
  // Optional: For testing
  GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN || '',
};
```

## Color Theme

Black & Gold theme with:
- **Primary**: Gold (#D4AF37)
- **Background**: Dark Black (#0A0A0A)
- **Text**: White with gold accents
- **Status**: Success (Green), Error (Red), Warning (Orange)

## Scripts

```bash
pnpm start          # Start Expo dev server
pnpm run android    # Run on Android
pnpm run ios        # Run on iOS
pnpm run web        # Run on web
pnpm run lint       # Run ESLint
```

## Tech Stack

- **Framework**: React Native + Expo
- **Routing**: Expo Router (file-based)
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Storage**: Expo SecureStore
- **Auth**: Google OAuth (expo-auth-session)
- **UI**: React Native components

## Development Tips

### iOS Simulator Network

Localhost doesn't work from iOS simulator. Use your Mac's IP:

```bash
# Get your IP
ipconfig getifaddr en0

# Update API_BASE_URL in config/env.ts
API_BASE_URL: 'http://192.168.1.100:8080'
```

### Android Emulator Network

Use the special Android emulator alias:

```typescript
API_BASE_URL: 'http://10.0.2.2:8080'
```

### Hot Reload

- Shake device or press `Cmd+D` (iOS) / `Cmd+M` (Android)
- Enable Fast Refresh in dev menu

## Documentation

- [AUTHENTICATION.md](./AUTHENTICATION.md) - Auth system details
- [QUICK_START.md](./QUICK_START.md) - Quick start guide
- [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) - Setup checklist
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Project structure

## Troubleshooting

### "Network Error"
- Check API_BASE_URL configuration
- Use IP address, not localhost (for simulators)
- Ensure backend is running

### "No refresh token found"
- Add GOOGLE_REFRESH_TOKEN to env
- Or login through OAuth

### Build Errors
- Clear cache: `npx expo start -c`
- Reinstall: `rm -rf node_modules && pnpm install`

## License

Private - All rights reserved
