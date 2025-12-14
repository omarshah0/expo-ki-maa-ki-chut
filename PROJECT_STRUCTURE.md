# 📁 Project Structure

Complete overview of the Trading Signals React Native app structure.

---

## 🗂️ Directory Tree

```
expo-rn/
│
├── 📱 app/                          # Expo Router screens
│   ├── _layout.tsx                 # ✅ Root layout with auth guard
│   ├── login.tsx                   # ✅ Google OAuth login screen
│   ├── dashboard.tsx               # ✅ Main dashboard with packages
│   ├── modal.tsx                   # (existing) Modal example
│   └── (tabs)/                     # Tab navigation group
│       ├── _layout.tsx             # Tab bar layout
│       ├── index.tsx               # Home tab
│       └── explore.tsx             # Explore tab
│
├── 🎨 assets/                       # Static assets
│   └── images/                     # App icons, splash screens
│
├── 🧩 components/                   # Reusable UI components
│   ├── ui/                         # Basic UI components
│   ├── external-link.tsx
│   ├── haptic-tab.tsx
│   ├── hello-wave.tsx
│   ├── parallax-scroll-view.tsx
│   ├── themed-text.tsx
│   └── themed-view.tsx
│
├── ⚙️ config/                       # Configuration files
│   ├── env.ts                      # ✅ Environment variables (Google OAuth)
│   └── env.example.ts              # ✅ Example configuration
│
├── 🎨 constants/                    # Constants and theme
│   ├── colors.ts                   # ✅ Black & Gold color system
│   └── theme.ts                    # ✅ Theme configuration
│
├── 🪝 hooks/                        # Custom React hooks
│   ├── use-color-scheme.ts         # Dark/light mode hook
│   ├── use-color-scheme.web.ts     # Web-specific
│   └── use-theme-color.ts          # Theme color hook
│
├── 🔌 services/                     # API and external services
│   ├── api-client.ts               # ✅ Axios with auto token refresh
│   ├── auth-api.ts                 # ✅ Auth endpoints (verify, refresh)
│   ├── packages-api.ts             # ✅ Packages endpoint
│   ├── google-auth.ts              # ✅ Google OAuth flow
│   └── secure-storage.ts           # ✅ Token storage (Keychain/Keystore)
│
├── 📦 store/                        # State management
│   └── auth-store.ts               # ✅ Zustand auth state
│
├── 📝 types/                        # TypeScript type definitions
│   ├── auth.ts                     # ✅ User, AuthResponse types
│   └── packages.ts                 # ✅ Package, AssetClass types
│
├── 📚 Documentation/
│   ├── AUTH_SETUP.md               # ✅ Detailed Google OAuth setup guide
│   ├── IMPLEMENTATION_SUMMARY.md   # ✅ What was built and why
│   ├── QUICKSTART.md               # ✅ 5-minute quick start
│   ├── SETUP_CHECKLIST.md          # ✅ Pre-launch checklist
│   └── PROJECT_STRUCTURE.md        # ✅ This file
│
├── 📄 Configuration Files
│   ├── app.json                    # ✅ Expo configuration
│   ├── package.json                # ✅ Dependencies
│   ├── tsconfig.json               # TypeScript config
│   ├── eslint.config.js            # ESLint config
│   ├── pnpm-lock.yaml              # Lock file
│   ├── pnpm-workspace.yaml         # Workspace config
│   └── expo-env.d.ts               # Expo type definitions
│
└── 🛠️ scripts/
    └── reset-project.js            # Project reset script
```

---

## 🔐 Authentication Flow Files

### Entry Point
```
app/_layout.tsx
  └── AuthGuard component
      ├── Checks secure storage for refresh token
      ├── Attempts auto-login if token exists
      └── Routes to login or dashboard
```

### Login Flow
```
app/login.tsx
  └── Uses services/google-auth.ts
      └── Calls services/auth-api.ts (verifyGoogleToken)
          └── Saves to services/secure-storage.ts
              └── Updates store/auth-store.ts
                  └── Routes to dashboard
```

### API Calls
```
app/dashboard.tsx
  └── Uses services/packages-api.ts
      └── Uses services/api-client.ts (Axios)
          ├── Request Interceptor: Adds access token
          └── Response Interceptor: Auto-refreshes on 401
              └── Calls services/auth-api.ts (refreshAccessToken)
                  └── Updates services/secure-storage.ts
```

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        App Start                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
           ┌──────────────────┐
           │  app/_layout.tsx  │ (Auth Guard)
           └────────┬───────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
   No Token               Has Token
        │                       │
        │                       ▼
        │            ┌─────────────────┐
        │            │ secure-storage  │
        │            └────────┬────────┘
        │                     │
        │                     ▼
        │            ┌─────────────────┐
        │            │   auth-api      │ (refresh)
        │            └────────┬────────┘
        │                     │
        │             ┌───────┴────────┐
        │             │                │
        │         Success          Failed
        │             │                │
        ▼             ▼                ▼
   ┌────────────────────┐      ┌──────────────┐
   │   app/login.tsx    │◄─────│  Clear Tokens│
   └────────┬───────────┘      └──────────────┘
            │
            │ (Google OAuth)
            ▼
   ┌────────────────────┐
   │  google-auth.ts    │
   └────────┬───────────┘
            │
            ▼
   ┌────────────────────┐
   │    auth-api.ts     │ (verify)
   └────────┬───────────┘
            │
            ▼
   ┌────────────────────┐
   │  secure-storage    │ (save tokens)
   └────────┬───────────┘
            │
            ▼
   ┌────────────────────┐
   │   auth-store.ts    │ (update state)
   └────────┬───────────┘
            │
            ▼
   ┌────────────────────┐
   │  app/dashboard.tsx │
   └────────────────────┘
```

---

## 🎨 UI Component Hierarchy

```
app/_layout.tsx (Root)
  │
  ├── StatusBar (light mode)
  │
  ├── ThemeProvider (dark theme)
  │   │
  │   └── AuthGuard
  │       │
  │       ├── Loading State
  │       │   └── ActivityIndicator (gold)
  │       │
  │       └── Stack Navigator
  │           │
  │           ├── login.tsx (public)
  │           │   ├── View (black background)
  │           │   ├── Title (gold text)
  │           │   ├── Subtitle (gray text)
  │           │   └── TouchableOpacity (gold button)
  │           │
  │           └── dashboard.tsx (protected)
  │               ├── Header
  │               │   ├── Welcome text + user name
  │               │   ├── Profile image (circular)
  │               │   └── Logout button
  │               │
  │               └── FlatList (packages)
  │                   └── Card (for each package)
  │                       ├── Asset badge (colored)
  │                       ├── Price (gold, large)
  │                       ├── Name (white)
  │                       ├── Description (gray)
  │                       └── Duration info
```

---

## 🔄 State Management

### Zustand Store (`store/auth-store.ts`)

```typescript
AuthState {
  // User state
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isAdmin: boolean
  
  // UI state
  isLoading: boolean
  isInitialized: boolean
  
  // Actions
  setUser(user)
  setTokens(access, refresh)
  setIsAdmin(isAdmin)
  setLoading(loading)
  setInitialized(initialized)
  logout()
  initialize()
}
```

### Usage in Components
```typescript
// Read state
const { user, isAuthenticated } = useAuthStore();

// Call actions
const { setUser, logout } = useAuthStore();
```

---

## 🔐 Security Architecture

### Token Storage Chain
```
User Logs In
  │
  ▼
Backend Returns Tokens
  │
  ▼
services/secure-storage.ts
  │
  ├── iOS: Keychain (hardware-backed)
  └── Android: Keystore (hardware-backed)
```

### Token Refresh Flow
```
API Call → 401 Error
  │
  ▼
api-client.ts Interceptor
  │
  ├── Get refresh token from secure storage
  ├── Call /auth/refresh endpoint
  ├── Save new tokens
  └── Retry original request
      │
      ├── Success → Return data
      └── Failed → Logout user
```

---

## 📝 Key Files Explained

### `app/_layout.tsx` (Root Layout + Auth Guard)
- **Purpose**: App entry point with authentication logic
- **Key Features**:
  - Checks for stored refresh token on startup
  - Auto-refreshes token if available
  - Routes to login or dashboard based on auth state
  - Shows loading screen during initialization

### `services/api-client.ts` (Axios Instance)
- **Purpose**: Centralized API client with auto token refresh
- **Key Features**:
  - Request interceptor: Adds Bearer token
  - Response interceptor: Handles 401 errors
  - Automatic token refresh and request retry
  - Prevents multiple simultaneous refresh attempts
  - Graceful logout on refresh failure

### `services/secure-storage.ts` (Token Management)
- **Purpose**: Secure storage wrapper for tokens
- **Key Features**:
  - Uses Expo SecureStore (Keychain/Keystore)
  - Hardware-backed encryption
  - Simple async API
  - Error handling

### `store/auth-store.ts` (Global State)
- **Purpose**: Global authentication state
- **Key Features**:
  - User data and authentication status
  - Loading and initialization states
  - Actions for login, logout, token management
  - Persists to secure storage

### `constants/colors.ts` (Theme)
- **Purpose**: Black & Gold color system
- **Key Features**:
  - Converts oklch colors to RGB
  - Consistent color palette
  - Opacity variants
  - Shadow definitions

---

## 🚀 Adding New Features

### Add a New Protected Screen

1. **Create screen**: `app/my-screen.tsx`
2. **Add route**: Already protected by auth guard
3. **Use API**: Import from `services/`
4. **Use state**: Import `useAuthStore()`
5. **Style**: Import `AppColors` from `constants/colors`

### Add a New API Endpoint

1. **Create service**: `services/my-api.ts`
2. **Import client**: `import apiClient from './api-client'`
3. **Make calls**: Auto token refresh included
4. **Export functions**: Use in components

### Add a New Type

1. **Create file**: `types/my-type.ts`
2. **Define interfaces**: Use TypeScript
3. **Export types**: Import where needed

---

## 📦 Dependencies Overview

### Production Dependencies
- `expo` - Expo framework
- `expo-router` - File-based routing
- `react` / `react-native` - UI framework
- `zustand` - State management
- `axios` - HTTP client
- `expo-auth-session` - OAuth flow
- `expo-secure-store` - Token storage
- `expo-crypto` - Cryptography
- `@react-navigation/*` - Navigation libraries

### Development Dependencies
- `typescript` - Type checking
- `eslint` - Code linting
- `@types/*` - Type definitions

---

## 🎯 File Purposes Quick Reference

| File | Purpose | Status |
|------|---------|--------|
| `app/_layout.tsx` | Auth guard & routing | ✅ Complete |
| `app/login.tsx` | Google OAuth login | ✅ Complete |
| `app/dashboard.tsx` | Main dashboard | ✅ Complete |
| `services/api-client.ts` | API client with interceptors | ✅ Complete |
| `services/auth-api.ts` | Auth endpoints | ✅ Complete |
| `services/packages-api.ts` | Packages endpoint | ✅ Complete |
| `services/google-auth.ts` | Google OAuth | ✅ Complete |
| `services/secure-storage.ts` | Token storage | ✅ Complete |
| `store/auth-store.ts` | Auth state | ✅ Complete |
| `types/auth.ts` | Auth types | ✅ Complete |
| `types/packages.ts` | Package types | ✅ Complete |
| `constants/colors.ts` | Theme colors | ✅ Complete |
| `config/env.ts` | Configuration | ✅ Complete |

---

## 🔍 Finding Things

**Need to change colors?**  
→ `constants/colors.ts`

**Need to add an API endpoint?**  
→ Create new file in `services/`

**Need to add a screen?**  
→ Create file in `app/`

**Need to change auth flow?**  
→ `app/_layout.tsx` and `store/auth-store.ts`

**Need to change API base URL?**  
→ `config/env.ts`

**Need to add types?**  
→ Create file in `types/`

**Need to change Google OAuth config?**  
→ `config/env.ts` and `app.json`

---

## 📚 Further Reading

- **Getting Started**: See `QUICKSTART.md`
- **Setup Guide**: See `AUTH_SETUP.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
- **Pre-Launch Checks**: See `SETUP_CHECKLIST.md`

---

**Last Updated**: December 14, 2025  
**Version**: 1.0.0  
**Author**: Built according to plan specifications

