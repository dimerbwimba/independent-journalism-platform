import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const category = await prisma.category.findUnique({
      where: {
        slug: params.slug,
      },
      include: {
        posts: {
          where: {
            post: {
              published: true
            }
          },
          include: {
            post: {
              include: {
                author: {
                  select: {
                    name: true,
                    image: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    // Format the response with proper type checking
    const formattedCategory = {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      posts: category.posts
        .filter(cp => cp.post !== null)
        .map(cp => ({
          id: cp.post.id,
          slug: cp.post.slug, // Make sure to include the slug
          title: cp.post.title,
          description: cp.post.description,
          image: cp.post.image,
          author: cp.post.author,
          createdAt: cp.post.createdAt
        }))
    }

    return NextResponse.json({ category: formattedCategory })
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    )
  }
} 