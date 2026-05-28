import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Fix absoluto para GitHub Pages (Caminho relativo)
  server: {
    port: 3000,
    open: true
  }
});
