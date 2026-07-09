import React from 'react';
import Link from 'next/link';
import { SearchIcon } from './icons';

export function Header() {
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
                src="/images/logo.png"
                alt="The Blog of Author Saeed Souzangar"
                className="w-full h-full object-contain"
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-[21.6px] text-white text-[18px] font-medium">
            <Link
              href="/about"
              className="hover:text-gray-200 transition-colors">
              About
            </Link>
            <Link
              href="/blog"
              className="hover:text-gray-200 transition-colors">
              Blog
            </Link>
            <Link
              href="/books"
              className="hover:text-gray-200 transition-colors">
              Books
            </Link>
            <Link
              href="/podcast"
              className="hover:text-gray-200 transition-colors">
              Podcast
            </Link>
            <Link href="/tv" className="hover:text-gray-200 transition-colors">
              TV
            </Link>
            <Link
              href="/newsletter"
              className="hover:text-gray-200 transition-colors">
              Newsletter
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-[21.6px]">
            <button
              className="bg-white/10 rounded-full p-[10px] text-white hover:bg-white/20 transition-colors flex items-center justify-center w-10 h-10"
              aria-label="Search">
              <SearchIcon className="w-[14px] h-[14px]" />
            </button>
            <Link
              href="/newsletter"
              className="hidden md:flex items-center justify-center bg-[#001523] text-white rounded-full px-6 py-3 text-[13px] font-bold hover:bg-[#002a45] transition-colors">
              FREE NEWSLETTER
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
