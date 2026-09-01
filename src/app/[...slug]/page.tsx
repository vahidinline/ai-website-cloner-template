import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { SectionRenderer } from '@/components/SectionRenderer';
import { hasValidSanityConfig } from '@/sanity/env';
import { getPageBySlug, getSiteSettings } from '@/sanity/queries';
import type { SanityPage, SanitySiteSettings } from '@/sanity/types';
import { buildAlternates } from '@/lib/seo';
import { buildSiteJsonLd, serializeJsonLd } from '@/lib/structured-data';

type Props = { params: Promise<{ slug: string[] }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = hasValidSanityConfig ? await getPageBySlug(slug.join('/')) as SanityPage | null : null;
  const seo = page?.seo;
  const settings = hasValidSanityConfig ? await getSiteSettings() as SanitySiteSettings | null : null;
  return { title: seo?.metaTitle || page?.title, description: seo?.metaDescription, alternates: buildAlternates(seo, settings?.siteUrl, `/${slug.join('/')}`), robots: seo?.noIndex ? { index: false, follow: false } : undefined };
}
export default async function SanityPageRoute({ params }: Props) {
  const { slug } = await params;
  const page = hasValidSanityConfig ? await getPageBySlug(slug.join('/')) as SanityPage | null : null;
  if (!page) notFound();
  const settings = hasValidSanityConfig ? await getSiteSettings() as SanitySiteSettings | null : null;
  const jsonLd = buildSiteJsonLd(settings?.structuredData, page.seo);
  return <div className="flex min-h-screen flex-col bg-[#fbf9f9]">{jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} /> : null}<Header /><main className="flex-1"><SectionRenderer sections={page.sections} /></main><Footer /></div>;
}
