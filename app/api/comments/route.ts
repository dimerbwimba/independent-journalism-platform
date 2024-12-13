import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/options"
import prisma from "@/lib/prisma"
import { isSpam } from '@/utils/spamDetection';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const { postId, text, parentId } = await req.json()

    if (!text?.trim()) {
      return NextResponse.json(
        { error: "Comment text is required" },
        { status: 400 }
      )
    }

    const spamCheck = isSpam(text);
    if (spamCheck.isSpam) {
      return NextResponse.json(
        { error: `Comment rejected: ${spamCheck.reason}` },
        { status: 400 }
      )
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        userId: session.user.id,
        postId,
        parentId: parentId || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        replies: true,
      },
    })

    return NextResponse.json({ success: true, comment })
  } catch (error) {
    console.error("Comment creation error:", error)
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const postId = searchParams.get('postId')

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      )
    }

    const comments = await prisma.comment.findMany({
      where: {
        postId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        votes: true,
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            votes: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ success: true, comments })
  } catch (error) {
    console.error("Comments fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    )
  }
} 