import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
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
