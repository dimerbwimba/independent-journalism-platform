import DashboardNav from '@/components/dashboard/DashboardNav'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
