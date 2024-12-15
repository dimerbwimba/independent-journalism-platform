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
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 })
    }

    const { action, reason } = await req.json()

    // Update user status and create violation record
    const [user] = await prisma.$transaction([
      prisma.user.update({
        where: { id },
        data: { 
          status: action === 'ban' ? 'BANNED' : 'ACTIVE'
        }
      }),
      prisma.violation.create({
        data: {
          userId: id,
          type: action === 'ban' ? 'BAN' : 'UNBAN',
          severity: action === 'ban' ? 'HIGH' : 'LOW',
          description: reason,
          status: 'RESOLVED'
        }
      })
    ])

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("Ban status update error:", error)
    return NextResponse.json(
      { error: "Failed to update ban status" },
      { status: 500 }
    )
  }
} 