'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'

interface Category {
  id: string
  name: string
  slug: string
}

interface Post {
  id: string
  title: string
  description?: string
  image?: string
  published: boolean
  createdAt: string
  categories: Category[]
}

export default function PostsList() {
  const session = useSession()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      if (!response.ok) throw new Error('Failed to fetch posts')
      
      const data = await response.json()
      setPosts(data.posts)
    } catch (err) {
      setError('Failed to load posts')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete post')
      
      setPosts(posts.filter(post => post.id !== postId))
      router.refresh()
    } catch (err) {
      console.error(err)
      setError('Failed to delete post')
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-white rounded-lg shadow animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
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
        <PencilIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No posts</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new post.</p>
        <div className="mt-6">
          <Link
            href="/dashboard/posts/create"
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            <PencilIcon className="-ml-0.5 mr-1.5 h-5 w-5" />
            Create Post
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post, index) => (
        <div
          key={post.id}
          className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
        >
          <div className="relative h-48 bg-gray-100">
            {post.image ? (
              <Image
                src={post.image}
                alt={post.title}
                fill
                priority={index === 0}
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <PhotoIcon className="h-12 w-12 text-gray-300" />
              </div>
            )}
            <div className="absolute top-2 right-2">
              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                post.published 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {post.published ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>

          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 truncate">
              {post.title}
            </h3>
            
            {post.description && (
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                {post.description}
              </p>
            )}

            {post.categories.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {post.categories.map(category => (
                  <span
                    key={category.id}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="mt-4 grid grid-cols-2 items-center justify-end gap-2">
              <Link
                href={`/dashboard/posts/${post.id}/view`}
                className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <EyeIcon className="h-4 w-4 mr-1" />
                View
              </Link>
              {session?.data?.user?.role === 'admin' &&<>
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
              </>
              }
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 