import { createHash } from 'node:crypto';
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

if (!projectId || projectId === 'u09gju27') {
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

function sanitizeKeyPart(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 48);
}

function stableKeyForItem(item, pathSegments, index) {
  const identityParts = [
    item._type,
    item._ref,
    item._id,
    item.title,
    item.name,
    item.label,
    item.question,
    item.text,
    pathSegments.join('.'),
    index,
  ].filter((part) => typeof part === 'string' || typeof part === 'number');

  const source = identityParts.join('|');
  const readable = sanitizeKeyPart(identityParts.slice(0, 4).join('-'));
  const hash = createHash('sha1').update(source).digest('hex').slice(0, 12);

  return readable ? `${readable}-${hash}` : `key-${hash}`;
}

function toPatchPath(pathSegments) {
  return pathSegments
    .map((segment) => (typeof segment === 'number' ? `[${segment}]` : segment))
    .join('.')
    .replace(/\.\[/g, '[');
}

function collectMissingOrDuplicateKeys(value, pathSegments = [], changes = []) {
  if (Array.isArray(value)) {
    const seenKeys = new Set();

    value.forEach((item, index) => {
      const itemPath = [...pathSegments, index];

      if (isPlainObject(item)) {
        const currentKey =
          typeof item._key === 'string' ? item._key : undefined;
        const isDuplicate = currentKey ? seenKeys.has(currentKey) : false;

        if (!currentKey || isDuplicate) {
          let nextKey = stableKeyForItem(item, pathSegments, index);
          let suffix = 1;
          while (seenKeys.has(nextKey)) {
            nextKey = `${stableKeyForItem(item, pathSegments, index)}-${suffix}`;
            suffix += 1;
          }

          changes.push({
            path: toPatchPath([...itemPath, '_key']),
            key: nextKey,
            reason: currentKey ? 'duplicate' : 'missing',
          });
          seenKeys.add(nextKey);
        } else {
          seenKeys.add(currentKey);
        }
      }

      collectMissingOrDuplicateKeys(item, itemPath, changes);
    });
    return changes;
  }

  if (isPlainObject(value)) {
    for (const [key, nestedValue] of Object.entries(value)) {
      if (key.startsWith('_')) continue;
      collectMissingOrDuplicateKeys(
        nestedValue,
        [...pathSegments, key],
        changes,
      );
    }
  }

  return changes;
}

async function main() {
  console.log(
    `${dryRun ? 'Dry-running' : 'Fixing'} Sanity array keys in ${projectId}/${dataset}...`,
  );

  const documents = await client.fetch(
    '*[_type in $types && !(_id in path("_.**"))]{...}',
    { types: documentTypes },
  );

  let changedDocuments = 0;
  let changedItems = 0;

  for (const document of documents) {
    const changes = collectMissingOrDuplicateKeys(document);
    if (!changes.length) continue;

    changedDocuments += 1;
    changedItems += changes.length;

    console.log(`\n${document._id} (${document._type})`);
    for (const change of changes) {
      console.log(`  ${change.reason}: ${change.path} -> ${change.key}`);
    }

    if (!dryRun) {
      const patch = changes.reduce((set, change) => {
        set[change.path] = change.key;
        return set;
      }, {});

      await client
        .patch(document._id)
        .set(patch)
        .commit({ autoGenerateArrayKeys: false });
      console.log(`  ✓ patched ${changes.length} item(s)`);
    }
  }

  console.log(
    `\nDone. ${changedDocuments} document(s), ${changedItems} array item(s) ${
      dryRun ? 'would be patched' : 'patched'
    }.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
