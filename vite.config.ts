import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',  // ← ADD THIS LINE (matching your repo name)
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
   proxy: {
      '/api': {
        target: 'https://script.google.com/macros/s/AKfycby_Utr0k2z_pGkeKRmmPmstYW0QaehBzqPSOQWXZ7vNT--Aht7EizvrlnILzRwa2CFiPg/exec',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
});
