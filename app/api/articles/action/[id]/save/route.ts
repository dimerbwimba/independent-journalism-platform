import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/options"
import prisma from "@/lib/prisma"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const {id} = await params

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const postId = id

    // Check if already saved
    const existingSave = await prisma.savedArticle.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId
        }
      }
    })

    if (existingSave) {
      return NextResponse.json(
        { error: "Article already saved" },
        { status: 400 }
      )
    }

    // Save the article
    await prisma.savedArticle.create({
      data: {
        userId: session.user.id,
        postId
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Save article error:", error)
    return NextResponse.json(
      { error: "Failed to save article" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const {id} = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const postId = id

    await prisma.savedArticle.delete({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unsave article error:", error)
    return NextResponse.json(
      { error: "Failed to unsave article" },
      { status: 500 }
    )
  }
} 