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

    const bannedUsers = await prisma.user.findMany({
      where: {
        status: 'BANNED'
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        violations: {
          select: {
            id: true,
            type: true,
            description: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    const formattedUsers = bannedUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      bannedAt: user.violations[0]?.createdAt,
      reason: user.violations[0]?.description || 'Multiple violations',
      violations: user.violations.length
    }))

    return NextResponse.json({ users: formattedUsers })
  } catch (error) {
    console.error("Error fetching banned users:", error)
    return NextResponse.json(
      { error: "Failed to fetch banned users" },
      { status: 500 }
    )
  }
} 