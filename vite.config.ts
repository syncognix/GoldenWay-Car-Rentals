import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { vehicles } from './src/data/vehicles.ts'

const SITE_URL = 'https://rentgoldenway.com'

const STATIC_ROUTES = [
  '/',
  '/fleet',
  '/book',
  '/how-it-works',
  '/about',
  '/why-goldenway',
  '/locations',
  '/gallery',
  '/reviews',
  '/faq',
  '/contact',
  '/policies',
]

/** Emits sitemap.xml at build time from the route list and vehicle data. */
function sitemap(): Plugin {
  return {
    name: 'goldenway-sitemap',
    apply: 'build',
    generateBundle() {
      const urls = [...STATIC_ROUTES, ...vehicles.map((v) => `/fleet/${v.slug}`)]
      const body = urls
        .map((u) => `  <url><loc>${SITE_URL}${u === '/' ? '' : u}</loc><changefreq>${u === '/' ? 'weekly' : 'monthly'}</changefreq></url>`)
        .join('\n')
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), sitemap()],
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three'
          if (id.includes('node_modules/gsap') || id.includes('node_modules/lenis')) return 'scroll'
          if (id.includes('node_modules/motion') || id.includes('node_modules/framer-motion')) return 'motion'
          if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) return 'react'
        },
      },
    },
  },
})
