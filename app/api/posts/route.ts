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

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const { title, seoTitle, description, content, published, categories, image } = await req.json()

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      )
    }

    // Generate slug from seoTitle or title
    const baseSlug = generateSlug(seoTitle || title)
    
    // Check if slug exists and generate a unique one if needed
    let slug = baseSlug
    let counter = 1
    let slugExists = true

    // Use a do-while loop instead of while(true)
    do {
      const existingPost = await prisma.post.findFirst({
        where: { slug }
      })
      
      if (!existingPost) {
        slugExists = false
      } else {
        slug = `${baseSlug}-${counter}`
        counter++
      }
    } while (slugExists && counter < 3) // Add a reasonable limit

    // If we couldn't generate a unique slug after 100 tries, return an error
    if (slugExists) {
      return NextResponse.json(
        { error: "Could not generate unique slug" },
        { status: 400 }
      )
    }

    const post = await prisma.post.create({
      data: {
        title,
        seoTitle,
        description,
        content,
        slug,
        published,
        image,
        authorId: session.user.id,
        categories: {
          create: categories.map((id: string) => ({
            category: {
              connect: { id }
            }
          }))
        }
      }
    })

    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error("Post creation error:", error)
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    // Get pagination parameters from URL
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Get total count for pagination
    const total = await prisma.post.count({
      where: {
        authorId: session.user.id,
      },
    })

    // Get paginated posts
    const posts = await prisma.post.findMany({
      where: {
        authorId: session.user.id,
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    })

    const formattedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      seoTitle: post.seoTitle,
      description: post.description,
      image: post.image,
      published: post.published,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      categories: post.categories.map(pc => ({
        id: pc.category.id,
        name: pc.category.name,
        slug: pc.category.slug,
      })),
    }))

    return NextResponse.json({
      success: true,
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
    return NextResponse.json({
      success: false,
      error: "Failed to fetch posts",
      posts: []
    })
  }
} 