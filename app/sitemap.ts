// app/sitemap.ts
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://bizquery.com', lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: 'https://bizquery.com/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://bizquery.com/contact', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://bizquery.com/privacy-policy', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
  ];
}