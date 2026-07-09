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
        target: 'https://script.google.com/macros/s/AKfycbyOsTHVz9_mG0W9mPAKMjhjP92ypAtyQfj6qXmF_VKZRN5QSYvmo60LdYvmOh-lrNOotw/exec',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
});
