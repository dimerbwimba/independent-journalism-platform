import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/options"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.role?.includes('admin')) {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 401 }
      )
    }

    const { name, slug, description, image } = await req.json()

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      )
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        { error: "Invalid slug format" },
        { status: 400 }
      )
    }

    // Check if slug is unique
    const existingCategory = await prisma.category.findUnique({
      where: { slug }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: "A category with this slug already exists" },
        { status: 400 }
      )
    }

    // Create category
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        image
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error("Category creation error:", error)
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Categories fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
} 