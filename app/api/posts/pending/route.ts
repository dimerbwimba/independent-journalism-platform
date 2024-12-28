import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/options"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.role?.includes('admin')) {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 403 }
      )
    }

    const posts = await prisma.post.findMany({
      where: {
        status: "PENDING"
      },
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        createdAt: true,
        author: {
          select: {
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Pending posts fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch pending posts" },
      { status: 500 }
    )
  }
} 