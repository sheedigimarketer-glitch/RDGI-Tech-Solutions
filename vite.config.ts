import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { readSupabaseConfig } from './src/services/supabaseConfig';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  readSupabaseConfig(loadEnv(mode, process.cwd(), 'VITE_'));
  return {
    base: '/',
    plugins: [react(), tailwindcss()],
    server: {
      host: '0.0.0.0',
      port: 3000,
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
    },
  };
});
