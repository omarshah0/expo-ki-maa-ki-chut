# 🚀 Quick Start Guide

Get your Trading Signals app running in 5 minutes!

---

## Step 1: Configure Google OAuth (5 minutes)

### Option A: Use Expo Development Build (Recommended)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create 3 OAuth Client IDs:
   - **Web** (for Expo auth flow)
   - **Android** (package: `com.omarshah.forexcryptopsx`)
   - **iOS** (bundle: `com.omarshah.forexcryptopsx`)

### Option B: For Quick Testing (Skip Google OAuth)
You can test the app without OAuth by:
1. Commenting out Google auth temporarily
2. Manually setting tokens in the store
3. Going straight to dashboard

---

## Step 2: Add Your Credentials

Edit `config/env.ts`:

```typescript
export const ENV = {
  API_BASE_URL: 'http://localhost:8080', // Your backend URL
  
  GOOGLE_CLIENT_ID_WEB: 'YOUR-CLIENT-ID.apps.googleusercontent.com',
  GOOGLE_CLIENT_ID_ANDROID: 'YOUR-CLIENT-ID.apps.googleusercontent.com',
  GOOGLE_CLIENT_ID_IOS: 'YOUR-CLIENT-ID.apps.googleusercontent.com',
};
```

**For iOS only**: Update `app.json` with reversed client ID.

---

## Step 3: Start Backend

Make sure your backend is running with these endpoints:
- `POST /auth/google/verify`
- `POST /auth/refresh`
- `GET /api/packages`

```bash
# Backend should be at http://localhost:8080
```

**Android Emulator**: Use `http://10.0.2.2:8080` instead of localhost  
**Physical Device**: Use your computer's IP address

---

## Step 4: Run the App

```bash
# Start Metro
pnpm start

# Then press:
# - i for iOS simulator
# - a for Android emulator
# - w for web (testing only)
```

Or use shortcuts:

```bash
pnpm ios     # iOS
pnpm android # Android
pnpm web     # Web
```

---

## 🎯 What You Should See

### First Run (No Tokens)
1. ✅ Black screen with gold "Trading Signals" title
2. ✅ "Sign in with Google" gold button
3. ✅ Click button → Google OAuth popup
4. ✅ After login → Dashboard with packages

### Second Run (Has Tokens)
1. ✅ Brief loading screen
2. ✅ Auto-login
3. ✅ Dashboard appears

### Dashboard
1. ✅ "Welcome back, [Your Name]"
2. ✅ Your Google profile picture
3. ✅ 18 packages in cards (Forex, Crypto, PSX)
4. ✅ Gold logout button

---

## 🐛 Quick Troubleshooting

### "Google Sign In Failed"
- Check client IDs in `config/env.ts`
- Verify redirect URIs in Google Console
- For Android: Add SHA-1 fingerprint

### "Cannot Connect to Backend"
- Check backend is running
- Android emulator: Use `10.0.2.2:8080`
- Physical device: Use computer's IP address
- Update `API_BASE_URL` in `config/env.ts`

### "No Packages Showing"
- Check browser console for errors
- Verify `/api/packages` endpoint works
- Check access token is being sent

### TypeScript Errors
```bash
pnpm start --clear
```

---

## 📱 Test the Flow

1. **Login**: Click Google button → Authenticate → See dashboard
2. **Packages**: Should see 18 packages with prices
3. **Logout**: Click logout → Back to login
4. **Auto-Login**: Close app → Reopen → Auto login to dashboard
5. **Token Refresh**: Wait for token to expire → Should auto-refresh

---

## 🎨 App Features

✅ **Black & Gold Theme** - Matches your web app  
✅ **Google OAuth** - Secure authentication  
✅ **Auto Token Refresh** - Seamless experience  
✅ **Secure Storage** - Hardware-backed encryption  
✅ **Pull to Refresh** - Update packages list  
✅ **Protected Routes** - Auth guard on all screens  

---

## 📚 More Help?

- **Detailed Setup**: See `AUTH_SETUP.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
- **Backend Issues**: Check backend logs
- **Frontend Issues**: Check Metro bundler logs

---

## ✅ Success Checklist

Before asking for help, verify:

- [ ] Dependencies installed (`node_modules` exists)
- [ ] Google OAuth client IDs added to `config/env.ts`
- [ ] Backend running on correct URL
- [ ] Backend endpoints working (test with Postman)
- [ ] Metro bundler running
- [ ] No TypeScript errors in terminal
- [ ] Checked console logs for errors

---

## 🎉 You're All Set!

Once you see the dashboard with packages, you're ready to continue building:
- Signals screens
- Tab navigation
- Package purchases
- User profile
- Push notifications

Happy coding! 🚀

