import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/options"
import { redirect } from "next/navigation"
import Breadcrumb from "@/components/dashboard/Breadcrumb"
import CategoryList from "@/components/dashboard/CategoryList"
import CreateCategoryButton from "@/components/dashboard/CreateCategoryButton"

export default async function CategoriesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.role?.includes('admin')) {
    redirect('/dashboard')
  }

  return (
    <div className="space-y-6 p-8">
      <Breadcrumb />
      
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Categories
          </h2>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <CreateCategoryButton />
        </div>
      </div>

      <CategoryList />
    </div>
  )
} 