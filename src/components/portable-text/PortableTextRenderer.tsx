import Link from 'next/link';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { buttonVariants } from '@/components/ui/button';
import { SanityImage } from '@/components/SanityImage';
import { urlFor } from '@/sanity/image';
import { resolveButtonUrl, resolveInternalUrl } from '@/sanity/urls';

type PortableTextRendererProps = {
  value?: unknown[];
};

const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="mb-6 mt-10 text-5xl font-bold leading-tight tracking-[-0.04em]">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mb-5 mt-9 text-4xl font-bold leading-tight tracking-[-0.035em]">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-4 mt-8 text-3xl font-bold leading-tight tracking-[-0.03em]">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-3 mt-7 text-2xl font-bold leading-tight">{children}</h4>
    ),
    normal: ({ children }) => (
      <p className="mb-5 text-lg leading-8 text-current/80">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-4 border-[#f8c43b] pl-6 text-2xl font-semibold leading-snug">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = typeof value?.href === 'string' && value.href ? value.href : undefined;
      if (!href) return <>{children}</>;
      return (
        <a
          href={href}
          target={value?.openInNewTab ? '_blank' : undefined}
          rel={value?.openInNewTab ? 'noreferrer' : undefined}
          className="font-semibold underline underline-offset-4">
          {children}
        </a>
      );
    },
    internalLink: ({ children, value }) => {
      const href = resolveInternalUrl(value?.reference);
      if (!href) return <>{children}</>;
      return (
        <Link href={href} className="font-semibold underline underline-offset-4">
          {children}
        </Link>
      );
    },
    textColor: ({ children, value }) => (
      <span
        style={{
          color: typeof value?.color === 'string' ? value.color : undefined,
        }}>
        {children}
      </span>
    ),
    fontSize: ({ children, value }) => (
      <span
        style={{
          fontSize: typeof value?.size === 'string' ? value.size : undefined,
        }}>
        {children}
      </span>
    ),
    fontFamily: ({ children, value }) => (
      <span
        style={{
          fontFamily:
            typeof value?.family === 'string' ? value.family : undefined,
        }}>
        {children}
      </span>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 ml-6 list-disc space-y-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-6 ml-6 list-decimal space-y-2">{children}</ol>
    ),
  },
  types: {
    imageWithAlt: ({ value }) => {
      const imageValue = value as {
        url?: string;
        alt?: string;
        caption?: string;
        asset?: unknown;
      };
      const imageUrl =
        imageValue.url ||
        (imageValue.asset ? urlFor(imageValue).url() : undefined);
      if (!imageUrl) return null;

      const image = imageUrl === imageValue.url ? imageValue : undefined;
      return (
        <figure className="my-8 overflow-hidden rounded-[28px]">
          {image ? (
            <SanityImage image={image} className="h-auto w-full object-cover" sizes="(min-width: 860px) 860px, 100vw" />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={imageUrl} alt={imageValue.alt || ''} className="h-auto w-full object-cover" />
          )}
          {imageValue.caption ? (
            <figcaption className="mt-3 text-center text-sm text-current/60">
              {imageValue.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
    button: ({ value }) => {
      const href = resolveButtonUrl(value);
      if (!value?.label || !href) return null;
      const className = buttonVariants({ className: 'my-4 rounded-full bg-[#f8c43b] px-6 text-[#001523] hover:bg-[#e0b135]' });
      if (href.startsWith('http')) {
        return (
          <a href={href} target={value.openInNewTab ? '_blank' : undefined} rel={value.openInNewTab ? 'noreferrer' : undefined} className={className}>
            {value.label}
          </a>
        );
      }
      return (
        <Link href={href} className={className}>
          {value.label}
        </Link>
      );
    },
    callout: ({ value }) => {
      if (!value?.title && !value?.body) return null;
      return (
        <aside className="my-8 rounded-[24px] bg-[#f6f1f1] p-6 text-[#001523]">
          {value.title ? (
            <h4 className="text-xl font-bold">{value.title}</h4>
          ) : null}
          {value.body ? (
            <p className="mt-2 text-base leading-7">{value.body}</p>
          ) : null}
        </aside>
      );
    },
    embed: ({ value }) => {
      if (!value?.url && !value?.embedCode) return null;
      if (value.embedCode) {
        return (
          <div
            className="my-8 [&_iframe]:aspect-video [&_iframe]:w-full"
            dangerouslySetInnerHTML={{ __html: value.embedCode }}
          />
        );
      }
      return (
        <div className="aspect-video my-8 w-full overflow-hidden rounded-[24px]">
          <iframe
            src={value.url}
            title={value.title || 'Embedded content'}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    },
  },
};

export function PortableTextRenderer({ value }: PortableTextRendererProps) {
  if (!value?.length) return null;
  return <PortableText value={value} components={components} />;
}
