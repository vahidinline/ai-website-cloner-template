import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import { getSiteSettings } from '@/sanity/queries';
import { hasValidSanityConfig } from '@/sanity/env';
import type { SanitySiteSettings } from '@/sanity/types';

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = hasValidSanityConfig
    ? ((await getSiteSettings()) as SanitySiteSettings | null)
    : null;
  const seo = settings?.defaultSeo;
  return {
    title: seo?.metaTitle || settings?.siteTitle || 'The Blog of Author Saeed Souzangar',
    description: seo?.metaDescription,
    alternates: seo?.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined,
    robots: seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: seo?.metaTitle || settings?.siteTitle,
      description: seo?.metaDescription,
      images: seo?.ogImage?.url ? [{ url: seo.ogImage.url, width: seo.ogImage.width, height: seo.ogImage.height, alt: seo.ogImage.alt }] : undefined,
    },
    icons: {
    icon: [
      { url: '/seo/favicon-0.png', sizes: '32x32' },
      { url: '/seo/favicon-1.png', sizes: '192x192' },
    ],
    apple: '/seo/favicon-2.png',
  },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
