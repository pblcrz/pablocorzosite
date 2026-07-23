import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { IDEA_STATUSES, RELATIONSHIP_TYPES } from './utils/content-graph';

/**
 * A typed connection to another idea or artifact. Stored once on the source;
 * reverse connections are computed by the content graph, never hand-written.
 * The note is required: the site explains *why* things connect.
 */
const relationship = z.object({
  target: z.string().min(1),
  type: z.enum(RELATIONSHIP_TYPES),
  note: z.string().min(1),
});

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
    // --- Connected-ideas fields -------------------------------------
    // The one central idea this piece advances. Required for published
    // artifacts (enforced by scripts/validate-content.ts, which can see
    // across collections; drafts may leave it unset while in progress).
    primaryIdea: z.string().optional(),
    // Ideas that materially appear in the piece. Not a tagging system.
    supportingIdeas: z.array(z.string()).default([]),
    // Explicit editorial links to other artifacts.
    relationships: z.array(relationship).default([]),
  }),
});

/**
 * Ideas are the atomic unit of the connected-content system; artifacts are
 * expressions of ideas. The file id (filename) is the idea's slug, matching
 * the writing collection's convention.
 */
const ideas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/ideas' }),
  schema: z.object({
    title: z.string(),
    statement: z.string(),
    status: z.enum(IDEA_STATUSES),
    introducedAt: z.coerce.date(),
    // Slug of the recommended first artifact for this idea.
    startHere: z.string().optional(),
    // Broad subject areas (mirrors artifact pillars). Not the connective
    // mechanism — connections below are.
    themes: z.array(z.string()).default([]),
    connections: z.array(relationship).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { writing, ideas };
