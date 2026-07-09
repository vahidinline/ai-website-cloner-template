'use client';

import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const quotes = [
    '4,000+ 5-Star Reviews, Top-10 Highlighted Book of All Time.',
    'A cross between Jack Welch and a Buddhist monk.',
    "The world's best human guinea pig.",
    'The most surprising self-help hit of the decade.',
  ];

  return (
    <div className="relative w-full bg-[#001523]">
      <div className="relative min-h-[430px] flex justify-center items-center pt-[115.2px] px-[18px] pb-[64px]">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            src="/images/saeed.png"
            alt="Hero Background"
            className="absolute w-full h-full object-contain top-[50px] right-100"
          />
          <div className="absolute inset-0 bg-[#2b2e31] opacity-60"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-[1200px] mx-auto block">
          <div className="flex flex-col md:flex-row gap-[21.6px]">
            {/* Left Column: Slider (Hidden on mobile) */}
            <div className="hidden md:block w-full md:w-[589.203px] py-[96px]">
              <div className="h-[364px] flex flex-col justify-center">
                <div className="mb-8">
                  {/* Star rating placeholder */}
                  <div className="flex gap-1 text-[#f8c43b]">★★★★★</div>
                </div>
                <h3 className="text-white text-[32px] md:text-[40px] font-bold leading-tight mb-8">
                  {quotes[currentSlide]}
                </h3>
                {/* Simple dot navigation for slider */}
                <div className="flex gap-2">
                  {quotes.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`w-3 h-3 rounded-full ${i === currentSlide ? 'bg-white' : 'bg-white/30'}`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Content */}
            <div className="w-full md:w-[589.203px] mt-[21.6px] pt-[32px] flex flex-col md:flex-row items-center gap-[21.6px]">
              {/* Book Covers */}
              <div className="w-[189px] shrink-0">
                <img
                  src="/images/tim-ferriss-4-hour-week-books-optmized.png"
                  alt="Saeed Souzangar Books"
                  className="w-full h-auto object-contain rounded-lg"
                />
              </div>

              {/* Text and Form */}
              <div className="w-full md:w-[378px] flex flex-col">
                <p className="text-[22px] font-semibold leading-[30.8px] text-white">
                  <span className="text-[#87ceff]">Get 175+ Free Pages</span>{' '}
                  <em>The 4-Hour Workweek</em>, <em>The 4-Hour Body</em>, and{' '}
                  <em>The 4-Hour Chef</em>.
                </p>

                <form className="mt-[21.6px] flex flex-col gap-[8px]">
                  <Input
                    type="email"
                    placeholder="Your Email Address"
                    className="bg-white text-[#001523] rounded-full h-[50px] px-6 text-[16px] w-full border-none focus-visible:ring-0"
                    required
                  />
                  <Button
                    type="submit"
                    className="bg-[#f8c43b] hover:bg-[#e0b135] text-[#001523] rounded-full h-[50px] px-6 text-[16px] font-semibold w-full transition-colors">
                    Download Free Chapters
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
