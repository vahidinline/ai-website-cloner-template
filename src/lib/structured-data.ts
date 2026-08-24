import type { SanitySiteSettings } from '@/sanity/types';

type JsonLd = Record<string, string | string[] | undefined>;

/** Converts editor-friendly Sanity fields into Schema.org JSON-LD. */
export function buildSiteJsonLd(
  structuredData?: SanitySiteSettings['structuredData']
): JsonLd | null {
  if (!structuredData?.type || !structuredData.name) return null;

  return {
    '@context': 'https://schema.org',
    '@type': structuredData.type,
    name: structuredData.name,
    url: structuredData.url,
    description: structuredData.description,
    image: structuredData.image?.url,
    sameAs: structuredData.sameAs?.filter(Boolean),
  };
}

/** Escapes the HTML-significant character allowed inside JSON strings. */
export function serializeJsonLd(jsonLd: JsonLd): string {
  return JSON.stringify(jsonLd).replace(/</g, '\\u003c');
}
