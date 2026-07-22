// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';
import sanity from '@sanity/astro';

import react from '@astrojs/react';

// astro.config.mjs runs before Astro's env loading, so `import.meta.env.PUBLIC_*`
// is not available here. Vite's loadEnv reads the same PUBLIC_ vars the pages use.
const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } = loadEnv(
  process.env.NODE_ENV ?? 'development',
  process.cwd(),
  ''
);

// `output: 'static'` + an adapter is Astro 5's hybrid mode: every existing page
// stays prerendered exactly as before, and only pages that opt out via
// `export const prerender = false` render on demand. Sanity-backed pages opt out
// so published content appears without a rebuild.
export default defineConfig({
  site: 'https://pablocorzo.com',
  output: 'static',
  // Cloudflare has no sharp at runtime. 'compile' optimizes images during the
  // build for prerendered pages, which is where this site's images live.
  adapter: cloudflare({ imageService: 'compile' }),
  integrations: [sanity({
    projectId: PUBLIC_SANITY_PROJECT_ID,
    dataset: PUBLIC_SANITY_DATASET,
    apiVersion: '2026-07-21',
    useCdn: false,
    // Studio is standalone in ../studio-pablocorzosite — deliberately not embedded,
    // so no studioBasePath here.
  }), react()],
  vite: {
    plugins: [tailwindcss()],
  },
});