import type { SanitySeo, SanitySiteSettings } from '@/sanity/types';

type JsonLd = Record<string, unknown>;

/** Converts editor-friendly Sanity fields into Schema.org JSON-LD. */
export function buildSiteJsonLd(
  structuredData?: SanitySiteSettings['structuredData'],
  page?: Pick<SanitySeo, 'canonicalUrl' | 'isProfilePage'>
): JsonLd | null {
  if (!structuredData?.type || !structuredData.name || !structuredData.id || !structuredData.url) return null;

  const image = structuredData.image?.url
    ? {
        '@type': 'ImageObject',
        '@id': `${structuredData.id}#image`,
        url: structuredData.image.url,
        contentUrl: structuredData.image.url,
        ...(structuredData.image.width ? { width: structuredData.image.width } : {}),
        ...(structuredData.image.height ? { height: structuredData.image.height } : {}),
        ...(structuredData.image.alt ? { caption: structuredData.image.alt } : {}),
      }
    : undefined;
  const organizations = (structuredData.organizations || [])
    .filter((organization) => organization.name)
    .map((organization) => ({
      '@type': 'Organization',
      name: organization.name,
      ...(organization.url ? { url: organization.url } : {}),
      ...(organization.sameAs?.filter(Boolean).length ? { sameAs: organization.sameAs.filter(Boolean) } : {}),
    }));
  const subjectOf = (structuredData.subjectOf || [])
    .filter((coverage) => coverage.url)
    .map((coverage) => ({
      '@type': coverage.type || 'NewsArticle',
      url: coverage.url,
      ...(coverage.headline ? { headline: coverage.headline } : {}),
    }));

  const person: JsonLd = {
    '@type': structuredData.type,
    '@id': structuredData.id,
    name: structuredData.name,
    url: structuredData.url,
    ...(structuredData.alternateName?.filter(Boolean).length ? { alternateName: structuredData.alternateName.filter(Boolean) } : {}),
    ...(structuredData.description ? { description: structuredData.description } : {}),
    ...(structuredData.jobTitle ? { jobTitle: structuredData.jobTitle } : {}),
    ...(image ? { image } : {}),
    ...(structuredData.sameAs?.filter(Boolean).length ? { sameAs: structuredData.sameAs.filter(Boolean) } : {}),
    ...(subjectOf.length ? { subjectOf } : {}),
    ...(organizations.length ? { worksFor: organizations } : {}),
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      person,
      ...(page?.isProfilePage && page.canonicalUrl
        ? [{ '@type': 'ProfilePage', '@id': `${page.canonicalUrl}#profile`, url: page.canonicalUrl, mainEntity: { '@id': structuredData.id } }]
        : []),
    ],
  };
}

/** Escapes the HTML-significant character allowed inside JSON strings. */
export function serializeJsonLd(jsonLd: JsonLd): string {
  return JSON.stringify(jsonLd).replace(/</g, '\\u003c');
}
