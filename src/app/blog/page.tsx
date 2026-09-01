import { ContentArchivePage, type ContentCardItem } from '@/components/ContentPages';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { hasValidSanityConfig } from '@/sanity/env';
import { getArchivePageSettings, getPosts, getSiteSettings } from '@/sanity/queries';
import type { SanityArchivePageSettings, SanityImage, SanitySiteSettings } from '@/sanity/types';
import { buildAlternates } from '@/lib/seo';

type Post = { _id: string; title?: string; slug?: { current?: string }; excerpt?: string; publishedAt?: string; mainImage?: SanityImage };
export async function generateMetadata(): Promise<Metadata> {
  const settings = hasValidSanityConfig ? await getSiteSettings() as SanitySiteSettings | null : null;
  return { alternates: buildAlternates(undefined, settings?.siteUrl, '/blog') };
}
export default async function BlogIndexPage() {
  const [posts, settings] = hasValidSanityConfig ? await Promise.all([getPosts() as Promise<Post[]>, getArchivePageSettings('blog') as Promise<SanityArchivePageSettings | null>]) : [[], null];
  const items: ContentCardItem[] = posts.map((post) => ({ ...post, image: post.mainImage }));
  return <div className="flex min-h-screen flex-col bg-[#fbf9f9]"><Header /><ContentArchivePage eyebrow={settings?.eyebrow || ''} title={settings?.title || ''} introduction={settings?.introduction} items={items} basePath="/blog" emptyMessage={settings?.emptyState || ''} /><Footer /></div>;
}
import type { Metadata } from 'next';
