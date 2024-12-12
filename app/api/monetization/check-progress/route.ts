import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Check if user is monetized
    const monetizationProfile = await prisma.monetizationProfile.findUnique({
      where: { userId: session.user.id },
    });

    const isMonetized = monetizationProfile?.status === "APPROVED";

    // Get total views for monetization progress
    const totalViews = await prisma.postView.count({
      where: {
        post: {
          authorId: session.user.id,
        },
      },
    });

    return NextResponse.json({
      isMonetized,
      totalViews,
      monetizationProfile,
    });
  } catch (error) {
    console.error("Check progress error:", error);
    return NextResponse.json(
      { error: "Failed to check monetization progress" },
      { status: 500 }
    );
  }
}
