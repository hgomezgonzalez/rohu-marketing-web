import type { MetadataRoute } from 'next';
import { getLiveApplicationSlugs } from '@/lib/applications';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/privacidad`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terminos`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const applicationRoutes: MetadataRoute.Sitemap = getLiveApplicationSlugs().map((slug) => ({
    url: `${baseUrl}/productos/${slug}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  return [...staticRoutes, ...applicationRoutes];
}
