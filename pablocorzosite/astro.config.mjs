// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';
import sanity from '@sanity/astro';

import react from '@astrojs/react';

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
  // Public identifiers, not secrets — hardcoded so builds don't depend on env vars.
  integrations: [sanity({
    projectId: 'lzvdnbe4',
    dataset: 'production',
    apiVersion: '2026-07-21',
    useCdn: false,
    // Studio is standalone in ../studio-pablocorzosite — deliberately not embedded,
    // so no studioBasePath here.
  }), react()],
  vite: {
    plugins: [tailwindcss()],
  },
});