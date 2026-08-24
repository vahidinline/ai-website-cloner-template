import type { SanityButton } from './types';

type Reference = NonNullable<SanityButton['internalLink']>;

export function resolveInternalUrl(reference?: Reference): string | undefined {
  const slug = reference?.slug?.current;
  if (!slug) return undefined;

  switch (reference._type) {
    case 'post': return `/blog/${slug}`;
    case 'podcastEpisode': return `/podcast/${slug}`;
    case 'video': return `/videos/${slug}`;
    case 'book': return `/books/${slug}`;
    case 'page': return slug === 'home' ? '/' : `/${slug}`;
    default: return undefined;
  }
}

export function resolveButtonUrl(button?: SanityButton): string | undefined {
  return button?.url || resolveInternalUrl(button?.internalLink);
}

export function absoluteUrl(path: string, baseUrl?: string): string {
  const base = baseUrl || process.env.NEXT_PUBLIC_SITE_URL;
  if (!base) return path;
  return new URL(path, base).toString();
}

/** Converts a YouTube watch/short/share URL into a privacy-enhanced embed URL. */
export function embedYouTubeUrl(url: string): string | undefined {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') return `https://www.youtube-nocookie.com/embed${parsed.pathname}`;
    if (host === 'youtube.com' || host === 'm.youtube.com' || host.endsWith('.youtube.com')) {
      if (parsed.pathname === '/watch' && typeof parsed.searchParams.get('v') === 'string') {
        return `https://www.youtube-nocookie.com/embed/${parsed.searchParams.get('v')}`;
      }
      if (parsed.pathname.startsWith('/embed/') || parsed.pathname.startsWith('/shorts/')) {
        const id = parsed.pathname.split('/')[2];
        return id ? `https://www.youtube-nocookie.com/embed/${id}` : undefined;
      }
    }
    return undefined;
  } catch {
    return undefined;
  }
}
