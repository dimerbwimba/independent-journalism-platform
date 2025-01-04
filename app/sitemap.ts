import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

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
    url: `${baseUrl}/authors/${author.id}`,
    lastModified: author.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  

  return [...staticRoutes, ...postRoutes, ...categoryRoutes, ...authorRoutes]
} 