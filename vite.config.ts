import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Note: /api/* is now served by Cloudflare Pages Functions (see /functions).
// `npm run dev` (plain Vite) won't have those routes available — for full-stack
// local development including the API, use `npm run pages:dev` instead, which
// runs `wrangler pages dev` and serves the built frontend + functions together.
export default defineConfig({
  plugins: [react()],
  base: '/',  // ← ADD THIS LINE (matching your repo name)
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
