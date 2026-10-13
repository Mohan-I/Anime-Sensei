import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import https from 'https'

/**
 * Probe whether api.tenrai.org is reachable from the Node process.
 * Times out in 4 s so startup is not blocked for long.
 */
const probeTenrai = () =>
  new Promise((resolve) => {
    const req = https.get(
      'https://api.tenrai.org/v1/top/anime?limit=1',
      { timeout: 4000 },
      (res) => { res.destroy(); resolve(res.statusCode < 500); }
    )
    req.on('error',   () => resolve(false))
    req.on('timeout', () => { req.destroy(); resolve(false) })
  })

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Only probe in development — prod builds always use the live URL
  let tenraiProxyAvailable = true
  if (mode === 'development') {
    tenraiProxyAvailable = await probeTenrai()
    console.log(
      tenraiProxyAvailable
        ? '  ✓ [Tenrai] api.tenrai.org reachable — using Vite proxy'
        : '  ✗ [Tenrai] api.tenrai.org blocked — switching to mock data'
    )
  }

  const TENRAI_TARGET = (env.VITE_TENRAI_BASE_URL || 'https://api.tenrai.org/v1').replace(/\/$/, '')

  return {
    plugins: [react()],

    // Inject the probe result so tenraiService.js can decide strategy at runtime
    define: {
      __TENRAI_PROXY_AVAILABLE__: JSON.stringify(tenraiProxyAvailable),
    },

    server: {
      proxy: tenraiProxyAvailable ? {
        '/tenrai': {
          target:       TENRAI_TARGET,
          changeOrigin: true,
          rewrite:      (path) => path.replace(/^\/tenrai/, ''),
          secure:       true,
          configure:    (proxy) => {
            proxy.on('error', (err) => console.error('[tenrai proxy]', err.message))
          },
        },
      } : {},
    },

    build: {
      chunkSizeWarningLimit: 1500,
    },
  }
})
