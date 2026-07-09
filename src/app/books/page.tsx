import {
  ContentArchivePage,
  type ContentCardItem,
} from '@/components/ContentPages';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { hasValidSanityConfig } from '@/sanity/env';
import { getBooks } from '@/sanity/queries';
import type { SanityImage } from '@/sanity/types';

type BookListItem = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  coverImage?: SanityImage;
};

export default async function BooksIndexPage() {
  const books = hasValidSanityConfig
    ? ((await getBooks()) as BookListItem[])
    : [];

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
        eyebrow="Books"
        title="Books"
        items={items}
        basePath="/books"
        emptyMessage="No books have been published yet."
      />
      <Footer />
    </div>
  );
}
