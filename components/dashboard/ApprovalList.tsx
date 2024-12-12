'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  EyeIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface Post {
  id: string
  title: string
  description?: string
  author: {
    name: string
    email: string
  }
  createdAt: string
  published: boolean
}

export default function ApprovalList() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPendingPosts()
  }, [])

  const fetchPendingPosts = async () => {
    try {
      const response = await fetch('/api/posts/pending')
      if (!response.ok) throw new Error('Failed to fetch pending posts')
      
      const data = await response.json()
      setPosts(data.posts)
    } catch (err) {
      setError('Failed to load pending posts')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ approved: true })
      })

      if (!response.ok) throw new Error('Failed to approve post')
      
      // Remove the approved post from the list
      setPosts(posts.filter(post => post.id !== postId))
      router.refresh()
    } catch (err) {
      console.error(err)
      setError('Failed to approve post')
    }
  }

  const handleReject = async (postId: string) => {
    if (!window.confirm('Are you sure you want to reject this post?')) return

    try {
      const response = await fetch(`/api/posts/${postId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ approved: false })
      })

      if (!response.ok) throw new Error('Failed to reject post')
      
      // Remove the rejected post from the list
      setPosts(posts.filter(post => post.id !== postId))
      router.refresh()
    } catch (err) {
      console.error(err)
      setError('Failed to reject post')
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-white p-6 rounded-lg shadow">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center bg-white rounded-lg shadow px-4 py-12">
        <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No pending articles</h3>
        <p className="mt-1 text-sm text-gray-500">There are no articles waiting for approval.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white shadow rounded-lg overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  {post.title}
                </h3>
                {post.description && (
                  <p className="mt-1 text-sm text-gray-500">
                    {post.description}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                  <span>By {post.author.name}</span>
                  <span>•</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard/posts/${post.id}/preview`}
                  className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  <EyeIcon className="h-5 w-5 mr-1" />
                  Preview
                </Link>
                <button
                  onClick={() => handleApprove(post.id)}
                  className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                >
                  <CheckCircleIcon className="h-5 w-5 mr-1" />
                  Approve
                </button>
                <button
                  onClick={() => handleReject(post.id)}
                  className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                >
                  <XCircleIcon className="h-5 w-5 mr-1" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 