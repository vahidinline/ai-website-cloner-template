import Link from 'next/link';
import { PortableTextRenderer } from './portable-text/PortableTextRenderer';
import { SanityImage as SanityImageComponent } from './SanityImage';
import { Button } from './ui/button';
import { resolveButtonUrl } from '@/sanity/urls';
import type {
  SanityButton,
  SanityImage as SanityImageType,
  SanitySection,
  SanitySectionSettings,
} from '@/sanity/types';

type SectionRendererProps = {
  sections?: SanitySection[];
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
      Missing or broken component for: {sectionType || `section at index ${index}`}
    </div>
  );
}

/** Renders a Sanity button; returns null when the editor provided no usable target. */
function ButtonLink({ button, className }: { button?: SanityButton; className?: string }) {
  const href = resolveButtonUrl(button);
  if (!button?.label || !href) return null;
  if (href.startsWith('http')) {
    return (
      <a href={href} target={button.openInNewTab ? '_blank' : undefined} rel={button.openInNewTab ? 'noreferrer' : undefined} className={className}>
        <Button className="rounded-full bg-[#f8c43b] px-6 py-5 font-bold text-[#001523] hover:bg-[#e0b135]">
          {button.label}
        </Button>
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      <Button className="rounded-full bg-[#f8c43b] px-6 py-5 font-bold text-[#001523] hover:bg-[#e0b135]">
        {button.label}
      </Button>
    </Link>
  );
}

function sectionStyle(settings?: SanitySectionSettings) {
  return {
    backgroundColor: typeof settings?.backgroundColor === 'string' && settings.backgroundColor ? settings.backgroundColor : undefined,
    color: typeof settings?.textColor === 'string' && settings.textColor ? settings.textColor : undefined,
    paddingTop: typeof settings?.paddingTop === 'string' && settings.paddingTop ? settings.paddingTop : undefined,
    paddingBottom: typeof settings?.paddingBottom === 'string' && settings.paddingBottom ? settings.paddingBottom : undefined,
    marginTop: typeof settings?.marginTop === 'string' && settings.marginTop ? settings.marginTop : undefined,
    marginBottom: typeof settings?.marginBottom === 'string' && settings.marginBottom ? settings.marginBottom : undefined,
  };
}

function SectionShell({
  section,
  children,
  dark = false,
  spacingClassName = 'px-[18px] py-16 md:py-[115px]',
}: {
  section: SanitySection;
  children: React.ReactNode;
  dark?: boolean;
  spacingClassName?: string;
}) {
  const settings = section.settings;
  const backgroundImage = settings?.backgroundImage;
  const overlayOpacity =
    typeof settings?.overlayOpacity === 'number' ? Math.min(Math.max(settings.overlayOpacity, 0), 100) / 100 : 0.55;

  return (
    <section
      id={typeof settings?.sectionId === 'string' && settings.sectionId ? settings.sectionId : undefined}
      className={`relative overflow-hidden ${spacingClassName} ${dark ? 'bg-[#001523] text-white' : 'bg-[#fbf9f9] text-[#001523]'} ${typeof settings?.customClassName === 'string' ? settings.customClassName : ''}`}
      style={sectionStyle(settings)}>
      {backgroundImage?.url ? (
        <>
          <SanityImageComponent image={backgroundImage} alt={backgroundImage.alt || ''} className="absolute inset-0 h-full w-full object-cover" sizes="100vw" />
          <div
            className="absolute inset-0"
            style={{ backgroundColor: settings?.overlayColor || '#000000', opacity: overlayOpacity }}
          />
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
  section: SanitySection;
  dark?: boolean;
  className?: string;
}) {
  const Heading = section._type === 'heroSection' && (section.headingLevel === 'h2' || section.headingLevel === 'h3') ? section.headingLevel : section._type === 'heroSection' ? 'h1' : 'h2';

  return (
    <div className={className}>
      {section.eyebrow ? (
        <p className={`text-[15px] font-bold uppercase tracking-[0.18em] ${dark ? 'text-[#87ceff]' : 'text-[#2c80b8]'}`}>
          {section.eyebrow}
        </p>
      ) : null}
      {section.title ? (
        <Heading className="mt-3 max-w-[900px] text-[42px] font-bold leading-[1.02] tracking-[-1.6px] md:text-[72px]">
          {section.title}
        </Heading>
      ) : null}
      {section.subtitle ? (
        <p className={`mt-5 max-w-[760px] text-xl leading-8 ${dark ? 'text-white/75' : 'text-[#44515a]'}`}>
          {section.subtitle}
        </p>
      ) : null}
    </div>
  );
}

function DynamicHeroSection({ section }: { section: SanitySection }) {
  const image = section.foregroundImage || section.image;
  const dark = section.settings?.theme === 'dark' || section.variant === 'backgroundImage' || Boolean(section.settings?.backgroundImage);
  const heroMinHeight = typeof section.height === 'string' && section.height.trim().length > 0 ? section.height.trim() : undefined;

  return (
    <SectionShell section={section} spacingClassName="px-[18px] pt-[190px] pb-0 md:pt-10 md:pb-0" dark={dark}>
      <div
        className="grid min-h-[300px] gap-7 md:min-h-[300px] md:grid-cols-2 md:items-center"
        style={heroMinHeight ? { minHeight: heroMinHeight } : undefined}>
        <div>
          <SectionTitle section={section} className="mb-6 md:mb-8" dark={dark} />
          <PortableTextRenderer value={section.richText || section.content} />
          <div className="mt-5 flex flex-wrap gap-3">
            <ButtonLink button={section.primaryButton} />
            <ButtonLink button={section.secondaryButton} />
          </div>
        </div>
        {image?.url ? (
          <SanityImageComponent image={image} alt={image.alt || ''} className="mx-auto max-h-[6000px] w-full self-end rounded-t-[34px] object-cover" priority />
        ) : null}
      </div>
    </SectionShell>
  );
}

function GenericRichTextSection({ section }: { section: SanitySection }) {
  const image = section.image;
  const centered = section.alignment === 'center';
  const imageOnRight = !centered && section.alignment === 'right';

  return (
    <SectionShell section={section}>
      <div className={`mx-auto grid max-w-[1200px] gap-10 text-inherit ${centered ? '' : 'md:grid-cols-[1fr_0.85fr]'} md:items-start`}>
        <div className={centered ? 'mx-auto max-w-[900px]' : 'max-w-[900px]'}>
          <SectionTitle section={section} className="mb-0" />
          <div className="mt-8">
            <PortableTextRenderer value={section.richText || section.content} />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink button={section.cta || section.primaryButton} />
            {asArray(section.buttons).map((button, index) => (
              <ButtonLink key={button._key || `${button.label}-${index}`} button={button} />
            ))}
          </div>
        </div>
        {image?.url ? (
          <SanityImageComponent image={image} alt={image.alt || ''} className={`w-full rounded-[34px] object-cover ${imageOnRight ? '' : 'hidden md:block'}`} />
        ) : null}
      </div>
    </SectionShell>
  );
}

function DynamicCardsSection({ section, dark = false }: { section: SanitySection; dark?: boolean }) {
  const items = asArray(section.cards).length > 0 ? asArray(section.cards) : asArray(section.posts).length > 0 ? asArray(section.posts) : asArray(section.episodes).length > 0 ? asArray(section.episodes) : asArray(section.videos).length > 0 ? asArray(section.videos) : asArray(section.books).length > 0 ? asArray(section.books) : [];

  return (
    <SectionShell section={section} dark={dark}>
      <SectionTitle section={section} dark={dark} />
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item, index) => {
          const record = item as Record<string, unknown>;
          const image = (record.image || record.mainImage || record.coverImage || record.thumbnail) as SanityImageType | undefined;
          const title = typeof record.title === 'string' ? record.title : undefined;
          const name = typeof record.name === 'string' ? record.name : undefined;
          const description = (['description', 'excerpt', 'summary'] as const).map((key) => (typeof record[key] === 'string' ? (record[key] as string) : undefined)).find(Boolean);
          const slug = record.slug && typeof record.slug === 'object' && typeof (record.slug as { current?: unknown }).current === 'string' ? (record.slug as { current: string }).current : undefined;
          const href = slug ? (section._type === 'booksSection' ? `/books/${slug}` : section._type === 'videoGridSection' ? `/videos/${slug}` : section._type === 'featuredInterviewsSection' || section._type === 'recentEpisodesSection' ? `/podcast/${slug}` : `/blog/${slug}`) : undefined;
          const key = typeof record._id === 'string' ? record._id : typeof record._key === 'string' ? record._key : `${title ?? name ?? 'item'}-${index}`;
          const card = (
            <>
              {image?.url ? (
                <SanityImageComponent image={image} alt={image.alt || title || name || ''} className="aspect-[1.35/1] w-full object-cover" sizes="(min-width: 768px) 33vw, 100vw" />
              ) : null}
              <div className="p-7">
                {title || name ? (
                  <h3 className="text-[28px] font-bold leading-tight tracking-[-0.7px]">
                    {title || name}
                  </h3>
                ) : null}
                {description ? (
                  <p className={`mt-4 text-base leading-7 ${dark ? 'text-white/70' : 'text-[#66737b]'}`}>
                    {description}
                  </p>
                ) : null}
              </div>
            </>
          );
          return (
            <article
              key={key}
              className={`overflow-hidden rounded-[30px] ${dark ? 'bg-white/8 text-white' : 'bg-white text-[#001523]'} shadow-sm`}>
              {href ? <Link href={href}>{card}</Link> : card}
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

function DynamicLogoCloudSection({ section }: { section: SanitySection }) {
  const logos = asArray(section.logos);
  const columns = typeof section.columns === 'number' && section.columns > 0 ? Math.min(Math.round(section.columns), 12) : 6;

  return (
    <SectionShell section={section} dark={section.settings?.theme === 'dark'}>
      <SectionTitle section={section} dark={section.settings?.theme === 'dark'} />
      <div
        className="grid grid-cols-2 gap-4 md:[grid-template-columns:var(--logo-columns)]"
        style={{ '--logo-columns': `repeat(${columns}, minmax(0, 1fr))` } as React.CSSProperties}>
        {logos.map((logo, index) => (
          <a
            key={logo._key || logo.name || index}
            href={logo.url}
            target={logo.url?.startsWith('http') ? '_blank' : undefined}
            rel={logo.url?.startsWith('http') ? 'noreferrer' : undefined}
            className="flex h-24 items-center justify-center rounded-[22px] bg-white p-5 shadow-sm">
            {logo.image?.url ? (
              <SanityImageComponent image={logo.image} alt={logo.image.alt || logo.name || ''} className="max-h-12 max-w-full object-contain" />
            ) : (
              <span className="font-bold text-[#001523]">{logo.name}</span>
            )}
          </a>
        ))}
      </div>
    </SectionShell>
  );
}

function AboutSection({ section }: { section: SanitySection }) {
  const stats = asArray(section.stats);
  const logos = asArray(section.logos);
  const imageLeft = section.layout !== 'imageRight';

  return (
    <SectionShell section={section}>
      <div className="mx-auto grid max-w-[1200px] gap-10 text-inherit md:grid-cols-[1fr_0.85fr] md:items-start">
        <div className={imageLeft ? '' : 'md:order-last'}>
          <SectionTitle section={section} className="mb-0" />
          <div className="mt-8">
            <PortableTextRenderer value={section.richText || section.content} />
          </div>
          {stats.length > 0 ? (
            <dl className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-3">
              {stats.map((stat, index) => (
                <div key={stat._key || index}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="text-[42px] font-bold leading-none tracking-[-1.6px] text-[#2c80b8]">{stat.value}</dd>
                  {stat.label ? <dd className="mt-2 text-[15px] text-[#66737b]">{stat.label}</dd> : null}
                </div>
              ))}
            </dl>
          ) : null}
          {logos.length > 0 ? (
            <div className="mt-8 flex flex-wrap gap-4">
              {logos.map((logo, index) =>
                logo.image?.url ? (
                  <SanityImageComponent key={logo._key || index} image={logo.image} alt={logo.image.alt || logo.name || ''} className="max-h-10 object-contain opacity-80" />
                ) : null
              )}
            </div>
          ) : null}
          <div className="mt-8">
            <ButtonLink button={section.cta} />
          </div>
        </div>
        {section.image?.url ? (
          <SanityImageComponent image={section.image} alt={section.image.alt || ''} className="w-full rounded-[34px] object-cover" />
        ) : null}
      </div>
    </SectionShell>
  );
}

function NewsletterSection({ section }: { section: SanitySection }) {
  return (
    <SectionShell section={section} dark={section.settings?.theme === 'dark'}>
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <SectionTitle section={section} className="mb-0" dark={section.settings?.theme === 'dark'} />
          <div className="mt-6">
            <PortableTextRenderer value={section.richText || section.content} />
          </div>
          <form className="mt-8 flex max-w-[520px] flex-wrap gap-3">
            <input
              type="email"
              name="email"
              required
              placeholder={typeof section.emailPlaceholder === 'string' && section.emailPlaceholder ? section.emailPlaceholder : undefined}
              className="h-14 flex-1 rounded-full border border-[#e3dbdb] bg-white px-6 text-[#001523] outline-none focus:border-[#2c80b8]"
            />
            {section.buttonLabel ? (
              <Button type="submit" className="rounded-full bg-[#f8c43b] px-6 py-5 font-bold text-[#001523] hover:bg-[#e0b135]">
                {section.buttonLabel}
              </Button>
            ) : null}
          </form>
        </div>
        {section.image?.url ? (
          <SanityImageComponent image={section.image} alt={section.image.alt || ''} className="w-full rounded-[34px] object-cover" />
        ) : null}
      </div>
    </SectionShell>
  );
}

function FaqSection({ section }: { section: SanitySection }) {
  const items = asArray(section.items);

  return (
    <SectionShell section={section}>
      <SectionTitle section={section} />
      <div className="max-w-[900px] divide-y divide-[#e3dbdb]">
        {items.map((item, index) => (
          <details key={item._key || index} className="group py-6">
            <summary className="cursor-pointer list-none text-[22px] font-bold tracking-[-0.5px] marker:hidden [&::-webkit-details-marker]:hidden">
              {item.question}
              <span className="float-right text-[#2c80b8] transition-transform group-open:rotate-45">+</span>
            </summary>
            <div className="mt-4 max-w-[760px] text-[#44515a]">
              <PortableTextRenderer value={item.answer} />
            </div>
          </details>
        ))}
      </div>
    </SectionShell>
  );
}

function GallerySection({ section }: { section: SanitySection }) {
  const images = asArray(section.images);

  return (
    <SectionShell section={section}>
      <SectionTitle section={section} />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {images.map((image, index) =>
          image?.url ? (
            <SanityImageComponent
              key={image.url || index}
              image={image}
              alt={image.alt || ''}
              className="aspect-square w-full rounded-[22px] object-cover"
              sizes="(min-width: 768px) 33vw, 50vw"
            />
          ) : null
        )}
      </div>
    </SectionShell>
  );
}

function EmbedSection({ section }: { section: SanitySection }) {
  const embed = section.embed;
  if (!embed?.url && !embed?.embedCode) return null;

  return (
    <SectionShell section={section}>
      <SectionTitle section={section} />
      {embed.embedCode ? (
        <div className="max-w-[900px] [&_iframe]:aspect-video [&_iframe]:w-full" dangerouslySetInnerHTML={{ __html: embed.embedCode }} />
      ) : embed.url ? (
        <div className="aspect-video w-full max-w-[900px] overflow-hidden rounded-[24px]">
          <iframe
            src={embed.url}
            title={embed.title || section.title || 'Embedded content'}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : null}
    </SectionShell>
  );
}

export function SectionRenderer({ sections }: SectionRendererProps) {
  if (!sections?.length) return null;

  return sections.map((section, index) => {
    if (section.settings?.isHidden) return null;
    const key = section._key || `${section._type}-${index}`;

    switch (section._type) {
      case 'heroSection':
        return <DynamicHeroSection key={key} section={section} />;
      case 'featuredInterviewsSection':
      case 'recentEpisodesSection':
      case 'recentPostsSection':
      case 'videoGridSection':
      case 'booksSection':
      case 'cardsSection':
        return <DynamicCardsSection key={key} section={section} dark={section._type === 'videoGridSection'} />;
      case 'logoCloudSection':
        return <DynamicLogoCloudSection key={key} section={section} />;
      case 'aboutSection':
        return <AboutSection key={key} section={section} />;
      case 'newsletterSection':
        return <NewsletterSection key={key} section={section} />;
      case 'faqSection':
        return <FaqSection key={key} section={section} />;
      case 'embedSection':
        return <EmbedSection key={key} section={section} />;
      case 'gallerySection':
        return <GallerySection key={key} section={section} />;
      case 'ctaSection':
      case 'richTextSection':
        return <GenericRichTextSection key={key} section={section} />;
      default:
        return <MissingSectionFallback key={key} index={index} sectionType={section._type} />;
    }
  });
}
