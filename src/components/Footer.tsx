import Link from 'next/link';
import { SanityImage } from './SanityImage';
import { getSiteSettings } from '@/sanity/queries';
import { hasValidSanityConfig } from '@/sanity/env';
import type { SanityButton, SanitySiteSettings } from '@/sanity/types';
import { SectionRenderer } from './SectionRenderer';
import { resolveButtonUrl } from '@/sanity/urls';

type SocialNetwork = 'linkedin' | 'telegram' | 'x' | 'youtube' | 'instagram';

function getSocialNetwork(button: SanityButton, href: string): SocialNetwork | undefined {
  const value = `${button.icon || ''} ${button.label || ''} ${href}`.toLowerCase();
  if (value.includes('linkedin')) return 'linkedin';
  if (value.includes('telegram') || value.includes('t.me')) return 'telegram';
  if (value.includes('instagram')) return 'instagram';
  if (value.includes('youtube') || value.includes('youtu.be')) return 'youtube';
  if (value.includes('twitter') || value.includes('x.com')) return 'x';
  return undefined;
}

function SocialIcon({ network }: { network: SocialNetwork }) {
  const paths: Record<SocialNetwork, string> = {
    linkedin: 'M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.36 8.02h4.27V22H.36V8.02zM7.3 8.02h4.1v1.91h.06c.57-1.08 1.97-2.22 4.05-2.22 4.33 0 5.13 2.85 5.13 6.55V22h-4.27v-6.84c0-1.63-.03-3.73-2.27-3.73-2.28 0-2.63 1.78-2.63 3.61V22H7.3V8.02z',
    telegram: 'M23.3 2.92 19.7 20.1c-.27 1.21-.97 1.51-1.97.94l-5.44-4.01-2.62 2.52c-.29.29-.53.53-1.1.53l.39-5.54L19.05 5.43c.44-.39-.1-.61-.68-.22L5.9 13.06.53 11.38c-1.17-.37-1.19-1.17.24-1.73L21.78 1.55c.97-.36 1.82.22 1.52 1.37z',
    x: 'M18.9 2.25h3.68l-8.04 9.19L24 21.75h-7.4l-5.8-7.58-6.63 7.58H.49l8.6-9.83L0 2.25h7.59l5.24 6.93 6.07-6.93zm-1.29 17.29h2.04L6.48 4.34H4.3l13.31 15.2z',
    youtube: 'M23.5 6.19a3.01 3.01 0 0 0-2.12-2.13C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.56A3.01 3.01 0 0 0 .5 6.19 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.81 3.01 3.01 0 0 0 2.12 2.13c1.88.56 9.38.56 9.38.56s7.5 0 9.38-.56a3.01 3.01 0 0 0 2.12-2.13A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.81zM9.6 15.57V8.43L15.87 12 9.6 15.57z',
    instagram: 'M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9zm9.75 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  };

  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d={paths[network]} /></svg>;
}

function FooterLink({ button }: { button: SanityButton }) {
  const href = resolveButtonUrl(button);
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
  const socialLinks = footer?.socialLinks?.length
    ? footer.socialLinks
    : settings?.socialLinks ?? [];

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
              <SanityImage
                image={footer?.logo || settings?.logoDark}
                alt={footer?.logo?.alt || settings?.logoDark?.alt || settings?.siteTitle || ''}
                className="mb-[21.6px] w-[150px]"
                fallbackWidth={300}
                fallbackHeight={64}
              />
            ) : null}
            {(footer?.copyright || settings?.footerCopyright) ? (
              <p className="text-[15px] leading-[24px] text-[#66737b]">
                {footer?.copyright || settings?.footerCopyright}
              </p>
            ) : null}
            {socialLinks.length > 0 ? (
              <div className="mt-[21.6px] flex flex-wrap gap-[8px_21.6px]">
                {socialLinks.map((button, index) => {
                  const href = resolveButtonUrl(button);
                  if (!href) return null;
                  const network = getSocialNetwork(button, href);
                  return (
                    <a
                      key={`${button.label}-${index}`}
                      href={href}
                      target={button.openInNewTab ? '_blank' : undefined}
                      rel={button.openInNewTab ? 'noreferrer' : undefined}
                      aria-label={button.label || network}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f6f1f1] text-[#001523] transition-colors hover:bg-gray-200">
                      {network ? <SocialIcon network={network} /> : <span className="text-xs font-semibold">{button.label}</span>}
                    </a>
                  );
                })}
              </div>
            ) : null}
          </div>

          {navigation.map((column, columnIndex) => (
            <div key={`${column.title}-${columnIndex}`} className="flex w-full flex-col md:w-[238px]">
              {column.title ? (
                <h2 className="py-2 text-[16px] font-semibold uppercase tracking-[-0.32px] text-[#001523]">
                  {column.title}
                </h2>
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
