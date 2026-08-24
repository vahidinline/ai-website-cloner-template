import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { SectionRenderer } from '@/components/SectionRenderer';
import { hasValidSanityConfig } from '@/sanity/env';
import { getHomePage, getSiteSettings } from '@/sanity/queries';
import type { SanityPage, SanitySiteSettings } from '@/sanity/types';

async function getData() {
  if (!hasValidSanityConfig) return { page: null, settings: null };
  const [page, settings] = await Promise.all([getHomePage(), getSiteSettings()]);
  return { page: page as SanityPage | null, settings: settings as SanitySiteSettings | null };
}

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getData();
  const seo = page?.seo;
  return { title: seo?.metaTitle || page?.title, description: seo?.metaDescription, alternates: seo?.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined, robots: seo?.noIndex ? { index: false, follow: false } : undefined };
}

export default async function HomePage() {
  const { page, settings } = await getData();
  return <div className="flex min-h-screen flex-col bg-[#fbf9f9]"><Header /><main className="flex-1">{page?.sections?.length ? <SectionRenderer sections={page.sections} /> : null}</main>{settings?.structuredData ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(settings.structuredData) }} /> : null}<Footer /></div>;
}
