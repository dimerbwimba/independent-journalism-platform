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

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')
    const risk = searchParams.get('risk')

    const users = await prisma.user.findMany({
      where: {
        AND: [
          search ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              { email: { contains: search, mode: 'insensitive' as const } }
            ]
          } : {}
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        status: true,
        role: true,
        _count: {
          select: {
            violations: true,
            posts: true
          }
        },
        violations: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            type: true,
            severity: true,
            createdAt: true
          }
        }
      }
    })

    // Filter by risk level after fetching
    const filteredUsers = risk ? users.filter(user => {
      const count = user._count.violations
      switch(risk) {
        case 'high': return count > 5
        case 'medium': return count > 2 && count <= 5
        case 'low': return count > 0 && count <= 2
        case 'none': return count === 0
        default: return true
      }
    }) : users

    const formattedUsers = filteredUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      status: user.status,
      role: user.role,
      stats: {
        violations: user._count.violations,
        posts: user._count.posts
      },
      lastViolation: user.violations[0] || null
    }))

    return NextResponse.json({ users: formattedUsers })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
} 