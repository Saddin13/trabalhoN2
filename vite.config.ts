import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/trabalhoN2/', // Fix para o GitHub Pages (Caminho base do repositório)
  server: {
    port: 3000,
    open: true
  }
});
