# Quick Start Guide

Get the Gym Management app running in 5 minutes!

## Prerequisites

Make sure you have installed:
- **Node.js** v16+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **Expo CLI**: `npm install -g expo-cli`

Check installations:
```bash
node --version
npm --version
expo --version
```

## Step 1: Install Dependencies

```bash
cd gym-app
npm install
```

This will install all required packages including:
- React Native
- Expo
- Redux Toolkit
- React Navigation
- React Native Paper
- And more...

## Step 2: Start Development Server

```bash
npm start
```

You should see output like:
```
Expo DevTools is running at http://localhost:19002
Use Expo Go to scan the QR code above
Press 'a' to open Android, 'i' to open iOS, 'w' for web
```

## Step 3: Run on Device or Emulator

### Option A: Use Expo Go App (Easiest)
1. Download **Expo Go** app on your phone
   - [iOS App Store](https://apps.apple.com/us/app/expo-go/id1618757565)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan the QR code from the terminal with your phone camera
3. App opens automatically in Expo Go!

### Option B: Run on Android Emulator
```bash
npm run android
```

Requires Android Studio and emulator setup.

### Option C: Run on iOS Simulator
```bash
npm run ios
```

Requires macOS and Xcode.

### Option D: Run on Web
```bash
npm run web
```

Opens at http://localhost:19006

## Step 4: Start Using the App

### First Login
The app uses local storage, so no login needed initially. Start by:

1. **Create Users**: Go to Users tab → "Add User"
   - Fill in name, phone, address
   - Select visiting days (e.g., Monday, Wednesday, Friday)
   - Save

2. **Mark Attendance**: Go to Filters → "Filter by Date"
   - Select a date
   - Click "Mark Attended" for users who visited

3. **View Statistics**: Go to Dashboard
   - See total users
   - Check average attendance
   - View top attenders

## Project Structure for Development

```
gym-app/
├── App.tsx                      # Main navigation
├── src/
│   ├── screens/                 # UI screens
│   ├── components/              # Reusable UI components
│   ├── store/                   # Redux state management
│   ├── utils/                   # Helper functions
│   └── types/                   # TypeScript types
├── package.json                 # Dependencies
└── app.json                      # Expo config
```

## Common Commands

```bash
# Start dev server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web

# Clear cache and restart
expo start --clear

# Install a package
npm install package-name

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json && npm install
```

## Troubleshooting

### Issue: "Cannot find module"
```bash
npm install
expo start --clear
```

### Issue: Android emulator won't start
```bash
# Check if ADB is available
adb devices

# If not, add to PATH or use Android Studio's built-in emulator
```

### Issue: Port 19000 already in use
```bash
npm start -- --clear --port 19001
```

### Issue: iOS build fails
```bash
cd ios
pod install
cd ..
npm run ios
```

## Adding Features

### Add a New Screen
1. Create file: `src/screens/MyNewScreen.tsx`
2. Export from `src/screens/index.ts`
3. Add to navigation in `App.tsx`

### Add a New Component
1. Create file: `src/components/MyComponent.tsx`
2. Export from `src/components/index.ts`
3. Import and use in screens

### Add a New Redux Slice
1. Create file: `src/store/mySlice.ts`
2. Add to store reducer in `src/store/index.ts`
3. Use with `useDispatch()` and `useSelector()`

## Connecting to Backend

1. Update API URL in `src/utils/api.ts`:
```typescript
const API_BASE_URL = 'https://your-backend.com/api';
```

2. Test connection with health check:
```bash
curl https://your-backend.com/api/health
```

3. Use hooks to sync data:
```typescript
const { syncAll } = useSyncAllData();

useEffect(() => {
  syncAll(true); // Sync from API
}, []);
```

## Building for Production

### Android APK
```bash
expo build:android -t apk
```

### iOS IPA
```bash
expo build:ios -t ipa
```

### Web Build
```bash
expo export:web
```

## Performance Tips

1. **Lazy Load Screens**: Only load data when needed
2. **Use Selectors Efficiently**: Memoize Redux selectors
3. **Optimize Lists**: Use FlatList with proper key props
4. **Cache Data**: Store locally with AsyncStorage
5. **Debounce**: Use debounced search in lists

## Hot Reload

The app supports hot reload:
- Save a file (`Ctrl+S` or `Cmd+S`)
- App automatically updates on device
- Maintain app state

## Next Steps

1. ✅ App is running locally
2. 📚 Read [README.md](./README.md) for full documentation
3. 🔌 Set up backend using [BACKEND_SETUP.md](./BACKEND_SETUP.md)
4. 🚀 Deploy to production

## Support & Resources

- **Expo Docs**: https://docs.expo.dev/
- **React Native Docs**: https://reactnative.dev/
- **Redux Toolkit**: https://redux-toolkit.js.org/
- **React Navigation**: https://reactnavigation.org/
- **React Native Paper**: https://callstack.github.io/react-native-paper/

## Quick Reference: File Locations

- **Navigation**: `App.tsx`
- **User screens**: `src/screens/UserListScreen.tsx`, `UserDetailScreen.tsx`
- **Redux store**: `src/store/usersSlice.ts`, `attendanceSlice.ts`
- **API calls**: `src/utils/api.ts`
- **Local storage**: `src/utils/storage.ts`
- **Utilities**: `src/utils/attendanceHelper.ts`
- **Types**: `src/types/index.ts`

---

**You're all set! Happy coding!** 🎉
