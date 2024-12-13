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

    if (!session?.user?.role?.includes('admin')) {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 401 }
      )
    }

    const dateFilter = startDate && endDate ? {
      createdAt: {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    } : {}

    // Get total views with date filter
    const totalViews = await prisma.postView.count({
      where: dateFilter
    })

    // Get total reactions with date filter
    const totalReactions = await prisma.postReaction.count({
      where: dateFilter
    })

    // Get total shares with date filter
    const totalShares = await prisma.postShare.count({
      where: dateFilter
    })

    // Get total comments with date filter
    const totalComments = await prisma.comment.count({
      where: dateFilter
    })

    // Get total users (only filter if dates are provided)
    const totalUsers = await prisma.user.count({
      where: startDate && endDate ? {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      } : {}
    })

    // Get total posts with date filter
    const totalPosts = await prisma.post.count({
      where: {
        published: true,
        ...dateFilter
      }
    })

    // Get views by country with date filter
    const viewsByCountry = await prisma.postView.groupBy({
      by: ['country'],
      _count: true,
      where: {
        country: { not: null },
        ...dateFilter
      }
    })

    // Get daily views for the period
    const dailyViews = await prisma.postView.groupBy({
      by: ['createdAt'],
      _count: true,
      where: dateFilter,
      orderBy: {
        createdAt: 'asc'
      }
    })

    return NextResponse.json({
      totalViews,
      totalReactions,
      totalShares,
      totalComments,
      totalUsers,
      totalPosts,
      viewsByCountry: Object.fromEntries(
        viewsByCountry.map(({ country, _count }) => [country, _count])
      ),
      recentViews: dailyViews.map(({ createdAt, _count }) => ({
        date: createdAt,
        count: _count
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