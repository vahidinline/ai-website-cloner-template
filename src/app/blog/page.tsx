import { ContentArchivePage, type ContentCardItem } from '@/components/ContentPages';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { hasValidSanityConfig } from '@/sanity/env';
import { getArchivePageSettings, getPosts } from '@/sanity/queries';
import type { SanityArchivePageSettings, SanityImage } from '@/sanity/types';

type Post = { _id: string; title?: string; slug?: { current?: string }; excerpt?: string; publishedAt?: string; mainImage?: SanityImage };
export default async function BlogIndexPage() {
  const [posts, settings] = hasValidSanityConfig ? await Promise.all([getPosts() as Promise<Post[]>, getArchivePageSettings('blog') as Promise<SanityArchivePageSettings | null>]) : [[], null];
  const items: ContentCardItem[] = posts.map((post) => ({ ...post, image: post.mainImage }));
  return <div className="flex min-h-screen flex-col bg-[#fbf9f9]"><Header /><ContentArchivePage eyebrow={settings?.eyebrow || ''} title={settings?.title || ''} introduction={settings?.introduction} items={items} basePath="/blog" emptyMessage={settings?.emptyState || ''} /><Footer /></div>;
}
