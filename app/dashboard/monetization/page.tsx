import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import MonetizationDashboard from "@/components/dashboard/MonetizationDashboard"

export default async function MonetizationPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const monetizationProfile = await prisma.monetizationProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      payouts: {
        orderBy: { createdAt: 'desc' },
        take: 5
      }
    }
  })

  const totalViews = await prisma.postView.count({
    where: {
      post: {
        authorId: session.user.id
      }
    }
  })

  return (
    <div className="space-y-6 p-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Monetization
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Track your earnings and manage your payouts
          </p>
        </div>
      </div>

      <MonetizationDashboard 
        profile={monetizationProfile || null}
        totalViews={totalViews || 0}
      />
    </div>
  )
} 