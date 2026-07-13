import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Note: /api/* is now served by Cloudflare Pages Functions (see /functions).
// `npm run dev` (plain Vite) won't have those routes available — for full-stack
// local development including the API, use `npm run pages:dev` instead, which
// runs `wrangler pages dev` and serves the built frontend + functions together.
export default defineConfig({
  plugins: [react()],
  base: '/', // ← ADD THIS LINE (matching your repo name)
  // Dev proxy: lets plain `npm run dev` reach the Cloudflare Pages Functions.
  // Run the functions server in a second terminal (`npm run dev:api`, which
  // serves them on :8788) and Vite will forward /api/* there. Without this,
  // sign-in (and every /api call) fails with a generic "Sign-in failed".
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8788',
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
