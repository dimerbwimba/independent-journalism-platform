import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { subject, message } = await req.json()

    // Create or get user for non-authenticated submissions
    const userId = session?.user?.id
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const contact = await prisma.contact.create({
      data: {
        userId,
        type: 'CONTACT',
        status: 'PENDING',
        subject,
        message
      }
    })

    return NextResponse.json({ contact })
  } catch (error) {
    console.error("Error creating contact:", error)
    return NextResponse.json(
      { error: "Failed to submit contact form" },
      { status: 500 }
    )
  }
} 