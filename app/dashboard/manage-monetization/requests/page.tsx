import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/options"
import prisma from "@/lib/prisma"
import MonetizationApplications from "@/components/manage-monetizations/MonetizationApplications"
import { MonetizationStatus } from '@prisma/client'

export default async function AdminMonetizationPage() {
  const session = await getServerSession(authOptions)

  if (session?.user?.role !== 'admin') {
    redirect('/dashboard')
  }
  interface Application {
    id: string
    status: MonetizationStatus
    paypalEmail: string | null
    totalEarnings: number
    pendingPayout: number
    appliedAt: Date
    user: {
      name: string | null
      email: string | null
      image: string | null
    }
  }
  const applications = await prisma.monetizationProfile.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true
        }
      },
      payouts: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    },
    orderBy: {
      appliedAt: 'desc'
    }
  }) as Application[]

  return (
    <div className="space-y-6 p-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Monetization Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Review and manage monetization applications
          </p>
        </div>
      </div>

      <MonetizationApplications applications={applications} />
    </div>
  )
} 