# pablocorzo.com

Astro + Tailwind v4. Static output, no adapter. Articles are Markdown files
in a content collection.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/
npm run check    # types + content schema
```

## Layout

```
src/
  content/writing/*.md   one file per piece, frontmatter validated by schema
  content.config.ts      the schema
  pages/
    index.astro          the index
    about.astro
    writing/[slug].astro article template
  layouts/Base.astro     head, masthead, footer, theme bootstrap
  components/ThemeToggle.astro
  styles/global.css      colour + text styles from tokens.json
```

## Adding a piece

Drop a `.md` file in `src/content/writing/`:

```markdown
---
title: 'The three-gate operating model'
number: 9
kind: 'Article'        # Article | White Paper | Prototype | Framework
pillar: 'Product Operations'
deck: 'One sentence that earns the click.'
published: 2026-04-14
readTime: 11           # optional; omitted hides the "min read" item
externalLink: '...'    # optional; renders the pill button
featured: false
draft: false           # true keeps it out of the build entirely
---

Body copy. First paragraph gets the drop cap automatically.
```

`number` is the piece's permanent identifier, not its position in the index.
Never renumber on reorder. The build fails loudly if frontmatter doesn't match
the schema, which is the point.

## Design tokens

`src/styles/global.css` is the single source of truth at runtime, transcribed
from `tokens.json`. Ten colour styles as CSS variables (dark on `:root`, light
under `[data-theme="light"]`) and the nine text styles as `.t-*` classes.

**Accent Fill and Accent Text are two separate tokens.** Identical in dark,
they diverge in light — `#FFB020` fill vs `#64091A` text, because marigold on
white smoke is unreadable. Anything that is accent-coloured *text* must use
`text-accent-text`. This is invisible if you only ever look at the dark theme.

## Theme

Index and About open dark; `/writing/*` opens light, set per page via the
`theme` prop on `Base.astro`. An inline script in `<head>` applies any stored
choice before first paint, so there is no flash.

One deliberate departure from the Framer brief: the choice is held in
`sessionStorage` rather than being reset on reload. This is a multi-page app,
so every navigation *is* a full reload — resetting on reload would mean the
toggle never survived a single click. Swap `sessionStorage` for a plain
variable in `Base.astro` if you want the original behaviour.

## Deploying to Cloudflare Pages

The build is fully static, so no adapter is needed.

**Dashboard:** Workers & Pages → Create → Pages → connect the repo, then

| Setting | Value |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | set `NODE_VERSION` = `22` (or newer) |

**Wrangler:**

```bash
npm run build
npx wrangler pages deploy dist --project-name=pablocorzo-site
```

`public/_headers` sets security headers and immutable caching on `/_astro/*`;
Cloudflare picks it up automatically.

If the site ever needs SSR — form handling, dynamic OG images, anything
per-request — install `@astrojs/cloudflare` and set `output: 'server'` in
`astro.config.mjs`. Nothing else here has to change.

## Content status

Eight pieces imported from `writing.csv`. Three have real bodies and build.
Five are `draft: true` because their body is still the literal word
"Placeholder":

- `ai-friction-remover`
- `ctv-incrementality`
- `value-of-the-unmeasured`
- `brick-scout`
- `definition-first`

Flip `draft` to `false` once each is written.
