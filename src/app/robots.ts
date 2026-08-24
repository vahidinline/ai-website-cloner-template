import type { MetadataRoute } from 'next';
import { getSiteSettings } from '@/sanity/queries';
import type { SanitySiteSettings } from '@/sanity/types';
import { buildRobotsRules } from './robots-rules';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings() as SanitySiteSettings | null;
  return buildRobotsRules({
    siteUrl: settings?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL,
    robots: settings?.robots,
  });
}
