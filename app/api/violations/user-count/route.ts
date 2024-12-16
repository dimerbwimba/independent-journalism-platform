import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/options"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 })
    }

    const count = await prisma.violation.count({
      where: {
        userId: session.user.id,
        status: 'PENDING'
      }
    })

    return NextResponse.json({ count })
  } catch (error) {
    console.error("Error fetching violation count:", error)
    return NextResponse.json(
      { error: "Failed to fetch violation count" },
      { status: 500 }
    )
  }
} 