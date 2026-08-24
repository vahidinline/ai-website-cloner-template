/**
 * Shared redirect validation used by the Sanity schema, the request-layer
 * proxy, and the import script so all three enforce identical rules.
 */

export const RESERVED_ROUTE_PREFIXES = ['/api', '/studio', '/_next'];
export const REDIRECT_STATUS_CODES = [301, 302, 307, 308, 410] as const;

export type RedirectSourceContext = {
  /** Normalized destination path for self-redirect detection. */
  destinationPath?: string;
  /** Other enabled sources already in the dataset. */
  existingSources?: Set<string>;
  statusCode?: number;
};

/** Strips query string/fragment, enforces a leading slash, removes trailing slashes. */
export function normalizeRedirectSource(sourcePath: string): string {
  let normalized = String(sourcePath || '').split('?')[0].split('#')[0];
  if (!normalized.startsWith('/')) normalized = `/${normalized}`;
  // Browsers percent-encode non-ASCII paths in requests. Normalizing here
  // lets editors paste readable Persian (or other Unicode) paths in Studio.
  normalized = encodeURI(normalized);
  if (!/^\/[\w\-./~%]*$/.test(normalized)) return '';
  if (normalized.length > 1) normalized = normalized.replace(/\/+$/, '') || '/';
  return normalized;
}

export type ValidationResult = { ok: true } | { ok: false; message: string };

/**
 * Validates a redirect source path against the shared rules. The context
 * checks are only meaningful when importing or publishing a full document;
 * the Studio schema uses the path-only checks.
 */
export function validateRedirectSource(
  rawSource: string,
  context: RedirectSourceContext = {}
): ValidationResult {
  if (!rawSource || typeof rawSource !== 'string') return { ok: false, message: 'A source path is required.' };
  if (!rawSource.startsWith('/') || rawSource.startsWith('//')) {
    return { ok: false, message: 'Must start with a single /.' };
  }
  if (/\s/.test(rawSource)) return { ok: false, message: 'Must not contain whitespace.' };
  const pathOnly = rawSource.split('?')[0].split('#')[0];
  if (pathOnly !== '/' && pathOnly.endsWith('/')) {
    return { ok: false, message: 'Trailing slashes are normalized away; use /path instead of /path/.' };
  }

  const source = normalizeRedirectSource(rawSource);
  if (!source) return { ok: false, message: 'Path contains characters that are not allowed in URLs.' };
  if (source === '/') return { ok: false, message: 'The home page cannot be redirected.' };
  if (RESERVED_ROUTE_PREFIXES.some((prefix) => source === prefix || source.startsWith(`${prefix}/`))) {
    return { ok: false, message: 'Application routes (/api, /studio, /_next) cannot be redirected.' };
  }

  const destination = context.destinationPath ? normalizeRedirectSource(context.destinationPath) : undefined;
  if (destination && destination === source) return { ok: false, message: 'A page cannot redirect to itself.' };
  if (context.existingSources?.has(source)) {
    return { ok: false, message: `Another active redirect already uses ${source}.` };
  }
  if (context.statusCode !== undefined && !REDIRECT_STATUS_CODES.includes(context.statusCode as (typeof REDIRECT_STATUS_CODES)[number])) {
    return { ok: false, message: 'Status code must be one of 301, 302, 307, 308 or 410.' };
  }

  return { ok: true };
}
