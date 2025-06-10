import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sunflower.manager',
  appName: 'Sunflower Manager',
  webDir: 'build',
  server: {
    url: 'https://sunflower.ott2tv.com',
    cleartext: false
  }
};

export default config;
