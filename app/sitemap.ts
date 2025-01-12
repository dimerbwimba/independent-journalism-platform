import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'
import { countries } from '@/data/countries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all published posts
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  // Get all categories
  const categories = await prisma.category.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  // Get all authors (users who have published content)
  const authors = await prisma.user.findMany({
    where: {
      posts: {
        some: {
          published: true,
        },
      },
    },
    select: {
      id: true,
      updatedAt: true,
    },
  })

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourplatform.com'

  // Static routes
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/monetization`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ] as MetadataRoute.Sitemap

  // Dynamic routes for posts
  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/article/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Dynamic routes for categories
  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  // Dynamic routes for authors
  const authorRoutes = authors.map((author) => ({
    url: `${baseUrl}/author/${author.id}`,
    lastModified: author.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))
  
  const countryRoutes = countries.filter(country => country.status === 'active').map((country) => ({
    url: `${baseUrl}/travel-accomodation/${country.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  const countryLocationRoutes = await Promise.all(
    countries
      .filter(country => country.status === 'active')
      .map(async (country) => {
        const countryData = await import(`@/data/${country.slug.toLowerCase().replace(/-/g, "_")}_data.json`);
        const countryKey = country.slug.toLowerCase().replace(/-/g, "_");
        const regionData = countryData[countryKey];

        return regionData.region_hotels.map((location:{name:string}) => ({
          url: `${baseUrl}/travel-accomodation/${country.slug}/${location.name.toLowerCase().replace(/\s+/g, '-')}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        }));
      })
  ).then(arrays => arrays.flat());

  const resortRoutes = await Promise.all(
    countries
      .filter(country => country.status === 'active')
      .map(async (country) => {
        const countryData = await import(`@/data/${country.slug.toLowerCase().replace(/-/g, "_")}_data.json`);
        const countryKey = country.slug.toLowerCase().replace(/-/g, "_");
        const regionData = countryData[countryKey];

        return regionData.all_inclusive_resorts.map((resort:{title:string}) => ({
          url: `${baseUrl}/travel-accomodation/${country.slug}/resort/${resort.title.toLowerCase().replace(/\s+/g, '-')}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        }));
      })
  ).then(arrays => arrays.flat());

  const topBestResortForACountry= countries.filter(country => country.status === 'active').map((country) => ({
    url: `${baseUrl}/travel-accomodation/${country.slug}/resort/top-best`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  const allRoutes = [
    ...staticRoutes, 
    ...postRoutes, 
    ...categoryRoutes, 
    ...authorRoutes, 
    ...countryRoutes, 
    ...countryLocationRoutes,
    ...resortRoutes,
    ...topBestResortForACountry
  ]

  return allRoutes
} 