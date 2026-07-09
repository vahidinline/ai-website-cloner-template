import { createReadStream, existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  const content = readFileSync(filePath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;
    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(path.join(rootDir, '.env.local'));

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-06-29';
const token =
  process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN;

if (!projectId || projectId === 'yourprojectid') {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local');
  process.exit(1);
}

if (!token) {
  console.error(`
Missing SANITY_API_WRITE_TOKEN in .env.local.

Create a token in Sanity Manage:
  https://www.sanity.io/manage/project/${projectId}/api#tokens

Use an Editor token, then add it to .env.local:
  SANITY_API_WRITE_TOKEN=sk...
`);
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function block(text, style = 'normal') {
  return {
    _type: 'block',
    style,
    markDefs: [],
    children: [
      {
        _type: 'span',
        text,
        marks: [],
      },
    ],
  };
}

function richText(...paragraphs) {
  return paragraphs.filter(Boolean).map((text) => block(text));
}

async function uploadImage(relativePath, alt) {
  const cleanPath = relativePath.replace(/^\//, '');
  const absolutePath = path.join(
    rootDir,
    'public',
    cleanPath.replace(/^images\//, 'images/'),
  );

  if (!existsSync(absolutePath)) {
    console.warn(`Image not found, skipping: ${relativePath}`);
    return undefined;
  }

  const asset = await client.assets.upload(
    'image',
    createReadStream(absolutePath),
    {
      filename: path.basename(absolutePath),
    },
  );

  return {
    _type: 'imageWithAlt',
    asset: {
      _type: 'reference',
      _ref: asset._id,
    },
    alt,
  };
}

async function createOrReplace(document) {
  await client.createOrReplace(document);
  console.log(`✓ ${document._type}: ${document._id}`);
  return document;
}

const featuredInterviews = [
  [
    'Hugh Jackman',
    'Best Decisions, Daily Routines, The 85% Rule, Favorite Exercises, Mind Training, and Much More',
    '/images/Hugh-Jackman-Illustration-scaled.jpeg',
  ],
  [
    'Naval Ravikant',
    'On Happiness, Reducing Anxiety, Crypto Stablecoins, and More',
    '/images/Naval-Ravikant-scaled.jpg',
  ],
  [
    'Jamie Foxx',
    'Workout Routines, Success Habits, and Untold Hollywood Stories',
    '/images/Jamie-Foxx-Hugh-Jackman-Illustrations-scaled.jpeg',
  ],
  [
    'Jerry Seinfeld',
    'A Comedy Legend’s Systems, Routines, and Methods for Success',
    '/images/Jerry-Seinfeld-Illustration-scaled.jpg',
  ],
  [
    'Eric Schmidt',
    'The Promises and Perils of AI, Profound Revolutions on the Horizon, and Exploring the Meaning of Life',
    '/images/Eric-Schmidt-.webp',
  ],
  [
    'Elizabeth Gilbert',
    'How to Set Strong Boundaries, Overcome Purpose Anxiety, and Find Your Deep Inner Voice',
    '/images/Elizabeth-Gilbert-Illustration-scaled.jpg',
  ],
  [
    'Jim Collins',
    'A Rare Interview with a Reclusive Polymath',
    '/images/Jim-Collins-Illustration-scaled.jpg',
  ],
  [
    'Arnold Schwarzenegger',
    'On Psychological Warfare, Building a Useful Body, and Lessons from a Legendary Career',
    '/images/Arnold-Schwarzenegger-Illustration-scaled.jpeg',
  ],
  [
    'Matthew McConaughey',
    'The Power of “No, Thank You,” Key Life Lessons, Diary Notes, and The Art of Catching Greenlights',
    '/images/Matthew-McConaughey-Illustration.webp',
  ],
];

const recentEpisodes = [
  [
    'The “Divine Leaf” with 8,000+ Years of Use — Exploring the Many Benefits of Coca with Dr. Andrew Weil and Wade Davis (#871)',
    'June 25, 2026',
    '/images/Andrew-Weil-and-Wade-Davis-Illustration.png',
  ],
  [
    'Sebastian Mallaby, Biographer of Demis Hassabis — Lessons from 100+ AI Insiders on The Race to Superintelligence',
    'June 18, 2026',
    '/images/Sebastian-Mallaby-Illustration-scaled.jpg',
  ],
  [
    'Max Levchin, PayPal and Affirm — The Path from The Soviet Union to Building Multi-Billion Dollar Companies',
    'June 11, 2026',
    '/images/Max-Levchin-Illustration-scaled.jpg',
  ],
];

const recentPosts = [
  [
    'Death by 1,000 Compromises: How to Tap Into Founder Mode',
    'Entrepreneurship',
    'A practical reminder that the small concessions compound. Protect the mission, cut the noise, and choose the work that actually matters.',
  ],
  [
    'Has AI Already Killed How-To Nonfiction? Sales Trends, My Personal Data, and What It Might Mean for the Future',
    'Writing',
    'A data-backed look at nonfiction, search behavior, and the changing incentives for authors, publishers, and readers.',
  ],
  [
    'On The Importance of Desperate Customers',
    'Startups',
    'The strongest startup signals often come from customers with hair-on-fire problems and a willingness to fight for a solution.',
  ],
];

const videos = [
  ['How I Journal and Take Notes', '/images/maxresdefault.jpg'],
  ['How to Remember What You Read', '/images/maxresdefault-1.jpg'],
  [
    'How to Use Writing to Sharpen Your Thinking',
    '/images/maxresdefault-2.jpg',
  ],
  ['Should You Specialize or Be a Generalist?', '/images/maxresdefault-3.jpg'],
  [
    'Life Is Short: How to Add a Sense of Urgency',
    '/images/maxresdefault-4.jpg',
  ],
  [
    'How to Use Your Phone… So That It Doesn’t Use You',
    '/images/maxresdefault-5.jpg',
  ],
];

const books = [
  [
    'The 4-Hour Workweek',
    '/images/book-4work.png',
    'Escape 9–5, live anywhere, and join the new rich.',
  ],
  [
    'The 4-Hour Body',
    '/images/book-4body.png',
    'An uncommon guide to rapid fat-loss, incredible sex, and becoming superhuman.',
  ],
  [
    'The 4-Hour Chef',
    '/images/book-4chef.png',
    'The simple path to cooking like a pro, learning anything, and living the good life.',
  ],
  [
    'Tools of Titans',
    '/images/book-titans.png',
    'The tactics, routines, and habits of billionaires, icons, and world-class performers.',
  ],
  [
    'Tribe of Mentors',
    '/images/book-tribe.png',
    'Short life advice from the best in the world.',
  ],
];

const companyLogos = [
  ['/images/uberlogo-1.png', 'Uber'],
  ['/images/shopify-logo.png', 'Shopify'],
  ['/images/duoliongoglogo.png', 'Duolingo'],
  ['/images/taskrabbitlogo.png', 'TaskRabbit'],
  ['/images/automatticlogo.png', 'Automattic'],
  ['/images/nextddoorlogo.png', 'Nextdoor'],
  ['/images/alibabalogo.png', 'Alibaba'],
  ['/images/spacexlogo.png', 'SpaceX'],
];

const pressLogos = [
  ['/images/nyt.png', 'New York Times'],
  ['/images/newsweek.png', 'Newsweek'],
  ['/images/mens-journal.png', 'Men’s Journal'],
  ['/images/wiredlogo.png', 'Wired'],
  ['/images/ntlogo.png', 'NT'],
  ['/images/ted-white.png', 'TED'],
];

async function main() {
  console.log(`Seeding Sanity project ${projectId}/${dataset}...`);

  const categoriesByTitle = new Map();
  for (const title of ['Entrepreneurship', 'Writing', 'Startups']) {
    const id = `category.${slugify(title)}`;
    await createOrReplace({
      _id: id,
      _type: 'category',
      title,
      slug: { _type: 'slug', current: slugify(title) },
    });
    categoriesByTitle.set(title, id);
  }

  const episodeRefs = [];
  let episodeNumber = 860;
  for (const [name, summary, imagePath] of featuredInterviews) {
    const id = `podcastEpisode.featured.${slugify(name)}`;
    await createOrReplace({
      _id: id,
      _type: 'podcastEpisode',
      title: name,
      slug: { _type: 'slug', current: slugify(name) },
      episodeNumber: episodeNumber++,
      summary,
      coverImage: await uploadImage(imagePath, `${name} illustration`),
      featured: true,
      body: richText(summary),
    });
    episodeRefs.push({ _type: 'reference', _ref: id, _key: id });
  }

  const recentEpisodeRefs = [];
  for (const [title, date, imagePath] of recentEpisodes) {
    const id = `podcastEpisode.${slugify(title).slice(0, 80)}`;
    await createOrReplace({
      _id: id,
      _type: 'podcastEpisode',
      title,
      slug: { _type: 'slug', current: slugify(title).slice(0, 96) },
      publishedAt: new Date(date).toISOString(),
      summary: title,
      coverImage: await uploadImage(imagePath, title),
      featured: false,
      body: richText(title),
    });
    recentEpisodeRefs.push({ _type: 'reference', _ref: id, _key: id });
  }

  const postRefs = [];
  for (const [title, category, excerpt] of recentPosts) {
    const id = `post.${slugify(title).slice(0, 80)}`;
    await createOrReplace({
      _id: id,
      _type: 'post',
      title,
      slug: { _type: 'slug', current: slugify(title).slice(0, 96) },
      excerpt,
      publishedAt: new Date().toISOString(),
      categories: [
        {
          _type: 'reference',
          _ref: categoriesByTitle.get(category),
          _key: category,
        },
      ],
      body: richText(excerpt),
      featured: true,
    });
    postRefs.push({ _type: 'reference', _ref: id, _key: id });
  }

  const videoRefs = [];
  for (const [title, imagePath] of videos) {
    const id = `video.${slugify(title)}`;
    await createOrReplace({
      _id: id,
      _type: 'video',
      title,
      slug: { _type: 'slug', current: slugify(title) },
      description: title,
      thumbnail: await uploadImage(imagePath, title),
      featured: true,
    });
    videoRefs.push({ _type: 'reference', _ref: id, _key: id });
  }

  const bookRefs = [];
  let order = 1;
  for (const [title, imagePath, description] of books) {
    const id = `book.${slugify(title)}`;
    await createOrReplace({
      _id: id,
      _type: 'book',
      title,
      slug: { _type: 'slug', current: slugify(title) },
      coverImage: await uploadImage(imagePath, title),
      description: richText(description),
      order: order++,
      featured: true,
    });
    bookRefs.push({ _type: 'reference', _ref: id, _key: id });
  }

  const companyLogoItems = [];
  for (const [imagePath, name] of companyLogos) {
    companyLogoItems.push({
      _key: slugify(name),
      _type: 'logoItem',
      name,
      image: await uploadImage(imagePath, name),
    });
  }

  const pressLogoItems = [];
  for (const [imagePath, name] of pressLogos) {
    pressLogoItems.push({
      _key: slugify(name),
      _type: 'logoItem',
      name,
      image: await uploadImage(imagePath, name),
    });
  }

  await createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteTitle: 'The Blog of Author Tim Ferriss',
    logoLight: await uploadImage('/images/logo.png', 'Site logo light'),
    logoDark: await uploadImage('/images/logo-dark.png', 'Site logo dark'),
    defaultSeo: {
      _type: 'seo',
      metaTitle: 'The Blog of Author Tim Ferriss',
      metaDescription: 'Tim Ferriss blog, podcast, books, videos, and essays.',
    },
  });

  await createOrReplace({
    _id: 'page.home',
    _type: 'page',
    title: 'Home',
    slug: { _type: 'slug', current: 'home' },
    seo: {
      _type: 'seo',
      metaTitle: 'The Blog of Author Tim Ferriss',
      metaDescription: 'Podcast, blog, books, and resources from Tim Ferriss.',
    },
    sections: [
      {
        _key: 'hero',
        _type: 'heroSection',
        variant: 'bookPromo',
        eyebrow: '4,000+ 5-Star Reviews',
        title: '4,000+ 5-Star Reviews, Top-10 Highlighted Book of All Time.',
        subtitle:
          'Get 175+ Free Pages from The 4-Hour Workweek, The 4-Hour Body, and The 4-Hour Chef.',
        richText: richText(
          'Download free chapters and weekly 5-Bullet Friday recommendations.',
        ),
        backgroundImage: await uploadImage(
          '/images/hero-bg2-1-scaled.jpg',
          'Hero background',
        ),
        foregroundImage: await uploadImage(
          '/images/tim-ferriss-4-hour-week-books-optmized.png',
          '4-Hour books bundle',
        ),
        primaryButton: {
          _type: 'button',
          label: 'Download Free Chapters',
          url: '#newsletter',
          variant: 'primary',
        },
        settings: {
          _type: 'sectionSettings',
          theme: 'dark',
          sectionId: 'hero',
        },
      },
      {
        _key: 'podcast-intro',
        _type: 'newsletterSection',
        eyebrow: 'The Tim Ferriss Show',
        title: 'The podcast trusted by one billion+ listeners.',
        subtitle:
          'The Tim Ferriss Show is one of the most popular podcasts in the world, with more than one billion downloads.',
        richText: richText(
          'Each episode deconstructs world-class performers to extract tactics, tools, and routines you can use.',
        ),
        image: await uploadImage(
          '/images/podcast-phone-optmized.png',
          'Podcast phone artwork',
        ),
        buttonLabel: 'Subscribe',
      },
      {
        _key: 'featured-interviews',
        _type: 'featuredInterviewsSection',
        eyebrow: 'Start here',
        title: 'Featured interviews',
        subtitle: 'A curated starting point for the best conversations.',
        episodes: episodeRefs,
        cta: {
          _type: 'button',
          label: 'Browse episodes',
          url: '/podcast',
          variant: 'link',
        },
        settings: { _type: 'sectionSettings', theme: 'dark' },
      },
      {
        _key: 'recent-episodes',
        _type: 'recentEpisodesSection',
        eyebrow: 'Recent episodes',
        title: 'Listen to the latest conversations',
        episodes: recentEpisodeRefs,
        source: 'manual',
        limit: 3,
      },
      {
        _key: 'recent-posts',
        _type: 'recentPostsSection',
        eyebrow: 'Explore more',
        title: 'Recent blog posts',
        posts: postRefs,
        source: 'manual',
        limit: 3,
      },
      {
        _key: 'popular-videos',
        _type: 'videoGridSection',
        eyebrow: 'Popular Tim Ferriss videos',
        title: 'Watch the best clips',
        videos: videoRefs,
        settings: { _type: 'sectionSettings', theme: 'dark' },
      },
      {
        _key: 'about',
        _type: 'aboutSection',
        eyebrow: 'About Tim Ferriss',
        title: '“A cross between Jack Welch and a Buddhist monk.”',
        subtitle:
          'Tim Ferriss is an author, investor, and host of The Tim Ferriss Show.',
        richText: richText(
          'Tim has been listed as one of Fast Company’s “Most Innovative Business People” and one of Fortune’s “40 under 40.” He is the author of five #1 New York Times and Wall Street Journal bestsellers.',
        ),
        image: await uploadImage(
          '/images/timabout.jpg',
          'Tim Ferriss portrait',
        ),
        logos: companyLogoItems,
      },
      {
        _key: 'press',
        _type: 'logoCloudSection',
        eyebrow: 'Featured and quoted in',
        title: 'As seen in',
        logos: pressLogoItems,
        settings: { _type: 'sectionSettings', theme: 'dark' },
      },
      {
        _key: 'books',
        _type: 'booksSection',
        eyebrow: '4,000+ 5-Star Reviews',
        title: 'Books by Tim Ferriss',
        books: bookRefs,
      },
      {
        _key: 'footer-cta',
        _type: 'ctaSection',
        title:
          'Download free chapters from The 4-Hour Workweek, the #1 New York Times bestseller.',
        richText: richText(
          'Free chapters of The 4-Hour Workweek, The 4-Hour Body, and The 4-Hour Chef. Plus 5-Bullet Friday: books, gadgets, and weekly productivity tips and tricks.',
        ),
        image: await uploadImage(
          '/images/Footer-CTA-1024x476.jpg',
          'Footer CTA background',
        ),
        buttons: [
          {
            _key: 'download',
            _type: 'button',
            label: 'Download Free Chapters',
            url: '#newsletter',
            variant: 'primary',
          },
        ],
        settings: { _type: 'sectionSettings', theme: 'dark' },
      },
    ],
  });

  console.log('\nDone. Open /studio and edit Page → Home (slug: home).');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
