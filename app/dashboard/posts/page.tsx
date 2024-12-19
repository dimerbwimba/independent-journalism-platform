'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import PostsList from '@/components/dashboard/posts/PostsList'

export default function PostsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: session } = useSession()
  const router = useRouter()

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Search Navbar */}
      <div className="sticky top-12 z-10 bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate">
              Posts
            </h2>
          </div>
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="p-8">
        <PostsList searchQuery={searchQuery} />
      </div>
    </div>
  )
} 