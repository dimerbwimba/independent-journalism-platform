import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/options"
import prisma from "@/lib/prisma"


export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }>  }
) {
  const { id } = await params
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    // Get the post first
    const post = await prisma.post.findUnique({
      where: {
        id: id,
        authorId: session.user.id,
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: "Post not found or unauthorized" },
        { status: 404 }
      )
    }

    // Delete the post and its relationships
    await prisma.$transaction([
      // Delete category relationship
      prisma.categoriesOnPosts.deleteMany({
        where: { postId: id }
      }),
      // Delete faq relationship
      prisma.fAQ.deleteMany({
        where: { postId: id }
      }),
      // Delete the post
      prisma.post.delete({
        where: {
          id: id,
          authorId: session.user.id,
        }
      })
    ]);

    return NextResponse.json({ 
      success: true,
      message: "Post deleted successfully" 
    })

  } catch (error) {
    console.error("Post deletion error:", error)
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    )
  }
} 