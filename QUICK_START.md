# Quick Start Guide

## Setup in 3 Steps

### 1. Add Your Refresh Token

Edit `config/env.ts`:

```typescript
export const ENV = {
  API_BASE_URL: 'http://172.20.10.6:8080', // Your backend URL
  GOOGLE_REFRESH_TOKEN: 'your_actual_refresh_token_here',
};
```

### 2. Start the App

```bash
npm start
# or
pnpm start
```

### 3. Done! 🎉

The app will automatically:
- ✅ Call refresh token API
- ✅ Get access token & user profile
- ✅ Save everything securely
- ✅ Show dashboard with packages

## What Happens Behind the Scenes

```
App Starts
    ↓
Read refresh token (from ENV on first launch)
    ↓
Call POST /auth/refresh
    ↓
Save access token → Zustand (in-memory)
Save refresh token → SecureStore (encrypted)
Save user profile → Zustand
    ↓
✅ Authenticated! Show Dashboard
```

## Viewing Packages

Once authenticated, you can:

1. **Navigate to Dashboard**
   - Automatically redirected after authentication
   - Shows list of packages

2. **Access API**
   ```typescript
   import { getPackages } from '@/services/packages-api';
   
   const response = await getPackages();
   const packages = response.data.packages;
   ```

## Console Output

Successful authentication looks like:

```
🔄 Refreshing access token...
✅ Token refreshed successfully
👤 User: your@email.com
💾 Access token saved to Zustand, Refresh token saved to SecureStore
```

## Troubleshooting

### "No refresh token found"
→ Add `GOOGLE_REFRESH_TOKEN` to `config/env.ts`

### "Network Error"
→ Check `API_BASE_URL` is correct
→ For iOS Simulator: Use your Mac's IP (not localhost)
→ For Android Emulator: Use `10.0.2.2:8080`

### "Token refresh failed"
→ Your refresh token may be expired, get a new one

## Files to Know

| File | Purpose |
|------|---------|
| `config/env.ts` | Add your refresh token here |
| `app/_layout.tsx` | Handles authentication automatically |
| `store/auth-store.ts` | Access user info and token |
| `app/dashboard.tsx` | Shows packages |

## Using Auth State

```typescript
import { useAuthStore } from '@/store/auth-store';

function MyComponent() {
  const { user, accessToken, isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Text>Not logged in</Text>;
  }
  
  return <Text>Hello {user.name}!</Text>;
}
```

## Next Session

When you reopen the app:
- Refresh token read from SecureStore ✅
- New access token fetched automatically ✅
- You stay logged in! 🎉

## Logout

```typescript
import { useAuthStore } from '@/store/auth-store';

await useAuthStore.getState().logout();
```

This clears all data and redirects to login.

## Need More Info?

- **Architecture**: See `REFACTORED_AUTH_FLOW.md`
- **Changes**: See `REFACTOR_SUMMARY.md`
- **Detailed Docs**: See `DIRECT_TOKEN_AUTH.md`
