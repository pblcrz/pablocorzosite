import type { APIRoute } from 'astro';
// The overview is the entry point for /prototypes/pulse; the demo itself is the
// static iframe page at /prototypes/pulse/demo.
//
// The overview is authored in the pulse-demo repo and copied in whole by its
// deploy/publish-overview.sh, so it ships as one opaque HTML string rather than
// as an Astro page. It lives in src/ (not public/) on purpose: Cloudflare serves
// public/ straight off the CDN without running the Worker, which would leave the
// page ungated no matter what this route does.
import page from '../../../prototypes/pulse-overview.html?raw';

// Runs on demand so the password can be checked per request. Everything else on
// the site stays prerendered (see the output: 'static' note in astro.config.mjs).
export const prerender = false;

const REALM = 'PULSE concept overview';

/** Compare without leaking the answer through response timing. */
function matches(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Pull the password out of an `Authorization: Basic` header. Any username passes. */
function passwordFrom(header: string | null): string | null {
  if (!header?.startsWith('Basic ')) return null;
  try {
    const decoded = atob(header.slice(6));
    const separator = decoded.indexOf(':');
    return separator === -1 ? null : decoded.slice(separator + 1);
  } catch {
    return null;
  }
}

const challenge = () =>
  new Response('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
      'Cache-Control': 'no-store',
    },
  });

export const GET: APIRoute = ({ request, locals }) => {
  const expected = (locals as any).runtime?.env?.PULSE_OVERVIEW_PASSWORD;

  // Fail closed. An unset secret means the gate is not configured yet, and
  // serving the page anyway would defeat the point of having one.
  if (!expected) {
    return new Response('This page is not available.', {
      status: 503,
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  const supplied = passwordFrom(request.headers.get('Authorization'));
  if (supplied === null || !matches(supplied, expected)) return challenge();

  return new Response(page, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
      // Never let a shared cache hold the authenticated copy.
      'Cache-Control': 'private, no-store',
    },
  });
};
