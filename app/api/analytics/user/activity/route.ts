import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/options"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(req.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const dateFilter = startDate && endDate ? {
      createdAt: {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    } : {}

    // Get recent posts with engagement metrics
    const recentEngagement = await prisma.post.findMany({
      where: {
        authorId: session.user.id,
        ...dateFilter
      },
      select: {
        title: true,
        slug: true,
        createdAt: true,
        views: true,
        reactions: true,
        comments: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10 // Limit to 10 most recent posts
    })

    return NextResponse.json({
      recentEngagement: recentEngagement.map(post => ({
        title: post.title,
        slug: post.slug,
        createdAt: post.createdAt,
        _count: {
          views: post.views.length,
          reactions: post.reactions.length,
          comments: post.comments.length
        }
      }))
    })
  } catch (error) {
    console.error("Activity fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    )
  }
} 