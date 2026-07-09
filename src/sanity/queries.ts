import { groq } from 'next-sanity';
import { sanityClient } from './client';

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

export const pageBySlugQuery = groq`*[_type == "page" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  seo,
  sections[]{
    ...,
    image ${imageFields},
    backgroundImage ${imageFields},
    foregroundImage ${imageFields},
    images[] ${imageFields},
    logos[]{..., image ${imageFields}},
    cards[]{..., image ${imageFields}},
    books[]->{..., coverImage ${imageFields}},
    posts[]->{..., mainImage ${imageFields}, categories[]->{title, slug}},
    episodes[]->{..., coverImage ${imageFields}, guests[]->{name, slug, portrait ${imageFields}}},
    videos[]->{..., thumbnail ${imageFields}}
  }
}`;

export const homePageQuery = groq`*[_type == "page" && slug.current == "home"][0]{
  title,
  seo{
    metaTitle,
    metaDescription,
    canonicalUrl,
    noIndex,
    ogImage ${imageFields}
  },
  sections[]{
    ...,
    _type,
    settings{
      ...,
      backgroundImage ${imageFields}
    },
    image ${imageFields},
    backgroundImage ${imageFields},
    foregroundImage ${imageFields},
    images[] ${imageFields},
    logos[]{..., image ${imageFields}},
    cards[]{..., image ${imageFields}},
    books[]->{..., coverImage ${imageFields}},
    posts[]->{..., mainImage ${imageFields}, categories[]->{title, slug}},
    episodes[]->{..., coverImage ${imageFields}, guests[]->{name, slug, portrait ${imageFields}}},
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
  coverImage ${imageFields}
}`;

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]{
  ...,
  logoLight ${imageFields},
  logoDark ${imageFields},
  defaultSeo
}`;

export async function getPageBySlug(slug: string) {
  return sanityClient.fetch(pageBySlugQuery, { slug });
}

export async function getHomePage() {
  return sanityClient.fetch(homePageQuery);
}

export async function getPostBySlug(slug: string) {
  return sanityClient.fetch(postBySlugQuery, { slug });
}

export async function getPosts() {
  return sanityClient.fetch(postsQuery);
}

export async function getPodcastEpisodes() {
  return sanityClient.fetch(podcastEpisodesQuery);
}

export async function getPodcastEpisodeBySlug(slug: string) {
  return sanityClient.fetch(podcastEpisodeBySlugQuery, { slug });
}

export async function getVideos() {
  return sanityClient.fetch(videosQuery);
}

export async function getVideoBySlug(slug: string) {
  return sanityClient.fetch(videoBySlugQuery, { slug });
}

export async function getBooks() {
  return sanityClient.fetch(booksQuery);
}

export async function getBookBySlug(slug: string) {
  return sanityClient.fetch(bookBySlugQuery, { slug });
}

export async function getSiteSettings() {
  return sanityClient.fetch(siteSettingsQuery);
}
