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
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 })
    }

    const { action, reason } = await req.json()

    // Get current violation count
    const violationCount = await prisma.violation.count({
      where: { 
        userId: id,
        status: 'PENDING'
      }
    })

    // Define action mappings
    const actionMappings = {
      WARNING: {
        status: violationCount >= 2 ? 'BANNED' : 'ACTIVE', // Ban on third violation
        severity: 'LOW',
        type: violationCount >= 2 ? 'AUTO_BAN' : 'WARNING'
      },
      SUSPENSION: {
        status: violationCount >= 2 ? 'BANNED' : 'SUSPENDED',
        severity: 'MEDIUM',
        type: violationCount >= 2 ? 'AUTO_BAN' : 'SUSPENSION'
      },
      BAN: {
        status: 'BANNED',
        severity: 'HIGH',
        type: 'BAN'
      },
      RESOLVE: {
        status: 'ACTIVE',
        severity: 'LOW',
        type: 'RESOLUTION'
      }
    }

    const actionConfig = actionMappings[action as keyof typeof actionMappings]
    if (!actionConfig) {
      return NextResponse.json(
        { error: "Invalid action type" },
        { status: 400 }
      )
    }

    // Get user first to check role
    const currentUser = await prisma.user.findUnique({
      where: { id },
      select: { role: true }
    })

    // Update user status and create violation record
    const [user] = await prisma.$transaction([
      prisma.user.update({
        where: { id },
        data: { 
          status: actionConfig.status,
          ...((['SUSPENDED', 'BANNED'].includes(actionConfig.status) && {
            role: 'user'
          }))
        }
      }),
      prisma.violation.create({
        data: {
          userId: id,
          type: actionConfig.type,
          severity: actionConfig.severity,
          description: violationCount >= 2 && action !== 'BAN' 
            ? `${reason} (Automatic ban due to exceeding violation limit)`
            : ['SUSPENDED', 'BANNED'].includes(actionConfig.status) && currentUser?.role === 'admin'
              ? `${reason} (Admin privileges revoked)`
              : reason,
          status: action === 'RESOLVE' ? 'RESOLVED' : 'PENDING'
        }
      })
    ])

    return NextResponse.json({ 
      success: true, 
      user,
      autoBanned: violationCount >= 2 && action !== 'BAN',
      adminRevoked: ['SUSPENDED', 'BANNED'].includes(actionConfig.status) && user.role === 'admin'
    })
  } catch (error) {
    console.error("Action error:", error)
    return NextResponse.json(
      { error: "Failed to perform action" },
      { status: 500 }
    )
  }
} 