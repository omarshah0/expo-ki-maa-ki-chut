# ✅ Setup Checklist

Use this checklist to ensure everything is configured correctly before running the app.

---

## 📋 Pre-Launch Checklist

### ✅ 1. Dependencies
- [x] All packages installed (`pnpm install` already run)
- [x] No TypeScript errors
- [x] No linter errors

### ⚙️ 2. Google OAuth Configuration

#### Create OAuth Credentials
- [ ] Google Cloud Console project created
- [ ] Google+ API enabled for project
- [ ] Web OAuth Client ID created
- [ ] Android OAuth Client ID created (with SHA-1)
- [ ] iOS OAuth Client ID created

#### Update Configuration Files
- [ ] `config/env.ts` - Web client ID added
- [ ] `config/env.ts` - Android client ID added
- [ ] `config/env.ts` - iOS client ID added
- [ ] `app.json` - iOS reversed client ID updated (iOS only)

**File to edit**: `config/env.ts`
```typescript
export const ENV = {
  API_BASE_URL: 'http://localhost:8080', // ✅ Update if needed
  
  GOOGLE_CLIENT_ID_WEB: '', // ⚠️ ADD THIS
  GOOGLE_CLIENT_ID_ANDROID: '', // ⚠️ ADD THIS
  GOOGLE_CLIENT_ID_IOS: '', // ⚠️ ADD THIS
};
```

### 🔌 3. Backend Configuration

- [ ] Backend server running
- [ ] Backend accessible at `http://localhost:8080`
- [ ] POST `/auth/google/verify` endpoint works
- [ ] POST `/auth/refresh` endpoint works
- [ ] GET `/api/packages` endpoint works

**Test endpoints**:
```bash
# Test health check (if available)
curl http://localhost:8080/health

# Or try packages endpoint with a valid token
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8080/api/packages?limit=10&offset=0
```

**For Android Emulator**:
- [ ] Update `API_BASE_URL` to `http://10.0.2.2:8080`

**For Physical Device**:
- [ ] Get computer's IP address
- [ ] Update `API_BASE_URL` to `http://YOUR_IP:8080`
- [ ] Ensure backend accepts connections from network (not just localhost)

### 📱 4. Device/Emulator Setup

#### iOS
- [ ] Xcode installed (Mac only)
- [ ] iOS Simulator available
- [ ] CocoaPods installed
- [ ] Run `cd ios && pod install` (if ios folder exists)

#### Android
- [ ] Android Studio installed
- [ ] Android SDK configured
- [ ] Android Emulator or device connected
- [ ] USB debugging enabled (for device)

### 🎨 5. App Configuration

- [x] App name set to "Trading Signals"
- [x] Bundle ID: `com.omarshah.forexcryptopsx`
- [x] Theme set to dark mode
- [x] Black & gold colors configured
- [x] Splash screen background: black

---

## 🚀 Launch Steps

Once all items above are checked:

1. **Start Backend**
```bash
# In your backend directory
# (exact command depends on your backend setup)
```

2. **Start Metro Bundler**
```bash
cd /Users/shah/Projects/omarshah/forex-crypto-psx-stocks-signal-app/expo-rn
pnpm start
```

3. **Launch App**
```bash
# iOS
pnpm ios

# OR Android
pnpm android

# OR Web (testing only)
pnpm web
```

---

## 🧪 Testing Flow

Once app is running:

### Test 1: First-Time Login
1. [ ] App shows login screen (black background, gold button)
2. [ ] Click "Sign in with Google"
3. [ ] Google OAuth popup appears
4. [ ] Select Google account
5. [ ] Redirects back to app
6. [ ] Shows loading briefly
7. [ ] Dashboard appears with user name
8. [ ] Profile picture displays
9. [ ] 18 packages visible in list

### Test 2: App Restart
1. [ ] Close the app completely
2. [ ] Reopen the app
3. [ ] Shows loading screen briefly
4. [ ] Automatically logs in
5. [ ] Dashboard appears (no login screen)

### Test 3: Pull to Refresh
1. [ ] On dashboard, pull down on list
2. [ ] Loading indicator appears
3. [ ] Packages list refreshes
4. [ ] No errors

### Test 4: Logout
1. [ ] Click "Logout" button
2. [ ] Shows confirmation alert
3. [ ] Click "Logout" in alert
4. [ ] Redirects to login screen
5. [ ] Can login again

### Test 5: Token Refresh (Advanced)
1. [ ] Let app sit for a while (access token expires)
2. [ ] Pull to refresh packages
3. [ ] Should auto-refresh token in background
4. [ ] Packages load successfully
5. [ ] No visible error or logout

---

## 🐛 Common Issues & Quick Fixes

### Issue: "Google Sign In Failed"
**Check**:
- [ ] Client IDs in `config/env.ts` are correct
- [ ] No extra spaces or quotes in client IDs
- [ ] Redirect URIs match in Google Console
- [ ] OAuth consent screen is published (not in testing mode)

**Fix**: Copy client IDs directly from Google Console

---

### Issue: "Cannot Connect to Server"
**Check**:
- [ ] Backend is running
- [ ] Backend URL is correct in `config/env.ts`
- [ ] For Android emulator: Use `10.0.2.2` not `localhost`
- [ ] For device: Use computer's IP, not `localhost`

**Fix**: Test backend URL in browser first

---

### Issue: "No Packages Showing"
**Check**:
- [ ] Check Metro bundler console for errors
- [ ] Check backend logs for 401/403 errors
- [ ] Verify access token is being sent
- [ ] Test `/api/packages` endpoint directly

**Fix**: Check if token is valid, try logging out and back in

---

### Issue: "TypeScript/Import Errors"
**Check**:
- [ ] All files saved
- [ ] Metro bundler restarted

**Fix**:
```bash
# Clear cache
pnpm start --clear

# If that doesn't work, reinstall
rm -rf node_modules
pnpm install
```

---

### Issue: "App Crashes on Startup"
**Check**:
- [ ] Check Metro bundler for red errors
- [ ] Check device/emulator logs
- [ ] Ensure all dependencies installed

**Fix**:
```bash
# Restart Metro with cache clear
pnpm start --reset-cache
```

---

## 📊 Expected API Responses

### POST /auth/google/verify
**Request**:
```json
{
  "id_token": "eyJhbG...",
  "device_type": "mobile"
}
```

**Success Response (200)**:
```json
{
  "status": "success",
  "type": "auth",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "User Name",
      "profile_picture": "https://...",
      "email_verified": true
    },
    "access_token": "eyJ...",
    "refresh_token": "eyJ...",
    "is_admin": false
  },
  "message": "Authentication successful"
}
```

### POST /auth/refresh
**Request**:
```json
{
  "refresh_token": "eyJ...",
  "device_type": "mobile"
}
```

**Success Response (200)**: Same as verify

**Error Response (401)**:
```json
{
  "status": "error",
  "message": "Invalid or expired refresh token"
}
```

### GET /api/packages
**Headers**: `Authorization: Bearer {access_token}`

**Success Response (200)**:
```json
{
  "status": "success",
  "type": "collection",
  "data": {
    "limit": 100,
    "offset": 0,
    "packages": [
      {
        "id": 1,
        "name": "Forex Short Term - Monthly",
        "asset_class": "FOREX",
        "duration_type": "SHORT_TERM",
        "billing_cycle": "MONTHLY",
        "duration_days": 30,
        "price": 10,
        "description": "...",
        "is_active": true
      }
      // ... 17 more packages
    ],
    "total": 18
  }
}
```

---

## 📞 Need Help?

If you're stuck after checking everything:

1. **Read documentation**:
   - `QUICKSTART.md` - Quick setup
   - `AUTH_SETUP.md` - Detailed Google OAuth setup
   - `IMPLEMENTATION_SUMMARY.md` - Technical details

2. **Check logs**:
   - Metro bundler terminal
   - Backend server logs
   - Device/emulator logs

3. **Test components separately**:
   - Backend endpoints with Postman/curl
   - Google OAuth in Google OAuth Playground
   - App with mock data

4. **Common fixes**:
   - Clear cache: `pnpm start --clear`
   - Reinstall: `rm -rf node_modules && pnpm install`
   - Restart: Close all terminals and start fresh

---

## ✅ Success Indicators

You know everything is working when:

✅ Login screen appears with black background and gold button  
✅ Google OAuth completes successfully  
✅ Dashboard shows your name and profile picture  
✅ 18 packages display in cards with gold accents  
✅ Pull to refresh works  
✅ Logout works  
✅ Auto-login works after app restart  
✅ No console errors  
✅ No red screen errors  

---

## 🎉 Ready to Build!

Once all checklist items are complete and tests pass, you're ready to:

- [ ] Build additional screens (signals, profile, etc.)
- [ ] Implement tab navigation
- [ ] Add package purchase flow
- [ ] Integrate push notifications
- [ ] Deploy to TestFlight/Play Store

**Next Steps**: See plan for future features to implement.

---

Good luck! 🚀

