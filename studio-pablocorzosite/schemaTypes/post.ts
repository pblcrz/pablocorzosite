import { defineType, defineField } from 'sanity';

/**
 * A piece of writing. Mirrors the SanityPost type consumed by the site in
 * pablocorzosite/src/utils/sanity.ts — keep the two in sync.
 */
export const post = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'number',
      title: 'Number',
      type: 'number',
      description: 'Position in the index — shown as "No. N" on the site.',
      validation: (rule) => rule.required().integer().positive(),
    }),
    defineField({
      name: 'kind',
      title: 'Kind',
      type: 'string',
      options: {
        list: ['Article', 'White Paper', 'Prototype', 'Framework'],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'pillar',
      title: 'Pillar',
      type: 'string',
      description: 'Topic pillar, e.g. AI or Experimentation.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'deck',
      title: 'Deck',
      type: 'text',
      rows: 3,
      description: 'One-or-two sentence standfirst shown on the index and in meta tags.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'published',
      title: 'Published',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'readTime',
      title: 'Read time (minutes)',
      type: 'number',
      validation: (rule) => rule.integer().positive(),
    }),
    defineField({
      name: 'externalLink',
      title: 'External link',
      type: 'url',
      description: 'Optional — PDF download or external destination.',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    }),
  ],
  orderings: [
    {
      title: 'Published, newest first',
      name: 'publishedDesc',
      by: [{ field: 'published', direction: 'desc' }],
    },
    {
      title: 'Number',
      name: 'numberAsc',
      by: [{ field: 'number', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', kind: 'kind', pillar: 'pillar', number: 'number' },
    prepare({ title, kind, pillar, number }) {
      return {
        title: `${number ? `${String(number).padStart(2, '0')} — ` : ''}${title ?? 'Untitled'}`,
        subtitle: [kind, pillar].filter(Boolean).join(' / '),
      };
    },
  },
});
