import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/options"
import prisma from "@/lib/prisma"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params       
  try {
    const session = await getServerSession(authOptions)
    const commentId = await id

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const { type } = await req.json()
    
    if (!['up', 'down'].includes(type)) {
      return NextResponse.json(
        { error: "Invalid vote type" },
        { status: 400 }
      )
    }

    // Check if user already voted
    const existingVote = await prisma.commentVote.findUnique({
      where: {
        userId_commentId: {
          userId: session.user.id,
          commentId,
        },
      },
    })

    if (existingVote) {
      if (existingVote.type === type) {
        // Remove vote if same type
        await prisma.commentVote.delete({
          where: { id: existingVote.id },
        })
      } else {
        // Update vote if different type
        await prisma.commentVote.update({
          where: { id: existingVote.id },
          data: { type },
        })
      }
    } else {
      // Create new vote
      await prisma.commentVote.create({
        data: {
          type,
          userId: session.user.id,
          commentId,
        },
      })
    }

    // Get updated vote counts
    const votes = await prisma.commentVote.groupBy({
      by: ['type'],
      where: { commentId },
      _count: true,
    })

    const upvotes = votes.find(v => v.type === 'up')?._count ?? 0
    const downvotes = votes.find(v => v.type === 'down')?._count ?? 0

    return NextResponse.json({ upvotes, downvotes })
  } catch (error) {
    console.error("Vote error:", error)
    return NextResponse.json(
      { error: "Failed to vote" },
      { status: 500 }
    )
  }
} 