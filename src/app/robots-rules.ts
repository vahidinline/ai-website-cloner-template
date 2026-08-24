import type { MetadataRoute } from 'next';

export type RobotsSettingsInput = {
  siteUrl?: string;
  robots?: { allowIndexing?: boolean; disallowPaths?: string[]; sitemapEnabled?: boolean };
};

/**
 * Pure builder for the robots.txt body so the Sanity-driven behavior can be
 * unit-tested without a database connection. `siteUrl` is only used for the
 * sitemap link.
 */
export function buildRobotsRules(settings: RobotsSettingsInput): MetadataRoute.Robots {
  const siteUrl = (settings.siteUrl || '').replace(/\/+$/, '');
  const allowIndexing = settings.robots?.allowIndexing !== false;

  return {
    rules: allowIndexing
      ? {
          userAgent: '*',
          allow: '/',
          disallow: (settings.robots?.disallowPaths || []).filter((path): path is string =>
            typeof path === 'string' && path.length > 0
          ),
        }
      : { userAgent: '*', disallow: '/' },
    sitemap:
      allowIndexing && settings.robots?.sitemapEnabled !== false && siteUrl
        ? `${siteUrl}/sitemap.xml`
        : undefined,
  };
}
