// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import sanity from '@sanity/astro';
import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: netlify(),

  integrations: [
    react(),
    sanity({
    projectId: 'kqzxfqcl',
    dataset: 'production',
    useCdn: false,
    apiVersion: '2025-12-19',
    studioBasePath: '/studio',
  })],

  vite: {
    plugins: [tailwindcss()]
  }
});

/*
  https://developers.netlify.com/guides/how-to-use-sanity-cms-with-astro/#buildwebhooks

  https://www.sanity.io/docs/developer-guides/an-opinionated-guide-to-sanity-studio#ebbba4ecc31f
*/