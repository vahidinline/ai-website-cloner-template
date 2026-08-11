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

const profileSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": "https://souzangar.com/#profile",
  "url": "https://souzangar.com/",
  "name": "Saeed Souzangar | سعید سوزنگر",
  "inLanguage": ["fa-IR", "en"],
  "mainEntity": {
    "@type": "Person",
    "@id": "https://souzangar.com/#person",
    "name": "Saeed Souzangar",
    "alternateName": [
      "سعید سوزنگر",
      "Saeed Soozangar",
      "@souzangar"
    ],
    "url": "https://souzangar.com/",
    "mainEntityOfPage": {
      "@id": "https://souzangar.com/#profile"
    },
    "image": {
      "@type": "ImageObject",
      "url": "https://media.licdn.com/dms/image/v2/D4E03AQHg26Uj987T0A/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1720349394965?e=2147483647&v=beta&t=uh1OmFeE2kEhuoQ9QvQbPMvLBEMP7CDhLkVXD6mTweQ",
      "caption": "Saeed Souzangar"
    },
    "jobTitle": [
      "Entrepreneur",
      "Cybersecurity Specialist",
      "Network and Security Instructor",
      "Digital Rights Advocate"
    ],
    "description": "Saeed Souzangar is an Iranian cybersecurity educator, network and security instructor, technology entrepreneur, podcaster, and digital rights advocate. He has worked in technology education and cybersecurity since 2005.",
    "knowsAbout": [
      "Entrepreneur",
      "Cybersecurity",
      "Network Security",
      "Internet Infrastructure",
      "Digital Privacy",
      "Digital Rights",
      "Child Online Safety",
      "Podcaster",
      "Youtuber"
    ],
    "sameAs": [
      "https://www.instagram.com/souzangar/",
      "https://x.com/souzangar",
      "https://www.linkedin.com/in/souzangar/",
      "https://www.youtube.com/@souzangar",
      "https://t.me/souzangar"
    ]
  }
};

async function getHomePageData() {
  if (!hasValidSanityConfig) return null;

  const homePage = (await sanityClient.fetch(
    homePageQuery,
  )) as SanityPage | null;

  console.log('[homepage-debug] raw Sanity homePage fetch result:');
  console.dir(homePage, { depth: null });
  console.log(
    '[homepage-debug] fetched sections summary:',
    homePage?.sections?.map((section, index) => ({
      index,
      _key: section?._key,
      _type: section?._type,
      hasRichText: Boolean(section?.richText),
      richTextLength: section?.richText?.length,
      hasContent: Boolean(section?.content),
      contentLength: section?.content?.length,
    })),
  );

  return homePage;
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
  console.log('[homepage-debug] renderHomeSection input:', {
    index,
    _key: section?._key,
    _type: section?._type,
    isHidden: section?.settings?.isHidden,
    richText: section?.richText,
    content: section?.content,
  });

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
  const sections = homePage?.sections;

  console.log('[homepage-debug] sections array immediately before map:');
  console.dir(sections, { depth: null });

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }}
      />
      <Header />
      <main className="flex-1">
        {sections?.map(renderHomeSection) || (
          <MissingSectionFallback index={0} sectionType="home page sections" />
        )}
      </main>
      <Footer />
    </div>
  );
}
