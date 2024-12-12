import { NextResponse } from "next/server"
import { headers } from 'next/headers'

export async function GET() {
  try {
    const headersList = await headers()
    const cronSecret = headersList.get('x-cron-secret')

    // Verify the request is from your cron service
    if (cronSecret !== process.env.CRON_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Process payouts
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/monetization/process-payouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Cron job error:", error)
    return NextResponse.json(
      { error: "Failed to run payout cron job" },
      { status: 500 }
    )
  }
} 