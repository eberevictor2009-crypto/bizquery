// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/analytics'], // Keep your private pages hidden
    },
    sitemap: 'https://bizquery.com/sitemap.xml',
  };
}