/**
 * Astro-side access to the content graph. Loads both collections once per
 * build (memoized), maps them to graph inputs, and exposes lookup maps.
 * Drafts are included in the dev server (badged in the UI) and excluded
 * from production builds — same behavior as the writing pages.
 */
import { getCollection } from 'astro:content';
import {
  buildContentGraph,
  type ArtifactInput,
  type ArtifactNode,
  type ContentGraph,
  type IdeaInput,
  type IdeaNode,
} from './content-graph';

export interface SiteGraph {
  graph: ContentGraph;
  ideasBySlug: Map<string, IdeaNode>;
  artifactsBySlug: Map<string, ArtifactNode>;
}

let cached: Promise<SiteGraph> | null = null;

async function load(): Promise<SiteGraph> {
  const [ideaEntries, writingEntries] = await Promise.all([
    getCollection('ideas'),
    getCollection('writing'),
  ]);

  const ideas: IdeaInput[] = ideaEntries.map((entry) => ({
    slug: entry.id,
    title: entry.data.title,
    statement: entry.data.statement.trim(),
    status: entry.data.status,
    introducedAt: entry.data.introducedAt,
    startHere: entry.data.startHere,
    themes: entry.data.themes,
    connections: entry.data.connections,
    draft: entry.data.draft,
  }));

  const artifacts: ArtifactInput[] = writingEntries.map((entry) => ({
    slug: entry.id,
    title: entry.data.title,
    kind: entry.data.kind,
    pillar: entry.data.pillar,
    deck: entry.data.deck,
    published: entry.data.published,
    draft: entry.data.draft,
    featured: entry.data.featured,
    primaryIdea: entry.data.primaryIdea,
    supportingIdeas: entry.data.supportingIdeas,
    relationships: entry.data.relationships,
  }));

  const graph = buildContentGraph(ideas, artifacts, {
    includeDrafts: import.meta.env.DEV,
  });

  return {
    graph,
    ideasBySlug: new Map(graph.ideas.map((idea) => [idea.slug, idea])),
    artifactsBySlug: new Map(graph.artifacts.map((artifact) => [artifact.slug, artifact])),
  };
}

export function getSiteGraph(): Promise<SiteGraph> {
  if (!cached) cached = load();
  return cached;
}

/** "July 2026" from an ISO date string. */
export function monthYear(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export const statusLabels: Record<IdeaNode['status'], string> = {
  emerging: 'Emerging',
  developing: 'Developing',
  established: 'Established',
  reconsidered: 'Reconsidered',
};
