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
    if (!session?.user?.id || session?.user?.role !== 'admin') {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 })
    }

    const { response } = await req.json()
    if (!response?.trim()) {
      return NextResponse.json(
        { error: "Response is required" },
        { status: 400 }
      )
    }

    // Create response and update contact status in a transaction
    const [newResponse] = await prisma.$transaction([
      // Create the response
      prisma.contactResponse.create({
        data: {
          body: response,
          contactId: id,
          userId: session.user.id,
        },
        include: {
          user: {
            select: {
              name: true,
              image: true
            }
          }
        }
      }),
    ])

    // Get count of remaining pending inquiries
    const pendingCount = await prisma.contact.count({
      where: {
        status: 'PENDING',
        type: 'CONTACT'
      }
    })

    return NextResponse.json({ 
      success: true, 
      response: newResponse,
      pendingCount
    })
  } catch (error) {
    console.error("Error creating response:", error)
    return NextResponse.json(
      { error: "Failed to create response" },
      { status: 500 }
    )
  }
}

// Add GET method to fetch responses for a contact
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }>  }
) {
  const { id } = await params
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 })
    }

    const responses = await prisma.contactResponse.findMany({
      where: { contactId: id },
      include: {
        user: {
          select: {
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ responses })
  } catch (error) {
    console.error("Error fetching responses:", error)
    return NextResponse.json(
      { error: "Failed to fetch responses" },
      { status: 500 }
    )
  }
} 