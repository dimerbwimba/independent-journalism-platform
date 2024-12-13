import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/options"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const { postId, reason, details } = await req.json()

    // Check if user already reported this post
    const existingReport = await prisma.report.findFirst({
      where: {
        postId,
        userId: session.user.id
      }
    })

    if (existingReport) {
      return NextResponse.json(
        { error: "You have already reported this article" },
        { status: 400 }
      )
    }

    const report = await prisma.report.create({
      data: {
        postId,
        userId: session.user.id,
        reason,
        details,
        status: 'PENDING'
      }
    })

    return NextResponse.json({ success: true, report })
  } catch (error) {
    console.error("Report creation error:", error)
    return NextResponse.json(
      { error: "Failed to submit report" },
      { status: 500 }
    )
  }
}