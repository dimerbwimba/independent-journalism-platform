import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/options"
import prisma from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        status: true,
        createdAt: true,
        violations: {
          where: {
            type: 'ROLE_CHANGE'
          },
          orderBy: {
            createdAt: 'desc'
          },
          select: {
            id: true,
            description: true,
            createdAt: true,
            user: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Format role history from violations
    const roleHistory = user.violations.map(v => {
      const [previousRole, newRole] = v.description
        .match(/from (.*) to (.*)/)
        ?.slice(1) || ['unknown', 'unknown']
      
      return {
        id: v.id,
        previousRole,
        newRole,
        changedAt: v.createdAt,
        changedBy: v.user
      }
    })

    return NextResponse.json({
      user: {
        ...user,
        roleHistory,
        violations: undefined // Remove violations from response
      }
    })
  } catch (error) {
    console.error("User details fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch user details" },
      { status: 500 }
    )
  }
} 