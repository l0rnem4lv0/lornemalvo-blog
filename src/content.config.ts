import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  // Each post is a folder: src/content/posts/[slug]/index.md (+ images).
  // generateId strips the trailing /index so entry.id stays a clean slug
  // and existing /posts/[slug] URLs keep working.
  loader: glob({
    pattern: '**/index.md',
    base: './src/content/posts',
    generateId: ({ entry }) => entry.replace(/\/index\.md$/, ''),
  }),
  schema: z.object({
    title: z.string().max(100),
    date: z.date(),
    description: z.string().max(200),
    tags: z.array(z.string()),
    category: z.enum(['writeup', 'article', 'note']),
    difficulty: z.enum(['easy', 'medium', 'hard', 'insane']).optional(),
    draft: z.boolean().default(false),
    updated: z.date().optional(),
  }),
});

export const collections = { posts };
