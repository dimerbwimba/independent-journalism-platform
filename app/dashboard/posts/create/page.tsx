import Breadcrumb from "@/components/dashboard/Breadcrumb"
import PostForm from "@/components/dashboard/PostForm"

export default function CreatePostPage() {
  return (
    <div className="space-y-6 p-8">
      <Breadcrumb />
      
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Create New Post
          </h2>
        </div>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <PostForm />
      </div>
    </div>
  )
} 