import {
  AboutTimSection,
  BlogPostsSection,
  BooksSection,
  FeaturedInterviewsSection,
  PodcastIntroSection,
  PressSection,
  RecentEpisodesSection,
  VideosSection,
} from '@/components/HomepageSections';
import type { SanitySection } from '@/sanity/types';
import { PortableTextRenderer } from './portable-text/PortableTextRenderer';
import { Button } from './ui/button';

type SectionRendererProps = {
  sections?: SanitySection[];
  fallbackToStaticCloneSections?: boolean;
};

type ImageValue = {
  url?: string;
  alt?: string;
  caption?: string;
};

type LinkValue = {
  label?: string;
  url?: string;
};

type CardValue = {
  _key?: string;
  title?: string;
  description?: string;
  image?: ImageValue;
  link?: LinkValue;
};

type ReferencedItem = {
  _id?: string;
  _key?: string;
  title?: string;
  name?: string;
  excerpt?: string;
  summary?: string;
  description?: string;
  slug?: { current?: string };
  mainImage?: ImageValue;
  coverImage?: ImageValue;
  thumbnail?: ImageValue;
  portrait?: ImageValue;
};

type DynamicSection = SanitySection & {
  variant?: string;
  height?: string;
  image?: ImageValue;
  backgroundImage?: ImageValue;
  foregroundImage?: ImageValue;
  primaryButton?: LinkValue;
  secondaryButton?: LinkValue;
  cta?: LinkValue;
  buttons?: LinkValue[];
  cards?: CardValue[];
  logos?: Array<{
    _key?: string;
    name?: string;
    image?: ImageValue;
    url?: string;
  }>;
  images?: ImageValue[];
  books?: ReferencedItem[];
  posts?: ReferencedItem[];
  episodes?: ReferencedItem[];
  videos?: ReferencedItem[];
  items?: Array<{ _key?: string; question?: string; answer?: unknown[] }>;
};

function asArray<T>(value: T[] | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

function MissingSectionFallback({
  sectionType,
  index = 0,
}: {
  sectionType?: string;
  index?: number;
}) {
  return (
    <div className="p-10 border-2 border-red-500 text-red-500">
      Missing or broken component for:{' '}
      {sectionType || `section at index ${index}`}
    </div>
  );
}

function getImage(item: unknown): ImageValue | undefined {
  if (!item || typeof item !== 'object') return undefined;

  const itemRecord = item as Record<string, unknown>;
  return (
    (itemRecord.image as ImageValue | undefined) ||
    (itemRecord.mainImage as ImageValue | undefined) ||
    (itemRecord.coverImage as ImageValue | undefined) ||
    (itemRecord.thumbnail as ImageValue | undefined) ||
    (itemRecord.portrait as ImageValue | undefined)
  );
}

function getStringValue(item: unknown, keys: string[]): string | undefined {
  if (!item || typeof item !== 'object') return undefined;

  const itemRecord = item as Record<string, unknown>;
  for (const key of keys) {
    const value = itemRecord[key];
    if (typeof value === 'string') return value;
  }
  return undefined;
}

function SectionShell({
  section,
  children,
  dark = false,
  spacingClassName = 'px-[18px] py-16 md:py-[115px]',
}: {
  section: DynamicSection;
  children: React.ReactNode;
  dark?: boolean;
  spacingClassName?: string;
}) {
  const backgroundImage = section.settings?.backgroundImage as
    | ImageValue
    | undefined;
  const customBackground =
    typeof section.settings?.backgroundColor === 'string'
      ? section.settings.backgroundColor
      : undefined;

  return (
    <section
      id={
        typeof section.settings?.sectionId === 'string'
          ? section.settings.sectionId
          : undefined
      }
      className={`relative overflow-hidden ${spacingClassName} ${
        dark ? 'bg-[#001523] text-white' : 'bg-[#fbf9f9] text-[#001523]'
      }`}
      style={{ backgroundColor: customBackground }}>
      {backgroundImage?.url ? (
        <>
          <img
            src={backgroundImage.url}
            alt={backgroundImage.alt || ''}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
        </>
      ) : null}
      <div className="relative z-10 mx-auto max-w-[1200px]">{children}</div>
    </section>
  );
}

function SectionTitle({
  section,
  dark = false,
  className = 'mb-10 md:mb-14',
}: {
  section: DynamicSection;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      {section.eyebrow ? (
        <p
          className={`text-[15px] font-bold uppercase tracking-[0.18em] ${dark ? 'text-[#87ceff]' : 'text-[#2c80b8]'}`}>
          {section.eyebrow}
        </p>
      ) : null}
      {section.title ? (
        <h2 className="mt-3 max-w-[900px] text-[42px] font-bold leading-[1.02] tracking-[-1.6px] md:text-[72px]">
          {section.title}
        </h2>
      ) : null}
      {section.subtitle ? (
        <p
          className={`mt-5 max-w-[760px] text-xl leading-8 ${dark ? 'text-white/75' : 'text-[#44515a]'}`}>
          {section.subtitle}
        </p>
      ) : null}
    </div>
  );
}

function ButtonLink({ button }: { button?: LinkValue }) {
  if (!button?.label) return null;
  return (
    <a href={button.url || '#'}>
      <Button className="rounded-full bg-[#f8c43b] px-6 py-5 font-bold text-[#001523] hover:bg-[#e0b135]">
        {button.label}
      </Button>
    </a>
  );
}

function DynamicHeroSection({ section }: { section: DynamicSection }) {
  const image = section.foregroundImage || section.image;
  const heroMinHeight =
    typeof section.height === 'string' && section.height.trim().length > 0
      ? section.height.trim()
      : undefined;

  console.log('[homepage-debug] DynamicHeroSection props:', {
    _key: section._key,
    _type: section._type,
    title: section.title,
    richText: section.richText,
    content: section.content,
  });

  return (
    <SectionShell
      section={section}
      spacingClassName="px-[18px] py-8 md:py-10"
      dark={
        section.variant === 'backgroundImage' ||
        section.settings?.theme === 'dark'
      }>
      <div
        className="grid min-h-[300px] gap-7 md:min-h-[300px] md:grid-cols-2 md:items-center"
        style={heroMinHeight ? { minHeight: heroMinHeight } : undefined}>
        <div>
          <SectionTitle
            section={section}
            className="mb-6 md:mb-8"
            dark={
              section.variant === 'backgroundImage' ||
              section.settings?.theme === 'dark'
            }
          />
          <PortableTextRenderer value={section.richText || section.content} />
          <div className="mt-5 flex flex-wrap gap-3">
            <ButtonLink button={section.primaryButton} />
            <ButtonLink button={section.secondaryButton} />
          </div>
        </div>
        {image?.url ? (
          <img
            src={image.url}
            alt={image.alt || ''}
            className="mx-auto max-h-[6000px] w-full rounded-[34px] object-cover"
          />
        ) : null}
      </div>
    </SectionShell>
  );
}

function GenericRichTextSection({ section }: { section: SanitySection }) {
  const dynamicSection = section as DynamicSection;
  const image = dynamicSection.image;
  const portableTextValue = section.richText || section.content;

  console.log('[homepage-debug] GenericRichTextSection props:', {
    _key: section._key,
    _type: section._type,
    title: section.title,
    richText: section.richText,
    content: section.content,
    portableTextValue,
    nullPortableTextItems: Array.isArray(portableTextValue)
      ? portableTextValue
          .map((item, index) => ({ index, item }))
          .filter(({ item }) => item == null)
      : undefined,
  });

  return (
    <section className="bg-[#fbf9f9] px-[18px] py-16 md:py-[115px]">
      <div className="mx-auto grid max-w-[1200px] gap-10 text-[#001523] md:grid-cols-[1fr_0.85fr] md:items-start">
        <div className="max-w-[900px]">
          {section.eyebrow ? (
            <p className="text-[15px] font-bold uppercase tracking-[0.18em] text-[#2c80b8]">
              {section.eyebrow}
            </p>
          ) : null}
          {section.title ? (
            <h2 className="mt-3 text-[42px] font-bold leading-[1.02] tracking-[-1.6px] md:text-[72px]">
              {section.title}
            </h2>
          ) : null}
          {section.subtitle ? (
            <p className="mt-5 text-xl leading-8 text-[#44515a]">
              {section.subtitle}
            </p>
          ) : null}
          <div className="mt-8">
            <PortableTextRenderer value={section.richText || section.content} />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink
              button={dynamicSection.cta || dynamicSection.primaryButton}
            />
            {asArray(dynamicSection.buttons).map((button, index) => (
              <ButtonLink key={`${button.label}-${index}`} button={button} />
            ))}
          </div>
        </div>
        {image?.url ? (
          <img
            src={image.url}
            alt={image.alt || ''}
            className="w-full rounded-[34px] object-cover"
          />
        ) : null}
      </div>
    </section>
  );
}

function DynamicCardsSection({
  section,
  dark = false,
}: {
  section: DynamicSection;
  dark?: boolean;
}) {
  console.log('[homepage-debug] DynamicCardsSection props:', {
    _key: section._key,
    _type: section._type,
    title: section.title,
    cards: section.cards,
    posts: section.posts,
    episodes: section.episodes,
    videos: section.videos,
    books: section.books,
  });

  const items =
    asArray(section.cards).length > 0
      ? asArray(section.cards)
      : asArray(section.posts).length > 0
        ? asArray(section.posts)
        : asArray(section.episodes).length > 0
          ? asArray(section.episodes)
          : asArray(section.videos).length > 0
            ? asArray(section.videos)
            : asArray(section.books).length > 0
              ? asArray(section.books)
              : [];

  return (
    <SectionShell section={section} dark={dark}>
      <SectionTitle section={section} dark={dark} />
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item, index) => {
          const image = getImage(item);
          const title = getStringValue(item, ['title', 'name']);
          const description = getStringValue(item, [
            'description',
            'excerpt',
            'summary',
          ]);
          const itemRecord = item as Record<string, unknown>;
          return (
            <article
              key={
                typeof itemRecord._id === 'string'
                  ? itemRecord._id
                  : typeof itemRecord._key === 'string'
                    ? itemRecord._key
                    : `${title}-${index}`
              }
              className={`overflow-hidden rounded-[30px] ${dark ? 'bg-white/8 text-white' : 'bg-white text-[#001523]'} shadow-sm`}>
              {image?.url ? (
                <img
                  src={image.url}
                  alt={image.alt || title || ''}
                  className="aspect-[1.35/1] w-full object-cover"
                />
              ) : null}
              <div className="p-7">
                {title ? (
                  <h3 className="text-[28px] font-bold leading-tight tracking-[-0.7px]">
                    {title}
                  </h3>
                ) : null}
                {description ? (
                  <p
                    className={`mt-4 text-base leading-7 ${dark ? 'text-white/70' : 'text-[#66737b]'}`}>
                    {description}
                  </p>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
      <div className="mt-10">
        <ButtonLink button={section.cta} />
      </div>
    </SectionShell>
  );
}

function DynamicLogoCloudSection({ section }: { section: DynamicSection }) {
  console.log('[homepage-debug] DynamicLogoCloudSection props:', {
    _key: section._key,
    _type: section._type,
    title: section.title,
    logos: section.logos,
  });

  return (
    <SectionShell section={section} dark={section.settings?.theme === 'dark'}>
      <SectionTitle
        section={section}
        dark={section.settings?.theme === 'dark'}
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
        {asArray(section.logos).map((logo, index) => (
          <a
            key={logo._key || logo.name || index}
            href={logo.url || '#'}
            className="flex h-24 items-center justify-center rounded-[22px] bg-white p-5 shadow-sm">
            {logo.image?.url ? (
              <img
                src={logo.image.url}
                alt={logo.image.alt || logo.name || ''}
                className="max-h-12 max-w-full object-contain"
              />
            ) : (
              <span className="font-bold text-[#001523]">{logo.name}</span>
            )}
          </a>
        ))}
      </div>
    </SectionShell>
  );
}

export function SectionRenderer({
  sections,
  fallbackToStaticCloneSections = false,
}: SectionRendererProps) {
  console.log('[homepage-debug] SectionRenderer received props:', {
    fallbackToStaticCloneSections,
    sections,
  });

  if (!sections?.length) return null;

  return sections.map((section, index) => {
    console.log('[homepage-debug] SectionRenderer mapping section:', {
      index,
      _key: section?._key,
      _type: section?._type,
      section,
    });

    if (section.settings?.isHidden) return null;
    const dynamicSection = section as DynamicSection;
    const key = section._key || `${section._type}-${index}`;

    if (!fallbackToStaticCloneSections) {
      switch (section._type) {
        case 'heroSection':
          return <DynamicHeroSection key={key} section={dynamicSection} />;
        case 'featuredInterviewsSection':
        case 'recentEpisodesSection':
        case 'recentPostsSection':
        case 'videoGridSection':
        case 'booksSection':
        case 'cardsSection':
          return (
            <DynamicCardsSection
              key={key}
              section={dynamicSection}
              dark={section._type === 'videoGridSection'}
            />
          );
        case 'logoCloudSection':
          return <DynamicLogoCloudSection key={key} section={dynamicSection} />;
        case 'aboutSection':
        case 'newsletterSection':
        case 'ctaSection':
        case 'richTextSection':
        case 'faqSection':
        case 'embedSection':
        case 'gallerySection':
          return <GenericRichTextSection key={key} section={section} />;
        default:
          return (
            <MissingSectionFallback
              key={key}
              index={index}
              sectionType={section._type}
            />
          );
      }
    }

    switch (section._type) {
      case 'heroSection':
        return <GenericRichTextSection key={key} section={section} />;
      case 'richTextSection':
        return <GenericRichTextSection key={key} section={section} />;
      case 'newsletterSection':
        return <PodcastIntroSection key={key} />;
      case 'featuredInterviewsSection':
        return <FeaturedInterviewsSection key={key} />;
      case 'recentEpisodesSection':
        return <RecentEpisodesSection key={key} />;
      case 'recentPostsSection':
        return <BlogPostsSection key={key} />;
      case 'videoGridSection':
        return <VideosSection key={key} />;
      case 'aboutSection':
        return <AboutTimSection key={key} />;
      case 'logoCloudSection':
        return <PressSection key={key} />;
      case 'booksSection':
        return <BooksSection key={key} />;
      case 'ctaSection':
      case 'cardsSection':
      case 'faqSection':
      case 'embedSection':
      case 'gallerySection':
        return <GenericRichTextSection key={key} section={section} />;
      default:
        return (
          <MissingSectionFallback
            key={key}
            index={index}
            sectionType={section._type}
          />
        );
    }
  });
}
