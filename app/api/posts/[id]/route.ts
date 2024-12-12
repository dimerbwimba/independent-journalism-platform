import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function PUT(
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

    const { title, content, published, categories, image } = await req.json()

    const post = await prisma.post.update({
      where: {
        id: params.id,
        authorId: session.user.id,
      },
      data: {
        title,
        content,
        published,
        image,
        categories: {
          deleteMany: {},
          create: categories.map((id: string) => ({
            category: {
              connect: { id }
            },
            assignedAt: new Date(),
          })),
        },
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    })

    const formattedPost = {
      ...post,
      categories: post.categories.map(pc => pc.category),
    }

    return NextResponse.json({ post: formattedPost })
  } catch (error) {
    console.error("Post update error:", error)
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    )
  }
}

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

    // Get the post first
    const post = await prisma.post.findUnique({
      where: {
        id: params.id,
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
      // Delete category relationships
      prisma.categoriesOnPosts.deleteMany({
        where: { postId: params.id }
      }),
      // Delete the post
      prisma.post.delete({
        where: {
          id: params.id,
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