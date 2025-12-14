# Authentication System

## Overview

The app uses a refresh token-based authentication system with automatic token management.

## How It Works

### 1. Authentication Flow

```
App Starts
    ↓
Check SecureStore for refresh_token
    ↓
If found → Call POST /auth/refresh
    ↓
Receive: { user, access_token, refresh_token, is_admin }
    ↓
Save to:
  - Zustand: user, access_token, is_admin (current session)
  - SecureStore: refresh_token (persistent)
    ↓
User authenticated → Show app content
```

### 2. State Management

**Zustand Store** (in-memory, current session only):
- `user` - User profile
- `accessToken` - For API calls
- `isAuthenticated` - Boolean flag
- `isAdmin` - Admin status

**SecureStore** (encrypted, persistent):
- `refresh_token` - For future app launches

## File Structure

```
app/
  _layout.tsx         → Auth guard & initialization
  (tabs)/
    index.tsx         → Home screen
    packages.tsx      → Packages list
    login.tsx         → Login screen
    explore.tsx       → Explore screen

services/
  auth-api.ts         → Auth API calls
  secure-storage.ts   → Token storage
  api-client.ts       → HTTP client with auth

store/
  auth-store.ts       → Global auth state (Zustand)

config/
  env.ts              → Environment configuration
```

## Development Setup

### Option 1: Using Refresh Token (Testing)

For development/testing, you can use a refresh token directly:

1. Get a refresh token from your backend
2. Add to `.env` or `omar.env`:
   ```bash
   GOOGLE_REFRESH_TOKEN=your_refresh_token_here
   ```
3. Token will be used on first launch
4. New refresh tokens saved to SecureStore automatically

### Option 2: OAuth Flow (Production)

Users authenticate through Google OAuth:

1. User taps "Sign in with Google"
2. Google OAuth flow completes
3. Backend validates and returns tokens
4. Tokens saved automatically

## API Integration

### Using Access Token

The `api-client.ts` automatically includes the access token:

```typescript
import { apiClient } from '@/services/api-client';

// Access token added automatically
const response = await apiClient.get('/api/packages');
```

### Manual Token Access

```typescript
import { useAuthStore } from '@/store/auth-store';

const { accessToken, user } = useAuthStore();
```

## Token Lifecycle

### Access Token
- **Storage**: Zustand (memory)
- **Duration**: Current session only
- **Usage**: API requests
- **Refresh**: Every app launch

### Refresh Token
- **Storage**: SecureStore (encrypted)
- **Duration**: 7 days (typical)
- **Usage**: Get new access token
- **Refresh**: Updated every app launch

## Security Features

✅ **Hardware Encryption** - SecureStore uses Keychain (iOS) / Keystore (Android)
✅ **Memory Only** - Access token never written to disk
✅ **Automatic Cleanup** - Tokens cleared on logout
✅ **Token Rotation** - New refresh token on every refresh

## Common Operations

### Logout

```typescript
import { useAuthStore } from '@/store/auth-store';

await useAuthStore.getState().logout();
// Clears all tokens and redirects to login
```

### Check Authentication

```typescript
const { isAuthenticated, user } = useAuthStore();

if (isAuthenticated) {
  console.log('User:', user.email);
}
```

### Manual Token Refresh

The app automatically refreshes tokens on launch. Manual refresh:

```typescript
import { refreshAccessToken } from '@/services/auth-api';
import { getRefreshToken } from '@/services/secure-storage';

const refreshToken = await getRefreshToken();
if (refreshToken) {
  const response = await refreshAccessToken(refreshToken);
  // Update store with new tokens
}
```

## Troubleshooting

### "No refresh token found"
- Check if `GOOGLE_REFRESH_TOKEN` is set in env
- Or user needs to login through OAuth

### "Token refresh failed"
- Refresh token may be expired
- User needs to login again

### "Network Error"
- Check `API_BASE_URL` in `config/env.ts`
- iOS Simulator: Use Mac IP (not localhost)
- Android Emulator: Use `10.0.2.2:8080`

## Production Considerations

1. **Remove ENV Token**: Don't ship apps with hardcoded tokens
2. **OAuth Only**: Use proper OAuth flow for production
3. **Token Expiry**: Handle token expiry gracefully
4. **Secure API**: Ensure backend validates tokens properly
5. **HTTPS**: Always use HTTPS in production

## API Endpoints

### POST /auth/refresh

Refreshes access token using refresh token.

**Request:**
```json
{
  "refresh_token": "string",
  "device_type": "mobile"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": { /* user object */ },
    "access_token": "string",
    "refresh_token": "string",
    "is_admin": boolean
  }
}
```

### POST /auth/google/verify

Verifies Google ID token (OAuth flow).

**Request:**
```json
{
  "id_token": "string",
  "device_type": "mobile"
}
```

**Response:** Same as refresh endpoint
