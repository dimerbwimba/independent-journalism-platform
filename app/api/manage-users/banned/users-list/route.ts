import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/options"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status')

    // Build where clause for search and status filter
    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } }
        ]
      }),
      ...(status && { status: status.toUpperCase() })
    }

    // Fetch users with search filter
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        status: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            violations: true,
            posts: true
          }
        },
        violations: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1,
          select: {
            type: true,
            description: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Format the response
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      status: user.status,
      role: user.role,
      createdAt: user.createdAt,
      stats: {
        violations: user._count.violations,
        posts: user._count.posts
      },
      lastViolation: user.violations[0] || null
    }))

    return NextResponse.json({
      users: formattedUsers,
      total: users.length
    })

  } catch (error) {
    console.error("Error fetching users list:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
} 