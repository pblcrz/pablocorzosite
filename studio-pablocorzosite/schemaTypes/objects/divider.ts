import { defineType, defineField } from 'sanity';

/** A horizontal rule — a thematic break between sections. */
export const divider = defineType({
  name: 'divider',
  title: 'Divider',
  type: 'object',
  // Sanity objects need at least one field; this one is just a marker.
  fields: [
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      options: { list: ['line'] },
      initialValue: 'line',
      hidden: true,
    }),
  ],
  preview: {
    prepare() {
      return { title: '— Divider —' };
    },
  },
});
