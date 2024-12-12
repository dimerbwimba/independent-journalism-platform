import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const comment = await prisma.comment.findUnique({
      where: { id: params.id },
      include: { user: true }
    })

    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      )
    }

    // Check if user is authorized to delete (owner or admin)
    if (comment.userId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 403 }
      )
    }

    // Delete the comment and all its replies
    await prisma.comment.deleteMany({
      where: {
        OR: [
          { id: params.id },
          { parentId: params.id }
        ]
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Comment deletion error:", error)
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    )
  }
} 