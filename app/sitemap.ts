import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const routes = [
    { url: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { url: '/features', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/pricing', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/features/save-to-memory', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/features/personality-modes', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/features/limitless-reminder', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/features/apps-integration', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/about-us', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/privacy-policy', priority: 0.4, changeFrequency: 'yearly' as const },
    { url: '/terms', priority: 0.4, changeFrequency: 'yearly' as const },
    { url: '/gdpr', priority: 0.4, changeFrequency: 'yearly' as const },
  ].map(({ url, priority, changeFrequency }) => ({
    url: `${baseUrl}${url}`,
    lastModified: new Date().toISOString(),
    changeFrequency,
    priority,
  }));

  return [...routes];
}
