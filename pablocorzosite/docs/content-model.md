# Content model — connected ideas

The site distinguishes three concepts:

| Concept | Where it lives | What it means |
|---|---|---|
| **Artifact format** | `kind` frontmatter (Article, White Paper, Prototype, Framework) | What a published item *is* |
| **Theme** | `pillar` frontmatter / idea `themes` | The broad subject area. Not the connective mechanism |
| **Idea** | `src/content/ideas/*.md` | The underlying claim or observation that recurs across artifacts |

Ideas are the atomic unit. Artifacts are expressions of ideas.

## Idea files

One markdown file per idea in `src/content/ideas/`. The filename is the slug.

```markdown
---
title: "The Economics of Validation"
statement: >
  One or two sentences stating the claim itself.
status: "developing"        # emerging | developing | established | reconsidered
introducedAt: 2026-07-20
startHere: "artifact-slug"  # recommended first read; must reference this idea
themes:
  - "ai"
connections:
  - target: "another-idea-slug"
    type: "expands-into"    # builds-on | expands-into | applies | challenges
    note: >                 #   | contrasts-with | reframes
      Why the connection exists. Required — the site explains why ideas
      connect, it never merely states that they do.
draft: true                 # optional; keeps the idea out of production
---

Optional longer explanation of the idea and how it has developed.
```

Store each relationship **once**, on the source. Reverse connections are
computed automatically — never hand-write the mirror entry.

## Artifact frontmatter additions

```markdown
primaryIdea: "economics-of-validation"   # required for published artifacts
supportingIdeas:                          # only when materially present
  - "productization"
relationships:                            # explicit artifact-to-artifact links
  - target: "other-artifact-slug"
    type: "builds-on"
    note: >
      Why this piece relates to that one.
```

## Before publishing an artifact, answer

1. What central idea is this piece advancing? → `primaryIdea`
2. Is this introducing a new idea or developing an existing one?
3. Does it build on, expand, apply, challenge, contrast with, or reframe another idea?
4. What should the reader explore next? → relationships / idea `startHere`

## Rules

- Every published artifact has **exactly one** primary idea.
- Supporting ideas are used sparingly — only when the idea materially appears.
- Relationships require a reason (the `note`).
- Tags and themes do not replace idea relationships.
- Chronology does not automatically imply intellectual progression.
- Similar topics are not necessarily connected ideas.
- AI may suggest relationships, but the author approves them.
- Do not create an idea merely to classify one artifact.

## Relationship vocabulary

| Type | Outgoing label | Incoming label | Meaning |
|---|---|---|---|
| `builds-on` | Builds on | Built on in | Depends on or extends another idea's reasoning |
| `expands-into` | Expands into | Expanded in | Produces a broader or deeper implication |
| `applies` | Applied to | Applied in | Uses the idea in a specific domain or context |
| `challenges` | Challenges | Challenged in | Questions or disputes an earlier idea |
| `contrasts-with` | Contrasts with | Contrasted in | Clarifies by comparison with a different position |
| `reframes` | Reframes | Reframed in | Changes how something should be understood |

## Validation and builds

```bash
npm run validate:content   # cross-file reference checks; fails the build on errors
npm run build:graph        # emits public/data/content-graph.json (production view)
npm test                   # graph + validation test suite (node:test)
npm run build              # validate → graph → astro build
```

Drafts (`draft: true`) are visible and badged in the local dev server, excluded
from production builds, and validation forbids *published* content from
referencing draft ideas or artifacts.

## Working with Claude Code

When asking Claude to create an article from a draft, the expected flow is:

1. Review existing ideas (`src/content/ideas/`).
2. Recommend whether the piece introduces a new idea or develops an existing one.
3. Suggest one primary idea; supporting ideas only if materially present.
4. Suggest explicit relationships and explain why.
5. **Wait for author approval before writing relationship metadata.**
6. Create the markdown file using the schema above.
7. Run `npm run validate:content`.

Claude should never silently create intellectual relationships — they are
surfaced for review, always.
