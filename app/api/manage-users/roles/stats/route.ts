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

    // Get total users count
    const totalUsers = await prisma.user.count()

    // Get role distribution
    const roleDistribution = await prisma.user.groupBy({
      by: ['role'],
      _count: true
    })

    // Format role distribution with percentages
    const formattedDistribution = roleDistribution.map(role => ({
      role: role.role || 'user',
      count: role._count,
      percentage: (role._count / totalUsers) * 100
    }))

    // Get recent role changes (from audit log)
    const recentChanges = await prisma.user.findMany({
      where: {
        role: {
          not: 'user'
        }
      },
      select: {
        id: true,
        name: true,
        role: true,
        updatedAt: true
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 10
    })

    // Format recent changes
    const formattedChanges = recentChanges.map(user => ({
      id: user.id,
      userId: user.id,
      userName: user.name || 'Unknown User',
      previousRole: 'user',
      newRole: user.role || 'user',
      changedAt: user.updatedAt.toISOString()
    }))

    return NextResponse.json({
      totalUsers,
      roleDistribution: formattedDistribution,
      recentChanges: formattedChanges
    })
  } catch (error) {
    console.error("Error fetching role statistics:", error)
    return NextResponse.json(
      { error: "Failed to fetch role statistics" },
      { status: 500 }
    )
  }
} 