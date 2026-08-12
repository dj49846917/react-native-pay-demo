import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/react-native-pay-demo/' : '/',
  plugins: [react()],
  define: {
    __DEV__: JSON.stringify(command !== 'build'),
    global: 'globalThis',
    'process.env.NODE_ENV': JSON.stringify(
      command === 'build' ? 'production' : 'development',
    ),
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      '@react-native/assets-registry/registry':
        'react-native-web/dist/modules/AssetRegistry',
    },
    extensions: [
      '.web.tsx',
      '.web.ts',
      '.web.jsx',
      '.web.js',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.json',
    ],
  },
  server: {
    host: '127.0.0.1',
    port: 4173,
  },
  preview: {
    host: '127.0.0.1',
    port: 4174,
  },
  build: {
    chunkSizeWarningLimit: 1300,
  },
}));
