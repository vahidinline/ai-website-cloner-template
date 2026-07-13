import Link from 'next/link';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { Button } from '@/components/ui/button';
import { urlFor } from '@/sanity/image';

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
      const href = typeof value?.href === 'string' ? value.href : '#';
      const openInNewTab = Boolean(value?.openInNewTab);
      return (
        <a
          href={href}
          target={openInNewTab ? '_blank' : undefined}
          rel={openInNewTab ? 'noreferrer' : undefined}
          className="font-semibold underline underline-offset-4">
          {children}
        </a>
      );
    },
    internalLink: ({ children }) => (
      <Link href="#" className="font-semibold underline underline-offset-4">
        {children}
      </Link>
    ),
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

      return (
        <figure className="my-8 overflow-hidden rounded-[28px]">
          <img
            src={imageUrl}
            alt={imageValue.alt || ''}
            className="h-auto w-full object-cover"
          />
          {imageValue.caption ? (
            <figcaption className="mt-3 text-center text-sm text-current/60">
              {imageValue.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
    button: ({ value }) => {
      const buttonValue = value as {
        label?: string;
        url?: string;
        variant?: string;
      };
      if (!buttonValue?.label) return null;
      return (
        <a href={buttonValue.url || '#'} className="inline-block">
          <Button className="my-4 rounded-full bg-[#f8c43b] px-6 text-[#001523] hover:bg-[#e0b135]">
            {buttonValue.label}
          </Button>
        </a>
      );
    },
    callout: ({ value }) => {
      const calloutValue = value as {
        title?: string;
        body?: string;
        tone?: string;
      };
      return (
        <aside className="my-8 rounded-[24px] bg-[#f6f1f1] p-6 text-[#001523]">
          {calloutValue.title ? (
            <h4 className="text-xl font-bold">{calloutValue.title}</h4>
          ) : null}
          {calloutValue.body ? (
            <p className="mt-2 text-base leading-7">{calloutValue.body}</p>
          ) : null}
        </aside>
      );
    },
    embed: ({ value }) => {
      const embedValue = value as { url?: string; title?: string };
      if (!embedValue?.url) return null;
      return (
        <div className="my-8 rounded-[24px] bg-[#001523] p-6 text-white">
          <p className="font-bold">{embedValue.title || 'Embedded content'}</p>
          <a
            href={embedValue.url}
            className="mt-2 inline-block underline"
            target="_blank"
            rel="noreferrer">
            {embedValue.url}
          </a>
        </div>
      );
    },
  },
};

export function PortableTextRenderer({ value }: PortableTextRendererProps) {
  console.log('[homepage-debug] PortableTextRenderer value:', value);

  if (Array.isArray(value)) {
    console.log(
      '[homepage-debug] PortableTextRenderer malformed/null blocks:',
      value
        .map((block, index) => ({ index, block }))
        .filter(({ block }) => {
          if (block == null) return true;
          if (typeof block !== 'object') return true;

          const blockRecord = block as Record<string, unknown>;
          if (blockRecord._type === 'block' && blockRecord.children == null) {
            return true;
          }

          return false;
        }),
    );
  }

  if (!value?.length) return null;
  return <PortableText value={value} components={components} />;
}
