// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import expressiveCode from 'astro-expressive-code';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://lornemalvo.com',
  integrations: [
    // Options live in ec.config.mjs so the <Code> component can read them
    // (Astro requires Expressive Code options to be JSON-serializable when
    // declared here, and our themeCssSelector is a function).
    expressiveCode(),
    sitemap(),
    icon(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
