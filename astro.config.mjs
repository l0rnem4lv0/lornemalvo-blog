// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import expressiveCode from 'astro-expressive-code';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

export default defineConfig({
  site: 'https://lornemalvo.com',
  integrations: [
    // Options live in ec.config.mjs so the <Code> component can read them.
    expressiveCode(),
    sitemap({
      filter: (page) => !page.includes('/styleguide'),
    }),
    icon(),
  ],
  markdown: {
    // rehype-slug must run before rehype-autolink-headings: user plugins
    // execute before Astro's built-in slug pass, and autolink-headings
    // only links headings that already have an id.
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          test: ['h2', 'h3'],
          properties: {
            className: ['heading-anchor'],
            ariaHidden: 'true',
            tabIndex: -1,
            // Keep the "#" out of the Pagefind index — otherwise it leaks
            // into heading text in search results.
            'data-pagefind-ignore': '',
          },
          content: { type: 'text', value: '#' },
        },
      ],
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
