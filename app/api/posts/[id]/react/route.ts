import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

const VALID_REACTIONS = ['heart', 'mindblown', 'unicorn', 'handsdown']

export async function POST(
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

    const { type } = await req.json()
    if (!VALID_REACTIONS.includes(type)) {
      return NextResponse.json(
        { error: "Invalid reaction type" },
        { status: 400 }
      )
    }

    const existingReaction = await prisma.postReaction.findUnique({
      where: {
        userId_postId_type: {
          userId: session.user.id,
          postId: params.id,
          type,
        },
      },
    })

    if (existingReaction) {
      await prisma.postReaction.delete({
        where: { id: existingReaction.id },
      })
    } else {
      await prisma.postReaction.create({
        data: {
          type,
          userId: session.user.id,
          postId: params.id,
        },
      })
    }

    const reactions = await prisma.postReaction.groupBy({
      by: ['type'],
      where: { postId: params.id },
      _count: true,
    })

    const reactionCounts = VALID_REACTIONS.reduce((acc, type) => ({
      ...acc,
      [type]: reactions.find(r => r.type === type)?._count ?? 0
    }), {})

    return NextResponse.json(reactionCounts)
  } catch (error) {
    console.error("Reaction error:", error)
    return NextResponse.json(
      { error: "Failed to update reaction" },
      { status: 500 }
    )
  }
} 