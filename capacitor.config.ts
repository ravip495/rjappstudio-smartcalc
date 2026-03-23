import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.clevcalc',
  appName: 'ClevCalc Clone',
  webDir: 'dist',
  bundledWebRuntime: false,
  android: {
    minWebViewVersion: 60,
    allowMixedContent: false
  }
};

export default config;
