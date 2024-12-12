import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Breadcrumb from "@/components/dashboard/Breadcrumb"
import RecentActivity from "@/components/dashboard/RecentActivity"

export default async function ActivityPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="space-y-6 p-8">
      <Breadcrumb />
      
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Recent Activity
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Track your content performance and engagement
          </p>
        </div>
      </div>

      <RecentActivity />
    </div>
  )
} 