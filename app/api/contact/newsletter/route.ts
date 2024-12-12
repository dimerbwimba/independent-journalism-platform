import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json()

    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      )
    }

    // Check if already subscribed
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    })

    if (existingSubscriber) {
      if (existingSubscriber.active) {
        return NextResponse.json(
          { error: "This email is already subscribed" },
          { status: 400 }
        )
      }

      // Reactivate subscription if previously unsubscribed
      const updatedSubscriber = await prisma.newsletterSubscriber.update({
        where: { email },
        data: { 
          active: true,
          name: name || existingSubscriber.name
        }
      })

      return NextResponse.json({ success: true, subscriber: updatedSubscriber })
    }

    // Create new subscription
    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email,
        name,
        active: true
      }
    })

    return NextResponse.json({ success: true, subscriber })
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json(
      { error: "Failed to process subscription" },
      { status: 500 }
    )
  }
} 