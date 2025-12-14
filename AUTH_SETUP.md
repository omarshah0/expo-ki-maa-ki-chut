# Authentication Setup Guide

This guide will help you set up Google OAuth authentication for the Trading Signals mobile app.

## 🎯 Overview

The app implements a complete authentication system with:
- Google OAuth login
- Automatic token refresh
- Secure token storage (Keychain/Keystore)
- Protected routes with auth guard
- Black & Gold UI theme

## 🔧 Prerequisites

1. **Node.js** (v18 or higher)
2. **pnpm** package manager
3. **Expo CLI** (`npm install -g expo-cli`)
4. **Google Cloud Console** account

## 📱 Architecture

### Authentication Flow

```
App Start
  ↓
Check Refresh Token
  ↓
├─ No Token → Show Login Screen
│    ↓
│  Google OAuth
│    ↓
│  Verify with Backend (/auth/google/verify)
│    ↓
│  Save Tokens → Dashboard
│
└─ Has Token → Show Loading
     ↓
   Refresh Token API (/auth/refresh)
     ↓
   ├─ Success → Dashboard
   └─ Failed → Login Screen
```

### Auto Token Refresh

All API calls automatically refresh expired access tokens:
- Interceptor detects 401 errors
- Refreshes token behind the scenes
- Retries original request
- If refresh fails → redirect to login

## 🚀 Setup Instructions

### Step 1: Install Dependencies

Dependencies are already installed, but if needed:

```bash
pnpm install
```

### Step 2: Configure Google OAuth

#### 2.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable **Google+ API** for your project

#### 2.2 Create OAuth 2.0 Credentials

##### Web Application (Required for Expo)

1. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
2. Application type: **Web application**
3. Name: `Trading Signals Web Client`
4. Authorized redirect URIs:
   - `https://auth.expo.io/@your-expo-username/forex-crypto-psx-signals`
5. Click **Create** and copy the **Client ID**

##### Android Application

1. Create another OAuth Client ID
2. Application type: **Android**
3. Name: `Trading Signals Android`
4. Package name: `com.omarshah.forexcryptopsx`
5. Get SHA-1 fingerprint:
   ```bash
   # Debug key (development)
   keytool -keystore ~/.android/debug.keystore -list -v -alias androiddebugkey
   # Password: android
   ```
6. Copy the **Client ID**

##### iOS Application

1. Create another OAuth Client ID
2. Application type: **iOS**
3. Name: `Trading Signals iOS`
4. Bundle ID: `com.omarshah.forexcryptopsx`
5. Copy the **Client ID** and **iOS URL scheme**

#### 2.3 Configure App

Edit `config/env.ts`:

```typescript
export const ENV = {
  API_BASE_URL: 'http://localhost:8080', // or your backend URL
  
  GOOGLE_CLIENT_ID_WEB: 'YOUR-WEB-CLIENT-ID.apps.googleusercontent.com',
  GOOGLE_CLIENT_ID_ANDROID: 'YOUR-ANDROID-CLIENT-ID.apps.googleusercontent.com',
  GOOGLE_CLIENT_ID_IOS: 'YOUR-IOS-CLIENT-ID.apps.googleusercontent.com',
};
```

#### 2.4 Update app.json (iOS only)

For iOS, update the `reversedClientId` in `app.json`:

```json
"ios": {
  "config": {
    "googleSignIn": {
      "reservedClientId": "com.googleusercontent.apps.REVERSECLIENTID"
    }
  }
}
```

Replace `REVERSECLIENTID` with the reversed iOS client ID (it's shown in Google Console).

### Step 3: Start Backend Server

Make sure your backend API is running on `http://localhost:8080` with the following endpoints:

- `POST /auth/google/verify` - Verify Google ID token
- `POST /auth/refresh` - Refresh access token
- `GET /api/packages` - Get packages list

### Step 4: Run the App

#### Start Metro Bundler

```bash
pnpm start
```

#### Run on iOS

```bash
pnpm ios
```

#### Run on Android

```bash
pnpm android
```

#### Run on Web (for testing)

```bash
pnpm web
```

## 📂 Project Structure

```
expo-rn/
├── app/
│   ├── _layout.tsx          # Root layout with auth guard
│   ├── login.tsx            # Login screen
│   ├── dashboard.tsx        # Protected dashboard
│   └── (tabs)/              # Tab navigation (existing)
├── services/
│   ├── api-client.ts        # Axios with auto token refresh
│   ├── auth-api.ts          # Auth endpoints
│   ├── packages-api.ts      # Package endpoints
│   ├── google-auth.ts       # Google OAuth
│   └── secure-storage.ts    # Token storage
├── store/
│   └── auth-store.ts        # Zustand auth state
├── types/
│   ├── auth.ts              # Auth type definitions
│   └── packages.ts          # Package type definitions
├── constants/
│   ├── colors.ts            # Black & gold theme
│   └── theme.ts             # Theme configuration
└── config/
    ├── env.ts               # Environment config
    └── env.example.ts       # Example config
```

## 🎨 Theme

The app uses a **Black & Gold** color scheme:

- **Primary Gold**: `#D4AF37`
- **Light Gold**: `#E5C158`
- **Dark Gold**: `#B8941E`
- **Background**: `#0A0A0A`
- **Elevated Background**: `#141414`

## 🔒 Security Features

- **Secure Storage**: Tokens stored in Keychain (iOS) / Keystore (Android)
- **Auto Token Refresh**: Expired tokens refreshed automatically
- **Auth Guard**: Protected routes require authentication
- **Token Expiry Handling**: Graceful logout on refresh failure

## 🧪 Testing the Flow

### Test Case 1: Fresh Install
1. Open app (no tokens stored)
2. Should show login screen
3. Click "Sign in with Google"
4. Complete Google OAuth
5. Should redirect to dashboard

### Test Case 2: Returning User
1. Close and reopen app (tokens stored)
2. Should show loading spinner
3. Should auto-refresh token
4. Should redirect to dashboard

### Test Case 3: Token Refresh
1. Make API call to packages endpoint
2. If access token expired (401):
   - Auto refreshes token
   - Retries request
   - User doesn't notice
3. Dashboard shows packages

### Test Case 4: Session Expired
1. If refresh token also expired
2. Should redirect to login
3. User needs to re-authenticate

## 🐛 Troubleshooting

### Google OAuth Not Working

**Problem**: OAuth popup doesn't open or fails

**Solutions**:
- Check if client IDs are correct in `config/env.ts`
- Verify redirect URIs in Google Console match exactly
- For Android: Check SHA-1 fingerprint is added
- For iOS: Check reversed client ID in `app.json`

### API Connection Failed

**Problem**: Can't connect to backend

**Solutions**:
- Check backend is running on `http://localhost:8080`
- For Android emulator: Use `http://10.0.2.2:8080`
- For physical device: Use computer's IP address
- Update `API_BASE_URL` in `config/env.ts`

### Token Refresh Loop

**Problem**: App keeps refreshing tokens

**Solutions**:
- Check backend `/auth/refresh` endpoint is working
- Verify refresh token format is correct
- Clear app data and re-login

### TypeScript Errors

**Problem**: Module not found or type errors

**Solutions**:
```bash
# Clear cache and restart
pnpm start --clear

# Reinstall dependencies
rm -rf node_modules
pnpm install
```

## 📝 API Endpoints Reference

### POST /auth/google/verify

**Request**:
```json
{
  "id_token": "GOOGLE_ID_TOKEN",
  "device_type": "mobile"
}
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "user": { /* user object */ },
    "access_token": "...",
    "refresh_token": "...",
    "is_admin": false
  }
}
```

### POST /auth/refresh

**Request**:
```json
{
  "refresh_token": "REFRESH_TOKEN",
  "device_type": "mobile"
}
```

**Response**: Same as verify endpoint

### GET /api/packages

**Query Params**: `?limit=100&offset=0`

**Headers**: `Authorization: Bearer ACCESS_TOKEN`

**Response**:
```json
{
  "status": "success",
  "data": {
    "packages": [ /* array of packages */ ],
    "total": 18
  }
}
```

## 🚀 Next Steps

After authentication is working:

1. **Implement Tab Navigation** for different asset classes (Forex, Crypto, PSX)
2. **Add Signals Screens** to display trading signals
3. **Package Purchase Flow** with payment integration
4. **User Profile** screen with settings
5. **Push Notifications** for new signals

## 📞 Support

If you encounter any issues:

1. Check this guide thoroughly
2. Review error logs in console
3. Verify all credentials are correct
4. Test backend endpoints separately

## 🎉 Success!

If everything is set up correctly, you should be able to:
- ✅ Login with Google
- ✅ See your name and profile picture
- ✅ View 18 packages in the dashboard
- ✅ Logout and login again seamlessly
- ✅ App remembers you on restart

