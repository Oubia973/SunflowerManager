import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sunflower.manager',
  appName: 'Sunflower Manager',
  webDir: 'build',
  server: {
    url: 'https://sunflower.ott2tv.com',
    cleartext: false
  },
  plugins: {
    SplashScreen: {
      androidScaleType: "CENTER_CROP",
      androidImmersive: false
    },
    StatusBar: {
      overlaysWebView: false
    }
  }
};

export default config;
