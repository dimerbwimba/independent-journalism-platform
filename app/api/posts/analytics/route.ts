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

    // Get date range for views over time (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Format date to start of day
    thirtyDaysAgo.setHours(0, 0, 0, 0)

    const [
      totalPosts,
      totalViews,
      totalComments,
      totalShares,
      totalReactions,
      topPosts
    ] = await Promise.all([
      // Get total posts count
      prisma.post.count({
        where: { authorId: session.user.id }
      }),

      // Get total views count
      prisma.postView.count({
        where: {
          post: { authorId: session.user.id }
        }
      }),

      // Get total comments count
      prisma.comment.count({
        where: {
          post: { authorId: session.user.id }
        }
      }),

      // Get total shares count
      prisma.postShare.count({
        where: {
          post: { authorId: session.user.id }
        }
      }),

      // Get total reactions count
      prisma.postReaction.count({
        where: {
          post: { authorId: session.user.id }
        }
      }),

      // Get top performing posts
      
      prisma.post.findMany({
        where: { authorId: session.user.id },
        select: {
          id: true,
          title: true,
          slug: true,
          _count: {
            select: {
              views: true,
              comments: true,
              shares: true,
              reactions: true
            }
          }
        },
        orderBy: {
          views: { _count: 'desc' }
        },
        take: 5
      })
    ])

    // Get views over time
    const viewsOverTime = await prisma.postView.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: thirtyDaysAgo },
        post: { authorId: session.user.id }
      },
      _count: {
        _all: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Fill in missing dates with zero views
    const filledViewsOverTime = []
    const currentDate = new Date(thirtyDaysAgo)
    const endDate = new Date()

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0]
      const existingData = viewsOverTime.find(
        (item) => item.createdAt.toISOString().split('T')[0] === dateStr
      )
      
      filledViewsOverTime.push({
        date: dateStr,
        count: existingData ? existingData._count._all : 0
      })

      currentDate.setDate(currentDate.getDate() + 1)
    }

    return NextResponse.json({
      totalPosts,
      totalViews,
      totalComments,
      totalShares,
      totalReactions,
      viewsOverTime: filledViewsOverTime,
      topPosts: topPosts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        views: post._count.views,
        comments: post._count.comments,
        shares: post._count.shares,
        reactions: post._count.reactions
      }))
    })
  } catch (error) {
    console.error("Analytics fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    )
  }
} 