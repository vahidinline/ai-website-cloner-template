import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const dryRun = process.argv.includes('--dry-run');

const documentTypes = [
  'page',
  'post',
  'podcastEpisode',
  'video',
  'book',
  'person',
  'siteSettings',
  'category',
];

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  const content = readFileSync(filePath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;
    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^[']|[']$/g, '')
      .replace(/^["]|["]$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(path.join(rootDir, '.env.local'));

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-06-29';
const token =
  process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN;

if (!projectId || projectId === 'u09gju27' || projectId === 'yourprojectid') {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local');
  process.exit(1);
}

if (!token) {
  console.error('Missing SANITY_API_WRITE_TOKEN in .env.local');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function escapeSelectorValue(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function tokenToPathPart(token) {
  if (typeof token === 'number') return `[${token}]`;
  if (token.type === 'arrayItemByKey') {
    return `[_key=="${escapeSelectorValue(token.key)}"]`;
  }
  return token;
}

function toPatchPath(tokens) {
  return tokens.map(tokenToPathPart).join('.').replace(/\.\[/g, '[');
}

function collectDanglingReferences(
  value,
  existingIds,
  pathTokens = [],
  changes = [],
) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      const itemToken =
        isPlainObject(item) && typeof item._key === 'string'
          ? { type: 'arrayItemByKey', key: item._key }
          : index;
      const itemPath = [...pathTokens, itemToken];

      if (
        isPlainObject(item) &&
        item._type === 'reference' &&
        typeof item._ref === 'string' &&
        !existingIds.has(item._ref)
      ) {
        changes.push({
          action: 'remove-array-item',
          path: toPatchPath(itemPath),
          ref: item._ref,
        });
        return;
      }

      collectDanglingReferences(item, existingIds, itemPath, changes);
    });
    return changes;
  }

  if (!isPlainObject(value)) return changes;

  if (
    value._type === 'reference' &&
    typeof value._ref === 'string' &&
    !existingIds.has(value._ref)
  ) {
    changes.push({
      action: 'unset-field',
      path: toPatchPath(pathTokens),
      ref: value._ref,
    });
    return changes;
  }

  for (const [key, nestedValue] of Object.entries(value)) {
    if (key.startsWith('_')) continue;
    collectDanglingReferences(
      nestedValue,
      existingIds,
      [...pathTokens, key],
      changes,
    );
  }

  return changes;
}

async function main() {
  console.log(
    `${dryRun ? 'Dry-running' : 'Fixing'} dangling Sanity references in ${projectId}/${dataset}...`,
  );

  const [documents, existingIds] = await Promise.all([
    client.fetch('*[_type in $types && !(_id in path("_.**"))]{...}', {
      types: documentTypes,
    }),
    client.fetch('*[!(_id in path("_.**"))]._id'),
  ]);

  const existingIdSet = new Set(existingIds);
  let changedDocuments = 0;
  let changedReferences = 0;

  for (const document of documents) {
    const changes = collectDanglingReferences(document, existingIdSet);
    if (!changes.length) continue;

    changedDocuments += 1;
    changedReferences += changes.length;

    console.log(`\n${document._id} (${document._type})`);
    for (const change of changes) {
      console.log(
        `  ${change.action}: ${change.path} -> missing ${change.ref}`,
      );
    }

    if (!dryRun) {
      await client
        .patch(document._id)
        .unset(changes.map((change) => change.path))
        .commit({ autoGenerateArrayKeys: false });
      console.log(`  ✓ removed ${changes.length} dangling reference(s)`);
    }
  }

  console.log(
    `\nDone. ${changedDocuments} document(s), ${changedReferences} dangling reference(s) ${
      dryRun ? 'would be removed' : 'removed'
    }.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
