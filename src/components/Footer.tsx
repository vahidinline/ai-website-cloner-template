import Link from 'next/link';
import { getSiteSettings } from '@/sanity/queries';
import { hasValidSanityConfig } from '@/sanity/env';
import type { SanityButton, SanitySiteSettings } from '@/sanity/types';
import { SectionRenderer } from './SectionRenderer';

function getButtonHref(button: SanityButton) {
  if (button.url) return button.url;
  const slug = button.internalLink?.slug?.current;
  if (!slug) return undefined;

  switch (button.internalLink?._type) {
    case 'post':
      return `/blog/${slug}`;
    case 'podcastEpisode':
      return `/podcast/${slug}`;
    case 'video':
      return `/videos/${slug}`;
    case 'book':
      return `/books/${slug}`;
    default:
      return `/${slug}`;
  }
}

function FooterLink({ button }: { button: SanityButton }) {
  const href = getButtonHref(button);
  if (!button.label || !href) return null;

  const className = 'hover:underline';
  if (href.startsWith('http')) {
    return (
      <a
        href={href}
        target={button.openInNewTab ? '_blank' : undefined}
        rel={button.openInNewTab ? 'noreferrer' : undefined}
        className={className}>
        {button.label}
      </a>
    );
  }

  return <Link href={href} className={className}>{button.label}</Link>;
}

async function getFooterSettings() {
  if (!hasValidSanityConfig) return null;
  return (await getSiteSettings()) as SanitySiteSettings | null;
}

export async function Footer() {
  const settings = await getFooterSettings();
  const footer = settings?.footer;
  const navigation = footer?.columns ?? [];
  const socialLinks = footer?.socialLinks ?? settings?.socialLinks ?? [];

  if (footer?.enabled === false) return null;

  return (
    <footer className="relative w-full">
      <div className="relative flex min-h-[180px] items-center justify-center px-[18px] py-16">
        <div className="absolute inset-0 bg-[#001523] opacity-80 mix-blend-multiply" />
      </div>

      {settings?.footerCta ? <SectionRenderer sections={[settings.footerCta]} /> : null}

      <div className="mx-auto max-w-[1440px] px-12 py-[115.2px]">
        <div className="mx-auto flex max-w-[1200px] flex-col flex-wrap gap-[21.6px] md:flex-row">
          <div className="flex w-full flex-col md:w-[420px]">
            {(footer?.logo?.url || settings?.logoDark?.url) ? (
              <img
                src={footer?.logo?.url || settings?.logoDark?.url || ''}
                alt={footer?.logo?.alt || settings?.logoDark?.alt || settings?.siteTitle || ''}
                className="mb-[21.6px] w-[150px]"
              />
            ) : null}
            {(footer?.copyright || settings?.footerCopyright) ? (
              <p className="text-[15px] leading-[24px] text-[#66737b]">
                {footer?.copyright || settings?.footerCopyright}
              </p>
            ) : null}
            {socialLinks.length > 0 ? (
              <div className="mt-[21.6px] flex flex-wrap gap-[8px_21.6px]">
                {socialLinks.map((button, index) => (
                  <a
                    key={`${button.label}-${index}`}
                    href={getButtonHref(button) || '#'}
                    target={button.openInNewTab ? '_blank' : undefined}
                    rel={button.openInNewTab ? 'noreferrer' : undefined}
                    aria-label={button.label}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f6f1f1] text-[#001523] transition-colors hover:bg-gray-200">
                    <span className="text-xs font-semibold">{button.label}</span>
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {navigation.map((column, columnIndex) => (
            <div key={`${column.title}-${columnIndex}`} className="flex w-full flex-col md:w-[238px]">
              {column.title ? (
                <h5 className="py-2 text-[16px] font-semibold uppercase tracking-[-0.32px] text-[#001523]">
                  {column.title}
                </h5>
              ) : null}
              <ul className="space-y-2 text-[16px] font-medium leading-[25.6px] text-[#001523]">
                {(column.links ?? []).map((button, index) => (
                  <li key={`${button.label}-${index}`}><FooterLink button={button} /></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="mx-auto mt-[32px] max-w-[1200px] border-t border-[#efe9e9]" />
        {(footer?.affiliateDisclosure || settings?.affiliateDisclosure) ? (
          <p className="mx-auto mt-[32px] max-w-[800px] text-center text-[15px] text-[#66737b]">
            {footer?.affiliateDisclosure || settings?.affiliateDisclosure}
          </p>
        ) : null}
      </div>
    </footer>
  );
}
