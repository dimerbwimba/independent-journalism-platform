'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  PhotoIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import debounce from 'lodash/debounce'

interface Post {
  id: string
  title: string
  description?: string
  image?: string
  published: boolean
  createdAt: string
  views: number
}

interface PostsListProps {
  searchQuery: string
}

export default function PostsList({ searchQuery }: PostsListProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Debounced fetch function
  const debouncedFetch = useCallback(
    debounce(async (search: string) => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/posts?search=${encodeURIComponent(search)}`)
        if (!response.ok) throw new Error('Failed to fetch posts')
        const data = await response.json()
        setPosts(data.posts)
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setIsLoading(false)
      }
    }, 300),
    []
  )

  useEffect(() => {
    debouncedFetch(searchQuery)
    
    // Cleanup
    return () => {
      debouncedFetch.cancel()
    }
  }, [searchQuery, debouncedFetch])

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete post')
      
      setPosts(posts.filter(post => post.id !== postId))
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  if (isLoading) {
    return <LoadingPlaceholder />
  }

  return (
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
                  <h3 className="text-lg font-medium text-gray-900">
                    {post.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <ClockIcon className="h-4 w-4" />
                      <span>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <EyeIcon className="h-4 w-4" />
                      <span>{post.views} views</span>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      post.published 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard/posts/${post.id}/edit`}
                  className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  <PencilIcon className="h-4 w-4 mr-1" />
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="inline-flex items-center rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                >
                  <TrashIcon className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {posts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No posts found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new post.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/posts/new"
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              New Post
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

function LoadingPlaceholder() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-gray-200 rounded-lg animate-pulse" />
            <div className="space-y-3 flex-1">
              <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 