/**
 * Loads idea and artifact frontmatter from src/content for the standalone
 * scripts (validation, graph build, tests). Astro pages use the collections
 * API instead; both feed the same graph module.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';
import yaml from 'js-yaml';
import type { ArtifactInput, IdeaInput } from '../../src/utils/content-graph.ts';

const CONTENT_ROOT = new URL('../../src/content/', import.meta.url).pathname;

function parseFrontmatter(path: string): Record<string, unknown> {
  const text = readFileSync(path, 'utf8');
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error(`${path}: no frontmatter block found`);
  const data = yaml.load(match[1]);
  if (typeof data !== 'object' || data === null) {
    throw new Error(`${path}: frontmatter is not a mapping`);
  }
  return data as Record<string, unknown>;
}

function mdFiles(dir: string): string[] {
  try {
    return readdirSync(dir)
      .filter((name) => name.endsWith('.md'))
      .map((name) => join(dir, name));
  } catch {
    return [];
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function asConnections(value: unknown): any[] {
  return Array.isArray(value) ? value : [];
}

export function loadIdeas(): IdeaInput[] {
  return mdFiles(join(CONTENT_ROOT, 'ideas')).map((path) => {
    const data = parseFrontmatter(path);
    return {
      slug: basename(path, '.md'),
      title: String(data.title ?? ''),
      statement: String(data.statement ?? '').trim(),
      status: data.status,
      introducedAt: data.introducedAt,
      startHere: data.startHere ? String(data.startHere) : undefined,
      themes: Array.isArray(data.themes) ? data.themes.map(String) : [],
      connections: asConnections(data.connections),
      draft: Boolean(data.draft),
    } as IdeaInput;
  });
}

export function loadArtifacts(): ArtifactInput[] {
  return mdFiles(join(CONTENT_ROOT, 'writing')).map((path) => {
    const data = parseFrontmatter(path);
    return {
      slug: basename(path, '.md'),
      title: String(data.title ?? ''),
      kind: String(data.kind ?? ''),
      pillar: String(data.pillar ?? ''),
      deck: String(data.deck ?? ''),
      published: data.published,
      draft: Boolean(data.draft),
      featured: Boolean(data.featured),
      primaryIdea: data.primaryIdea ? String(data.primaryIdea) : undefined,
      supportingIdeas: Array.isArray(data.supportingIdeas)
        ? data.supportingIdeas.map(String)
        : [],
      relationships: asConnections(data.relationships),
    } as ArtifactInput;
  });
}
