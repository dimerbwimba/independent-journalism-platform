import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/options"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 401 }
      )
    }

    const posts = await prisma.post.findMany({
      where: {
        published: false,
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      posts
    })
  } catch (error) {
    console.error("Pending posts fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch pending posts" },
      { status: 500 }
    )
  }
} 