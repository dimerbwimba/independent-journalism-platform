import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/options"
import Breadcrumb from "@/components/dashboard/Breadcrumb"
import GlobalAnalytics from "@/components/dashboard/GlobalAnalytics"

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div className="space-y-6 p-8">
      <Breadcrumb />
      
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Global Analytics
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Overview of blog performance and user engagement
          </p>
        </div>
      </div>

      <GlobalAnalytics />
    </div>
  )
} 