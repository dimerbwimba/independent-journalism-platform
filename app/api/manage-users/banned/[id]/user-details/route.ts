import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/options"
import prisma from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id },
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
          select: {
            id: true,
            type: true,
            severity: true,
            description: true,
            status: true,
            createdAt: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: {
        ...user,
        stats: {
          violations: user._count.violations,
          posts: user._count.posts
        }
      }
    })
  } catch (error) {
    console.error("User details fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch user details" },
      { status: 500 }
    )
  }
} 