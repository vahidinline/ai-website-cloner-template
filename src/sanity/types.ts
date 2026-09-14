export type SanitySlug = {
  current: string;
};

export type SanityImage = {
  url?: string;
  alt?: string;
  caption?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
  width?: number;
  height?: number;
};

export type SanityButton = {
  _key?: string;
  label?: string;
  url?: string;
  internalLink?: { _type?: string; _ref?: string; slug?: SanitySlug };
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  openInNewTab?: boolean;
  icon?: 'linkedin' | 'telegram' | 'x' | 'youtube' | 'instagram';
};

export type SanityNavigationItem = {
  _key?: string;
  label?: string;
  url?: string;
  internalLink?: { _type?: string; _ref?: string; slug?: SanitySlug };
  openInNewTab?: boolean;
};

export type SanityNavigationMenu = {
  _id?: string;
  title?: string;
  items?: SanityNavigationItem[];
};

export type SanitySiteSettings = {
  siteTitle?: string;
  siteUrl?: string;
  defaultLanguage?: string;
  direction?: 'ltr' | 'rtl';
  manifestName?: string;
  themeColor?: string;
  favicon?: SanityImage;
  appleTouchIcon?: SanityImage;
  androidIcons?: SanityImage[];
  robots?: { allowIndexing?: boolean; disallowPaths?: string[]; sitemapEnabled?: boolean };
  structuredData?: {
    type?: string;
    id?: string;
    name?: string;
    alternateName?: string[];
    inLanguage?: string[];
    url?: string;
    description?: string;
    jobTitle?: string[];
    knowsAbout?: string[];
    image?: SanityImage;
    profileImageUrl?: string;
    sameAs?: string[];
    subjectOf?: Array<{ type?: string; headline?: string; url?: string; publisherName?: string; publisherUrl?: string }>;
    organizations?: Array<{ name?: string; url?: string; sameAs?: string[] }>;
  };
  header?: { enabled?: boolean; navigationMenu?: SanityNavigationMenu; searchLabel?: string; action?: SanityButton };
  logoLight?: SanityImage;
  logoDark?: SanityImage;
  mainNavigation?: SanityButton[];
  footerNavigation?: SanityButton[];
  socialLinks?: SanityButton[];
  footerCopyright?: string;
  affiliateDisclosure?: string;
  defaultSeo?: SanitySeo;
  footer?: {
    enabled?: boolean;
    logo?: SanityImage;
    copyright?: string;
    columns?: Array<{ title?: string; links?: SanityButton[] }>;
    socialLinks?: SanityButton[];
    affiliateDisclosure?: string;
  };
  footerCta?: SanitySection & { buttons?: SanityButton[] };
};

export type SanitySeo = {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: SanityImage;
  canonicalUrl?: string;
  languageAlternates?: Array<{ language?: string; url?: string }>;
  isProfilePage?: boolean;
  noIndex?: boolean;
};

export type SanitySectionSettings = {
  sectionId?: string;
  anchorLabel?: string;
  isHidden?: boolean;
  theme?: 'default' | 'light' | 'dark' | 'brand' | 'custom';
  backgroundColorToken?: string;
  backgroundColor?: string;
  textColorToken?: string;
  textColor?: string;
  backgroundImage?: SanityImage;
  overlayColor?: string;
  overlayOpacity?: number;
  paddingTop?: string;
  paddingBottom?: string;
  marginTop?: string;
  marginBottom?: string;
  containerWidth?: string;
  customClassName?: string;
};

export type SanityStatItem = {
  _key?: string;
  value?: string;
  label?: string;
};

export type SanityFaqItem = {
  _key?: string;
  question?: string;
  answer?: unknown[];
};

export type SanityEmbed = {
  title?: string;
  url?: string;
  embedCode?: string;
  aspectRatio?: string;
};

export type SanityCardItem = {
  _key?: string;
  icon?: string;
  image?: SanityImage;
  title?: string;
  description?: string;
  link?: SanityButton;
};

export type SanityLogoItem = {
  _key?: string;
  name?: string;
  image?: SanityImage;
  url?: string;
};

export type SanitySection = {
  _type: string;
  _key?: string;
  headingLevel?: 'h1' | 'h2' | 'h3';
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  variant?: string;
  richText?: unknown[];
  content?: unknown[];
  settings?: SanitySectionSettings;
  /* Shared / optional per-section fields */
  layout?: string;
  limit?: number;
  columns?: number;
  itemsPerRow?: number;
  alignment?: string;
  height?: string;
  maxWidth?: string;
  image?: SanityImage;
  backgroundImage?: SanityImage;
  foregroundImage?: SanityImage;
  images?: SanityImage[];
  primaryButton?: SanityButton;
  secondaryButton?: SanityButton;
  cta?: SanityButton;
  buttons?: SanityButton[];
  cards?: SanityCardItem[];
  logos?: SanityLogoItem[];
  stats?: SanityStatItem[];
  items?: SanityFaqItem[];
  embed?: SanityEmbed;
  emailPlaceholder?: string;
  successMessage?: string;
  privacyText?: unknown[];
  buttonLabel?: string;
  showPlayOverlay?: boolean;
  lightboxEnabled?: boolean;
  books?: ReferencedBook[];
  posts?: ReferencedPost[];
  episodes?: ReferencedEpisode[];
  videos?: ReferencedVideo[];
};

export type ReferencedPost = {
  _id?: string;
  _key?: string;
  title?: string;
  excerpt?: string;
  publishedAt?: string;
  slug?: SanitySlug;
  mainImage?: SanityImage;
};

export type ReferencedEpisode = {
  _id?: string;
  _key?: string;
  name?: string;
  title?: string;
  summary?: string;
  episodeNumber?: number;
  publishedAt?: string;
  slug?: SanitySlug;
  coverImage?: SanityImage;
};

export type ReferencedVideo = {
  _id?: string;
  _key?: string;
  title?: string;
  description?: string;
  youtubeUrl?: string;
  publishedAt?: string;
  slug?: SanitySlug;
  thumbnail?: SanityImage;
};

export type ReferencedBook = {
  _id?: string;
  _key?: string;
  title?: string;
  description?: unknown[];
  slug?: SanitySlug;
  order?: number;
  coverImage?: SanityImage;
  buyLinks?: Array<{ _key?: string; label?: string; url?: string }>;
};

export type SanityPage = {
  _id: string;
  title: string;
  slug: SanitySlug;
  status?: 'draft' | 'published';
  seo?: SanitySeo;
  sections?: SanitySection[];
};

export type SanityArchivePageSettings = {
  archiveType: 'blog' | 'podcast' | 'videos' | 'books';
  eyebrow?: string;
  title?: string;
  introduction?: string;
  emptyState?: string;
  ordering?: 'publishedAtDesc' | 'publishedAtAsc' | 'titleAsc' | 'manual';
  itemsPerPage?: number;
  seo?: SanitySeo;
};

export type SanityRedirect = {
  sourcePath: string;
  destinationUrl?: string;
  destinationInternal?: { _type?: string; slug?: SanitySlug };
  statusCode?: 301 | 302 | 307 | 308 | 410;
  enabled?: boolean;
  expiresAt?: string;
  notes?: string;
};
