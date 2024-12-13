import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/options"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(req.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const dateFilter = startDate && endDate ? {
      createdAt: {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    } : {}

    // Get user's posts stats
    const totalPosts = await prisma.post.count({
      where: {
        authorId: session.user.id,
        ...dateFilter
      }
    })

    const publishedPosts = await prisma.post.count({
      where: {
        authorId: session.user.id,
        published: true,
        ...dateFilter
      }
    })

    // Get total views on user's posts
    const totalViews = await prisma.postView.count({
      where: {
        post: {
          authorId: session.user.id
        },
        ...dateFilter
      }
    })

    // Get comments on user's posts
    const totalComments = await prisma.comment.count({
      where: {
        post: {
          authorId: session.user.id
        },
        ...dateFilter
      }
    })

    // Get reactions on user's posts
    const totalReactions = await prisma.postReaction.count({
      where: {
        post: {
          authorId: session.user.id
        },
        ...dateFilter
      }
    })

    // Get shares of user's posts
    const totalShares = await prisma.postShare.count({
      where: {
        post: {
          authorId: session.user.id
        },
        ...dateFilter
      }
    })

    // Get daily views trend
    const viewsTrend = await prisma.postView.groupBy({
      by: ['createdAt'],
      where: {
        post: {
          authorId: session.user.id
        },
        ...dateFilter
      },
      _count: true,
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Get top posts by views
    const topPosts = await prisma.post.findMany({
      where: {
        authorId: session.user.id,
        published: true
      },
      select: {
        id: true,
        title: true,
        slug: true,
        _count: {
          select: {
            views: true,
            comments: true,
            reactions: true,
            shares: true
          }
        }
      },
      orderBy: {
        views: {
          _count: 'desc'
        }
      },
      take: 5
    })

    // Get views by country
    const viewsByCountry = await prisma.postView.groupBy({
      by: ['country'],
      _count: true,
      where: {
        post: {
          authorId: session.user.id
        },
        country: { not: null },
        ...dateFilter
      },
      orderBy: {
        country: 'desc'
      },
      take: 5
    })

    // Get engagement by category
    const postEngagement = await prisma.category.findMany({
      where: {
        posts: {
          some: {
            post: {
              authorId: session.user.id,
              published: true
            }
          }
        }
      },
      select: {
        id: true,
        name: true,
        posts: {
          where: {
            post: {
              authorId: session.user.id,
              published: true
            }
          },
          select: {
            post: {
              select: {
                views: true,
                reactions: true,
                comments: true,
                createdAt: true
              }
            }
          }
        }
      }
    });

    // Format the category data
    const formattedPostEngagement = postEngagement.map(category => {
      const posts = category.posts.map(p => p.post);
      const totalViews = posts.reduce((sum, post) => sum + post.views.length, 0);
      const totalReactions = posts.reduce((sum, post) => sum + post.reactions.length, 0);
      const totalComments = posts.reduce((sum, post) => sum + post.comments.length, 0);
      const postCount = posts.length;

      return {
        category: {
          id: category.id,
          name: category.name
        },
        _count: {
          posts: postCount,
          views: totalViews,
          reactions: totalReactions,
          comments: totalComments
        },
        engagement: {
          perPost: {
            views: totalViews / postCount,
            reactions: totalReactions / postCount,
            comments: totalComments / postCount
          }
        }
      };
    });

    return NextResponse.json({
      totalPosts,
      publishedPosts,
      totalViews,
      totalComments,
      totalReactions,
      totalShares,
      viewsTrend: viewsTrend.map(({ createdAt, _count }) => ({
        date: createdAt,
        count: _count
      })),
      topPosts: topPosts.map(post => ({
        title: post.title,
        slug: post.slug,
        views: post._count.views,
        comments: post._count.comments,
        reactions: post._count.reactions,
        shares: post._count.shares
      })),
      viewsByCountry: viewsByCountry.map(({ country, _count }) => ({
        country: country || 'Unknown',
        count: _count
      })),
      postEngagement: formattedPostEngagement,
    })
  } catch (error) {
    console.error("User analytics fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    )
  }
} 