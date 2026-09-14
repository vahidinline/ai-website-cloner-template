import {
  ContentArchivePage,
  type ContentCardItem,
} from '@/components/ContentPages';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { hasValidSanityConfig } from '@/sanity/env';
import { getArchivePageSettings, getBooks, getSiteSettings } from '@/sanity/queries';
import type { SanityArchivePageSettings, SanityImage, SanitySiteSettings } from '@/sanity/types';
import { buildAlternates } from '@/lib/seo';

export const dynamic = 'force-dynamic';

type BookListItem = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  coverImage?: SanityImage;
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = hasValidSanityConfig ? await getSiteSettings() as SanitySiteSettings | null : null;
  return { alternates: buildAlternates(undefined, settings?.siteUrl, '/books') };
}

export default async function BooksIndexPage() {
  const [books, settings] = hasValidSanityConfig ? await Promise.all([getBooks() as Promise<BookListItem[]>, getArchivePageSettings('books') as Promise<SanityArchivePageSettings | null>]) : [[], null];

  const items: ContentCardItem[] = books.map((book) => ({
    _id: book._id,
    title: book.title,
    slug: book.slug,
    image: book.coverImage,
  }));

  return (
    <div className="flex min-h-screen flex-col bg-[#fbf9f9]">
      <Header />
      <ContentArchivePage
        eyebrow={settings?.eyebrow || ''}
        title={settings?.title || ''}
        introduction={settings?.introduction}
        items={items}
        basePath="/books"
        emptyMessage={settings?.emptyState || ''}
      />
      <Footer />
    </div>
  );
}
import type { Metadata } from 'next';
