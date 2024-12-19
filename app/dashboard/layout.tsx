import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/options'
import DashboardNav from '@/components/dashboard/DashboardNav'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  // Redirect readers to home page
  if (session.user.role === 'reader') {
    redirect('/')
  }

  return (
    <div className=" h-screen bg-gray-100">
      <DashboardNav />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 ml-64 pt-12">
          {children}
        </main>

      </div>
    </div>
  )
}
