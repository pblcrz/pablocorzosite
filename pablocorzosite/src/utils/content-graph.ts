/**
 * The connected-ideas content graph.
 *
 * Ideas are the atomic unit; artifacts (writing) are expressions of ideas.
 * Relationships are stored once on the source; reverse connections are
 * computed here, never hand-written.
 *
 * This module is pure and framework-free on purpose: Astro pages import it
 * through Vite, and scripts/ + tests run it directly under Node (which
 * strips types natively). Keep it dependency-free.
 */

// ---------------------------------------------------------------------------
// Vocabularies
// ---------------------------------------------------------------------------

export const RELATIONSHIP_TYPES = [
  'builds-on',
  'expands-into',
  'applies',
  'challenges',
  'contrasts-with',
  'reframes',
] as const;

export const IDEA_STATUSES = [
  'emerging',
  'developing',
  'established',
  'reconsidered',
] as const;

export type RelationshipType = (typeof RELATIONSHIP_TYPES)[number];
export type IdeaStatus = (typeof IDEA_STATUSES)[number];

/** Display labels for outgoing relationships ("this → target"). */
export const relationshipLabels: Record<RelationshipType, string> = {
  'builds-on': 'Builds on',
  'expands-into': 'Expands into',
  applies: 'Applied to',
  challenges: 'Challenges',
  'contrasts-with': 'Contrasts with',
  reframes: 'Reframes',
};

/** Display labels for incoming relationships ("source → this"). */
export const inverseRelationshipLabels: Record<RelationshipType, string> = {
  'builds-on': 'Built on in',
  'expands-into': 'Expanded in',
  applies: 'Applied in',
  challenges: 'Challenged in',
  'contrasts-with': 'Contrasted in',
  reframes: 'Reframed in',
};

// ---------------------------------------------------------------------------
// Input types (what the collections / frontmatter provide)
// ---------------------------------------------------------------------------

export interface Connection {
  target: string;
  type: RelationshipType;
  note: string;
}

export interface IdeaInput {
  slug: string;
  title: string;
  statement: string;
  status: IdeaStatus;
  /** ISO date string or Date. */
  introducedAt: string | Date;
  startHere?: string;
  themes: string[];
  connections: Connection[];
  draft: boolean;
}

export interface ArtifactInput {
  slug: string;
  title: string;
  /** Artifact format, e.g. "Article" | "White Paper" | "Prototype" | "Framework". */
  kind: string;
  /** Broad subject area (theme). */
  pillar: string;
  deck: string;
  /** ISO date string or Date. */
  published: string | Date;
  draft: boolean;
  featured: boolean;
  primaryIdea?: string;
  supportingIdeas: string[];
  relationships: Connection[];
}

// ---------------------------------------------------------------------------
// Graph node types (what the graph computes)
// ---------------------------------------------------------------------------

export interface IncomingConnection {
  source: string;
  type: RelationshipType;
  note: string;
}

export interface IdeaNode {
  slug: string;
  title: string;
  statement: string;
  status: IdeaStatus;
  /** Only ever true in preview builds; production graphs exclude drafts. */
  draft: boolean;
  introducedAt: string;
  startHere?: string;
  themes: string[];
  connections: Connection[];
  incomingConnections: IncomingConnection[];
  /** Slugs of artifacts with this idea as primaryIdea, oldest first. */
  primaryArtifacts: string[];
  /** Slugs of artifacts listing this idea in supportingIdeas, oldest first. */
  supportingArtifacts: string[];
  /** primaryArtifacts ∪ supportingArtifacts, oldest first. */
  allArtifacts: string[];
  artifactCount: number;
  firstArtifactAt?: string;
  lastArtifactAt?: string;
  /** Slug of the most recently published connected artifact. */
  latestArtifact?: string;
}

export interface ArtifactNode {
  slug: string;
  title: string;
  kind: string;
  pillar: string;
  deck: string;
  published: string;
  featured: boolean;
  /** Only ever true in preview builds; production graphs exclude drafts. */
  draft: boolean;
  primaryIdea?: string;
  supportingIdeas: string[];
  relationships: Connection[];
  incomingRelationships: IncomingConnection[];
  /** Other artifacts sharing this primaryIdea — featured first, then newest. */
  sameIdeaArtifacts: string[];
  /** Ideas this artifact touches (primary + supporting). */
  connectedIdeas: string[];
}

export interface ContentGraph {
  ideas: IdeaNode[];
  artifacts: ArtifactNode[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toIso(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  return date.toISOString().slice(0, 10);
}

function isValidDate(value: string | Date): boolean {
  const date = value instanceof Date ? value : new Date(value);
  return !Number.isNaN(date.getTime());
}

function byPublishedAsc(a: ArtifactInput, b: ArtifactInput): number {
  return new Date(a.published).getTime() - new Date(b.published).getTime();
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export interface ValidationIssue {
  file: string;
  message: string;
}

/**
 * Validates all cross-file invariants the zod schemas cannot see.
 * Draft-aware: drafts may be incomplete locally, but published content must
 * never reference anything that is missing from a production build.
 */
export function validateContent(
  ideas: IdeaInput[],
  artifacts: ArtifactInput[],
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const ideaFile = (slug: string) => `content/ideas/${slug}.md`;
  const artifactFile = (slug: string) => `content/writing/${slug}.md`;

  const ideasBySlug = new Map<string, IdeaInput>();
  const artifactsBySlug = new Map<string, ArtifactInput>();

  // Duplicate slugs
  for (const idea of ideas) {
    if (ideasBySlug.has(idea.slug)) {
      issues.push({ file: ideaFile(idea.slug), message: `duplicate idea slug: ${idea.slug}` });
    }
    ideasBySlug.set(idea.slug, idea);
  }
  for (const artifact of artifacts) {
    if (artifactsBySlug.has(artifact.slug)) {
      issues.push({
        file: artifactFile(artifact.slug),
        message: `duplicate artifact slug: ${artifact.slug}`,
      });
    }
    artifactsBySlug.set(artifact.slug, artifact);
  }

  const checkConnections = (
    file: string,
    sourceSlug: string,
    sourceIsDraft: boolean,
    connections: Connection[],
    targetKind: 'idea' | 'artifact',
  ) => {
    const seen = new Set<string>();
    for (const connection of connections) {
      if (!connection.target || connection.target.trim() === '') {
        issues.push({ file, message: 'relationship has an empty target' });
        continue;
      }
      if (!RELATIONSHIP_TYPES.includes(connection.type)) {
        issues.push({
          file,
          message: `invalid relationship type "${connection.type}" (allowed: ${RELATIONSHIP_TYPES.join(', ')})`,
        });
      }
      if (!connection.note || connection.note.trim() === '') {
        issues.push({
          file,
          message: `relationship to "${connection.target}" has no explanatory note`,
        });
      }
      if (connection.target === sourceSlug) {
        issues.push({ file, message: `connects to itself: ${sourceSlug}` });
      }
      const key = `${connection.target}::${connection.type}`;
      if (seen.has(key)) {
        issues.push({
          file,
          message: `duplicate relationship to: ${connection.target} (${connection.type})`,
        });
      }
      seen.add(key);

      const target =
        targetKind === 'idea'
          ? ideasBySlug.get(connection.target)
          : artifactsBySlug.get(connection.target);
      if (!target) {
        issues.push({
          file,
          message: `relationship references unknown ${targetKind}: ${connection.target}`,
        });
      } else if (!sourceIsDraft && target.draft) {
        issues.push({
          file,
          message: `published content references draft ${targetKind}: ${connection.target}`,
        });
      }
    }
  };

  // Idea-level checks
  for (const idea of ideas) {
    const file = ideaFile(idea.slug);

    if (!IDEA_STATUSES.includes(idea.status)) {
      issues.push({
        file,
        message: `invalid status "${idea.status}" (allowed: ${IDEA_STATUSES.join(', ')})`,
      });
    }
    if (!isValidDate(idea.introducedAt)) {
      issues.push({ file, message: `invalid introducedAt date: ${idea.introducedAt}` });
    }

    checkConnections(file, idea.slug, idea.draft, idea.connections, 'idea');

    if (idea.startHere) {
      const target = artifactsBySlug.get(idea.startHere);
      if (!target) {
        issues.push({ file, message: `startHere references unknown artifact: ${idea.startHere}` });
      } else {
        if (!idea.draft && target.draft) {
          issues.push({
            file,
            message: `startHere references draft artifact: ${idea.startHere}`,
          });
        }
        const referencesIdea =
          target.primaryIdea === idea.slug || target.supportingIdeas.includes(idea.slug);
        if (!referencesIdea) {
          issues.push({
            file,
            message: `startHere artifact "${idea.startHere}" does not reference this idea`,
          });
        }
      }
    }
  }

  // Artifact-level checks
  for (const artifact of artifacts) {
    const file = artifactFile(artifact.slug);

    if (!isValidDate(artifact.published)) {
      issues.push({ file, message: `invalid published date: ${artifact.published}` });
    }

    if (!artifact.draft && !artifact.primaryIdea) {
      issues.push({ file, message: 'published artifact has no primaryIdea' });
    }

    const ideaRefs = [
      ...(artifact.primaryIdea ? [artifact.primaryIdea] : []),
      ...artifact.supportingIdeas,
    ];
    for (const ref of ideaRefs) {
      const idea = ideasBySlug.get(ref);
      if (!idea) {
        issues.push({ file, message: `references unknown idea: ${ref}` });
      } else if (!artifact.draft && idea.draft) {
        issues.push({ file, message: `published artifact references draft idea: ${ref}` });
      }
    }

    if (artifact.primaryIdea && artifact.supportingIdeas.includes(artifact.primaryIdea)) {
      issues.push({
        file,
        message: `supporting idea duplicates the primary idea: ${artifact.primaryIdea}`,
      });
    }
    const seenSupporting = new Set<string>();
    for (const ref of artifact.supportingIdeas) {
      if (seenSupporting.has(ref)) {
        issues.push({ file, message: `duplicate supporting idea: ${ref}` });
      }
      seenSupporting.add(ref);
    }

    checkConnections(file, artifact.slug, artifact.draft, artifact.relationships, 'artifact');
  }

  return issues;
}

// ---------------------------------------------------------------------------
// Graph builder
// ---------------------------------------------------------------------------

export interface BuildOptions {
  /** Include drafts (local/preview mode). Production builds exclude them. */
  includeDrafts?: boolean;
}

export function buildContentGraph(
  allIdeas: IdeaInput[],
  allArtifacts: ArtifactInput[],
  options: BuildOptions = {},
): ContentGraph {
  const includeDrafts = options.includeDrafts ?? false;

  const ideas = allIdeas.filter((idea) => includeDrafts || !idea.draft);
  const artifacts = allArtifacts
    .filter((artifact) => includeDrafts || !artifact.draft)
    .slice()
    .sort(byPublishedAsc);

  const visibleIdeaSlugs = new Set(ideas.map((idea) => idea.slug));
  const visibleArtifactSlugs = new Set(artifacts.map((artifact) => artifact.slug));

  // Reverse idea connections
  const incomingByIdea = new Map<string, IncomingConnection[]>();
  for (const idea of ideas) {
    for (const connection of idea.connections) {
      if (!visibleIdeaSlugs.has(connection.target)) continue;
      const list = incomingByIdea.get(connection.target) ?? [];
      list.push({ source: idea.slug, type: connection.type, note: connection.note });
      incomingByIdea.set(connection.target, list);
    }
  }

  // Reverse artifact relationships
  const incomingByArtifact = new Map<string, IncomingConnection[]>();
  for (const artifact of artifacts) {
    for (const relationship of artifact.relationships) {
      if (!visibleArtifactSlugs.has(relationship.target)) continue;
      const list = incomingByArtifact.get(relationship.target) ?? [];
      list.push({ source: artifact.slug, type: relationship.type, note: relationship.note });
      incomingByArtifact.set(relationship.target, list);
    }
  }

  // Artifacts per idea (artifacts are already oldest-first)
  const primaryByIdea = new Map<string, ArtifactInput[]>();
  const supportingByIdea = new Map<string, ArtifactInput[]>();
  for (const artifact of artifacts) {
    if (artifact.primaryIdea && visibleIdeaSlugs.has(artifact.primaryIdea)) {
      const list = primaryByIdea.get(artifact.primaryIdea) ?? [];
      list.push(artifact);
      primaryByIdea.set(artifact.primaryIdea, list);
    }
    for (const slug of artifact.supportingIdeas) {
      if (!visibleIdeaSlugs.has(slug)) continue;
      const list = supportingByIdea.get(slug) ?? [];
      list.push(artifact);
      supportingByIdea.set(slug, list);
    }
  }

  const ideaNodes: IdeaNode[] = ideas.map((idea) => {
    const primary = primaryByIdea.get(idea.slug) ?? [];
    const supporting = supportingByIdea.get(idea.slug) ?? [];
    const all = [...primary, ...supporting].sort(byPublishedAsc);
    const latest = all[all.length - 1];

    return {
      slug: idea.slug,
      title: idea.title,
      statement: idea.statement,
      status: idea.status,
      draft: idea.draft,
      introducedAt: toIso(idea.introducedAt),
      startHere: idea.startHere,
      themes: idea.themes,
      connections: idea.connections.filter((c) => visibleIdeaSlugs.has(c.target)),
      incomingConnections: incomingByIdea.get(idea.slug) ?? [],
      primaryArtifacts: primary.map((a) => a.slug),
      supportingArtifacts: supporting.map((a) => a.slug),
      allArtifacts: all.map((a) => a.slug),
      artifactCount: all.length,
      firstArtifactAt: all[0] ? toIso(all[0].published) : undefined,
      lastArtifactAt: latest ? toIso(latest.published) : undefined,
      latestArtifact: latest?.slug,
    };
  });

  const artifactNodes: ArtifactNode[] = artifacts.map((artifact) => {
    const siblings = (
      artifact.primaryIdea ? (primaryByIdea.get(artifact.primaryIdea) ?? []) : []
    ).filter((sibling) => sibling.slug !== artifact.slug);

    // Editorial relevance where data exists (featured), then newest first.
    const sameIdeaArtifacts = siblings
      .slice()
      .sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return new Date(b.published).getTime() - new Date(a.published).getTime();
      })
      .map((sibling) => sibling.slug);

    const connectedIdeas = [
      ...(artifact.primaryIdea && visibleIdeaSlugs.has(artifact.primaryIdea)
        ? [artifact.primaryIdea]
        : []),
      ...artifact.supportingIdeas.filter((slug) => visibleIdeaSlugs.has(slug)),
    ];

    return {
      slug: artifact.slug,
      title: artifact.title,
      kind: artifact.kind,
      pillar: artifact.pillar,
      deck: artifact.deck,
      published: toIso(artifact.published),
      featured: artifact.featured,
      draft: artifact.draft,
      primaryIdea: artifact.primaryIdea,
      supportingIdeas: artifact.supportingIdeas,
      relationships: artifact.relationships.filter((r) => visibleArtifactSlugs.has(r.target)),
      incomingRelationships: incomingByArtifact.get(artifact.slug) ?? [],
      sameIdeaArtifacts,
      connectedIdeas,
    };
  });

  return { ideas: ideaNodes, artifacts: artifactNodes };
}
