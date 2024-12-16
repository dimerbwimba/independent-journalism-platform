import { UsersListSidebar } from '@/components/manage-users/roles/UsersListSidebar'

export default function RolesLayout({
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