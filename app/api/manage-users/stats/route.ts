import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/options"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is admin
    if (!session?.user?.role?.includes('admin')) {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 401 }
      )
    }

    // Get total users count
    const totalUsers = await prisma.user.count()

    // Get banned users count
    const bannedUsers = await prisma.user.count({
      where: {
        status: 'BANNED'
      }
    })

    // Get pending moderation items count (posts + comments)
    const [ pendingReports] = await Promise.all([
      prisma.report.count({
        where: {
          status: 'PENDING'
        }
      })
    ])

    const pendingModeration =  pendingReports

    // Get active violations count
    const activeViolations = await prisma.violation.count({
      where: {
        status: {
          in: ['PENDING', 'APPEALED']
        }
      }
    })



    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        bannedUsers,
        pendingModeration,
        activeViolations,
      }
    })

  } catch (error) {
    console.error("Stats fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch management stats" },
      { status: 500 }
    )
  }
} 