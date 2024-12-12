import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourplatform.com'

  // Get all published posts with images
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      image: {
        not: null
      }
    },
    select: {
      slug: true,
      title: true,
      image: true,
      createdAt: true,
    },
  })

  // Get all categories with images
  const categories = await prisma.category.findMany({
    where: {
      image: {
        not: null
      }
    },
    select: {
      slug: true,
      name: true,
      image: true,
    },
  })

  // Get all users with profile images
  const users = await prisma.user.findMany({
    where: {
      image: {
        not: null
      },
      posts: {
        some: {
          published: true
        }
      }
    },
    select: {
      id: true,
      name: true,
      image: true,
    },
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
      
      <!-- Post Images -->
      ${posts.map(post => `
        <url>
          <loc>${baseUrl}/article/${post.slug}</loc>
          <image:image>
            <image:loc>${post.image}</image:loc>
            <image:title>${post.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</image:title>
            <image:caption>Featured image for ${post.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</image:caption>
          </image:image>
        </url>
      `).join('')}

      <!-- Category Images -->
      ${categories.map(category => `
        <url>
          <loc>${baseUrl}/categories/${category.slug}</loc>
          <image:image>
            <image:loc>${category.image}</image:loc>
            <image:title>${category.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')} Category</image:title>
            <image:caption>Category image for ${category.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</image:caption>
          </image:image>
        </url>
      `).join('')}

      <!-- Author Profile Images -->
      ${users.map(user => `
        <url>
          <loc>${baseUrl}/authors/${user.id}</loc>
          <image:image>
            <image:loc>${user.image}</image:loc>
            <image:title>${user.name?.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}'s Profile</image:title>
            <image:caption>Profile picture of ${user.name?.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</image:caption>
          </image:image>
        </url>
      `).join('')}

      <!-- Static Images -->
      <url>
        <loc>${baseUrl}</loc>
        <image:image>
          <image:loc>${baseUrl}/logo.png</image:loc>
          <image:title>Independent Journalism Platform Logo</image:title>
          <image:caption>Official logo of Independent Journalism Platform</image:caption>
        </image:image>
      </url>
    </urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
} 