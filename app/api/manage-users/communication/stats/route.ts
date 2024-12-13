import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/options"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 })
    }

    const [
      totalContacts,
      pendingInquiries,
      totalReports,
      newsletterSubscribers,
      unreadMessages
    ] = await Promise.all([
      prisma.contact.count(),
      prisma.contact.count({ where: { status: 'PENDING' } }),
      prisma.report.count(),
      prisma.newsletterSubscriber.count({ where: { active: true } }),
      prisma.message.count({ where: { read: false } })
    ])

    return NextResponse.json({
      stats: {
        totalContacts,
        pendingInquiries,
        totalReports,
        newsletterSubscribers,
        unreadMessages
      }
    })
  } catch (error) {
    console.error("Error fetching communication stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    )
  }
} 