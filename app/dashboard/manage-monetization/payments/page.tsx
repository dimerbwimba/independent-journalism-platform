import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import PendingPayments from "@/components/manage-monetizations/PendingPayments"

export default async function AdminPaymentsPage() {
  const session = await getServerSession(authOptions)

  if (session?.user?.role !== 'admin') {
    redirect('/dashboard')
  }

  const pendingPayouts = await prisma.monetizationProfile.findMany({
    where: {
      status: 'APPROVED',
      pendingPayout: {
        gte: 50
      }
    },
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
    }
  })

  return (
    <div className="space-y-6 p-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Pending Payments
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Review and process payments for creators
          </p>
        </div>
      </div>

      <PendingPayments payouts={pendingPayouts} />
    </div>
  )
} 