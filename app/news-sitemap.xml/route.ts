import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourplatform.com'

  // Get all published posts from the last 48 hours
  const recentPosts = await prisma.post.findMany({
    where: {
      published: true,
      createdAt: {
        gte: new Date(Date.now() - 48 * 60 * 60 * 1000),
      },
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
      categories: {
        include: {
          category: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
console.log(recentPosts)
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
      ${recentPosts
        .map(
          (post) => `
        <url>
          <loc>${baseUrl}/article/${post.slug}</loc>
          <news:news>
            <news:publication>
              <news:name>Independent Travel Blog</news:name>
              <news:language>en</news:language>
            </news:publication>
            <news:publication_date>${post.createdAt.toISOString()}</news:publication_date>
            <news:title>${post.title}</news:title>
            <news:keywords>${post.categories
              .map((pc) => pc.category.name)
              .join(',')}</news:keywords>
          </news:news>
        </url>
      `
        )
        .join('')}
    </urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
} 