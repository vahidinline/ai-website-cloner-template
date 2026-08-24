import { groq } from 'next-sanity';
import { normalizeRedirectSource } from '@/lib/redirect-validation';
import { sanityClient } from './client';
import type { SanityRedirect } from './types';

export { sanityClient };

export const imageFields = groq`{
  alt,
  caption,
  objectFit,
  focalPoint,
  link,
  "asset": asset->,
  "url": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height
}`;

/** Expands a button's internal reference so resolveButtonUrl() can resolve slugs. */
export const buttonFields = groq`{
  ...,
  "internalLink": internalLink->{_type, slug}
}`;

export const pageBySlugQuery = groq`*[_type == "page" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  status,
  seo,
  sections[]{
    ...,
    settings{..., backgroundImage ${imageFields}},
    image ${imageFields},
    backgroundImage ${imageFields},
    foregroundImage ${imageFields},
    images[] ${imageFields},
    logos[]{..., image ${imageFields}},
    stats,
    items,
    embed,
    cards[]{..., image ${imageFields}, link ${buttonFields}},
    primaryButton ${buttonFields},
    secondaryButton ${buttonFields},
    cta ${buttonFields},
    buttons[] ${buttonFields},
    books[]->{..., coverImage ${imageFields}, buyLinks[]},
    posts[]->{..., mainImage ${imageFields}, categories[]->{title, slug}},
    episodes[]->{..., mainImage ${imageFields}, coverImage ${imageFields}, thumbnail ${imageFields}, guests[]->{name, slug, portrait ${imageFields}}},
    videos[]->{..., thumbnail ${imageFields}}
  }
}`;

export const allPagesSlugsQuery = groq`*[_type == "page" && defined(slug.current)][]{"slug": slug.current}`;

export const allPostSlugsQuery = groq`*[_type == "post" && defined(slug.current)][]{"slug": slug.current}`;

export const allPodcastEpisodeSlugsQuery = groq`*[_type == "podcastEpisode" && defined(slug.current)][]{"slug": slug.current}`;

export const allVideoSlugsQuery = groq`*[_type == "video" && defined(slug.current)][]{"slug": slug.current}`;

export const allBookSlugsQuery = groq`*[_type == "book" && defined(slug.current)][]{"slug": slug.current}`;

export const postsQuery = groq`*[_type == "post"] | order(publishedAt desc){
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  mainImage ${imageFields},
  author->{name, slug, portrait ${imageFields}},
  categories[]->{title, slug}
}`;

export const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0]{
  ...,
  mainImage ${imageFields},
  author->{name, slug, portrait ${imageFields}, bio},
  categories[]->{title, slug}
}`;

export const podcastEpisodesQuery = groq`*[_type == "podcastEpisode"] | order(publishedAt desc){
  _id,
  title,
  slug,
  episodeNumber,
  publishedAt,
  coverImage ${imageFields},
  summary,
  guests[]->{name, slug, portrait ${imageFields}}
}`;

export const podcastEpisodeBySlugQuery = groq`*[_type == "podcastEpisode" && slug.current == $slug][0]{
  ...,
  coverImage ${imageFields},
  guests[]->{name, slug, portrait ${imageFields}}
}`;

export const videosQuery = groq`*[_type == "video"] | order(publishedAt desc){
  _id,
  title,
  slug,
  thumbnail ${imageFields},
  youtubeUrl,
  description,
  publishedAt,
  categories[]->{title, slug}
}`;

export const videoBySlugQuery = groq`*[_type == "video" && slug.current == $slug][0]{
  ...,
  thumbnail ${imageFields},
  categories[]->{title, slug}
}`;

export const booksQuery = groq`*[_type == "book"] | order(order asc, title asc){
  _id,
  title,
  slug,
  coverImage ${imageFields},
  description,
  buyLinks,
  order
}`;

export const bookBySlugQuery = groq`*[_type == "book" && slug.current == $slug][0]{
  ...,
  coverImage ${imageFields},
  buyLinks[]
}`;

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]{
  ...,
  logoLight ${imageFields},
  logoDark ${imageFields},
  favicon ${imageFields},
  appleTouchIcon ${imageFields},
  androidIcons[] ${imageFields},
  defaultSeo,
  footerCopyright,
  affiliateDisclosure,
  structuredData{
    ..., image ${imageFields}
  },
  footer{
    ...,
    logo ${imageFields},
    columns[]{
      ...,
      links[] ${buttonFields}
    },
    socialLinks[] ${buttonFields}
  },
  footerCta{
    ...,
    settings{..., backgroundImage ${imageFields}},
    image ${imageFields},
    backgroundImage ${imageFields},
    foregroundImage ${imageFields},
    buttons[] ${buttonFields}
  },
  footerNavigation[] ${buttonFields},
  socialLinks[] ${buttonFields},
  mainNavigation[] ${buttonFields},
  header{
    enabled,
    searchLabel,
    action ${buttonFields},
    navigationMenu->{
      _id,
      title,
      items[]{_key, label, url, openInNewTab, "internalLink": internalLink->{_type, slug}}
    }
  }
}`;

export const archivePageSettingsQuery = groq`*[_type == "archivePageSettings" && archiveType == $archiveType][0]{
  archiveType, eyebrow, title, introduction, emptyState, ordering, itemsPerPage,
  seo{..., ogImage ${imageFields}}
}`;

export const sitemapDocumentsQuery = groq`*[_type in ["page", "post", "podcastEpisode", "video", "book"] && defined(slug.current) && !coalesce(seo.noIndex, false)]{
  _type, "slug": slug.current, _updatedAt, publishedAt, "canonicalUrl": seo.canonicalUrl
}`;

export const redirectsQuery = groq`*[_type == "redirect" && enabled == true && (!defined(expiresAt) || expiresAt > now())]{
  sourcePath, destinationUrl, destinationInternal->{_type, slug}, statusCode
}`;

export const allRedirectsQuery = groq`*[_type == "redirect"] | order(sourcePath asc){
  _id, sourcePath, destinationUrl, destinationInternal->{_type, slug}, statusCode, enabled, expiresAt, notes, _createdAt, _updatedAt
}`;

async function fetchSanity<T>(query: string, params: Record<string, string> = {}, tags: string[] = []): Promise<T> {
  return sanityClient.fetch<T>(query, params, {
    next: { revalidate: 60, tags },
  });
}

export async function getPageBySlug(slug: string) {
  return fetchSanity(pageBySlugQuery, { slug }, ['pages', `page:${slug}`]);
}

export async function getHomePage() {
  return getPageBySlug('home');
}

export async function getPostBySlug(slug: string) {
  return fetchSanity(postBySlugQuery, { slug }, ['posts', `post:${slug}`]);
}

export async function getPosts() {
  return fetchSanity(postsQuery, {}, ['posts']);
}

export async function getPodcastEpisodes() {
  return fetchSanity(podcastEpisodesQuery, {}, ['podcastEpisodes']);
}

export async function getPodcastEpisodeBySlug(slug: string) {
  return fetchSanity(podcastEpisodeBySlugQuery, { slug }, ['podcastEpisodes', `podcastEpisode:${slug}`]);
}

export async function getVideos() {
  return fetchSanity(videosQuery, {}, ['videos']);
}

export async function getVideoBySlug(slug: string) {
  return fetchSanity(videoBySlugQuery, { slug }, ['videos', `video:${slug}`]);
}

export async function getBooks() {
  return fetchSanity(booksQuery, {}, ['books']);
}

export async function getBookBySlug(slug: string) {
  return fetchSanity(bookBySlugQuery, { slug }, ['books', `book:${slug}`]);
}

export async function getSiteSettings() {
  return fetchSanity(siteSettingsQuery, {}, ['site-settings']);
}

export async function getArchivePageSettings(archiveType: string) {
  return fetchSanity(archivePageSettingsQuery, { archiveType }, ['archive-settings', `archive:${archiveType}`]);
}

export async function getRedirect(sourcePath: string) {
  const redirects = await fetchSanity<SanityRedirect[]>(redirectsQuery, {}, ['redirects']);
  return redirects.find((redirect) => normalizeRedirectSource(redirect.sourcePath) === sourcePath) ?? null;
}

export async function getAllRedirects() {
  return fetchSanity(allRedirectsQuery, {}, ['redirects']);
}

export async function getSitemapDocuments() {
  return fetchSanity(sitemapDocumentsQuery, {}, ['sitemap', 'site-settings']);
}
