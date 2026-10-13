import type { MetadataRoute } from 'next';

// Development content must not be indexed until approved production publication.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', disallow: '/' } };
}
