import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

const VALID_SHARE_TYPES = ['facebook', 'twitter', 'linkedin', 'whatsapp']

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const { type } = await req.json()
    
    if (!VALID_SHARE_TYPES.includes(type)) {
      return NextResponse.json(
        { error: "Invalid share type" },
        { status: 400 }
      )
    }

    await prisma.postShare.create({
      data: {
        type,
        postId: id,
      },
    })

    // Get updated share counts
    const shares = await prisma.postShare.groupBy({
      by: ['type'],
      where: { postId: id },
      _count: true,
    })

    const shareCounts = VALID_SHARE_TYPES.reduce((acc, type) => ({
      ...acc,
      [type]: shares.find(s => s.type === type)?._count ?? 0
    }), {})

    return NextResponse.json(shareCounts)
  } catch (error) {
    console.error("Share error:", error)
    return NextResponse.json(
      { error: "Failed to record share" },
      { status: 500 }
    )
  }
} 