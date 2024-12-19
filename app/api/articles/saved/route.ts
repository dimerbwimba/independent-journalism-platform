import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/options"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const savedArticles = await prisma.savedArticle.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            description: true,
            slug: true,
            image: true,
            createdAt: true,
            author: {
              select: {
                name: true,
                image: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Format the response
    const formattedArticles = savedArticles.map(article => ({
      id: article.id,
      createdAt: article.createdAt.toISOString(),
      post: {
        id: article.post.id,
        title: article.post.title,
        description: article.post.description || '',
        slug: article.post.slug,
        image: article.post.image,
        createdAt: article.post.createdAt.toISOString(),
        author: {
          name: article.post.author.name,
          image: article.post.author.image
        }
      }
    }))

    return NextResponse.json({
      savedArticles: formattedArticles
    })
  } catch (error) {
    console.error("Error fetching saved articles:", error)
    return NextResponse.json(
      { error: "Failed to fetch saved articles" },
      { status: 500 }
    )
  }
} 