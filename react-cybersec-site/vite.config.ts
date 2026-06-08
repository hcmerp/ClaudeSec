import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/v1': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        secure: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            // Add required header for browser requests
            proxyReq.setHeader('anthropic-dangerous-direct-browser-access', 'true');
            // Log outgoing request for debugging
            console.log('[Proxy] Forwarding request to Anthropic API');
          });
          proxy.on('proxyRes', (proxyRes) => {
            // Log response for debugging
            console.log('[Proxy] Response status:', proxyRes.statusCode);
            // Strip Cloudflare and other cookies that cause domain issues
            const cookies = proxyRes.headers['set-cookie'];
            if (cookies) {
              const filteredCookies = cookies.filter((cookie: string) =>
                !cookie.includes('_cfuvid') &&
                !cookie.includes('_cf_bm') &&
                !cookie.includes('__cf')
              );
              proxyRes.headers['set-cookie'] = filteredCookies;
            }
          });
          proxy.on('error', (err) => {
            console.error('[Proxy] Error:', err);
          });
        }
      }
    }
  }
})
