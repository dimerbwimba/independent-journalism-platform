import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/options"
import prisma from "@/lib/prisma"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
const {id}= await params
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 401 }
      )
    }

    const { approved } = await req.json()

    const post = await prisma.post.update({
      where: {
        id: id,
      },
      data: {
        published: approved,
      },
    })

    return NextResponse.json({ 
      success: true,
      message: approved ? "Post approved" : "Post rejected",
      post 
    })
  } catch (error) {
    console.error("Post approval error:", error)
    return NextResponse.json(
      { error: "Failed to update post status" },
      { status: 500 }
    )
  }
} 