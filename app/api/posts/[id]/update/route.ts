import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/options"
import prisma from "@/lib/prisma"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const {
      title,
      seoTitle,
      description,
      content,
      image,
      published,
      categories,
      faqs
    } = await req.json()

    // Verify post ownership or admin status
    const existingPost = await prisma.post.findUnique({
      where: { id },
      select: { 
        authorId: true,
        title: true,
        seoTitle: true,
        description: true,
        image: true,
        published: true
      }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      )
    }

    const isAdmin = session.user.role === 'admin'
    const isAuthor = existingPost.authorId === session.user.id

    if (!isAdmin && !isAuthor) {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 403 }
      )
    }

    // For regular users, only update content and categories
    const updateData = isAdmin ? {
      title,
      seoTitle,
      description,
      content,
      image,
      published,
      categories: {
        deleteMany: {},
        create: categories.map((categoryId: string) => ({
          categoryId
        }))
      }
    } : {
      content,
      categories: {
        deleteMany: {},
        create: categories.map((categoryId: string) => ({
          categoryId
        }))
      }
    }

    if (faqs && Array.isArray(faqs)) {
      // Delete existing FAQs
      await prisma.fAQ.deleteMany({
        where: { postId: id }
      })

      // Create new FAQs
      await prisma.fAQ.createMany({
        data: faqs.map(faq => ({
          question: faq.question,
          answer: faq.answer,
          postId: id
        }))
      })
    }
    // Update post
    const updatedPost = await prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        categories: {
          include: {
            category: true
          }
        }
      }
    })

    return NextResponse.json({ post: updatedPost })
  } catch (error) {
    console.error("Post update error:", error)
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    )
  }
} 