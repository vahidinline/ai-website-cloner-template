import Image from 'next/image';
import type { SanityImage as SanityImageType } from '@/sanity/types';

type SanityImageProps = {
  image?: SanityImageType;
  alt?: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
  /** Used when Sanity reports no intrinsic dimensions for the asset. */
  fallbackWidth?: number;
  fallbackHeight?: number;
};

/**
 * Renders a Sanity image through next/image. The Sanity CDN host is allowed in
 * next.config.ts, and the GROQ projections include asset->metadata.dimensions
 * so intrinsic sizes are available for aspect-ratio reservation.
 */
export function SanityImage({
  image,
  alt,
  sizes,
  className,
  priority = false,
  fallbackWidth = 1600,
  fallbackHeight = 900,
}: SanityImageProps) {
  if (!image?.url) return null;

  const width = image.width && image.width > 0 ? Math.round(image.width) : undefined;
  const height = image.height && image.height > 0 ? Math.round(image.height) : undefined;

  if (width && height) {
    return (
      <Image
        src={image.url}
        alt={alt ?? image.alt ?? ''}
        width={width}
        height={height}
        sizes={sizes}
        className={className}
        priority={priority}
      />
    );
  }

  return (
    <Image
      src={image.url}
      alt={alt ?? image.alt ?? ''}
      width={fallbackWidth}
      height={fallbackHeight}
      sizes={sizes}
      className={className}
      priority={priority}
    />
  );
}
