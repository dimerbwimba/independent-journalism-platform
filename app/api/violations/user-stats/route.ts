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

    const [activeViolations, resolvedViolations, violationHistory] = await Promise.all([
      prisma.violation.count({
        where: {
          userId: session.user.id,
          status: 'PENDING'
        }
      }),
      prisma.violation.count({
        where: {
          userId: session.user.id,
          status: 'RESOLVED'
        }
      }),
      prisma.violation.findMany({
        where: {
          userId: session.user.id
        },
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          type: true,
          severity: true,
          description: true,
          status: true,
          createdAt: true
        }
      })
    ])

    // Calculate risk level and warning message
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW'
    let warningMessage: string | undefined

    if (activeViolations >= 2) {
      riskLevel = 'HIGH'
      warningMessage = 'Warning: Your account is at risk of being banned. One more violation will result in an automatic ban.'
    } else if (activeViolations === 1) {
      riskLevel = 'MEDIUM'
      warningMessage = 'Please be careful: You have one active violation.'
    }

    return NextResponse.json({
      activeViolations,
      resolvedViolations,
      violationHistory,
      riskLevel,
      warningMessage
    })
  } catch (error) {
    console.error("Error fetching user violations:", error)
    return NextResponse.json(
      { error: "Failed to fetch violations" },
      { status: 500 }
    )
  }
} 