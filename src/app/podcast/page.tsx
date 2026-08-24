import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import {
  ContentArchivePage,
  type ContentCardItem,
} from '@/components/ContentPages';
import { hasValidSanityConfig } from '@/sanity/env';
import { getArchivePageSettings, getPodcastEpisodes } from '@/sanity/queries';
import type { SanityArchivePageSettings, SanityImage } from '@/sanity/types';

type PodcastEpisodeListItem = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  episodeNumber?: number;
  publishedAt?: string;
  coverImage?: SanityImage;
  summary?: string;
};

export default async function PodcastIndexPage() {
  const [episodes, settings] = hasValidSanityConfig ? await Promise.all([getPodcastEpisodes() as Promise<PodcastEpisodeListItem[]>, getArchivePageSettings('podcast') as Promise<SanityArchivePageSettings | null>]) : [[], null];

  const items: ContentCardItem[] = episodes.map((episode) => ({
    _id: episode._id,
    title: episode.title,
    slug: episode.slug,
    summary: episode.summary,
    publishedAt: episode.publishedAt,
    image: episode.coverImage,
    eyebrow: episode.episodeNumber
      ? `Episode ${episode.episodeNumber}`
      : undefined,
  }));

  return (
    <div className="flex min-h-screen flex-col bg-[#fbf9f9]">
      <Header />
      <ContentArchivePage
        eyebrow={settings?.eyebrow || ''}
        title={settings?.title || ''}
        introduction={settings?.introduction}
        items={items}
        basePath="/podcast"
        emptyMessage={settings?.emptyState || ''}
      />
      <Footer />
    </div>
  );
}
