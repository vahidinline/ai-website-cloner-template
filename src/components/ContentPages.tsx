import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PortableTextRenderer } from '@/components/portable-text/PortableTextRenderer';
import type { SanityImage } from '@/sanity/types';

export type ContentCardItem = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  description?: string;
  excerpt?: string;
  summary?: string;
  publishedAt?: string;
  image?: SanityImage;
  eyebrow?: string;
};

export type BuyLink = {
  _key?: string;
  label?: string;
  url?: string;
};

type ContentArchivePageProps = {
  eyebrow: string;
  title: string;
  items: ContentCardItem[];
  basePath: string;
  emptyMessage: string;
};

type ContentHeroProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  publishedAt?: string;
  image?: SanityImage;
};

export function ContentArchivePage({
  eyebrow,
  title,
  items,
  basePath,
  emptyMessage,
}: ContentArchivePageProps) {
  return (
    <main className="flex-1 px-[18px] pb-20 pt-[170px]">
      <div className="mx-auto max-w-[1200px]">
        <p className="text-[15px] font-bold uppercase tracking-[0.18em] text-[#2c80b8]">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-[56px] font-bold leading-none tracking-[-2px] text-[#001523] md:text-[88px]">
          {title}
        </h1>
        {items.length > 0 ? (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {items.map((item) => (
              <article
                key={item._id}
                className="overflow-hidden rounded-[30px] bg-white shadow-sm">
                {item.image?.url ? (
                  <img
                    src={item.image.url}
                    alt={item.image.alt || item.title || ''}
                    className="aspect-[1.35/1] w-full object-cover"
                  />
                ) : null}
                <div className="p-8">
                  {item.eyebrow ? (
                    <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.16em] text-[#2c80b8]">
                      {item.eyebrow}
                    </p>
                  ) : null}
                  <h2 className="text-[28px] font-bold leading-tight tracking-[-0.7px] text-[#001523]">
                    <Link href={`${basePath}/${item.slug?.current || '#'}`}>
                      {item.title}
                    </Link>
                  </h2>
                  {item.summary || item.description || item.excerpt ? (
                    <p className="mt-4 text-[#66737b]">
                      {item.summary || item.description || item.excerpt}
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-12 rounded-[24px] bg-white p-8 text-lg text-[#66737b] shadow-sm">
            {emptyMessage}
          </p>
        )}
      </div>
    </main>
  );
}

export function ContentHero({
  eyebrow,
  title,
  description,
  publishedAt,
  image,
}: ContentHeroProps) {
  return (
    <header className="grid gap-10 md:grid-cols-[1fr_0.68fr] md:items-start">
      <div>
        {eyebrow || publishedAt ? (
          <p className="text-[15px] font-bold uppercase tracking-[0.18em] text-[#2c80b8]">
            {[eyebrow, formatDate(publishedAt)].filter(Boolean).join(' · ')}
          </p>
        ) : null}
        <h1 className="mt-3 text-[48px] font-bold leading-[1.02] tracking-[-1.8px] text-[#001523] md:text-[76px]">
          {title}
        </h1>
        {description ? (
          <p className="mt-6 text-xl leading-8 text-[#66737b]">{description}</p>
        ) : null}
      </div>
      {image?.url ? (
        <img
          src={image.url}
          alt={image.alt || title || ''}
          className="w-full rounded-[34px] object-cover shadow-sm"
        />
      ) : null}
    </header>
  );
}

export function DetailBody({ value }: { value?: unknown[] }) {
  if (!value?.length) return null;

  return (
    <div className="mt-12 max-w-[860px] text-[#001523]">
      <PortableTextRenderer value={value} />
    </div>
  );
}

export function ExternalLinks({ links }: { links?: BuyLink[] }) {
  if (!links?.length) return null;

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {links.map((link, index) => {
        if (!link.label || !link.url) return null;
        return (
          <a
            key={link._key || `${link.label}-${index}`}
            href={link.url}
            target="_blank"
            rel="noreferrer">
            <Button className="rounded-full bg-[#f8c43b] px-6 py-5 font-bold text-[#001523] hover:bg-[#e0b135]">
              {link.label}
            </Button>
          </a>
        );
      })}
    </div>
  );
}

export function formatDate(value?: string) {
  if (!value) return undefined;

  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
