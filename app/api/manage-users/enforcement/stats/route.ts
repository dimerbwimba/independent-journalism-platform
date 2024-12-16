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

    // Get total violations
    const totalViolations = await prisma.violation.count()

    // Get active warnings
    const activeWarnings = await prisma.violation.count({
      where: {
        status: 'PENDING',
        severity: 'WARNING'
      }
    })

    // Get pending reviews
    const pendingReviews = await prisma.violation.count({
      where: {
        status: 'PENDING',
        NOT: {
          severity: 'WARNING'
        }
      }
    })

    // Get recent enforcement actions
    const recentActions = await prisma.violation.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        type: true,
        description: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    })

    return NextResponse.json({
      totalViolations,
      activeWarnings,
      pendingReviews,
      recentActions: recentActions.map(action => ({
        id: action.id,
        type: action.type,
        description: action.description,
        createdAt: action.createdAt,
        user: {
          name: action.user.name,
          email: action.user.email
        }
      }))
    })
  } catch (error) {
    console.error("Error fetching enforcement stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch enforcement statistics" },
      { status: 500 }
    )
  }
} 