'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeftIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline'
import PostForm from '@/components/dashboard/PostForm'
import Link from 'next/link'

interface Post {
  id: string
  title: string
  seoTitle?: string
  description?: string
  content: string
  image?: string
  published: boolean
  authorId: string
  faqs: Faq[]
  categories: Category[]
}
interface Faq {
  id: string
  question: string
  answer: string
}
interface Category {
  categoryId:string;
  id: string
  name: string
  slug: string
}

export default function EditPostPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isAdmin = session?.user?.role === 'admin'

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/single/${params?.slug}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch post')
        }

        // Check if the user is the author or an admin
        if (data.post.authorId !== session.user.id && !isAdmin) {
          router.push('/dashboard/posts')
          return
        }

        setPost(data.post)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [session, router, params?.slug, isAdmin])

  if (isLoading) {
    return <LoadingPlaceholder />
  }

  if (error) {
    return <ErrorDisplay error={error} />
  }

  if (!post) {
    return <NotFound />
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/dashboard/posts"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Posts
            </Link>
            <h1 className="mt-2 text-2xl font-bold text-gray-900">Edit Post</h1>
          </div>
        </div>

        {!isAdmin && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <ShieldExclamationIcon className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  As a regular user, you can only edit the content and categories. 
                  Contact an admin to modify other fields.
                </p>
              </div>
            </div>
          </div>
        )}

        <PostForm 
         post={post} 
         isAdminEdit={isAdmin}
        />
      </div>
    </div>
  )
}

function LoadingPlaceholder() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-4 w-24 bg-gray-200 rounded mb-4" />
          <div className="h-8 w-64 bg-gray-200 rounded mb-8" />
          <div className="space-y-6">
            <div className="h-96 bg-white rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}

function ErrorDisplay({ error }: { error: string }) {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <p className="mt-2 text-sm text-red-700">{error}</p>
          <Link
            href="/dashboard/posts"
            className="mt-4 inline-flex items-center text-sm font-medium text-red-700 hover:text-red-600"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Posts
          </Link>
        </div>
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Post not found</h2>
          <p className="mt-2 text-gray-500">
            The post you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to edit it.
          </p>
          <Link
            href="/dashboard/posts"
            className="mt-4 inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-600"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Posts
          </Link>
        </div>
      </div>
    </div>
  )
} 