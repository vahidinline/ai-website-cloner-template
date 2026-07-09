import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  ContentHero,
  DetailBody,
  ExternalLinks,
  type BuyLink,
} from '@/components/ContentPages';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { hasValidSanityConfig } from '@/sanity/env';
import {
  allPodcastEpisodeSlugsQuery,
  getPodcastEpisodeBySlug,
  sanityClient,
} from '@/sanity/queries';
import type { SanityImage, SanitySeo } from '@/sanity/types';

type PodcastEpisode = {
  title?: string;
  slug?: { current?: string };
  episodeNumber?: number;
  publishedAt?: string;
  coverImage?: SanityImage;
  summary?: string;
  body?: unknown[];
  transcript?: unknown[];
  audioUrl?: string;
  externalLinks?: BuyLink[];
  seo?: SanitySeo;
};

type PodcastEpisodePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  if (!hasValidSanityConfig) {
    return [];
  }

  const episodes = await sanityClient.fetch<{ slug: string }[]>(
    allPodcastEpisodeSlugsQuery,
  );
  return episodes.map((episode) => ({ slug: episode.slug }));
}

export async function generateMetadata({
  params,
}: PodcastEpisodePageProps): Promise<Metadata> {
  const { slug } = await params;
  const episode = hasValidSanityConfig
    ? ((await getPodcastEpisodeBySlug(slug)) as PodcastEpisode | null)
    : null;

  return {
    title: episode?.seo?.metaTitle || episode?.title,
    description: episode?.seo?.metaDescription || episode?.summary,
    robots: episode?.seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: episode?.coverImage?.url
      ? {
          images: [
            { url: episode.coverImage.url, alt: episode.coverImage.alt },
          ],
        }
      : undefined,
  };
}

export default async function PodcastEpisodePage({
  params,
}: PodcastEpisodePageProps) {
  const { slug } = await params;
  const episode = hasValidSanityConfig
    ? ((await getPodcastEpisodeBySlug(slug)) as PodcastEpisode | null)
    : null;

  if (!episode) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fbf9f9]">
      <Header />
      <main className="flex-1 px-[18px] pb-20 pt-[170px]">
        <article className="mx-auto max-w-[1200px]">
          <ContentHero
            eyebrow={
              episode.episodeNumber
                ? `Podcast episode ${episode.episodeNumber}`
                : 'Podcast episode'
            }
            title={episode.title}
            description={episode.summary}
            publishedAt={episode.publishedAt}
            image={episode.coverImage}
          />
          {episode.audioUrl ? (
            <audio
              className="mt-10 w-full max-w-[860px]"
              controls
              src={episode.audioUrl}>
              <a href={episode.audioUrl}>Listen to this episode</a>
            </audio>
          ) : null}
          <ExternalLinks links={episode.externalLinks} />
          <DetailBody value={episode.body} />
          {episode.transcript?.length ? (
            <section className="mt-14 max-w-[860px] border-t border-[#001523]/10 pt-10">
              <h2 className="mb-6 text-[38px] font-bold tracking-[-1px] text-[#001523]">
                Transcript
              </h2>
              <DetailBody value={episode.transcript} />
            </section>
          ) : null}
        </article>
      </main>
      <Footer />
    </div>
  );
}
