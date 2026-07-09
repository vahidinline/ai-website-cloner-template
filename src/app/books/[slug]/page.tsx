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
  allBookSlugsQuery,
  getBookBySlug,
  sanityClient,
} from '@/sanity/queries';
import type { SanityImage, SanitySeo } from '@/sanity/types';

type Book = {
  title?: string;
  slug?: { current?: string };
  coverImage?: SanityImage;
  description?: unknown[];
  buyLinks?: BuyLink[];
  seo?: SanitySeo;
};

type BookPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  if (!hasValidSanityConfig) {
    return [];
  }

  const books = await sanityClient.fetch<{ slug: string }[]>(allBookSlugsQuery);
  return books.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({
  params,
}: BookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = hasValidSanityConfig
    ? ((await getBookBySlug(slug)) as Book | null)
    : null;

  return {
    title: book?.seo?.metaTitle || book?.title,
    description: book?.seo?.metaDescription,
    robots: book?.seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: book?.coverImage?.url
      ? { images: [{ url: book.coverImage.url, alt: book.coverImage.alt }] }
      : undefined,
  };
}

export default async function BookPage({ params }: BookPageProps) {
  const { slug } = await params;
  const book = hasValidSanityConfig
    ? ((await getBookBySlug(slug)) as Book | null)
    : null;

  if (!book) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fbf9f9]">
      <Header />
      <main className="flex-1 px-[18px] pb-20 pt-[170px]">
        <article className="mx-auto max-w-[1200px]">
          <ContentHero
            eyebrow="Book"
            title={book.title}
            image={book.coverImage}
          />
          <ExternalLinks links={book.buyLinks} />
          <DetailBody value={book.description} />
        </article>
      </main>
      <Footer />
    </div>
  );
}
