import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"



export async function GET() {
  try {
    // Get categories with published posts count
    const categories = await prisma.category.findMany({
      include: {
        posts: {
          include: {
            post: {
              select: {
                status: true
              }
            }
          }
        }
      }
    })

    // Get latest published articles
    const latestArticles = await prisma.post.findMany({
      where: {
        status: 'APPROVED'
      },
      include: {
        categories: {
          include: {
            category: true
          }
        },
        author: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 3
    })

    // Format latest articles
    const formattedArticles = latestArticles.map(article => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      description: article.description,
      image: article.image,
      author: article.author,
      categories: article.categories.map(c => ({
        id: c.category.id,
        name: c.category.name,
        slug: c.category.slug
      }))
    }))

    // Get featured article with slug
    const featuredArticle = await prisma.post.findFirst({
      where: {
        status: 'APPROVED',
        image: {
          not: null
        }
      },
      include: {
        author: {
          select: {
            name: true
          }
        },
        categories: {
          include: {
            category: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Format featured article
    const formattedFeaturedArticle = featuredArticle ? {
      id: featuredArticle.id,
      slug: featuredArticle.slug,
      title: featuredArticle.title,
      description: featuredArticle.description,
      image: featuredArticle.image,
      author: featuredArticle.author,
      categories: featuredArticle.categories.map(c => ({
        id: c.category.id,
        name: c.category.name,
        slug: c.category.slug
      }))
    } : null

    // Format categories with published post count
    const formattedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      postCount: category.posts.filter(cp => cp.post.status === 'APPROVED').length
    }))

    // Get popular articles from the past week
    const oneWeekAgoPosts = new Date()
    oneWeekAgoPosts.setDate(oneWeekAgoPosts.getDate() - 7)

    const popularArticles = await prisma.post.findMany({
      where: {
        status: 'APPROVED',
        createdAt: {
          gte: oneWeekAgoPosts
        }
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        views: true,
        reactions: true,
        comments: true,
      },
      orderBy: [
        {
          views: {
            _count: 'desc'
          }
        },
        {
          reactions: {
            _count: 'desc'
          }
        },
        {
          comments: {
            _count: 'desc'
          }
        }
      ],
      take: 6
    })

    // Format popular articles
    const formattedPopularArticles = popularArticles.map(article => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      description: article.description,
      image: article.image,
      author: article.author,
      categories: article.categories.map(c => ({
        id: c.category.id,
        name: c.category.name,
        slug: c.category.slug
      })),
      viewCount: article.views.length,
      reactionCount: article.reactions.length,
      commentCount: article.comments.length
    }))

    // Get popular creators from the past week
    const oneWeekAgoCreators = new Date()
    oneWeekAgoCreators.setDate(oneWeekAgoCreators.getDate() - 7)

    const popularCreators = await prisma.user.findMany({
      where: {
        posts: {
          some: {
            published: true,
            views: {
              some: {
                createdAt: {
                  gte: oneWeekAgoCreators
                }
              }
            }
          }
        }
      },
      select: {
        id: true,
        name: true,
        image: true,
        role: true,
        posts: {
          where: {
            published: true,
            views: {
              some: {
                createdAt: {
                  gte: oneWeekAgoPosts
                }
              }
            }
          },
          select: {
            title: true,
            slug: true,
            _count: {
              select: {
                views: true
              }
            }
          },
          orderBy: {
            views: {
              _count: 'desc'
            }
          },
          take: 1
        }
      },
      orderBy: {
        posts: {
          _count: 'desc'
        }
      },
      take: 6
    })

    const formattedCreators = popularCreators
      .filter(creator => creator.posts.length > 0)
      .map(creator => ({
        id: creator.id,
        name: creator.name,
        image: creator.image,
        role: creator.role,
        topPost: creator.posts[0],
        weeklyViews: creator.posts.reduce((sum, post) => sum + post._count.views, 0)
      }))

    // Calculate rising stars
    const currentDate = new Date()
    const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const previousMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)

    const risingCreators = await prisma.user.findMany({
      where: {
        posts: {
          some: {
            published: true,
            OR: [
              {
                views: {
                  some: {
                    createdAt: {
                      gte: previousMonthStart
                    }
                  }
                }
              },
              {
                reactions: {
                  some: {
                    createdAt: {
                      gte: previousMonthStart
                    }
                  }
                }
              }
            ]
          }
        }
      },
      select: {
        id: true,
        name: true,
        image: true,
        role: true,
        posts: {
          where: {
            published: true
          },
          select: {
            title: true,
            slug: true,
            views: {
              where: {
                createdAt: {
                  gte: previousMonthStart
                }
              }
            },
            reactions: {
              where: {
                createdAt: {
                  gte: previousMonthStart
                }
              }
            }
          }
        }
      },
      take: 6
    });

    // Calculate growth rates and format creators
    const formattedRisingCreators = risingCreators
      .map(creator => {
        const currentMonthViews = creator.posts.reduce((sum, post) => 
          sum + post.views.filter(v => v.createdAt >= currentMonthStart).length, 0
        )
        const previousMonthViews = creator.posts.reduce((sum, post) => 
          sum + post.views.filter(v => v.createdAt >= previousMonthStart && v.createdAt < currentMonthStart).length, 0
        )
        const currentMonthReactions = creator.posts.reduce((sum, post) => 
          sum + post.reactions.filter(r => r.createdAt >= currentMonthStart).length, 0
        )
        const previousMonthReactions = creator.posts.reduce((sum, post) => 
          sum + post.reactions.filter(r => r.createdAt >= previousMonthStart && r.createdAt < currentMonthStart).length, 0
        )

        // Calculate growth rate (weighted average of views and reactions growth)
        const viewsGrowth = previousMonthViews === 0 ? 
          currentMonthViews > 0 ? 100 : 0 : 
          ((currentMonthViews - previousMonthViews) / previousMonthViews) * 100

        const reactionsGrowth = previousMonthReactions === 0 ? 
          currentMonthReactions > 0 ? 100 : 0 : 
          ((currentMonthReactions - previousMonthReactions) / previousMonthReactions) * 100

        // Weight views 60% and reactions 40%
        const growthRate = (viewsGrowth * 0.6) + (reactionsGrowth * 0.4)

        return {
          id: creator.id,
          name: creator.name,
          image: creator.image,
          role: creator.role,
          stats: {
            currentMonthViews,
            previousMonthViews,
            currentMonthReactions,
            previousMonthReactions,
            growthRate
          }
        }
      })
      // Filter out creators with no growth
      .filter(creator => creator.stats.growthRate > 0)
      // Sort by growth rate
      .sort((a, b) => b.stats.growthRate - a.stats.growthRate)
      // Take top 3
      .slice(0, 3)

    return NextResponse.json({
      categories: formattedCategories,
      latestArticles: formattedArticles,
      featuredArticle: formattedFeaturedArticle,
      popularArticles: formattedPopularArticles,
      popularCreators: formattedCreators,
      risingCreators: formattedRisingCreators
    })
  } catch (error) {
    console.error("Home page data fetch error:", error)
    return NextResponse.json({
      categories: [],
      latestArticles: [],
      featuredArticle: null,
      popularArticles: [],
      error: "Failed to fetch home page data"
    }, { status: 500 })
  }
} 
