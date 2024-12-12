import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourplatform.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/dashboard/',
        '/auth/',
        '/manage-users/',
        '/_next/',
        '/private/',
        '/*.json$',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
} 