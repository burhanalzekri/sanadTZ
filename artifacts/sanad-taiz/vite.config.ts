import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';

import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';

export default defineConfig(async ({ mode }) => {
  // Load the workspace-level .env file so Termux and local development use
  // the same configuration without requiring manual exports.
  const envDir = path.resolve(import.meta.dirname, '..', '..');
  const env = loadEnv(mode, envDir, '');
  const rawPort = env.VITE_PORT || process.env.VITE_PORT || '5173';
  const port = Number(rawPort);
  const basePath = env.BASE_PATH || process.env.BASE_PATH || '/';

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error(`Invalid VITE_PORT value: "${rawPort}"`);
  }

  return {
  envDir,
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== 'production' &&
    process.env.REPL_ID !== undefined
      ? [
          await import('@replit/vite-plugin-cartographer').then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, '..'),
            }),
          ),
          await import('@replit/vite-plugin-dev-banner').then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(
        import.meta.dirname,
        '..',
        '..',
        'attached_assets',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'ui-vendor': ['lucide-react', 'wouter'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'radix-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-tooltip', '@radix-ui/react-tabs', '@radix-ui/react-select'],
        },
      },
    },
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    proxy: {
      '/api': {
        target: env.API_PROXY_TARGET || 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: env.API_PROXY_TARGET || 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
    fs: {
      strict: true,
    },
  },
  preview: {
    port: Number(env.VITE_PREVIEW_PORT || 4173),
    host: '0.0.0.0',
    allowedHosts: true,
    proxy: {
      '/api': {
        target: env.API_PROXY_TARGET || 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: env.API_PROXY_TARGET || 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
  },
  };
});
