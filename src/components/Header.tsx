import React from 'react';
import Link from 'next/link';
import { SearchIcon } from './icons';
import { getSiteSettings } from '@/sanity/queries';
import { hasValidSanityConfig } from '@/sanity/env';
import type { SanityButton, SanitySiteSettings } from '@/sanity/types';

function hrefFor(button: SanityButton) {
  if (button.url) return button.url;
  const slug = button.internalLink?.slug?.current;
  if (!slug) return undefined;
  switch (button.internalLink?._type) {
    case 'post': return `/blog/${slug}`;
    case 'podcastEpisode': return `/podcast/${slug}`;
    case 'video': return `/videos/${slug}`;
    case 'book': return `/books/${slug}`;
    default: return `/${slug}`;
  }
}

export async function Header() {
  const settings = hasValidSanityConfig
    ? ((await getSiteSettings()) as SanitySiteSettings | null)
    : null;
  const navigation = settings?.mainNavigation ?? [];
  const logo = settings?.logoLight;

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
            <Link href="/">
              <img
                src={logo?.url || '/images/logo.png'}
                alt={logo?.alt || settings?.siteTitle || 'Site logo'}
                className="w-full h-full object-contain"
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-[21.6px] text-white text-[18px] font-medium">
            {navigation.map((item, index) => {
              const href = hrefFor(item);
              if (!item.label || !href) return null;
              return href.startsWith('http') ? (
                <a key={`${item.label}-${index}`} href={href} target={item.openInNewTab ? '_blank' : undefined} rel={item.openInNewTab ? 'noreferrer' : undefined} className="transition-colors hover:text-gray-200">{item.label}</a>
              ) : (
                <Link key={`${item.label}-${index}`} href={href} className="transition-colors hover:text-gray-200">{item.label}</Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-[21.6px]">
            <button
              className="bg-white/10 rounded-full p-[10px] text-white hover:bg-white/20 transition-colors flex items-center justify-center w-10 h-10"
              aria-label="Search">
              <SearchIcon className="w-[14px] h-[14px]" />
            </button>
            <Link
              href={hrefFor(navigation.find((item) => item.label?.toLowerCase().includes('newsletter')) || {}) || '/newsletter'}
              className="hidden md:flex items-center justify-center bg-[#001523] text-white rounded-full px-6 py-3 text-[13px] font-bold hover:bg-[#002a45] transition-colors">
              {navigation.find((item) => item.label?.toLowerCase().includes('newsletter'))?.label || 'FREE NEWSLETTER'}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
