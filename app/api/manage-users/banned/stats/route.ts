import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/options"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 })
    }

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Get total banned users
    const totalBanned = await prisma.user.count({
      where: { status: 'BANNED' }
    })

    // Get recent bans (last 30 days)
    const recentBans = await prisma.violation.count({
      where: {
        type: 'BAN',
        createdAt: { gte: thirtyDaysAgo }
      }
    })

    // Get average violations per banned user
    const violationsData = await prisma.violation.groupBy({
      by: ['userId'],
      where: {
        user: { status: 'BANNED' }
      },
      _count: true
    })

    const averageViolations = violationsData.length > 0
      ? violationsData.reduce((acc, curr) => acc + curr._count, 0) / violationsData.length
      : 0

    // Get top violation types
    const violationTypes = await prisma.violation.groupBy({
      by: ['type'],
      where: {
        user: { status: 'BANNED' }
      },
      _count: true,
      orderBy: {
        _count: {
          type: 'desc'
        }
      },
      take: 5
    })

    // Get bans by timeframe
    const timeframes = [
      { name: 'Last 7 days', days: 7 },
      { name: 'Last 30 days', days: 30 },
      { name: 'Last 90 days', days: 90 }
    ]

    const bansByTimeframe = await Promise.all(
      timeframes.map(async ({ name, days }) => {
        const date = new Date()
        date.setDate(date.getDate() - days)
        
        const count = await prisma.violation.count({
          where: {
            type: 'BAN',
            createdAt: { gte: date }
          }
        })

        return { timeframe: name, count }
      })
    )

    return NextResponse.json({
      totalBanned,
      recentBans,
      averageViolations: Number(averageViolations.toFixed(1)),
      topViolationTypes: violationTypes.map(v => ({
        type: v.type,
        count: v._count
      })),
      bansByTimeframe
    })
  } catch (error) {
    console.error("Error fetching ban statistics:", error)
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    )
  }
} 