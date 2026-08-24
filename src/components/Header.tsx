import React from 'react';
import Link from 'next/link';
import { SanityImage } from './SanityImage';
import { SearchIcon } from './icons';
import { getSiteSettings } from '@/sanity/queries';
import { hasValidSanityConfig } from '@/sanity/env';
import type { SanityButton, SanitySiteSettings } from '@/sanity/types';
import { resolveButtonUrl } from '@/sanity/urls';

function HeaderLink({ item, className }: { item: SanityButton; className: string }) {
  const href = resolveButtonUrl(item);
  if (!item.label || !href) return null;

  if (href.startsWith('http')) {
    return <a href={href} target={item.openInNewTab ? '_blank' : undefined} rel={item.openInNewTab ? 'noreferrer' : undefined} className={className}>{item.label}</a>;
  }

  return <Link href={href} className={className}>{item.label}</Link>;
}

export async function Header() {
  const settings = hasValidSanityConfig
    ? ((await getSiteSettings()) as SanitySiteSettings | null)
    : null;
  const navigation = settings?.header?.navigationMenu?.items ?? settings?.mainNavigation ?? [];
  const logo = settings?.logoLight;
  const action = settings?.header?.action;

  if (settings?.header?.enabled === false) return null;

  return (
    <header className="absolute top-0 left-0 w-full z-[999]">
      <div
        className="px-12 py-6"
        style={{
          background:
            'linear-gradient(135deg, rgb(0, 28, 47) 0%, rgb(0, 46, 78) 68%, rgb(0, 45, 76) 100%)',
        }}>
        <div className="max-w-[1200px] mx-auto flex justify-between items-center gap-[21.6px]">
          {/* Logo */}
          <div className="w-[150px] h-[32px]">
            {logo?.url ? (
              <Link href="/">
                <SanityImage image={logo} alt={logo.alt || settings?.siteTitle || ''} className="w-full h-full object-contain" fallbackWidth={300} fallbackHeight={64} priority />
              </Link>
            ) : null}
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-[21.6px] text-white text-[18px] font-medium" aria-label={settings?.header?.navigationMenu?.title}>
            {navigation.map((item, index) => {
              return <HeaderLink key={`${item.label}-${index}`} item={item} className="transition-colors hover:text-gray-200" />;
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-[21.6px]">
            {settings?.header?.searchLabel ? <button
              className="bg-white/10 rounded-full p-[10px] text-white hover:bg-white/20 transition-colors flex items-center justify-center w-10 h-10"
              aria-label={settings.header.searchLabel}>
              <SearchIcon className="w-[14px] h-[14px]" />
            </button> : null}
            {action ? <HeaderLink item={action} className="hidden md:flex items-center justify-center bg-[#001523] text-white rounded-full px-6 py-3 text-[13px] font-bold hover:bg-[#002a45] transition-colors" /> : null}
          </div>
        </div>
      </div>
    </header>
  );
}
