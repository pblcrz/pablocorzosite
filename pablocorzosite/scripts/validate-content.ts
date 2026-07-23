/**
 * Validates all content frontmatter and cross-file relationships.
 * Runs before every build; a non-empty issue list fails the build.
 *
 * Usage: node scripts/validate-content.ts
 */
import { validateContent } from '../src/utils/content-graph.ts';
import { loadArtifacts, loadIdeas } from './lib/load-content.ts';

const ideas = loadIdeas();
const artifacts = loadArtifacts();
const issues = validateContent(ideas, artifacts);

if (issues.length > 0) {
  console.error('Validation failed:\n');
  const byFile = new Map<string, string[]>();
  for (const issue of issues) {
    const list = byFile.get(issue.file) ?? [];
    list.push(issue.message);
    byFile.set(issue.file, list);
  }
  for (const [file, messages] of byFile) {
    console.error(file);
    for (const message of messages) console.error(`  - ${message}`);
    console.error('');
  }
  process.exit(1);
}

console.log(
  `Content OK — ${ideas.length} ideas, ${artifacts.length} artifacts, all references valid.`,
);
