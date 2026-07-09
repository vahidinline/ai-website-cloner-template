export type SanitySlug = {
  current: string;
};

export type SanityImage = {
  url?: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
};

export type SanityButton = {
  label?: string;
  url?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  openInNewTab?: boolean;
};

export type SanitySeo = {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: SanityImage;
  canonicalUrl?: string;
  noIndex?: boolean;
};

export type SanitySection = {
  _type: string;
  _key?: string;
  title?: string;
  eyebrow?: string;
  subtitle?: string;
  richText?: unknown[];
  content?: unknown[];
  settings?: Record<string, unknown>;
};

export type SanityPage = {
  _id: string;
  title: string;
  slug: SanitySlug;
  seo?: SanitySeo;
  sections?: SanitySection[];
};
