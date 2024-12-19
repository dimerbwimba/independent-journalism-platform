import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/options"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.role?.includes('admin')) {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 401 }
      )
    }

    // Get total categories count
    const totalCategories = await prisma.category.count()

    // Get posts without categories
    const uncategorizedPosts = await prisma.post.count({
      where: {
        categories: {
          none: {}
        }
      }
    })

    // Get categories with post counts
    const categoriesWithCounts = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    })

    // Calculate total posts across all categories
    const totalPosts = categoriesWithCounts.reduce(
      (sum, cat) => sum + cat._count.posts, 
      0
    )

    // Format top categories with percentages
    const topCategories = categoriesWithCounts
      .map(cat => ({
        name: cat.name,
        postCount: cat._count.posts,
        percentage: totalPosts > 0 
          ? Math.round((cat._count.posts / totalPosts) * 100) 
          : 0
      }))
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, 5)

    return NextResponse.json({
      totalCategories,
      uncategorizedPosts,
      topCategories
    })
  } catch (error) {
    console.error("Category stats fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch category statistics" },
      { status: 500 }
    )
  }
} 