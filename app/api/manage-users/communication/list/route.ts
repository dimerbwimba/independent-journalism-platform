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

    // Fetch both contacts and newsletter subscriptions
    const [reports,contacts, newsletters] = await Promise.all([
      prisma.report.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          },
          post: {
            select: {
              title: true
            }
          }
        }
      }),
      prisma.contact.findMany({
        take: 50,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.newsletterSubscriber.findMany({
        take: 50,
        orderBy: { createdAt: 'desc' },
        where: { active: true }
      })
    ])

    // Format the response
    const items = [
      ...reports.map(report => ({
        id: report.id,
        type: 'REPORT' as const,
        subject: `Report: ${report.post.title}`,
        createdAt: report.createdAt,
        user: report.user,
        status: report.status
      })),
      ...contacts.map(contact => ({
        id: contact.id,
        type: 'CONTACT' as const,
        subject: contact.subject,
        createdAt: contact.createdAt,
        user: contact.user,
        status: contact.status
      })),
      ...newsletters.map(newsletter => ({
        id: newsletter.id,
        type: 'NEWSLETTER' as const,
        subject: 'Newsletter Subscription',
        createdAt: newsletter.createdAt,
        user: {
          name: newsletter.name || 'Subscriber',
          email: newsletter.email
        },
        status: newsletter.active ? 'ACTIVE' : 'INACTIVE'
      }))
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    return NextResponse.json({ items })
  } catch (error) {
    console.error("Error fetching communications list:", error)
    return NextResponse.json(
      { error: "Failed to fetch communications" },
      { status: 500 }
    )
  }
} 