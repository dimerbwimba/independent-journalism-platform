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
        { status: 401 }
      )
    }

    const posts = await prisma.post.findMany({
      where: {
        status: 'REJECTED',
      },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // Format posts for response
    const formattedPosts = posts.map(post => ({
      ...post,
      rejectedAt: post.updatedAt.toISOString(),
      createdAt: post.createdAt.toISOString()
    }))

    return NextResponse.json({ posts: formattedPosts })
  } catch (error) {
    console.error("Archived posts fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch archived posts" },
      { status: 500 }
    )
  }
} 