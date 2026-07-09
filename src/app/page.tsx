import type { Metadata } from 'next';
import { groq } from 'next-sanity';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SectionRenderer } from '@/components/SectionRenderer';
import { hasValidSanityConfig } from '@/sanity/env';
import { imageFields, sanityClient } from '@/sanity/queries';
import type { SanityPage } from '@/sanity/types';

const homePageQuery = groq`*[_type == "page" && slug.current == "home"][0]{
  title,
  seo{
    metaTitle,
    metaDescription,
    canonicalUrl,
    noIndex,
    ogImage ${imageFields}
  },
  sections[]{
    ...,
    settings{
      ...,
      backgroundImage ${imageFields}
    },
    image ${imageFields},
    backgroundImage ${imageFields},
    foregroundImage ${imageFields},
    images[] ${imageFields},
    logos[]{..., image ${imageFields}},
    cards[]{..., image ${imageFields}},
    books[]->{..., coverImage ${imageFields}},
    posts[]->{..., mainImage ${imageFields}, categories[]->{title, slug}},
    episodes[]->{..., coverImage ${imageFields}, guests[]->{name, slug, portrait ${imageFields}}},
    videos[]->{..., thumbnail ${imageFields}}
  }
}`;

async function getHomePageData() {
  if (!hasValidSanityConfig) return null;

  return (await sanityClient.fetch(homePageQuery)) as SanityPage | null;
}

function MissingSectionFallback({
  sectionType,
  index,
}: {
  sectionType?: string;
  index: number;
}) {
  return (
    <div className="p-10 border-2 border-red-500 text-red-500">
      Missing or broken component for:{' '}
      {sectionType || `section at index ${index}`}
    </div>
  );
}

function renderHomeSection(
  section: NonNullable<SanityPage['sections']>[number],
  index: number,
) {
  if (!section?._type || section.settings?.isHidden) return null;

  const key = section._key || `${section._type}-${index}`;

  switch (section._type) {
    case 'heroSection':
    case 'richTextSection':
    case 'newsletterSection':
    case 'featuredInterviewsSection':
    case 'recentEpisodesSection':
    case 'recentPostsSection':
    case 'videoGridSection':
    case 'aboutSection':
    case 'logoCloudSection':
    case 'booksSection':
    case 'ctaSection':
    case 'cardsSection':
    case 'faqSection':
    case 'embedSection':
    case 'gallerySection':
      return <SectionRenderer key={key} sections={[section]} />;
    default:
      return (
        <div key={index} className="p-10 border-2 border-red-500 text-red-500">
          Missing or broken component for: {section._type}
        </div>
      );
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const homePage = await getHomePageData();
  const seo = homePage?.seo;

  return {
    title: seo?.metaTitle || homePage?.title,
    description: seo?.metaDescription,
    alternates: seo?.canonicalUrl
      ? {
          canonical: seo.canonicalUrl,
        }
      : undefined,
    robots: seo?.noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
    openGraph: {
      title: seo?.metaTitle || homePage?.title,
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
  };
}

export default async function Home() {
  const homePage = await getHomePageData();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {homePage?.sections?.map(renderHomeSection) || (
          <MissingSectionFallback index={0} sectionType="home page sections" />
        )}
      </main>
      <Footer />
    </div>
  );
}
