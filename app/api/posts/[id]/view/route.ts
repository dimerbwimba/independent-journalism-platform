import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { 
  anonymizeIp, 
  parseUserAgent, 
  getGeoLocation, 
} from "@/utils/viewTracking";

const DUPLICATE_VIEW_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { sessionId, ip, userAgent } = await req.json();

    // Check for duplicate view
    const recentView = await prisma.postView.findFirst({
      where: {
        postId: params.id,
        sessionId,
        createdAt: {
          gte: new Date(Date.now() - DUPLICATE_VIEW_TIMEOUT)
        }
      }
    });

    if (recentView) {
      return NextResponse.json({ 
        message: "View already recorded",
        duplicate: true 
      });
    }

    // Get geolocation data
    const { country, city } = await getGeoLocation(ip);
    
    // Parse user agent
    const { device, browser } = parseUserAgent(userAgent);

    // Create view record
   await prisma.postView.create({
      data: {
        postId: params.id,
        userId: session?.user?.id,
        sessionId,
        ipHash: anonymizeIp(ip),
        country,
        city,
        device,
        browser,
      }
    });

    // Get updated view count
    const viewCount = await prisma.postView.count({
      where: { postId: params.id }
    });

    return NextResponse.json({ 
      success: true, 
      viewCount 
    });
  } catch (error) {
    console.error("Error recording view:", error);
    return NextResponse.json(
      { error: "Failed to record view" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const viewCount = await prisma.postView.count({
      where: { postId: params.id }
    });

    return NextResponse.json({ viewCount });
  } catch (error) {
    console.error("Error fetching view count:", error);
    return NextResponse.json(
      { error: "Failed to fetch view count" },
      { status: 500 }
    );
  }
} 