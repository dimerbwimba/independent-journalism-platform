import { PostsSidebar } from '@/components/dashboard/posts/PostsSidebar'

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-gray-100">
      <PostsSidebar />
      <main className="ml-64">
        {children}
      </main>
    </div>
  )
} 