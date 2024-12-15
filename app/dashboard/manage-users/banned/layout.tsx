import { UsersListSideBar } from '@/components/manage-users/banned/UsersListSideBar'

export default function BannedUsersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className=" bg-gray-100">
      <UsersListSideBar />
      <main className="ml-64">
        {children}
      </main>
    </div>
  )
} 