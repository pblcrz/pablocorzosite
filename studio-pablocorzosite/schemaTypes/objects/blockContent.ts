import { defineType, defineArrayMember, defineField } from 'sanity';

/**
 * The article body. This is the full editor toolkit: every style, decorator,
 * annotation, and block type the site's .prose-article styles know how to
 * render. H1 is deliberately absent — the post title is the page's H1.
 */
export const blockContent = defineType({
  name: 'blockContent',
  title: 'Body',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Heading 2', value: 'h2' },
        { title: 'Heading 3', value: 'h3' },
        { title: 'Heading 4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
          { title: 'Underline', value: 'underline' },
          { title: 'Strike', value: 'strike-through' },
          { title: 'Code', value: 'code' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              defineField({
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (rule) =>
                  rule.uri({
                    allowRelative: true,
                    scheme: ['http', 'https', 'mailto'],
                  }),
              }),
              defineField({
                name: 'openInNewTab',
                type: 'boolean',
                title: 'Open in new tab',
                initialValue: false,
              }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          description: 'Describes the image for screen readers and SEO.',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'caption',
          type: 'string',
          title: 'Caption',
          description: 'Optional — shown under the image.',
        }),
      ],
    }),
    defineArrayMember({ type: 'table' }),
    defineArrayMember({ type: 'codeBlock' }),
    defineArrayMember({ type: 'divider' }),
  ],
});
