import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: './client',
  publicDir: '../public',
  build: {
    outDir: '../dist/public',
    emptyOutDir: true,
    rollupOptions: {
      input: './client/index.html'
    },
    sourcemap: true,
    minify: 'terser',
    chunkSizeWarningLimit: 1000
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@/components': path.resolve(__dirname, './client/src/components'),
      '@/pages': path.resolve(__dirname, './client/src/pages'),
      '@/lib': path.resolve(__dirname, './client/src/lib'),
      '@/hooks': path.resolve(__dirname, './client/src/hooks'),
      '@/contexts': path.resolve(__dirname, './client/src/contexts')
    }
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      '/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      '/webhooks': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  preview: {
    port: 4173,
    host: true
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@stripe/stripe-js',
      '@stripe/react-stripe-js'
    ]
  }
});