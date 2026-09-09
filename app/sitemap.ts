export const dynamic = 'force-dynamic';
import { MetadataRoute } from 'next';
import { repository } from '@/lib/data/repository';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tanmiyatrealestate.com';
  const projects = await repository.getProjects();
  const news = await repository.getNews();

  const projectUrls: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${baseUrl}/developments/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const newsUrls: MetadataRoute.Sitemap = news.map((n) => ({
    url: `${baseUrl}/news/${n.slug}`,
    lastModified: new Date(n.publishedDate),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/developments`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  return [...staticUrls, ...projectUrls, ...newsUrls];
}
