import Link from 'next/link';
import { ArrowRightIcon, PlayIcon } from './icons';

const podcastPlatforms = [
  'RSS feed',
  'Overcast',
  'Podcast Addict',
  'Pocket Casts',
  'Castbox',
  'YouTube Music',
  'Amazon Music',
  'Audible',
];

const featuredInterviews = [
  {
    name: 'Hugh Jackman',
    description:
      'Best Decisions, Daily Routines, The 85% Rule, Favorite Exercises, Mind Training, and Much More',
    image: '/images/Hugh-Jackman-Illustration-scaled.jpeg',
  },
  {
    name: 'Naval Ravikant',
    description: 'On Happiness, Reducing Anxiety, Crypto Stablecoins, and More',
    image: '/images/Naval-Ravikant-scaled.jpg',
  },
  {
    name: 'Jamie Foxx',
    description:
      'Workout Routines, Success Habits, and Untold Hollywood Stories',
    image: '/images/Jamie-Foxx-Hugh-Jackman-Illustrations-scaled.jpeg',
  },
  {
    name: 'Jerry Seinfeld',
    description: 'A Comedy Legend’s Systems, Routines, and Methods for Success',
    image: '/images/Jerry-Seinfeld-Illustration-scaled.jpg',
  },
  {
    name: 'Eric Schmidt',
    description:
      'The Promises and Perils of AI, Profound Revolutions on the Horizon, and Exploring the Meaning of Life',
    image: '/images/Eric-Schmidt-.webp',
  },
  {
    name: 'Elizabeth Gilbert',
    description:
      'How to Set Strong Boundaries, Overcome Purpose Anxiety, and Find Your Deep Inner Voice',
    image: '/images/Elizabeth-Gilbert-Illustration-scaled.jpg',
  },
  {
    name: 'Jim Collins',
    description: 'A Rare Interview with a Reclusive Polymath',
    image: '/images/Jim-Collins-Illustration-scaled.jpg',
  },
  {
    name: 'Arnold Schwarzenegger',
    description:
      'On Psychological Warfare, Building a Useful Body, and Lessons from a Legendary Career',
    image: '/images/Arnold-Schwarzenegger-Illustration-scaled.jpeg',
  },
  {
    name: 'Matthew McConaughey',
    description:
      'The Power of “No, Thank You,” Key Life Lessons, Diary Notes, and The Art of Catching Greenlights',
    image: '/images/Matthew-McConaughey-Illustration.webp',
  },
];

const recentEpisodes = [
  {
    date: 'June 25, 2026',
    title:
      'The “Divine Leaf” with 8,000+ Years of Use — Exploring the Many Benefits of Coca with Dr. Andrew Weil and Wade Davis (#871)',
    image: '/images/Andrew-Weil-and-Wade-Davis-Illustration.png',
  },
  {
    date: 'June 18, 2026',
    title:
      'Sebastian Mallaby, Biographer of Demis Hassabis — Lessons from 100+ AI Insiders on The Race to Superintelligence',
    image: '/images/Sebastian-Mallaby-Illustration-scaled.jpg',
  },
  {
    date: 'June 11, 2026',
    title:
      'Max Levchin, PayPal and Affirm — The Path from The Soviet Union to Building Multi-Billion Dollar Companies',
    image: '/images/Max-Levchin-Illustration-scaled.jpg',
  },
];

const recentPosts = [
  {
    category: 'Entrepreneurship',
    title: 'Death by 1,000 Compromises: How to Tap Into Founder Mode',
    excerpt:
      'A practical reminder that the small concessions compound. Protect the mission, cut the noise, and choose the work that actually matters.',
  },
  {
    category: 'Writing',
    title:
      'Has AI Already Killed How-To Nonfiction? Sales Trends, My Personal Data, and What It Might Mean for the Future',
    excerpt:
      'A data-backed look at nonfiction, search behavior, and the changing incentives for authors, publishers, and readers.',
  },
  {
    category: 'Startups',
    title: 'On The Importance of Desperate Customers',
    excerpt:
      'The strongest startup signals often come from customers with hair-on-fire problems and a willingness to fight for a solution.',
  },
];

const videos = [
  {
    title: 'How I Journal and Take Notes',
    image: '/images/maxresdefault.jpg',
  },
  {
    title: 'How to Remember What You Read',
    image: '/images/maxresdefault-1.jpg',
  },
  {
    title: 'How to Use Writing to Sharpen Your Thinking',
    image: '/images/maxresdefault-2.jpg',
  },
  {
    title: 'Should You Specialize or Be a Generalist?',
    image: '/images/maxresdefault-3.jpg',
  },
  {
    title: 'Life Is Short: How to Add a Sense of Urgency',
    image: '/images/maxresdefault-4.jpg',
  },
  {
    title: 'How to Use Your Phone… So That It Doesn’t Use You',
    image: '/images/maxresdefault-5.jpg',
  },
];

const companyLogos = [
  '/images/uberlogo-1.png',
  '/images/shopify-logo.png',
  '/images/duoliongoglogo.png',
  '/images/taskrabbitlogo.png',
  '/images/automatticlogo.png',
  '/images/nextddoorlogo.png',
  '/images/alibabalogo.png',
  '/images/spacexlogo.png',
];

const pressLogos = [
  '/images/nyt.png',
  '/images/newsweek.png',
  '/images/mens-journal.png',
  '/images/wiredlogo.png',
  '/images/ntlogo.png',
  '/images/ted-white.png',
];

const books = [
  {
    title: 'The 4-Hour Workweek',
    image: '/images/book-4work.png',
    description: 'Escape 9–5, live anywhere, and join the new rich.',
  },
  {
    title: 'The 4-Hour Body',
    image: '/images/book-4body.png',
    description:
      'An uncommon guide to rapid fat-loss, incredible sex, and becoming superhuman.',
  },
  {
    title: 'The 4-Hour Chef',
    image: '/images/book-4chef.png',
    description:
      'The simple path to cooking like a pro, learning anything, and living the good life.',
  },
  {
    title: 'Tools of Titans',
    image: '/images/book-titans.png',
    description:
      'The tactics, routines, and habits of billionaires, icons, and world-class performers.',
  },
  {
    title: 'Tribe of Mentors',
    image: '/images/book-tribe.png',
    description: 'Short life advice from the best in the world.',
  },
];

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-10 flex flex-col gap-3 md:mb-14 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-[15px] font-bold uppercase tracking-[0.18em] text-[#2c80b8]">
          {eyebrow}
        </p>
        <h2 className="mt-3 max-w-[850px] text-[38px] font-bold leading-[1.03] tracking-[-1.4px] text-[#001523] md:text-[64px]">
          {title}
        </h2>
      </div>
      <Link
        href="#"
        className="inline-flex items-center gap-2 text-[16px] font-bold text-[#001523] hover:text-[#2c80b8]">
        See all <ArrowRightIcon className="h-3 w-4" />
      </Link>
    </div>
  );
}

function PlayButton() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-[#f8c43b] px-4 py-2 text-[13px] font-bold text-[#001523] shadow-sm">
      <PlayIcon className="h-4 w-4" /> Play Episode
    </span>
  );
}

export function PodcastIntroSection() {
  return (
    <section className="bg-[#fbf9f9] px-[18px] py-16 md:py-[115px]">
      <div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-[0.92fr_1.08fr] md:items-center">
        <div className="relative mx-auto w-full max-w-[430px]">
          <div className="absolute -left-8 top-10 h-[72%] w-[76%] rounded-[42px] bg-[#f6f1f1]" />
          <img
            src="/images/podcast-phone-optmized.png"
            alt="The Tim Ferriss Show phone artwork"
            className="relative z-10 mx-auto h-auto w-full object-contain"
          />
        </div>
        <div>
          <p className="text-[15px] font-bold uppercase tracking-[0.18em] text-[#2c80b8]">
            The Tim Ferriss Show
          </p>
          <h2 className="mt-4 text-[42px] font-bold leading-[1.02] tracking-[-1.6px] text-[#001523] md:text-[72px]">
            The podcast trusted by one billion+ listeners.
          </h2>
          <p className="mt-6 text-[19px] leading-[1.7] text-[#44515a]">
            The Tim Ferriss Show is one of the most popular podcasts in the
            world, with more than one billion downloads. Each episode
            deconstructs world-class performers from eclectic areas to extract
            the tactics, tools, and routines you can use.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {podcastPlatforms.map((platform) => (
              <Link
                key={platform}
                href="#"
                className="rounded-full border border-[#d8d0d0] bg-white px-5 py-3 text-[14px] font-bold text-[#001523] hover:border-[#001523]">
                {platform}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturedInterviewsSection() {
  return (
    <section className="overflow-hidden bg-[#001523] px-[18px] py-16 text-white md:py-[115px]">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[15px] font-bold uppercase tracking-[0.18em] text-[#87ceff]">
              Start here
            </p>
            <h2 className="mt-3 text-[42px] font-bold leading-none tracking-[-1.6px] md:text-[72px]">
              Featured interviews
            </h2>
          </div>
          <Link
            href="#"
            className="inline-flex items-center gap-2 font-bold text-white/90">
            Browse episodes <ArrowRightIcon className="h-3 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featuredInterviews.map((interview) => (
            <article
              key={interview.name}
              className="group overflow-hidden rounded-[28px] bg-[#092a41] shadow-xl shadow-black/10">
              <div className="aspect-[1.28/1] overflow-hidden bg-[#123]">
                <img
                  src={interview.image}
                  alt={`${interview.name} illustration`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex min-h-[235px] flex-col p-7">
                <h3 className="text-[28px] font-bold leading-[1.05] tracking-[-0.6px]">
                  {interview.name}
                </h3>
                <p className="mt-3 flex-1 text-[16px] leading-[1.55] text-white/76">
                  {interview.description}
                </p>
                <div className="mt-6">
                  <PlayButton />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RecentEpisodesSection() {
  return (
    <section className="bg-[#fbf9f9] px-[18px] py-16 md:py-[115px]">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          eyebrow="Recent episodes"
          title="Listen to the latest conversations"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {recentEpisodes.map((episode) => (
            <article
              key={episode.title}
              className="overflow-hidden rounded-[30px] bg-white shadow-sm">
              <img
                src={episode.image}
                alt="Podcast episode illustration"
                className="aspect-[1.45/1] w-full object-cover"
              />
              <div className="p-7">
                <p className="text-[14px] font-bold uppercase tracking-[0.12em] text-[#66737b]">
                  {episode.date}
                </p>
                <h3 className="mt-4 text-[25px] font-bold leading-[1.12] tracking-[-0.5px] text-[#001523]">
                  {episode.title}
                </h3>
                <div className="mt-6">
                  <PlayButton />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BlogPostsSection() {
  return (
    <section className="bg-[#f6f1f1] px-[18px] py-16 md:py-[115px]">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading eyebrow="Explore more" title="Recent blog posts" />
        <div className="grid gap-6 md:grid-cols-3">
          {recentPosts.map((post) => (
            <article
              key={post.title}
              className="flex min-h-[360px] flex-col rounded-[30px] bg-[#001523] p-8 text-white">
              <p className="text-[14px] font-bold uppercase tracking-[0.16em] text-[#87ceff]">
                {post.category}
              </p>
              <h3 className="mt-5 text-[30px] font-bold leading-[1.05] tracking-[-0.7px]">
                {post.title}
              </h3>
              <p className="mt-5 flex-1 text-[16px] leading-[1.65] text-white/72">
                {post.excerpt}
              </p>
              <Link
                href="#"
                className="mt-7 inline-flex items-center gap-2 font-bold text-white">
                Read post <ArrowRightIcon className="h-3 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function VideosSection() {
  return (
    <section className="bg-[#001523] px-[18px] py-16 text-white md:py-[115px]">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[15px] font-bold uppercase tracking-[0.18em] text-[#87ceff]">
              Popular Tim Ferriss videos
            </p>
            <h2 className="mt-3 text-[42px] font-bold leading-none tracking-[-1.6px] md:text-[72px]">
              Watch the best clips
            </h2>
          </div>
          <Link
            href="#"
            className="inline-flex items-center gap-2 font-bold text-white/90">
            More videos <ArrowRightIcon className="h-3 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {videos.map((video) => (
            <article
              key={video.title}
              className="group overflow-hidden rounded-[28px] bg-white text-[#001523]">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={video.image}
                  alt={video.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20" />
                <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#f8c43b] text-[#001523]">
                  <PlayIcon className="h-6 w-6" />
                </span>
              </div>
              <h3 className="p-6 text-[24px] font-bold leading-[1.1] tracking-[-0.5px]">
                {video.title}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutTimSection() {
  return (
    <section className="bg-[#fbf9f9] px-[18px] py-16 md:py-[115px]">
      <div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-[0.95fr_1.05fr] md:items-center">
        <div className="overflow-hidden rounded-[34px] bg-[#efe9e9]">
          <img
            src="/images/timabout.jpg"
            alt="Tim Ferriss portrait"
            className="h-full min-h-[520px] w-full object-cover"
          />
        </div>
        <div>
          <p className="text-[15px] font-bold uppercase tracking-[0.18em] text-[#2c80b8]">
            About Tim Ferriss
          </p>
          <h2 className="mt-4 text-[42px] font-bold leading-[1.02] tracking-[-1.6px] text-[#001523] md:text-[72px]">
            “A cross between Jack Welch and a Buddhist monk.”
          </h2>
          <p className="mt-6 text-[19px] leading-[1.7] text-[#44515a]">
            Tim Ferriss has been listed as one of Fast Company’s “Most
            Innovative Business People” and one of Fortune’s “40 under 40.” He
            is an early-stage technology investor/advisor and the author of five
            #1 New York Times and Wall Street Journal bestsellers.
          </p>
          <p className="mt-5 text-[19px] leading-[1.7] text-[#44515a]">
            The Observer and other media have called Tim “the Oprah of audio,”
            due to the influence of The Tim Ferriss Show — the first
            business/interview podcast to exceed one billion downloads.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {companyLogos.map((logo) => (
              <div
                key={logo}
                className="flex h-20 items-center justify-center rounded-[20px] bg-white p-4">
                <img
                  src={logo}
                  alt="Company logo"
                  className="max-h-10 max-w-full object-contain opacity-75"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function PressSection() {
  return (
    <section className="bg-[#001523] px-[18px] py-14 text-white md:py-20">
      <div className="mx-auto max-w-[1200px]">
        <p className="text-center text-[18px] font-bold text-white/70">
          Featured and quoted in
        </p>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-6">
          {pressLogos.map((logo) => (
            <div
              key={logo}
              className="flex h-20 items-center justify-center rounded-[20px] bg-white/7 p-5">
              <img
                src={logo}
                alt="Press logo"
                className="max-h-10 max-w-full object-contain opacity-90"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BooksSection() {
  return (
    <section className="bg-[#fbf9f9] px-[18px] py-16 md:py-[115px]">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          eyebrow="4,000+ 5-Star Reviews"
          title="Books by Saeed Souzangar"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {books.map((book) => (
            <article
              key={book.title}
              className="flex flex-col items-center rounded-[30px] bg-[#f6f1f1] p-6 text-center transition-transform hover:-translate-y-1">
              <div className="flex h-[260px] items-end justify-center">
                <img
                  src={book.image}
                  alt={book.title}
                  className="max-h-full w-auto object-contain drop-shadow-xl"
                />
              </div>
              <h3 className="mt-7 text-[23px] font-bold leading-[1.05] tracking-[-0.5px] text-[#001523]">
                {book.title}
              </h3>
              <p className="mt-3 text-[15px] leading-[1.55] text-[#66737b]">
                {book.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
