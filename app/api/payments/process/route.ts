import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/options"
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

    const { id } = await req.json()

    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Get the profile
      const profile = await tx.monetizationProfile.findUnique({
        where: { id },
        include: {
          user: true
        }
      })

      if (!profile || profile.pendingPayout < 50) {
        throw new Error('Invalid payout request')
      }

      // Create payout record
      const payout = await tx.payout.create({
        data: {
          amount: profile.pendingPayout,
          status: 'completed',
          profileId: profile.id,
          processedAt: new Date()
        }
      })

      // Reset views for all posts of this user
      await tx.postView.deleteMany({
        where: {
          post: {
            authorId: profile.userId
          }
        }
      })

      // Update profile - reset pending payout and increment total earnings
      await tx.monetizationProfile.update({
        where: { id },
        data: {
          pendingPayout: 0,
          totalEarnings: {
            increment: profile.pendingPayout
          },
          lastPayout: new Date()
        }
      })

      return { payout, profile }
    })

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error("Payment processing error:", error)
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    )
  }
} 