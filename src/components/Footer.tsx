import React from 'react';
import Link from 'next/link';
import { Input } from './ui/input';
import { Button } from './ui/button';

export function Footer() {
  return (
    <footer className="w-full relative">
      {/* Top CTA Section */}
      <div className="relative min-h-[430px] flex justify-center items-center py-[115.2px] px-[18px]">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/images/Footer-CTA-1024x476.jpg"
            alt="Footer Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#001523] opacity-80 mix-blend-multiply"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-12">
          <h2 className="text-center text-white text-[56px] font-semibold leading-[61.6px] tracking-[-1.12px]">
            Download free chapters from <em>The 4-Hour Workweek</em>, the #1{' '}
            <em>New York Times</em> bestseller.
          </h2>

          <div className="max-w-[800px] mx-auto mt-[50px] flex flex-col md:flex-row items-center gap-[21.6px]">
            <img
              src="/images/tim-ferriss-4-hour-week-books.png"
              alt="The 4-Hour Workweek, Body, and Chef books"
              className="w-[189px] object-contain"
            />
            <ul className="text-white text-[18px] font-medium leading-[28.8px] space-y-4">
              <li>
                <strong>Free chapters</strong> of <em>The 4-Hour Workweek</em>,{' '}
                <em>The 4-Hour Body</em>, and <em>The 4-Hour Chef</em>.
              </li>
              <li>
                <strong>
                  <em>5-Bullet Friday</em>
                </strong>{' '}
                – books, gadgets, and weekly productivity tips and tricks.
              </li>
            </ul>
          </div>

          <form className="max-w-[800px] mx-auto mt-[50px] flex flex-col md:flex-row items-center gap-2">
            <Input
              type="email"
              placeholder="Your Email Address"
              className="bg-white text-[#001523] rounded-full h-[62px] px-6 text-[18px] flex-1 border-none focus-visible:ring-0"
              required
            />
            <Button
              type="submit"
              className="bg-[#f8c43b] hover:bg-[#e0b135] text-[#001523] rounded-full h-[62px] px-6 text-[18px] font-semibold transition-colors">
              Download Free Chapters
            </Button>
          </form>
        </div>
      </div>

      {/* Bottom Links Section */}
      <div className="max-w-[1440px] mx-auto py-[115.2px] px-12">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row gap-[21.6px] flex-wrap">
          {/* Column 1: Logo & Info */}
          <div className="w-full md:w-[420px] flex flex-col">
            <img
              src="/images/logo-dark.png"
              alt="The Blog of Author Saeed Souzangar"
              className="w-[150px] mb-[21.6px]"
            />
            <p className="text-[#66737b] text-[15px] font-normal leading-[24px]">
              Copyright © 2007–2026 Saeed Souzangar. All rights reserved.
              <br />
              THE 4-HOUR® is a registered trademark of Saeed Souzangar.
            </p>
            <p className="text-[#66737b] text-[15px] font-normal leading-[24px] mt-[21.6px]">
              Proudly powered by WordPress / Hosted by Pressable.
            </p>
            {/* Social Links (Placeholders for now, you can use SVGs or text) */}
            <div className="flex flex-wrap gap-[8px_21.6px] mt-[21.6px]">
              {[
                'X',
                'Instagram',
                'YouTube',
                'Facebook',
                'LinkedIn',
                'TikTok',
              ].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-12 h-12 rounded-full bg-[#f6f1f1] text-[#001523] flex items-center justify-center hover:bg-gray-200 transition-colors"
                  aria-label={social}>
                  <span className="sr-only">{social}</span>
                  {/* Generic icon placeholder */}
                  <div className="w-4 h-4 bg-current rounded-sm"></div>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: About */}
          <div className="w-full md:w-[238px] flex flex-col">
            <h5 className="text-[#001523] text-[16px] font-semibold tracking-[-0.32px] uppercase py-2">
              About
            </h5>
            <ul className="text-[16px] font-medium leading-[25.6px] text-[#001523] space-y-2">
              <li>
                <Link href="/about" className="hover:underline">
                  Saeed Souzangar
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/corrections" className="hover:underline">
                  Corrections
                </Link>
              </li>
              <li>
                <Link href="/about/causes" className="hover:underline">
                  Causes
                </Link>
              </li>
              <li>
                <Link href="/media" className="hover:underline">
                  Media Kit and Samples
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:underline">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/opt-out" className="hover:underline">
                  Do Not Sell or Share My Personal Information
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Books */}
          <div className="w-full md:w-[238px] flex flex-col">
            <h5 className="text-[#001523] text-[16px] font-semibold tracking-[-0.32px] uppercase py-2">
              Books
            </h5>
            <ul className="text-[16px] font-medium leading-[25.6px] text-[#001523] space-y-2">
              <li>
                <Link href="/books#4hww" className="hover:underline">
                  The 4-Hour Workweek
                </Link>
              </li>
              <li>
                <Link href="/books#4hb" className="hover:underline">
                  The 4-Hour Body
                </Link>
              </li>
              <li>
                <Link href="/books#4hc" className="hover:underline">
                  The 4-Hour Chef
                </Link>
              </li>
              <li>
                <Link href="/books#titans" className="hover:underline">
                  Tools of Titans
                </Link>
              </li>
              <li>
                <Link href="/books#tribe" className="hover:underline">
                  Tribe of Mentors
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Podcast */}
          <div className="w-full md:w-[238px] flex flex-col">
            <h5 className="text-[#001523] text-[16px] font-semibold tracking-[-0.32px] uppercase py-2">
              Podcast
            </h5>
            <ul className="text-[16px] font-medium leading-[25.6px] text-[#001523] space-y-2">
              <li>
                <Link href="/podcast/clips" className="hover:underline">
                  Popular Clips
                </Link>
              </li>
              <li>
                <Link href="/podcast/sponsors" className="hover:underline">
                  Podcast Sponsors
                </Link>
              </li>
              <li>
                <Link href="/podcast/random" className="hover:underline">
                  The Random Show
                </Link>
              </li>
              <li>
                <Link href="/podcast/meditation" className="hover:underline">
                  Meditation Monday
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Separator */}
        <hr className="max-w-[1200px] mx-auto mt-[32px] border-t border-[#efe9e9]" />

        {/* Affiliate Disclosure */}
        <p className="max-w-[800px] mx-auto mt-[32px] text-center text-[#66737b] text-[15px]">
          This site is an Amazon Associate, and purchases through Amazon links
          may earn an affiliate commission.
        </p>
      </div>
    </footer>
  );
}
