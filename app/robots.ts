import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/tales-and-choices', disallow: '/tales-and-choices/api/' },
    sitemap: 'https://www.avivo.dev/tales-and-choices/sitemap.xml',
  };
}
