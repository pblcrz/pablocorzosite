import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    // Permanent identifier for the piece. Not its position in a list —
    // never renumber on reorder.
    number: z.number().int().positive(),
    kind: z.enum(['Article', 'White Paper', 'Prototype', 'Framework']),
    pillar: z.string(),
    deck: z.string(),
    published: z.coerce.date(),
    readTime: z.number().int().nonnegative().optional(),
    externalLink: z.string().url().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { writing };
