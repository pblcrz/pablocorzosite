import { defineType, defineField } from 'sanity';

/** A fenced code block with an optional language label. */
export const codeBlock = defineType({
  name: 'codeBlock',
  title: 'Code block',
  type: 'object',
  fields: [
    defineField({
      name: 'code',
      title: 'Code',
      type: 'text',
      rows: 10,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: [
          'plain',
          'javascript',
          'typescript',
          'python',
          'sql',
          'html',
          'css',
          'json',
          'bash',
        ],
      },
      initialValue: 'plain',
    }),
  ],
  preview: {
    select: { code: 'code', language: 'language' },
    prepare({ code, language }: { code?: string; language?: string }) {
      return {
        title: (code ?? '').split('\n')[0] || 'Code block',
        subtitle: language,
      };
    },
  },
});
