import { defineType, defineField, defineArrayMember } from 'sanity';

/**
 * Simple table: rows of plain-text cells. The first row is always rendered
 * as the header row on the site.
 */
export const table = defineType({
  name: 'table',
  title: 'Table',
  type: 'object',
  fields: [
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      description: 'The first row is the header row.',
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          name: 'tableRow',
          title: 'Row',
          type: 'object',
          fields: [
            defineField({
              name: 'cells',
              title: 'Cells',
              type: 'array',
              of: [defineArrayMember({ type: 'string' })],
            }),
          ],
          preview: {
            select: { cells: 'cells' },
            prepare({ cells }: { cells?: string[] }) {
              return { title: (cells ?? []).join('  |  ') || 'Empty row' };
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional — shown under the table.',
    }),
  ],
  preview: {
    select: { caption: 'caption', rows: 'rows' },
    prepare({ caption, rows }: { caption?: string; rows?: unknown[] }) {
      const count = rows?.length ?? 0;
      return {
        title: caption || 'Table',
        subtitle: `${count} row${count === 1 ? '' : 's'}`,
      };
    },
  },
});
