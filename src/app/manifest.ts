import type { MetadataRoute } from 'next';
import { getSiteSettings } from '@/sanity/queries';
import type { SanitySiteSettings } from '@/sanity/types';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSiteSettings() as SanitySiteSettings | null;
  return { name: settings?.manifestName || settings?.siteTitle || '', short_name: settings?.siteTitle || '', start_url: '/', display: 'standalone', background_color: settings?.themeColor, theme_color: settings?.themeColor, icons: (settings?.androidIcons || []).flatMap((icon) => icon.url ? [{ src: icon.url, sizes: icon.width && icon.height ? `${icon.width}x${icon.height}` : undefined }] : []) };
}
