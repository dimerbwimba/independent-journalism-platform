import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Link from "next/link"
import { PlusIcon } from "@heroicons/react/24/outline"
import PostsList from "@/components/dashboard/PostsList"
import Breadcrumb from "@/components/dashboard/Breadcrumb"

export default async function PostsPage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="space-y-6 p-8">
      <Breadcrumb />
      
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Posts
          </h2>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Link
            href="/dashboard/posts/create"
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            New Post
          </Link>
        </div>
      </div>

      <PostsList userId={session?.user?.id || ''} />
    </div>
  )
} 