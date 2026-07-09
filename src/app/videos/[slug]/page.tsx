import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContentHero } from '@/components/ContentPages';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { hasValidSanityConfig } from '@/sanity/env';
import {
  allVideoSlugsQuery,
  getVideoBySlug,
  sanityClient,
} from '@/sanity/queries';
import type { SanityImage, SanitySeo } from '@/sanity/types';

export const dynamicParams = false;

type Video = {
  title?: string;
  slug?: { current?: string };
  thumbnail?: SanityImage;
  youtubeUrl?: string;
  description?: string;
  publishedAt?: string;
  seo?: SanitySeo;
};

type VideoPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  if (!hasValidSanityConfig) {
    return [];
  }

  const videos =
    await sanityClient.fetch<{ slug: string }[]>(allVideoSlugsQuery);
  return videos.map((video) => ({ slug: video.slug }));
}

export async function generateMetadata({
  params,
}: VideoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const video = hasValidSanityConfig
    ? ((await getVideoBySlug(slug)) as Video | null)
    : null;

  return {
    title: video?.seo?.metaTitle || video?.title,
    description: video?.seo?.metaDescription || video?.description,
    robots: video?.seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: video?.thumbnail?.url
      ? { images: [{ url: video.thumbnail.url, alt: video.thumbnail.alt }] }
      : undefined,
  };
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { slug } = await params;
  const video = hasValidSanityConfig
    ? ((await getVideoBySlug(slug)) as Video | null)
    : null;

  if (!video) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fbf9f9]">
      <Header />
      <main className="flex-1 px-[18px] pb-20 pt-[170px]">
        <article className="mx-auto max-w-[1200px]">
          <ContentHero
            eyebrow="Video"
            title={video.title}
            description={video.description}
            publishedAt={video.publishedAt}
            image={video.thumbnail}
          />
          {video.youtubeUrl ? (
            <div className="mt-12 overflow-hidden rounded-[34px] bg-[#001523] p-6 text-white">
              <p className="text-lg font-bold">Watch this video</p>
              <a
                href={video.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block break-all text-[#f8c43b] underline underline-offset-4">
                {video.youtubeUrl}
              </a>
            </div>
          ) : null}
        </article>
      </main>
      <Footer />
    </div>
  );
}
