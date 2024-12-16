import { UsersListSidebar } from '@/components/manage-users/enforcement/UsersListSidebar'

export default function EnforcementLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-gray-100">
      <UsersListSidebar />
      <main className="ml-64">
        {children}
      </main>
    </div>
  )
} 