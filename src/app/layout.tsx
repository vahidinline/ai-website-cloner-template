import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import { getSiteSettings } from '@/sanity/queries';
import { hasValidSanityConfig } from '@/sanity/env';
import type { SanitySiteSettings } from '@/sanity/types';
import { buildSiteJsonLd, serializeJsonLd } from '@/lib/structured-data';

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
    title: seo?.metaTitle || settings?.siteTitle,
    description: seo?.metaDescription,
    alternates: seo?.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined,
    robots: seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: seo?.metaTitle || settings?.siteTitle,
      description: seo?.metaDescription,
      images: seo?.ogImage?.url
        ? [
            {
              url: seo.ogImage.url,
              width: seo.ogImage.width,
              height: seo.ogImage.height,
              alt: seo.ogImage.alt,
            },
          ]
        : undefined,
    },
    icons: settings?.favicon?.url ? { icon: [{ url: settings.favicon.url }], apple: settings.appleTouchIcon?.url } : undefined,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = hasValidSanityConfig ? await getSiteSettings() as SanitySiteSettings | null : null;
  const jsonLd = buildSiteJsonLd(settings?.structuredData);
  return (
    <html lang={settings?.defaultLanguage || 'en'} dir={settings?.direction || 'ltr'} className={`${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        {jsonLd ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
          />
        ) : null}
        {children}
      </body>
    </html>
  );
}
