import type { MetadataRoute } from 'next';
import { getSitemapDocuments, getSiteSettings } from '@/sanity/queries';
import type { SanitySiteSettings } from '@/sanity/types';
import { buildSitemapEntries, type SitemapDocument } from './sitemap-entries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [documents, settings] = await Promise.all([
    getSitemapDocuments() as Promise<SitemapDocument[]>,
    getSiteSettings() as Promise<SanitySiteSettings | null>,
  ]);
  return buildSitemapEntries(documents, settings?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL);
}
