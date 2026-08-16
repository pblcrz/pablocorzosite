import type { APIRoute } from 'astro';

// The overview moved up to /prototypes/pulse once the demo took /prototypes/pulse/demo.
// This redirect keeps links that were already shared at the old path working.
export const prerender = false;

export const GET: APIRoute = ({ request }) =>
  Response.redirect(new URL('/prototypes/pulse', request.url).toString(), 308);
