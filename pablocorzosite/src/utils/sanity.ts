import { sanityClient } from 'sanity:client';
import { defineQuery } from 'groq';
import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';
import type { PortableTextBlock } from '@portabletext/types';

/**
 * Shape returned by the queries below. Mirrors the `post` schema in
 * ../../studio-pablocorzosite/schemaTypes/post.ts, which in turn mirrors the
 * `writing` content collection. Swap these for generated types if you adopt
 * Sanity TypeGen later.
 */
export type SanityPost = {
  _id: string;
  title: string;
  slug: string;
  number: number;
  kind: 'Article' | 'White Paper' | 'Prototype' | 'Framework';
  pillar: string;
  deck: string;
  published: string;
  readTime?: number;
  externalLink?: string;
  featured: boolean;
};

export type SanityPostDetail = SanityPost & {
  body?: PortableTextBlock[];
};

const POST_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  number,
  kind,
  pillar,
  deck,
  published,
  readTime,
  externalLink,
  featured
`;

const POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(published desc) {
    ${POST_FIELDS}
  }
`);

const POST_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    ${POST_FIELDS},
    body
  }
`);

export function getPosts(): Promise<SanityPost[]> {
  return sanityClient.fetch(POSTS_QUERY);
}

export function getPost(slug: string): Promise<SanityPostDetail | null> {
  return sanityClient.fetch(POST_QUERY, { slug });
}

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
