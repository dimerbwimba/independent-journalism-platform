import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/options"
import prisma from "@/lib/prisma"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const {id} = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.role?.includes('admin')) {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 403 }
      )
    }

    const { action } = await req.json()
    
    const post = await prisma.post.update({
      where: {
        id: id
      },
      data: {
        status: action === 'approve' ? 'APPROVED' : 'REJECTED',
        published: action === 'approve'
      }
    })

    return NextResponse.json({ post })
  } catch (error) {
    console.error("Post action error:", error)
    return NextResponse.json(
      { error: "Failed to process post action" },
      { status: 500 }
    )
  }
} 