import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get author with related data
    const author = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        image: true,
        role: true,
        createdAt: true,
        monetizationProfile: {
          select: {
            status: true,
            totalEarnings: true
          }
        },
        posts: {
          where: { published: true },
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            image: true,
            createdAt: true,
            views: true,
            comments: true,
            reactions: true,
            shares: true,
            categories: {
              include: {
                category: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            posts: {
              where: { published: true }
            },
            comments: true
          }
        }
      }
    })

    if (!author) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 })
    }

    // Calculate total views, reactions, and comments
    const stats = {
      totalViews: author.posts.reduce((sum, post) => sum + post.views.length, 0),
      totalReactions: author.posts.reduce((sum, post) => sum + post.reactions.length, 0),
      totalComments: author._count.comments,
      totalPosts: author._count.posts
    }

    // Format posts data
    const formattedPosts = author.posts.map(post => ({
      ...post,
      categories: post.categories.map(pc => pc.category),
      viewCount: post.views.length,
      reactionCount: post.reactions.length,
      commentCount: post.comments.length,
      shareCount: post.shares.length
    }))

    // Format response
    const formattedAuthor = {
      id: author.id,
      name: author.name,
      image: author.image,
      role: author.role,
      createdAt: author.createdAt,
      isMonetized: author.monetizationProfile?.status === 'APPROVED',
      totalEarnings: author.monetizationProfile?.totalEarnings || 0
    }

    return NextResponse.json({
      author: formattedAuthor,
      stats,
      posts: formattedPosts
    })

  } catch (error) {
    console.error('Error fetching author:', error)
    return NextResponse.json(
      { error: "Failed to fetch author" },
      { status: 500 }
    )
  }
} 