/**
 * Emits the production content graph to public/data/content-graph.json.
 * Drafts are excluded; no filesystem paths are exposed.
 *
 * Usage: node scripts/build-graph.ts
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { buildContentGraph } from '../src/utils/content-graph.ts';
import { loadArtifacts, loadIdeas } from './lib/load-content.ts';

const graph = buildContentGraph(loadIdeas(), loadArtifacts(), { includeDrafts: false });

const outDir = new URL('../public/data/', import.meta.url).pathname;
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}content-graph.json`, JSON.stringify(graph, null, 2));

console.log(
  `Graph written — ${graph.ideas.length} ideas, ${graph.artifacts.length} published artifacts → public/data/content-graph.json`,
);
