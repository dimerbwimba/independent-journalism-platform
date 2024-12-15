import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/options"
import prisma from "@/lib/prisma"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 })
    }

    // Update user status and create an audit log
    await prisma.$transaction([
      prisma.user.update({
        where: { id },
        data: { 
          status: 'ACTIVE',
          violations: {
            updateMany: {
              where: { status: 'PENDING' },
              data: { status: 'RESOLVED' }
            }
          }
        }
      }),
      prisma.violation.create({
        data: {
          userId: id,
          type: 'UNBAN',
          severity: 'LOW',
          description: `User unbanned by admin ${session.user.name}`,
          status: 'RESOLVED'
        }
      })
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error unbanning user:", error)
    return NextResponse.json(
      { error: "Failed to unban user" },
      { status: 500 }
    )
  }
} 