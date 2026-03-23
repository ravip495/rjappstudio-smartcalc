import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.clevcalc',
  appName: 'SmartCalc PRO',
  webDir: 'dist',
  bundledWebRuntime: false,
  android: {
    minWebViewVersion: 60,
    allowMixedContent: false
  }
};

export default config;
