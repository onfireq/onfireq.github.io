import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/blog/editor/'],
    },
    sitemap: 'https://onfireq.github.io/sitemap.xml',
    host: 'https://onfireq.github.io',
  };
}
