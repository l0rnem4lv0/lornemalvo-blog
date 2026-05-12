// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import expressiveCode from 'astro-expressive-code';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://lornemalvo.com',
  integrations: [
    expressiveCode({
      themes: ['github-dark-default', 'github-light-default'],
      useDarkModeMediaQuery: false,
      themeCssSelector: (theme) =>
        `[data-theme="${theme.name.includes('dark') ? 'dark' : 'light'}"]`,
    }),
    sitemap(),
    icon(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
