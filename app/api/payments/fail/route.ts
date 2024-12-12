import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'admin') {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 401 }
      )
    }

    const { id, reason } = await req.json()

    const result = await prisma.$transaction(async (tx) => {
      // Create failed payout record
      const payout = await tx.payout.create({
        data: {
          amount: 0,
          status: 'failed',
          profileId: id,
          processedAt: new Date(),
          failureReason: reason
        }
      })

      return { payout }
    })

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error("Payment failure recording error:", error)
    return NextResponse.json(
      { error: "Failed to record payment failure" },
      { status: 500 }
    )
  }
} 