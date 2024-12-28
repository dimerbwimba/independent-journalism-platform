import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        posts: {
          include: {
            post: {
              select: {
                status: true
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    const formattedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      postCount: category.posts.filter(cp => cp.post.status === 'APPROVED').length
    }))

    return NextResponse.json({
      categories: formattedCategories
    })
  } catch (error) {
    console.error("Categories fetch error:", error)
    return NextResponse.json({
      categories: [],
      error: "Failed to fetch categories"
    }, { status: 500 })
  }
} 