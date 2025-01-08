import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
    req: Request,
) {
    const { searchParams } = new URL(req.url)
    const country = searchParams.get('country') || ''
  try {
    const articles = await prisma.post.findMany({
      where: {
        status: 'APPROVED',
        slug: {
          contains: country
        }
      },
      include:{
        views:true,
        reactions:true
      }
    })

    const formattedArticles = articles.map(article => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      description: article.description,
      image: article.image,
      views:article.views.length,
      reactions:article.reactions.length
    }))

    return NextResponse.json({
      articles: formattedArticles
    })
  } catch (error) {
    console.error("Articles fetch error:", error)
    return NextResponse.json({
      articles: [],
      error: "Failed to fetch articles"
    }, { status: 500 })
  }
} 