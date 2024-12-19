import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/options"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        role: true,
        accounts: {
          select: {
            provider: true,
            type: true
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

    // Format the user data
    const formattedUser = {
      ...user,
      accountNumber: `${user.id.slice(-9)}`,
      username: null,
      connectedAccounts: user.accounts.length > 0 
        ? user.accounts.map(account => account.provider)
        : session.user.email ? ['credentials'] : [] // If no OAuth accounts but has email, assume credentials
    }

    return NextResponse.json({
      user: formattedUser
    })
  } catch (error) {
    console.error("Account fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch account information" },
      { status: 500 }
    )
  }
} 