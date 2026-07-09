import { notFound } from 'next/navigation';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { SectionRenderer } from '@/components/SectionRenderer';
import {
  getPageBySlug,
  sanityClient,
  allPagesSlugsQuery,
} from '@/sanity/queries';
import type { SanityPage } from '@/sanity/types';
import { hasValidSanityConfig } from '@/sanity/env';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  if (!hasValidSanityConfig) {
    return [];
  }

  const pages =
    await sanityClient.fetch<{ slug: string }[]>(allPagesSlugsQuery);
  return pages
    .filter((pageItem: { slug: string }) => pageItem.slug !== 'home')
    .map((pageItem: { slug: string }) => ({ slug: pageItem.slug }));
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const page = (await getPageBySlug(slug)) as SanityPage | null;

  if (!page) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-[96px]">
        <SectionRenderer sections={page.sections} />
      </main>
      <Footer />
    </div>
  );
}
