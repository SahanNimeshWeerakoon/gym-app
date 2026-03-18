# Configuration Guide

This guide explains how to configure the Gym Management app for different environments and customize it for your needs.

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
EXPO_PUBLIC_API_URL=https://your-api.com/api
EXPO_PUBLIC_APP_NAME=Gym Management
EXPO_PUBLIC_ENVIRONMENT=development
```

### Available Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `EXPO_PUBLIC_API_URL` | Backend API endpoint | http://localhost:3000/api |
| `EXPO_PUBLIC_APP_NAME` | App display name | Gym Management |
| `EXPO_PUBLIC_ENVIRONMENT` | Environment (development/production) | development |
| `EXPO_PUBLIC_WHATSAPP_API_KEY` | WhatsApp API key (future) | - |
| `EXPO_PUBLIC_FIREBASE_API_KEY` | Firebase API key (optional) | - |

## API Configuration

### Development (Local Backend)
```typescript
// src/utils/api.ts
const API_BASE_URL = 'http://192.168.1.100:3000/api'; // Your local IP
```

### Staging
```typescript
const API_BASE_URL = 'https://staging-api.gym-app.com/api';
```

### Production
```typescript
const API_BASE_URL = 'https://api.gym-app.com/api';
```

### Using Environment Variables
```typescript
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
```

## Theme Customization

Edit theme colors in `src/utils/constants.ts`:

```typescript
export const COLORS = {
  primary: '#2196F3',      // Main brand color
  success: '#4CAF50',      // Success/visited
  warning: '#FFC107',      // Warning/medium attendance
  error: '#F44336',        // Error/low attendance
  info: '#2196F3',         // Info messages
  light: '#f5f5f5',        // Light background
  dark: '#212121',         // Dark text
};
```

## App Configuration (app.json)

### App Name & Slug
```json
{
  "name": "Gym Management",
  "slug": "gym-management"
}
```

### Icons
1. Create 1024x1024px icon
2. Save to `assets/icon.png`
3. Use Assetgen to auto-generate sizes:
```bash
npx @react-native-camera-roll/camera-roll assetgen
```

### Splash Screen
1. Create 1242x2436px splash image
2. Save to `assets/splash.png`
3. Update `app.json` splash config

### Deep Linking Setup
```json
{
  "scheme": "gymapp",
  "intentFilters": [
    {
      "action": "VIEW",
      "autoVerify": true,
      "data": {
        "scheme": "https",
        "host": "*.gym-app.com",
        "pathPrefix": "/"
      },
      "category": ["BROWSABLE", "DEFAULT"]
    }
  ]
}
```

## Firebase Configuration (Optional)

### Setup Firebase Project
1. Create project at [firebase.google.com](https://firebase.google.com)
2. Add Android/iOS apps
3. Download config files

### Install Firebase
```bash
npm install firebase @react-native-firebase/app
```

### Configure in App
Create `src/services/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

## Localization (i18n)

### Setup i18n
```bash
npm install i18n-js
```

Create `src/i18n/index.ts`:

```typescript
import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';

const translations = {
  en: {
    dashboard: 'Dashboard',
    users: 'Users',
    addUser: 'Add User',
    attendance: 'Attendance',
  },
  es: {
    dashboard: 'Panel de Control',
    users: 'Usuarios',
    addUser: 'Agregar Usuario',
    attendance: 'Asistencia',
  },
};

i18n.translations = translations;
i18n.locale = RNLocalize.getLocales()[0].languageCode;

export const t = (key: string) => i18n.t(key);
```

### Usage
```typescript
import { t } from '../i18n';

<Text>{t('dashboard')}</Text>
```

## Build Variants

### Development Build
```bash
expo build:android -t apk --release-channel dev
```

### Production Build
```bash
expo build:android -t app --release-channel prod
```

## Signing & Publishing

### Generate Keystore (Android)
```bash
keytool -genkey -v -keystore my-release-key.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
```

### Configure Signing
```json
{
  "android": {
    "package": "com.gym.management",
    "versionCode": 1,
    "permissions": [
      "INTERNET",
      "CAMERA",
      "ACCESS_FINE_LOCATION"
    ],
    "release": {
      "releaseChannel": "production"
    }
  }
}
```

## Permission Configuration

### Required Permissions

**Android (app.json):**
```json
{
  "android": {
    "permissions": [
      "INTERNET",
      "WRITE_EXTERNAL_STORAGE",
      "READ_EXTERNAL_STORAGE"
    ]
  }
}
```

**iOS (app.json):**
```json
{
  "ios": {
    "infoPlist": {
      "NSCameraUsageDescription": "Camera needed for QR code scanning",
      "NSPhotoLibraryUsageDescription": "Photo library needed for user images"
    }
  }
}
```

## Performance Optimization

### Code Splitting
```typescript
// Lazy load screens
const UserDetailScreen = lazy(() =>
  import('../screens/UserDetailScreen')
);
```

### Image Optimization
```typescript
import { Image } from 'react-native';

<Image
  source={require('../assets/icon.png')}
  style={{ width: 100, height: 100 }}
  resizeMode="contain"
/>
```

### Memory Management
```typescript
// Clean up resources
useEffect(() => {
  const subscription = navigation.addListener('beforeRemove', () => {
    // Cleanup
  });

  return subscription;
}, [navigation]);
```

## Analytics Configuration

### Using Expo Analytics
```bash
npm install expo-analytics
```

### Usage
```typescript
import Analytics from 'expo-analytics';

const analytics = new Analytics('TRACKING_ID');

analytics.hit({
  hitType: 'pageview',
  pagePath: '/dashboard',
  pageTitle: 'Dashboard',
}).catch(e => console.log(e));
```

## Error Tracking (Sentry)

### Setup Sentry
```bash
npm install @sentry/react-native
```

```typescript
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "https://your-sentry-dsn@sentry.io/project-id",
  environment: process.env.EXPO_PUBLIC_ENVIRONMENT,
});
```

## Feature Flags

Create `src/utils/featureFlags.ts`:

```typescript
export const FEATURES = {
  WHATSAPP_INTEGRATION: false,
  EXPORT_REPORTS: false,
  DARK_MODE: false,
  MULTI_GYM: false,
};

export const isFeatureEnabled = (feature: keyof typeof FEATURES) => {
  return FEATURES[feature];
};
```

Usage:
```typescript
{isFeatureEnabled('EXPORT_REPORTS') && <ExportButton />}
```

## Offline Support

Configure offline mode handling:

```typescript
import NetInfo from '@react-native-community/netinfo';

useEffect(() => {
  const unsubscribe = NetInfo.addEventListener(state => {
    if (!state.isConnected) {
      showMessage('App is offline - using cached data');
      syncFromLocalStorage();
    } else {
      syncFromAPI();
    }
  });

  return unsubscribe;
}, []);
```

## Testing Configuration

### Unit Tests
```bash
npm install jest @testing-library/react-native
```

Create `jest.config.js`:
```javascript
module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'node',
};
```

### Integration Testing
```bash
npm install detox detox-cli
```

## Debugging

### Enable Redux DevTools
```typescript
import { store } from './src/store';

// In development
if (__DEV__) {
  console.log(store.getState());
}
```

### React Native Debugger
1. Download [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
2. Run in parallel with app
3. Press `Ctrl+M` (Android) or `Cmd+D` (iOS)
4. Select "Open Debugger"

## Platform-Specific Code

### iOS Only
```typescript
import { Platform } from 'react-native';

{Platform.OS === 'ios' && <IOSSpecificComponent />}
```

### Android Only
```typescript
{Platform.OS === 'android' && <AndroidSpecificComponent />}
```

### Platform Module
```typescript
import { Platform } from 'react-native';

const platformStyles = Platform.select({
  ios: { paddingTop: 50 },
  android: { paddingTop: 0 },
  web: { paddingTop: 0 },
});

<View style={platformStyles} />
```

## Deployment Checklist

- [ ] Update version in `package.json`
- [ ] Update version in `app.json`
- [ ] Configure API URL for environment
- [ ] Test all features
- [ ] Run linter: `npm run lint`
- [ ] Build for target platform
- [ ] Test on real device
- [ ] Submit to app stores
- [ ] Monitor analytics and crashes

---

For more configuration options, see:
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [app.json Reference](https://docs.expo.dev/workflow/configuration/)
