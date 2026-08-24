import type { MetadataRoute } from 'next';

const collectionBasePaths: Record<string, string> = {
  post: 'blog',
  podcastEpisode: 'podcast',
  video: 'videos',
  book: 'books',
};

export type SitemapDocument = {
  _type: string;
  slug: string;
  _updatedAt?: string;
  publishedAt?: string;
  canonicalUrl?: string;
};

/**
 * Pure builder for sitemap entries so Sanity-driven behavior can be
 * unit-tested without a database connection.
 */
export function buildSitemapEntries(
  documents: SitemapDocument[],
  siteUrl: string | undefined
): MetadataRoute.Sitemap {
  const base = (siteUrl || '').replace(/\/+$/, '');
  if (!base) return [];

  return documents.map((document) => {
    const path =
      document._type === 'page'
        ? document.slug === 'home'
          ? '/'
          : `/${document.slug}`
        : `/${collectionBasePaths[document._type] || 'pages'}/${document.slug}`;
    // Canonical URLs are absolute in Sanity; keep relative ones working too.
    const url = document.canonicalUrl
      ? new URL(document.canonicalUrl, base).toString()
      : new URL(path, base).toString();
    // Prefer the editorial publish date, fall back to the last edit date.
    const lastModified = [document.publishedAt, document._updatedAt].find(
      (value): value is string => Boolean(value)
    );

    return {
      url,
      lastModified: lastModified ? new Date(lastModified) : undefined,
    };
  });
}
