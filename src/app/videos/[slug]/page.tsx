import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContentHero } from '@/components/ContentPages';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { hasValidSanityConfig } from '@/sanity/env';
import {
  allVideoSlugsQuery,
  getVideoBySlug,
  getSiteSettings,
  sanityClient,
} from '@/sanity/queries';
import type { SanityImage, SanitySeo } from '@/sanity/types';
import { embedYouTubeUrl } from '@/sanity/urls';
import { buildAlternates } from '@/lib/seo';
import type { SanitySiteSettings } from '@/sanity/types';

export const dynamic = 'force-dynamic';

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
  const [video, settings] = hasValidSanityConfig
    ? await Promise.all([getVideoBySlug(slug) as Promise<Video | null>, getSiteSettings() as Promise<SanitySiteSettings | null>])
    : [null, null];

  return {
    title: video?.seo?.metaTitle || video?.title,
    description: video?.seo?.metaDescription || video?.description,
    alternates: buildAlternates(video?.seo, settings?.siteUrl, `/videos/${slug}`),
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
            title={video.title}
            description={video.description}
            publishedAt={video.publishedAt}
            image={video.thumbnail}
          />
          {video.youtubeUrl && embedYouTubeUrl(video.youtubeUrl) ? (
            <div className="aspect-video mt-12 w-full overflow-hidden rounded-[34px]">
              <iframe
                src={embedYouTubeUrl(video.youtubeUrl)!}
                title={video.title || 'Embedded video'}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : null}
        </article>
      </main>
      <Footer />
    </div>
  );
}
