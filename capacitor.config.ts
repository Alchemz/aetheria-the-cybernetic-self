import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.innersync.app',
  appName: 'INNERSYNC',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  ios: {
    // Scroll bounce creates jarring UX in a full-screen app
    scrollEnabled: true,
    // Allow the webview to extend under the notch/home indicator
    contentInset: 'always',
    backgroundColor: '#000000'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#000000",
      showSpinner: false,
      iosSpinnerStyle: 'small',
      launchAutoHide: true
    },
    Keyboard: {
      // Prevents the keyboard from resizing the webview, which breaks fixed layouts
      // The app handles keyboard via CSS safe areas instead
      resize: 'none',
      style: 'dark',
      resizeOnFullScreen: false
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#000000'
    }
  }
};

export default config;
