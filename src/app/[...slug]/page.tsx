import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { SectionRenderer } from '@/components/SectionRenderer';
import { hasValidSanityConfig } from '@/sanity/env';
import { getPageBySlug } from '@/sanity/queries';
import type { SanityPage } from '@/sanity/types';

type Props = { params: Promise<{ slug: string[] }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = hasValidSanityConfig ? await getPageBySlug(slug.join('/')) as SanityPage | null : null;
  const seo = page?.seo;
  return { title: seo?.metaTitle || page?.title, description: seo?.metaDescription, alternates: seo?.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined, robots: seo?.noIndex ? { index: false, follow: false } : undefined };
}
export default async function SanityPageRoute({ params }: Props) {
  const { slug } = await params;
  const page = hasValidSanityConfig ? await getPageBySlug(slug.join('/')) as SanityPage | null : null;
  if (!page) notFound();
  return <div className="flex min-h-screen flex-col bg-[#fbf9f9]"><Header /><main className="flex-1"><SectionRenderer sections={page.sections} /></main><Footer /></div>;
}
