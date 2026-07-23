/**
 * Tests for the content graph and validation logic.
 * Run: node --test scripts/
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildContentGraph,
  validateContent,
  relationshipLabels,
  inverseRelationshipLabels,
  RELATIONSHIP_TYPES,
  type ArtifactInput,
  type IdeaInput,
} from '../src/utils/content-graph.ts';
import { loadArtifacts, loadIdeas } from './lib/load-content.ts';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function idea(overrides: Partial<IdeaInput> & { slug: string }): IdeaInput {
  return {
    title: overrides.slug,
    statement: 'A statement.',
    status: 'emerging',
    introducedAt: '2026-01-01',
    themes: [],
    connections: [],
    draft: false,
    ...overrides,
  };
}

function artifact(overrides: Partial<ArtifactInput> & { slug: string }): ArtifactInput {
  return {
    title: overrides.slug,
    kind: 'Article',
    pillar: 'AI',
    deck: 'A deck.',
    published: '2026-02-01',
    draft: false,
    featured: false,
    primaryIdea: 'idea-a',
    supportingIdeas: [],
    relationships: [],
    ...overrides,
  };
}

const baseIdeas = [idea({ slug: 'idea-a' }), idea({ slug: 'idea-b' })];

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

test('valid idea and artifact sets produce no issues', () => {
  const issues = validateContent(baseIdeas, [artifact({ slug: 'art-1' })]);
  assert.equal(issues.length, 0);
});

test('published artifact without primaryIdea fails', () => {
  const issues = validateContent(baseIdeas, [
    artifact({ slug: 'art-1', primaryIdea: undefined }),
  ]);
  assert.ok(issues.some((issue) => issue.message.includes('no primaryIdea')));
});

test('draft artifact without primaryIdea is allowed', () => {
  const issues = validateContent(baseIdeas, [
    artifact({ slug: 'art-1', primaryIdea: undefined, draft: true }),
  ]);
  assert.equal(issues.length, 0);
});

test('unknown idea reference is detected', () => {
  const issues = validateContent(baseIdeas, [
    artifact({ slug: 'art-1', primaryIdea: 'missing-idea' }),
  ]);
  assert.ok(issues.some((issue) => issue.message.includes('unknown idea: missing-idea')));
});

test('unknown artifact relationship target is detected', () => {
  const issues = validateContent(baseIdeas, [
    artifact({
      slug: 'art-1',
      relationships: [{ target: 'ghost', type: 'builds-on', note: 'x' }],
    }),
  ]);
  assert.ok(issues.some((issue) => issue.message.includes('unknown artifact: ghost')));
});

test('unknown idea-to-idea connection target is detected', () => {
  const issues = validateContent(
    [idea({ slug: 'idea-a', connections: [{ target: 'ghost', type: 'builds-on', note: 'x' }] })],
    [artifact({ slug: 'art-1' })],
  );
  assert.ok(issues.some((issue) => issue.message.includes('unknown idea: ghost')));
});

test('duplicate slugs are detected', () => {
  const ideaIssues = validateContent([...baseIdeas, idea({ slug: 'idea-a' })], []);
  assert.ok(ideaIssues.some((issue) => issue.message.includes('duplicate idea slug')));

  const artifactIssues = validateContent(baseIdeas, [
    artifact({ slug: 'art-1' }),
    artifact({ slug: 'art-1' }),
  ]);
  assert.ok(artifactIssues.some((issue) => issue.message.includes('duplicate artifact slug')));
});

test('self-references are detected for ideas and artifacts', () => {
  const ideaIssues = validateContent(
    [idea({ slug: 'idea-a', connections: [{ target: 'idea-a', type: 'builds-on', note: 'x' }] })],
    [],
  );
  assert.ok(ideaIssues.some((issue) => issue.message.includes('connects to itself')));

  const artifactIssues = validateContent(baseIdeas, [
    artifact({
      slug: 'art-1',
      relationships: [{ target: 'art-1', type: 'builds-on', note: 'x' }],
    }),
  ]);
  assert.ok(artifactIssues.some((issue) => issue.message.includes('connects to itself')));
});

test('duplicate relationships are detected', () => {
  const issues = validateContent(baseIdeas, [
    artifact({ slug: 'art-1' }),
    artifact({
      slug: 'art-2',
      relationships: [
        { target: 'art-1', type: 'builds-on', note: 'x' },
        { target: 'art-1', type: 'builds-on', note: 'y' },
      ],
    }),
  ]);
  assert.ok(issues.some((issue) => issue.message.includes('duplicate relationship to: art-1')));
});

test('relationship without a note fails', () => {
  const issues = validateContent(baseIdeas, [
    artifact({
      slug: 'art-1',
      relationships: [{ target: 'art-2', type: 'builds-on', note: '' }],
    }),
    artifact({ slug: 'art-2' }),
  ]);
  assert.ok(issues.some((issue) => issue.message.includes('no explanatory note')));
});

test('invalid relationship type and status are detected', () => {
  const issues = validateContent(
    [
      idea({
        slug: 'idea-a',
        // deliberately invalid values
        status: 'speculative' as never,
        connections: [{ target: 'idea-b', type: 'related-to' as never, note: 'x' }],
      }),
      idea({ slug: 'idea-b' }),
    ],
    [],
  );
  assert.ok(issues.some((issue) => issue.message.includes('invalid status')));
  assert.ok(issues.some((issue) => issue.message.includes('invalid relationship type')));
});

test('startHere validation: unknown target and non-referencing artifact', () => {
  const unknown = validateContent(
    [idea({ slug: 'idea-a', startHere: 'ghost' })],
    [artifact({ slug: 'art-1' })],
  );
  assert.ok(unknown.some((issue) => issue.message.includes('startHere references unknown')));

  const nonReferencing = validateContent(
    [idea({ slug: 'idea-a', startHere: 'art-1' }), idea({ slug: 'idea-b' })],
    [artifact({ slug: 'art-1', primaryIdea: 'idea-b' })],
  );
  assert.ok(
    nonReferencing.some((issue) => issue.message.includes('does not reference this idea')),
  );
});

test('supporting idea duplicating the primary idea fails', () => {
  const issues = validateContent(baseIdeas, [
    artifact({ slug: 'art-1', primaryIdea: 'idea-a', supportingIdeas: ['idea-a'] }),
  ]);
  assert.ok(issues.some((issue) => issue.message.includes('duplicates the primary idea')));
});

test('invalid dates are detected', () => {
  const issues = validateContent(
    [idea({ slug: 'idea-a', introducedAt: 'not-a-date' })],
    [artifact({ slug: 'art-1', published: 'garbage' })],
  );
  assert.ok(issues.some((issue) => issue.message.includes('invalid introducedAt')));
  assert.ok(issues.some((issue) => issue.message.includes('invalid published date')));
});

test('published content referencing drafts fails; draft-to-draft is fine', () => {
  const issues = validateContent(
    [idea({ slug: 'idea-a', draft: true }), idea({ slug: 'idea-b' })],
    [artifact({ slug: 'art-1', primaryIdea: 'idea-a' })],
  );
  assert.ok(issues.some((issue) => issue.message.includes('references draft idea')));

  const draftIssues = validateContent(
    [idea({ slug: 'idea-a', draft: true })],
    [artifact({ slug: 'art-1', primaryIdea: 'idea-a', draft: true })],
  );
  assert.equal(draftIssues.length, 0);
});

// ---------------------------------------------------------------------------
// Graph
// ---------------------------------------------------------------------------

test('reverse idea connections are generated', () => {
  const graph = buildContentGraph(
    [
      idea({
        slug: 'idea-a',
        connections: [{ target: 'idea-b', type: 'expands-into', note: 'why' }],
      }),
      idea({ slug: 'idea-b' }),
    ],
    [],
  );
  const target = graph.ideas.find((node) => node.slug === 'idea-b');
  assert.deepEqual(target?.incomingConnections, [
    { source: 'idea-a', type: 'expands-into', note: 'why' },
  ]);
});

test('same-primary-idea artifacts and supporting lookup', () => {
  const graph = buildContentGraph(baseIdeas, [
    artifact({ slug: 'art-1', published: '2026-01-01' }),
    artifact({ slug: 'art-2', published: '2026-02-01' }),
    artifact({ slug: 'art-3', published: '2026-03-01', primaryIdea: 'idea-b', supportingIdeas: ['idea-a'] }),
  ]);
  const art1 = graph.artifacts.find((node) => node.slug === 'art-1');
  assert.deepEqual(art1?.sameIdeaArtifacts, ['art-2']);

  const ideaA = graph.ideas.find((node) => node.slug === 'idea-a');
  assert.deepEqual(ideaA?.primaryArtifacts, ['art-1', 'art-2']);
  assert.deepEqual(ideaA?.supportingArtifacts, ['art-3']);
  assert.equal(ideaA?.artifactCount, 3);
  assert.equal(ideaA?.latestArtifact, 'art-3');
  assert.equal(ideaA?.firstArtifactAt, '2026-01-01');
  assert.equal(ideaA?.lastArtifactAt, '2026-03-01');
});

test('featured artifacts rank first among same-idea siblings', () => {
  const graph = buildContentGraph(baseIdeas, [
    artifact({ slug: 'art-1', published: '2026-01-01' }),
    artifact({ slug: 'art-2', published: '2026-03-01' }),
    artifact({ slug: 'art-3', published: '2026-02-01', featured: true }),
  ]);
  const art1 = graph.artifacts.find((node) => node.slug === 'art-1');
  assert.deepEqual(art1?.sameIdeaArtifacts, ['art-3', 'art-2']);
});

test('drafts are excluded from the production graph but included in preview', () => {
  const inputs: [IdeaInput[], ArtifactInput[]] = [
    [idea({ slug: 'idea-a' }), idea({ slug: 'idea-hidden', draft: true })],
    [artifact({ slug: 'art-1' }), artifact({ slug: 'art-hidden', draft: true })],
  ];
  const production = buildContentGraph(...inputs);
  assert.deepEqual(
    production.ideas.map((node) => node.slug),
    ['idea-a'],
  );
  assert.deepEqual(
    production.artifacts.map((node) => node.slug),
    ['art-1'],
  );

  const preview = buildContentGraph(...inputs, { includeDrafts: true });
  assert.equal(preview.ideas.length, 2);
  assert.equal(preview.artifacts.length, 2);
});

test('graph handles empty optional fields', () => {
  const graph = buildContentGraph([idea({ slug: 'idea-a' })], []);
  const node = graph.ideas[0];
  assert.equal(node.artifactCount, 0);
  assert.equal(node.latestArtifact, undefined);
  assert.deepEqual(node.incomingConnections, []);
});

test('relationship labels cover the full vocabulary, both directions', () => {
  for (const type of RELATIONSHIP_TYPES) {
    assert.ok(relationshipLabels[type], `missing label for ${type}`);
    assert.ok(inverseRelationshipLabels[type], `missing inverse label for ${type}`);
  }
});

// ---------------------------------------------------------------------------
// Real repository content
// ---------------------------------------------------------------------------

test('actual site content parses and validates', () => {
  const ideas = loadIdeas();
  const artifacts = loadArtifacts();
  assert.ok(ideas.length >= 3, 'expected at least the initial idea set');
  assert.ok(artifacts.length >= 4, 'expected the published artifacts');
  assert.deepEqual(validateContent(ideas, artifacts), []);
});
