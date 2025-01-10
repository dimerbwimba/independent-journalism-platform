import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/options"
import prisma from "@/lib/prisma"

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const data = await req.json()

    const { title, country, content, description, image, published, faqs, categories, seoTitle } = data

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }
    if (!country) {
      return NextResponse.json({ error: "Country is required" }, { status: 400 })
    }
    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }
    if (!faqs || !Array.isArray(faqs) || faqs.length === 0) {
      return NextResponse.json({ error: "At least one FAQ is required" }, { status: 400 })
    }

    const baseSlug = generateSlug(title)
    let slug = baseSlug
    let counter = 1
    
    while (await prisma.post.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    const post = await prisma.post.create({
      data: {
        title,
        country,
        content,
        seoTitle,
        description,
        image,
        published,
        slug:generateSlug(seoTitle),
        authorId: session.user.id,
        status: published ? 'PENDING' : 'DRAFT',
        categories: categories ? {
          create: categories.map((id: string) => ({
            category: {
              connect: { id }
            }
          }))
        } : undefined
      }
    })

    if(faqs){
      await prisma.fAQ.createMany({
        data: faqs.map((faq: any) => ({ ...faq, postId: post.id }))
      })
    }
    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error("Post creation error:", error)
    return NextResponse.json(
      { error: "Failed to create post", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    // Get search query from URL
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Build the where clause for search
    const where = {
      authorId: session.user.id,
      OR: search ? [
        { title: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
        { content: { contains: search, mode: 'insensitive' as const } }
      ] : undefined
    }

    // Get posts with search and pagination
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          image: true,
          published: true,
          createdAt: true,
          slug: true,
          views: {
            select: {
              id: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.post.count({ where })
    ])

    // Format posts for response
    const formattedPosts = posts.map(post => ({
      
      ...post,
      views: post.views.length,
      createdAt: post.createdAt.toISOString()
    }))

    return NextResponse.json({
      posts: formattedPosts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error("Posts fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    )
  }
} 