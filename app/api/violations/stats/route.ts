import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/options"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 })
    }

    // Get violation counts
    const [totalViolations, activeViolations, resolvedViolations] = await Promise.all([
      prisma.violation.count(),
      prisma.violation.count({
        where: { status: 'PENDING' }
      }),
      prisma.violation.count({
        where: { status: 'RESOLVED' }
      })
    ])

    // Get violation types
    const violationTypes = await prisma.violation.groupBy({
      by: ['type'],
      _count: true,
      orderBy: {
        _count: {
          type: 'desc'
        }
      },
      take: 5
    })

    // Get recent violations
    const recentViolations = await prisma.violation.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        type: true,
        severity: true,
        description: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      totalViolations,
      activeViolations,
      resolvedViolations,
      violationsByType: violationTypes.map(v => ({
        type: v.type,
        count: v._count
      })),
      recentViolations
    })
  } catch (error) {
    console.error("Error fetching violation stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    )
  }
} 