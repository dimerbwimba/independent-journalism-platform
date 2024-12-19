'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  PhotoIcon,
  UserIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

interface PendingPost {
  id: string
  title: string
  description: string
  image?: string
  createdAt: string
  author: {
    name: string
    image?: string
  }
}

export default function PendingPostsPage() {
  const [posts, setPosts] = useState<PendingPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    const fetchPendingPosts = async () => {
      try {
        const response = await fetch('/api/posts/pending')
        if (!response.ok) throw new Error('Failed to fetch pending posts')
        const data = await response.json()
        setPosts(data.posts)
      } catch (error) {
        console.error('Error fetching pending posts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPendingPosts()
  }, [])

  const handleAction = async (postId: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch(`/api/posts/pending/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })

      if (!response.ok) throw new Error(`Failed to ${action} post`)
      
      // Remove the post from the list after successful action
      setPosts(posts.filter(post => post.id !== postId))
    } catch (error) {
      console.error(`Error ${action}ing post:`, error)
    }
  }

  if (!session?.user?.role?.includes('admin')) {
    redirect('/dashboard')
  }

  if (isLoading) {
    return <LoadingPlaceholder />
  }

  if (posts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">No pending posts</h2>
          <p className="mt-2 text-gray-500">All posts have been reviewed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Pending Posts</h1>
        <p className="mt-1 text-sm text-gray-500">
          Review and approve or reject submitted posts
        </p>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {post.image ? (
                      <Image
                        src={post.image}
                        alt={post.title}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        <PhotoIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <Link
                      href={`/dashboard/posts/single/${post.id}`}
                      className="text-lg font-medium text-gray-900 hover:text-gray-600"
                    >
                      {post.title}
                    </Link>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <UserIcon className="h-4 w-4 mr-1" />
                        {post.author.name}
                      </div>
                      <span>•</span>
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleAction(post.id, 'approve')}
                    className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(post.id, 'reject')}
                    className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    <XCircleIcon className="h-4 w-4 mr-2" />
                    Reject
                  </button>
                </div>
              </div>
              <p className="mt-4 text-gray-500">{post.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LoadingPlaceholder() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      <div className="mb-8">
        <div className="h-8 w-48 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-64 bg-gray-200 rounded" />
      </div>
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-gray-200 rounded-lg" />
                <div className="space-y-2">
                  <div className="h-5 w-48 bg-gray-200 rounded" />
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="h-10 w-24 bg-gray-200 rounded" />
                <div className="h-10 w-24 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="mt-4 h-4 w-3/4 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
} 