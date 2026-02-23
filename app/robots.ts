import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // Use the environment variable for the base URL, or fallback to a default
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        // Disallow crawling of all API routes
        '/api/',
        
        // Disallow crawling of authenticated dashboard areas
        '/dashboard/',
        
        // Disallow crawling of authentication flows
        '/login',
        '/register',
        '/forgot-pin',
        '/reset-pin',
        '/logout',
        
        // Disallow crawling of Next.js internal data fetching routes
        '/_next/data/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
