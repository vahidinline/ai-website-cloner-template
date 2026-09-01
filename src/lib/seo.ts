import type { Metadata } from 'next';
import type { SanitySeo } from '@/sanity/types';

/** Builds canonical and reciprocal language alternate annotations from Sanity. */
export function buildAlternates(
  seo?: SanitySeo,
  siteUrl?: string,
  pathname = '/'
): Metadata['alternates'] {
  const languages = Object.fromEntries(
    (seo?.languageAlternates || [])
      .filter((alternate): alternate is { language: string; url: string } => Boolean(alternate.language && alternate.url))
      .map((alternate) => [alternate.language, alternate.url])
  );

  const canonical = seo?.canonicalUrl || buildCanonicalUrl(siteUrl, pathname);
  if (!canonical && Object.keys(languages).length === 0) return undefined;

  return {
    ...(canonical ? { canonical } : {}),
    ...(Object.keys(languages).length ? { languages } : {}),
  };
}

function buildCanonicalUrl(siteUrl: string | undefined, pathname: string): string | undefined {
  if (!siteUrl) return undefined;

  return new URL(pathname, `${siteUrl.replace(/\/+$/, '')}/`).toString();
}
