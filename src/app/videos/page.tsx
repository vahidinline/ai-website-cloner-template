import {
  ContentArchivePage,
  type ContentCardItem,
} from '@/components/ContentPages';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { hasValidSanityConfig } from '@/sanity/env';
import { getArchivePageSettings, getVideos } from '@/sanity/queries';
import type { SanityArchivePageSettings, SanityImage } from '@/sanity/types';

type VideoListItem = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  thumbnail?: SanityImage;
  description?: string;
  publishedAt?: string;
};

export default async function VideosIndexPage() {
  const [videos, settings] = hasValidSanityConfig ? await Promise.all([getVideos() as Promise<VideoListItem[]>, getArchivePageSettings('videos') as Promise<SanityArchivePageSettings | null>]) : [[], null];

  const items: ContentCardItem[] = videos.map((video) => ({
    _id: video._id,
    title: video.title,
    slug: video.slug,
    description: video.description,
    publishedAt: video.publishedAt,
    image: video.thumbnail,
  }));

  return (
    <div className="flex min-h-screen flex-col bg-[#fbf9f9]">
      <Header />
      <ContentArchivePage
        eyebrow={settings?.eyebrow || ''}
        title={settings?.title || ''}
        introduction={settings?.introduction}
        items={items}
        basePath="/videos"
        emptyMessage={settings?.emptyState || ''}
      />
      <Footer />
    </div>
  );
}
