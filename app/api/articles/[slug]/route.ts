import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteContext {
  params: { slug: string }
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const post = await prisma.post.findFirst({
      where: {
        slug: context.params.slug,
        published: true,
      },
      include: {
        comments: {
          select: {
            id: true,
          },
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
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}
