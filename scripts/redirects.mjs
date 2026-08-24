#!/usr/bin/env node
/**
 * Import/export Sanity redirect documents.
 *
 * Usage:
 *   node scripts/redirects.mjs export [file]     # write active redirects to JSON (default: redirects.json)
 *   node scripts/redirects.mjs import [file]     # upsert redirects from JSON (default: redirects.json)
 *
 * JSON shape: [{ sourcePath, destinationUrl?, destinationPath?, statusCode, enabled?, expiresAt?, notes? }]
 * destinationPath resolves against internal documents by slug (page/post/podcastEpisode/video/book).
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const __filename = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(__filename), '..');

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;
    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(path.join(rootDir, '.env.local'));

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-06-29';
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN;

if (!projectId || !token) {
  console.error('NEXT_PUBLIC_SANITY_PROJECT_ID and a write token (SANITY_API_WRITE_TOKEN) are required in .env.local');
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

// The validation module is TypeScript, so transpile-free reuse is limited to a
// duplicated-but-mirrored subset here; rules are documented in
// src/lib/redirect-validation.ts and covered by its tests.
function validateSourceShape(rawSource) {
  if (!rawSource || typeof rawSource !== 'string') return 'A source path is required.';
  if (!rawSource.startsWith('/') || rawSource.startsWith('//')) return 'Must start with a single /.';
  if (/\s/.test(rawSource)) return 'Must not contain whitespace.';
  const pathOnly = rawSource.split('?')[0].split('#')[0];
  if (pathOnly !== '/' && pathOnly.endsWith('/')) return 'Trailing slashes are normalized away; use /path instead of /path/.';
  if (!normalizeSource(pathOnly)) return 'Path contains characters that are not allowed in URLs.';
  if (pathOnly === '/') return 'The home page cannot be redirected.';
  if (['/api', '/studio', '/_next'].some((prefix) => pathOnly === prefix || pathOnly.startsWith(`${prefix}/`))) {
    return 'Application routes (/api, /studio, /_next) cannot be redirected.';
  }
  return null;
}

function normalizeSource(sourcePath) {
  let normalized = String(sourcePath || '').split('?')[0].split('#')[0];
  if (!normalized.startsWith('/')) normalized = `/${normalized}`;
  normalized = encodeURI(normalized);
  if (!/^\/[\w\-./~%]*$/.test(normalized)) return '';
  if (normalized.length > 1) normalized = normalized.replace(/\/+$/, '') || '/';
  return normalized;
}

async function resolveInternalBySlug(slug) {
  const doc = await client.fetch(
    `*[_type in ["page", "post", "podcastEpisode", "video", "book"] && slug.current == $slug][0]{_id, _type}`,
    { slug }
  );
  return doc ? { _type: 'reference', _ref: doc._id, _weak: false } : null;
}

async function validate(entry, existingSources) {
  const shapeError = validateSourceShape(String(entry.sourcePath ?? ''));
  if (shapeError) return { error: `${shapeError} (${entry.sourcePath})` };
  const sourcePath = normalizeSource(entry.sourcePath);

  const statusCode = Number(entry.statusCode || 301);
  if (![301, 302, 307, 308, 410].includes(statusCode)) return { error: `invalid status code ${statusCode}` };

  let destinationUrl;
  let destinationInternal;
  if (statusCode === 410) {
    // A 410 response deliberately has no destination.
  } else if (entry.destinationUrl) {
    try {
      const parsed = new URL(entry.destinationUrl);
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('protocol');
      destinationUrl = entry.destinationUrl;
    } catch {
      return { error: `invalid destinationUrl for ${sourcePath}` };
    }
  } else if (entry.destinationPath || entry.destinationSlug) {
    destinationInternal = await resolveInternalBySlug(String(entry.destinationPath || entry.destinationSlug));
    if (!destinationInternal) return { error: `no internal document found for slug "${entry.destinationPath || entry.destinationSlug}" (${sourcePath})` };
    if (normalizeSource(String(entry.destinationPath || entry.destinationSlug)) === sourcePath) return { error: `${sourcePath} redirects to itself` };
  } else {
    return { error: `${sourcePath} needs destinationUrl or destinationPath` };
  }

  if (existingSources.has(sourcePath)) return { error: `duplicate active source: ${sourcePath}` };

  return { sourcePath, destinationUrl, destinationInternal, statusCode, enabled: entry.enabled !== false, expiresAt: entry.expiresAt, notes: entry.notes };
}

async function main() {
  const [command, fileArg] = process.argv.slice(2);
  const file = fileArg || 'redirects.json';

  if (command === 'export') {
    const docs = await client.fetch(`*[_type == "redirect"] | order(sourcePath asc){
      sourcePath, destinationUrl,
      "destinationPath": destinationInternal->slug.current,
      statusCode, enabled, expiresAt, notes, _createdAt, _updatedAt
    }`);
    writeFileSync(file, `${JSON.stringify(docs, null, 2)}\n`);
    console.log(`Exported ${docs.length} redirects to ${file}`);
    return;
  }

  if (command === 'import') {
    const entries = JSON.parse(readFileSync(file, 'utf8'));
    if (!Array.isArray(entries)) throw new Error(`${file} must contain an array`);

    // Existing enabled, unexpired sources — reject duplicates before mutating anything.
    const existing = await client.fetch(
      `*[_type == "redirect" && enabled != false && (!defined(expiresAt) || expiresAt > now())]{_id, sourcePath}`
    );
    const existingSources = new Set(existing.map((doc) => normalizeSource(doc.sourcePath)));

    const validated = [];
    for (const entry of entries) {
      const result = await validate(entry, existingSources);
      if (result.error) {
        console.error(`SKIP: ${result.error}`);
        continue;
      }
      existingSources.add(result.sourcePath);
      validated.push(result);
    }

    if (!validated.length) {
      console.log('Nothing to import.');
      return;
    }

    const tx = client.transaction();
    for (const doc of validated) {
      tx.createOrReplace({ ...doc, _type: 'redirect', _id: `redirect.${Buffer.from(doc.sourcePath).toString('hex')}` });
    }
    await tx.commit();
    console.log(`Imported ${validated.length} of ${entries.length} entries.`);
    return;
  }

  console.error('Usage: node scripts/redirects.mjs <export|import> [file]');
  process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
