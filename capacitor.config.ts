import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.trippin.app',
  appName: 'Trippin',
  webDir: 'dist',
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#ecfdf5',
  },
  server: {
    iosScheme: 'capacitor',
  },
};

export default config;
