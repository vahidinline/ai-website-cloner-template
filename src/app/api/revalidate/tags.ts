/**
 * Pure mapping from a Sanity webhook payload to the set of cache tags and
 * paths that must be invalidated. Unit-tested without Next.js runtime APIs.
 */

const collectionTags: Record<string, string> = {
  post: 'posts',
  podcastEpisode: 'podcastEpisodes',
  video: 'videos',
  book: 'books',
  page: 'pages',
};

const globalTypes = new Set(['siteSettings', 'redirect', 'archivePageSettings']);

export type WebhookBody = {
  _type?: string;
  _id?: string;
  slug?: string;
};

export function revalidationTargets(body: WebhookBody): { tags: string[]; path?: string } {
  if (!body?._type) return { tags: [] };

  const tags = [
    collectionTags[body._type] || body._type,
    body._id ? `${body._type}:${body._id}` : undefined,
    body.slug ? `${body._type}:${body.slug}` : undefined,
  ].filter((tag): tag is string => Boolean(tag));

  let path: string | undefined;
  if (body.slug) {
    path =
      body._type === 'post' ? `/blog/${body.slug}`
      : body._type === 'podcastEpisode' ? `/podcast/${body.slug}`
      : body._type === 'video' ? `/videos/${body.slug}`
      : body._type === 'book' ? `/books/${body.slug}`
      : body.slug === 'home' ? '/'
      : `/${body.slug}`;
  }

  return { tags, path };
}

export function isGlobalType(type: string): boolean {
  return globalTypes.has(type);
}
