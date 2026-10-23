import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/lessons' }),
  schema: z.object({
    section: z.string(), // "1.1"
    summary: z.string(),
    minutes: z.number(),
    prerequisites: z.array(z.string()).default([]),
    terms: z.array(z.object({ ar: z.string(), en: z.string(), def: z.string() })).default([]),
  }),
});

export const collections = { lessons };
