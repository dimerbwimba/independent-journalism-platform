import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 })
    }

    // Try to find contact
    const contact = await prisma.contact.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true
          }
        }
      }
    })

    if (contact) {
      return NextResponse.json({
        type: 'CONTACT',
        data: contact
      })
    }

    // If not found, try to find report
    const report = await prisma.report.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true
          }
        },
        post: {
          select: {
            title: true,
            slug: true
          }
        }
      }
    })

    if (report) {
      return NextResponse.json({
        type: 'REPORT',
        data: report
      })
    }

    return NextResponse.json({ error: "Communication not found" }, { status: 404 })
  } catch (error) {
    console.error("Error fetching communication:", error)
    return NextResponse.json(
      { error: "Failed to fetch communication" },
      { status: 500 }
    )
  }
}

// Update status
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 })
    }

    const { type, status } = await req.json()

    if (type === 'CONTACT') {
      const contact = await prisma.contact.update({
        where: { id: params.id },
        data: { status }
      })
      return NextResponse.json({ success: true, data: contact })
    }

    if (type === 'REPORT') {
      const report = await prisma.report.update({
        where: { id: params.id },
        data: { status }
      })
      return NextResponse.json({ success: true, data: report })
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 })
  } catch (error) {
    console.error("Error updating communication:", error)
    return NextResponse.json(
      { error: "Failed to update communication" },
      { status: 500 }
    )
  }
}