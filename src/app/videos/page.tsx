import {
  ContentArchivePage,
  type ContentCardItem,
} from '@/components/ContentPages';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { hasValidSanityConfig } from '@/sanity/env';
import { getVideos } from '@/sanity/queries';
import type { SanityImage } from '@/sanity/types';

type VideoListItem = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  thumbnail?: SanityImage;
  description?: string;
  publishedAt?: string;
};

export default async function VideosIndexPage() {
  const videos = hasValidSanityConfig
    ? ((await getVideos()) as VideoListItem[])
    : [];

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
        eyebrow="Videos"
        title="Latest videos"
        items={items}
        basePath="/videos"
        emptyMessage="No videos have been published yet."
      />
      <Footer />
    </div>
  );
}
