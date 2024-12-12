import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const author = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        // ... your includes
      }
    })

    if (!author) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 })
    }

    return NextResponse.json({ author }, { status: 200 })
  } catch (error) {
    console.error('Error fetching author:', error)
    return NextResponse.json(
      { error: "Failed to fetch author" },
      { status: 500 }
    )
  }
} 