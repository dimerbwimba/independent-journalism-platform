import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/options"
import prisma from "@/lib/prisma"

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.role?.includes('admin')) {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 401 }
      )
    }

    const { postIds } = await req.json()

    if (!Array.isArray(postIds) || postIds.length === 0) {
      return NextResponse.json(
        { error: "Invalid post IDs" },
        { status: 400 }
      )
    }

    // Delete posts and their relationships
    await prisma.$transaction([
      // Delete category relationships
      prisma.categoriesOnPosts.deleteMany({
        where: { postId: { in: postIds } }
      }),
      // Delete comments
      prisma.comment.deleteMany({
        where: { postId: { in: postIds } }
      }),
      // Delete reactions
      prisma.postReaction.deleteMany({
        where: { postId: { in: postIds } }
      }),
      // Delete shares
      prisma.postShare.deleteMany({
        where: { postId: { in: postIds } }
      }),
      // Delete views
      prisma.postView.deleteMany({
        where: { postId: { in: postIds } }
      }),
      // Delete saved articles
      prisma.savedArticle.deleteMany({
        where: { postId: { in: postIds } }
      }),
      // Finally, delete the posts
      prisma.post.deleteMany({
        where: {
          id: { in: postIds },
          status: 'REJECTED' // Extra safety check
        }
      })
    ])

    return NextResponse.json({ 
      success: true,
      message: `Successfully deleted ${postIds.length} posts`
    })
  } catch (error) {
    console.error("Posts deletion error:", error)
    return NextResponse.json(
      { error: "Failed to delete posts" },
      { status: 500 }
    )
  }
} 