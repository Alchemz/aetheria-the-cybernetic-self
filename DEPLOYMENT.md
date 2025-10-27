# INNERSYNC Mobile Deployment Guide

This guide explains how to build and deploy your INNERSYNC meditation app to iOS and Android devices.

## Prerequisites

### For iOS Development
- **macOS computer** (required for iOS builds)
- **Xcode** (latest version from Mac App Store)
- **Apple Developer Account** ($99/year for App Store)
- **CocoaPods** installed: `sudo gem install cocoapods`

### For Android Development
- **Android Studio** (free download)
- **Java Development Kit (JDK)** 11 or higher
- Works on macOS, Windows, or Linux

---

## Quick Start Commands

### Build and Open iOS
```bash
npm run ios
```
This builds the web app and opens Xcode for iOS development.

### Build and Open Android
```bash
npm run android
```
This builds the web app and opens Android Studio.

### Sync Changes to Native
After making web app changes:
```bash
npm run cap:build
```

---

## iOS Deployment Steps

### 1. Initial Setup (One-time)
```bash
# Install CocoaPods (if not already installed)
sudo gem install cocoapods

# Navigate to iOS folder and install dependencies
cd ios/App
pod install
cd ../..
```

### 2. Build for iOS
```bash
# Build web app and sync to iOS
npm run ios
```

Xcode will open automatically.

### 3. Configure in Xcode
1. Select the **App** target in Xcode
2. Go to **Signing & Capabilities**
3. Select your **Team** (Apple Developer account)
4. Xcode will automatically create a provisioning profile

### 4. Run on Simulator or Device
- **Simulator**: Select any iPhone simulator from the device menu and click ▶️ Run
- **Real Device**: 
  1. Connect your iPhone via USB
  2. Trust the computer on your iPhone
  3. Select your iPhone from the device menu
  4. Click ▶️ Run
  5. On first run, go to iPhone Settings → General → VPN & Device Management → Trust the developer certificate

### 5. Submit to App Store
1. In Xcode, select **Product → Archive**
2. Once archived, click **Distribute App**
3. Follow the wizard to upload to App Store Connect
4. Log into [App Store Connect](https://appstoreconnect.apple.com)
5. Fill in app details, screenshots, description
6. Submit for review

---

## Android Deployment Steps

### 1. Build for Android
```bash
npm run android
```

Android Studio will open automatically.

### 2. Run on Emulator or Device
- **Emulator**: 
  1. Tools → Device Manager → Create Device
  2. Select a device (e.g., Pixel 4)
  3. Download a system image (API 30+)
  4. Click ▶️ Run in Android Studio

- **Real Device**:
  1. Enable Developer Options on Android phone:
     - Settings → About Phone → Tap "Build Number" 7 times
  2. Enable USB Debugging:
     - Settings → Developer Options → USB Debugging
  3. Connect phone via USB
  4. Click ▶️ Run in Android Studio

### 3. Build Release APK/AAB for Play Store
```bash
cd android
./gradlew assembleRelease    # Creates APK
./gradlew bundleRelease      # Creates AAB (recommended for Play Store)
```

### 4. Sign the App
You need to create a keystore for signing:
```bash
# Generate keystore (one-time setup)
keytool -genkey -v -keystore innersync-release.keystore -alias innersync -keyalg RSA -keysize 2048 -validity 10000

# Keep this file and password SAFE - you'll need it for all future updates!
```

Add to `android/gradle.properties`:
```properties
INNERSYNC_RELEASE_STORE_FILE=../innersync-release.keystore
INNERSYNC_RELEASE_KEY_ALIAS=innersync
INNERSYNC_RELEASE_STORE_PASSWORD=your_keystore_password
INNERSYNC_RELEASE_KEY_PASSWORD=your_key_password
```

Update `android/app/build.gradle` to add signing config:
```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file(INNERSYNC_RELEASE_STORE_FILE)
            storePassword INNERSYNC_RELEASE_STORE_PASSWORD
            keyAlias INNERSYNC_RELEASE_KEY_ALIAS
            keyPassword INNERSYNC_RELEASE_KEY_PASSWORD
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            ...
        }
    }
}
```

### 5. Upload to Google Play Store
1. Create a [Google Play Console](https://play.google.com/console) account ($25 one-time fee)
2. Create a new app
3. Upload your AAB file (from `android/app/build/outputs/bundle/release/`)
4. Fill in app details, screenshots, privacy policy
5. Submit for review

---

## Development Workflow

### Making Changes to the App
1. **Edit your React code** in `src/`
2. **Build and sync**:
   ```bash
   npm run cap:build
   ```
3. **Reload the app** on your device/emulator

### Live Reload (Development)
For faster development, you can use live reload:
```bash
# Start dev server
npm run dev:all

# In capacitor.config.ts, temporarily add:
server: {
  url: 'http://YOUR_IP:5000',
  cleartext: true
}

# Then sync
npx cap sync
```

Your device will load the app from your dev server, with hot reload!

---

## App Configuration

### Change App Name
Edit `capacitor.config.ts`:
```typescript
appName: 'INNERSYNC'  // Change this
```

### Change Bundle ID (iOS/Android)
Edit `capacitor.config.ts`:
```typescript
appId: 'com.innersync.app'  // Change this
```
**Important**: This must be unique and match your App Store/Play Store listing.

### Add App Icon
1. Create 1024x1024 icon image
2. Use tools like [AppIcon.co](https://appicon.co) to generate all sizes
3. Replace icons in:
   - iOS: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
   - Android: `android/app/src/main/res/mipmap-*/`

### Add Splash Screen
Replace splash screens in:
- iOS: `ios/App/App/Assets.xcassets/Splash.imageset/`
- Android: `android/app/src/main/res/drawable*/splash.png`

---

## Troubleshooting

### iOS Build Fails
```bash
cd ios/App
pod install --repo-update
cd ../..
```

### Android Gradle Issues
```bash
cd android
./gradlew clean
cd ..
```

### Changes Not Appearing
Make sure to rebuild and sync:
```bash
npm run build
npx cap sync
```

### WebGL/Three.js Issues on Mobile
- Three.js should work fine on modern devices
- Test on real devices, not just simulators
- Check device logs in Xcode/Android Studio

---

## Environment Variables for Production

Your app uses these secrets:
- `OPENAI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

**For mobile builds**, these are embedded during build time through `vite.config.js`. Make sure to set them in your build environment or use Capacitor's native config storage.

---

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Android Material Design](https://material.io/design)
- [App Store Connect](https://appstoreconnect.apple.com)
- [Google Play Console](https://play.google.com/console)

---

## Need Help?

If you run into issues:
1. Check the Capacitor docs
2. Search Capacitor's GitHub issues
3. Join the Capacitor Discord community

**You're ready to bring INNERSYNC to mobile! 🚀**
