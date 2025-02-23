import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/options";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  try {
    // Get current user session
    const session = await getServerSession(authOptions)
    

    const post = await prisma.post.findFirst({
      where: {
        slug: slug,
        status: 'APPROVED',
      },
      include: {
        faqs: true,
        comments: {
          select: {
            id: true,
          }
        },
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        reactions: true,
        shares: {
          select: {
            type: true,
          },
        },
        views: true,
        savedBy: {
          where: session?.user?.id ? {
            userId: session.user.id
          } : undefined,
          select: {
            id: true
          }
        }
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      )
    }

    // get comment count
    const commentCounts = post.comments.length;

    // Get reaction counts
    const reactionCounts = {
      heart: post.reactions.filter(r => r.type === 'heart').length,
      mindblown: post.reactions.filter(r => r.type === 'mindblown').length,
      unicorn: post.reactions.filter(r => r.type === 'unicorn').length,
      handsdown: post.reactions.filter(r => r.type === 'handsdown').length,
    }

    // Get share counts
    const shareCounts = {
      facebook: post.shares.filter(s => s.type === 'facebook').length,
      twitter: post.shares.filter(s => s.type === 'twitter').length,
      linkedin: post.shares.filter(s => s.type === 'linkedin').length,
      whatsapp: post.shares.filter(s => s.type === 'whatsapp').length,
    }

    // Get category IDs from the current post
    const categoryIds = post.categories.map(pc => pc.category.id)

    // Get related posts from the same categories
    const relatedPosts = await prisma.post.findMany({
      where: {
        published: true,
        id: { not: post.id }, // Exclude current post
        OR: [
          {
            categories: {
              some: {
                categoryId: { in: categoryIds }
              }
            }
          },
          {
            country: post.country
          }
        ]
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          }
        },
        categories: {
          include: {
            category: true,
          }
        }
      },
      take: 6,
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Get view count
    const viewCount = post.views.length;

    // Format the response
    const formattedPost = {
      ...post,
      categories: post.categories.map(pc => pc.category),
      reactions: reactionCounts,
      shares: shareCounts,
      comments: commentCounts,
      relatedPosts: relatedPosts.map(rp => ({
        id: rp.id,
        slug: rp.slug,
        title: rp.title,
        description: rp.description,
        country: rp.country,
        image: rp.image,
        author: rp.author,
        categories: rp.categories.map(pc => pc.category)
      })),
      viewCount,
      saved: post.savedBy?.some(save => save.id) ?? false
    }

    return NextResponse.json({ post: formattedPost })
  } catch (error) {
    console.error('Error fetching article:', error)
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    )
  }
}
